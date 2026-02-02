import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Layout } from './components/layout/Layout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { EventCatalog } from './pages/public/EventCatalog';
import { EventDetailsPage } from './pages/public/EventDetailsPage';
import { BookingPage } from './pages/public/BookingPage';
import { BookingSuccessPage } from './pages/public/BookingSuccessPage';
import { BookingFailurePage } from './pages/public/BookingFailurePage';
import { BookingPendingPage } from './pages/public/BookingPendingPage';
import { SubscriptionPage } from './pages/public/SubscriptionPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProfilePage } from './pages/auth/ProfilePage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage'; // Keep this import as it's not explicitly removed by the instruction's import list, only the route is removed.

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { DashboardHome } from './pages/admin/DashboardHome';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { EventFormPage } from './pages/admin/EventFormPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventCatalog />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/subscriptions" element={<SubscriptionPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} /> {/* Keep this route as it's not explicitly removed by the instruction's route list. */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="/booking/success" element={<BookingSuccessPage />} />
          <Route path="/booking/failure" element={<BookingFailurePage />} />
          <Route path="/booking/pending" element={<BookingPendingPage />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="events/new" element={<EventFormPage />} />
              <Route path="events/edit/:id" element={<EventFormPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter >
  );
}

export default App;
