import type { Card } from '../types/card';

interface CardListProps {
  cards: Card[];
  selectedCardId: string | null;
  onSelectCard: (id: string) => void;
  onDeleteCard: (id: string) => void;
}

export function CardList({
  cards,
  selectedCardId,
  onSelectCard,
  onDeleteCard,
}: CardListProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 border-r border-gray-200">
      <div className="p-4">
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
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-white border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {card.title || '（タイトルなし）'}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {card.content || '（内容なし）'}
                </p>
                {card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {card.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium"
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
