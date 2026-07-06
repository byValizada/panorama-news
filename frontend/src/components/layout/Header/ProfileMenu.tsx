import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';

export const ProfileMenu: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring' as const, damping: 25, stiffness: 350, duration: 0.2 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -8,
      transition: { duration: 0.15, ease: 'easeIn' as const },
    },
  };

  // Not authenticated — show login link
  if (!isAuthenticated) {
    return (
      <Link
        to="/admin/login"
        aria-label="Giriş"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--accent-primary)',
          color: '#fff',
          fontSize: '0.875rem',
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
          textDecoration: 'none',
          transition: 'background-color var(--transition-fast)',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
        }}
      >
        <User size={16} />
        Giriş
      </Link>
    );
  }

  // Authenticated — avatar trigger + dropdown
  const initials = (user?.fullName || user?.username || 'U').charAt(0).toUpperCase();

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* Avatar trigger */}
      <button
        ref={triggerRef}
        className="profile-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`User menu for ${user?.fullName || user?.username}`}
        style={{
          width: 38,
          height: 38,
          borderRadius: 'var(--radius-full)',
          border: '2px solid var(--accent-primary)',
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
          color: '#fff',
          fontSize: '0.95rem',
          fontWeight: 700,
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--transition-fast)',
          boxShadow: isOpen ? '0 0 0 3px rgba(33, 150, 243, 0.25)' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {initials}
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dropdown-menu"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="menu"
            aria-label="User actions"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              minWidth: 220,
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              zIndex: 200,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* User info header */}
            <div
              style={{
                padding: 'var(--spacing-md)',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  marginBottom: '4px',
                }}
              >
                {user?.fullName || user?.username}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(33, 150, 243, 0.12)',
                  color: 'var(--accent-primary)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {user?.role}
              </span>
            </div>

            {/* Divider handled by borderBottom above */}

            {/* Menu items */}
            <div style={{ padding: 'var(--spacing-xs) 0' }}>
              <Link
                to="/admin/dashboard"
                className="dropdown-item"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: '10px var(--spacing-md)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <LayoutDashboard size={16} />
                İdarəetmə Paneli
              </Link>

              <Link
                to="/admin/settings"
                className="dropdown-item"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: '10px var(--spacing-md)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Settings size={16} />
                Parametrlər
              </Link>
            </div>

            {/* Divider */}
            <div
              className="dropdown-divider"
              style={{
                height: 1,
                backgroundColor: 'var(--border-color)',
                margin: '0',
              }}
            />

            {/* Logout */}
            <div style={{ padding: 'var(--spacing-xs) 0' }}>
              <button
                className="dropdown-item"
                role="menuitem"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: '10px var(--spacing-md)',
                  width: '100%',
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <LogOut size={16} />
                Çıxış
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
