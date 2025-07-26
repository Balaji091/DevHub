// src/components/dashboard/DashboardLayout.js
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navigation from '../layout/Navigation';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DashboardLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/profile`, {
          credentials: 'include',
        });
        if (!res.ok) {
          navigate('/auth');
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="ml-0 lg:ml-60 pt-16 lg:pt-0 min-h-screen bg-gray-950 text-white flex items-center justify-center">
          Loading…
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="ml-0 lg:ml-60 pt-16 lg:pt-0 min-h-screen bg-gray-950">
        {/* Expose the user to all nested routes */}
        <Outlet context={{ user }} />
      </div>
    </>
  );
};

export default DashboardLayout;
