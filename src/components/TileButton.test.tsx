import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import TileButton from './TileButton';

describe('TileButton', () => {
  it('renders with label and icon', () => {
    render(() => (
      <TileButton
        icon={<span>Icon</span>}
        label="Test Button"
        intent="neutral"
        variant="action"
        onClick={() => {}}
      />
    ));
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(() => (
      <TileButton
        icon={<span>Icon</span>}
        label="Click Me"
        intent="neutral"
        variant="action"
        onClick={handleClick}
      />
    ));
    
    fireEvent.click(screen.getByRole('button', { name: /Click Me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies active class when active prop is true', () => {
    render(() => (
      <TileButton
        icon={<span>Icon</span>}
        label="Active Button"
        intent="neutral"
        variant="mode"
        active={true}
        onClick={() => {}}
      />
    ));
    
    expect(screen.getByRole('button')).toHaveClass('active');
  });
});
