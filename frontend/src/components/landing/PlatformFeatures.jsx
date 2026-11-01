import React from 'react';
import { Eye, ShieldCheck, FileSpreadsheet, Sliders, Users } from 'lucide-react';
import Card from '../common/Card';

const FEATURES = [
  {
    icon: Eye,
    title: 'Public Status Transparency',
    description: 'Citizens can track their grievance resolution timeline and assigned ward officer using only their reference number, without requiring login barriers.'
  },
  {
    icon: Sliders,
    title: 'Configurable SLA Engine',
    description: 'Departmental resolution windows are not hardcoded. Administrative officers can tune SLA targets based on seasonal exigencies, ward severity, and material availability.'
  },
  {
    icon: Users,
    title: 'Multi-Role Operational Hierarchy',
    description: 'Distinct interfaces for Citizens (reporting), Field Engineers (resolution & photo upload), and Executive Officers (supervisory audit & escalation management).'
  },
  {
    icon: FileSpreadsheet,
    title: 'Immutable Audit Trail',
    description: 'Every status transition, timestamp, officer assignment, and escalation event is immutably logged to provide accountability during departmental reviews.'
  }
];

/**
 * PlatformFeatures Component
 * Details the core functional pillars of the civic technology system.
 */
export default function PlatformFeatures() {
  return (
    <section className="features-section" id="features" aria-labelledby="features-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">
            <ShieldCheck size={14} aria-hidden="true" />
            Core Capabilities
          </span>
          <h2 id="features-heading" className="section-title">
            Engineered for Civic Accountability
          </h2>
          <p className="section-subtitle">
            Core functional design features ensuring that grievances do not get lost in administrative queues.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="features-grid">
          {FEATURES.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <Card key={idx} className="feature-card">
                <div className="feature-icon-wrapper" aria-hidden="true">
                  <IconComponent size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
