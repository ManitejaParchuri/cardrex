import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('runs its click handler', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Claim card</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Claim card' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled while loading', () => {
    render(<Button loading>Opening</Button>);

    expect(screen.getByRole('button', { name: 'Opening' })).toBeDisabled();
  });
});
