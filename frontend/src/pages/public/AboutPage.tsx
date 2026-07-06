import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Sidebar } from '../../components/layout/Sidebar';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mesajınız uğurla göndərildi! Sizinlə tezliklə əlaqə saxlayacağıq.`);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="fade-in">
      <Header />
      <main className="container" style={{ marginTop: 'var(--spacing-lg)', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--spacing-xl)' }}>
        <div>
          <h2 className="section-title">{t('nav_about')}</h2>

          <div style={{
            backgroundColor: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--accent-primary)' }}>Biz Kimik?</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '20px' }}>
              <strong>Panorama</strong> olaraq hədəfimiz, oxucularımıza sürətli, doğru və tərəfsiz xəbər təqdim etməkdir.
              Dünyada və ölkədə baş verən ən mühüm siyasi, iqtisadi, texnoloji və mədəni hadisələri beynəlxalq media standartlarına
              uyğun şəkildə işıqlandırırıq.
            </p>

            <h3 style={{ marginBottom: '15px', color: 'var(--accent-primary)' }}>Prinsiplərimiz</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', marginBottom: '20px' }}>
              <li><strong>Doğruluq</strong> — Məlumatı ən azı iki müstəqil mənbədən təsdiqləmədən dərc etmirik.</li>
              <li><strong>Tərəfsizlik</strong> — Hadisələrə şərh qatmadan, bütün baxış bucaqlarını ədalətli şəkildə təqdim edirik.</li>
              <li><strong>Müstəqillik</strong> — Heç bir siyasi və ya kommersiya qrupunun təsiri altında fəaliyyət göstərmirik.</li>
            </ul>
          </div>

          {/* Contact Section */}
          <h2 className="section-title">Bizimlə Əlaqə</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            {/* Contact details */}
            <div style={{
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '25px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <MapPin size={24} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Ünvan</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Bakı şəhəri, Nizami küçəsi 142</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Mail size={24} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>E-poçt</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>info@panorama.az</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Phone size={24} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Telefon</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>+994 (12) 400-00-00</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Clock size={24} style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>İş Saatları</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>7/24 Dəstək və Xəbər Mərkəzi</p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div style={{
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '25px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label className="form-label">Adınız Soyadınız</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">E-poçt</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mövzu</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label className="form-label">Mesajınız</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input"
                    style={{ resize: 'none' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                  <Send size={16} /> Göndər
                </button>
              </form>
            </div>
          </div>
        </div>
        <Sidebar />
      </main>
      <Footer />
    </div>
  );
};
export default AboutPage;
