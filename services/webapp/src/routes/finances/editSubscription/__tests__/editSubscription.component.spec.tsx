import userEvent from '@testing-library/user-event';
import { waitFor, screen } from '@testing-library/react';
import { makeContextRenderer, spiedHistory } from '../../../../shared/utils/testUtils';
import { EditSubscription } from '../editSubscription.component';
import { subscriptionFactory, subscriptionPhaseFactory, subscriptionPlanFactory } from '../../../../mocks/factories';
import { SubscriptionPlanName } from '../../../../shared/services/api/subscription/types';
import { subscriptionActions } from '../../../../modules/subscription';
import { snackbarActions } from '../../../../modules/snackbar';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual<NodeModule>('react-redux'),
    useDispatch: () => mockDispatch,
  };
});

const mockMonthlyPlan = subscriptionPlanFactory({
  id: 'plan_monthly',
  product: { name: SubscriptionPlanName.MONTHLY },
});
const mockYearlyPlan = subscriptionPlanFactory({ id: 'plan_yearly', product: { name: SubscriptionPlanName.YEARLY } });

jest.mock('../editSubscription.hooks', () => ({
  useAvailableSubscriptionPlans: () => ({ plans: [mockMonthlyPlan, mockYearlyPlan], isLoading: false }),
}));

const userSubscription = subscriptionFactory({
  phases: [subscriptionPhaseFactory({ item: { price: mockMonthlyPlan } })],
});

describe('EditSubscription: Component', () => {
  const component = () => <EditSubscription />;
  const render = makeContextRenderer(component);

  beforeEach(() => {
    mockDispatch.mockReset();
  });

  describe('plan is changed sucessfully', () => {
    it('should show success message and redirect to my subscription page', async () => {
      mockDispatch.mockResolvedValue({ isError: false, ...userSubscription });

      const { history, pushSpy } = spiedHistory();
      render({}, { router: { history } });

      await userEvent.click(screen.getByText(/monthly/i));
      await userEvent.click(screen.getAllByRole('button', { name: /select/i })[0]);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          subscriptionActions.updateSubscriptionPlan({ price: 'plan_monthly' })
        );
        expect(mockDispatch).toHaveBeenCalledWith(snackbarActions.showMessage('Plan changed successfully'));
        expect(pushSpy).toHaveBeenCalledWith('/en/subscriptions');
      });
    });
  });

  describe('plan fails to update', () => {
    it('should show error message', async () => {
      mockDispatch.mockResolvedValue({
        isError: true,
        nonFieldErrors: [{ code: 'error_code', message: 'error message' }],
      });

      render({});

      await userEvent.click(screen.getByText(/monthly/i));
      await userEvent.click(screen.getAllByRole('button', { name: /select/i })[0]);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          snackbarActions.showMessage('You need first to add a payment method. Go back and set it there')
        );
      });
    });
  });
});