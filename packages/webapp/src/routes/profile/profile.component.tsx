import { Separator } from '@sb/webapp-core/components/separator';
import { H2, H3, Paragraph, Small } from '@sb/webapp-core/components/typography';
import { FormattedMessage } from 'react-intl';

import { AvatarForm } from '../../shared/components/auth/avatarForm';
import { ChangePasswordForm } from '../../shared/components/auth/changePasswordForm';
import { EditProfileForm } from '../../shared/components/auth/editProfileForm';
import { TwoFactorAuthForm } from '../../shared/components/auth/twoFactorAuthForm';
import { useAuth } from '../../shared/hooks';

export const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-8 px-4 py-6 md:mx-0 md:max-w-none md:items-start">
      <div>
        <H2 className="w-full text-left">
          <FormattedMessage defaultMessage="User profile" id="Auth / Profile details / Header" />
        </H2>
        <Small className="text-muted-foreground">
          <FormattedMessage
            defaultMessage="Here you can find more information about your account and edit it"
            id="Auth / Profile details / Label"
          />
        </Small>
      </div>
      <Separator orientation="horizontal" />

      <div className="flex flex-row gap-3">
        <AvatarForm />

        <div>
          <Paragraph>
            <FormattedMessage
              defaultMessage="Name: {firstName} {lastName}"
              id="Auth / Profile details / Name label"
              values={{ firstName: currentUser?.firstName, lastName: currentUser?.lastName }}
            />
          </Paragraph>

          <Paragraph notFirstChildMargin={false}>
            <FormattedMessage
              defaultMessage="Email: {email}"
              id="Auth / Profile details / Email label"
              values={{ email: currentUser?.email }}
            />
          </Paragraph>

          <Paragraph notFirstChildMargin={false}>
            <FormattedMessage
              defaultMessage="Roles: {roles}"
              id="Auth / Profile details / Roles label"
              values={{ roles: currentUser?.roles?.join(',') }}
            />
          </Paragraph>
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-6">
        <div>
          <H3 className="w-full text-left">
            <FormattedMessage defaultMessage="Personal data" id="Auth / Profile details / Personal data header" />
          </H3>
          <Small className="text-muted-foreground">
            <FormattedMessage
              defaultMessage="Update your account details"
              id="Auth / Profile details / Personal data label"
            />
          </Small>
        </div>
        <Separator orientation="horizontal" />
        <EditProfileForm />
      </div>

      <div className="flex w-full flex-col gap-y-6">
        <div>
          <H3 className="w-full text-left">
            <FormattedMessage defaultMessage="Change password" id="Auth / Profile details / Change password header" />
          </H3>
          <Small className="text-muted-foreground">
            <FormattedMessage
              defaultMessage="Update your password"
              id="Auth / Profile details / Change password label"
            />
          </Small>
        </div>
        <Separator orientation="horizontal" />
        <ChangePasswordForm />
      </div>

      <div className="flex w-full flex-col gap-y-6">
        <div>
          <H3 className="w-full text-left">
            <FormattedMessage
              defaultMessage="Two-factor Authentication"
              id="Auth / Profile details / Two-factor Authentication header"
            />
          </H3>
          <Small className="text-muted-foreground">
            <FormattedMessage
              defaultMessage="Enable 2FA on your account"
              id="Auth / Profile details / Two-factor Authentication label"
            />
          </Small>
        </div>
        <Separator orientation="horizontal" />
        <TwoFactorAuthForm isEnabled={currentUser?.otpEnabled} />
      </div>
    </div>
  );
};
