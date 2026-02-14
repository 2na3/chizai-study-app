import type { Card } from '../types/card';
import { FilterPanel } from './FilterPanel';

interface CardListProps {
  cards: Card[];
  selectedCardId: string | null;
  onSelectCard: (id: string) => void;
  onDeleteCard: (id: string) => void;
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
}

export function CardList({
  cards,
  selectedCardId,
  onSelectCard,
  onDeleteCard: _onDeleteCard,
  allTags,
  selectedTags,
  onToggleTag,
  onClearFilters,
}: CardListProps) {
  return (
    <div className="h-full flex flex-col bg-surface-light-variant border-r border-gray-200">
      {/* Filter Panel */}
      <FilterPanel
        allTags={allTags}
        selectedTags={selectedTags}
        onToggleTag={onToggleTag}
        onClearFilters={onClearFilters}
      />

      {/* Card List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          カード一覧 ({cards.length})
        </h2>
        {cards.length === 0 ? (
          <p className="text-gray-500 text-sm">
            カードがありません。新規作成してください。
          </p>
        ) : (
          <div className="space-y-2">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => onSelectCard(card.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCardId === card.id
                    ? 'bg-primary-50 border-2 border-primary-500'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {card.title || '（タイトルなし）'}
                </h3>
                {card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {card.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
