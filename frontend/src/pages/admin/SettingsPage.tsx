import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { settingsApi } from '../../api/settingsApi';
import { SiteSetting } from '../../types';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [siteLogo, setSiteLogo] = useState('');
  const [siteFavicon, setSiteFavicon] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [telegram, setTelegram] = useState('');

  // Multilingual details
  const [siteNameAz, setSiteNameAz] = useState('');
  const [siteTaglineAz, setSiteTaglineAz] = useState('');
  const [siteDescAz, setSiteDescAz] = useState('');

  const [siteNameEn, setSiteNameEn] = useState('');
  const [siteTaglineEn, setSiteTaglineEn] = useState('');
  const [siteDescEn, setSiteDescEn] = useState('');

  const [siteNameRu, setSiteNameRu] = useState('');
  const [siteTaglineRu, setSiteTaglineRu] = useState('');
  const [siteDescRu, setSiteDescRu] = useState('');

  const [activeTab, setActiveTab] = useState<'global' | 'az' | 'en' | 'ru'>('global');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await settingsApi.getAllAdmin();
        setSettings(data);

        // Global values
        setSiteLogo(data.find((s) => s.key === 'site_logo')?.value || '');
        setSiteFavicon(data.find((s) => s.key === 'site_favicon')?.value || '');
        setFacebook(data.find((s) => s.key === 'social_facebook')?.value || '');
        setTwitter(data.find((s) => s.key === 'social_twitter')?.value || '');
        setInstagram(data.find((s) => s.key === 'social_instagram')?.value || '');
        setYoutube(data.find((s) => s.key === 'social_youtube')?.value || '');
        setTelegram(data.find((s) => s.key === 'social_telegram')?.value || '');

        // AZ values
        setSiteNameAz(data.find((s) => s.key === 'site_name' && s.language === 'az')?.value || '');
        setSiteTaglineAz(data.find((s) => s.key === 'site_tagline' && s.language === 'az')?.value || '');
        setSiteDescAz(data.find((s) => s.key === 'site_description' && s.language === 'az')?.value || '');

        // EN values
        setSiteNameEn(data.find((s) => s.key === 'site_name' && s.language === 'en')?.value || '');
        setSiteTaglineEn(data.find((s) => s.key === 'site_tagline' && s.language === 'en')?.value || '');
        setSiteDescEn(data.find((s) => s.key === 'site_description' && s.language === 'en')?.value || '');

        // RU values
        setSiteNameRu(data.find((s) => s.key === 'site_name' && s.language === 'ru')?.value || '');
        setSiteTaglineRu(data.find((s) => s.key === 'site_tagline' && s.language === 'ru')?.value || '');
        setSiteDescRu(data.find((s) => s.key === 'site_description' && s.language === 'ru')?.value || '');
      } catch (error) {
        console.error('Failed to load site settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: SiteSetting[] = [
      // Global
      { key: 'site_logo', value: siteLogo },
      { key: 'site_favicon', value: siteFavicon },
      { key: 'social_facebook', value: facebook },
      { key: 'social_twitter', value: twitter },
      { key: 'social_instagram', value: instagram },
      { key: 'social_youtube', value: youtube },
      { key: 'social_telegram', value: telegram },

      // AZ
      { key: 'site_name', value: siteNameAz, language: 'az' },
      { key: 'site_tagline', value: siteTaglineAz, language: 'az' },
      { key: 'site_description', value: siteDescAz, language: 'az' },

      // EN
      { key: 'site_name', value: siteNameEn, language: 'en' },
      { key: 'site_tagline', value: siteTaglineEn, language: 'en' },
      { key: 'site_description', value: siteDescEn, language: 'en' },

      // RU
      { key: 'site_name', value: siteNameRu, language: 'ru' },
      { key: 'site_tagline', value: siteTaglineRu, language: 'ru' },
      { key: 'site_description', value: siteDescRu, language: 'ru' },
    ];

    try {
      await settingsApi.updateBulk(payload);
      alert('Parametrlər uğurla yeniləndi!');
    } catch (error) {
      alert('Xəta baş verdi');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Parametrlər yüklənir...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Sayt Parametrləri</h1>
      </div>

      <form onSubmit={handleSave} style={{
        backgroundColor: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '25px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Tabs Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '25px', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('global')}
            style={{
              padding: '10px 20px',
              borderBottom: activeTab === 'global' ? '3px solid var(--accent-primary)' : 'none',
              fontWeight: 'bold',
              color: activeTab === 'global' ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
          >
            ⚙️ Qlobal Parametrlər
          </button>
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

        {/* Global tab contents */}
        {activeTab === 'global' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Logo URL</label>
                <input type="text" value={siteLogo} onChange={(e) => setSiteLogo(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Favicon URL</label>
                <input type="text" value={siteFavicon} onChange={(e) => setSiteFavicon(e.target.value)} className="form-input" />
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', margin: '20px 0 10px', color: 'var(--accent-primary)' }}>Sosial Şəbəkələr</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Facebook</label>
                <input type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="form-input" placeholder="https://facebook.com/page" />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter / X</label>
                <input type="url" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="form-input" placeholder="https://x.com/username" />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram</label>
                <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="form-input" placeholder="https://instagram.com/profile" />
              </div>
              <div className="form-group">
                <label className="form-label">YouTube</label>
                <input type="url" value={youtube} onChange={(e) => setYoutube(e.target.value)} className="form-input" placeholder="https://youtube.com/channel" />
              </div>
              <div className="form-group">
                <label className="form-label">Telegram</label>
                <input type="url" value={telegram} onChange={(e) => setTelegram(e.target.value)} className="form-input" placeholder="https://t.me/channel" />
              </div>
            </div>
          </div>
        )}

        {/* AZ tab contents */}
        {activeTab === 'az' && (
          <div>
            <div className="form-group">
              <label className="form-label">Saytın Adı (AZ)</label>
              <input type="text" value={siteNameAz} onChange={(e) => setSiteNameAz(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Süar / Tagline (AZ)</label>
              <input type="text" value={siteTaglineAz} onChange={(e) => setSiteTaglineAz(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Sayt haqqında qısa təsvir (AZ)</label>
              <textarea rows={3} value={siteDescAz} onChange={(e) => setSiteDescAz(e.target.value)} className="form-input" style={{ resize: 'none' }} />
            </div>
          </div>
        )}

        {/* EN tab contents */}
        {activeTab === 'en' && (
          <div>
            <div className="form-group">
              <label className="form-label">Site Name (EN)</label>
              <input type="text" value={siteNameEn} onChange={(e) => setSiteNameEn(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Tagline (EN)</label>
              <input type="text" value={siteTaglineEn} onChange={(e) => setSiteTaglineEn(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Site Description (EN)</label>
              <textarea rows={3} value={siteDescEn} onChange={(e) => setSiteDescEn(e.target.value)} className="form-input" style={{ resize: 'none' }} />
            </div>
          </div>
        )}

        {/* RU tab contents */}
        {activeTab === 'ru' && (
          <div>
            <div className="form-group">
              <label className="form-label">Название сайта (RU)</label>
              <input type="text" value={siteNameRu} onChange={(e) => setSiteNameRu(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Слоган (RU)</label>
              <input type="text" value={siteTaglineRu} onChange={(e) => setSiteTaglineRu(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Описание сайта (RU)</label>
              <textarea rows={3} value={siteDescRu} onChange={(e) => setSiteDescRu(e.target.value)} className="form-input" style={{ resize: 'none' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', gap: '8px' }}>
            <Save size={16} /> Yadda saxla
          </button>
        </div>
      </form>
    </div>
  );
};
export default SettingsPage;
