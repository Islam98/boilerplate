import { actionCreator } from '../helpers/actionCreator';
import { HistoryListApiResponseData } from '../../shared/services/api/stripe/history/types';
import { createActionRoutine } from '../../shared/utils/reduxSagaPromise';
import { FetchStripePaymentMethodsSuccessPayload } from './stripe.types';

const { createPromiseAction } = actionCreator('STRIPE');

export const fetchStripePaymentMethods = createPromiseAction<void, FetchStripePaymentMethodsSuccessPayload>(
  'FETCH_STRIPE_PAYMENT_METHODS'
);

export const fetchStripeTransactionHistory = createActionRoutine<void, HistoryListApiResponseData, unknown>(
  'FETCH_STRIPE_TRANSACTION_HISTORY'
);

export const setDefaultStripePaymentMethod = createPromiseAction<string, void>('SET_DEFAULT_STRIPE_PAYMENT_METHOD');

export const deleteStripePaymentMethod = createPromiseAction<string, void>('DELETE_STRIPE_PAYMENT_METHOD');