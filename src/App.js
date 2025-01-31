import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/customContextProviders/AuthContext'; // Import AuthProvider
import Navbar from './pages/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Layout Component
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div style={{ padding: '24px', minHeight: '100vh' }}>
        {children}
      </div>
    </>
  );
};

const App = () => {
  const location = useLocation();

  return (
    <AuthProvider>
      <Routes>
        {/* Exclude Navbar for Login */}
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
