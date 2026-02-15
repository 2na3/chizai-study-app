import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { CardInput } from '../types/card';
import { TagSelector } from './TagSelector';
import { getAllTags } from '../constants/tags';

interface CardFormProps {
  onSubmit: (input: CardInput) => void;
  onCancel: () => void;
}

export function CardForm({ onSubmit, onCancel }: CardFormProps) {
  const [editTab, setEditTab] = useState<'edit' | 'preview'>('edit');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [references, setReferences] = useState('');

  // 入力内容があるかチェック
  const hasInput = () => {
    return (
      title.trim() !== '' ||
      content.trim() !== '' ||
      selectedTags.length > 0 ||
      customTags.length > 0 ||
      references.trim() !== ''
    );
  };

  // キャンセル処理（入力内容がある場合は確認）
  const handleCancel = () => {
    if (hasInput()) {
      if (window.confirm('編集内容は保存されていません、破棄してもよろしいでしょうか？')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  // Handle Esc key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [title, content, selectedTags, customTags, references]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      title,
      content,
      tags: [...selectedTags, ...customTags],
      references: references.split(',').map((r) => r.trim()).filter(Boolean),
      relatedCardIds: [],
    });

    // Reset form
    setTitle('');
    setContent('');
    setSelectedTags([]);
    setCustomTags([]);
    setReferences('');
    setEditTab('edit');
  };

  // Tag selection handlers
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCustomTagAdd = (tag: string) => {
    const allPredefinedTags = getAllTags();
    if (!allPredefinedTags.includes(tag)) {
      setCustomTags((prev) => [...prev, tag]);
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleCustomTagRemove = (tag: string) => {
    setCustomTags((prev) => prev.filter((t) => t !== tag));
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  // Handle click on backdrop to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">新規カード作成</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="例: 特許権の存続期間"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  内容 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setEditTab('edit')}
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                      editTab === 'edit'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTab('preview')}
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                      editTab === 'preview'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    プレビュー
                  </button>
                </div>
              </div>
              {editTab === 'edit' ? (
                <>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono font-normal"
                    placeholder="例:&#10;出願日から20年間&#10;（医薬品等は延長登録により最大5年延長可能）&#10;&#10;参考条文: 特許法第67条"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Markdown形式で記述できます（**太字**、- 箇条書き、## 見出し など）
                  </p>
                </>
              ) : (
                <div className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-900 prose-li:text-gray-900 prose-strong:text-gray-900 prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200">
                    <ReactMarkdown>{content || '*プレビューする内容がありません*'}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                タグ
              </label>
              <TagSelector
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
                customTags={customTags}
                onCustomTagAdd={handleCustomTagAdd}
                onCustomTagRemove={handleCustomTagRemove}
              />
            </div>

            {/* References */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                参照
              </label>
              <input
                type="text"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="例: 特許法 第67条, 知財検定3級 問3-1, テキスト p.127"
              />
              <p className="mt-1 text-sm text-gray-500">
                法律条文、問題番号、テキストページなどをカンマ区切りで指定
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              {/* Cancel: Text Button (Material Design) */}
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                キャンセル
              </button>
              {/* Submit: Filled Button (Material Design) */}
              <button
                type="submit"
                className="px-6 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
              >
                作成
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
