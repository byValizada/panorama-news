import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search_placeholder')}
        style={{
          padding: '6px 36px 6px 12px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          width: '180px',
          transition: 'width var(--transition-normal), border-color var(--transition-fast)',
          backgroundColor: 'var(--surface-color)',
          color: 'var(--text-primary)',
        }}
        onFocus={(e) => (e.currentTarget.style.width = '240px')}
        onBlur={(e) => {
          if (!query) e.currentTarget.style.width = '180px';
        }}
      />
      <button
        type="submit"
        style={{
          position: 'absolute',
          right: '10px',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Search size={16} />
      </button>
    </form>
  );
};
