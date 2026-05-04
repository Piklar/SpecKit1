import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskItem from './TaskItem';

describe('TaskItem Component', () => {
  const mockTask = {
    _id: '1',
    title: 'Test Task',
    completionStatus: false,
    dueTime: '10:00 AM',
    description: 'Test description',
  };

  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onToggle: vi.fn(),
  };

  it('renders without crashing with full task object', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('🕒 10:00 AM')).toBeInTheDocument();
  });

  it('safely renders a task with missing properties (US4 calendar bug fix)', () => {
    const incompleteTask = {
      _id: '2',
      // missing title, dueTime, description, completionStatus
    };
    render(<TaskItem task={incompleteTask} {...mockHandlers} />);
    
    // Should fallback to 'Untitled Task'
    expect(screen.getByText('Untitled Task')).toBeInTheDocument();
  });

  it('does not crash if task is undefined', () => {
    const { container } = render(<TaskItem task={undefined} {...mockHandlers} />);
    expect(container).toBeEmptyDOMElement();
  });
});
