import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CardShelf } from './CardShelf';

describe('CardShelf', () => {
  it('describes each undiscovered card slot', () => {
    render(<CardShelf />);

    expect(
      screen.getByRole('heading', { name: 'Origins: First Light' }),
    ).toBeVisible();
    expect(screen.getAllByText(/Undiscovered card slot/)).toHaveLength(4);
  });
});
