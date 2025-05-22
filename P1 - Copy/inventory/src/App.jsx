import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import Login from './Login';
import SiteVisitForm from './SiteVisitForm';
import AdminDashboard from './AdminDashboard';

// Logout button component
const LogoutButton = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    onLogout(); // Refresh login state
    navigate('/');
  };

  const isLoggedIn = localStorage.getItem('user_id');
  const isLoginPage = location.pathname === '/';

  if (!isLoggedIn || isLoginPage) return null;

  return (
    <div className="p-4 text-right">
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
      >
        Logout
      </button>
    </div>
  );
};

// Wrapper to hold routes and show based on login state
const AppRoutes = ({ isLoggedIn, role, onLogin, onLogout }) => {
  return (
    <>
      <LogoutButton onLogout={onLogout} />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to={role === 'admin' ? '/admin' : '/site-visit'} />
            ) : (
              <Login onLogin={onLogin} />
            )
          }
        />
        <Route
          path="/site-visit"
          element={
            isLoggedIn && role === 'user' ? (
              <SiteVisitForm />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isLoggedIn && role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

// Main App
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user_id'));
  const [role, setRole] = useState(localStorage.getItem('user_role'));

  const syncLoginState = () => {
    setIsLoggedIn(!!localStorage.getItem('user_id'));
    setRole(localStorage.getItem('user_role'));
  };

  useEffect(() => {
    syncLoginState();
  }, []);

  return (
    <Router>
      <AppRoutes isLoggedIn={isLoggedIn} role={role} onLogin={syncLoginState} onLogout={syncLoginState} />
    </Router>
  );
};

export default App;
