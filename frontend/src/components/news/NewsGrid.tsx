import React from 'react';
import { ArticleListDto } from '../../types';
import { NewsCard } from './NewsCard';
import { CardSkeleton } from '../common/SkeletonLoader';

interface NewsGridProps {
  articles: ArticleListDto[];
  loading: boolean;
  count?: number;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ articles, loading, count = 6 }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3">
      {articles.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
};
