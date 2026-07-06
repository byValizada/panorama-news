import React, { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Save, X } from 'lucide-react';
import axiosClient from '../../api/axiosClient'; // using client directly for simple CRUD or types
import { User } from '../../types';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Editor');
  const [isActive, setIsActive] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data: User[] = await axiosClient.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setFullName('');
    setRole('Editor');
    setIsActive(true);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEdit = (user: User) => {
    setIsEditing(user.id);
    setIsAdding(false);
    setUsername(user.username);
    setEmail(user.email);
    setPassword(''); // leave blank for no change
    setFullName(user.fullName || '');
    setRole(user.role);
    setIsActive(user.isActive);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      email,
      role,
      fullName,
      isActive,
    };
    if (password) payload.password = password;

    try {
      if (isEditing) {
        await axiosClient.put(`/admin/users/${isEditing}`, payload);
      } else {
        const createPayload = { username, email, password, role, fullName };
        await axiosClient.post('/admin/users', createPayload);
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      alert('İstifadəçi yadda saxlanılarkən xəta baş verdi.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu istifadəçini silmək istədiyinizdən əminsiniz?')) {
      try {
        await axiosClient.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert('İstifadəçi silinərkən xəta baş verdi.');
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">İstifadəçilər</h1>
        {!isAdding && !isEditing && (
          <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ padding: '10px 15px' }}>
            <Plus size={16} /> Yeni İstifadəçi
          </button>
        )}
      </div>

      {(isAdding || isEditing) && (
        <form onSubmit={handleSave} style={{
          backgroundColor: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ marginBottom: '15px' }}>{isEditing ? 'İstifadəçini Redaktə Et' : 'Yeni İstifadəçi Yaradın'}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">İstifadəçi adı</label>
              <input type="text" required disabled={!!isEditing} value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" placeholder="editor1" />
            </div>

            <div className="form-group">
              <label className="form-label">E-poçt</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="editor1@panorama.az" />
            </div>

            <div className="form-group">
              <label className="form-label">Şifrə {isEditing && '(Boş qoyula bilər)'}</label>
              <input type="password" required={!isEditing} value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Tam Adı (Ad, Soyad)</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-input" placeholder="Tural Vəlizadə" />
            </div>

            <div className="form-group">
              <label className="form-label">Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input" style={{ appearance: 'auto' }}>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select value={isActive ? 'true' : 'false'} onChange={(e) => setIsActive(e.target.value === 'true')} className="form-input" style={{ appearance: 'auto' }}>
                <option value="true">Aktiv</option>
                <option value="false">Passiv (Deaktiv)</option>
              </select>
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

      {loading ? (
        <p>İstifadəçilər yüklənir...</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ad, Soyad</th>
                <th>İstifadəçi adı</th>
                <th>E-poçt</th>
                <th>Rol</th>
                <th>Status</th>
                <th>Yaradılma Tarixi</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 'bold' }}>{u.fullName || '-'}</td>
                  <td>@{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{
                      fontWeight: 'bold',
                      color: u.role === 'Admin' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: u.isActive ? '#2a9d8f' : '#e63946'
                    }}>
                      {u.isActive ? 'Aktiv' : 'Deaktiv'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="action-group">
                      <button onClick={() => handleEdit(u)} className="btn btn-secondary">
                        <Edit size={12} /> Redaktə
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="btn btn-danger">
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
export default UsersPage;
