import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/public/Login/Login';
import { AuthProvider } from './utils/auth/auth';
import { RequireAuth } from './components/public/RequireAuth/RequireAuth';
import Dashboard from './components/secure/Dashboard/Dashboard';
import UnAuth from './components/public/UnAuth/UnAuth';
import NotFound from './components/public/NotFound/NotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path='/'
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
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
