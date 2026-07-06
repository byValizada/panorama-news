import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { ArticleListDto } from '../../types';
import { CategoryBadge } from '../common/CategoryBadge';
import { Skeleton } from '../common/SkeletonLoader';

interface HeroSectionProps {
  articles: ArticleListDto[];
  loading: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ articles, loading }) => {
  if (loading) {
    return (
      <div className="hero-grid">
        <Skeleton height="450px" radius="var(--radius-lg)" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Skeleton height="140px" radius="var(--radius-md)" />
          <Skeleton height="140px" radius="var(--radius-md)" />
          <Skeleton height="140px" radius="var(--radius-md)" />
        </div>
      </div>
    );
  }

  if (articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  const mainImgUrl = mainArticle.featuredImage
    ? `http://localhost:5277${mainArticle.featuredImage}`
    : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop';

  const formatPublishDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <section className="hero-grid">
      {/* Main Large Hero Block */}
      <div className="hero-main">
        <div className="hero-img-wrapper">
          <img src={mainImgUrl} alt={mainArticle.title} />
        </div>
        <div className="hero-overlay">
          <CategoryBadge
            name={mainArticle.categoryName}
            slug={mainArticle.categorySlug}
            color={mainArticle.categoryColor}
          />
          <h2 className="hero-title">
            <Link to={`/article/${mainArticle.slug}`}>{mainArticle.title}</Link>
          </h2>
          <div className="hero-meta">
            <span>👤 {mainArticle.authorName}</span>
            <span>
              <Calendar size={12} style={{ marginRight: '4px' }} />
              {formatPublishDate(mainArticle.publishedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Side Stack of 3 Featured Articles */}
      <div className="hero-side">
        {sideArticles.map((article) => {
          const sideImgUrl = article.featuredImage
            ? `http://localhost:5277${article.featuredImage}`
            : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=300&auto=format&fit=crop';

          return (
            <div key={article.id} className="side-card">
              <div className="side-card-img">
                <Link to={`/article/${article.slug}`}>
                  <img src={sideImgUrl} alt={article.title} />
                </Link>
              </div>
              <div className="side-card-content">
                <div>
                  <CategoryBadge
                    name={article.categoryName}
                    slug={article.categorySlug}
                    color={article.categoryColor}
                  />
                  <h3 className="side-card-title" style={{ marginTop: '6px' }}>
                    <Link to={`/article/${article.slug}`}>{article.title}</Link>
                  </h3>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                  <span>{article.authorName}</span>
                  <span>{formatPublishDate(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
