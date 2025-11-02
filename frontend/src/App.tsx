import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { getCurrentUserAsync, logout } from './store/authSlice';
import { onAuthStateChanged } from "firebase/auth";
import { auth as fbAuth } from "./utils/firebase";
import type { Auth } from "firebase/auth";

const auth: Auth | null = fbAuth;
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Chatbot from './pages/home/Chatbot';

// Eagerly loaded pages
import About from './pages/general/About';
import Help from './pages/general/Help';
import HomePage from './pages/home/HomePage';
import Register from './pages/auth/Register';
import FeaturesPage from './pages/features/FeaturesPage';
import UseCasesPage from './pages/use-cases/UseCasesPage';
import ResourcesPage from './pages/resources/ResourcesPage';
import ContactPage from './pages/contact/ContactPage';
import SolutionsPage from './pages/solutions/SolutionsPage';
import DemoPage from './pages/demo/DemoPage';
// If PricingPage is not lazy-loaded, import it directly:
import PricingPage from './pages/pricing/PricingPage';

// Additional pages
import CareersPage from './pages/careers/CareersPage';
import BlogPage from './pages/blog/BlogPage';
import PressPage from './pages/press/PressPage';
import SupportPage from './pages/support/SupportPage';
import ApiPage from './pages/api/ApiPage';
import PrivacyPage from './pages/privacy/PrivacyPage';
import TermsPage from './pages/terms/TermsPage';
import SecurityPage from './pages/security/SecurityPage';

// Lazy loaded dashboard pages
const Login = lazy(() => import("./pages/auth/Login"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const RoleSelection = lazy(() => import("./pages/dashboard/agreement/RoleSelection"));
const CasesList = lazy(() => import("./pages/dashboard/case/CasesList"));
const AgreementProcess = lazy(() => import("./pages/dashboard/process/AgreementProcess"));
const AIChatbot = lazy(() => import("./pages/dashboard/AIChatbot"));
const LegalDocumentAnalyzer = lazy(() => import("./pages/dashboard/agreement/LegalDocumentAnalyzer"));
const VideoAdvisor = lazy(() => import("./pages/dashboard/VideoAdvisor"));

function App() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUserAsync());
    
    // Listen for auth state changes only if auth is properly initialized
    let unsubscribe = () => {};
    if (auth) {
      // Listen for auth state changes
      unsubscribe = onAuthStateChanged(auth!, async (user) => {
        if (user) {
          // User is signed in
          try {
            const idToken = await user.getIdToken();
            localStorage.setItem("idToken", idToken);
            // Update auth state
            dispatch({
              type: 'auth/getCurrentUser/fulfilled',
              payload: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                isAnonymous: user.isAnonymous,
                tenantId: user.tenantId,
                providerData: user.providerData,
                metadata: {
                  creationTime: user.metadata.creationTime,
                  lastSignInTime: user.metadata.lastSignInTime,
                }
              }
            });
          } catch (error) {
            console.error("Error getting ID token:", error);
            dispatch(logout());
          }
        } else {
          // User is signed out
          dispatch(logout());
        }
      });
    } else {
      console.warn("Firebase auth not initialized - auth state listener not set up");
      // If auth is not initialized, ensure the user is logged out in the app state
      dispatch(logout());
    }

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch, auth]);

  if (loading) {
    // You should import Loader at the top if you want to use it
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/use-cases" element={<UseCasesPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/press" element={<PressPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/api" element={<ApiPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/active" element={<div>frontend active</div>} />

              {/* Auth routes */}
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />} />

              {/* Dashboard (protected) routes */}
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login />} />
              <Route path="/dashboard/ai-chatbot" element={isAuthenticated ? <AIChatbot /> : <Login />} />
              <Route path="/dashboard/settings" element={isAuthenticated ? <Settings /> : <Login />} />
              <Route path="/dashboard/role-selection" element={isAuthenticated ? <RoleSelection /> : <Login />} />
              <Route path="/dashboard/agreement/summary" element={isAuthenticated ? <LegalDocumentAnalyzer /> : <Login />} />
              <Route path="/dashboard/case/case-details" element={isAuthenticated ? <CasesList /> : <Login />} />
              <Route path="/dashboard/process/summary" element={isAuthenticated ? <AgreementProcess /> : <Login />} />
              <Route path="/dashboard/video-advisor" element={isAuthenticated ? <VideoAdvisor /> : <Login />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
        <Chatbot />
        <Footer />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;