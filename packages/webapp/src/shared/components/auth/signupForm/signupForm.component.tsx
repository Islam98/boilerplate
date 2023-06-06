import { Button, Link } from '@sb/webapp-core/components/buttons';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@sb/webapp-core/components/forms';
import { useGenerateLocalePath } from '@sb/webapp-core/hooks';
import { size } from '@sb/webapp-core/theme';
import { FormattedMessage, useIntl } from 'react-intl';

import { RoutesConfig } from '../../../../app/config/routes';
import { emailPattern } from '../../../constants';
import { useSignupForm } from './signupForm.hooks';
import { Checkbox, Container, ErrorMessage } from './signupForm.styles';

export const SignupForm = () => {
  const intl = useIntl();
  const generateLocalePath = useGenerateLocalePath();
  const {
    form: {
      register,
      formState: { errors },
    },
    form,
    hasGenericErrorOnly,
    genericError,
    loading,
    handleSignup,
  } = useSignupForm();

  return (
    <Form {...form}>
      <form className="flex flex-col" onSubmit={handleSignup}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormControl>
                <Input
                  {...field}
                  {...register('email', {
                    required: {
                      value: true,
                      message: intl.formatMessage({
                        defaultMessage: 'Email is required',
                        id: 'Auth / Signup / Email required',
                      }),
                    },
                    pattern: {
                      value: emailPattern,
                      message: intl.formatMessage({
                        defaultMessage: 'Email format is invalid',
                        id: 'Auth / Signup / Email format error',
                      }),
                    },
                  })}
                  type="email"
                  required
                  label={intl.formatMessage({
                    defaultMessage: 'Email',
                    id: 'Auth / Signup / Email label',
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: 'Write your email here...',
                    id: 'Auth / Signup / Email placeholder',
                  })}
                  error={errors.email?.message}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-1">
              <FormControl>
                <Input
                  {...field}
                  {...register('password', {
                    required: {
                      value: true,
                      message: intl.formatMessage({
                        defaultMessage: 'Password is required',
                        id: 'Auth / Signup / Password required',
                      }),
                    },
                    minLength: {
                      value: 8,
                      message: intl.formatMessage({
                        defaultMessage: 'Password is too short. It must contain at least 8 characters.',
                        id: 'Auth / Signup / Password too short',
                      }),
                    },
                  })}
                  required
                  type="password"
                  label={intl.formatMessage({
                    defaultMessage: 'Password',
                    id: 'Auth / Signup / Password label',
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: 'Minimum 8 characters',
                    id: 'Auth / Signup / Password placeholder',
                  })}
                  error={errors.password?.message}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  {...register('acceptTerms', {
                    required: {
                      value: true,
                      message: intl.formatMessage({
                        defaultMessage: 'You need to accept terms and conditions',
                        id: 'Auth / Signup / Terms and conditions required',
                      }),
                    },
                  })}
                  label={intl.formatMessage(
                    {
                      defaultMessage: 'You must accept our {termsLink} and {policyLink}.',
                      id: 'Auth / Signup / Accept terms label',
                    },
                    {
                      termsLink: (
                        <Link to={generateLocalePath(RoutesConfig.termsAndConditions)}>
                          <FormattedMessage
                            id="Auth / Signup / Accept checkbox / T&C link"
                            defaultMessage="Terms of Use"
                          />
                        </Link>
                      ),
                      policyLink: (
                        <Link to={generateLocalePath(RoutesConfig.privacyPolicy)}>
                          <FormattedMessage
                            id="Auth / Signup / Accept checkbox / Privacy policy link"
                            defaultMessage="Privacy Policy"
                          />
                        </Link>
                      ),
                    }
                  )}
                  error={errors.acceptTerms?.message}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {hasGenericErrorOnly && <ErrorMessage>{genericError}</ErrorMessage>}

        <Button type="submit" disabled={loading} className="mt-2">
          <FormattedMessage defaultMessage="Sign up" id="Auth / signup button" />
        </Button>
      </form>
    </Form>
  );
};
