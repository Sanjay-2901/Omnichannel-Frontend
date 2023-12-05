import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/public/Login/Login';
import { AuthProvider } from './utils/auth/auth';
import { RequireAuth } from './components/public/RequireAuth/RequireAuth';
import UnAuth from './components/public/UnAuth/UnAuth';
import NotFound from './components/public/NotFound/NotFound';
import DefaultLayout from './components/secure/DefaultLayout/DefaultLayout';
import ConversationsPage from './components/secure/ConversationsPage/ConversationsPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path='/*'
          element={
            <RequireAuth>
              <DefaultLayout>
                <Routes>
                  <Route path='/' element={<ConversationsPage />} />
                  <Route
                    path='/conversations'
                    element={<ConversationsPage />}
                  />
                </Routes>
              </DefaultLayout>
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
