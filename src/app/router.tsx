import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import { RequirePermission } from '@/components/access/RequirePermission';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';

const AnalysisPage = lazy(() => import('@/pages/dashboard/Analysis'));
const MonitorPage = lazy(() => import('@/pages/dashboard/Monitor'));
const WorkplacePage = lazy(() => import('@/pages/dashboard/Workplace'));
const ElementsPage = lazy(() => import('@/pages/components/Elements'));
const CardsPage = lazy(() => import('@/pages/components/Cards'));
const FeedbackPage = lazy(() => import('@/pages/components/Feedback'));
const BasicFormPage = lazy(() => import('@/pages/form/BasicForm'));
const StepFormPage = lazy(() => import('@/pages/form/StepForm'));
const AdvancedFormPage = lazy(() => import('@/pages/form/AdvancedForm'));
const BasicListPage = lazy(() => import('@/pages/list/BasicList'));
const CardListPage = lazy(() => import('@/pages/list/CardList'));
const SearchListPage = lazy(() => import('@/pages/list/SearchList'));
const ProfileBasicPage = lazy(() => import('@/pages/profile/Basic'));
const ProfileAdvancedPage = lazy(() => import('@/pages/profile/Advanced'));
const OrdersPage = lazy(() => import('@/pages/table/Orders'));
const AccountCenterPage = lazy(() => import('@/pages/account/Center'));
const AccountSettingsPage = lazy(() => import('@/pages/account/Settings'));
const AssistantPage = lazy(() => import('@/pages/ai/Assistant'));
const ThemeStudioPage = lazy(() => import('@/pages/theme/ThemeStudio'));
const AccessMatrixPage = lazy(() => import('@/pages/access/AccessMatrix'));
const KanbanPage = lazy(() => import('@/pages/workspace/Kanban'));
const CalendarPage = lazy(() => import('@/pages/workspace/Calendar'));
const InboxPage = lazy(() => import('@/pages/workspace/Inbox'));
const FilesPage = lazy(() => import('@/pages/workspace/Files'));
const NotificationsPage = lazy(() => import('@/pages/workspace/Notifications'));
const AuditLogPage = lazy(() => import('@/pages/workspace/AuditLog'));
const BillingPage = lazy(() => import('@/pages/workspace/Billing'));
const OnboardingPage = lazy(() => import('@/pages/workspace/Onboarding'));
const LoginPage = lazy(() => import('@/pages/auth/Login'));
const RegisterPage = lazy(() => import('@/pages/auth/Register'));
const RegisterResultPage = lazy(() => import('@/pages/auth/RegisterResult'));
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
      { path: 'register/done', Component: RegisterResultPage },
    ],
  },
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, element: <Navigate to="/dashboard/analysis" replace /> },

      // Exception pages sit OUTSIDE the guard on purpose: redirecting a denied
      // user to /403 only works if /403 is itself always reachable, and a
      // guarded 403 would redirect to itself forever.
      { path: '403', Component: ForbiddenPage },
      { path: '500', Component: ServerErrorPage },

      {
        Component: RequirePermission,
        children: [
          { path: 'dashboard/analysis', Component: AnalysisPage },
          { path: 'dashboard/monitor', Component: MonitorPage },
          { path: 'dashboard/workplace', Component: WorkplacePage },
          { path: 'components/elements', Component: ElementsPage },
          { path: 'components/cards', Component: CardsPage },
          { path: 'components/feedback', Component: FeedbackPage },
          { path: 'form/basic', Component: BasicFormPage },
          { path: 'form/step', Component: StepFormPage },
          { path: 'form/advanced', Component: AdvancedFormPage },
          { path: 'list/basic', Component: BasicListPage },
          { path: 'list/card', Component: CardListPage },
          { path: 'list/search', Component: SearchListPage },
          { path: 'profile/basic', Component: ProfileBasicPage },
          { path: 'profile/advanced', Component: ProfileAdvancedPage },
          { path: 'table', Component: OrdersPage },
          { path: 'account/center', Component: AccountCenterPage },
          { path: 'account/settings', Component: AccountSettingsPage },
          { path: 'ai/assistant', Component: AssistantPage },
          { path: 'theme-studio', Component: ThemeStudioPage },
          { path: 'access', Component: AccessMatrixPage },
          { path: 'workspace/kanban', Component: KanbanPage },
          { path: 'workspace/calendar', Component: CalendarPage },
          { path: 'workspace/inbox', Component: InboxPage },
          { path: 'workspace/files', Component: FilesPage },
          { path: 'workspace/notifications', Component: NotificationsPage },
          { path: 'workspace/audit', Component: AuditLogPage },
          { path: 'billing', Component: BillingPage },
          { path: 'onboarding', Component: OnboardingPage },
        ],
      },

      { path: '*', Component: NotFoundPage },
    ],
  },
]);
