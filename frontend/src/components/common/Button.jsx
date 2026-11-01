import React from 'react';

/**
 * Button Component
 * Reusable, accessible button with variant styling and keyboard accessibility.
 * 
 * @param {'primary' | 'secondary' | 'outline' | 'ghost'} variant
 * @param {'sm' | 'md' | 'lg'} size
 * @param {React.ReactNode} iconLeft
 * @param {React.ReactNode} iconRight
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {iconLeft && <span className="btn-icon btn-icon-left" aria-hidden="true">{iconLeft}</span>}
      <span className="btn-label">{children}</span>
      {iconRight && <span className="btn-icon btn-icon-right" aria-hidden="true">{iconRight}</span>}
    </button>
  );
}
