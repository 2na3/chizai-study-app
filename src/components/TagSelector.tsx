import { useState } from 'react';
import { TAG_CATEGORIES, getTagColorClasses } from '../constants/tags';

interface TagSelectorProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  customTags?: string[];
  onCustomTagAdd?: (tag: string) => void;
  onCustomTagRemove?: (tag: string) => void;
}

export function TagSelector({
  selectedTags,
  onTagToggle,
  customTags = [],
  onCustomTagAdd,
  onCustomTagRemove,
}: TagSelectorProps) {
  const [customTagInput, setCustomTagInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  return (
    <div className="space-y-4">
      {/* Predefined tag categories */}
      {Object.entries(TAG_CATEGORIES).map(([key, category]) => (
        <div key={key}>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">{category.name}</h4>
          <div className="flex flex-wrap gap-2">
            {category.tags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${getTagColorClasses(
                    tag,
                    isSelected
                  )}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Custom tags section */}
      {customTags.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">カスタムタグ</h4>
          <div className="flex flex-wrap gap-2">
            {customTags.map((tag) => (
              <div
                key={tag}
                className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center gap-1 border-2 border-gray-300"
              >
                <span>{tag}</span>
                {onCustomTagRemove && (
                  <button
                    type="button"
                    onClick={() => onCustomTagRemove(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={`${tag}を削除`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add custom tag input */}
      {onCustomTagAdd && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">カスタムタグを追加</h4>
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            placeholder="タグ名を入力してEnter"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyDown={(e) => {
              // IME入力中のEnterは無視
              if (e.key === 'Enter' && !isComposing) {
                e.preventDefault();
                const tag = customTagInput.trim();
                if (tag && !customTags.includes(tag)) {
                  onCustomTagAdd(tag);
                  setCustomTagInput('');
                }
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            定義済みのタグにない場合、カスタムタグを追加できます
          </p>
        </div>
      )}
    </div>
  );
}
