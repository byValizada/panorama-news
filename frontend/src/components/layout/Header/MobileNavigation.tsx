import React, { useEffect, useRef, useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../hooks/useLanguage';
import { categoryApi } from '../../../api/categoryApi';
import { Category } from '../../../types';
import { ThemeToggle } from '../../common/ThemeToggle';
import { LanguageSwitcher } from '../../common/LanguageSwitcher';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll(language);
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, [language]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  const handleFocusTrap = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !drawerRef.current) return;

      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleFocusTrap);
      // Focus the close button when drawer opens
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleFocusTrap]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const drawerVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: { type: 'spring' as const, damping: 30, stiffness: 300 },
    },
    exit: {
      x: '100%',
      transition: { type: 'tween' as const, duration: 0.25, ease: 'easeIn' as const },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 + i * 0.04, duration: 0.3 },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay */}
          <motion.div
            className="mobile-nav-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 998,
            }}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            className="mobile-nav-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav_home')}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(320px, 85vw)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.97) 0%, rgba(5, 14, 24, 0.99) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(33, 150, 243, 0.15)',
              boxShadow: '-8px 0 40px rgba(0, 0, 0, 0.5)',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div
              className="mobile-nav-header"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--spacing-lg)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-logo)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#f1f5f9',
                  letterSpacing: '-0.5px',
                }}
              >
                PANORAMA
                <span style={{ color: 'var(--accent-primary)' }}>.</span>
              </span>

              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Close navigation menu"
                style={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav
              className="mobile-nav-links"
              style={{
                flex: 1,
                padding: 'var(--spacing-md) var(--spacing-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              {/* Home */}
              <motion.div custom={0} variants={linkVariants} initial="hidden" animate="visible">
                <NavLink
                  to="/"
                  onClick={onClose}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 48,
                    padding: '0 var(--spacing-md)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--accent-primary)' : '#cbd5e1',
                    backgroundColor: isActive ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                  })}
                >
                  {t('nav_home')}
                </NavLink>
              </motion.div>

              {/* Category links */}
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  custom={index + 1}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <NavLink
                    to={`/category/${cat.slug}`}
                    onClick={onClose}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: 48,
                      padding: '0 var(--spacing-md)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: isActive ? 'var(--accent-primary)' : '#cbd5e1',
                      backgroundColor: isActive ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                      gap: 'var(--spacing-sm)',
                    })}
                  >
                    {cat.color && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: cat.color,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {cat.name}
                  </NavLink>
                </motion.div>
              ))}

              {/* About */}
              <motion.div
                custom={categories.length + 1}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  to="/about"
                  onClick={onClose}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 48,
                    padding: '0 var(--spacing-md)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--accent-primary)' : '#cbd5e1',
                    backgroundColor: isActive ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                  })}
                >
                  {t('nav_about')}
                </NavLink>
              </motion.div>
            </nav>

            {/* Footer */}
            <div
              className="mobile-nav-footer"
              style={{
                padding: 'var(--spacing-lg)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
