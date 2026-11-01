import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserCheck, ShieldAlert, RotateCcw, Info } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';

/**
 * DemoRoleBar Component
 * An academic demonstration utility bar that enables 1-click role switching
 * between Citizen, Field Officer, and Municipal Administrator for evaluation.
 */
export default function DemoRoleBar() {
  const { currentRole, setCurrentRole, resetToSampleData } = useComplaints();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSelect = (role, path) => {
    setCurrentRole(role);
    if (path && location.pathname !== path) {
      navigate(path);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset demo data to initial sample complaints?')) {
      resetToSampleData();
    }
  };

  return (
    <div className="demo-role-banner" role="region" aria-label="Demo Role Switcher">
      <div className="container demo-role-inner">
        <div className="role-switch-group">
          <span className="role-switch-label">Demonstration Role:</span>
          <button
            type="button"
            className={`role-pill-btn ${currentRole === 'citizen' ? 'role-pill-active' : ''}`}
            onClick={() => handleRoleSelect('citizen', '/citizen')}
            aria-pressed={currentRole === 'citizen'}
          >
            Citizen
          </button>
          <button
            type="button"
            className={`role-pill-btn ${currentRole === 'officer' ? 'role-pill-active' : ''}`}
            onClick={() => handleRoleSelect('officer', '/officer')}
            aria-pressed={currentRole === 'officer'}
          >
            Field Officer (Ward 14)
          </button>
          <button
            type="button"
            className={`role-pill-btn ${currentRole === 'admin' ? 'role-pill-active' : ''}`}
            onClick={() => handleRoleSelect('admin', '/admin')}
            aria-pressed={currentRole === 'admin'}
          >
            Municipal Admin
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="role-pill-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            onClick={handleReset}
            title="Reset complaints to default demo state"
          >
            <RotateCcw size={12} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
