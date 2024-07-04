/*import React from 'react';
import { render, fireEvent, screen , waitFor} from '@testing-library/react';
import Task from '../components/SecundaryComponents/MainTaskViewer/TertiaryComponents/Task.jsx';
import taskService from '../services/taskService.jsx';
import toastMessageStore from '../stores/toastMessageStore.jsx';
import DialogModalStore from '../stores/DialogModalStore.jsx';
import useDeviceStore from '../stores/useDeviceStore.jsx';
import { wait } from '@testing-library/user-event/dist/utils/index.js';
import { BrowserRouter as Router } from 'react-router-dom';
import "@testing-library/jest-dom";



jest.mock('../services/taskService');
jest.mock('../stores/toastMessageStore');
jest.mock('../stores/DialogModalStore', () => ({
  __esModule: true,
  default: {
    getState: () => ({
      setDialogMessage: jest.fn(),
      setIsDialogOpen: jest.fn(),
      setOnConfirm: jest.fn()
    })
  }
}));

jest.mock('../stores/useDeviceStore.jsx', () => ({
  __esModule: true,
  default: () => ({
    isTouch: false  
  })
}));

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Description here',
  status: 100, 
  priority: 2,
  category_type: 'No_Category', 
};

describe('Task Component - Normal Mode', () => {
  it('renders move buttons and delete button in normal mode when hovered', async () => {
    const {  getByAltText } = render(<Router><Task task={mockTask} mode="normal"/></Router>);
    const deleteButton = getByAltText("Delete");
    expect(deleteButton).toBeInTheDocument(); 
    fireEvent.click(deleteButton);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
  it('renders move buttons and delete button in normal mode when hovered', async () => {
    const { getByText, getByAltText } = render(<Router><Task task={mockTask} mode="normal"/></Router>);
    const element = screen.queryByText('<'); 
    expect(element).toBeInTheDocument();
    expect(element).toHaveStyle('visibility: visible'); 
  });
});


*/


  

