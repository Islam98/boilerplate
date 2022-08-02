import { screen } from '@testing-library/react';
import { makeContextRenderer } from '../../../shared/utils/testUtils';
import { Profile } from '../profile.component';
import { userProfileFactory } from '../../../mocks/factories';
import { Role } from '../../../modules/auth/auth.types';

const profile = userProfileFactory({
  firstName: 'Jack',
  lastName: 'White',
  email: 'jack.white@mail.com',
  roles: [Role.ADMIN, Role.USER],
});

describe('Profile: Component', () => {
  const component = () => <Profile />;

  const render = makeContextRenderer(component, {
    store: (state) => {
      state.auth.profile = profile;
    },
  });

  it('should display profile data', () => {
    render();
    expect(screen.getByDisplayValue('Jack')).toBeInTheDocument();
    expect(screen.getByDisplayValue('White')).toBeInTheDocument();
    expect(screen.getByText(/jack.white@mail.com/gi)).toBeInTheDocument();
    expect(screen.getByText(/admin,user/gi)).toBeInTheDocument();
  });
});