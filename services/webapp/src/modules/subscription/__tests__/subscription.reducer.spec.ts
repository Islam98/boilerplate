import { reducer, INITIAL_STATE as defaultState } from '../subscription.reducer';

describe('Subscription: reducer', () => {
  it('should return initial state', () => {
    const action = { type: 'unknown-action' };
    const resultState = reducer(undefined, action);
    expect(resultState).toEqual(defaultState);
  });

  it('should return state on unknown action', () => {
    const action = { type: 'unknown-action' };
    const resultState = reducer(defaultState, action);
    expect(resultState).toEqual(defaultState);
  });
});
