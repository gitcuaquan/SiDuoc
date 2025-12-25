export interface News {
  id: string;
  title: string;
  content: string;
  slug: string;
  seo_content: string;
  seo_title: string;
  seo_keywords: string;
  thumbnail: string;
  category: string;
  created_at: Date;
  updated_at: Date;
  show_in_home: boolean;
  public: boolean;
}