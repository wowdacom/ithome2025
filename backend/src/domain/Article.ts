export type Article = {
  id?: string;
  title: string;
  category: string;
  content: string;
  slug?: string;
  created_at?: Date;
  updated_at?: Date;
};
