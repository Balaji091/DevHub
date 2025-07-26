import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

import {
  Code, Heart, MessageCircle, Users,
  User, LogOut
} from 'lucide-react';

const Navigation = ({ onLogout, user }) => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
const navigate=useNavigate();
  const navItems = [
    { path: '/dashboard', icon: Heart, label: 'Discover' },
    { path: '/dashboard/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/dashboard/connections', icon: Users, label: 'Connections' },
    { path: '/dashboard/requests', icon: Heart, label: 'Requests' },
  ];
 const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:flex fixed top-0 left-0 h-screen w-60 bg-slate-900/95 backdrop-blur-lg border-r border-white/10 flex-col justify-between z-50 py-6 px-4">
        <div>
          <Link to="/" className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Code size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold font-mono text-white">DevHub</span>
          </Link>
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Profile Top Right */}
      <div className="hidden lg:flex fixed top-4 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-full"
          >
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </button>

          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-white/20 py-2 z-50"
            >
              <Link
                to="/dashboard/profile"
                className="flex items-center space-x-2 px-4 py-2 text-blue-200 hover:text-white hover:bg-white/10"
                onClick={() => setShowProfileMenu(false)}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <hr className="border-white/20 my-2" />
              <button

                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ✅ Mobile Top Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Code size={16} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-white font-mono">DevHub</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center"
          >
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          </button>

          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-white/20 py-2 z-50"
            >
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 text-blue-200 hover:text-white hover:bg-white/10"
                onClick={() => setShowProfileMenu(false)}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <hr className="border-white/20 my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 z-50">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  isActive ? 'text-primary-400' : 'text-blue-300 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation;
