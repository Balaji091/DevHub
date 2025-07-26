import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  Mail,
  Eye,
  EyeOff,
  Code,
  Terminal,
  GitBranch,
} from 'lucide-react';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    emailId: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { emailId, password, confirmPassword, firstName, lastName } = formData;

    if (!emailId || !password || (mode === 'signup' && (!firstName || !lastName))) {
      return toast.error('Please fill out all required fields');
    }

    if (mode === 'signup' && password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const url = `http://localhost:3001/${mode}`;
      const payload =
        mode === 'signup'
          ? { emailId, password, firstName, lastName }
          : { emailId, password };

      const res = await axios.post(url, payload,{withCredentials:true});
      toast.success(`${mode === 'login' ? 'Login' : 'Signup'} successful`);
      navigate('/dashboard')
    } catch (err) {
  const errorMsg = err?.response?.data || 'Authentication failed';
  toast.error(errorMsg);
}
finally {
      setLoading(false);
    }
  };

  const floatingVariants = {
    animate: {
      y: [-15, 15, -15],
      rotate: [0, 10, -10, 0],
      transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden w-full">
      <ToastContainer position="top-right" />

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden w-full">
        <motion.div variants={floatingVariants} animate="animate" className="absolute top-20 left-10 text-green-400 opacity-10">
          <Code size={60} />
        </motion.div>
        <motion.div variants={floatingVariants} animate="animate" className="absolute top-40 right-20 text-purple-400 opacity-10">
          <Terminal size={50} />
        </motion.div>
        <motion.div variants={floatingVariants} animate="animate" className="absolute bottom-40 left-20 text-blue-400 opacity-10">
          <GitBranch size={40} />
        </motion.div>
      </div>

      {/* Header */}
      <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="relative z-10 p-6 lg:px-12 flex items-center w-full">
        <Link to='/'>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <ArrowLeft size={24} />
          </motion.button>
        </Link>
        <div className="flex items-center space-x-2 ml-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Code size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold font-mono">DevHub</span>
        </div>
      </motion.header>

      {/* Main Form */}
      <main className="relative z-10 px-6 lg:px-12 pt-8 pb-32 w-full">
        <div className="max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join DevHub'}
            </h1>
            <p className="text-gray-400 lg:text-lg">
              {mode === 'login'
                ? 'Sign in to continue your coding journey'
                : 'Start connecting with amazing developers'}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <button type="button" className="w-full flex items-center justify-center space-x-3 p-4 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300">
              <Mail size={20} />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="First Name" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Last Name" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <input type="email" name="emailId" value={formData.emailId} onChange={handleInputChange} required placeholder="Email" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold mt-6 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              {mode === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}
              <button
                onClick={toggleMode}
                className="ml-2 text-green-400 hover:text-green-300 font-semibold"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {mode === 'login' && (
            <div className="text-center mt-4">
              <button className="text-gray-400 hover:text-gray-300 text-sm">
                Forgot your password?
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
