import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtecterRoute';
import useAuthStore from '../../stores/useAuthStore';
import userService from '../../services/userService';
import { act } from 'react-dom/test-utils';

jest.mock('../../stores/useAuthStore');
jest.mock('../../services/userService');

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children if user is authenticated', async () => {
    useAuthStore.mockReturnValue({ isAuthenticated: true });
    userService.checkSession.mockResolvedValue({});

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to home if user is not authenticated', async () => {
    useAuthStore.mockReturnValue({ isAuthenticated: false });
    userService.checkSession.mockResolvedValue({});

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
