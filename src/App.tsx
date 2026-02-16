import { useState, useEffect } from 'react';
import { useCards } from './hooks/useCards';
import { CardList } from './components/CardList';
import { CardDetail } from './components/CardDetail';
import { CardForm } from './components/CardForm';
import { DataManagement } from './components/DataManagement';
import { GraphView } from './components/GraphView';
import { isReadOnlyMode } from './utils/env';
import type { CardInput } from './types/card';

type ViewMode = 'list' | 'graph';

function App() {
  const readOnly = isReadOnlyMode();
  const { cards, allTags, addCard, updateCard, deleteCard, getCard } = useCards();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [graphCenterNodeId, setGraphCenterNodeId] = useState<string | null>(null);

  // URLパラメータからカードIDを読み取る（新しいタブで開いた場合）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get('card');
    if (cardId && getCard(cardId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCardId(cardId);
    }
  }, [getCard]);

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

  const handleShowInGraph = (cardId: string) => {
    setGraphCenterNodeId(cardId);
    setViewMode('graph');
    setSelectedCardId(cardId);
  };

  return (
    <div className="h-screen flex flex-col bg-surface-light">
      {/* Header */}
      <header className="bg-secondary-800 text-white shadow-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Logo Mark */}
              <svg
                className="w-8 h-8 md:w-9 md:h-9"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Back card - light indigo tint */}
                <rect
                  x="4"
                  y="4"
                  width="20"
                  height="20"
                  rx="3"
                  fill="#C7D2FE"
                  opacity="0.4"
                />
                {/* Middle card - medium indigo tint */}
                <rect
                  x="6"
                  y="6"
                  width="20"
                  height="20"
                  rx="3"
                  fill="#A5B4FC"
                  opacity="0.7"
                />
                {/* Front card - white with slight indigo tint */}
                <rect
                  x="8"
                  y="8"
                  width="20"
                  height="20"
                  rx="3"
                  fill="#E0E7FF"
                />
                {/* Lines on front card to represent text */}
                <line x1="12" y1="13" x2="22" y2="13" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                <line x1="12" y1="17" x2="20" y2="17" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                <line x1="12" y1="21" x2="18" y2="21" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              </svg>

              {/* Service Name */}
              <h1 className="text-xl md:text-2xl font-bold">ChizaiLog</h1>
            </div>
            <div className="flex gap-2 justify-end flex-1 min-w-0">
              {viewMode === 'list' && (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="タイトルやタグで検索..."
                  className="flex-1 min-w-0 max-w-96 px-3 py-2 rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              )}
              {/* View Toggle Buttons */}
              <div className="flex gap-1 bg-secondary-700 rounded-lg p-1 flex-shrink-0">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md transition-colors text-sm font-medium ${
                    viewMode === 'list'
                      ? 'bg-white text-secondary-800'
                      : 'text-white hover:bg-secondary-600'
                  }`}
                  title="リストビュー"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('graph')}
                  className={`px-3 py-1.5 rounded-md transition-colors text-sm font-medium ${
                    viewMode === 'graph'
                      ? 'bg-white text-secondary-800'
                      : 'text-white hover:bg-secondary-600'
                  }`}
                  title="グラフビュー"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </button>
              </div>
              {!readOnly && (
                <>
                  <button
                    onClick={() => setIsDataManagementOpen(true)}
                    className="px-3 py-2 text-white bg-secondary-600 rounded-lg hover:bg-secondary-700 transition-colors font-medium text-sm flex-shrink-0"
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
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg font-medium text-sm flex-shrink-0"
                  >
                    + カードを追加
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {viewMode === 'list' ? (
          <>
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
                key={selectedCardId}
                card={selectedCard}
                allCards={cards}
                onUpdateCard={updateCard}
                onDeleteCard={handleDeleteCard}
                onShowInGraph={handleShowInGraph}
                onSelectCard={setSelectedCardId}
                readOnly={readOnly}
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
                      key={selectedCardId}
                      card={selectedCard}
                      allCards={cards}
                      onUpdateCard={updateCard}
                      onDeleteCard={handleDeleteCard}
                      onClose={() => setSelectedCardId(null)}
                      onShowInGraph={handleShowInGraph}
                      onSelectCard={setSelectedCardId}
                      readOnly={readOnly}
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
          </>
        ) : (
          <>
            {/* Desktop: Graph + Detail layout */}
            <div className="hidden md:grid md:grid-cols-[1fr_400px] h-full">
              <div className="min-h-0">
                <GraphView
                  cards={cards}
                  onNodeClick={(cardId) => setSelectedCardId(cardId)}
                  initialCenterNodeId={graphCenterNodeId}
                />
              </div>
              <div className="min-h-0">
                <CardDetail
                  key={selectedCardId}
                  card={selectedCard}
                  allCards={cards}
                  onUpdateCard={updateCard}
                  onDeleteCard={handleDeleteCard}
                  onShowInGraph={handleShowInGraph}
                  onSelectCard={setSelectedCardId}
                  readOnly={readOnly}
                />
              </div>
            </div>

            {/* Mobile: Graph or Detail */}
            <div className="md:hidden h-full">
              {selectedCardId ? (
                <div className="h-full flex flex-col">
                  <div className="bg-white border-b border-gray-200 p-4">
                    <button
                      onClick={() => setSelectedCardId(null)}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      ← グラフに戻る
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <CardDetail
                      key={selectedCardId}
                      card={selectedCard}
                      allCards={cards}
                      onUpdateCard={updateCard}
                      onDeleteCard={handleDeleteCard}
                      onClose={() => setSelectedCardId(null)}
                      onShowInGraph={handleShowInGraph}
                      onSelectCard={setSelectedCardId}
                      readOnly={readOnly}
                    />
                  </div>
                </div>
              ) : (
                <GraphView
                  cards={cards}
                  onNodeClick={(cardId) => setSelectedCardId(cardId)}
                  initialCenterNodeId={graphCenterNodeId}
                />
              )}
            </div>
          </>
        )}
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
