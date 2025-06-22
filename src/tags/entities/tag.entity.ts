export interface Tag {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TagWithCounts extends Tag {
  _count: {
    collections: number;
    questions: number;
  };
}
