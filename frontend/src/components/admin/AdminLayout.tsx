import React, { useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderTree, Image, Settings, Users, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../common/ThemeToggle';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
        <p>Yüklənir...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="admin-wrapper">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          PANORAMA<span>.</span>
        </div>

        <ul className="admin-menu">
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-menu-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/articles" className={({ isActive }) => `admin-menu-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              Xəbərlər
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories" className={({ isActive }) => `admin-menu-link ${isActive ? 'active' : ''}`}>
              <FolderTree size={18} />
              Kateqoriyalar
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/media" className={({ isActive }) => `admin-menu-link ${isActive ? 'active' : ''}`}>
              <Image size={18} />
              Media Kitabxanası
            </NavLink>
          </li>
          {user?.role === 'Admin' && (
            <>
              <li>
                <NavLink to="/admin/users" className={({ isActive }) => `admin-menu-link ${isActive ? 'active' : ''}`}>
                  <Users size={18} />
                  İstifadəçilər
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/settings" className={({ isActive }) => `admin-menu-link ${isActive ? 'active' : ''}`}>
                  <Settings size={18} />
                  Parametrlər
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
              👤 {user?.fullName || user?.username}
            </span>
            <ThemeToggle />
          </div>
          <Link to="/" className="admin-menu-link" style={{ marginBottom: '5px' }}>
            <Globe size={18} />
            Sayta Keç
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="admin-menu-link"
            style={{ width: '100%', border: 'none', background: 'none', color: 'var(--accent-primary)', cursor: 'pointer', textAlign: 'left' }}
          >
            <LogOut size={18} />
            Çıxış
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
