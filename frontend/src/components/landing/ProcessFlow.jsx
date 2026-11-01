import React from 'react';
import { FileEdit, GitFork, Clock3, CheckCircle, ArrowRight } from 'lucide-react';
import Card from '../common/Card';

const PROCESS_STEPS = [
  {
    stepNumber: '01',
    title: 'Grievance Submission',
    subtitle: 'Citizen Logs Issue',
    icon: FileEdit,
    description: 'The citizen selects the appropriate civic category, pins the location/ward, enters issue details, and receives a unique complaint tracking number.',
    deliverable: 'Unique Reference Code Generated (e.g. MCT-SAMPLE-001)'
  },
  {
    stepNumber: '02',
    title: 'Departmental Routing',
    subtitle: 'Automated Assignment',
    icon: GitFork,
    description: 'The system maps the complaint to the designated municipal wing and dispatches the ticket directly to the assigned Ward Junior Engineer.',
    deliverable: 'Designated Field Officer Assigned'
  },
  {
    stepNumber: '03',
    title: 'SLA Countdown & Action',
    subtitle: 'Time-Bound Field Action',
    icon: Clock3,
    description: 'An automated timer begins counting down against the department’s SLA policy. The field team conducts inspections and logs operational updates.',
    deliverable: 'Active Countdown with Real-Time Status Updates'
  },
  {
    stepNumber: '04',
    title: 'Resolution or Escalation',
    subtitle: 'Automated Enforcement',
    icon: CheckCircle,
    description: 'Work is marked resolved upon inspection. If the SLA window expires without resolution, the system automatically escalates the ticket to higher administrative tiers.',
    deliverable: 'Resolution Verification or Tier 2 Escalation Trigger'
  }
];

/**
 * ProcessFlow Component
 * Explains the 4-phase grievance lifecycle from initial reporting to resolution or escalation.
 */
export default function ProcessFlow() {
  return (
    <section className="process-section" id="process" aria-labelledby="process-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">
            <Clock3 size={14} aria-hidden="true" />
            Operational Lifecycle
          </span>
          <h2 id="process-heading" className="section-title">
            How the Civic Complaint Workflow Works
          </h2>
          <p className="section-subtitle">
            A transparent 4-stage operational pipeline designed to eliminate administrative bottlenecks and ensure every civic issue has clear ownership and time limits.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="process-grid">
          {PROCESS_STEPS.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div key={step.stepNumber} className="process-step-wrapper">
                <Card className="process-step-card">
                  <div className="process-card-top">
                    <span className="process-step-badge">{step.stepNumber}</span>
                    <div className="process-icon-box" aria-hidden="true">
                      <IconComp size={22} />
                    </div>
                  </div>

                  <h3 className="process-step-title">{step.title}</h3>
                  <span className="process-step-subtitle">{step.subtitle}</span>
                  <p className="process-step-desc">{step.description}</p>

                  <div className="process-deliverable-box">
                    <span className="deliverable-label">Key Outcome:</span>
                    <span className="deliverable-text">{step.deliverable}</span>
                  </div>
                </Card>
                {idx < PROCESS_STEPS.length - 1 && (
                  <div className="process-connector" aria-hidden="true">
                    <ArrowRight size={20} className="connector-arrow" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
