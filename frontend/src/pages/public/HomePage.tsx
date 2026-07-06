import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { articleApi } from '../../api/articleApi';
import { ArticleListDto } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Sidebar } from '../../components/layout/Sidebar';
import { HeroSection } from '../../components/news/HeroSection';
import { NewsGrid } from '../../components/news/NewsGrid';

export const HomePage: React.FC = () => {
  const [featuredArticles, setFeaturedArticles] = useState<ArticleListDto[]>([]);
  const [latestArticles, setLatestArticles] = useState<ArticleListDto[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    const fetchFeatured = async () => {
      try {
        setLoadingFeatured(true);
        const data = await articleApi.getFeatured(language, 4);
        setFeaturedArticles(data);
      } catch (error) {
        console.error('Failed to fetch featured articles:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    const fetchLatest = async () => {
      try {
        setLoadingLatest(true);
        const pagedData = await articleApi.getAll(language, 1, 9);
        setLatestArticles(pagedData.items);
      } catch (error) {
        console.error('Failed to fetch latest articles:', error);
      } finally {
        setLoadingLatest(false);
      }
    };

    fetchFeatured();
    fetchLatest();
  }, [language]);

  return (
    <div className="fade-in">
      <Header />
      <main className="container" style={{ marginTop: 'var(--spacing-lg)' }}>
        {/* Featured News Bento Grid */}
        <HeroSection articles={featuredArticles} loading={loadingFeatured} />

        {/* Two column grid for Latest News + Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--spacing-xl)' }}>
          <div>
            <h2 className="section-title">{t('latest_news')}</h2>
            <NewsGrid articles={latestArticles} loading={loadingLatest} count={6} />
          </div>
          <Sidebar />
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default HomePage;
