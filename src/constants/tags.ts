export interface TagCategory {
  name: string;
  color: 'blue' | 'green' | 'yellow';
  tags: string[];
}

export const TAG_CATEGORIES: Record<string, TagCategory> = {
  law: {
    name: '法律分野',
    color: 'blue',
    tags: ['特許法', '商標法', '意匠法', '著作権法', '実用新案法', '不正競争防止法', '条約'],
  },
  concept: {
    name: '概念・手続',
    color: 'green',
    tags: ['要件', '手続', '期間', '効力', '侵害', '出願', '登録', '権利', '制限'],
  },
  level: {
    name: 'カードの種類',
    color: 'yellow',
    tags: ['条文', '単語', '解説'],
  },
};

// Get all available tags as a flat array
export function getAllTags(): string[] {
  return Object.values(TAG_CATEGORIES).flatMap((category) => category.tags);
}

// Get category for a given tag
export function getCategoryForTag(tag: string): string | null {
  for (const [key, category] of Object.entries(TAG_CATEGORIES)) {
    if (category.tags.includes(tag)) {
      return key;
    }
  }
  return null;
}

// Get color classes for a tag
export function getTagColorClasses(tag: string, selected: boolean = false): string {
  const categoryKey = getCategoryForTag(tag);
  if (!categoryKey) return '';

  const category = TAG_CATEGORIES[categoryKey];
  const colorMap = {
    blue: {
      base: 'border-primary-300 text-primary-700 hover:bg-primary-50',
      selected: 'bg-primary-100 border-primary-500 text-primary-800',
    },
    green: {
      base: 'border-accent-300 text-accent-700 hover:bg-accent-50',
      selected: 'bg-accent-100 border-accent-500 text-accent-800',
    },
    yellow: {
      base: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50',
      selected: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    },
  };

  return selected ? colorMap[category.color].selected : colorMap[category.color].base;
}
