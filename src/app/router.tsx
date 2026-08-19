import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import { AppLayout } from '@/layouts/AppLayout';

const AnalysisPage = lazy(() => import('@/pages/dashboard/Analysis'));
const MonitorPage = lazy(() => import('@/pages/dashboard/Monitor'));
const WorkplacePage = lazy(() => import('@/pages/dashboard/Workplace'));
const NotFoundPage = lazy(() => import('@/pages/exception/NotFound'));

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, element: <Navigate to="/dashboard/analysis" replace /> },
      { path: 'dashboard/analysis', Component: AnalysisPage },
      { path: 'dashboard/monitor', Component: MonitorPage },
      { path: 'dashboard/workplace', Component: WorkplacePage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
