import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, Search, UserCheck, LayoutDashboard, FilePlus2, BarChart3, AlertOctagon } from 'lucide-react';
import Button from './Button';
import { useComplaints } from '../../context/ComplaintContext';

/**
 * Navbar Component
 * Institutional civic navigation header with brand identity, routing links,
 * quick action buttons, and accessible responsive mobile menu.
 */
export default function Navbar({ onTrackClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useComplaints();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleTrackBtnClick = () => {
    if (location.pathname === '/') {
      if (onTrackClick) {
        onTrackClick();
      } else {
        const el = document.getElementById('quick-track-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/track');
    }
  };

  return (
    <header className="civic-header" role="banner">
      <div className="container civic-header-inner">
        {/* Brand Identity */}
        <Link to="/" className="brand-lockup" aria-label="Municipal Complaint Tracker Home">
          <div className="brand-logo-badge" aria-hidden="true">
            <ShieldCheck size={22} className="brand-logo-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Municipal Complaint Tracker</span>
            <span className="brand-subtitle">Civic Grievance & SLA Escalation System</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            <li>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/citizen" className={`nav-link ${location.pathname === '/citizen' ? 'nav-link-active' : ''}`}>
                Citizen Portal
              </Link>
            </li>
            <li>
              <Link to="/submit" className={`nav-link ${location.pathname === '/submit' ? 'nav-link-active' : ''}`}>
                File Complaint
              </Link>
            </li>
            <li>
              <Link to="/track" className={`nav-link ${location.pathname === '/track' ? 'nav-link-active' : ''}`}>
                Track Ticket
              </Link>
            </li>
            <li>
              <Link to="/officer" className={`nav-link ${location.pathname === '/officer' ? 'nav-link-active' : ''}`}>
                Officer Desk
              </Link>
            </li>
            <li>
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'nav-link-active' : ''}`}>
                Admin Portal
              </Link>
            </li>
            <li>
              <Link to="/sla-monitor" className={`nav-link ${location.pathname === '/sla-monitor' ? 'nav-link-active' : ''}`}>
                SLA Monitor
              </Link>
            </li>
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          <Button
            variant="outline"
            size="sm"
            iconLeft={<Search size={15} />}
            onClick={handleTrackBtnClick}
            aria-label="Track ticket status"
          >
            Track Status
          </Button>

          <Button
            variant="primary"
            size="sm"
            iconLeft={<UserCheck size={15} />}
            onClick={() => navigate('/login')}
            title="Switch Demo Roles / Sign In"
          >
            {currentRole ? `Role: ${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}` : 'Sign In'}
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div className="container mobile-menu-content">
            <nav aria-label="Mobile Navigation Links">
              <ul className="mobile-nav-list">
                <li>
                  <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
                    Home Landing
                  </Link>
                </li>
                <li>
                  <Link to="/citizen" className="mobile-nav-link" onClick={closeMobileMenu}>
                    Citizen Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/submit" className="mobile-nav-link" onClick={closeMobileMenu}>
                    Submit Complaint
                  </Link>
                </li>
                <li>
                  <Link to="/track" className="mobile-nav-link" onClick={closeMobileMenu}>
                    Track Complaint Status
                  </Link>
                </li>
                <li>
                  <Link to="/officer" className="mobile-nav-link" onClick={closeMobileMenu}>
                    Officer Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="mobile-nav-link" onClick={closeMobileMenu}>
                    Municipal Admin Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/sla-monitor" className="mobile-nav-link" onClick={closeMobileMenu}>
                    SLA Escalation Monitor
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="mobile-menu-actions">
              <Button
                variant="outline"
                size="md"
                iconLeft={<Search size={16} />}
                onClick={() => { closeMobileMenu(); navigate('/track'); }}
                className="btn-full"
              >
                Search Ticket by ID
              </Button>
              <Button
                variant="primary"
                size="md"
                iconLeft={<UserCheck size={16} />}
                onClick={() => { closeMobileMenu(); navigate('/login'); }}
                className="btn-full"
              >
                Switch Role / Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
