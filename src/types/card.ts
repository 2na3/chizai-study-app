export interface Card {
  id: string;
  title: string;
  content: string; // Markdown format
  tags: string[];
  references: string[]; // 法律条文、問題番号、テキストページ、判例など
  relatedCardIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type CardInput = Omit<Card, 'id' | 'createdAt' | 'updatedAt'>;
export type CardUpdate = Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>;
