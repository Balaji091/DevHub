import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, RotateCcw, Star } from 'lucide-react';

const SwipeButtons = ({ onSwipe }) => {
  const buttons = [
  
    {
      icon: X,
      color: 'bg-red-500 hover:bg-red-600',
      action: () => onSwipe('left'),
      size: 'w-16 h-16'
    },
   
    {
      icon: Heart,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => onSwipe('right'),
      size: 'w-16 h-16'
    }
  ];

  return (
    <div className="flex justify-center items-center space-x-4 mt-8">
      {buttons.map((button, index) => {
        const Icon = button.icon;
        return (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={button.action}
            className={`${button.size} ${button.color} rounded-full flex items-center justify-center text-white shadow-lg transition-colors`}
          >
            <Icon className="w-6 h-6" />
          </motion.button>
        );
      })}
    </div>
  );
};

export default SwipeButtons;