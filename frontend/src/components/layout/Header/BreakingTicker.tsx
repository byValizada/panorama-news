import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../hooks/useLanguage';
import { articleApi } from '../../../api/articleApi';
import { ArticleListDto } from '../../../types';

const DISMISSED_KEY = 'ticker_dismissed';

export const BreakingTicker: React.FC = () => {
  const [breakingNews, setBreakingNews] = useState<ArticleListDto[]>([]);
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem(DISMISSED_KEY) === 'true';
  });
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const data = await articleApi.getBreaking(language);
        setBreakingNews(data);
      } catch (error) {
        console.error('Failed to fetch breaking news:', error);
      }
    };
    fetchBreaking();
  }, [language]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISSED_KEY, 'true');
  };

  if (dismissed || breakingNews.length === 0) return null;

  return (
    <div className="ticker-bar" role="region" aria-label={t('breaking_news')}>
      {/* LIVE Badge */}
      <div className="ticker-live">
        LIVE
      </div>

      {/* Scrolling headlines */}
      <div className="ticker-scroll">
        <div className="ticker-scroll-track">
          {/* Original list */}
          {breakingNews.map((news) => (
            <Link key={news.id} to={`/article/${news.slug}`} className="ticker-item">
              <span className="ticker-item-dot" />
              {news.title}
            </Link>
          ))}
          {/* Duplicated list for seamless infinite loop */}
          {breakingNews.map((news) => (
            <Link
              key={`dup-${news.id}`}
              to={`/article/${news.slug}`}
              className="ticker-item"
              aria-hidden="true"
              tabIndex={-1}
            >
              <span className="ticker-item-dot" />
              {news.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Dismiss button */}
      <button
        className="ticker-dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss breaking news ticker"
      >
        <X size={16} />
      </button>
    </div>
  );
};
