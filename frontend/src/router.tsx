import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomePage from './pages/public/HomePage';
import ArticlePage from './pages/public/ArticlePage';
import CategoryPage from './pages/public/CategoryPage';
import SearchPage from './pages/public/SearchPage';
import AboutPage from './pages/public/AboutPage';

import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ArticlesPage from './pages/admin/ArticlesPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import MediaPage from './pages/admin/MediaPage';
import UsersPage from './pages/admin/UsersPage';
import SettingsPage from './pages/admin/SettingsPage';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/article/:slug',
    element: <ArticlePage />,
  },
  {
    path: '/category/:slug',
    element: <CategoryPage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },

  // Admin Auth Route
  {
    path: '/admin/login',
    element: <LoginPage />,
  },

  // Admin Dashboard Layout Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'articles',
        element: <ArticlesPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'media',
        element: <MediaPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  
  // Catch All Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
