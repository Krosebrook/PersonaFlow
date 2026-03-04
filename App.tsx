import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Wizard } from './pages/Wizard';
import { OrgDetail } from './pages/OrgDetail';
import { Settings } from './pages/Settings';
import { AuthPage } from './pages/Auth';
import { MyCreations } from './pages/MyCreations';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// Wrapper for pages that use the Dashboard Layout
const DashboardLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />
      
      <Route path="/dashboard" element={
        <DashboardLayoutWrapper>
          <Dashboard />
        </DashboardLayoutWrapper>
      } />
      
      <Route path="/wizard" element={
        <DashboardLayoutWrapper>
          <Wizard />
        </DashboardLayoutWrapper>
      } />
      
      <Route path="/org/:id" element={
        <DashboardLayoutWrapper>
          <OrgDetail />
        </DashboardLayoutWrapper>
      } />
      
      <Route path="/org/:id/personas" element={
        <DashboardLayoutWrapper>
          <OrgDetail />
        </DashboardLayoutWrapper>
      } />
      
      <Route path="/creations" element={
        <DashboardLayoutWrapper>
          <MyCreations />
        </DashboardLayoutWrapper>
      } />
      
      <Route path="/settings" element={
        <DashboardLayoutWrapper>
          <Settings />
        </DashboardLayoutWrapper>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
