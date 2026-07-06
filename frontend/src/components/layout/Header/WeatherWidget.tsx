import React from 'react';
import { CloudSun } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  return (
    <div
      className="weather-widget"
      aria-label="Weather: 26°C in Bakı"
      role="status"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)',
        whiteSpace: 'nowrap',
      }}
    >
      <style>{`
        @media (max-width: 1024px) {
          .weather-widget {
            display: none !important;
          }
        }
      `}</style>
      <CloudSun size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
      <span style={{ fontWeight: 600 }}>26°C</span>
      <span
        style={{
          width: 1,
          height: 12,
          backgroundColor: 'var(--border-color)',
          flexShrink: 0,
        }}
      />
      <span>Bakı</span>
    </div>
  );
};
