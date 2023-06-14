import { useMutation } from '@apollo/client';
import editIcon from '@iconify-icons/ion/pencil-sharp';
import deleteIcon from '@iconify-icons/ion/trash-outline';
import { FragmentType, getFragmentData } from '@sb/webapp-api-client/graphql';
import { Button, ButtonVariant, Link } from '@sb/webapp-core/components/buttons';
import { Icon } from '@sb/webapp-core/components/icons';
import { useGenerateLocalePath, useMediaQuery } from '@sb/webapp-core/hooks';
import { trackEvent } from '@sb/webapp-core/services/analytics';
import { media } from '@sb/webapp-core/theme';
import { MouseEvent } from 'react';
import { FormattedMessage } from 'react-intl';

import { RoutesConfig } from '../../../../config/routes';
import { crudDemoItemListItemDeleteMutation, crudDemoItemListItemFragment } from './crudDemoItemListItem.graphql';
import { CrudDropdownMenu } from './crudDropdownMenu';

export type CrudDemoItemListItemProps = {
  item: FragmentType<typeof crudDemoItemListItemFragment>;
};

export const CrudDemoItemListItem = ({ item }: CrudDemoItemListItemProps) => {
  const generateLocalePath = useGenerateLocalePath();
  const { matches: isDesktop } = useMediaQuery({ above: media.Breakpoint.TABLET });
  const [commitDeleteMutation, { loading }] = useMutation(crudDemoItemListItemDeleteMutation, {
    update(cache, { data }) {
      data?.deleteCrudDemoItem?.deletedIds?.forEach((deletedId) => {
        const normalizedId = cache.identify({ id: deletedId, __typename: 'CrudDemoItemType' });
        cache.evict({ id: normalizedId });
      });
      cache.gc();
    },
    onCompleted: (data) => {
      const ids = data?.deleteCrudDemoItem?.deletedIds;
      trackEvent('crud', 'delete', ids?.join(', '));
    },
  });

  const data = getFragmentData(crudDemoItemListItemFragment, item);

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    commitDeleteMutation({
      variables: {
        input: { id: data.id },
      },
    });
  };

  const renderInlineButtons = () => (
    <div className="flex ml-3 shrink-0 [&>*]:mr-4 [&>*:last-child]:mr-0">
      <Link
        variant={ButtonVariant.GHOST}
        className="flex h-10 w-full items-center justify-between rounded-md border 
        border-input bg-transparent px-3 py-2 text-sm ring-offset-background 
        placeholder:text-muted-foreground focus:outline-none focus:ring-2 
        focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed 
        disabled:opacity-50 group-active:border-blue-500"
        to={generateLocalePath(RoutesConfig.crudDemoItem.edit, { id: data.id })}
        icon={<Icon size={14} icon={editIcon} />}
      >
        <FormattedMessage id="CrudDemoItem list / Edit link" defaultMessage="Edit" />
      </Link>
      <Button
        variant={ButtonVariant.GHOST}
        onClick={handleDelete}
        disabled={loading}
        icon={<Icon size={14} icon={deleteIcon} />}
        className="flex h-10 w-full items-center justify-between rounded-md border 
        border-input bg-transparent px-3 py-2 text-sm ring-offset-background 
        placeholder:text-muted-foreground focus:outline-none focus:ring-2 
        focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed 
        disabled:opacity-50 group-active:border-blue-500"
      >
        <FormattedMessage id="CrudDemoItem list / Delete button" defaultMessage="Delete" />
      </Button>
    </div>
  );

  const renderButtonsMenu = () => (
    <CrudDropdownMenu className="w-40" itemId={data.id} handleDelete={handleDelete} loading={loading} />
  );

  return (
    <li>
      <div
        tabIndex={0}
        className="group flex items-center justify-between w-full min-w-15 p-4 transition hover:bg-sky-50 focus:outline-none active:text-blue-500 active:bg-blue-100"
      >
        <Link
          className="border-input"
          variant={ButtonVariant.GHOST}
          to={generateLocalePath(RoutesConfig.crudDemoItem.details, { id: data.id })}
        >
          <p className="text-base">{data.name}</p>
        </Link>
        {isDesktop ? renderInlineButtons() : renderButtonsMenu()}
      </div>
    </li>
  );
};
