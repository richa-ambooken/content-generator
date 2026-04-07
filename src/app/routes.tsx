import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './components/layouts/RootLayout';
import { AuthLayout } from './components/layouts/AuthLayout';
import { Login } from './components/pages/Login';
import { Signup } from './components/pages/Signup';
import { Dashboard } from './components/pages/Dashboard';
import { CreateCampaign } from './components/pages/CreateCampaign';
import { AgentRoom } from './components/pages/AgentRoom';
import { Results } from './components/pages/Results';
import { NotFound } from './components/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        Component: Dashboard,
      },
      {
        path: 'campaign/create',
        Component: CreateCampaign,
      },
      {
        path: 'campaign/:id/agents',
        Component: AgentRoom,
      },
      {
        path: 'campaign/:id/results',
        Component: Results,
      },
    ],
  },
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'signup',
        Component: Signup,
      },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
