import type { Card, CardInput, CardUpdate } from '../types/card';

const STORAGE_KEY = 'chizai-study-cards';

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Load all cards from localStorage
export function loadCards(): Card[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const cards = JSON.parse(data) as Card[];

    // Migrate old data: problemNumbers -> references
    return cards.map((card) => {
      // @ts-expect-error: handling legacy data structure
      if (card.problemNumbers && !card.references) {
        return {
          ...card,
          // @ts-expect-error: handling legacy data structure
          references: card.problemNumbers,
          // @ts-expect-error: removing old field
          problemNumbers: undefined,
        };
      }
      return card;
    });
  } catch (error) {
    console.error('Failed to load cards:', error);
    return [];
  }
}

// Save all cards to localStorage
export function saveCards(cards: Card[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error('Failed to save cards:', error);
  }
}

// Get a card by ID
export function getCardById(id: string): Card | undefined {
  const cards = loadCards();
  return cards.find((card) => card.id === id);
}

// Add a new card
export function addCard(input: CardInput): Card {
  const cards = loadCards();
  const now = new Date().toISOString();

  const newCard: Card = {
    id: generateId(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  cards.push(newCard);
  saveCards(cards);

  return newCard;
}

// Update an existing card
export function updateCard(id: string, updates: CardUpdate): Card | null {
  const cards = loadCards();
  const index = cards.findIndex((card) => card.id === id);

  if (index === -1) {
    console.error(`Card with id ${id} not found`);
    return null;
  }

  const updatedCard: Card = {
    ...cards[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  cards[index] = updatedCard;
  saveCards(cards);

  return updatedCard;
}

// Delete a card
export function deleteCard(id: string): boolean {
  const cards = loadCards();
  const filteredCards = cards.filter((card) => card.id !== id);

  if (filteredCards.length === cards.length) {
    console.error(`Card with id ${id} not found`);
    return false;
  }

  saveCards(filteredCards);
  return true;
}

// Search cards by title or content
export function searchCards(query: string): Card[] {
  const cards = loadCards();
  const lowerQuery = query.toLowerCase();

  return cards.filter(
    (card) =>
      card.title.toLowerCase().includes(lowerQuery) ||
      card.content.toLowerCase().includes(lowerQuery)
  );
}

// Filter cards by tag
export function filterCardsByTag(tag: string): Card[] {
  const cards = loadCards();
  return cards.filter((card) => card.tags.includes(tag));
}

// Filter cards by reference
export function filterCardsByReference(reference: string): Card[] {
  const cards = loadCards();
  return cards.filter((card) => card.references.includes(reference));
}

// Get all unique tags
export function getAllTags(): string[] {
  const cards = loadCards();
  const tagsSet = new Set<string>();

  cards.forEach((card) => {
    card.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

// Get all unique references
export function getAllReferences(): string[] {
  const cards = loadCards();
  const referencesSet = new Set<string>();

  cards.forEach((card) => {
    card.references.forEach((ref) => referencesSet.add(ref));
  });

  return Array.from(referencesSet).sort();
}
