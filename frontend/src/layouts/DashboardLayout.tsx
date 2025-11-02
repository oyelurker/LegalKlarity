import React, { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { getCurrentUserAsync } from '../store/authSlice';
import { auth as fbAuth } from '../utils/firebase';
import type { Auth } from 'firebase/auth';

const auth: Auth | null = fbAuth;

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  const handleLogout = async () => {
    // Check if we're in mock mode
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      localStorage.removeItem("idToken");
      dispatch(getCurrentUserAsync());
      navigate("/");
      return;
    }
    
    // Firebase logout
    if (auth && auth.currentUser) {
      await signOut(auth);
    } else {
      // When Firebase is not initialized, just handle local logout
      console.log("Firebase not initialized - performing local logout only");
    }
    localStorage.removeItem("idToken");
    dispatch(getCurrentUserAsync());
    navigate("/");
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { name: 'Collaboration', href: '/dashboard/collaboration', icon: Users },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">LK</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">LegalKlarity</span>
            </div>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 dark:bg-slate-700 dark:text-primary-400'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive(item.href) ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-500 dark:text-slate-400 dark:group-hover:text-slate-300'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 dark:text-slate-300 dark:group-hover:text-white">Sign out</p>
                </div>
                <LogOut className="ml-auto h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-slate-400 dark:group-hover:text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-8">
          <div className="mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;