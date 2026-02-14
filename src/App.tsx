import { useState } from 'react';
import { useCards } from './hooks/useCards';
import { CardList } from './components/CardList';
import { CardDetail } from './components/CardDetail';
import { CardForm } from './components/CardForm';
import { DataManagement } from './components/DataManagement';
import type { CardInput } from './types/card';

function App() {
  const { cards, allTags, addCard, updateCard, deleteCard, getCard } = useCards();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const selectedCard = selectedCardId ? (getCard(selectedCardId) ?? null) : null;

  // Filter cards by search query and tags
  const filteredCards = cards.filter((card) => {
    // Search query filter
    const matchesSearch =
      !searchQuery ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Tag filter (AND logic - card must have all selected tags)
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => card.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

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

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
  };

  const handleImportComplete = () => {
    // Reload the page to refresh all data
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-slate-800 text-white shadow-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-bold flex-shrink-0">知財検定 学習ノート</h1>
            <div className="flex gap-2 justify-end flex-1 min-w-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルやタグで検索..."
                className="flex-1 min-w-0 max-w-96 px-3 py-2 rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={() => setIsDataManagementOpen(true)}
                className="px-3 py-2 text-white bg-slate-600 rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm flex-shrink-0"
                title="データ管理"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg font-medium text-sm flex-shrink-0"
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
            allTags={allTags}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onClearFilters={handleClearFilters}
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
              allTags={allTags}
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>
      </main>

      {/* Card Form Modal */}
      {isFormOpen && (
        <CardForm onSubmit={handleAddCard} onCancel={() => setIsFormOpen(false)} />
      )}

      {/* Data Management Modal */}
      {isDataManagementOpen && (
        <DataManagement
          onClose={() => setIsDataManagementOpen(false)}
          onImportComplete={handleImportComplete}
        />
      )}
    </div>
  );
}

export default App;
