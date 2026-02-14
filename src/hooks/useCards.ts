import { useState, useEffect, useCallback } from 'react';
import type { Card, CardInput, CardUpdate } from '../types/card';
import * as storage from '../utils/storage';

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allReferences, setAllReferences] = useState<string[]>([]);

  // Load cards on mount
  useEffect(() => {
    const loadData = async () => {
      const loadedCards = await storage.loadCardsAsync();
      setCards(loadedCards);
      setAllTags(storage.getAllTags());
      setAllReferences(storage.getAllReferences());
    };
    loadData();
  }, []);

  // Add a new card
  const addCard = useCallback((input: CardInput) => {
    const newCard = storage.addCard(input);
    setCards((prev) => [...prev, newCard]);
    setAllTags(storage.getAllTags());
    setAllReferences(storage.getAllReferences());
  }, []);

  // Update an existing card
  const updateCard = useCallback((id: string, updates: CardUpdate) => {
    const updatedCard = storage.updateCard(id, updates);
    if (updatedCard) {
      setCards((prev) =>
        prev.map((card) => (card.id === id ? updatedCard : card))
      );
      setAllTags(storage.getAllTags());
      setAllReferences(storage.getAllReferences());
    }
  }, []);

  // Delete a card
  const deleteCard = useCallback((id: string) => {
    const success = storage.deleteCard(id);
    if (success) {
      setCards((prev) => prev.filter((card) => card.id !== id));
      setAllTags(storage.getAllTags());
      setAllReferences(storage.getAllReferences());
    }
  }, []);

  // Get a card by ID
  const getCard = useCallback(
    (id: string) => {
      return cards.find((card) => card.id === id);
    },
    [cards]
  );

  return {
    cards,
    allTags,
    allReferences,
    addCard,
    updateCard,
    deleteCard,
    getCard,
  };
}
