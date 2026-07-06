import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, title: 'Yeni xəbər dərc olundu', time: '2 dəq əvvəl', read: false },
  { id: 2, title: 'Sistemə yeni istifadəçi qoşuldu', time: '15 dəq əvvəl', read: false },
  { id: 3, title: 'Xəbər 1000 baxış aldı', time: '1 saat əvvəl', read: false },
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

export const NotificationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

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

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        className="hdr-action-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications. ${unreadCount} unread`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        style={{
          position: 'relative',
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
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            className="hdr-action-badge"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              minWidth: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ef4444',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              borderRadius: 'var(--radius-full)',
              padding: '0 4px',
              lineHeight: 1,
              border: '2px solid var(--surface-color)',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dropdown-menu"
            role="menu"
            aria-label="Notifications"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 320,
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 200,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              transformOrigin: 'top right',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px 10px',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-title)',
                }}
              >
                Bildirişlər
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#fff',
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: 'var(--radius-full)',
                    padding: '2px 8px',
                  }}
                >
                  {unreadCount} yeni
                </span>
              )}
            </div>

            {/* Notification list */}
            <div
              style={{
                maxHeight: 300,
                overflowY: 'auto',
              }}
            >
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className="dropdown-item"
                  role="menuitem"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-sm)',
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: notification.read ? 'transparent' : 'var(--surface-hover)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color var(--transition-fast)',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = notification.read
                      ? 'transparent'
                      : 'var(--surface-hover)';
                  }}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
                    );
                  }}
                >
                  {/* Unread dot */}
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: notification.read ? 'transparent' : 'var(--accent-primary)',
                      flexShrink: 0,
                      marginTop: 5,
                      border: notification.read ? '1px solid var(--border-color)' : 'none',
                    }}
                    aria-hidden="true"
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: notification.read ? 400 : 600,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-body)',
                        lineHeight: 1.4,
                        marginBottom: 2,
                      }}
                    >
                      {notification.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {notification.time}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '10px 16px',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: unreadCount > 0 ? 'var(--accent-primary)' : 'var(--surface-hover)',
                  color: unreadCount > 0 ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  cursor: unreadCount > 0 ? 'pointer' : 'default',
                  transition: 'all var(--transition-fast)',
                  opacity: unreadCount === 0 ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (unreadCount > 0) {
                    e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (unreadCount > 0) {
                    e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                  }
                }}
                aria-label="Mark all notifications as read"
              >
                Hamısını oxunmuş et
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
