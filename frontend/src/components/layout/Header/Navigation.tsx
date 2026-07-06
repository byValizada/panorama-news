import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { categoryApi } from '../../../api/categoryApi';
import { useLanguage } from '../../../hooks/useLanguage';
import type { Category } from '../../../types';

interface NavigationProps {
  /** Optional callback fired after any link is clicked (e.g. to close a mobile menu). */
  onNavigate?: () => void;
}

/**
 * Primary desktop navigation bar.
 * Renders Home, dynamic category links, and About with an animated
 * active-indicator underline that slides between links via layoutId.
 */
export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll(language);
        if (!cancelled) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Navigation: failed to fetch categories', error);
      }
    };

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, [language]);

  const handleClick = () => {
    onNavigate?.();
  };

  return (
    <nav className="hdr-nav" role="navigation" aria-label={t('nav_home')}>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `hdr-nav-link${isActive ? ' hdr-nav-link--active' : ''}`
        }
        onClick={handleClick}
        style={{ whiteSpace: 'nowrap' }}
      >
        {({ isActive }) => (
          <>
            {t('nav_home')}
            {isActive && (
              <motion.div
                className="hdr-nav-underline"
                layoutId="nav-underline"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </>
        )}
      </NavLink>

      {categories.map((cat) => (
        <NavLink
          key={cat.id}
          to={`/category/${cat.slug}`}
          className={({ isActive }) =>
            `hdr-nav-link${isActive ? ' hdr-nav-link--active' : ''}`
          }
          onClick={handleClick}
          style={{ whiteSpace: 'nowrap' }}
        >
          {({ isActive }) => (
            <>
              {cat.name}
              {isActive && (
                <motion.div
                  className="hdr-nav-underline"
                  layoutId="nav-underline"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}

      <NavLink
        to="/about"
        className={({ isActive }) =>
          `hdr-nav-link${isActive ? ' hdr-nav-link--active' : ''}`
        }
        onClick={handleClick}
        style={{ whiteSpace: 'nowrap' }}
      >
        {({ isActive }) => (
          <>
            {t('nav_about')}
            {isActive && (
              <motion.div
                className="hdr-nav-underline"
                layoutId="nav-underline"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </>
        )}
      </NavLink>
    </nav>
  );
};
