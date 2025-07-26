import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Code, Users, Zap, Github, Star, ArrowRight } from 'lucide-react';
import {Link} from 'react-router-dom';
const LandingPage = ({ onGetStarted, onLearnMore }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden w-full">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden w-full">
        <motion.div variants={floatingVariants} animate="animate" className="absolute top-20 left-10 text-green-400 opacity-20">
          <Code size={40} />
        </motion.div>
        <motion.div variants={floatingVariants} animate="animate" className="absolute top-40 right-20 text-purple-400 opacity-20">
          <Github size={35} />
        </motion.div>
        <motion.div variants={floatingVariants} animate="animate" className="absolute bottom-40 left-20 text-blue-400 opacity-20">
          <Zap size={30} />
        </motion.div>
        <motion.div variants={floatingVariants} animate="animate" className="absolute bottom-20 right-10 text-green-400 opacity-20">
          <Users size={45} />
        </motion.div>
      </div>

      {/* Header */}
      <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="relative z-10 px-6 lg:px-12 py-6 flex justify-between items-center w-full">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Code size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold font-mono">DevHub</span>
        </div>
       <Link to ='/auth'> <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onGetStarted} className="px-4 py-2 border border-green-400 text-green-400 rounded-full hover:bg-green-400 hover:text-black transition-all duration-300">
          Sign In
        </motion.button>
        </Link>
      </motion.header>

      {/* Hero Section */}
      <motion.main variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 px-6 lg:px-12 pt-20 pb-32 w-full">
        <div className="text-center max-w-6xl mx-auto">
          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Connect with Developers.
            <br />
            Build the Future Together.
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Swipe to discover talented developers, collaborate on projects, and build amazing things together.
          </motion.p>

          {/* Demo Card */}
         

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to='/auth'>
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)' }} whileTap={{ scale: 0.95 }} onClick={onGetStarted} className="px-12 py-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center space-x-2">
              <span>Join Now</span>
              <ArrowRight size={20} />
            </motion.button>
             </Link>

           
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-gray-400 cursor-pointer" onClick={onLearnMore}>
              <ChevronDown size={32} />
            </motion.div>
          </motion.div>
        </div>
      </motion.main>

      {/* Features Section */}
      <motion.section initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="relative z-10 px-6 lg:px-12 py-24 bg-gray-800/50 backdrop-blur-sm w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How DevHub Works</h2>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {/* Step 1 */}
            <motion.div whileHover={{ y: -5, scale: 1.02 }} className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">👆</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">1. Swipe to Discover</h3>
              <p className="text-gray-400 text-lg">Browse through developer profiles and swipe right on those you'd like to connect with</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div whileHover={{ y: -5, scale: 1.02 }} className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">💬</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">2. Match & Chat</h3>
              <p className="text-gray-400 text-lg">When both developers swipe right, it's a match! Start chatting and sharing ideas</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div whileHover={{ y: -5, scale: 1.02 }} className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">3. Build Together</h3>
              <p className="text-gray-400 text-lg">Collaborate on projects, join hackathons, or start your next big idea together</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="relative z-10 px-6 lg:px-12 py-24 w-full">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-white">Join Thousands of Developers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div><div className="text-4xl lg:text-5xl font-bold text-green-400 mb-3">50K+</div><div className="text-gray-400 text-lg">Active Developers</div></div>
            <div><div className="text-4xl lg:text-5xl font-bold text-purple-400 mb-3">10K+</div><div className="text-gray-400 text-lg">Projects Created</div></div>
            <div><div className="text-4xl lg:text-5xl font-bold text-blue-400 mb-3">25K+</div><div className="text-gray-400 text-lg">Successful Matches</div></div>
            <div><div className="text-4xl lg:text-5xl font-bold text-green-400 mb-3">100+</div><div className="text-gray-400 text-lg">Countries</div></div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="relative z-10 px-6 lg:px-12 py-12 border-t border-gray-800 w-full">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded flex items-center justify-center">
              <Code size={14} className="text-white" />
            </div>
            <span className="text-lg font-bold font-mono text-white">DevHub</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">Built by developers, for developers. Join the community today.</p>
          <div className="flex justify-center space-x-6">
            <motion.a whileHover={{ scale: 1.1 }} href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <Github size={20} />
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Star size={20} />
            </motion.a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
