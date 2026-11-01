import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, GraduationCap, Code2 } from 'lucide-react';

/**
 * Footer Component
 * Transparent academic footer presenting project attribution, technology stack,
 * educational disclaimer, and navigational references.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="civic-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Project Identity & Scope */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand-lockup">
              <div className="footer-brand-badge" aria-hidden="true">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="footer-brand-title">Municipal Complaint Tracker</span>
                <span className="footer-brand-subtitle">SLA Escalation System Prototype</span>
              </div>
            </div>
            <p className="footer-description">
              An academic software engineering project demonstrating modern civic digital infrastructure, time-bound grievance redressal, and automated multi-tier SLA escalation.
            </p>
            <div className="footer-academic-tag">
              <GraduationCap size={16} aria-hidden="true" />
              <span>Academic Engineering Capstone Project</span>
            </div>
          </div>

          {/* Column 2: System Architecture */}
          <div className="footer-col">
            <h3 className="footer-col-title">System Architecture</h3>
            <ul className="footer-links">
              <li>
                <a href="#categories" className="footer-link">Complaint Categories</a>
              </li>
              <li>
                <a href="#process" className="footer-link">Resolution Lifecycle</a>
              </li>
              <li>
                <a href="#sla-escalation" className="footer-link">SLA Escalation Matrix</a>
              </li>
              <li>
                <a href="#features" className="footer-link">Auditability & Transparency</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Modules */}
          <div className="footer-col">
            <h3 className="footer-col-title">Demo Modules</h3>
            <ul className="footer-links">
              <li>
                <Link to="/citizen" className="footer-link">Citizen Dashboard</Link>
              </li>
              <li>
                <Link to="/submit" className="footer-link">File New Grievance</Link>
              </li>
              <li>
                <Link to="/officer" className="footer-link">Field Officer Desk</Link>
              </li>
              <li>
                <Link to="/sla-monitor" className="footer-link">SLA Escalation Queue</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Technology & Disclaimer */}
          <div className="footer-col">
            <h3 className="footer-col-title">Technology Stack</h3>
            <div className="tech-badge-list">
              <span className="tech-pill">React.js</span>
              <span className="tech-pill">Vite</span>
              <span className="tech-pill">HTML5 & CSS3</span>
              <span className="tech-pill">React Router</span>
              <span className="tech-pill">Lucide Icons</span>
            </div>
            <div className="footer-meta-box">
              <Code2 size={15} aria-hidden="true" />
              <span>Frontend Engineering • Branch: bhaskar-development</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Disclaimer & Copyright */}
        <div className="footer-bottom">
          <div className="footer-disclaimer-box">
            <p className="footer-disclaimer">
              <strong>Academic Project Disclaimer:</strong> This web application is an educational prototype developed for demonstration purposes only. It is not affiliated with, endorsed by, or representing any municipal corporation or government agency. No actual municipal services or emergency units are dispatched from this platform.
            </p>
          </div>
          <div className="footer-bottom-flex">
            <p className="footer-copyright">
              © {currentYear} Municipal Complaint Tracker Prototype. Developed for Academic Demonstration.
            </p>
            <div className="footer-bottom-links">
              <span className="status-indicator">
                <span className="status-dot" aria-hidden="true"></span>
                Phase 1 Frontend Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
