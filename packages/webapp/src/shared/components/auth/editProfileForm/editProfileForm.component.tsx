import { Button } from '@sb/webapp-core/components/buttons';
import { Input } from '@sb/webapp-core/components/forms';
import { Small } from '@sb/webapp-core/components/typography';
import { cn } from '@sb/webapp-core/lib/utils';
import { FormattedMessage, useIntl } from 'react-intl';

import { FIRST_NAME_MAX_LENGTH, LAST_NAME_MAX_LENGTH } from './editProfileForm.constants';
import { useEditProfileForm } from './editProfileForm.hooks';

export const EditProfileForm = () => {
  const intl = useIntl();

  const {
    form: {
      formState: { errors },
      register,
    },
    genericError,
    hasGenericErrorOnly,
    loading,
    handleUpdate,
  } = useEditProfileForm();

  return (
    <div className="w-full">
      <form
        noValidate
        onSubmit={handleUpdate}
        className={cn(
          'flex max-w-xs flex-row flex-wrap items-end justify-center gap-x-8 gap-y-4 md:max-w-full md:justify-start'
        )}
      >
        <Input
          {...register('firstName', {
            maxLength: {
              value: FIRST_NAME_MAX_LENGTH,
              message: intl.formatMessage({
                defaultMessage: 'First name is too long',
                id: 'Auth / Update profile/ First name max length error',
              }),
            },
          })}
          label={intl.formatMessage({
            defaultMessage: 'First name',
            id: 'Auth / Update profile / First name label',
          })}
          error={errors.firstName?.message}
        />

        <Input
          {...register('lastName', {
            maxLength: {
              value: LAST_NAME_MAX_LENGTH,
              message: intl.formatMessage({
                defaultMessage: 'Last name is too long',
                id: 'Auth / Update profile/ Last name max length error',
              }),
            },
          })}
          label={intl.formatMessage({
            defaultMessage: 'Last name',
            id: 'Auth / Update profile / Last name label',
          })}
          error={errors.lastName?.message}
        />

        {hasGenericErrorOnly ? <Small className="text-red-500">{genericError}</Small> : null}

        <Button type="submit" disabled={loading} className="w-full min-w-[200px] md:w-fit">
          <FormattedMessage defaultMessage="Update personal data" id="Auth / Update profile/ Submit button" />
        </Button>
      </form>
    </div>
  );
};
