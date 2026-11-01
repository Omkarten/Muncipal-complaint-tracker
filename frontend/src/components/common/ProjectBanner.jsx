import React from 'react';
import { GraduationCap, Info } from 'lucide-react';

/**
 * ProjectBanner
 * Displays an explicit disclaimer identifying this system as an academic
 * college project prototype demonstrating civic grievance redressal and SLA escalation.
 */
export default function ProjectBanner() {
  return (
    <aside 
      className="project-banner" 
      role="region" 
      aria-label="Academic Project Disclaimer"
    >
      <div className="container project-banner-inner">
        <div className="project-banner-content">
          <GraduationCap className="project-banner-icon" size={16} aria-hidden="true" />
          <span className="project-banner-badge">Academic Prototype</span>
          <p className="project-banner-text">
            College Demonstration Project • Designed for municipal grievance tracking and SLA escalation modeling. Not an official government portal.
          </p>
        </div>
        <div className="project-banner-tag">
          <Info size={14} aria-hidden="true" />
          <span>Sample Data Only</span>
        </div>
      </div>
    </aside>
  );
}
