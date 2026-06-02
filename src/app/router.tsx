import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AccountPage } from '@/features/account/components/AccountPage';
import { AccountSectionPlaceholder } from '@/features/account/components/AccountSectionPlaceholder';
import { CartPage } from '@/features/cart/components/CartPage';
import { CatalogPage } from '@/features/catalog/components/CatalogPage';
import { HomePage } from '@/features/catalog/components/HomePage';
import { ProductDetailPage } from '@/features/catalog/components/ProductDetailPage';
import { CheckoutPage } from '@/features/checkout/components/CheckoutPage';
import { OrderConfirmationPage } from '@/features/checkout/components/OrderConfirmationPage';
import { TrackingPage } from '@/features/tracking/components/TrackingPage';

// Admin chunk: lazy-loaded so the customer bundle doesn't ship
// recharts + d3-* siblings. Splits cleanly into admin-* chunks.
const OverviewPage = lazy(() =>
  import('@/features/admin/overview/components/OverviewPage').then((m) => ({
    default: m.OverviewPage,
  })),
);
const OrdersPage = lazy(() =>
  import('@/features/admin/orders/components/OrdersPage').then((m) => ({
    default: m.OrdersPage,
  })),
);
const ProductsPage = lazy(() =>
  import('@/features/admin/products/components/ProductsPage').then((m) => ({
    default: m.ProductsPage,
  })),
);
const AdminSectionPlaceholder = lazy(() =>
  import('@/features/admin/components/AdminSectionPlaceholder').then((m) => ({
    default: m.AdminSectionPlaceholder,
  })),
);

function AdminBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

const router = createBrowserRouter([
  // Customer surfaces
  { path: '/',                          element: <HomePage /> },
  { path: '/catalog',                   element: <CatalogPage /> },
  { path: '/catalog/:categoryId',       element: <CatalogPage /> },
  { path: '/product/:id',               element: <ProductDetailPage /> },
  { path: '/cart',                      element: <CartPage /> },
  { path: '/checkout',                  element: <CheckoutPage /> },
  { path: '/checkout/success/:orderId', element: <OrderConfirmationPage /> },
  { path: '/tracking/:orderId',         element: <TrackingPage /> },
  { path: '/account',                   element: <AccountPage /> },
  { path: '/account/:section',          element: <AccountSectionPlaceholder /> },

  // Admin surfaces — lazy-loaded
  { path: '/admin',           element: <AdminBoundary><OverviewPage /></AdminBoundary> },
  { path: '/admin/orders',    element: <AdminBoundary><OrdersPage /></AdminBoundary> },
  { path: '/admin/products',  element: <AdminBoundary><ProductsPage /></AdminBoundary> },
  // F7 will replace this one.
  { path: '/admin/campaigns', element: <AdminBoundary><AdminSectionPlaceholder /></AdminBoundary> },
  // Catch-all for the remaining sidebar items.
  { path: '/admin/:section',  element: <AdminBoundary><AdminSectionPlaceholder /></AdminBoundary> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
