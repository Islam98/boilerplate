import { QueryHookOptions, TypedDocumentNode, useQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { Exact, InputMaybe } from '@sb/webapp-api-client/graphql';

type CursorsInput = Exact<{
  first?: InputMaybe<number> | undefined;
  after?: InputMaybe<string> | undefined;
  last?: InputMaybe<number> | undefined;
  before?: InputMaybe<string> | undefined;
}>;

type ExtractGeneric<Type> = Type extends TypedDocumentNode<infer QueryData> ? QueryData : never;

export const usePaginatedQuery = <T extends TypedDocumentNode>(
  query: T,
  options: {
    hookOptions?: QueryHookOptions<ExtractGeneric<T>, CursorsInput>;
    dataKey: keyof ExtractGeneric<T>;
  }
) => {
  const [cachedCursors, setCachedCursors] = useState<Array<string>>([]);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const { data, loading, fetchMore } = useQuery<ExtractGeneric<T>, CursorsInput>(query, options.hookOptions);

  useEffect(() => {
    setHasPrevious(cachedCursors.length > 0);
    setHasNext(data?.[options.dataKey]?.pageInfo.hasNextPage ?? false);
  }, [data, cachedCursors.length, options.dataKey]);

  const loadNext = useCallback(() => {
    if (data) {
      const queryData = data[options.dataKey];
      if (queryData) {
        const { endCursor } = queryData.pageInfo;
        if (endCursor) {
          setCachedCursors((prev) => [...prev, endCursor]);
          fetchMore({
            variables: {
              after: endCursor,
            },
            updateQuery: (_, { fetchMoreResult }) => {
              return fetchMoreResult;
            },
          });
        }
      }
    }
  }, [data, setCachedCursors, fetchMore, options.dataKey]);

  const loadPrevious = useCallback(() => {
    const newCachedCursors = cachedCursors.slice(0, -1);
    setCachedCursors(newCachedCursors);
    const lastEndCursor = newCachedCursors.length > 0 ? newCachedCursors[newCachedCursors.length - 1] : undefined;

    fetchMore({
      variables: {
        after: lastEndCursor,
      },
      updateQuery: (_, { fetchMoreResult }) => {
        return fetchMoreResult;
      },
    });
  }, [cachedCursors, setCachedCursors, fetchMore]);

  return { data, loading, hasNext, hasPrevious, loadNext, loadPrevious };
};