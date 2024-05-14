import { NotificationTypes } from '@sb/webapp-notifications';

type GetEventsProps = {
  reloadCommonQuery: () => Promise<void>;
};

const getNotificationEvents = ({ reloadCommonQuery }: GetEventsProps) => ({
  [NotificationTypes.TENANT_INVITATION_CREATED]: reloadCommonQuery,
});
export default getNotificationEvents;
