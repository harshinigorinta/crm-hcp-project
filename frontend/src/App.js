import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import LogInteractionPage from './pages/LogInteractionPage';
import InteractionsPage from './pages/InteractionsPage';
import ToolsPage from './pages/ToolsPage';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.navBrand}>
        💊 CRM HCP System
      </div>
      <div style={styles.navLinks}>
        <Link to="/" style={isActive('/') ? styles.activeLink : styles.link}>
          📋 Log Interaction
        </Link>
        <Link to="/interactions" style={isActive('/interactions') ? styles.activeLink : styles.link}>
          📊 All Interactions
        </Link>
        <Link to="/tools" style={isActive('/tools') ? styles.activeLink : styles.link}>
          🤖 AI Tools
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div style={styles.app}>
          <Navbar />
          <div style={styles.content}>
            <Routes>
              <Route path="/" element={<LogInteractionPage />} />
              <Route path="/interactions" element={<InteractionsPage />} />
              <Route path="/tools" element={<ToolsPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: '#f3f4f6',
    fontFamily: 'Inter, sans-serif',
  },
  nav: {
    background: '#1a1a2e',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  navBrand: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  navLinks: {
    display: 'flex',
    gap: 24,
  },
  link: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: 15,
  },
  activeLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 15,
    borderBottom: '2px solid #4f46e5',
    paddingBottom: 2,
  },
  content: {
    padding: '24px 16px',
  },
};

export default App;