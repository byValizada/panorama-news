import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FolderTree, Image, Eye, Plus, ArrowRight } from 'lucide-react';
import { settingsApi } from '../../api/settingsApi';
import { DashboardStats } from '../../types';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await settingsApi.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Dashboard statistika yüklənir...</div>;
  }

  if (!stats) return <div>Statistikanı yükləmək mümkün olmadı.</div>;

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Dashboard</h1>
        <Link to="/admin/articles?action=new" className="btn btn-primary" style={{ padding: '10px 15px' }}>
          <Plus size={16} /> Yeni Xəbər
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-val">{stats.totalArticles}</span>
            <span className="stat-lbl">Ümumi Xəbər</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Eye size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-val">{stats.totalViews.toLocaleString()}</span>
            <span className="stat-lbl">Ümumi Baxış</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FolderTree size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-val">{stats.totalCategories}</span>
            <span className="stat-lbl">Kateqoriya</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Image size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-val">{stats.totalMediaFiles}</span>
            <span className="stat-lbl">Media Fayl</span>
          </div>
        </div>
      </div>

      {/* Recent Activity lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '30px' }}>
        {/* Recent Articles */}
        <div className="admin-table-container" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Son Əlavə Olunanlar</h3>
            <Link to="/admin/articles" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Hamısına bax <ArrowRight size={14} />
            </Link>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlıq</th>
                <th>Kateqoriya</th>
                <th>Tarix</th>
                <th>Baxış</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentArticles.map((art) => (
                <tr key={art.id}>
                  <td style={{ fontWeight: 'bold' }}>
                    <Link to={`/admin/articles?edit=${art.id}`}>{art.title}</Link>
                  </td>
                  <td>
                    <span style={{
                      color: art.categoryColor,
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {art.categoryName}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : 'Qaralama'}
                  </td>
                  <td>👁️ {art.viewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Categories */}
        <div className="admin-table-container" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px' }}>Populyar Kateqoriyalar</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.topCategories.map((cat) => (
              <li key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 'bold', color: cat.color }}>
                  📁 {cat.name}
                </span>
                <span style={{ fontSize: '0.85rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--surface-hover)', fontWeight: 'bold' }}>
                  {cat.articleCount} xəbər
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
