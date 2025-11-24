import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import TimerDisplay from './TimerDisplay';

describe('TimerDisplay', () => {
  it('renders the time correctly', () => {
    render(() => <TimerDisplay minutes={25} seconds={0} />);
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('00')).toBeInTheDocument();
    expect(screen.getByText(':')).toBeInTheDocument();
  });

  it('renders single digit times with padding', () => {
    render(() => <TimerDisplay minutes={5} seconds={9} />);
    expect(screen.getByText('05')).toBeInTheDocument();
    expect(screen.getByText('09')).toBeInTheDocument();
  });
});
