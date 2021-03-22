import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { StripeElementChangeEvent } from '@stripe/stripe-js';
import { Controller } from 'react-hook-form';
import { StripeCardForm } from '../stripeCardForm';
import { useStripePaymentMethods } from '../stripePayment.hooks';
import {
  PaymentMethodApiFormControls,
  StripePaymentMethodChangeEvent,
  StripePaymentMethodSelection,
  StripePaymentMethodSelectionType,
} from './stripePaymentMethodSelector.types';
import {
  CardElementContainer,
  Container,
  PaymentMethodList,
  PaymentMethodListItem,
  Heading,
  ExistingPaymentMethodItem,
  NewPaymentMethodItem,
  CardBrand,
  ErrorMessage,
} from './stripePaymentMethodSelector.styles';

export interface StripePaymentMethodSelectorProps {
  formControls: Pick<PaymentMethodApiFormControls, 'control' | 'genericError' | 'errors'>;
}

export const StripePaymentMethodSelector = ({ formControls }: StripePaymentMethodSelectorProps) => {
  const intl = useIntl();
  const { isLoading, paymentMethods } = useStripePaymentMethods();
  const { control, errors, genericError } = formControls;

  return isLoading ? null : (
    <Controller
      name="paymentMethod"
      control={control}
      defaultValue={{
        type:
          paymentMethods?.length > 0
            ? StripePaymentMethodSelectionType.SAVED_PAYMENT_METHOD
            : StripePaymentMethodSelectionType.NEW_CARD,
        data: paymentMethods?.[0] ?? null,
      }}
      rules={{
        required: true,
        validate: (value: StripePaymentMethodSelection) => {
          if (value.type === StripePaymentMethodSelectionType.NEW_CARD) {
            const anyFieldMissing = Object.values(value.data?.cardMissingFields ?? {}).some((isMissing) => isMissing);
            const fieldError = Object.values(value.data?.cardErrors ?? {})?.filter((error) => !!error)?.[0];

            if (fieldError) {
              return fieldError.message;
            }

            if (value.data === null || anyFieldMissing) {
              return intl.formatMessage({
                defaultMessage: 'Payment method is required',
                description: 'Stripe / Payment / Method required',
              });
            }

            if (!value.data.name) {
              return intl.formatMessage({
                defaultMessage: 'Card name is required',
                description: 'Stripe / Payment / Card name required',
              });
            }
          }

          return true;
        },
      }}
      render={({ onChange, value }) => {
        const handleChange = (e: StripePaymentMethodChangeEvent) => {
          if (e.type === StripePaymentMethodSelectionType.NEW_CARD) {
            const data =
              value.type === StripePaymentMethodSelectionType.SAVED_PAYMENT_METHOD
                ? {
                    cardMissingFields: {
                      cardNumber: true,
                      cardExpiry: true,
                      cardCvc: true,
                    },
                  }
                : value.data;

            if (e.data?.elementType === 'name') {
              onChange({ type: e.type, data: { ...data, name: e.data.value } });
            } else {
              const stripeFieldData = e.data as StripeElementChangeEvent;
              const fieldName = e.data?.elementType as string;

              const cardData = {
                cardErrors: { ...value.data.cardErrors, [fieldName]: stripeFieldData?.error },
                cardMissingFields: {
                  ...data.cardMissingFields,
                  [fieldName]: !!stripeFieldData?.empty,
                },
              };
              onChange({ type: e.type, data: { ...data, ...(fieldName ? cardData : {}) } });
            }
          } else {
            onChange(e);
          }
        };

        return (
          <Container>
            <Heading>
              <FormattedMessage
                defaultMessage="Select payment method"
                description="Stripe / payment method selector / label"
              />
            </Heading>

            <PaymentMethodList>
              {paymentMethods.map((paymentMethod) => {
                const isSelected =
                  value?.type === StripePaymentMethodSelectionType.SAVED_PAYMENT_METHOD &&
                  paymentMethod.id === value.data.id;

                return (
                  <PaymentMethodListItem key={paymentMethod.id}>
                    <ExistingPaymentMethodItem
                      checked={isSelected}
                      value={paymentMethod.id}
                      onChange={() => {
                        handleChange({
                          type: StripePaymentMethodSelectionType.SAVED_PAYMENT_METHOD,
                          data: paymentMethod,
                        });
                      }}
                    >
                      {paymentMethod.billingDetails?.name && `${paymentMethod.billingDetails?.name} `}
                      <CardBrand>{paymentMethod.card.brand}</CardBrand> **** {paymentMethod.card.last4}
                    </ExistingPaymentMethodItem>
                  </PaymentMethodListItem>
                );
              })}

              <PaymentMethodListItem>
                <NewPaymentMethodItem
                  isSelected={value?.type === StripePaymentMethodSelectionType.NEW_CARD}
                  onClick={() => {
                    handleChange({
                      type: StripePaymentMethodSelectionType.NEW_CARD,
                      data: null,
                    });
                  }}
                >
                  <FormattedMessage
                    defaultMessage="Add a new card"
                    description="Stripe / payment method selector / new card option"
                  />
                </NewPaymentMethodItem>
              </PaymentMethodListItem>
            </PaymentMethodList>

            {value?.type === StripePaymentMethodSelectionType.NEW_CARD && (
              <CardElementContainer>
                <StripeCardForm onChange={handleChange} />
              </CardElementContainer>
            )}

            <ErrorMessage>{errors.paymentMethod?.message}</ErrorMessage>
            {Object.keys(errors).length === 0 && genericError && <ErrorMessage>{genericError}</ErrorMessage>}
          </Container>
        );
      }}
    />
  );
};