import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { articleApi } from '../../api/articleApi';
import { ArticleListDto } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Sidebar } from '../../components/layout/Sidebar';
import { NewsGrid } from '../../components/news/NewsGrid';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState<ArticleListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    setCurrentPage(1); // Reset page on query change
  }, [query]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchSearchResults = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const data = await articleApi.search(query, language, currentPage, 9);
        setArticles(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Search request failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, language, currentPage]);

  return (
    <div className="fade-in">
      <Header />
      <main className="container" style={{ marginTop: 'var(--spacing-lg)', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--spacing-xl)' }}>
        <div>
          <h2 className="section-title">
            {t('search_results', { query })}
          </h2>

          {articles.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{t('search_no_results')}</p>
            </div>
          ) : (
            <NewsGrid articles={articles} loading={loading} count={6} />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="btn btn-secondary"
              >
                Geri
              </button>
              <span style={{ alignSelf: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Səhifə {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="btn btn-secondary"
              >
                İrəli
              </button>
            </div>
          )}
        </div>
        <Sidebar />
      </main>
      <Footer />
    </div>
  );
};
export default SearchPage;
