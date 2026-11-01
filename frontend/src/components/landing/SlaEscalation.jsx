import React from 'react';
import { ShieldAlert, ArrowDown, User, CheckCircle2, Clock } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const ESCALATION_TIERS = [
  {
    tier: 'Tier 1',
    levelName: 'Ward Field Officer Level',
    officerRole: 'Ward Junior Engineer (Civil/Electrical/Sanitation)',
    triggerCondition: 'Initial Complaint Lodged',
    slaWindow: 'Standard Resolution Window (12h - 48h Configurable)',
    badgeVariant: 'on-schedule',
    badgeText: 'Initial Assignment',
    responsibilities: [
      'Site inspection and damage verification',
      'Mobilization of departmental maintenance crew',
      'Submission of work-completion proof'
    ],
    alertLevel: 'Standard monitoring queue'
  },
  {
    tier: 'Tier 2',
    levelName: 'Sub-Divisional Oversight Level',
    officerRole: 'Assistant Executive Engineer (AEE) / Sub-Divisional Head',
    triggerCondition: 'Automated Trigger: 100% of Tier 1 SLA Window Expired without Resolution',
    slaWindow: '+24h Supervisory Resolution Grace Window',
    badgeVariant: 'warning',
    badgeText: 'Automated Tier 2 Escalation',
    responsibilities: [
      'Supervisory review of field delay reasons',
      'Resource reallocation or inter-departmental clearance',
      'Direct enquiry into non-responsive field staff'
    ],
    alertLevel: 'High-visibility dashboard flag & breach notification'
  },
  {
    tier: 'Tier 3',
    levelName: 'Zonal & Municipal Administration',
    officerRole: 'Zonal Commissioner / Municipal Executive Officer',
    triggerCondition: 'Automated Trigger: Persistent Non-Resolution beyond Tier 2 Window',
    slaWindow: 'Executive Intervention Window',
    badgeVariant: 'escalated',
    badgeText: 'Executive Escalation',
    responsibilities: [
      'Executive performance audit review',
      'Direct administrative directive to nodal officers',
      'Contractor / departmental accountability review'
    ],
    alertLevel: 'Executive breach alert on administrative oversight dashboard'
  }
];

/**
 * SlaEscalation Component
 * Detailed explanation of the multi-tier automated SLA escalation architecture.
 */
export default function SlaEscalation() {
  return (
    <section className="sla-section" id="sla-escalation" aria-labelledby="sla-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">
            <ShieldAlert size={14} aria-hidden="true" />
            Accountability Architecture
          </span>
          <h2 id="sla-heading" className="section-title">
            The Multi-Tier SLA Escalation Model
          </h2>
          <p className="section-subtitle">
            Most civic portals leave complaints unattended in stagnant queues. This system enforces strict accountability by tracking <em>HOW long</em> an issue has been open, <em>WHO</em> is responsible, and <em>WHETHER</em> a promised resolution window has been breached.
          </p>
        </div>

        {/* Tiers Visualizer */}
        <div className="sla-tiers-container">
          {ESCALATION_TIERS.map((tierData, idx) => (
            <div key={tierData.tier} className="sla-tier-card-wrapper">
              <Card className={`sla-tier-card sla-tier-card-${tierData.tier.toLowerCase().replace(' ', '')}`}>
                <div className="sla-tier-header">
                  <div className="sla-tier-identity">
                    <span className="sla-tier-badge">{tierData.tier}</span>
                    <h3 className="sla-tier-title">{tierData.levelName}</h3>
                  </div>
                  <Badge variant={tierData.badgeVariant} size="sm">
                    {tierData.badgeText}
                  </Badge>
                </div>

                <div className="sla-tier-role-box">
                  <User size={16} aria-hidden="true" />
                  <span className="sla-role-label">Assigned Authority:</span>
                  <strong className="sla-role-name">{tierData.officerRole}</strong>
                </div>

                <div className="sla-tier-condition-box">
                  <span className="condition-label">Escalation Trigger:</span>
                  <p className="condition-text">{tierData.triggerCondition}</p>
                </div>

                <div className="sla-tier-responsibilities">
                  <span className="responsibilities-label">Operational Obligations:</span>
                  <ul>
                    {tierData.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>
                        <CheckCircle2 size={15} className="check-icon" aria-hidden="true" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sla-tier-alert-footer">
                  <span className="alert-footer-label">System Monitoring State:</span>
                  <span className="alert-footer-text">{tierData.alertLevel}</span>
                </div>
              </Card>

              {idx < ESCALATION_TIERS.length - 1 && (
                <div className="sla-tier-arrow-indicator" aria-hidden="true">
                  <div className="arrow-line"></div>
                  <div className="arrow-label">
                    <Clock size={13} />
                    <span>Auto-escalates if unresolved within SLA limit</span>
                  </div>
                  <ArrowDown size={20} className="arrow-icon" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
