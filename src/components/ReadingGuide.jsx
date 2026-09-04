import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export function ReadingGuide() {
  const { readingGuide, mouseY } = useAccessibility();

  if (!readingGuide) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 w-full pointer-events-none z-40 transition-all duration-75 ease-out"
      style={{
        top: `${mouseY - 24}px`,
        height: '48px',
        backgroundColor: 'rgba(255, 230, 0, 0.12)',
        borderTop: '2px solid rgba(245, 166, 35, 0.6)',
        borderBottom: '2px solid rgba(245, 166, 35, 0.6)',
        boxShadow: '0 0 15px rgba(245, 166, 35, 0.2)'
      }}
    />
  );
}
