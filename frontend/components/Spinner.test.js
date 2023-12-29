import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

test('Spinner renders correctly with different props', () => {
  // Test case 1: Spinner is not displayed
  const { container: spinnerOffContainer } = render(<Spinner on={false} />);
  expect(spinnerOffContainer.firstChild).toBeNull();

  // Test case 2: Spinner is displayed
  const { container: spinnerOnContainer } = render(<Spinner on={true} />);
  expect(spinnerOnContainer.firstChild).toBeTruthy();
});