export interface User {
  id: number;
  username: string;
  email: string;
  role: string; // Admin, Editor
  fullName?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Author {
  id: number;
  username: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface CategoryTranslation {
  language: string;
  name: string;
  description?: string;
}

export interface Category {
  id: number;
  slug: string;
  color: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  name: string; // translated
  description?: string; // translated
  articleCount: number;
  translations?: CategoryTranslation[];
}

export interface ArticleTranslation {
  language: string;
  title: string;
  summary?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  username: string;
  role: string;
  expiresAt: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
  fullName?: string;
}

export interface Article {
  id: number;
  categoryId: number;
  slug: string;
  featuredImage?: string;
  isBreaking: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  title: string; // translated
  summary?: string; // translated
  content?: string; // translated (HTML)
  category?: Category;
  author?: Author;
  translations?: ArticleTranslation[];
}

export interface ArticleListDto {
  id: number;
  slug: string;
  featuredImage?: string;
  isBreaking: boolean;
  isFeatured: boolean;
  viewCount: number;
  publishedAt?: string;
  title: string;
  summary?: string;
  categoryName: string;
  categorySlug: string;
  categoryColor: string;
  authorName: string;
}

export interface MediaFile {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  altText?: string;
  uploadedAt: string;
  uploadedByName: string;
}

export interface SiteSetting {
  key: string;
  value?: string;
  language?: string;
}

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalCategories: number;
  totalUsers: number;
  totalMediaFiles: number;
  totalViews: number;
  recentArticles: ArticleListDto[];
  topCategories: Category[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
