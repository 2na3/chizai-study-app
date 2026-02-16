import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { Card, CardUpdate } from '../types/card';
import { TagSelector } from './TagSelector';
import { getAllTags, getTagColorClasses, getCategoryForTag } from '../constants/tags';
import {
  parseInternalLinks,
  detectInlineLinkCandidates,
  autoInsertInternalLink,
} from '../utils/internalLinks';

interface CardDetailProps {
  card: Card | null;
  allCards: Card[];
  onUpdateCard: (id: string, updates: CardUpdate) => void;
  onDeleteCard: (id: string) => void;
  onClose?: () => void;
  onShowInGraph?: (cardId: string) => void;
  onSelectCard?: (cardId: string) => void;
  readOnly?: boolean;
}

export function CardDetail({
  card,
  allCards,
  onUpdateCard,
  onDeleteCard,
  onClose,
  onShowInGraph,
  onSelectCard,
  readOnly = false,
}: CardDetailProps) {
  // Hooks must be called unconditionally before any early returns
  // Separate predefined tags from custom tags (cardがnullの場合は空配列)
  const allPredefinedTags = getAllTags();
  const predefinedTags = card?.tags.filter((tag) => allPredefinedTags.includes(tag)) || [];
  const customTagsList = card?.tags.filter((tag) => !allPredefinedTags.includes(tag)) || [];

  // useState初期値でpropsから直接設定（App.tsxでkeyを設定しているため、カード切り替え時に再マウントされる）
  const [isEditing, setIsEditing] = useState(false);
  const [editTab, setEditTab] = useState<'edit' | 'preview'>('edit');
  const [title, setTitle] = useState(card?.title || '');
  const [content, setContent] = useState(card?.content || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(predefinedTags);
  const [customTags, setCustomTags] = useState<string[]>(customTagsList);
  const [references, setReferences] = useState(card?.references.join(', ') || '');
  const [relatedCardIds, setRelatedCardIds] = useState(card?.relatedCardIds.join(', ') || '');

  // 内部リンクをパース（[[カードタイトル]]をHTMLリンクに変換）
  const parsedContent = useMemo(() => {
    return parseInternalLinks(card?.content || '', allCards);
  }, [card?.content, allCards]);

  const parsedPreviewContent = useMemo(() => {
    return parseInternalLinks(content, allCards);
  }, [content, allCards]);

  // 内部リンクのクリック処理
  const handleInternalLinkClick = (e: React.MouseEvent<HTMLDivElement>, inEditMode: boolean) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('internal-link')) {
      e.preventDefault();
      const cardId = target.getAttribute('data-card-id');
      if (cardId && onSelectCard) {
        if (inEditMode) {
          // 編集モード中のプレビューは新しいタブで開く
          const currentUrl = window.location.href.split('?')[0].split('#')[0];
          const newUrl = `${currentUrl}?card=${cardId}`;
          window.open(newUrl, '_blank');
        } else {
          // 閲覧モードは同じタブで遷移
          onSelectCard(cardId);
        }
      }
    }
  };

  // リンク候補を検出
  const linkCandidates = useMemo(() => {
    if (!isEditing || editTab !== 'edit') return [];
    return detectInlineLinkCandidates(content, allCards, card?.id);
  }, [content, allCards, card?.id, isEditing, editTab]);

  // リンクを自動挿入
  const handleInsertLink = (title: string) => {
    const newContent = autoInsertInternalLink(content, title);
    setContent(newContent);
  };

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
      tags: [...selectedTags, ...customTags],
      references: references.split(',').map((r) => r.trim()).filter(Boolean),
      relatedCardIds: relatedCardIds.split(',').map((r) => r.trim()).filter(Boolean),
    });
    setIsEditing(false);
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
    if (!allPredefinedTags.includes(tag) && !customTags.includes(tag)) {
      setCustomTags((prev) => [...prev, tag]);
    }
  };

  const handleCustomTagRemove = (tag: string) => {
    setCustomTags((prev) => prev.filter((t) => t !== tag));
  };

  // 編集内容に変更があるかチェック
  const hasChanges = () => {
    const currentTags = [...selectedTags, ...customTags].sort();
    const originalTags = [...card.tags].sort();

    return (
      title !== card.title ||
      content !== card.content ||
      JSON.stringify(currentTags) !== JSON.stringify(originalTags) ||
      references !== card.references.join(', ') ||
      relatedCardIds !== card.relatedCardIds.join(', ')
    );
  };

  const handleCancel = () => {
    if (hasChanges()) {
      if (window.confirm('編集内容は保存されていません、破棄してもよろしいでしょうか')) {
        // Reset to original values (already defined at component top)
        setTitle(card.title);
        setContent(card.content);
        setSelectedTags(predefinedTags);
        setCustomTags(customTagsList);
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
          <div className="flex gap-2">
            {/* Show in Graph: Text Button (visible only when not editing) */}
            {onShowInGraph && !isEditing && (
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
            {!readOnly && (
              <>
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
                <>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono font-normal"
                    placeholder="内容を入力（Markdown形式）"
                  />

                  {/* リンク候補セクション */}
                  {linkCandidates.length > 0 && (
                    <div className="mt-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-4 h-4 text-primary-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <h4 className="text-sm font-semibold text-primary-900">
                          リンク候補 (本文中に見つかりました)
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {linkCandidates.map(({ card: candidateCard, occurrences }) => (
                          <button
                            key={candidateCard.id}
                            type="button"
                            onClick={() => handleInsertLink(candidateCard.title)}
                            className="px-3 py-1.5 bg-white border border-primary-300 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium text-primary-700 flex items-center gap-1"
                          >
                            + [[{candidateCard.title}]]
                            {occurrences > 1 && (
                              <span className="text-xs text-primary-500">×{occurrences}</span>
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-primary-600 mt-2">
                        クリックすると本文内の該当箇所に自動で [[ ]] が挿入されます
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="w-full min-h-[250px] px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  onClick={(e) => handleInternalLinkClick(e, true)}
                >
                  <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-900 prose-li:text-gray-900 prose-strong:text-gray-900 prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {parsedPreviewContent || '*プレビューする内容がありません*'}
                    </ReactMarkdown>
                  </div>
                </div>
              )
            ) : (
              <div
                className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-900 prose-li:text-gray-900 prose-strong:text-gray-900 prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200"
                onClick={(e) => handleInternalLinkClick(e, false)}
              >
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{parsedContent}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              タグ
            </label>
            {isEditing ? (
              <TagSelector
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
                customTags={customTags}
                onCustomTagAdd={handleCustomTagAdd}
                onCustomTagRemove={handleCustomTagRemove}
              />
            ) : card.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => {
                  const categoryKey = getCategoryForTag(tag);
                  const isCustomTag = !categoryKey;

                  return (
                    <span
                      key={index}
                      className={`px-3 py-1.5 rounded-full font-medium text-sm border-2 ${
                        isCustomTag
                          ? 'bg-gray-100 text-gray-800 border-gray-300'
                          : getTagColorClasses(tag, true)
                      }`}
                    >
                      {tag}
                    </span>
                  );
                })}
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
