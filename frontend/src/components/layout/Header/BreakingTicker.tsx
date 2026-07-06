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
    <div
      className="ticker-bar"
      role="region"
      aria-label={t('breaking_news')}
      style={{
        height: 'var(--ticker-height)',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-color)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* LIVE Badge */}
      <div
        className="ticker-live"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0 var(--spacing-md)',
          height: '100%',
          backgroundColor: '#dc2626',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.8rem',
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          flexShrink: 0,
          zIndex: 2,
        }}
      >
        {/* Pulsing dot */}
        <span
          aria-hidden="true"
          style={{
            width: 8,
            height: 8,
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#fff',
            animation: 'ticker-pulse 1.5s ease-in-out infinite',
            flexShrink: 0,
          }}
        />
        LIVE
      </div>

      {/* Scrolling headlines */}
      <div
        className="ticker-scroll"
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      >
        <div
          className="ticker-track"
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            animation: 'ticker-scroll-anim 35s linear infinite',
            gap: 'var(--spacing-xl)',
            paddingLeft: 'var(--spacing-md)',
          }}
        >
          {/* Original list */}
          {breakingNews.map((news) => (
            <Link
              key={news.id}
              to={`/article/${news.slug}`}
              className="ticker-item"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--bg-color)',
                fontSize: '0.85rem',
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--bg-color)';
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: '#dc2626',
                  fontSize: '0.75rem',
                }}
              >
                ●
              </span>
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--bg-color)',
                fontSize: '0.85rem',
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--bg-color)';
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: '#dc2626',
                  fontSize: '0.75rem',
                }}
              >
                ●
              </span>
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
        style={{
          width: 'var(--ticker-height)',
          height: 'var(--ticker-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          background: 'transparent',
          color: 'rgba(255, 255, 255, 0.4)',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'color var(--transition-fast)',
          zIndex: 2,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
        }}
      >
        <X size={16} />
      </button>

      {/* Keyframe animations injected as <style> */}
      <style>{`
        @keyframes ticker-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        @keyframes ticker-scroll-anim {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ticker-scroll:hover .ticker-track {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
