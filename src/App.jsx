import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Contact = lazy(() => import('./pages/Contact'));
const Plans = lazy(() => import('./pages/Plans'));
const Templates = lazy(() => import('./pages/Templates'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const About = lazy(() => import('./pages/About'));
const CreateLanding = lazy(() => import('./pages/CreateLanding'));
const ProjectResult = lazy(() => import('./pages/ProjectResult'));
const LandingViewer = lazy(() => import('./pages/LandingViewer'));

const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/planes" element={<Plans />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/landings/:id" element={<LandingViewer />} />
            
            <Route 
              path="/templates" 
              element={
                <ProtectedRoute>
                  <Templates />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/create-landing" 
              element={
                <ProtectedRoute>
                  <CreateLanding />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/project-result" 
              element={
                <ProtectedRoute>
                  <ProjectResult />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;