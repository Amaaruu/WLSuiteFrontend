import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, Suspense, lazy } from 'react';

const Home           = lazy(() => import('./pages/Home'));
const About          = lazy(() => import('./pages/About'));
const Support        = lazy(() => import('./pages/Support'));
const Plans          = lazy(() => import('./pages/Plans'));
const Templates      = lazy(() => import('./pages/Templates'));
const Register       = lazy(() => import('./pages/Register'));
const Login          = lazy(() => import('./pages/Login'));
const Checkout       = lazy(() => import('./pages/Checkout'));
const CreateLanding  = lazy(() => import('./pages/CreateLanding'));
const ProjectResult  = lazy(() => import('./pages/ProjectResult'));
const LandingViewer  = lazy(() => import('./pages/LandingViewer'));
const UserDashboard  = lazy(() => import('./pages/user/UserDashboard'));
const UserProjects   = lazy(() => import('./pages/user/UserProjects'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers     = lazy(() => import('./pages/admin/AdminUsers'));
const AdminProjects  = lazy(() => import('./pages/admin/AdminProjects'));
const AdminLogs      = lazy(() => import('./pages/admin/AdminLogs'));
const AdminSupport   = lazy(() => import('./pages/admin/AdminSupport'));
const AdminPlans     = lazy(() => import('./pages/admin/AdminPlans'));

const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
  </div>
);

const UserOnlyRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/about"     element={<About />} />
            <Route path="/support"   element={<Support />} />
            <Route path="/plans"     element={<Plans />} />
            <Route path="/login"     element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register"  element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
            <Route path="/templates" element={<Templates />} />

            <Route path="/create-landing" element={<ProtectedRoute><CreateLanding /></ProtectedRoute>} />
            <Route path="/checkout"       element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route
              path="/project-result/:projectId"
              element={<ProtectedRoute><ProjectResult /></ProtectedRoute>}
            />

            <Route path="/landings/:id" element={<LandingViewer />} />

            <Route path="/dashboard"          element={<UserOnlyRoute><UserDashboard /></UserOnlyRoute>} />
            <Route path="/dashboard/projects" element={<UserOnlyRoute><UserProjects /></UserOnlyRoute>} />

            <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users"    element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
            <Route path="/admin/logs"     element={<AdminRoute><AdminLogs /></AdminRoute>} />
            <Route path="/admin/support"  element={<AdminRoute><AdminSupport /></AdminRoute>} />
            <Route path="/admin/plans"    element={<AdminRoute><AdminPlans /></AdminRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;