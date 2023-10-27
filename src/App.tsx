import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/public/Login/Login';

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
