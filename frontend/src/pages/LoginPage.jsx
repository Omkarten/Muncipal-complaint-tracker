import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, UserPlus, Info } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProjectBanner from '../components/common/ProjectBanner';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useComplaints } from '../context/ComplaintContext';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('citizen');
  const navigate = useNavigate();
  const { setCurrentRole } = useComplaints();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setCurrentRole(selectedRole);
    if (selectedRole === 'officer') {
      navigate('/officer');
    } else if (selectedRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/citizen');
    }
  };

  const handleQuickLogin = (role) => {
    setCurrentRole(role);
    if (role === 'officer') {
      navigate('/officer');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/citizen');
    }
  };

  return (
    <div className="dashboard-layout">
      <ProjectBanner />
      <Navbar />

      <main className="dashboard-main container" id="main-content">
        <Card className="auth-container">
          <div className="auth-header">
            <div className="brand-logo-badge" style={{ margin: '0 auto 1rem auto' }} aria-hidden="true">
              <ShieldCheck size={24} />
            </div>
            <h1 className="auth-title">
              {activeTab === 'login' ? 'Portal Authentication' : 'Citizen Registration'}
            </h1>
            <p className="auth-subtitle">
              Academic Prototype • Frontend demonstration only (No real backend authentication required)
            </p>
          </div>

          {/* Login / Register Tab switcher */}
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'login'}
              className={`auth-tab ${activeTab === 'login' ? 'auth-tab-active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'register'}
              className={`auth-tab ${activeTab === 'register' ? 'auth-tab-active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register New Citizen
            </button>
          </div>

          <form onSubmit={handleFormSubmit}>
            {activeTab === 'register' && (
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" htmlFor="auth-name">
                  <span>Full Name</span>
                  <span className="form-required">*</span>
                </label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" htmlFor="auth-email">
                <span>Email or Mobile Number</span>
                <span className="form-required">*</span>
              </label>
              <input
                id="auth-email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@demo.local or 9876543210"
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="auth-password">
                <span>Password</span>
                <span className="form-required">*</span>
              </label>
              <input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter any sample password"
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="auth-role">
                <span>Access Profile Level</span>
              </label>
              <select
                id="auth-role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="form-select"
              >
                <option value="citizen">Citizen (Grievance Submitter)</option>
                <option value="officer">Field Officer (Ward Junior Engineer)</option>
                <option value="admin">Municipal Administrator (Executive Oversight)</option>
              </select>
            </div>

            <Button type="submit" variant="primary" size="lg" className="btn-full">
              {activeTab === 'login' ? 'Proceed to Dashboard' : 'Complete Demo Registration'}
            </Button>
          </form>

          {/* Quick 1-Click Demo Profiles for Faculty Evaluation */}
          <div className="quick-demo-accounts">
            <p className="quick-demo-title">1-Click Demonstration Shortcuts</p>
            <div className="quick-demo-buttons">
              <button
                type="button"
                className="quick-account-btn"
                onClick={() => handleQuickLogin('citizen')}
              >
                Citizen Portal
              </button>
              <button
                type="button"
                className="quick-account-btn"
                onClick={() => handleQuickLogin('officer')}
              >
                Ward Officer
              </button>
              <button
                type="button"
                className="quick-account-btn"
                onClick={() => handleQuickLogin('admin')}
              >
                Admin Desk
              </button>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
