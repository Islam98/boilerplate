import { OperationDescriptor } from 'react-relay/hooks';
import { createMockEnvironment, MockPayloadGenerator, RelayMockEnvironment } from 'relay-test-utils';

import { NotificationTypes } from '../../shared/components/notifications/notifications.types';
import { NotificationType } from '../../shared/services/graphqlApi';
import { composeMockedPaginatedListQueryResult, connectionFromArray, makeId } from '../../tests/utils/fixtures';
import { ExtractNodeType } from '../../shared/utils/graphql';
import { notificationsListContent$data } from '../../shared/components/notifications/notificationsList/__generated__/notificationsListContent.graphql';
import notificationsListQueryGraphql from '../../shared/components/notifications/__generated__/notificationsListQuery.graphql';
import { notificationsListQuery } from '../../shared/components/notifications/notifications.graphql';

import { createFactory } from './factoryCreators';
import { currentUserFactory } from './auth';

export const notificationFactory = createFactory<NotificationType>(() => ({
  id: makeId(32),
  type: NotificationTypes.CRUD_ITEM_CREATED,
  data: {},
  createdAt: new Date().toISOString(),
  readAt: null,
  user: currentUserFactory(),
}));

export const fillNotificationsListQuery = (
  env?: RelayMockEnvironment,
  notifications: Array<Partial<ExtractNodeType<notificationsListContent$data['allNotifications']>>> = [],
  additionalData?: Record<string, any>
) => {
  if (!env) {
    env = createMockEnvironment();
  }
  env.mock.queueOperationResolver((operation: OperationDescriptor) =>
    MockPayloadGenerator.generate(operation, {
      NotificationConnection: () => connectionFromArray(notifications),
    })
  );
  env.mock.queuePendingOperation(notificationsListQueryGraphql, {});

  return composeMockedPaginatedListQueryResult(
    notificationsListQuery,
    'allNotifications',
    'NotificationType',
    {
      data: notifications,
      variables: {
        count: 20,
      },
      additionalData,
    },
    { endCursor: 'test', hasNextPage: false }
  );
};
