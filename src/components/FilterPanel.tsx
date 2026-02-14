import { useState } from 'react';

interface FilterPanelProps {
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  allTags,
  selectedTags,
  onToggleTag,
  onClearFilters,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = selectedTags.length > 0;

  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Filter Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">フィルター</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
              {selectedTags.length}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Tags */}
          {allTags.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-600 uppercase">
                  タグ
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => onToggleTag(tag)}
                      className={`px-3 py-1 text-sm rounded-full font-medium transition-colors ${
                        isSelected
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-2">
              <button
                onClick={onClearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                すべてクリア
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
