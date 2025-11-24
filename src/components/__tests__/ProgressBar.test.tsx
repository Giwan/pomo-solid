import { render } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('calculates width correctly', () => {
    const { container } = render(() => <ProgressBar total={100} current={50} active={false} />);
    const bar = container.querySelector('.progress-bar');
    expect(bar).toHaveStyle({ width: '50%' });
  });

  it('handles zero total to avoid division by zero', () => {
    const { container } = render(() => <ProgressBar total={0} current={0} active={false} />);
    const bar = container.querySelector('.progress-bar');
    expect(bar).toHaveStyle({ width: '0%' });
  });

  it('applies active class when active is true', () => {
    const { container } = render(() => <ProgressBar total={100} current={50} active={true} />);
    const bar = container.querySelector('.progress-bar');
    expect(bar).toHaveClass('active');
  });
});
