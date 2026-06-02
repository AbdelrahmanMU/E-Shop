import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { type ReactNode } from 'react';
import i18n from '@/lib/i18n';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/mock/data';
import type { Product } from '@/types/domain';

const olive = MOCK_CATEGORIES.find((c) => c.id === 'olive');
const p1 = MOCK_PRODUCTS.find((p) => p.id === 'p1');
const soldOut = MOCK_PRODUCTS.find((p) => p.id === 'p12');

if (!olive || !p1 || !soldOut) {
  throw new Error('Test fixtures missing — mock data changed?');
}

function withProviders(node: ReactNode) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{node}</MemoryRouter>
    </I18nextProvider>
  );
}

describe('<ProductCard>', () => {
  afterEach(() => cleanup());

  it('renders the product name, formatted price, and rating', () => {
    render(withProviders(<ProductCard product={p1} category={olive} />));
    expect(screen.getByText('زيت زيتون بكر ممتاز')).toBeDefined();
    expect(screen.getByText(/285 ج\.م/)).toBeDefined();
    expect(screen.getByText('4.9')).toBeDefined();
  });

  it('renders the badge label when present', () => {
    render(withProviders(<ProductCard product={p1} category={olive} />));
    // p1 carries the "bestseller" badge — Arabic label: "الأكثر مبيعاً".
    expect(screen.getByText('الأكثر مبيعاً')).toBeDefined();
  });

  it('shows the out-of-stock overlay when stock is zero', () => {
    expect(soldOut.stock).toBe(0);
    render(withProviders(<ProductCard product={soldOut} category={olive} />));
    expect(screen.getByText('نفد المخزون')).toBeDefined();
  });

  it('links to /product/:id', () => {
    render(withProviders(<ProductCard product={p1} category={olive} />));
    const link = screen.getByRole('link', { name: 'زيت زيتون بكر ممتاز' });
    expect(link.getAttribute('href')).toBe('/product/p1');
  });

  it('does not crash when category is undefined (falls back to default gradient)', () => {
    const cardless: Product = { ...p1 };
    render(withProviders(<ProductCard product={cardless} category={undefined} />));
    expect(screen.getByText('زيت زيتون بكر ممتاز')).toBeDefined();
  });
});
