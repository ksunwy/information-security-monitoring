import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from "react-helmet-async";
import { useAuthStore } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assets from './pages/assets/Assets';
import AssetDetail from './pages/assets/AssetDetail';
import AssetNew from './pages/assets/AssetNew';
import AdminUsers from './pages/admin/users/AdminUsers';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserCreate from './pages/admin/users/UserCreate';
import SystemLogs from './pages/admin/log/SystemLogs';
import ScanLogs from './pages/admin/log/ScanLogs';
import CveList from './pages/cve/CveList';
import CveDetail from './pages/cve/CveDetail';
import VulnAnalytics from './pages/analytics/VulnAnalytics';
import AssetAnalytics from './pages/analytics/AssetAnalytics';
import TrendsAnalytics from './pages/analytics/TrendsAnalytics';
import ReportAnalytics from './pages/analytics/ReportAnalytics';
import Policy from './pages/Policy';

const queryClient = new QueryClient();

function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
            <Route path="/assets/:id" element={<ProtectedRoute><AssetDetail /></ProtectedRoute>} />
            <Route path="/assets/new" element={<ProtectedRoute><AssetNew /></ProtectedRoute>} />

            <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/users/new" element={<ProtectedRoute roles={['admin']}><UserCreate /></ProtectedRoute>} />
            <Route path="/admin/logs/scans" element={<ProtectedRoute roles={['admin']}><ScanLogs /></ProtectedRoute>} />
            <Route path="/admin/logs/system" element={<ProtectedRoute roles={['admin']}><SystemLogs /></ProtectedRoute>} />

            <Route path="/cve">
              <Route index element={<ProtectedRoute><CveList /></ProtectedRoute>} />
              <Route path=":id" element={<ProtectedRoute><CveDetail /></ProtectedRoute>} />
            </Route>

            <Route path="/analytics/vulnerabilities" element={<ProtectedRoute><VulnAnalytics /></ProtectedRoute>} />
            <Route path="/analytics/assets" element={<ProtectedRoute><AssetAnalytics /></ProtectedRoute>} />
            <Route path="/analytics/trends" element={<ProtectedRoute><TrendsAnalytics /></ProtectedRoute>} />
            <Route path="/analytics/reports" element={<ProtectedRoute><ReportAnalytics /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
