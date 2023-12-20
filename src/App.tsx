import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/public/Login/Login';
import { AuthProvider } from './utils/auth/AuthProvider';
import { RequireAuth } from './components/public/RequireAuth/RequireAuth';
import UnAuth from './components/public/UnAuth/UnAuth';
import NotFound from './components/public/NotFound/NotFound';
import DefaultLayout from './components/secure/DefaultLayout/DefaultLayout';
import Dashboard from './components/secure/Dashboard/Dashboard';
import DashboardProvider from './providers/DashboardProvider';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path='/'
          element={
            <RequireAuth>
              <DefaultLayout />
            </RequireAuth>
          }
        >
          <Route
            path=''
            element={
              <DashboardProvider>
                <Navigate to='/dashboard' />
              </DashboardProvider>
            }
          />
          <Route
            path='/dashboard'
            element={
              <DashboardProvider>
                <Dashboard />
              </DashboardProvider>
            }
          />
        </Route>
        <Route
          path='/login'
          element={
            <UnAuth>
              <Login />
            </UnAuth>
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
