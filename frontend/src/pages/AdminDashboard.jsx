import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, ShieldAlert, PieChart, Users, AlertOctagon, CheckCircle2, Clock, ArrowRight, Layers, Zap } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProjectBanner from '../components/common/ProjectBanner';
import DemoRoleBar from '../components/common/DemoRoleBar';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useComplaints } from '../context/ComplaintContext';

export default function AdminDashboard() {
  const { complaints, runEscalation, escalationNotice, isLoading } = useComplaints();
  const navigate = useNavigate();

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Submitted').length;
  const warning = complaints.filter(c => c.status === 'Approaching SLA Deadline').length;
  const escalated = complaints.filter(c => c.status.includes('Escalate') || c.escalationTier !== 'Tier 1').length;
  const complianceRate = total > 0 ? Math.round(((total - escalated) / total) * 100) : 100;

  // Category breakdown
  const categoryStats = [
    { name: 'Roads & Potholes', count: complaints.filter(c => c.category === 'Roads & Potholes').length, defaultSla: '48h' },
    { name: 'Water Supply & Leakages', count: complaints.filter(c => c.category === 'Water Supply & Leakages').length, defaultSla: '24h' },
    { name: 'Solid Waste & Garbage', count: complaints.filter(c => c.category === 'Solid Waste & Garbage').length, defaultSla: '12h' },
    { name: 'Drainage & Sewage', count: complaints.filter(c => c.category === 'Drainage & Sewage').length, defaultSla: '24h' },
    { name: 'Streetlights & Electrical', count: complaints.filter(c => c.category === 'Streetlights & Electrical').length, defaultSla: '36h' }
  ];

  return (
    <div className="dashboard-layout">
      <ProjectBanner />
      <Navbar />
      <DemoRoleBar />

      <main className="dashboard-main container" id="main-content">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-teal badge-sm">Central Oversight Cell</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Municipal Admin Portal</span>
            </div>
            <h1 className="dashboard-title">City Grievance & SLA Administration</h1>
            <p className="dashboard-subtitle">
              Central executive oversight for departmental complaint velocity, breach monitoring, and administrative escalation routing.
            </p>
          </div>
          <div className="dashboard-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="md"
              onClick={runEscalation}
              disabled={isLoading}
              style={{ borderColor: '#DC2626', color: '#DC2626', backgroundColor: '#FEF2F2', fontWeight: 600 }}
            >
              <Zap size={16} /> {isLoading ? 'Executing Procedure...' : 'Run SLA Escalation (PostgreSQL)'}
            </Button>
            <Button
              variant="primary"
              size="md"
              iconRight={<ArrowRight size={16} />}
              onClick={() => navigate('/sla-monitor')}
            >
              Open SLA Escalation Matrix
            </Button>
          </div>
        </div>

        {escalationNotice && (
          <div className="track-alert" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', marginBottom: '1.5rem' }}>
            <Zap size={18} aria-hidden="true" />
            <span>{escalationNotice}</span>
          </div>
        )}

        {/* Executive Stats Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-blue">
              <BarChart3 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{total}</span>
              <span className="stat-label">Total City Tickets</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-green">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{complianceRate}%</span>
              <span className="stat-label">Sample SLA Compliance Rate</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-amber">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{warning}</span>
              <span className="stat-label">Nearing SLA Deadline</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-red">
              <AlertOctagon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{escalated}</span>
              <span className="stat-label">Breached (Tier 2 / Tier 3)</span>
            </div>
          </Card>
        </div>

        {/* 2-Column Overview: Category Breakdown vs Escalation Alert Queue */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Column 1: Grievance Distribution by Category */}
          <Card style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Complaints by Municipal Category
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Workload distribution across city maintenance divisions
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categoryStats.map((cat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600 }}>{cat.name}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      <strong>{cat.count}</strong> tickets • SLA: {cat.defaultSla}
                    </span>
                  </div>
                  <div className="sla-progress-track" style={{ height: '6px', marginBottom: 0 }}>
                    <div
                      className="sla-progress-fill"
                      style={{
                        width: `${total > 0 ? (cat.count / total) * 100 : 0}%`,
                        backgroundColor: '#1D4ED8'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Column 2: Active Escalation Overview */}
          <Card style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Escalated Grievances Oversight
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Tickets automatically escalated due to expired SLA resolution windows
                </p>
              </div>
              <Badge variant="escalated" size="sm">
                {escalated} Critical
              </Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {complaints.filter(c => c.escalationTier !== 'Tier 1').map(item => (
                <div
                  key={item.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: '#991B1B' }}>
                      {item.id}
                    </span>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A', margin: '2px 0' }}>
                      {item.title}
                    </p>
                    <span style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                      Current Desk: {item.assignedTo} ({item.escalationTier})
                    </span>
                  </div>
                  <Link
                    to={`/track?id=${item.id}`}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', backgroundColor: '#FFFFFF' }}
                  >
                    Audit
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Master Municipal Complaints Table */}
        <div className="table-container">
          <div className="table-header-bar">
            <div>
              <h2 className="table-header-title">Master Municipal Registry</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Comprehensive civic database with cross-departmental status
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="civic-table" aria-label="Master complaints list">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Department / Category</th>
                  <th>Location & Description</th>
                  <th>Status</th>
                  <th>SLA Performance</th>
                  <th>Assigned Officer Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className="table-mono">{item.id}</span>
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
                      <Badge variant={item.statusVariant} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {item.slaRemainingHours > 0 ? `${item.slaRemainingHours}h left` : 'Lapsed / Breached'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.escalationTier !== 'Tier 1' ? '#DC2626' : 'inherit' }}>
                        {item.escalationTier}: {item.escalationLevelName.split(' ')[0]}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/track?id=${item.id}`}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.6875rem' }}
                      >
                        Details
                      </Link>
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
