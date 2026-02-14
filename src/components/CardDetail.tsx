import { useState, useEffect } from 'react';
import type { Card, CardUpdate } from '../types/card';

interface CardDetailProps {
  card: Card | null;
  onUpdateCard: (id: string, updates: CardUpdate) => void;
  onDeleteCard: (id: string) => void;
  onClose?: () => void;
}

export function CardDetail({
  card,
  onUpdateCard,
  onDeleteCard,
  onClose,
}: CardDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
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
    }
  }, [card]);

  if (!card) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
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
  };

  const handleCancel = () => {
    setTitle(card.title);
    setContent(card.content);
    setTags(card.tags.join(', '));
    setReferences(card.references.join(', '));
    setRelatedCardIds(card.relatedCardIds.join(', '));
    setIsEditing(false);
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
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                  保存
                </button>
              </>
            ) : (
              <>
                {/* Edit: Filled Button (Material Design) */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="タイトルを入力"
              />
            ) : (
              <h3 className="text-2xl font-semibold text-gray-900">{card.title}</h3>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              内容
            </label>
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-normal"
                placeholder="内容を入力（Markdown形式）"
              />
            ) : (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-gray-900">
                  {card.content}
                </pre>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="タグをカンマ区切りで入力（例: 特許法, 商標法）"
              />
            ) : card.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 特許法 第67条, 知財検定3級 問3-1, テキスト p.127"
              />
            ) : card.references.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {card.references.map((ref, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
