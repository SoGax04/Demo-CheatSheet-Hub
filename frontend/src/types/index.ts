export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort: number | null;
  date_created: string;
  date_updated: string | null;
  cheatsheets?: Cheatsheet[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  date_created: string;
}

export interface Reference {
  title: string;
  url: string;
}

export interface Cheatsheet {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  status: 'draft' | 'published' | 'archived';
  category: Category | string | null;
  tags: CheatsheetTag[] | null;
  target_name: string | null;
  target_version: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  references: Reference[] | null;
  related_cheatsheets: CheatsheetRelated[] | null;
  seo_description: string | null;
  og_image: string | null;
  user_created: string | null;
  user_updated: string | null;
  date_created: string;
  date_updated: string | null;
}

export interface CheatsheetTag {
  id: number;
  cheatsheets_id: string | Cheatsheet;
  tags_id: string | Tag;
}

export interface CheatsheetRelated {
  id: number;
  cheatsheets_id: string | Cheatsheet;
  related_cheatsheets_id: string | Cheatsheet;
}

export interface DirectusSchema {
  categories: Category[];
  tags: Tag[];
  cheatsheets: Cheatsheet[];
  cheatsheets_tags: CheatsheetTag[];
  cheatsheets_related: CheatsheetRelated[];
}
