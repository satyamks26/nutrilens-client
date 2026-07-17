import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Camera, History, User, Image as ImageIcon } from 'lucide-react';
import Dashboard from './views/Dashboard';
import Scanner from './views/Scanner';
import HistoryView from './views/HistoryView';
import ProgressView from './views/ProgressView';
import Profile from './views/Profile';
import ProUpgrade from './views/ProUpgrade';

// Bottom Navigation Component
const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  // Hide bottom nav on full screen views like Pro upgrade
  if (path === '/pro') return null;

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
        <Home />
        <span>Home</span>
      </Link>
      <Link to="/scan" className={`nav-item ${path === '/scan' ? 'active' : ''}`}>
        <Camera />
        <span>Scan</span>
      </Link>
      <Link to="/history" className={`nav-item ${path === '/history' ? 'active' : ''}`}>
        <History />
        <span>History</span>
      </Link>
      <Link to="/progress" className={`nav-item ${path === '/progress' ? 'active' : ''}`}>
        <ImageIcon />
        <span>Progress</span>
      </Link>
      <Link to="/profile" className={`nav-item ${path === '/profile' ? 'active' : ''}`}>
        <User />
        <span>Profile</span>
      </Link>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/history" element={<HistoryView />} />
          <Route path="/progress" element={<ProgressView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pro" element={<ProUpgrade />} />
        </Routes>
      </main>
      <BottomNav />
    </Router>
  );
}

export default App;
