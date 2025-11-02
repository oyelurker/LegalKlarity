import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

import { logout } from "../store/authSlice";
import { Menu, X, User, LogOut, Home, FileText, Users, BookOpen, Info, Mail } from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import { auth as fbAuth } from "../utils/firebase";
import type { Auth } from "firebase/auth";

const auth: Auth | null = fbAuth;

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Close all menus when route changes
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      // Only try to sign out with Firebase if auth is properly initialized
      if (auth && auth.currentUser) {
        await signOut(auth);
      } else {
        // When Firebase is not initialized, just handle local logout
        console.log("Firebase not initialized - performing local logout only");
      }
      localStorage.removeItem("idToken");
      dispatch(logout()); // Dispatch the logout action instead of getCurrentUserAsync
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, still dispatch logout to update the UI
      dispatch(logout());
      navigate("/");
    }
  };

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Features", href: "/features", icon: FileText },
    { name: "Use Cases", href: "/use-cases", icon: Users },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
    { name: "Dashboard", href: "/dashboard", icon: FileText, authenticated: true },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">LK</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">LegalKlarity</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation
              .filter(item => !item.authenticated || isAuthenticated)
              .map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </a>
              ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-sm rounded-full focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-slate-800 flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 dark:ring-slate-700">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700">
                      Dashboard
                    </a>
                    <a href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700">
                      Settings
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition dark:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none dark:text-slate-300 dark:hover:text-indigo-400"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden dark:bg-slate-900">
          <div className="pt-2 pb-3 space-y-1">
            {navigation
              .filter(item => !item.authenticated || isAuthenticated)
              .map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {item.name}
                </a>
              ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-slate-800 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">{user?.displayName || 'User'}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-slate-400">{user?.email}</div>
                </div>
              </div>
            ) : null}
            <div className="mt-3 px-2 space-y-1">
              {isAuthenticated ? (
                <>
                  <a href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800">
                    Dashboard
                  </a>
                  <a href="/dashboard/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800">
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;