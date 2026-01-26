import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminAccessPage from './pages/AdminAccessPage';
import DashboardPage from './pages/DashboardPage';
import AIDashboardPage from './pages/AIDashboardPage';
import PricebookPage from './pages/PricebookPage';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import TeamPage from './pages/TeamPage';
import SchedulePage from './pages/SchedulePage';
import LandingPage from './pages/LandingPage';
import { Toaster } from 'sonner';

import CompleteSignupPage from './pages/CompleteSignupPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" />;

  // Paywall Check removed as per user request ("all logins should be free")
  // if (user?.tenant?.subscriptionStatus !== 'active' && user?.role !== 'SuperAdmin') {
  //   return <Navigate to={`/complete-signup/${user?.id}`} />;
  // }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminAccessPage />} />

          <Route path="/complete-signup/:userId" element={<CompleteSignupPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <SchedulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricebook"
            element={
              <ProtectedRoute>
                <PricebookPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brain"
            element={
              <ProtectedRoute>
                <AIDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <TeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <InvoicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<LandingPage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
