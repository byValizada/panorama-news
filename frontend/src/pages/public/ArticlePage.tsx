import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Eye, User, Share2 } from 'lucide-react';
import { articleApi } from '../../api/articleApi';
import { Article, ArticleListDto } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Sidebar } from '../../components/layout/Sidebar';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { Skeleton } from '../../components/common/SkeletonLoader';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchArticle = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await articleApi.getBySlug(slug, language);
        setArticle(data);
        fetchRelated(data.category?.slug);
      } catch (error) {
        console.error('Failed to fetch article details:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (catSlug?: string) => {
      if (!catSlug) return;
      try {
        setLoadingRelated(true);
        const pagedData = await articleApi.getByCategory(catSlug, language, 1, 3);
        // Exclude current article from related
        setRelatedArticles(pagedData.items.filter((a) => a.slug !== slug));
      } catch (error) {
        console.error('Failed to fetch related articles:', error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchArticle();

    // Clean up script on unmount
    return () => {
      const existingScript = document.getElementById('news-article-jsonld');
      if (existingScript) existingScript.remove();
    };
  }, [slug, language]);

  useEffect(() => {
    if (article) {
      // Remove any existing script
      const existingScript = document.getElementById('news-article-jsonld');
      if (existingScript) existingScript.remove();

      // Create new JSON-LD script
      const script = document.createElement('script');
      script.id = 'news-article-jsonld';
      script.type = 'application/ld+json';
      
      const featuredImgUrl = article.featuredImage
        ? `http://localhost:5277${article.featuredImage}`
        : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop';

      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'headline': article.title,
        'image': [featuredImgUrl],
        'datePublished': article.publishedAt || article.createdAt,
        'dateModified': article.updatedAt || article.createdAt,
        'author': {
          '@type': 'Person',
          'name': article.author?.fullName || article.author?.username,
          'url': `${window.location.origin}/author/${article.author?.username}`
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Panorama',
          'logo': {
            '@type': 'ImageObject',
            'url': `${window.location.origin}/assets/logo.svg`
          }
        },
        'description': article.summary || article.title
      });

      document.head.appendChild(script);
    }
  }, [article]);

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article?.title || '')}`, '_blank');
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="container" style={{ marginTop: 'var(--spacing-lg)', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--spacing-xl)' }}>
          <div>
            <Skeleton width="100px" height="24px" style={{ marginBottom: '15px' }} />
            <Skeleton width="90%" height="45px" style={{ marginBottom: '15px' }} />
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <Skeleton width="150px" height="18px" />
              <Skeleton width="100px" height="18px" />
            </div>
            <Skeleton height="350px" style={{ marginBottom: '25px' }} />
            <Skeleton height="20px" style={{ marginBottom: '10px' }} />
            <Skeleton height="20px" style={{ marginBottom: '10px' }} />
            <Skeleton height="20px" style={{ marginBottom: '10px' }} />
            <Skeleton width="80%" height="20px" style={{ marginBottom: '10px' }} />
          </div>
          <Sidebar />
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div>
        <Header />
        <main className="container" style={{ marginTop: '100px', textAlign: 'center', minHeight: '50vh' }}>
          <h2>Məqalə tapılmadı</h2>
          <Link to="/" style={{ color: 'var(--accent-primary)', marginTop: '20px', display: 'inline-block' }}>Ana səhifəyə qayıt</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const featuredImgUrl = article.featuredImage
    ? `http://localhost:5277${article.featuredImage}`
    : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop';

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="fade-in">
      <Header />
      <main className="container" style={{ marginTop: 'var(--spacing-lg)', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--spacing-xl)' }}>
        <article style={{ display: 'flex', flexDirection: 'column' }}>
          {article.category && (
            <CategoryBadge
              name={article.category.name}
              slug={article.category.slug}
              color={article.category.color}
            />
          )}

          <h1 style={{ fontSize: '2.5rem', marginTop: '10px', marginBottom: '15px' }}>{article.title}</h1>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            padding: '10px 0',
            marginBottom: '25px',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} />
                {article.author?.fullName || article.author?.username}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} />
                {formattedDate}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={16} />
                {article.viewCount} {t('views')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                <Share2 size={16} /> Paylaş:
              </span>
              <button onClick={shareOnFacebook} style={{ color: '#3b5998', display: 'flex', alignItems: 'center' }} title="Facebook-da paylaş">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </button>
              <button onClick={shareOnTwitter} style={{ color: '#1da1f2', display: 'flex', alignItems: 'center' }} title="Twitter-də paylaş">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </button>
            </div>
          </div>

          <div style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '30px' }}>
            <img src={featuredImgUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {article.summary && (
            <p style={{
              fontSize: '1.2rem',
              fontWeight: '500',
              lineHeight: '1.5',
              color: 'var(--text-secondary)',
              borderLeft: '4px solid var(--accent-primary)',
              paddingLeft: '15px',
              marginBottom: '30px'
            }}>
              {article.summary}
            </p>
          )}

          {/* HTML body content */}
          <div
            className="article-content"
            style={{ fontSize: '1.05rem', lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />

          {/* Related Articles list */}
          {relatedArticles.length > 0 && (
            <div style={{ marginTop: '50px', borderTop: '2px solid var(--border-color)', paddingTop: '30px' }}>
              <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{t('related_news')}</h3>
              <div className="grid grid-cols-3">
                {relatedArticles.map((rel) => {
                  const relImgUrl = rel.featuredImage
                    ? `http://localhost:5277${rel.featuredImage}`
                    : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400&auto=format&fit=crop';
                  return (
                    <div key={rel.id} className="news-card" style={{ boxShadow: 'none', border: '1px solid var(--border-color)' }}>
                      <div className="card-img-wrapper">
                        <Link to={`/article/${rel.slug}`}>
                          <img src={relImgUrl} alt={rel.title} style={{ height: '150px' }} />
                        </Link>
                      </div>
                      <div className="card-body" style={{ padding: '12px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', lineHeight: '1.3' }}>
                          <Link to={`/article/${rel.slug}`}>{rel.title}</Link>
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </article>
        <Sidebar />
      </main>
      <Footer />
    </div>
  );
};
export default ArticlePage;
