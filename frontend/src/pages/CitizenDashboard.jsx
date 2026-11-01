import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Clock, CheckCircle2, AlertTriangle, AlertOctagon, FileText, ArrowRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProjectBanner from '../components/common/ProjectBanner';
import DemoRoleBar from '../components/common/DemoRoleBar';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useComplaints } from '../context/ComplaintContext';

export default function CitizenDashboard() {
  const { complaints } = useComplaints();
  const navigate = useNavigate();

  // Calculate statistics
  const totalCount = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'Submitted' || c.status === 'Approaching SLA Deadline').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const escalatedCount = complaints.filter(c => c.status.includes('Escalate') || c.escalationTier !== 'Tier 1').length;

  return (
    <div className="dashboard-layout">
      <ProjectBanner />
      <Navbar />
      <DemoRoleBar />

      <main className="dashboard-main container" id="main-content">
        {/* Header Bar */}
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <h1 className="dashboard-title">Citizen Grievance Dashboard</h1>
            <p className="dashboard-subtitle">
              Track submitted municipal requests, monitor SLA resolution countdowns, and verify field actions.
            </p>
          </div>
          <div className="dashboard-actions">
            <Button
              variant="outline"
              size="md"
              iconLeft={<Search size={16} />}
              onClick={() => navigate('/track')}
            >
              Track Ticket
            </Button>
            <Button
              variant="primary"
              size="md"
              iconLeft={<PlusCircle size={16} />}
              onClick={() => navigate('/submit')}
            >
              File New Complaint
            </Button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-blue">
              <FileText size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalCount}</span>
              <span className="stat-label">Total Registered Grievances</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-amber">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{inProgressCount}</span>
              <span className="stat-label">Active / Under Action</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-green">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{resolvedCount}</span>
              <span className="stat-label">Successfully Resolved</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon-box stat-icon-red">
              <AlertOctagon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{escalatedCount}</span>
              <span className="stat-label">Automated SLA Escalations</span>
            </div>
          </Card>
        </div>

        {/* Complaints Table */}
        <div className="table-container">
          <div className="table-header-bar">
            <div>
              <h2 className="table-header-title">My Registered Complaints</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Demonstration records with live SLA status tags
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/submit')}
              iconLeft={<PlusCircle size={14} />}
            >
              New Submission
            </Button>
          </div>

          <div className="table-responsive">
            <table className="civic-table" aria-label="Complaints list">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Category</th>
                  <th>Grievance Subject & Location</th>
                  <th>Reported</th>
                  <th>Status</th>
                  <th>SLA Accountability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((item) => (
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
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.reportedAt}</span>
                    </td>
                    <td>
                      <Badge variant={item.statusVariant} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.status.includes('Escalate') ? '#DC2626' : 'inherit' }}>
                          {item.escalationTier} ({item.escalationLevelName.split(' ')[0]})
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                          {item.slaRemainingHours > 0 ? `${item.slaRemainingHours}h remaining` : 'Breached / Lapsed'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Link
                        to={`/track?id=${item.id}`}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        Track <ArrowRight size={12} />
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
