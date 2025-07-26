import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { Send, MoreVertical, Phone, Video } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

const ChatWindow = ({ conversation, currentUser, onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(conversation?.messages || []);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const otherUserId = conversation?.user?._id;

  useEffect(() => {
    if (!currentUser?._id) return;

    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketRef.current.emit('join', currentUser._id);

    socketRef.current.on('receive_message', (msg) => {
      if (
        otherUserId &&
        (String(msg.sender) === String(otherUserId) ||
          String(msg.receiver) === String(otherUserId))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentUser?._id, otherUserId]);

  useEffect(() => {
    setMessages(conversation?.messages || []);
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !socketRef.current || !currentUser?._id || !otherUserId) return;

    const payload = {
      sender: currentUser._id,
      receiver: otherUserId,
      content: message.trim(),
    };

    socketRef.current.emit('send_message', payload);

    setMessages((prev) => [
      ...prev,
      {
        ...payload,
        timestamp: new Date(),
        status: 'sent',
      },
    ]);
    setMessage('');
  };

  if (!conversation?.user) return null;

  const fullName = `${conversation.user.firstName || ''} ${conversation.user.lastName || ''}`.trim();

  return (
    // Root: header + footer fixed (sticky), middle scrolls
    <div className="flex-1 min-h-0 flex flex-col bg-transparent">
      {/* Header (fixed) */}
      <div className="sticky top-0 z-20 p-4 border-b border-white/20 bg-blue-950/80 backdrop-blur flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              ←
            </button>
          )}
          <img
            src={conversation.user.photoUrl || 'https://via.placeholder.com/50'}
            alt={fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="text-white font-semibold">{fullName}</h3>
          
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const mine = String(msg.sender) === String(currentUser._id);
          return (
          <motion.div
              key={msg._id || msg.timestamp || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  mine ? 'bg-primary-500 text-white' : 'bg-white/10 text-blue-100'
                }`}
              >
                <p className="text-sm break-words">{msg.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs ${mine ? 'text-blue-100' : 'text-blue-300'}`}>
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                  {mine && msg.status === 'sent' && (
                    <span className="text-xs text-green-400 ml-2">Sent</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer (fixed at bottom) */}
      <div className="sticky bottom-0 z-20 bg-blue-950/80 backdrop-blur border-t border-white/20">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-full text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
