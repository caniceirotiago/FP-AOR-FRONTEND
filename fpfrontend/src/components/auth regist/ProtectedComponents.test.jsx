import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProtectedComponents from './ProtectedComponents';
import useAuthStore from '../../stores/useAuthStore';

jest.mock('../../stores/useAuthStore');

describe('ProtectedComponents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children if user is authenticated', () => {
    useAuthStore.mockReturnValue({ isAuthenticated: true });

    render(
      <ProtectedComponents>
        <div>Protected Content</div>
      </ProtectedComponents>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('does not render children if user is not authenticated', () => {
    useAuthStore.mockReturnValue({ isAuthenticated: false });

    render(
      <ProtectedComponents>
        <div>Protected Content</div>
      </ProtectedComponents>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
