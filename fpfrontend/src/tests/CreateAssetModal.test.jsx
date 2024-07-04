/*import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TaskAction from '../components/SecundaryComponents/MainTaskViewer/TertiaryComponents/QuaternaryComponents/TaskAction';
import '@testing-library/jest-dom';




describe('TaskAction Component', () => {
    it('shows correct buttons in normal mode for todo column', () => {
      const mockOnDelete = jest.fn();
      const mockOnMoveRight = jest.fn();
      const { getByText } = render(
        <TaskAction 
          column="todo" 
          isVisible={true} 
          mode="normal" 
          onDelete={mockOnDelete} 
          onMoveRight={mockOnMoveRight} 
          canDelete={true}
        />
      );
        expect(getByText(">")).toBeInTheDocument();
         expect(() => getByText("<")).toThrow();
    });
    it('shows correct buttons in normal mode for doing column', () => {
        const mockOnDelete = jest.fn();
        const mockOnMoveRight = jest.fn();
        const mockOnMoveLeft = jest.fn();
        const { getByText } = render(
            <TaskAction 
            column="doing" 
            isVisible={true} 
            mode="normal" 
            onDelete={mockOnDelete} 
            onMoveRight={mockOnMoveRight} 
            onMoveLeft={mockOnMoveLeft} 
            canDelete={true}
            />
        );
        expect(getByText(">")).toBeInTheDocument();
        expect(getByText("<")).toBeInTheDocument();
        });
    it('shows correct buttons in normal mode for done column', () => {
        const mockOnDelete = jest.fn();
        const mockOnMoveLeft = jest.fn();
        const { getByText } = render(
            <TaskAction 
            column="done" 
            isVisible={true} 
            mode="normal" 
            onDelete={mockOnDelete} 
            onMoveLeft={mockOnMoveLeft} 
            canDelete={true}
            />
        );
        expect(() => getByText(">")).toThrow();
        expect(getByText("<")).toBeInTheDocument();
        }
    );
  
    it('shows delete button when canDelete is true', () => {
      const mockOnDelete = jest.fn();
      const { getByAltText } = render(
        <TaskAction 
          column="done" 
          isVisible={true} 
          mode="normal" 
          onDelete={mockOnDelete} 
          canDelete={true}
        />
      );
  
      expect(getByAltText("Delete")).toBeInTheDocument();
    });
    it('shows recycle button in deleted mode', () => {
        const mockOnDelete = jest.fn();
        const mockOnRecycle = jest.fn();
        const { getByAltText } = render(
          <TaskAction 
            column="done" 
            isVisible={true} 
            mode="deleted" 
            onDelete={mockOnDelete} 
            onRecycle={mockOnRecycle} 
            canDelete={true}
          />
        );

        expect(getByAltText("Recycle")).toBeInTheDocument();
      }
    );
  });
  */