import React from 'react';
import { ArrowDown, Shield, Clock3, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import QuickTrackCard from './QuickTrackCard';

/**
 * Hero Component
 * Two-column civic orientation section containing problem framing, primary actions,
 * system capabilities, and the live QuickTrackCard lookup widget.
 */
export default function Hero({ trackSectionRef }) {
  const scrollToCategories = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSLA = () => {
    document.getElementById('sla-escalation')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section" id="main-content" aria-labelledby="hero-heading">
      <div className="container hero-container">
        {/* Left Column: Context & Intent */}
        <div className="hero-content">
          <div className="hero-pill" aria-label="System classification">
            <Shield size={14} className="hero-pill-icon" aria-hidden="true" />
            <span>Civic Redressal Framework</span>
            <span className="hero-pill-divider">•</span>
            <span className="hero-pill-sub">Academic Prototype</span>
          </div>

          <h1 id="hero-heading" className="hero-title">
            Accountable Civic Services with Automated SLA Escalation
          </h1>

          <p className="hero-description">
            A transparent civic grievance management system engineered to register municipal issues, enforce time-bound resolution windows across municipal departments, and automatically escalate delayed tickets to higher administrative tiers.
          </p>

          {/* Primary Action Buttons */}
          <div className="hero-actions">
            <Button
              variant="primary"
              size="lg"
              iconRight={<ArrowDown size={18} />}
              onClick={scrollToCategories}
            >
              Explore Complaint Categories
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToSLA}
            >
              How SLA Escalation Works
            </Button>
          </div>

          {/* Core System Architectural Highlights */}
          <div className="hero-metrics-strip" aria-label="System Architecture Features">
            <div className="hero-metric-item">
              <div className="metric-icon-box" aria-hidden="true">
                <Clock3 size={18} />
              </div>
              <div className="metric-text-box">
                <span className="metric-title">Configurable SLA Timers</span>
                <span className="metric-desc">Targeted resolution countdowns per grievance type</span>
              </div>
            </div>

            <div className="hero-metric-item">
              <div className="metric-icon-box" aria-hidden="true">
                <AlertCircle size={18} />
              </div>
              <div className="metric-text-box">
                <span className="metric-title">3-Tier Escalation Model</span>
                <span className="metric-desc">Automated escalation from Ward Engineer to Commissioner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Tracking Widget */}
        <div className="hero-widget-col">
          <QuickTrackCard forwardRef={trackSectionRef} />
        </div>
      </div>
    </section>
  );
}
