import React, { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Save, X } from 'lucide-react';
import { categoryApi } from '../../api/categoryApi';
import { Category } from '../../types';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#E63946');
  const [icon, setIcon] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [nameAz, setNameAz] = useState('');
  const [descAz, setDescAz] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [descRu, setDescRu] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryApi.getAllAdmin('az');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setSlug('');
    setColor('#E63946');
    setIcon('');
    setSortOrder(0);
    setNameAz('');
    setDescAz('');
    setNameEn('');
    setDescEn('');
    setNameRu('');
    setDescRu('');
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEdit = (cat: Category) => {
    setIsEditing(cat.id);
    setIsAdding(false);
    setSlug(cat.slug);
    setColor(cat.color);
    setIcon(cat.icon || '');
    setSortOrder(cat.sortOrder);
    
    // In real app we fetch translations from the Category API. Let's mock or use the API translation structure.
    // If translations are not returned in the admin list, we can load them or let's update them
    setNameAz(cat.name);
    setDescAz(cat.description || '');
    // In a fully populated DTO we get all translations, let's assume we have translations inside Category.
    // We can fallback to name if not provided.
    setNameEn(cat.translations?.find(t => t.language === 'en')?.name || cat.name);
    setDescEn(cat.translations?.find(t => t.language === 'en')?.description || '');
    setNameRu(cat.translations?.find(t => t.language === 'ru')?.name || cat.name);
    setDescRu(cat.translations?.find(t => t.language === 'ru')?.description || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      slug,
      color,
      icon,
      sortOrder,
      translations: [
        { language: 'az', name: nameAz, description: descAz },
        { language: 'en', name: nameEn, description: descEn },
        { language: 'ru', name: nameRu, description: descRu },
      ],
    };

    try {
      if (isEditing) {
        await categoryApi.update(isEditing, payload);
      } else {
        await categoryApi.create(payload);
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      alert('Error saving category');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu kateqoriyanı silmək istədiyinizdən əminsiniz?')) {
      try {
        await categoryApi.delete(id);
        fetchCategories();
      } catch (error: any) {
        alert(error?.message || 'Kateqoriyanı silmək mümkün olmadı.');
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Kateqoriyalar</h1>
        {!isAdding && !isEditing && (
          <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ padding: '10px 15px' }}>
            <Plus size={16} /> Yeni Kateqoriya
          </button>
        )}
      </div>

      {/* CRUD Form (Add / Edit) */}
      {(isAdding || isEditing) && (
        <form onSubmit={handleSave} style={{
          backgroundColor: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ marginBottom: '15px' }}>{isEditing ? 'Kateqoriyanı Redaktə Et' : 'Yeni Kateqoriya Yaradın'}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Slug (URL)</label>
              <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="form-input" placeholder="siyaset" />
            </div>
            <div className="form-group">
              <label className="form-label">Rəng (Hex)</label>
              <input type="color" required value={color} onChange={(e) => setColor(e.target.value)} className="form-input" style={{ height: '40px', padding: '2px' }} />
            </div>
            <div className="form-group">
              <label className="form-label">İkon</label>
              <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="form-input" placeholder="Globe" />
            </div>
            <div className="form-group">
              <label className="form-label">Sıralama</label>
              <input type="number" required value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="form-input" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* AZ Translation */}
            <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '15px' }}>
              <h4 style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}>🇦🇿 AZ Mətnlər</h4>
              <div className="form-group">
                <label className="form-label">Adı</label>
                <input type="text" required value={nameAz} onChange={(e) => setNameAz(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Təsvir</label>
                <textarea rows={2} value={descAz} onChange={(e) => setDescAz(e.target.value)} className="form-input" style={{ resize: 'none' }} />
              </div>
            </div>

            {/* EN Translation */}
            <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '15px' }}>
              <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '10px' }}>🇬🇧 EN Mətnlər</h4>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" required value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={2} value={descEn} onChange={(e) => setDescEn(e.target.value)} className="form-input" style={{ resize: 'none' }} />
              </div>
            </div>

            {/* RU Translation */}
            <div>
              <h4 style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>🇷🇺 RU Mətnlər</h4>
              <div className="form-group">
                <label className="form-label">Название</label>
                <input type="text" required value={nameRu} onChange={(e) => setNameRu(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Описание</label>
                <textarea rows={2} value={descRu} onChange={(e) => setDescRu(e.target.value)} className="form-input" style={{ resize: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              <X size={14} /> Ləğv et
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={14} /> Yadda saxla
            </button>
          </div>
        </form>
      )}

      {/* Categories List table */}
      {loading ? (
        <p>Kateqoriyalar yüklənir...</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Adı (AZ)</th>
                <th>Slug</th>
                <th>Rəng</th>
                <th>Sıralama</th>
                <th>Status</th>
                <th>Xəbərlər</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ fontWeight: 'bold' }}>{cat.name}</td>
                  <td>/{cat.slug}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: cat.color,
                      verticalAlign: 'middle',
                      marginRight: '6px'
                    }} />
                    {cat.color}
                  </td>
                  <td>{cat.sortOrder}</td>
                  <td>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: cat.isActive ? '#2a9d8f' : '#e63946'
                    }}>
                      {cat.isActive ? 'Aktiv' : 'Passiv'}
                    </span>
                  </td>
                  <td>{cat.articleCount} xəbər</td>
                  <td>
                    <div className="action-group">
                      <button onClick={() => handleEdit(cat)} className="btn btn-secondary">
                        <Edit size={12} /> Redaktə
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="btn btn-danger" disabled={cat.articleCount > 0}>
                        <Trash size={12} /> Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default CategoriesPage;
