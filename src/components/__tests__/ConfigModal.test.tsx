import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import ConfigModal from '../ConfigModal';

describe('ConfigModal', () => {
  const defaultProps = {
    durations: { work: 25, break: 5, longBreak: 15 },
    audioEnabled: true,
    flashWarningSeconds: 5,
    onCancel: vi.fn(),
    onSave: vi.fn(),
  };

  it('renders the audio checkbox with correct initial state', () => {
    render(() => <ConfigModal {...defaultProps} />);
    
    const checkbox = screen.getByLabelText(/play sound when timer ends/i) as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it('renders unchecked audio checkbox when prop is false', () => {
    render(() => <ConfigModal {...defaultProps} audioEnabled={false} />);
    
    const checkbox = screen.getByLabelText(/play sound when timer ends/i) as HTMLInputElement;
    expect(checkbox).not.toBeChecked();
  });

  it('calls onSave with updated audio setting when form is submitted', () => {
    const onSave = vi.fn();
    render(() => <ConfigModal {...defaultProps} onSave={onSave} />);
    
    const checkbox = screen.getByLabelText(/play sound when timer ends/i);
    
    // Uncheck it
    fireEvent.click(checkbox);
    
    // Submit form
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ work: 25 }),
      false, // audioEnabled should be false
      5 // flashWarningSeconds
    );
  });
});
