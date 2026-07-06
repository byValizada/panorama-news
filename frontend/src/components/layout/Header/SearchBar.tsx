import React, { useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onOpen: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onOpen }) => {
  const { t } = useTranslation();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    },
    [onOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.button
      className="hdr-search-trigger"
      onClick={onOpen}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      aria-label={t('search_placeholder')}
      type="button"
      style={styles.trigger}
    >
      <Search size={16} strokeWidth={2.5} aria-hidden="true" />

      <span className="hdr-search-trigger__text" style={styles.text}>
        {t('search_placeholder')}
      </span>

      <kbd className="hdr-search-trigger__kbd" style={styles.kbd}>
        {navigator.platform?.toUpperCase().includes('MAC') ? '⌘K' : 'Ctrl+K'}
      </kbd>

      {/* Inline responsive styles */}
      <style>{responsiveCSS}</style>
    </motion.button>
  );
};

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    padding: '6px 14px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--surface-color)',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition:
      'border-color var(--transition-fast), box-shadow var(--transition-fast), background-color var(--transition-fast)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    lineHeight: 1.4,
  },
  text: {
    pointerEvents: 'none',
  },
  kbd: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1px 6px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--surface-hover)',
    color: 'var(--text-muted)',
    fontSize: '0.7rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    lineHeight: 1.6,
    pointerEvents: 'none',
  },
};

const responsiveCSS = `
  .hdr-search-trigger:hover {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.12);
  }

  .hdr-search-trigger:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    .hdr-search-trigger {
      width: 40px;
      height: 40px;
      padding: 0 !important;
      justify-content: center;
      border-radius: var(--radius-full);
    }

    .hdr-search-trigger__text,
    .hdr-search-trigger__kbd {
      display: none !important;
    }
  }
`;
