import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Moon, User, Globe, Lock } from 'lucide-react';

const Settings: React.FC = () => {
  const { darkMode } = useTheme();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Settings</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Manage your account preferences, appearance, and security settings.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Appearance Section */}
        <motion.div variants={item} className="glass-panel p-8 rounded-2xl border border-white/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Moon size={120} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Moon size={24} />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground">Appearance</h2>
                <p className="text-sm text-muted-foreground">Customize how LegalKlarity looks on your device</p>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-border flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Dark Mode</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {darkMode
                    ? "Switch to light mode for a brighter appearance"
                    : "Switch to dark mode for reduced eye strain"}
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Notifications Section */}
          <motion.div variants={item} className="glass-card p-8 rounded-2xl border border-white/10 hover:border-primary/20 transition-colors group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                <Bell size={24} />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">Manage your alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <span className="text-foreground">Email Notifications</span>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <span className="text-foreground">Push Notifications</span>
                <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Privacy & Security Section */}
          <motion.div variants={item} className="glass-card p-8 rounded-2xl border border-white/10 hover:border-primary/20 transition-colors group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground">Privacy & Security</h2>
                <p className="text-sm text-muted-foreground">Protect your account</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-muted-foreground" />
                  <span className="text-foreground">Change Password</span>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Recommended</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-muted-foreground" />
                  <span className="text-foreground">Active Sessions</span>
                </div>
                <span className="text-muted-foreground text-sm">2 devices</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Account Section */}
        <motion.div variants={item} className="glass-panel p-8 rounded-2xl border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-foreground">Account Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your personal information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                defaultValue="Savy"
                className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <input
                type="email"
                defaultValue="savy@example.com"
                className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-input focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2 pt-4 flex justify-end">
              <button className="btn-primary px-6 py-2 rounded-lg shadow-lg shadow-primary/20">
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;