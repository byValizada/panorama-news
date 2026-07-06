import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Plus, Trash, Edit, Save, X, Eye, Image } from 'lucide-react';
import { articleApi } from '../../api/articleApi';
import { categoryApi } from '../../api/categoryApi';
import { mediaApi } from '../../api/mediaApi';
import { Article, ArticleListDto, Category, MediaFile } from '../../types';
import { slugify } from '../../utils/slugify';

export const ArticlesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editIdParam = searchParams.get('edit');
  const actionParam = searchParams.get('action');

  const [articles, setArticles] = useState<ArticleListDto[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Form states
  const [categoryId, setCategoryId] = useState(0);
  const [slug, setSlug] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  
  // Translation tabs states
  const [activeTab, setActiveTab] = useState<'az' | 'en' | 'ru'>('az');
  
  const [titleAz, setTitleAz] = useState('');
  const [summaryAz, setSummaryAz] = useState('');
  const [contentAz, setContentAz] = useState('');
  const [metaTitleAz, setMetaTitleAz] = useState('');
  const [metaDescAz, setMetaDescAz] = useState('');

  const [titleEn, setTitleEn] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [metaTitleEn, setMetaTitleEn] = useState('');
  const [metaDescEn, setMetaDescEn] = useState('');

  const [titleRu, setTitleRu] = useState('');
  const [summaryRu, setSummaryRu] = useState('');
  const [contentRu, setContentRu] = useState('');
  const [metaTitleRu, setMetaTitleRu] = useState('');
  const [metaDescRu, setMetaDescRu] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articleApi.getAllAdmin('az', currentPage, 10);
      setArticles(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndMedia = async () => {
    try {
      const cats = await categoryApi.getAll('az');
      setCategories(cats);
      const media = await mediaApi.getAll();
      setMediaFiles(media);
    } catch (error) {
      console.error('Failed to load form helpers:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategoriesAndMedia();
  }, [currentPage]);

  useEffect(() => {
    if (editIdParam) {
      handleEdit(Number(editIdParam));
    } else if (actionParam === 'new') {
      setIsFormOpen(true);
      setEditingId(null);
    }
  }, [editIdParam, actionParam]);

  useEffect(() => {
    if (!editingId && titleAz) {
      setSlug(slugify(titleAz));
    }
  }, [titleAz, editingId]);

  const handleEdit = async (id: number) => {
    try {
      setLoading(true);
      const art = await articleApi.getByIdAdmin(id, 'az');
      setEditingId(art.id);
      setCategoryId(art.categoryId);
      setSlug(art.slug);
      setFeaturedImage(art.featuredImage || '');
      setIsBreaking(art.isBreaking);
      setIsFeatured(art.isFeatured);
      setIsPublished(art.isPublished);

      // Load translations
      const azTrans = (art.translations?.find((t) => t.language === 'az') || {}) as any;
      setTitleAz(azTrans.title || art.title);
      setSummaryAz(azTrans.summary || '');
      setContentAz(azTrans.content || '');
      setMetaTitleAz(azTrans.metaTitle || '');
      setMetaDescAz(azTrans.metaDescription || '');

      const enTrans = (art.translations?.find((t) => t.language === 'en') || {}) as any;
      setTitleEn(enTrans.title || '');
      setSummaryEn(enTrans.summary || '');
      setContentEn(enTrans.content || '');
      setMetaTitleEn(enTrans.metaTitle || '');
      setMetaDescEn(enTrans.metaDescription || '');

      const ruTrans = (art.translations?.find((t) => t.language === 'ru') || {}) as any;
      setTitleRu(ruTrans.title || '');
      setSummaryRu(ruTrans.summary || '');
      setContentRu(ruTrans.content || '');
      setMetaTitleRu(ruTrans.metaTitle || '');
      setMetaDescRu(ruTrans.metaDescription || '');

      setIsFormOpen(true);
    } catch (error) {
      console.error('Failed to load article details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert('Zəhmət olmasa kateqoriya seçin');
      return;
    }

    const payload = {
      categoryId,
      slug,
      featuredImage,
      isBreaking,
      isFeatured,
      isPublished,
      translations: [
        {
          language: 'az',
          title: titleAz,
          summary: summaryAz,
          content: contentAz,
          metaTitle: metaTitleAz,
          metaDescription: metaDescAz,
        },
        {
          language: 'en',
          title: titleEn || titleAz, // fallback
          summary: summaryEn,
          content: contentEn,
          metaTitle: metaTitleEn,
          metaDescription: metaDescEn,
        },
        {
          language: 'ru',
          title: titleRu || titleAz, // fallback
          summary: summaryRu,
          content: contentRu,
          metaTitle: metaTitleRu,
          metaDescription: metaDescRu,
        },
      ],
    };

    try {
      if (editingId) {
        await articleApi.update(editingId, payload);
      } else {
        await articleApi.create(payload);
      }
      resetForm();
      fetchArticles();
    } catch (error) {
      alert('Error saving article');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setCategoryId(0);
    setSlug('');
    setFeaturedImage('');
    setIsBreaking(false);
    setIsFeatured(false);
    setIsPublished(false);

    setTitleAz('');
    setSummaryAz('');
    setContentAz('');
    setMetaTitleAz('');
    setMetaDescAz('');

    setTitleEn('');
    setSummaryEn('');
    setContentEn('');
    setMetaTitleEn('');
    setMetaDescEn('');

    setTitleRu('');
    setSummaryRu('');
    setContentRu('');
    setMetaTitleRu('');
    setMetaDescRu('');

    setIsFormOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu məqaləni silmək istədiyinizdən əminsiniz?')) {
      try {
        await articleApi.delete(id);
        fetchArticles();
      } catch (error) {
        alert('Məqalə silinərkən xəta baş verdi');
      }
    }
  };

  const selectMedia = (path: string) => {
    setFeaturedImage(path);
    setIsMediaModalOpen(false);
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Xəbərlər</h1>
        {!isFormOpen && (
          <button onClick={() => setIsFormOpen(true)} className="btn btn-primary" style={{ padding: '10px 15px' }}>
            <Plus size={16} /> Yeni Xəbər
          </button>
        )}
      </div>

      {isFormOpen ? (
        <form onSubmit={handleSave} style={{
          backgroundColor: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '25px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Xəbəri Redaktə Et' : 'Yeni Xəbər Yaradın'}</h3>

          {/* Settings Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '20px', marginBottom: '25px' }}>
            <div>
              <div className="form-group">
                <label className="form-label">Kateqoriya</label>
                <select required value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="form-input" style={{ appearance: 'auto' }}>
                  <option value={0}>Kateqoriya seçin</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Slug (URL)</label>
                <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="form-input" placeholder="xəbərin-url-adi" />
              </div>
            </div>

            <div>
              <div className="form-group">
                <label className="form-label">Əsas Şəkil URL</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} className="form-input" placeholder="/uploads/media/uuid.jpg" />
                  <button type="button" onClick={() => setIsMediaModalOpen(true)} className="btn btn-secondary" style={{ height: '40px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image size={18} />
                  </button>
                </div>
              </div>

              {featuredImage && (
                <div style={{ width: '100%', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={`http://localhost:5277${featuredImage}`} alt="featured preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Variantlar</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  <input type="checkbox" checked={isBreaking} onChange={(e) => setIsBreaking(e.target.checked)} />
                  Son Dəqiqə (Breaking News)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                  Önə Çıxan (Featured Hero)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                  <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                  Dərc edilsin (Published)
                </label>
              </div>
            </div>
          </div>

          {/* Translation tabs header */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px', gap: '10px' }}>
            {(['az', 'en', 'ru'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  borderBottom: activeTab === tab ? '3px solid var(--accent-primary)' : 'none',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                {tab === 'az' ? '🇦🇿 AZ' : tab === 'en' ? '🇬🇧 EN' : '🇷🇺 RU'}
              </button>
            ))}
          </div>

          {/* AZ Content */}
          {activeTab === 'az' && (
            <div>
              <div className="form-group">
                <label className="form-label">Başlıq (AZ)</label>
                <input type="text" required value={titleAz} onChange={(e) => setTitleAz(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Qısa Xülasə (AZ)</label>
                <textarea rows={2} value={summaryAz} onChange={(e) => setSummaryAz(e.target.value)} className="form-input" style={{ resize: 'none' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Məqalə Mətni (AZ)</label>
                <ReactQuill value={contentAz} onChange={setContentAz} theme="snow" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginTop: '20px' }}>
                <div className="form-group">
                  <label className="form-label">SEO Meta Title (AZ)</label>
                  <input type="text" value={metaTitleAz} onChange={(e) => setMetaTitleAz(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO Meta Description (AZ)</label>
                  <input type="text" value={metaDescAz} onChange={(e) => setMetaDescAz(e.target.value)} className="form-input" />
                </div>
              </div>
            </div>
          )}

          {/* EN Content */}
          {activeTab === 'en' && (
            <div>
              <div className="form-group">
                <label className="form-label">Title (EN)</label>
                <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Summary (EN)</label>
                <textarea rows={2} value={summaryEn} onChange={(e) => setSummaryEn(e.target.value)} className="form-input" style={{ resize: 'none' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Article Body (EN)</label>
                <ReactQuill value={contentEn} onChange={setContentEn} theme="snow" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginTop: '20px' }}>
                <div className="form-group">
                  <label className="form-label">SEO Meta Title (EN)</label>
                  <input type="text" value={metaTitleEn} onChange={(e) => setMetaTitleEn(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO Meta Description (EN)</label>
                  <input type="text" value={metaDescEn} onChange={(e) => setMetaDescEn(e.target.value)} className="form-input" />
                </div>
              </div>
            </div>
          )}

          {/* RU Content */}
          {activeTab === 'ru' && (
            <div>
              <div className="form-group">
                <label className="form-label">Заголовок (RU)</label>
                <input type="text" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Краткое содержание (RU)</label>
                <textarea rows={2} value={summaryRu} onChange={(e) => setSummaryRu(e.target.value)} className="form-input" style={{ resize: 'none' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Текст статьи (RU)</label>
                <ReactQuill value={contentRu} onChange={setContentRu} theme="snow" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginTop: '20px' }}>
                <div className="form-group">
                  <label className="form-label">SEO Meta Title (RU)</label>
                  <input type="text" value={metaTitleRu} onChange={(e) => setMetaTitleRu(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO Meta Description (RU)</label>
                  <input type="text" value={metaDescRu} onChange={(e) => setMetaDescRu(e.target.value)} className="form-input" />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              <X size={14} /> Ləğv et
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={14} /> Yadda saxla
            </button>
          </div>
        </form>
      ) : (
        /* Articles List Grid */
        <div>
          {loading ? (
            <p>Xəbərlər yüklənir...</p>
          ) : (
            <>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Başlıq</th>
                      <th>Kateqoriya</th>
                      <th>Müəllif</th>
                      <th>Tarix</th>
                      <th>Baxış</th>
                      <th>Bayraqlar</th>
                      <th>Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((art) => (
                      <tr key={art.id}>
                        <td style={{ fontWeight: 'bold', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {art.title}
                        </td>
                        <td>
                          <span style={{ color: art.categoryColor, fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                            {art.categoryName}
                          </span>
                        </td>
                        <td>{art.authorName}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : 'Draft'}
                        </td>
                        <td>👁️ {art.viewCount}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {art.isBreaking && <span style={{ backgroundColor: 'var(--accent-primary)', color: '#fff', fontSize: '0.7rem', padding: '2px 4px', borderRadius: '2px', fontWeight: 'bold' }}>Breaking</span>}
                            {art.isFeatured && <span style={{ backgroundColor: 'var(--accent-secondary)', color: '#fff', fontSize: '0.7rem', padding: '2px 4px', borderRadius: '2px', fontWeight: 'bold' }}>Featured</span>}
                          </div>
                        </td>
                        <td>
                          <div className="action-group">
                            <button onClick={() => handleEdit(art.id)} className="btn btn-secondary">
                              <Edit size={12} /> Redaktə
                            </button>
                            <button onClick={() => handleDelete(art.id)} className="btn btn-danger">
                              <Trash size={12} /> Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="btn btn-secondary">Geri</button>
                  <span style={{ alignSelf: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Səhifə {currentPage} / {totalPages}</span>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="btn btn-secondary">İrəli</button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Media Chooser Modal */}
      {isMediaModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '700px',
            padding: '25px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Şəkil seçin</h3>
              <button onClick={() => setIsMediaModalOpen(false)} style={{ color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="media-grid" style={{ overflowY: 'auto', flexGrow: 1, paddingBottom: '10px' }}>
              {mediaFiles.map((media) => (
                <div key={media.id} className="media-item" onClick={() => selectMedia(media.filePath)}>
                  <img src={`http://localhost:5277${media.filePath}`} alt={media.altText || ''} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ArticlesPage;
