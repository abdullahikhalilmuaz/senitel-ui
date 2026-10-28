import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import DemoMode from './pages/DemoMode';
import BehaviourAnalytics from './pages/BehaviourAnalytics';
import BehaviourLab from './pages/BehaviourLab';
import SessionLogs from './pages/SessionLogs';
import SessionDetails from './pages/SessionDetails';
import SecurityAlerts from './pages/SecurityAlerts';
import Verification from './pages/Verification';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AIModel from './pages/AIModel';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="monitoring" element={<LiveMonitoring />} />
        <Route path="behaviour-lab" element={<BehaviourLab />} />
        <Route path="demo" element={<DemoMode />} />
        <Route path="analytics" element={<BehaviourAnalytics />} />
        <Route path="logs" element={<SessionLogs />} />
        <Route path="logs/:id" element={<SessionDetails />} />
        <Route path="alerts" element={<SecurityAlerts />} />
        <Route path="verify" element={<Verification />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="ai" element={<AIModel />} />
      </Route>
    </Routes>
  );
}

export default App;
