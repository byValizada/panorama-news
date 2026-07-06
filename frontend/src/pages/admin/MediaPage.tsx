import React, { useEffect, useState } from 'react';
import { Upload, Trash, Clipboard, Check } from 'lucide-react';
import { mediaApi } from '../../api/mediaApi';
import { MediaFile } from '../../types';

export const MediaPage: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await mediaApi.getAll();
      setMediaFiles(data);
    } catch (error) {
      console.error('Failed to load media files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await mediaApi.upload(file, altText);
      setAltText('');
      fetchMedia();
    } catch (error) {
      alert('Fayl yüklənərkən xəta baş verdi. Yalnız şəkillər qəbul edilir.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu media faylını silmək istədiyinizdən əminsiniz?')) {
      try {
        await mediaApi.delete(id);
        fetchMedia();
      } catch (error) {
        alert('Media silinərkən xəta baş verdi');
      }
    }
  };

  const copyToClipboard = (path: string, id: number) => {
    navigator.clipboard.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Media Kitabxanası</h1>
        <label className="btn btn-primary" style={{ padding: '10px 15px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Upload size={16} /> {uploading ? 'Yüklənir...' : 'Şəkil Yüklə'}
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>

      <div style={{
        backgroundColor: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '15px 20px',
        marginBottom: '25px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Alternativ Mətn (Alt Text):</span>
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Şəkil üçün alt mətni bura daxil edin..."
          className="form-input"
          style={{ maxWidth: '400px' }}
        />
      </div>

      {loading ? (
        <p>Media fayllar yüklənir...</p>
      ) : (
        <div className="media-grid">
          {mediaFiles.map((media) => {
            const fullUrl = `http://localhost:5277${media.filePath}`;
            return (
              <div key={media.id} className="news-card" style={{ display: 'flex', flexDirection: 'column', height: '240px' }}>
                <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderBottom: '1px solid var(--border-color)', position: 'relative' }} className="media-item">
                  <img src={fullUrl} alt={media.altText || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="media-actions">
                    <button onClick={() => copyToClipboard(media.filePath, media.id)} className="media-action-btn" title="URL Kopyala">
                      {copiedId === media.id ? <Check size={14} style={{ color: '#2a9d8f' }} /> : <Clipboard size={14} />}
                    </button>
                    <button onClick={() => handleDelete(media.id)} className="media-action-btn" style={{ color: 'var(--accent-primary)' }} title="Sil">
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {media.fileName}
                  </span>
                  <span>Ölçü: {formatSize(media.fileSize)}</span>
                  <span>Yükləyən: {media.uploadedByName}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default MediaPage;
