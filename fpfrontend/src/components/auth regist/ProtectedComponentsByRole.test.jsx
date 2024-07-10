import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProtectedComponentsByRole from './ProtectedComponentsByRole';

describe('ProtectedComponentsByRole', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children if roleId is 1', () => {
    localStorage.setItem('role', '1');

    render(
      <ProtectedComponentsByRole>
        <div>Protected Content</div>
      </ProtectedComponentsByRole>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('does not render children if roleId is not 1', () => {
    localStorage.setItem('role', '2');

    render(
      <ProtectedComponentsByRole>
        <div>Protected Content</div>
      </ProtectedComponentsByRole>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  afterEach(() => {
    localStorage.removeItem('role');
  });
});
