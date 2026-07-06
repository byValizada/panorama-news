import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { categoryApi } from '../../api/categoryApi';
import { Category } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

export const Footer: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll(language);
        setCategories(data.slice(0, 5)); // show first 5 categories in footer
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, [language]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Successfully subscribed: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">
            PANORAMA<span>.</span>
          </div>
          <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>{t('footer_desc')}</p>
          <div className="footer-socials">
            <a href="https://facebook.com/panorama" target="_blank" rel="noreferrer" className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://twitter.com/panorama" target="_blank" rel="noreferrer" className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="https://instagram.com/panorama" target="_blank" rel="noreferrer" className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://youtube.com/panorama" target="_blank" rel="noreferrer" className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
            </a>
          </div>
        </div>

        <div>
          <div className="footer-title">{t('categories')}</div>
          <ul className="footer-links">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer-title">Panorama</div>
          <ul className="footer-links">
            <li>
              <Link to="/about">{t('nav_about')}</Link>
            </li>
            <li>
              <Link to="/admin">{t('nav_admin')}</Link>
            </li>
            <li>
              <a href="#contact">Əlaqə</a>
            </li>
            <li>
              <a href="#privacy">Gizlilik Siyasəti</a>
            </li>
          </ul>
        </div>

        <div>
          <div className="footer-title">{t('newsletter_title')}</div>
          <p style={{ fontSize: '0.85rem' }}>{t('newsletter_subtitle')}</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter_placeholder')}
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Panorama. {t('footer_rights')}
        </p>
      </div>
    </footer>
  );
};
