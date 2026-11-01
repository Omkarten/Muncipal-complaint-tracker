import React, { useRef } from 'react';
import ProjectBanner from '../components/common/ProjectBanner';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Hero from '../components/landing/Hero';
import Categories from '../components/landing/Categories';
import ProcessFlow from '../components/landing/ProcessFlow';
import SlaEscalation from '../components/landing/SlaEscalation';
import PlatformFeatures from '../components/landing/PlatformFeatures';

/**
 * LandingPage
 * Orchestrates the Phase 1 civic platform landing experience.
 */
export default function LandingPage() {
  const trackSectionRef = useRef(null);

  const handleTrackNavigation = () => {
    if (trackSectionRef.current) {
      trackSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      const inputEl = document.getElementById('ticket-id-input');
      if (inputEl) {
        setTimeout(() => inputEl.focus(), 400);
      }
    }
  };

  return (
    <div className="landing-layout">
      {/* Top Academic Disclaimer Banner */}
      <ProjectBanner />

      {/* Main Civic Navigation Header */}
      <Navbar onTrackClick={handleTrackNavigation} />

      {/* Main Content Area */}
      <main id="main-content" tabIndex="-1">
        {/* Hero Section with Integrated QuickTrack Card */}
        <Hero trackSectionRef={trackSectionRef} />

        {/* 5 Municipal Complaint Categories */}
        <Categories />

        {/* 4-Step Resolution Lifecycle */}
        <ProcessFlow />

        {/* 3-Tier SLA Escalation Architecture */}
        <SlaEscalation />

        {/* Core System Architectural Capabilities */}
        <PlatformFeatures />
      </main>

      {/* Comprehensive Academic Footer */}
      <Footer />
    </div>
  );
}
