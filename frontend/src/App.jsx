import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ComplaintProvider } from './context/ComplaintContext';

/* Pages */
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import TrackComplaintPage from './pages/TrackComplaintPage';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SlaMonitoringPage from './pages/SlaMonitoringPage';

/**
 * App Root Component
 * Provides Complaint Context and defines client-side routes for the demonstration.
 */
export default function App() {
  return (
    <ComplaintProvider>
      <BrowserRouter>
        {/* Accessible Skip Link for Keyboard Users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Routes>
          {/* Landing Experience */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Demonstration */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />

          {/* Citizen Modules */}
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/submit" element={<SubmitComplaintPage />} />
          <Route path="/track" element={<TrackComplaintPage />} />

          {/* Field Officer Module */}
          <Route path="/officer" element={<OfficerDashboard />} />

          {/* Administrator & SLA Modules */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/sla-monitor" element={<SlaMonitoringPage />} />

          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </ComplaintProvider>
  );
}
