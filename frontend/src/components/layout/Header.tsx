import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from './Header/Logo';
import { Navigation } from './Header/Navigation';
import { SearchBar } from './Header/SearchBar';
import { SearchDialog } from './Header/SearchDialog';
import { ThemeSwitcher } from './Header/ThemeSwitcher';
import { LanguageSelector } from './Header/LanguageSelector';
import { WeatherWidget } from './Header/WeatherWidget';
import { NotificationMenu } from './Header/NotificationMenu';
import { ProfileMenu } from './Header/ProfileMenu';
import { MobileNavigation } from './Header/MobileNavigation';
import { BreakingTicker } from './Header/BreakingTicker';
import '../../styles/header.css';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useTranslation();

  // Scroll handler for sticky header shrink effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. Accessible Skip Link */}
      <a href="#main-content" className="skip-to-content">
        {t('skip_to_content', 'Məzmuna keçid et')}
      </a>

      {/* 2. Breaking News Ticker (sessionStorage controls visibility) */}
      <BreakingTicker />

      {/* 3. Main Premium Header */}
      <header className={`hdr ${isScrolled ? 'hdr--scrolled' : ''}`}>
        <div className="hdr-inner">
          
          {/* Left Zone: Branding & Logo */}
          <div className="hdr-zone hdr-zone--left">
            <Logo />
          </div>

          {/* Center Zone: Main Navigation (Desktop) */}
          <div className="hdr-zone hdr-zone--center">
            <Navigation />
          </div>

          {/* Right Zone: Widgets, Search, Actions & Profile */}
          <div className="hdr-zone hdr-zone--right">
            
            {/* Weather widget (hidden on tablet/mobile) */}
            <WeatherWidget />

            {/* Accent Separator */}
            <div className="hdr-divider hdr-divider--desktop-only" />

            {/* Ctrl+K Search Trigger */}
            <SearchBar onOpen={() => setIsSearchOpen(true)} />

            <div className="hdr-divider" />

            {/* Theme & Language Selectors */}
            <ThemeSwitcher />
            <LanguageSelector />

            <div className="hdr-divider" />

            {/* Notifications & Profile dropdowns */}
            <NotificationMenu />
            <ProfileMenu />

            {/* Mobile Hamburger menu */}
            <button
              className="hdr-action-btn mobile-menu-toggle"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* 4. Global Search Modal (Ctrl+K / Overlay click to close) */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* 5. Mobile Slide-out Drawer */}
      <MobileNavigation isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
};
