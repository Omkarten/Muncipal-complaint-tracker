import React, { useState } from 'react';
import { Search, AlertCircle, Clock } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useComplaints } from '../../context/ComplaintContext';

/**
 * QuickTrackCard Component
 * Interactive ticket lookup simulator allowing visitors to track grievances with sample reference IDs.
 */
export default function QuickTrackCard({ forwardRef }) {
  const { complaints, getComplaintById } = useComplaints();
  const [ticketInput, setTicketInput] = useState('MCT-SAMPLE-001');
  const [currentResult, setCurrentResult] = useState(() => getComplaintById('MCT-SAMPLE-001') || complaints[0]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e) => {
    e?.preventDefault();
    const query = ticketInput.trim().toUpperCase();
    
    if (!query) {
      setErrorMessage('Please enter a complaint reference number.');
      setCurrentResult(null);
      return;
    }

    const found = getComplaintById(query);
    if (found) {
      setCurrentResult(found);
      setErrorMessage('');
    } else {
      setCurrentResult(null);
      setErrorMessage(`No demo record found for "${query}". Try one of the sample reference codes below.`);
    }
  };

  const handleSelectSample = (sampleId) => {
    setTicketInput(sampleId);
    const found = getComplaintById(sampleId);
    if (found) {
      setCurrentResult(found);
      setErrorMessage('');
    }
  };

  return (
    <Card className="track-card" ref={forwardRef} id="quick-track-section">
      <div className="track-card-header">
        <div className="track-card-badge-row">
          <Badge variant="teal" size="sm">Interactive Demonstration</Badge>
          <span className="track-card-meta">Live State Engine</span>
        </div>
        <h2 className="track-card-title">Track Complaint Status</h2>
        <p className="track-card-subtitle">
          Enter a reference number or select a demonstration record to see how the system monitors SLA countdowns and tiered escalation.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSearch} className="track-search-form" role="search" aria-label="Complaint Status Lookup">
        <div className="track-input-group">
          <label htmlFor="ticket-id-input" className="sr-only">Complaint Reference Number</label>
          <div className="track-input-wrapper">
            <Search className="track-input-icon" size={18} aria-hidden="true" />
            <input
              id="ticket-id-input"
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="e.g. MCT-SAMPLE-001"
              className="track-input"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <Button type="submit" variant="primary" size="md">
            Check Status
          </Button>
        </div>
      </form>

      {/* Preset Sample Selector Pills */}
      <div className="sample-chips-container" aria-label="Try Sample Reference Numbers">
        <span className="sample-chips-label">Try sample records:</span>
        <div className="sample-chips-list">
          {complaints.slice(0, 3).map((comp) => (
            <button
              key={comp.id}
              type="button"
              className={`sample-chip ${ticketInput === comp.id ? 'sample-chip-active' : ''}`}
              onClick={() => handleSelectSample(comp.id)}
            >
              {comp.id} ({comp.status.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="track-alert track-alert-error" role="alert">
          <AlertCircle size={18} className="track-alert-icon" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Result Card */}
      {currentResult && (
        <div className="track-result-panel" aria-live="polite">
          <div className="track-result-top">
            <div>
              <div className="track-result-id-row">
                <span className="track-result-id">{currentResult.id}</span>
                <span className="track-sample-tag">Sample Data Record</span>
              </div>
              <p className="track-result-category">{currentResult.category}</p>
            </div>
            <div>
              <Badge variant={currentResult.statusVariant} size="md">
                {currentResult.status}
              </Badge>
            </div>
          </div>

          {/* Location & Reported time */}
          <div className="track-result-meta-grid">
            <div className="track-meta-item">
              <span className="track-meta-label">Location / Ward</span>
              <span className="track-meta-value">{currentResult.location}</span>
            </div>
            <div className="track-meta-item">
              <span className="track-meta-label">Reported Timestamp</span>
              <span className="track-meta-value">{currentResult.reportedAt}</span>
            </div>
            <div className="track-meta-item">
              <span className="track-meta-label">Responsible Desk</span>
              <span className="track-meta-value">{currentResult.assignedTo}</span>
            </div>
            <div className="track-meta-item">
              <span className="track-meta-label">Current Accountability Tier</span>
              <span className="track-meta-value highlight-tier">{currentResult.escalationTier}: {currentResult.escalationLevelName}</span>
            </div>
          </div>

          {/* SLA Countdown & Meter */}
          <div className="track-sla-meter-box">
            <div className="track-sla-header">
              <div className="track-sla-label-group">
                <Clock size={16} aria-hidden="true" />
                <span className="track-sla-title">SLA Timer (Configurable Policy)</span>
              </div>
              <span className={`track-sla-status-pill text-${currentResult.slaVariant}`}>
                {currentResult.slaStatusText}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="sla-progress-track" role="progressbar" 
                 aria-valuenow={Math.min(100, Math.round((currentResult.slaElapsedHours / currentResult.slaTotalHours) * 100))}
                 aria-valuemin="0" 
                 aria-valuemax="100"
                 aria-label="SLA resolution progress">
              <div 
                className={`sla-progress-fill sla-fill-${currentResult.slaVariant}`}
                style={{ 
                  width: `${Math.min(100, Math.round((currentResult.slaElapsedHours / currentResult.slaTotalHours) * 100))}%` 
                }}
              />
            </div>

            <div className="track-sla-stats">
              <span>Elapsed: <strong>{currentResult.slaElapsedHours}h</strong></span>
              <span>Sample Target: <strong>{currentResult.slaTotalHours}h</strong></span>
              <span>
                {currentResult.slaRemainingHours > 0 
                  ? `Remaining: ${currentResult.slaRemainingHours}h` 
                  : 'SLA Elapsed (Escalated)'}
              </span>
            </div>
          </div>

          {/* Field Updates Note */}
          <div className="track-notes-box">
            <span className="track-notes-label">Latest Field Dispatch Note:</span>
            <p className="track-notes-text">{currentResult.notes}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
