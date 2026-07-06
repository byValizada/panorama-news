import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryBadgeProps {
  name: string;
  slug: string;
  color: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ name, slug, color }) => {
  return (
    <Link
      to={`/category/${slug}`}
      className="category-badge"
      style={{
        backgroundColor: color || 'var(--accent-primary)',
        transition: 'filter var(--transition-fast)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.9)')}
      onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
    >
      {name}
    </Link>
  );
};
