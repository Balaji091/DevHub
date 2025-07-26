import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MessageCircle,
  Github,
  Linkedin,
  MapPin,
  Briefcase,
  X,
} from "lucide-react";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConnection, setSelectedConnection] = useState(null);
  const[loading,setLoading]=useState(true)
  // Fetch real data
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await fetch("http://localhost:3001/user/connections", {
          credentials: "include",
        });
        const data = await res.json();
        setConnections(data || []);
      } catch (err) {
        console.error("Failed to fetch connections:", err);
      }
      finally{
        setLoading(false)
      }
    };

    fetchConnections();
  }, []);

  const filtered = connections.filter((c) =>
    [c.firstName, c.company]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600"></div>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 bg-gradient-to-br from-blue-950 to-slate-900  text-white"
    >
      {/* Header */}
      <div className="mb-6 my-16">
        <h1 className="text-2xl font-bold mb-1">My Connections</h1>
        <p className="text-blue-300">
          You have {connections.length} connections in your network.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mb-6 relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
        <input
          type="text"
          placeholder="Search connections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c, index) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedConnection(c)}
            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 mb-3 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center space-x-4">
              <img
                src={c.photoUrl || "https://via.placeholder.com/50"}
                alt={c.firstName + " " + c.lastName}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-semibold text-sm">{c.firstName.toUpperCase() +" "+ c.lastName.toUpperCase()}</h3>
                <p className="text-blue-300 text-xs">{c.jobTitle + "@" + c.company && c.company}</p>
                <p className="text-blue-500 text-xs">{c.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-10 h-10 text-blue-300 mx-auto mb-4" />
          <p className="text-white text-lg font-semibold mb-2">
            No connections found
          </p>
          <p className="text-blue-400 text-sm">
            Try changing your search keywords
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedConnection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedConnection(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-lg relative border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedConnection(null)}
              className="absolute top-3 right-3 text-blue-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={selectedConnection.photoUrl}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-white font-semibold text-xl">
                  {selectedConnection.firstName + " "+ selectedConnection.lastName}
                </h2>
                <p className="text-blue-200">{selectedConnection.about}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-blue-300 text-sm mb-4">
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                {selectedConnection.jobTitle }
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {selectedConnection.location}
              </div>
             
             
            </div>

            {/* Skills */}
            {selectedConnection.skills?.length > 0 && (
              <div className="mb-5">
                <h4 className="text-white font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedConnection.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-4">
              <button className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white font-medium">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </button>
              <a
                href={`https://github.com/${selectedConnection.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-blue-300 hover:text-white"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={`https://linkedin.com/in/${selectedConnection.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-blue-300 hover:text-white"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Connections;
