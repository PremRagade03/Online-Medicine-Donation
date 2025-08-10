import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Auth and Dashboard Pages
import LoginPage from '@/pages/LoginPage';
import DonorDashboard from '@/pages/DonorDashboard';
import HospitalDashboard from '@/pages/HospitalDashboard';
import HospitalOrdersPage from '@/pages/HospitalOrdersPage';
import NGORequestsPage from '@/pages/NGORequestsPage';
import DonorDonationsPage from '@/pages/DonorDonationsPage';
import TestPage from '@/pages/TestPage';
import NGODashboard from '@/pages/NGODashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import MedicinePage from '@/pages/MedicinePage';
import AdminSignup from '@/pages/signup/AdminSignup';
import ForgotPassword from '@/pages/ForgotPassword';

// User Management
import UserList from '@/pages/UserList';
import UserCreate from '@/pages/UserCreate';
import DonationList from '@/pages/DonationList';
import RequestList from '@/pages/RequestList';
import NGOList from '@/pages/NGOList';
import HospitalList from '@/pages/HospitalList';
import MedicineList from '@/pages/MedicineList';
import SettingsPage from '@/pages/SettingsPage';
import Analytics from '@/pages/Analytics';
import NewRequest from '@/pages/NewRequest';

// Signup Pages
import DonorSignup from '@/pages/signup/DonorSignup';
import HospitalSignup from '@/pages/signup/HospitalSignup';
import NgoSignup from '@/pages/signup/NgoSignup';
import TestConnection from '@/components/TestConnection';
import LoginTest from '@/pages/LoginTest';
import DebugPage from '@/pages/DebugPage';
import RoleTest from '@/pages/RoleTest';

// Helper function to map user roles to routes
function getUserRoute(role) {
  const roleRouteMap = {
    'User': '/donor',
    'Admin': '/admin',
    'Hospital': '/hospital',
    'Ngo': '/ngo'
  };
  return roleRouteMap[role] || '/donor';
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="w-16 h-16 border-b-2 border-green-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to={getUserRoute(user.role)} replace /> : <LoginPage />
        }
      />

      {/* Protected Dashboards */}
      <Route
        path="/donor"
        element={
          <ProtectedRoute allowedRoles={['User']}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/donations"
        element={
          <ProtectedRoute allowedRoles={['User']}>
            <DonorDonationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital"
        element={
          <ProtectedRoute allowedRoles={['Hospital']}>
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital/orders"
        element={
          <ProtectedRoute allowedRoles={['Hospital']}>
            <HospitalOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo"
        element={
          <ProtectedRoute allowedRoles={['Ngo']}>
            <NGODashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/requests"
        element={
          <ProtectedRoute allowedRoles={['Ngo']}>
            <NGORequestsPage />
          </ProtectedRoute>
        }
      />

       <Route path="/requests" element={<RequestList />} />
        <Route path="/requests/new" element={<NewRequest />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Pages */}
      <Route
        path="/medicines"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <MedicinePage />
          </ProtectedRoute>
        }
      />

      {/* Signup Routes */}
      <Route path="/admin-signup" element={<AdminSignup />} />
      <Route path="/register/donor" element={<DonorSignup />} />
      <Route path="/register/hospital" element={<HospitalSignup />} />
      <Route path="/register/ngo" element={<NgoSignup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/admin/add-user" element={<UserCreate />} />
      {/* Removed problematic routes that reference undefined components */}
      
      {/* Admin Resource Pages */}
      <Route path="/users" element={<UserList />} />
      <Route path="/users/new" element={<UserCreate />} />
      <Route path="/donations" element={<DonationList />} />
      <Route path="/requests" element={<RequestList />} />
      <Route path="/ngos" element={<NGOList />} />
      <Route path="/hospitals" element={<HospitalList />} />
      <Route path="/medicinelist" element={<MedicineList />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/test" element={<TestPage />} />

      {/* Test Routes */}
      <Route path="/test-connection" element={<TestConnection />} />
      <Route path="/login-test" element={<LoginTest />} />
      <Route path="/debug" element={<DebugPage />} />
      <Route path="/role-test" element={<RoleTest />} />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all route for invalid URLs */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  React.useEffect(() => {
    window.clearAuth = () => {
      localStorage.removeItem('medishare_user');
      window.location.reload();
    };
  }, []);

  return (
    <Router>
      <Helmet>
        <title>MediShare - Online Medicine Donation Platform</title>
        <meta
          name="description"
          content="Connect donors, hospitals, and NGOs to share life-saving medicines and reduce medical waste."
        />
      </Helmet>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
          <AppRoutes />
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;