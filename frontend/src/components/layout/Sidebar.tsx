import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { articleApi } from '../../api/articleApi';
import { ArticleListDto } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { SidebarSkeleton } from '../common/SkeletonLoader';

export const Sidebar: React.FC = () => {
  const [trendingNews, setTrendingNews] = useState<ArticleListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const data = await articleApi.getTrending(language, 5);
        setTrendingNews(data);
      } catch (error) {
        console.error('Failed to fetch trending news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [language]);

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <div className="widget">
        <h3 className="widget-title">{t('trending_news')}</h3>
        {loading ? (
          <SidebarSkeleton />
        ) : (
          <div className="trending-list">
            {trendingNews.map((news, index) => (
              <div key={news.id} className="trending-item">
                <div className="trending-num">{String(index + 1).padStart(2, '0')}</div>
                <div className="trending-text">
                  <Link to={`/article/${news.slug}`}>{news.title}</Link>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    📈 {news.viewCount} {t('views')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="widget" style={{ backgroundColor: 'var(--accent-secondary)', color: '#fff', border: 'none' }}>
        <h3 className="widget-title" style={{ borderBottomColor: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}>
          Panorama Premium
        </h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
          Daha dərin araşdırmalar və analitik materialları oxumaq üçün abunə olun.
        </p>
        <button
          style={{
            width: '100%',
            backgroundColor: '#fff',
            color: 'var(--accent-secondary)',
            fontWeight: '700',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
          }}
          onClick={() => alert('Premium service is coming soon!')}
        >
          İndi Qoşul
        </button>
      </div>
    </aside>
  );
};
