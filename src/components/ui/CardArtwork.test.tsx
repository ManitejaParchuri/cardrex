import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardArtwork } from './CardArtwork';

const renderArtwork = (imageUrl: string | null = '/cards/ari-vale.svg') =>
  render(<CardArtwork name="Ari Vale" rarity="COMMON" imageUrl={imageUrl} />);

describe('CardArtwork', () => {
  it('shows the image after a successful load and removes loading state', () => {
    renderArtwork();
    const image = screen.getByAltText('Artwork for Ari Vale');
    expect(screen.getByRole('status')).toBeInTheDocument();
    fireEvent.load(image);
    expect(image).toHaveClass('opacity-100');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('replaces a failed image with the rarity-themed fallback', () => {
    renderArtwork('/missing.svg');
    fireEvent.error(screen.getByAltText('Artwork for Ari Vale'));
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Common')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(document.querySelector('img')).not.toBeInTheDocument();
  });

  it('resets loading and error state when the image URL changes', () => {
    const { rerender } = renderArtwork('/missing.svg');
    fireEvent.error(screen.getByAltText('Artwork for Ari Vale'));
    expect(document.querySelector('img')).not.toBeInTheDocument();

    rerender(
      <CardArtwork
        name="Ari Vale"
        rarity="COMMON"
        imageUrl="/cards/ari-vale.svg"
      />,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByAltText('Artwork for Ari Vale')).toHaveAttribute(
      'src',
      '/cards/ari-vale.svg',
    );
  });

  it('resolves root-relative artwork from the frontend origin', () => {
    renderArtwork('/cards/ari-vale.svg');
    const image = screen.getByAltText('Artwork for Ari Vale');

    expect(image).toHaveProperty(
      'src',
      `${window.location.origin}/cards/ari-vale.svg`,
    );
    expect(image).not.toHaveProperty(
      'src',
      'http://localhost:3001/cards/ari-vale.svg',
    );
  });

  it.each([null, '', '   '])(
    'safely renders fallback without an image for %p',
    (imageUrl) => {
      renderArtwork(imageUrl);
      expect(
        screen.getByRole('img', { name: 'Artwork for Ari Vale' }),
      ).toBeInTheDocument();
      expect(document.querySelector('img')).not.toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    },
  );
});
