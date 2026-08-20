import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';

const AnalysisPage = lazy(() => import('@/pages/dashboard/Analysis'));
const MonitorPage = lazy(() => import('@/pages/dashboard/Monitor'));
const WorkplacePage = lazy(() => import('@/pages/dashboard/Workplace'));
const ElementsPage = lazy(() => import('@/pages/components/Elements'));
const CardsPage = lazy(() => import('@/pages/components/Cards'));
const FeedbackPage = lazy(() => import('@/pages/components/Feedback'));
const BasicFormPage = lazy(() => import('@/pages/form/BasicForm'));
const CardListPage = lazy(() => import('@/pages/list/CardList'));
const SearchListPage = lazy(() => import('@/pages/list/SearchList'));
const StepFormPage = lazy(() => import('@/pages/form/StepForm'));
const ProfileBasicPage = lazy(() => import('@/pages/profile/Basic'));
const AccountSettingsPage = lazy(() => import('@/pages/account/Settings'));
const OrdersPage = lazy(() => import('@/pages/table/Orders'));
const LoginPage = lazy(() => import('@/pages/auth/Login'));
const RegisterPage = lazy(() => import('@/pages/auth/Register'));
const ForbiddenPage = lazy(() => import('@/pages/exception/Forbidden'));
const ServerErrorPage = lazy(() => import('@/pages/exception/ServerError'));
const NotFoundPage = lazy(() => import('@/pages/exception/NotFound'));

export const router = createBrowserRouter([
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
    ],
  },
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
      { path: 'form/step', Component: StepFormPage },
      { path: 'list/card', Component: CardListPage },
      { path: 'list/search', Component: SearchListPage },
      { path: 'profile/basic', Component: ProfileBasicPage },
      { path: 'account/settings', Component: AccountSettingsPage },
      { path: 'table', Component: OrdersPage },
      { path: '403', Component: ForbiddenPage },
      { path: '500', Component: ServerErrorPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
