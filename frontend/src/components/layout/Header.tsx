import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { categoryApi } from '../../api/categoryApi';
import { Category } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { SearchBar } from '../common/SearchBar';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { BreakingTicker } from './BreakingTicker';

export const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { language } = useLanguage();

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

  return (
    <div className="header-wrapper">
      <BreakingTicker />
      <header className="container nav-container">
        <Link to="/" className="logo">
          PANORAMA<span>.</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav_home')}
              </NavLink>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <NavLink
                  to={`/category/${cat.slug}`}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink 
                to="/about" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav_about')}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <SearchBar />
          <ThemeToggle />
          <LanguageSwitcher />
          <button className="action-btn menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
    </div>
  );
};
