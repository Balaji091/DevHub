import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, X } from 'lucide-react';
import MessageList from './MessageList';
import ChatWindow from './ChatWindow';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
};

const Messages = () => {
  const { user } = useOutletContext();
  const isMobile = useIsMobile();

  const [connections, setConnections] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unread, setUnread] = useState({}); // { [otherUserId]: number }
  const [toasts, setToasts] = useState([]);

  const socketRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(true); // controls list visibility on mobile

  // Guard
  if (!user || !user._id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Please login to use messages.
      </div>
    );
  }

  // Socket connect & events
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketRef.current.emit('join', user._id);

    socketRef.current.on('online_users', (ids) => {
      setOnlineUsers(new Set(ids));
    });

    socketRef.current.on('user_online', (id) => {
      setOnlineUsers((prev) => new Set(prev).add(String(id)));
    });

    socketRef.current.on('user_offline', (id) => {
      setOnlineUsers((prev) => {
        const copy = new Set(prev);
        copy.delete(String(id));
        return copy;
      });
    });

    socketRef.current.on('receive_message', (message) => {
      // update conversation list
      setConversations((prev) =>
        prev.map((conv) => {
          const otherId = conv.user?._id;
          if (
            String(otherId) === String(message.sender) ||
            String(otherId) === String(message.receiver)
          ) {
            return {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: { text: message.content, time: 'now', isRead: false },
            };
          }
          return conv;
        })
      );

      // if the current chat is NOT open, increment unread & show toast
      setSelectedConversation((prev) => {
        const otherId =
          String(message.sender) === String(user._id)
            ? String(message.receiver)
            : String(message.sender);

        const isThisOpen =
          prev && String(prev.user?._id) === String(otherId);

        if (!isThisOpen) {
          setUnread((u) => ({
            ...u,
            [otherId]: (u[otherId] || 0) + 1,
          }));
          queueToast(message);
        }
        return prev;
      });
    });

    return () => socketRef.current?.disconnect();
  }, [user._id]);

  // Fetch conversations & connections
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_URL}/user/conversations`, {
          credentials: 'include',
        });
        const data = await res.json();
        setConversations(data || []);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      }
    };

    const fetchConnections = async () => {
      try {
        const res = await fetch(`${API_URL}/user/connections`, {
          credentials: 'include',
        });
        const data = await res.json();
        setConnections(data || []);
      } catch (err) {
        console.error('Failed to fetch connections:', err);
      }
    };

    fetchConversations();
    fetchConnections();
  }, [user._id]);

  // Simple toaster
  const queueToast = (msg) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((t) => [
      ...t,
      {
        id,
        // you can enrich with user name if you want
        text: `New message: ${msg.content.slice(0, 40)}...`,
      },
    ]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  };

  const filteredConnections = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return connections.filter((conn) => {
      const fullName = `${conn.firstName || ''} ${conn.lastName || ''}`.toLowerCase();
      return fullName.includes(term);
    });
  }, [connections, searchTerm]);

  const openConversation = async (conn) => {
    try {
      const res = await fetch(`${API_URL}/user/messages/${conn._id}`, {
        credentials: 'include',
      });
      const msgs = await res.json();
      setSelectedConversation({ user: conn, messages: msgs || [] });

      // reset unread for this user
      setUnread((u) => {
        const copy = { ...u };
        delete copy[String(conn._id)];
        return copy;
      });

      // on mobile -> hide sidebar
      if (isMobile) setShowSidebar(false);
    } catch (err) {
      setSelectedConversation({ user: conn, messages: [] });
      if (isMobile) setShowSidebar(false);
    }
  };

  const handleBack = () => {
    setSelectedConversation(null);
    if (isMobile) setShowSidebar(true);
  };

  return (
    <>
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="bg-slate-800 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2"
            >
              <span>{t.text}</span>
              <button onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}>
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex bg-gradient-to-br from-blue-950 to-slate-900 text-white"
      >
        {/* Sidebar (hide on mobile when chat opened) */}
        <div
          className={`${
            isMobile
              ? showSidebar
                ? 'block w-full'
                : 'hidden'
              : 'block w-1/3 xl:w-1/4'
          } border-r border-white/10 p-6`}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Messages</h1>
            <p className="text-blue-300">Chat with your connections in real time.</p>
          </div>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <MessageList
            connections={filteredConnections}
            selectedConversation={selectedConversation}
            onSelectConnection={openConversation}
            onlineUsers={onlineUsers}
            unread={unread}
          />
        </div>

        {/* Chat window */}
        <div
          className={`${
            isMobile
              ? showSidebar
                ? 'hidden'
                : 'flex'
              : 'flex'
          } flex-1 overflow-hidden`}
        >
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              currentUser={user}
              onBack={isMobile ? handleBack : undefined}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-blue-300">
              <Send className="w-12 h-12 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Select a conversation to start chatting
              </h2>
              <p>Choose a connection from the list to begin messaging.</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Messages;
