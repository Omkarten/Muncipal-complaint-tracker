import React from 'react';

/**
 * Card Component
 * Standardized container with 1px border, subtle elevation, and structured sections.
 */
export default function Card({
  children,
  className = '',
  interactive = false,
  as: Component = 'div',
  ...props
}) {
  const classes = [
    'civic-card',
    interactive ? 'civic-card-interactive' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
