import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Briefcase, MapPin } from 'lucide-react';

const DeveloperCard = ({ developer, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="relative w-full h-[400px] lg:h-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing mx-auto"
    >
      {/* Swipe Indicators */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: x.get() > 50 ? 1 : 0 }}
          className="absolute top-8 left-8 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center"
        >
          <Heart className="w-5 h-5 mr-2" />
          LIKE
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: x.get() < -50 ? 1 : 0 }}
          className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center"
        >
          <X className="w-5 h-5 mr-2" />
          PASS
        </motion.div>
      </div>

      {/* Image Container */}
      <div className="relative h-2/3 bg-gradient-to-b from-transparent to-black/20 overflow-hidden">
        <img
          src={developer.photoUrl}
          alt={`${developer.firstName} ${developer.lastName}`}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Profile Info */}
      <div className="p-4 sm:p-6 h-1/3 flex flex-col justify-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          {developer.firstName} {developer.lastName}
        </h2>
        <div className="flex items-center text-gray-600 mb-2 text-sm sm:text-base">
          <Briefcase className="w-4 h-4 mr-2" />
          <span className="font-semibold">{developer.about || "Developer"}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          <span>Location Unknown</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DeveloperCard;
