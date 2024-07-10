
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ListUser from '../components/reactSelect/listItems/ListUser';
import { roleMapping } from '../utils/constants/constants';

const mockHandleChangeUserRole = jest.fn();
const user = {
  id: 1,
  username: 'testuser',
  photo: 'photo.jpg',
  role: 'ADMIN',
};

describe('ListUser Component', () => {
  beforeEach(() => {
    render(<ListUser user={user} handleChangeUserRole={mockHandleChangeUserRole} />);
  });

  it('renders the user information correctly', () => {
    expect(screen.getByAltText('user')).toHaveAttribute('src', user.photo);
    expect(screen.getByText(user.username)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.role)).toBeInTheDocument();
  });

  it('calls handleChangeUserRole with correct arguments when role is changed', () => {
    fireEvent.change(screen.getByDisplayValue(user.role), { target: { value: 'STANDARD_USER' } });
    expect(mockHandleChangeUserRole).toHaveBeenCalledWith(user.id, roleMapping['STANDARD_USER']);
  });
});