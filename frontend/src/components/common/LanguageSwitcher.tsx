import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {(['az', 'en', 'ru'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          style={{
            fontWeight: language === lang ? 'bold' : 'normal',
            color: language === lang ? 'var(--accent-primary)' : 'var(--text-secondary)',
            textTransform: 'uppercase',
            fontSize: '0.85rem',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: language === lang ? 'var(--surface-hover)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};
