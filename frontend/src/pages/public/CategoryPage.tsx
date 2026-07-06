import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { articleApi } from '../../api/articleApi';
import { categoryApi } from '../../api/categoryApi';
import { ArticleListDto, Category } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Sidebar } from '../../components/layout/Sidebar';
import { NewsGrid } from '../../components/news/NewsGrid';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<ArticleListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { language } = useLanguage();

  useEffect(() => {
    setCurrentPage(1); // Reset page on category change
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCategoryDetails = async () => {
      if (!slug) return;
      try {
        const cat = await categoryApi.getBySlug(slug, language);
        setCategory(cat);
      } catch (error) {
        console.error('Failed to fetch category details:', error);
      }
    };

    const fetchArticles = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await articleApi.getByCategory(slug, language, currentPage, 9);
        setArticles(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Failed to fetch category articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
    fetchArticles();
  }, [slug, language, currentPage]);

  return (
    <div className="fade-in">
      <Header />
      <main className="container" style={{ marginTop: 'var(--spacing-lg)', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--spacing-xl)' }}>
        <div>
          <h2 className="section-title">
            {category?.name || 'Kateqoriya'}
            {category?.description && (
              <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal', marginTop: '5px' }}>
                {category.description}
              </span>
            )}
          </h2>

          <NewsGrid articles={articles} loading={loading} count={6} />

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
export default CategoryPage;
