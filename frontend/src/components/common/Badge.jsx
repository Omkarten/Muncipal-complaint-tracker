import React from 'react';

/**
 * Badge Component
 * Displays categorical tags, SLA status indicators, and metadata pills.
 * 
 * @param {'default' | 'on-schedule' | 'in-progress' | 'warning' | 'escalated' | 'teal'} variant
 * @param {'sm' | 'md'} size
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon = null,
  className = ''
}) {
  const classes = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {icon && <span className="badge-icon" aria-hidden="true">{icon}</span>}
      <span className="badge-text">{children}</span>
    </span>
  );
}
