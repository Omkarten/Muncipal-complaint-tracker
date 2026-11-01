import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FilePlus2, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProjectBanner from '../components/common/ProjectBanner';
import DemoRoleBar from '../components/common/DemoRoleBar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useComplaints } from '../context/ComplaintContext';

export default function SubmitComplaintPage() {
  const { addComplaint } = useComplaints();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Roads & Potholes');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('Demo Resident');
  
  const [errors, setErrors] = useState({});
  const [submittedId, setSubmittedId] = useState(null);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Complaint title is required';
    if (!location.trim()) errs.location = 'Ward/locality is required';
    if (!description.trim()) errs.description = 'Please provide details of the issue';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newTicketId = addComplaint({
      title: title.trim(),
      category,
      location: location.trim(),
      priority,
      description: description.trim(),
      citizenName: citizenName.trim() || 'Demo Resident'
    });

    setSubmittedId(newTicketId);
  };

  return (
    <div className="dashboard-layout">
      <ProjectBanner />
      <Navbar />
      <DemoRoleBar />

      <main className="dashboard-main container" id="main-content">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/citizen" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        {submittedId ? (
          /* Success confirmation screen */
          <Card className="success-card">
            <div className="success-icon-badge" aria-hidden="true">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="success-title">Complaint Registered Successfully</h1>
            <p className="success-subtitle">
              Your grievance has been assigned to the municipal dispatch queue with an active SLA timer.
            </p>

            <div className="success-ticket-box">
              <span className="success-ticket-label">Generated Reference ID</span>
              <span className="success-ticket-id">{submittedId}</span>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '2rem', fontSize: '0.875rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '6px' }}>
              <p><strong>Category:</strong> {category}</p>
              <p><strong>Location:</strong> {location}</p>
              <p><strong>Title:</strong> {title}</p>
              <p><strong>SLA Resolution Window:</strong> {category.includes('Garbage') ? '12 Hours' : category.includes('Streetlight') ? '36 Hours' : category.includes('Roads') ? '48 Hours' : '24 Hours'} (Sample Policy)</p>
            </div>

            <div className="success-actions">
              <Button
                variant="primary"
                size="md"
                iconRight={<ArrowRight size={16} />}
                onClick={() => navigate(`/track?id=${submittedId}`)}
              >
                Track this Complaint Now
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setSubmittedId(null);
                  setTitle('');
                  setLocation('');
                  setDescription('');
                }}
              >
                File Another Complaint
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => navigate('/citizen')}
              >
                Return to Dashboard
              </Button>
            </div>
          </Card>
        ) : (
          /* Submission Form */
          <Card className="form-card">
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="section-tag">
                <FilePlus2 size={13} aria-hidden="true" />
                Citizen Grievance Form
              </span>
              <h1 className="dashboard-title">Register Municipal Grievance</h1>
              <p className="dashboard-subtitle">
                Provide issue specifics and ward location to initialize the SLA countdown timer.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                {/* Title */}
                <div className="form-group form-grid-full">
                  <label htmlFor="comp-title" className="form-label">
                    <span>Complaint Title / Subject</span>
                    <span className="form-required">*</span>
                  </label>
                  <input
                    id="comp-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Deep crater pothole near 2nd Cross bus stop"
                    className="form-input"
                  />
                  {errors.title && <span className="form-error">{errors.title}</span>}
                </div>

                {/* Category */}
                <div className="form-group">
                  <label htmlFor="comp-category" className="form-label">
                    <span>Municipal Category</span>
                    <span className="form-required">*</span>
                  </label>
                  <select
                    id="comp-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="Roads & Potholes">Roads & Potholes (48h Sample SLA)</option>
                    <option value="Water Supply & Leakages">Water Supply & Leakages (24h Sample SLA)</option>
                    <option value="Solid Waste & Garbage">Solid Waste & Garbage (12h Sample SLA)</option>
                    <option value="Drainage & Sewage">Drainage & Sewage (24h Sample SLA)</option>
                    <option value="Streetlights & Electrical">Streetlights & Electrical (36h Sample SLA)</option>
                  </select>
                  <span className="form-hint">Governs departmental dispatch and SLA target</span>
                </div>

                {/* Priority */}
                <div className="form-group">
                  <label htmlFor="comp-priority" className="form-label">
                    <span>Severity / Priority</span>
                  </label>
                  <select
                    id="comp-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="form-select"
                  >
                    <option value="Low">Low (Routine maintenance)</option>
                    <option value="Medium">Medium (Standard priority)</option>
                    <option value="High">High (Impacting pedestrian / vehicular movement)</option>
                    <option value="Emergency">Emergency (Active hazard or flooding)</option>
                  </select>
                </div>

                {/* Location */}
                <div className="form-group form-grid-full">
                  <label htmlFor="comp-location" className="form-label">
                    <span>Ward & Specific Landmark / Location</span>
                    <span className="form-required">*</span>
                  </label>
                  <input
                    id="comp-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ward 14, 4th Cross Road opposite Community Hall"
                    className="form-input"
                  />
                  {errors.location && <span className="form-error">{errors.location}</span>}
                </div>

                {/* Description */}
                <div className="form-group form-grid-full">
                  <label htmlFor="comp-desc" className="form-label">
                    <span>Detailed Problem Description</span>
                    <span className="form-required">*</span>
                  </label>
                  <textarea
                    id="comp-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how long the issue has persisted, extent of damage, and any immediate danger..."
                    className="form-textarea"
                  />
                  {errors.description && <span className="form-error">{errors.description}</span>}
                </div>

                {/* Submitter Name */}
                <div className="form-group form-grid-full">
                  <label htmlFor="comp-name" className="form-label">
                    <span>Reporting Resident Name</span>
                  </label>
                  <input
                    id="comp-name"
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="form-input"
                  />
                  <span className="form-hint">Sample user name for demo audit logs</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => navigate('/citizen')}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  iconRight={<ArrowRight size={16} />}
                >
                  Submit & Start SLA Timer
                </Button>
              </div>
            </form>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
