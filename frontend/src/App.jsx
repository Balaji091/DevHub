// App.js
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/Signup';
import ProtectedRoute from './components/Protected';
import DashboardLayout from './components/dashboard/DashBoardLayout';
import Feed from './components/Feed/Feed'; // default feed
import Requests from './components/requests/Requests';
import Connections from './components/connections/Connection';
import Profile from './components/profile/Profile';
import Messages from './components/messages/Messages';

function App() {
  return (
    <div className="bg-[#192F6C]">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Feed />} /> {/* /dashboard */}
          <Route path="requests" element={<Requests />} /> {/* /dashboard/requests */}
          <Route path="connections" element={<Connections />} /> {/* /dashboard/connections */}
            <Route path="profile" element={<Profile />} /> {/* /dashboard/connections */}
            <Route path='messages' element={<Messages/>}/>
        </Route>  
      </Routes>
    </div>
  );
}

export default App;
