import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getStoredToken, getStoredUser, subscribeAuthUpdates } from "./lib/auth";
import { logoutUser } from "./lib/logout";

import Landing from "./pages/Landing";
import Hackathon from "./components/Hackathon";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const AdminDashboard = lazy(() =>
  import("./pages/dashboards/AdminDashboard").catch(() => ({
    default: () => <div>Dashboard loading...</div>,
  }))
);

const AdminUserManagement = lazy(() =>
  import("./pages/dashboards/AdminUserManagement").catch(() => ({
    default: () => <div>User management loading...</div>,
  }))
);

const AdminOrganizerManagement = lazy(() =>
  import("./pages/dashboards/AdminOrganizerManagement").catch(() => ({
    default: () => <div>Organizer management loading...</div>,
  }))
);

const AdminCoordinatorManagement = lazy(() =>
  import("./pages/dashboards/AdminCoordinatorManagement").catch(() => ({
    default: () => <div>Coordinator management loading...</div>,
  }))
);

const AdminNotifications = lazy(() =>
  import("./pages/dashboards/AdminNotifications").catch(() => ({
    default: () => <div>Notifications loading...</div>,
  }))
);

const OrganizerDashboard = lazy(() =>
  import("./pages/dashboards/OrganizerDashboard").catch(() => ({
    default: () => <div>Dashboard loading...</div>,
  }))
);

const OrganizerCreateEvent = lazy(() =>
  import("./pages/dashboards/OrganizerCreateEvent").catch(() => ({
    default: () => <div>Create event loading...</div>,
  }))
);

const OrganizerContactAdmin = lazy(() =>
  import("./pages/dashboards/OrganizerContactAdmin").catch(() => ({
    default: () => <div>Contact admin loading...</div>,
  }))
);

const CoordinatorDashboard = lazy(() =>
  import("./pages/dashboards/CoordinatorDashboard").catch(() => ({
    default: () => <div>Dashboard loading...</div>,
  }))
);

const CoordinatorContactAdmin = lazy(() =>
  import("./pages/dashboards/CoordinatorContactAdmin").catch(() => ({
    default: () => <div>Contact admin loading...</div>,
  }))
);

const StudentDashboard = lazy(() =>
  import("./pages/dashboards/StudentDashboard").catch(() => ({
    default: () => <div>Dashboard loading...</div>,
  }))
);

const StudentLayout = lazy(() =>
  import("./pages/dashboards/StudentLayout").catch(() => ({
    default: () => <div>Dashboard loading...</div>,
  }))
);

const StudentEvents = lazy(() =>
  import("./pages/dashboards/StudentEvents").catch(() => ({
    default: () => <div>Events loading...</div>,
  }))
);

const StudentMyEvents = lazy(() =>
  import("./pages/dashboards/StudentMyEvents").catch(() => ({
    default: () => <div>My events loading...</div>,
  }))
);

const StudentContactUs = lazy(() =>
  import("./pages/dashboards/StudentContactUs").catch(() => ({
    default: () => <div>Contact loading...</div>,
  }))
);

const MyCertificates = lazy(() =>
  import("./pages/MyCertificates").catch(() => ({
    default: () => <div>Loading certificates...</div>,
  }))
);

function ProtectedRoute({ children, requiredRole }) {
  const user = getStoredUser();
  const token = getStoredToken();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
      ? [requiredRole]
      : null;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-white dark:from-gray-900 dark:via-purple-900/20 dark:to-black transition-colors duration-500">
      <Navbar variant="public" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());
  const hideTopNav = location.pathname.startsWith("/student-dashboard");

  useEffect(() => {
    const unsubscribe = subscribeAuthUpdates(() => {
      setUser(getStoredUser());
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      {!hideTopNav && (
        <Navbar
          activePage={null}
          setActivePage={() => {}}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/hackathon" element={<Hackathon />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="MAIN_ADMIN">
                <Suspense fallback={<div className="p-8 text-center">Loading Dashboard...</div>}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard/user-management"
            element={
              <ProtectedRoute requiredRole="MAIN_ADMIN">
                <Suspense fallback={<div className="p-8 text-center">Loading User Management...</div>}>
                  <AdminUserManagement />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard/organizer-management"
            element={
              <ProtectedRoute requiredRole="MAIN_ADMIN">
                <Suspense fallback={<div className="p-8 text-center">Loading Organizer Management...</div>}>
                  <AdminOrganizerManagement />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard/coordinator-management"
            element={
              <ProtectedRoute requiredRole="MAIN_ADMIN">
                <Suspense fallback={<div className="p-8 text-center">Loading Coordinator Management...</div>}>
                  <AdminCoordinatorManagement />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard/notifications"
            element={
              <ProtectedRoute requiredRole="MAIN_ADMIN">
                <Suspense fallback={<div className="p-8 text-center">Loading Notifications...</div>}>
                  <AdminNotifications />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizer-dashboard"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <Suspense fallback={<div className="p-8 text-center">Loading Dashboard...</div>}>
                  <OrganizerDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizer-dashboard/create-event"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <Suspense fallback={<div className="p-8 text-center">Loading Create Event...</div>}>
                  <OrganizerCreateEvent />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizer-dashboard/contact-admin"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <Suspense fallback={<div className="p-8 text-center">Loading Contact Admin...</div>}>
                  <OrganizerContactAdmin />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizer-dashboard/profile"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/coordinator-dashboard"
            element={
              <ProtectedRoute requiredRole="STUDENT_COORDINATOR">
                <Suspense fallback={<div className="p-8 text-center">Loading Dashboard...</div>}>
                  <CoordinatorDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/coordinator-dashboard/contact-admin"
            element={
              <ProtectedRoute requiredRole="STUDENT_COORDINATOR">
                <Suspense fallback={<div className="p-8 text-center">Loading Contact Admin...</div>}>
                  <CoordinatorContactAdmin />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/coordinator-dashboard/profile"
            element={
              <ProtectedRoute requiredRole="STUDENT_COORDINATOR">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <Suspense fallback={<div className="p-8 text-center">Loading Dashboard...</div>}>
                  <StudentLayout />
                </Suspense>
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<div className="p-8 text-center">Loading Dashboard...</div>}>
                  <StudentDashboard />
                </Suspense>
              }
            />
            <Route
              path="events"
              element={
                <Suspense fallback={<div className="p-8 text-center">Loading Events...</div>}>
                  <StudentEvents />
                </Suspense>
              }
            />
            <Route
              path="my-events"
              element={
                <Suspense fallback={<div className="p-8 text-center">Loading My Events...</div>}>
                  <StudentMyEvents />
                </Suspense>
              }
            />
            <Route
              path="contact-us"
              element={
                <Suspense fallback={<div className="p-8 text-center">Loading Contact...</div>}>
                  <StudentContactUs />
                </Suspense>
              }
            />
            <Route
              path="my-certificates"
              element={
                <Suspense fallback={<div className="p-8 text-center">Loading Certificates...</div>}>
                  <MyCertificates />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
