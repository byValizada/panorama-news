import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';

type ThemeMode = 'light' | 'dark' | 'system';

const themeOptions: { value: ThemeMode; label: string; icon: React.ElementType }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: -4,
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' as const },
  },
};

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('panorama_theme_mode');
    return (saved as ThemeMode) || (theme === 'dark' ? 'dark' : 'light');
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Apply system preference when 'system' mode is selected
  useEffect(() => {
    if (selectedMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applySystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      const systemPrefersDark = e.matches;
      if (systemPrefersDark !== isDark) {
        toggleTheme();
      }
    };

    // Apply immediately
    applySystemTheme(mediaQuery);

    // Listen for OS-level changes
    const handler = (e: MediaQueryListEvent) => applySystemTheme(e);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [selectedMode, isDark, toggleTheme]);

  const handleSelectMode = useCallback(
    (mode: ThemeMode) => {
      setSelectedMode(mode);
      localStorage.setItem('panorama_theme_mode', mode);

      if (mode === 'light' && isDark) {
        toggleTheme();
      } else if (mode === 'dark' && !isDark) {
        toggleTheme();
      }
      // 'system' is handled by the useEffect above

      setIsOpen(false);
      triggerRef.current?.focus();
    },
    [isDark, toggleTheme],
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const TriggerIcon = isDark ? Moon : Sun;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        className="hdr-action-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Theme: ${selectedMode}. Click to change theme`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-full)',
          border: 'none',
          background: 'transparent',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
      >
        <TriggerIcon size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dropdown-menu"
            role="listbox"
            aria-label="Select theme"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              minWidth: 170,
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: 'var(--spacing-xs)',
              zIndex: 200,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              transformOrigin: 'top right',
            }}
          >
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = selectedMode === option.value;

              return (
                <button
                  key={option.value}
                  className="dropdown-item"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelectMode(option.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    background: isActive ? 'var(--surface-hover)' : 'transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: 'var(--font-body)',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon size={16} />
                  <span style={{ flex: 1 }}>{option.label}</span>
                  {isActive && <Check size={14} style={{ opacity: 0.8 }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
