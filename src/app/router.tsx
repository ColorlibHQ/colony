import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import { AppLayout } from '@/layouts/AppLayout';

const AnalysisPage = lazy(() => import('@/pages/dashboard/Analysis'));
const MonitorPage = lazy(() => import('@/pages/dashboard/Monitor'));
const WorkplacePage = lazy(() => import('@/pages/dashboard/Workplace'));
const ElementsPage = lazy(() => import('@/pages/components/Elements'));
const CardsPage = lazy(() => import('@/pages/components/Cards'));
const FeedbackPage = lazy(() => import('@/pages/components/Feedback'));
const BasicFormPage = lazy(() => import('@/pages/form/BasicForm'));
const CardListPage = lazy(() => import('@/pages/list/CardList'));
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
      { path: 'components/elements', Component: ElementsPage },
      { path: 'components/cards', Component: CardsPage },
      { path: 'components/feedback', Component: FeedbackPage },
      { path: 'form/basic', Component: BasicFormPage },
      { path: 'list/card', Component: CardListPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
