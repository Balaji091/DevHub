import React from 'react';
import { motion } from 'framer-motion';

const MessageList = ({
  connections,
  selectedConversation,
  onSelectConnection,
  onlineUsers = new Set(),
  unread = {},
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {connections.map((conn, index) => {
        const fullName = `${conn.firstName || ''} ${conn.lastName || ''}`.trim();
        const isActive = selectedConversation?.user?._id === conn._id;
        const isOnline = onlineUsers.has(String(conn._id));
        const unreadCount = unread[String(conn._id)] || 0;

        return (
          <motion.div
            key={conn._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectConnection(conn)}
            className={`relative p-4 cursor-pointer transition-colors ${
              isActive ? 'bg-primary-500/20 border-r-2 border-primary-500' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={conn.photoUrl || 'https://via.placeholder.com/50'}
                  alt={fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                    isOnline ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{fullName || 'Unknown'}</h3>
                <p className="text-blue-300 text-sm truncate">{conn.jobTitle || ''}</p>
                <p className="text-blue-400 text-xs">{conn.company || ''}</p>
              </div>

              {unreadCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MessageList;
