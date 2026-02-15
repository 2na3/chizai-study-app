import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Card, CardUpdate } from '../types/card';

interface CardDetailProps {
  card: Card | null;
  onUpdateCard: (id: string, updates: CardUpdate) => void;
  onDeleteCard: (id: string) => void;
  onClose?: () => void;
  onShowInGraph?: (cardId: string) => void;
  readOnly?: boolean;
}

export function CardDetail({
  card,
  onUpdateCard,
  onDeleteCard,
  onClose,
  onShowInGraph,
  readOnly = false,
}: CardDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTab, setEditTab] = useState<'edit' | 'preview'>('edit');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [references, setReferences] = useState('');
  const [relatedCardIds, setRelatedCardIds] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setContent(card.content);
      setTags(card.tags.join(', '));
      setReferences(card.references.join(', '));
      setRelatedCardIds(card.relatedCardIds.join(', '));
      setIsEditing(false);
      setEditTab('edit');
    }
  }, [card]);

  if (!card) {
    return (
      <div className="h-full flex items-center justify-center bg-surface-light-variant">
        <p className="text-gray-500">カードを選択してください</p>
      </div>
    );
  }

  const handleSave = () => {
    onUpdateCard(card.id, {
      title,
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      references: references.split(',').map((r) => r.trim()).filter(Boolean),
      relatedCardIds: relatedCardIds.split(',').map((r) => r.trim()).filter(Boolean),
    });
    setIsEditing(false);
    setEditTab('edit');
  };

  // 編集内容に変更があるかチェック
  const hasChanges = () => {
    return (
      title !== card.title ||
      content !== card.content ||
      tags !== card.tags.join(', ') ||
      references !== card.references.join(', ') ||
      relatedCardIds !== card.relatedCardIds.join(', ')
    );
  };

  const handleCancel = () => {
    if (hasChanges()) {
      if (window.confirm('編集内容は保存されていません、破棄してもよろしいでしょうか')) {
        setTitle(card.title);
        setContent(card.content);
        setTags(card.tags.join(', '));
        setReferences(card.references.join(', '));
        setRelatedCardIds(card.relatedCardIds.join(', '));
        setIsEditing(false);
        setEditTab('edit');
      }
    } else {
      setIsEditing(false);
      setEditTab('edit');
    }
  };

  const handleDelete = () => {
    if (window.confirm('このカードを削除しますか？')) {
      onDeleteCard(card.id);
      if (onClose) onClose();
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">カード詳細</h2>
          {!readOnly && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  {/* Cancel: Text Button (Material Design) */}
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    キャンセル
                  </button>
                  {/* Save: Filled Button (Material Design) */}
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
                  >
                    保存
                  </button>
                </>
              ) : (
                <>
                  {/* Show in Graph: Text Button (Material Design) */}
                  {onShowInGraph && (
                    <button
                      onClick={() => onShowInGraph(card.id)}
                      className="px-4 py-2 text-accent-600 rounded-lg hover:bg-accent-50 transition-colors font-medium flex items-center gap-1"
                      title="このカードを中心としたグラフを表示"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      グラフ表示
                    </button>
                  )}
                  {/* Edit: Filled Button (Material Design) */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
                  >
                    編集
                  </button>
                  {/* Delete: Text Button with danger color (Material Design) */}
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    削除
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              タイトル
            </label>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="タイトルを入力"
              />
            ) : (
              <h3 className="text-2xl font-semibold text-gray-900">{card.title}</h3>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                内容
              </label>
              {isEditing && (
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
              )}
            </div>
            {isEditing ? (
              editTab === 'edit' ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono font-normal"
                  placeholder="内容を入力（Markdown形式）"
                />
              ) : (
                <div className="w-full min-h-[250px] px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-900 prose-li:text-gray-900 prose-strong:text-gray-900 prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200">
                    <ReactMarkdown>{content || '*プレビューする内容がありません*'}</ReactMarkdown>
                  </div>
                </div>
              )
            ) : (
              <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-900 prose-li:text-gray-900 prose-strong:text-gray-900 prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200">
                <ReactMarkdown>{card.content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              タグ
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="タグをカンマ区切りで入力（例: 特許法, 商標法）"
              />
            ) : card.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-medium text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">なし</p>
            )}
          </div>

          {/* References */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              参照
            </label>
            {isEditing ? (
              <input
                type="text"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="例: 特許法 第67条, 知財検定3級 問3-1, テキスト p.127"
              />
            ) : card.references.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {card.references.map((ref, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full font-medium text-sm"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">なし</p>
            )}
          </div>

          {/* Related Cards */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              関連カードID
            </label>
            {isEditing ? (
              <input
                type="text"
                value={relatedCardIds}
                onChange={(e) => setRelatedCardIds(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="関連カードIDをカンマ区切りで入力"
              />
            ) : card.relatedCardIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {card.relatedCardIds.map((id, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium text-xs"
                  >
                    {id}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">なし</p>
            )}
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500 space-y-1">
              <p>作成日: {new Date(card.createdAt).toLocaleString('ja-JP')}</p>
              <p>更新日: {new Date(card.updatedAt).toLocaleString('ja-JP')}</p>
              <p className="font-mono text-xs">ID: {card.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
