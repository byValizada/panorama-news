import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { articleApi } from '../../api/articleApi';
import { ArticleListDto } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

export const BreakingTicker: React.FC = () => {
  const [breakingNews, setBreakingNews] = useState<ArticleListDto[]>([]);
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

  if (breakingNews.length === 0) return null;

  return (
    <div className="ticker-container">
      <div className="ticker-badge">{t('breaking_news')}</div>
      <div className="ticker-content">
        <div className="ticker-track">
          {breakingNews.map((news) => (
            <Link key={news.id} to={`/article/${news.slug}`} className="ticker-item">
              ⚡ {news.title}
            </Link>
          ))}
          {/* Duplicate list for continuous scroll loop */}
          {breakingNews.map((news) => (
            <Link key={`dup-${news.id}`} to={`/article/${news.slug}`} className="ticker-item">
              ⚡ {news.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
