import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Clock, AlertTriangle, AlertOctagon, CheckCircle2, ArrowRight, UserCheck, Layers, Zap } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProjectBanner from '../components/common/ProjectBanner';
import DemoRoleBar from '../components/common/DemoRoleBar';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useComplaints } from '../context/ComplaintContext';

export default function SlaMonitoringPage() {
  const { complaints, runEscalation, escalationNotice, isLoading } = useComplaints();

  const tier1Complaints = complaints.filter(c => c.escalationTier === 'Tier 1');
  const tier2Complaints = complaints.filter(c => c.escalationTier === 'Tier 2');
  const tier3Complaints = complaints.filter(c => c.escalationTier === 'Tier 3');

  return (
    <div className="dashboard-layout">
      <ProjectBanner />
      <Navbar />
      <DemoRoleBar />

      <main className="dashboard-main container" id="main-content">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-escalated badge-sm">Accountability Engine</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Demo SLA Matrix</span>
            </div>
            <h1 className="dashboard-title">SLA Escalation Monitoring Queue</h1>
            <p className="dashboard-subtitle">
              Real-time monitoring of complaint resolution velocity across Tier 1 (Ward), Tier 2 (Sub-Division), and Tier 3 (Commissioner) governance levels.
            </p>
          </div>
          <div className="dashboard-actions">
            <Button
              variant="outline"
              size="md"
              onClick={runEscalation}
              disabled={isLoading}
              style={{ borderColor: '#DC2626', color: '#DC2626', backgroundColor: '#FEF2F2', fontWeight: 600 }}
            >
              <Zap size={16} /> {isLoading ? 'Executing Procedure...' : 'Trigger SLA Escalation (PostgreSQL)'}
            </Button>
          </div>
        </div>

        {escalationNotice && (
          <div className="track-alert" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', marginBottom: '1.5rem' }}>
            <Zap size={18} aria-hidden="true" />
            <span>{escalationNotice}</span>
          </div>
        )}

        {/* 3-Tier Escalation Overview Cards */}
        <div className="sla-tier-grid">
          {/* Tier 1 Card */}
          <Card className="sla-monitor-card sla-monitor-card-t1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-on-schedule badge-sm">Tier 1 • Active</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>Ward Field Level</h2>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                {tier1Complaints.length}
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Initial response tier. Assigned to Ward Junior Engineers. Governed by category-specific SLA windows (12h to 48h).
            </p>
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', marginTop: 'auto', fontSize: '0.75rem' }}>
              <p><strong>Responsible Officer:</strong> Ward Junior Engineer</p>
              <p><strong>Auto-Escalation Rule:</strong> If unresolved when SLA reaches 100%</p>
            </div>
          </Card>

          {/* Tier 2 Card */}
          <Card className="sla-monitor-card sla-monitor-card-t2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-warning badge-sm">Tier 2 • Escalated</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>Sub-Divisional Desk</h2>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#B45309' }}>
                {tier2Complaints.length}
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              First escalation tier triggered when Ward Field Officers fail to address grievances within promised SLA limits.
            </p>
            <div style={{ backgroundColor: '#FFFBEB', padding: '0.75rem', borderRadius: '6px', marginTop: 'auto', fontSize: '0.75rem' }}>
              <p><strong>Responsible Authority:</strong> Assistant Executive Engineer</p>
              <p><strong>Intervention:</strong> Supervisory enquiry & contractor reallocation</p>
            </div>
          </Card>

          {/* Tier 3 Card */}
          <Card className="sla-monitor-card sla-monitor-card-t3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-escalated badge-sm">Tier 3 • Critical Breach</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>Commissioner Desk</h2>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#DC2626' }}>
                {tier3Complaints.length}
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              High-level administrative review for grievances that exceed Tier 2 grace periods without verified municipal action.
            </p>
            <div style={{ backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: '6px', marginTop: 'auto', fontSize: '0.75rem' }}>
              <p><strong>Responsible Authority:</strong> Municipal Commissioner</p>
              <p><strong>Action:</strong> Direct administrative sanction & audit inquiry</p>
            </div>
          </Card>
        </div>

        {/* Escalated Tickets Audit Table */}
        <div className="table-container">
          <div className="table-header-bar">
            <div>
              <h2 className="table-header-title">Active SLA Breached Tickets (Demo Audit Log)</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Demonstration of time-bound accountability and supervisory reassignments
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="civic-table" aria-label="Escalated complaints">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Category</th>
                  <th>Title & Location</th>
                  <th>SLA Time Lapsed</th>
                  <th>Escalated Tier</th>
                  <th>Supervisory Action Desk</th>
                  <th>Audit</th>
                </tr>
              </thead>
              <tbody>
                {complaints.filter(c => c.escalationTier !== 'Tier 1').map(item => (
                  <tr key={item.id} style={{ backgroundColor: item.escalationTier === 'Tier 3' ? '#FFF5F5' : '#FFFAEB' }}>
                    <td>
                      <span className="table-mono" style={{ color: item.escalationTier === 'Tier 3' ? '#991B1B' : '#92400E' }}>
                        {item.id}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.8125rem' }}>{item.category}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{item.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.location}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626' }}>
                          Elapsed: {item.slaElapsedHours}h
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                          Original SLA: {item.slaTotalHours}h
                        </span>
                      </div>
                    </td>
                    <td>
                      <Badge variant="escalated" size="sm">
                        {item.escalationTier}
                      </Badge>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {item.assignedTo}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/track?id=${item.id}`}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.6875rem', backgroundColor: '#FFFFFF' }}
                      >
                        Inspect Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note on Academic Demonstration */}
        <div className="sla-disclaimer-card" style={{ marginTop: '2rem' }}>
          <p>
            <strong>Academic Demonstration Note:</strong> All SLA thresholds, breach intervals, and tiered escalation triggers are simulated client-side using React demonstration state. In an enterprise municipal deployment, these triggers run as asynchronous scheduled cron workers against city GIS databases.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
