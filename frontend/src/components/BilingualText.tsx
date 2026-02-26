import React from 'react';

interface BilingualTextProps {
  en: string;
  te: string;
  className?: string;
  enClassName?: string;
  teClassName?: string;
  inline?: boolean;
}

/**
 * Renders English and Telugu text together.
 * By default stacks them vertically; pass inline=true for side-by-side.
 */
export default function BilingualText({
  en,
  te,
  className = '',
  enClassName = '',
  teClassName = '',
  inline = false,
}: BilingualTextProps) {
  if (inline) {
    return (
      <span className={className}>
        <span className={enClassName}>{en}</span>
        <span className="mx-1 opacity-50">/</span>
        <span className={`opacity-80 ${teClassName}`}>{te}</span>
      </span>
    );
  }

  return (
    <span className={`flex flex-col leading-tight ${className}`}>
      <span className={enClassName}>{en}</span>
      <span className={`text-[0.8em] opacity-75 ${teClassName}`}>{te}</span>
    </span>
  );
}
