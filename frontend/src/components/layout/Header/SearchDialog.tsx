import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'panorama_recent_searches';
const MAX_RECENT = 5;

const TRENDING_TAGS = [
  'Azərbaycan',
  'Dünya xəbərləri',
  'Texnologiya',
  'İqtisadiyyat',
  'İdman',
];

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): void {
  const recent = getRecentSearches().filter(
    (s) => s.toLowerCase() !== query.toLowerCase()
  );
  recent.unshift(query);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT))
  );
}

function removeRecentSearch(query: string): void {
  const recent = getRecentSearches().filter(
    (s) => s.toLowerCase() !== query.toLowerCase()
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  /* ---------- Recent searches sync ---------- */

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setQuery('');
    }
  }, [isOpen]);

  /* ---------- Focus trap ---------- */

  const handleFocusTrap = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"]), a[href]'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  /* ---------- Escape & focus-trap key handler ---------- */

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      handleFocusTrap(e);
    };

    document.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handleFocusTrap]);

  /* ---------- Submit ---------- */

  const executeSearch = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;

      saveRecentSearch(trimmed);
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      onClose();
    },
    [navigate, onClose]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleRemoveRecent = (
    e: React.MouseEvent,
    searchTerm: string
  ) => {
    e.stopPropagation();
    removeRecentSearch(searchTerm);
    setRecentSearches(getRecentSearches());
  };

  /* ---------- Render ---------- */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="search-overlay"
          style={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t('search_placeholder')}
        >
          <motion.div
            ref={modalRef}
            className="search-modal"
            style={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: -24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ---- Search Form ---- */}
            <form onSubmit={handleSubmit} style={styles.inputWrapper}>
              <Search
                size={20}
                strokeWidth={2}
                style={styles.inputIcon}
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                className="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                autoFocus
                autoComplete="off"
                spellCheck={false}
                style={styles.input}
                aria-label={t('search_placeholder')}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  style={styles.clearBtn}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <kbd className="search-shortcut" style={styles.shortcut}>
                ESC
              </kbd>
            </form>

            {/* ---- Results Area ---- */}
            <div className="search-results" style={styles.results}>
              {/* Trending */}
              <section style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  <TrendingUp size={16} aria-hidden="true" />
                  Populyar axtarışlar
                </h3>
                <div style={styles.tagsRow}>
                  {TRENDING_TAGS.map((tag) => (
                    <motion.button
                      key={tag}
                      type="button"
                      onClick={() => executeSearch(tag)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      style={styles.tag}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <section style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <Clock size={16} aria-hidden="true" />
                    Son axtarışlar
                  </h3>
                  <ul style={styles.recentList} role="list">
                    {recentSearches.map((term) => (
                      <li key={term}>
                        <motion.button
                          type="button"
                          onClick={() => executeSearch(term)}
                          style={styles.recentItem}
                          whileHover={{
                            backgroundColor: 'var(--surface-hover)',
                          }}
                        >
                          <span style={styles.recentLeft}>
                            <Clock
                              size={14}
                              style={{ opacity: 0.45, flexShrink: 0 }}
                              aria-hidden="true"
                            />
                            <span style={styles.recentText}>{term}</span>
                          </span>
                          <span style={styles.recentActions}>
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => handleRemoveRecent(e, term)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleRemoveRecent(
                                    e as unknown as React.MouseEvent,
                                    term
                                  );
                                }
                              }}
                              style={styles.removeBtn}
                              aria-label={`Remove "${term}" from recent searches`}
                            >
                              <X size={14} />
                            </span>
                            <ArrowRight
                              size={14}
                              style={{ opacity: 0.35 }}
                              aria-hidden="true"
                            />
                          </span>
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </motion.div>

          {/* Responsive CSS */}
          <style>{responsiveCSS}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '12vh',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
  modal: {
    width: '100%',
    maxWidth: 640,
    margin: '0 var(--spacing-md)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
  },

  /* Input row */
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    padding: '14px var(--spacing-lg)',
    borderBottom: '1px solid var(--border-color)',
  },
  inputIcon: {
    color: 'var(--accent-primary)',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '1.05rem',
    fontFamily: 'var(--font-body)',
    lineHeight: 1.5,
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: 4,
    borderRadius: 'var(--radius-sm)',
    transition: 'color var(--transition-fast)',
    background: 'none',
    border: 'none',
  },
  shortcut: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 8px',
    borderRadius: 6,
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--surface-hover)',
    color: 'var(--text-muted)',
    fontSize: '0.7rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    lineHeight: 1.6,
    flexShrink: 0,
  },

  /* Results area */
  results: {
    padding: 'var(--spacing-lg)',
    maxHeight: '55vh',
    overflowY: 'auto',
  },

  /* Sections */
  section: {
    marginBottom: 'var(--spacing-lg)',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    color: 'var(--text-muted)',
    marginBottom: 'var(--spacing-sm)',
    fontFamily: 'var(--font-body)',
  },

  /* Tags */
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--spacing-xs)',
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 14px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--surface-hover)',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition:
      'background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast)',
    whiteSpace: 'nowrap' as const,
  },

  /* Recent list */
  recentList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  recentItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '8px var(--spacing-sm)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    background: 'none',
    border: 'none',
    textAlign: 'left' as const,
    transition: 'background-color var(--transition-fast)',
  },
  recentLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    overflow: 'hidden',
    minWidth: 0,
  },
  recentText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  recentActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    flexShrink: 0,
  },
  removeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'color var(--transition-fast)',
  },
};

/* ------------------------------------------------------------------ */
/*  Responsive CSS                                                     */
/* ------------------------------------------------------------------ */

const responsiveCSS = `
  .search-input::placeholder {
    color: var(--text-muted);
  }

  .search-results::-webkit-scrollbar {
    width: 6px;
  }
  .search-results::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: var(--radius-full);
  }

  @media (max-width: 768px) {
    .search-modal {
      margin: 0 var(--spacing-sm) !important;
      max-height: 85vh;
    }
    .search-overlay {
      padding-top: 6vh !important;
    }
  }

  @media (hover: hover) {
    .search-modal button[type="button"]:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
  }
`;
