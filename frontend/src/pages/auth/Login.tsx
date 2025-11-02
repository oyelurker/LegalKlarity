import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider, 
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import { toast } from "react-toastify";
import { getCurrentUserAsync, registerAsync } from "../../store/authSlice";
import { useAppDispatch } from "../../hooks/redux";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingGoogleCred, setPendingGoogleCred] = useState<any>(null);
  const dispatch = useAppDispatch();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    // Check if we're in mock mode
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      try {
        // Mock login - just navigate to dashboard
        dispatch({
          type: 'auth/getCurrentUser/fulfilled',
          payload: {
            uid: 'mock-user-id',
            email: formData.email,
            displayName: 'Mock User',
            photoURL: null,
            emailVerified: true,
            isAnonymous: false,
            tenantId: null,
            providerData: [],
            metadata: {
              creationTime: new Date().toISOString(),
              lastSignInTime: new Date().toISOString(),
            }
          }
        });
        
        localStorage.setItem("idToken", "mock-token");
        toast.success("Login successful (mock)!");
        setLoading(false);
        navigate("/dashboard");
        return;
      } catch (error: any) {
        setLoading(false);
        setErrors({ general: error.message });
        toast.error(error.message || "Login failed. Please try again.");
        return;
      }
    }
    
    // Firebase login
    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized");
      }
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      // If there is a pending Google credential, link it now
      if (pendingGoogleCred) {
        const { linkWithCredential } = await import("firebase/auth");
        try {
          await linkWithCredential(userCredential.user, pendingGoogleCred);
          toast.success("Google account linked!");
          setPendingGoogleCred(null);
        } catch (linkError: any) {
          toast.error("Failed to link Google account: " + linkError.message);
        }
      }
      // Save token to localStorage
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem("idToken", idToken);
      
      // Update auth state directly instead of relying on getCurrentUserAsync
      dispatch({
        type: 'auth/getCurrentUser/fulfilled',
        payload: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          emailVerified: userCredential.user.emailVerified,
          isAnonymous: userCredential.user.isAnonymous,
          tenantId: userCredential.user.tenantId,
          providerData: userCredential.user.providerData,
          metadata: {
            creationTime: userCredential.user.metadata?.creationTime,
            lastSignInTime: userCredential.user.metadata?.lastSignInTime,
          }
        }
      });
      
      toast.success("Login successful!");
      setLoading(false);
      navigate("/dashboard");
    } catch (error: any) {
      setLoading(false);
      setErrors({ general: error.message });
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrors({});
    
    // Check if we're in mock mode
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      try {
        // Mock Google login
        dispatch({
          type: 'auth/getCurrentUser/fulfilled',
          payload: {
            uid: 'mock-google-user-id',
            email: 'mock@example.com',
            displayName: 'Mock Google User',
            photoURL: null,
            emailVerified: true,
            isAnonymous: false,
            tenantId: null,
            providerData: [],
            metadata: {
              creationTime: new Date().toISOString(),
              lastSignInTime: new Date().toISOString(),
            }
          }
        });
        
        localStorage.setItem("idToken", "mock-google-token");
        toast.success("Google login successful (mock)!");
        setGoogleLoading(false);
        navigate("/dashboard");
        return;
      } catch (error: any) {
        setGoogleLoading(false);
        setErrors({ general: error.message });
        toast.error(error.message || "Google login failed. Please try again.");
        return;
      }
    }
    
    // Firebase Google login
    if (!auth) {
      setGoogleLoading(false);
      toast.error("Firebase auth is not initialized");
      return;
    }
    
    const provider = new GoogleAuthProvider();
    try {
      const credential = await signInWithPopup(auth, provider);

      // Get ID token properly from the user object
      const idToken = await credential.user.getIdToken();
      localStorage.setItem("idToken", idToken);

      // Register user in backend (Firestore) if not already present
      const user = credential.user;
      try {
        await dispatch(registerAsync({
          email: user.email || '',
          displayName: user.displayName || '',
          region: '',
          language: 'en',
        })).unwrap();
        setGoogleLoading(false);
        toast.success("User login successfully");
      } catch (regErr: any) {
        // If already exists, ignore; else show error
        if (regErr?.message && !regErr.message.includes('already exists')) {
          toast.error(regErr.message || 'Failed to login user.');
          // Optionally return here
        }
        setGoogleLoading(false);
      }
      
      // Update auth state directly instead of relying on getCurrentUserAsync
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
            creationTime: user.metadata?.creationTime,
            lastSignInTime: user.metadata?.lastSignInTime,
          }
        }
      });
      
      setGoogleLoading(false);
      navigate("/dashboard");
    } catch (error: any) {
      // Handle account-exists-with-different-credential for account linking
      if (error.code === "auth/account-exists-with-different-credential") {
        const pendingCred = GoogleAuthProvider.credentialFromError(error);
        setPendingGoogleCred(pendingCred);
        const email = error.customData?.email;
        if (email) {
          // Fetch sign-in methods for this email
          import("firebase/auth").then(async (firebaseAuth) => {
            if (!auth) {
              console.error("Firebase auth is not initialized");
              return;
            }
            const methods = await firebaseAuth.fetchSignInMethodsForEmail(auth, email);
            if (methods.includes("password")) {
              toast.info("This email is registered with email/password. Please login with your password to link your Google account.");
              setFormData((prev) => ({ ...prev, email }));
            } else {
              toast.error("Account exists with a different sign-in method. Please use your original method to login and link Google from your profile settings.");
            }
          });
        } else {
          toast.error("Account exists with a different credential. Please use your original sign-in method.");
        }
      } else {
        setErrors({ general: error.message });
        toast.error(error.message || "Google login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">LK</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back to LegalKlarity
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
            Sign in to your account
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow rounded-lg sm:px-10 dark:bg-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="Enter your email"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-white">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Forgot your password?
                </Link>
              </div>
            </div>
            
            {errors.general && (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      {errors.general}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <Button 
                type="submit" 
                className="w-full" 
                loading={loading}
                size="lg"
              >
                Sign in
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={handleGoogleLogin}
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center"
                loading={googleLoading}
              >
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
                <span className="ml-2">Sign in with Google</span>
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
