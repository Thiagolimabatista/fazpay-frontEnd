import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageCreateProduct = lazy(() => import('src/pages/dashboard/createProduct'));
const PageEditProdcut = lazy(() => import('src/pages/dashboard/editProduct'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { path: 'two', element: <PageTwo /> },

      {
        path: 'product',
        children: [
          { path: 'create', element: <PageCreateProduct /> },
          { path: ':id/edit', element: <PageEditProdcut /> },
        ],
      },
    ],
  },
];
