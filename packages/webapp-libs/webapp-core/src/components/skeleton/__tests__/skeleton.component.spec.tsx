import { screen } from '@testing-library/react';

import { Skeleton } from '../';
import { render } from '../../../tests/utils/rendering';

describe('Skeleton', () => {
  it('Should render rounded skeleton', async () => {
    render(<Skeleton data-testid="testid" className="h-12 w-12 rounded-full" />);

    expect(screen.getByTestId('testid').className).toContain('h-12 w-12 rounded-full');
  });
});
