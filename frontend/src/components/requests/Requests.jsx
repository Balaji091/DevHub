import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const[loading,setLoading]=useState(true)
  // Fetch incoming and sent requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:3001/user/requests", {
          credentials: "include",
        });
        const data = await res.json();
        setRequests(data?.requests || []);
       
      } catch (error) {
        console.error("Failed to fetch requests", error);
      }
      finally{
        setLoading(false)
      }
    };

    fetchRequests();
  }, []);

  // Handle Accept / Reject
  const handleAction = async (requestId, action) => {
    try {
      await fetch(`http://localhost:3001/request/review/${action}/${requestId}`, {
        method: "POST",
        credentials: "include",
      });

      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error(`Failed to ${action} request`, err);
    }
  };
    if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br  to-slate-900 text-white">
      <h2 className="text-xl font-bold  py-14">Incoming Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-400 py-14">No incoming requests.</p>
      ) : (
        requests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 mb-3 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center space-x-4">
              <img
                src={request.fromUserId.photoUrl || "https://via.placeholder.com/50"}
                alt={request.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-semibold text-sm">
                  {request.fromUserId.firstName + "  "+request.fromUserId.lastName }
                </h3>
                <p className="text-blue-300 text-xs">{request.fromUserId.about} </p>
                <p className="text-blue-500 text-xs mt-1">Hyderabad</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleAction(request._id, "ignored")}
                className="px-3 py-1 text-xs text-red-300 bg-red-500/10 rounded hover:bg-red-500/20"
              >
                Decline
              </button>
              <button
                onClick={() => handleAction(request._id, "accepted")}
                className="px-3 py-1 text-xs text-green-300 bg-green-500/10 rounded hover:bg-green-500/20"
              >
                Accept
              </button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Requests;
