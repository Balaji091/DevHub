import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeveloperCard from './DeveloperCard';
import SwipeButtons from './SwipeButtons';
import axios from 'axios';

const Feed = ({ user }) => {
  const [developers, setDevelopers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // 👈 Add loading state

  // Fetch developers from backend
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await axios.get('http://localhost:3001/user/feed', {
          withCredentials: true,
        });
        setDevelopers(res.data);
      } catch (error) {
        console.error('Error fetching developers:', error);
      } finally {
        setLoading(false); // ✅ Done loading
      }
    };

    fetchDevelopers();
  }, []);

  // Send swipe action to backend
  const handleSwipe = async (direction) => {
    if (currentIndex >= developers.length) return;

    const currentDeveloper = developers[currentIndex];
    const status = direction === 'right' ? 'interested' : 'ignored';

    try {
      await axios.post(
        `http://localhost:3001/request/send/${status}/${currentDeveloper._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(`${status.toUpperCase()} - ${currentDeveloper.name}`);
    } catch (error) {
      console.error(`Failed to send ${status} request:`, error);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const currentDeveloper = developers[currentIndex];

  // 🔄 Show spinner while loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600"></div>
      </div>
    );
  }

  // 🧑‍💻 No more developers left
  if (currentIndex >= developers.length) {
    return (
      
     
      <div className="min-h-screen  bg-[#0E1629] flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
        <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md shadow-xl border border-white/10 w-full max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-24 h-24 bg-pink-600/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <span className="text-5xl">🎉</span>
          </motion.div>

          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
            That's Everyone!
          </h2>
          <p className="text-blue-300 mb-6">
            You’ve swiped through all available developers in your area.
          </p>

          <button
            onClick={() => setCurrentIndex(0)}
            className="w-full px-6 py-3 rounded-xl bg-pink-600 text-white font-semibold shadow-md hover:bg-pink-700 active:scale-95 transition-all duration-300"
          >
            🔁 Start Over
          </button>
        </div>
      </div>
    
    );
  }

  // 🧑 Show current developer card
  return (
    
    <div className="min-h-screen w-full bg-gray-950">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex items-center justify-center min-h-screen"
      >
        <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
          <AnimatePresence mode="wait">
            {currentDeveloper && (
              <DeveloperCard
                key={currentDeveloper._id}
                developer={currentDeveloper}
                onSwipe={handleSwipe}
              />
            )}
          </AnimatePresence>

          <SwipeButtons onSwipe={handleSwipe} />
        </div>
      </motion.div>
    </div>
  
  );
};

export default Feed;
