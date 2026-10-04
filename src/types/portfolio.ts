export type ProjectType = 'graphic' | 'video' | 'website' | 'case_study';

export type ProjectStatus = 'draft' | 'published' | 'archived' | 'private';

export interface GalleryItem {
  url: string;
  alt?: string;
  caption?: string;
  aspect_ratio?: string;
}

export interface CaseStudyData {
  overview?: string;
  problem?: string;
  goal?: string;
  research?: string;
  strategy?: string;
  creative_direction?: string;
  design_process?: string;
  implementation?: string;
  results?: string;
}

export interface SeoData {
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  secondary_keywords?: string[];
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  no_index?: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  type: ProjectType;
  category: string;
  subcategory?: string;
  client?: string;
  year: string;
  short_description: string;
  description: string;
  tools: string[];
  services: string[];
  tags: string[];
  featured: boolean;
  status: ProjectStatus;
  order: number;
  featured_image: string;
  aspect_ratio?: string;
  custom_width?: number;
  custom_height?: number;
  orientation?: 'portrait' | 'landscape' | 'square';
  format_name?: string;
  alt_text: string;
  caption?: string;
  video_url?: string;
  video_type?: string;
  duration?: string;
  website_url?: string;
  design_role?: string;
  development_role?: string;
  desktop_screenshot?: string;
  tablet_screenshot?: string;
  mobile_screenshot?: string;
  gallery?: GalleryItem[];
  case_study?: CaseStudyData;
  seo: SeoData;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  industry: string;
  logo: string;
  website_url?: string;
  description?: string;
  order: number;
  enabled: boolean;
}

export interface Review {
  id: string;
  client_name: string;
  company: string;
  profile_image?: string;
  company_logo?: string;
  review: string;
  rating?: number;
  project_name?: string;
  featured: boolean;
  published: boolean;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export interface SiteSettings {
  name: string;
  professional_title: string;
  bio: string;
  roles: string[];
  phone: string;
  email: string;
  social_handle: string;
  social_links: { platform: string; url: string }[];
  profile_photo: string;
  accent_color: string;
  services: { title: string; short_description: string; enabled: boolean }[];
  footer_text: string;
  default_seo_title: string;
  default_seo_description: string;
  default_og_image: string;
  google_analytics_id?: string;
  search_console_code?: string;
  homepage_limits: {
    graphic: number;
    video: number;
    website: number;
  };
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size?: string;
  dimensions?: string;
  aspect_ratio?: string;
  created_at: string;
}
