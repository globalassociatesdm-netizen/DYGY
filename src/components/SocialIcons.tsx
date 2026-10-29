import React from 'react';

export const Instagram: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 20, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Facebook: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 20, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const Linkedin: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 20, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Google: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 20, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M22 12c0-.67-.06-1.32-.18-1.94H12v3.88h5.6c-.24 1.3-.98 2.4-2.1 3.14v2.6h3.4C20.88 17.84 22 15.17 22 12z" />
    <path d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.4-2.64c-.9.6-2.05.96-3.23.96-2.48 0-4.58-1.68-5.33-3.94H3.14v2.73C4.78 19.92 8.13 22 12 22z" />
    <path d="M6.67 13.95A5.99 5.99 0 0 1 6.36 12c0-.68.12-1.34.31-1.95V7.32H3.14A10 10 0 0 0 2 12c0 1.62.39 3.14 1.14 4.68l3.53-2.73z" />
    <path d="M12 5.92c1.47 0 2.78.5 3.82 1.5l2.86-2.86C16.96 2.92 14.69 2 12 2 8.13 2 4.78 4.08 3.14 7.32l3.53 2.73C7.42 7.6 9.52 5.92 12 5.92z" />
  </svg>
);
