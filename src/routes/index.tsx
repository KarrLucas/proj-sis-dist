import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import LoadingScreen from '../components/LoadingScreen';
import Header from 'src/layouts/header';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: 'chat',
      element: (
        <AuthGuard>
          <Header/>
        </AuthGuard>
      ),
      children: [
        { path: '', element: <Navigate to='messages' replace /> },
        { path: 'messages', element:  <Messages />},
      ],
    },
    { path: '404', element: <Page404/> },
    { path: '*', element: <Navigate to="/404" replace /> },
    { path: '/', element: <Navigate to="/chat" replace /> },
  ]);
}

//auth
const Login = Loadable(lazy(() => import('../pages/login/Login')));
const Register = Loadable(lazy(() => import('../pages/register/Register')));

//messages
const Messages = Loadable(lazy(() => import('../pages/messages/Messages')));

const Page404 = Loadable(lazy(() => import('../pages/Page404')));