import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CRMPage from './pages/CRMPage';
import ERPPage from './pages/ERPPage';
import BillingPage from './pages/BillingPage';
import AccountsPage from './pages/AccountsPage';

function Protected() {
  const { user } = useAuth();
  if (!user) return <LoginPage />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/crm" element={<CRMPage />} />
        <Route path="/erp" element={<ERPPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Protected />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
