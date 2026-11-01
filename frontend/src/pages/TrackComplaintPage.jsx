import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Clock, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, User, MapPin, Calendar, ArrowRight, CornerDownRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProjectBanner from '../components/common/ProjectBanner';
import DemoRoleBar from '../components/common/DemoRoleBar';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useComplaints } from '../context/ComplaintContext';

export default function TrackComplaintPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { complaints, getComplaintById } = useComplaints();

  const queryId = searchParams.get('id') || 'MCT-SAMPLE-001';
  const [searchTerm, setSearchTerm] = useState(queryId);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const idToLookup = searchParams.get('id') || 'MCT-SAMPLE-001';
    setSearchTerm(idToLookup);
    const found = getComplaintById(idToLookup);
    if (found) {
      setActiveComplaint(found);
      setErrorMsg('');
    } else {
      setActiveComplaint(null);
      setErrorMsg(`No complaint found with Reference ID "${idToLookup}".`);
    }
  }, [searchParams, complaints]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const cleanId = searchTerm.trim().toUpperCase();
    if (!cleanId) return;
    setSearchParams({ id: cleanId });
  };

  const handleSelectSample = (sampleId) => {
    setSearchTerm(sampleId);
    setSearchParams({ id: sampleId });
  };

  return (
    <div className="dashboard-layout">
      <ProjectBanner />
      <Navbar />
      <DemoRoleBar />

      <main className="dashboard-main container" id="main-content">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <h1 className="dashboard-title">Complaint Status & SLA Tracking</h1>
            <p className="dashboard-subtitle">
              Verify live progress, elapsed resolution time, responsible ward desk, and automated escalation logs.
            </p>
          </div>
          <div>
            <Link to="/submit" className="btn btn-primary btn-md">
              + File New Grievance
            </Link>
          </div>
        </div>

        {/* Search Bar & Sample Chips */}
        <Card style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearch} className="track-search-form" style={{ marginBottom: '1rem' }}>
            <div className="track-input-group">
              <div className="track-input-wrapper">
                <Search className="track-input-icon" size={18} aria-hidden="true" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter Complaint Reference ID (e.g. MCT-SAMPLE-001)"
                  className="track-input"
                />
              </div>
              <Button type="submit" variant="primary" size="md">
                Search Ticket
              </Button>
            </div>
          </form>

          {/* Preset Sample Quick-Pick Chips */}
          <div className="sample-chips-container" style={{ marginBottom: 0 }}>
            <span className="sample-chips-label">Quick sample records to evaluate:</span>
            <div className="sample-chips-list">
              {complaints.slice(0, 5).map((comp) => (
                <button
                  key={comp.id}
                  type="button"
                  className={`sample-chip ${activeComplaint?.id === comp.id ? 'sample-chip-active' : ''}`}
                  onClick={() => handleSelectSample(comp.id)}
                >
                  {comp.id} ({comp.status})
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Error Notification */}
        {errorMsg && (
          <div className="track-alert track-alert-error" role="alert" style={{ marginBottom: '2rem' }}>
            <AlertTriangle size={18} aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Detailed Tracking View */}
        {activeComplaint && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
            {/* Left: Complaint Metadata & SLA Progress */}
            <div>
              <Card style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="track-result-top">
                  <div>
                    <div className="track-result-id-row">
                      <span className="track-result-id">{activeComplaint.id}</span>
                      <span className="track-sample-tag">Active Grievance</span>
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>
                      {activeComplaint.title}
                    </h2>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-accent-teal)', fontWeight: 600 }}>
                      {activeComplaint.category}
                    </span>
                  </div>
                  <div>
                    <Badge variant={activeComplaint.statusVariant} size="md">
                      {activeComplaint.status}
                    </Badge>
                  </div>
                </div>

                <div className="track-result-meta-grid" style={{ marginBottom: '1.5rem' }}>
                  <div className="track-meta-item">
                    <span className="track-meta-label">Location / Ward</span>
                    <span className="track-meta-value">{activeComplaint.location}</span>
                  </div>
                  <div className="track-meta-item">
                    <span className="track-meta-label">Reported Timestamp</span>
                    <span className="track-meta-value">{activeComplaint.reportedAt}</span>
                  </div>
                  <div className="track-meta-item">
                    <span className="track-meta-label">Assigned Field Unit</span>
                    <span className="track-meta-value">{activeComplaint.assignedTo}</span>
                  </div>
                  <div className="track-meta-item">
                    <span className="track-meta-label">Accountability Level</span>
                    <span className="track-meta-value highlight-tier">{activeComplaint.escalationTier}: {activeComplaint.escalationLevelName}</span>
                  </div>
                </div>

                {/* Description */}
                <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>
                    Reported Details:
                  </span>
                  <p style={{ color: 'var(--color-text-primary)' }}>{activeComplaint.description}</p>
                </div>

                {/* SLA Meter Box */}
                <div className="track-sla-meter-box">
                  <div className="track-sla-header">
                    <div className="track-sla-label-group">
                      <Clock size={16} aria-hidden="true" />
                      <span className="track-sla-title">SLA Countdown Meter (Sample Policy)</span>
                    </div>
                    <span className={`track-sla-status-pill text-${activeComplaint.slaVariant}`}>
                      {activeComplaint.slaStatusText}
                    </span>
                  </div>

                  <div className="sla-progress-track">
                    <div
                      className={`sla-progress-fill sla-fill-${activeComplaint.slaVariant}`}
                      style={{
                        width: `${Math.min(100, Math.round((activeComplaint.slaElapsedHours / activeComplaint.slaTotalHours) * 100))}%`
                      }}
                    />
                  </div>

                  <div className="track-sla-stats">
                    <span>Elapsed: <strong>{activeComplaint.slaElapsedHours}h</strong></span>
                    <span>Policy Limit: <strong>{activeComplaint.slaTotalHours}h</strong></span>
                    <span>
                      {activeComplaint.slaRemainingHours > 0
                        ? `Remaining: ${activeComplaint.slaRemainingHours}h`
                        : 'Lapsed (Escalation Triggered)'}
                    </span>
                  </div>
                </div>

                {/* Field update note */}
                <div className="track-notes-box">
                  <span className="track-notes-label">Current Field Action Status:</span>
                  <p className="track-notes-text">{activeComplaint.notes}</p>
                </div>
              </Card>
            </div>

            {/* Right: Operational Audit Trail & Lifecycle */}
            <div>
              <Card className="timeline-card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Grievance Lifecycle Audit Trail
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Immutable event timestamps for departmental transparency
                </p>

                <div className="timeline-list">
                  {activeComplaint.history && activeComplaint.history.map((hItem, idx) => (
                    <div key={idx} className="timeline-step">
                      <div className={`timeline-bullet ${idx === activeComplaint.history.length - 1 ? (activeComplaint.status.includes('Escalate') ? 'timeline-bullet-escalated' : 'timeline-bullet-active') : ''}`} />
                      <span className="timeline-time">{hItem.timestamp}</span>
                      <p className="timeline-text">{hItem.text}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Escalation Matrix Reference Box */}
              <Card style={{ padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-brand-primary)' }}>
                  SLA Escalation Rule Applied
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  If {activeComplaint.category} issues exceed {activeComplaint.slaTotalHours} hours without verified closure, supervisory oversight is automatically reassigned to Tier 2 (Sub-Divisional Officer).
                </p>
                <Link to="/sla-monitor" style={{ fontSize: '0.75rem', color: 'var(--color-interactive)', fontWeight: 600 }}>
                  View Full Municipal SLA Matrix →
                </Link>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
