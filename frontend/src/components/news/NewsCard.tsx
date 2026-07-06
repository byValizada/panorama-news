import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Eye } from 'lucide-react';
import { ArticleListDto } from '../../types';
import { CategoryBadge } from '../common/CategoryBadge';

interface NewsCardProps {
  news: ArticleListDto;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { t } = useTranslation();

  const formattedDate = news.publishedAt
    ? new Date(news.publishedAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const imageUrl = news.featuredImage
    ? `http://localhost:5277${news.featuredImage}`
    : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop'; // placeholder image

  return (
    <article className="news-card">
      <div className="card-img-wrapper">
        <Link to={`/article/${news.slug}`}>
          <img src={imageUrl} alt={news.title} loading="lazy" />
        </Link>
      </div>
      <div className="card-body">
        <CategoryBadge name={news.categoryName} slug={news.categorySlug} color={news.categoryColor} />
        <h3 className="card-title">
          <Link to={`/article/${news.slug}`}>{news.title}</Link>
        </h3>
        <p className="card-summary">{news.summary}</p>
        <div className="card-footer">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} />
            {formattedDate}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Eye size={12} />
            {news.viewCount}
          </span>
        </div>
      </div>
    </article>
  );
};
