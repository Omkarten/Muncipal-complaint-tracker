import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction, Droplets, Trash2, Waves, Lightbulb, Clock, ArrowRight, ShieldAlert } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

/**
 * MUNICIPAL GRIEVANCE CATEGORIES
 * Core civic services with configurable SLA target windows clearly labeled as sample data.
 */
const CATEGORIES = [
  {
    id: 'roads',
    name: 'Roads & Potholes',
    department: 'Roads & Civil Infrastructure Wing',
    icon: Construction,
    description: 'Reporting of road craters, pothole damage, missing curb pavers, uneven asphalt, and unpaved excavation hazards.',
    commonIssues: ['Pothole hazards', 'Caved-in asphalt', 'Broken pedestrian pavers', 'Hazardous road debris'],
    sampleSla: '48 Hours',
    slaPriority: 'Medium (Sample)',
    badgeVariant: 'teal'
  },
  {
    id: 'water',
    name: 'Water Supply & Leakages',
    department: 'Water Supply & Sewerage Board',
    icon: Droplets,
    description: 'Emergency reporting for damaged main distribution pipelines, burst valves, low supply pressure, or contaminated potable water.',
    commonIssues: ['Burst distribution pipe', 'Contaminated water', 'Low pipeline pressure', 'Faulty supply valve'],
    sampleSla: '24 Hours',
    slaPriority: 'High Priority (Sample)',
    badgeVariant: 'warning'
  },
  {
    id: 'garbage',
    name: 'Solid Waste & Garbage',
    department: 'Solid Waste Management Cell',
    icon: Trash2,
    description: 'Clearing uncollected municipal waste, overflowing community dumpsters, litter along streets, and commercial waste dumping.',
    commonIssues: ['Missed door-to-door pickup', 'Overflowing community bin', 'Open garbage dumping', 'Dead animal removal'],
    sampleSla: '12 Hours',
    slaPriority: 'Urgent Sanitation (Sample)',
    badgeVariant: 'warning'
  },
  {
    id: 'drainage',
    name: 'Drainage & Sewage',
    department: 'Stormwater & Underground Drainage Cell',
    icon: Waves,
    description: 'Addressing clogged stormwater drains, sewer backflow, broken or open manhole covers, and monsoon waterlogging.',
    commonIssues: ['Clogged roadside drain', 'Open/broken manhole cover', 'Sewage line backflow', 'Street waterlogging'],
    sampleSla: '24 Hours',
    slaPriority: 'High Priority (Sample)',
    badgeVariant: 'warning'
  },
  {
    id: 'streetlights',
    name: 'Streetlights & Electrical',
    department: 'Municipal Electrical Engineering Cell',
    icon: Lightbulb,
    description: 'Addressing non-functional streetlights, intermittent fixtures, dangling electrical cables, and damaged utility poles.',
    commonIssues: ['Non-functional streetlight', 'Dangling live cable', 'Damaged light pole', 'Dark street stretch'],
    sampleSla: '36 Hours',
    slaPriority: 'Public Safety (Sample)',
    badgeVariant: 'teal'
  }
];

/**
 * Categories Component
 * Displays the 5 municipal grievance domains, their departmental ownership,
 * and their configurable SLA resolution windows.
 */
export default function Categories({ onSelectCategory }) {
  const navigate = useNavigate();
  return (
    <section className="categories-section" id="categories" aria-labelledby="categories-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">
            <ShieldAlert size={14} aria-hidden="true" />
            Civic Service Catalog
          </span>
          <h2 id="categories-heading" className="section-title">
            Municipal Complaint Categories
          </h2>
          <p className="section-subtitle">
            Grievances are classified into standardized municipal domains, each linked to a specific administrative department and governed by configurable SLA resolution windows.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Card key={cat.id} className="category-card" interactive>
                <div className="category-card-top">
                  <div className="category-icon-wrapper" aria-hidden="true">
                    <IconComponent size={24} />
                  </div>
                  <Badge variant={cat.badgeVariant} size="sm">
                    {cat.slaPriority}
                  </Badge>
                </div>

                <div className="category-card-body">
                  <h3 className="category-title">{cat.name}</h3>
                  <span className="category-dept">{cat.department}</span>
                  <p className="category-desc">{cat.description}</p>

                  <div className="category-issues-list">
                    <span className="category-issues-label">Typical Grievances:</span>
                    <ul>
                      {cat.commonIssues.map((issue, idx) => (
                        <li key={idx}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="category-card-footer">
                  <div className="category-sla-indicator">
                    <Clock size={15} aria-hidden="true" />
                    <div>
                      <span className="sla-label">Sample SLA Window</span>
                      <strong className="sla-value">{cat.sampleSla}</strong>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconRight={<ArrowRight size={14} />}
                    onClick={() => navigate('/submit')}
                    aria-label={`File a complaint in ${cat.name}`}
                  >
                    File in Category
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Notice on SLA configurability */}
        <div className="sla-disclaimer-card" role="note">
          <p>
            <strong>Note on SLA Policy Configuration:</strong> All resolution windows shown above (12h, 24h, 36h, 48h) are demonstration parameters. In an active municipal deployment, SLA targets can be configured per ward severity, seasonal conditions (e.g. monsoon alerts), and emergency status.
          </p>
        </div>
      </div>
    </section>
  );
}
