import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HardHat, Clock, CheckCircle2, AlertOctagon, Wrench, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProjectBanner from '../components/common/ProjectBanner';
import DemoRoleBar from '../components/common/DemoRoleBar';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useComplaints } from '../context/ComplaintContext';

export default function OfficerDashboard() {
  const { complaints, updateComplaintStatus } = useComplaints();
  const [filterCategory, setFilterCategory] = useState('All');
  const [actionNotice, setActionNotice] = useState('');

  // Counters
  const assignedCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status !== 'Resolved').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const escalatedCount = complaints.filter(c => c.status.includes('Escalate') || c.escalationTier !== 'Tier 1').length;

  const handleStatusChange = (id, newStatus, note) => {
    updateComplaintStatus(id, newStatus, note);
    setActionNotice(`Ticket ${id} status updated to "${newStatus}"!`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const filteredComplaints = filterCategory === 'All'
    ? complaints
    : complaints.filter(c => c.category === filterCategory);

  return (
    <div className="dashboard-layout">
      <ProjectBanner />
      <Navbar />
      <DemoRoleBar />

      <main className="dashboard-main container" id="main-content">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-teal badge-sm">Ward 14 Engineering Unit</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Officer Desk Demo</span>
            </div>
            <h1 className="dashboard-title">Field Officer Dispatch Queue</h1>
            <p className="dashboard-subtitle">
              Inspect assigned ward grievances, log on-site repairs, and close tickets before the SLA countdown lapses.
            </p>
          </div>
        </div>

        {/* Action feedback alert */}
        {actionNotice && (
          <div className="track-alert" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', marginBottom: '1.5rem' }}>
            <Check size={18} aria-hidden="true" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Counters Grid */}
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-blue">
              <HardHat size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{assignedCount}</span>
              <span className="stat-label">Assigned to Ward Desk</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-amber">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{pendingCount}</span>
              <span className="stat-label">Pending / Active Work</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-green">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{resolvedCount}</span>
              <span className="stat-label">Successfully Closed</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-red">
              <AlertOctagon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{escalatedCount}</span>
              <span className="stat-label">Escalated to Tier 2 / 3</span>
            </div>
          </Card>
        </div>

        {/* Table & Controls */}
        <div className="table-container">
          <div className="table-header-bar">
            <div>
              <h2 className="table-header-title">Ward Work Orders & SLA Status</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Use action buttons below to update real-time status in the demo state
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Filter:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              >
                <option value="All">All Categories</option>
                <option value="Roads & Potholes">Roads & Potholes</option>
                <option value="Water Supply & Leakages">Water Supply</option>
                <option value="Solid Waste & Garbage">Garbage</option>
                <option value="Drainage & Sewage">Drainage</option>
                <option value="Streetlights & Electrical">Streetlights</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="civic-table" aria-label="Field officer queue">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Grievance & Location</th>
                  <th>Current Status</th>
                  <th>SLA Window</th>
                  <th>Responsible Tier</th>
                  <th style={{ minWidth: '220px' }}>Field Actions (Click to Test)</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="table-mono">{item.id}</span>
                      <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                        {item.reportedAt}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-teal)', fontWeight: 500 }}>
                          {item.category} • {item.priority} Priority
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {item.location}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Badge variant={item.statusVariant} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          {item.slaRemainingHours > 0 ? `${item.slaRemainingHours}h remaining` : 'Breached SLA'}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                          Target: {item.slaTotalHours}h
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.escalationTier !== 'Tier 1' ? '#DC2626' : 'inherit' }}>
                        {item.escalationTier}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        {item.status !== 'Resolved' ? (
                          <>
                            {item.status !== 'In Progress' && (
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.6875rem' }}
                                onClick={() => handleStatusChange(item.id, 'In Progress', 'Field crew mobilized for site inspection.')}
                              >
                                Start Work
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.6875rem', backgroundColor: '#166534', borderColor: '#166534' }}
                              onClick={() => handleStatusChange(item.id, 'Resolved', 'Field maintenance completed. Site verified operational by JE.')}
                            >
                              Resolve
                            </button>
                            {item.escalationTier === 'Tier 1' && (
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.6875rem', color: '#DC2626', borderColor: '#FECACA' }}
                                onClick={() => handleStatusChange(item.id, 'Escalated to Tier 2', 'Field staff requested heavy machinery; escalated to Sub-Divisional Officer.')}
                              >
                                Escalate
                              </button>
                            )}
                          </>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle2 size={14} /> Completed
                          </span>
                        )}
                        <Link
                          to={`/track?id=${item.id}`}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.6875rem' }}
                          title="View live track timeline"
                        >
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
