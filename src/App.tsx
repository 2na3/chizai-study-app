import { useState } from 'react';
import { useCards } from './hooks/useCards';
import { CardList } from './components/CardList';
import { CardDetail } from './components/CardDetail';
import { CardForm } from './components/CardForm';
import type { CardInput } from './types/card';

function App() {
  const { cards, addCard, updateCard, deleteCard, getCard } = useCards();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCard = selectedCardId ? (getCard(selectedCardId) ?? null) : null;

  // Filter cards by search query
  const filteredCards = searchQuery
    ? cards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : cards;

  const handleAddCard = (input: CardInput) => {
    addCard(input);
    setIsFormOpen(false);
  };

  const handleDeleteCard = (id: string) => {
    deleteCard(id);
    if (selectedCardId === id) {
      setSelectedCardId(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-slate-800 text-white shadow-md">
        <div className="px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">知財検定 学習ノート</h1>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルやタグで検索..."
                className="px-4 py-2 rounded-full bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg font-medium whitespace-nowrap"
              >
                + カードを追加
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Desktop: Side by side layout */}
        <div className="hidden md:grid md:grid-cols-[400px_1fr] h-full">
          <CardList
            cards={filteredCards}
            selectedCardId={selectedCardId}
            onSelectCard={setSelectedCardId}
            onDeleteCard={handleDeleteCard}
          />
          <CardDetail
            card={selectedCard}
            onUpdateCard={updateCard}
            onDeleteCard={handleDeleteCard}
          />
        </div>

        {/* Mobile: Stack layout */}
        <div className="md:hidden h-full">
          {selectedCardId ? (
            <div className="h-full flex flex-col">
              <div className="bg-white border-b border-gray-200 p-4">
                <button
                  onClick={() => setSelectedCardId(null)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  ← 一覧に戻る
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <CardDetail
                  card={selectedCard}
                  onUpdateCard={updateCard}
                  onDeleteCard={handleDeleteCard}
                  onClose={() => setSelectedCardId(null)}
                />
              </div>
            </div>
          ) : (
            <CardList
              cards={filteredCards}
              selectedCardId={selectedCardId}
              onSelectCard={setSelectedCardId}
              onDeleteCard={handleDeleteCard}
            />
          )}
        </div>
      </main>

      {/* Card Form Modal */}
      {isFormOpen && (
        <CardForm onSubmit={handleAddCard} onCancel={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}

export default App;
