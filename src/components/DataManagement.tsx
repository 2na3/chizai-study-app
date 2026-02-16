import { useState, useRef } from 'react';
import { exportCardsToJSON, importCardsFromJSON } from '../utils/storage';
import { autoInsertInternalLink } from '../utils/internalLinks';
import type { Card } from '../types/card';

interface DataManagementProps {
  cards: Card[];
  onUpdateCard: (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  onClose: () => void;
  onImportComplete: () => void;
}

interface LinkInsertResult {
  cardTitle: string;
  linksAdded: string[];
}

export function DataManagement({
  cards,
  onUpdateCard,
  onClose,
  onImportComplete,
}: DataManagementProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [linkInsertResults, setLinkInsertResults] = useState<LinkInsertResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const jsonData = exportCardsToJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate JST datetime string (YYYY-MM-DD-HHmmss)
      const now = new Date();
      const jstDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
      const year = jstDate.getFullYear();
      const month = String(jstDate.getMonth() + 1).padStart(2, '0');
      const day = String(jstDate.getDate()).padStart(2, '0');
      const hours = String(jstDate.getHours()).padStart(2, '0');
      const minutes = String(jstDate.getMinutes()).padStart(2, '0');
      const seconds = String(jstDate.getSeconds()).padStart(2, '0');
      const datetimeStr = `${year}-${month}-${day}-${hours}${minutes}${seconds}`;

      link.download = `chizai-cards-${datetimeStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'データをエクスポートしました' });
    } catch {
      setMessage({ type: 'error', text: 'エクスポートに失敗しました' });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = importCardsFromJSON(text);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        onImportComplete();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'ファイルの読み込みに失敗しました' });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAutoInsertLinks = () => {
    const results: LinkInsertResult[] = [];
    let totalLinksAdded = 0;

    // 各カードに対してリンクを自動挿入
    cards.forEach((card) => {
      let updatedContent = card.content;
      const linksAddedToCard: string[] = [];

      // 他のすべてのカードのタイトルをチェック
      cards.forEach((otherCard) => {
        if (otherCard.id === card.id) return; // 自分自身は除外
        if (!otherCard.title.trim()) return; // タイトルが空の場合は除外

        const beforeContent = updatedContent;
        updatedContent = autoInsertInternalLink(updatedContent, otherCard.title);

        // リンクが追加されたかチェック
        if (updatedContent !== beforeContent) {
          linksAddedToCard.push(otherCard.title);
        }
      });

      // 内容が変更された場合のみ更新
      if (updatedContent !== card.content) {
        onUpdateCard(card.id, { content: updatedContent });
        results.push({
          cardTitle: card.title,
          linksAdded: linksAddedToCard,
        });
        totalLinksAdded += linksAddedToCard.length;
      }
    });

    setLinkInsertResults(results);

    if (results.length > 0) {
      setMessage({
        type: 'success',
        text: `${results.length}件のカードに${totalLinksAdded}個のリンクを追加しました`,
      });
    } else {
      setMessage({
        type: 'success',
        text: '追加できるリンクはありませんでした',
      });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">データ管理</h2>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-accent-50 text-accent-700 border border-accent-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Link Insert Results */}
        {linkInsertResults.length > 0 && (
          <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg max-h-60 overflow-y-auto">
            <h4 className="text-sm font-semibold text-primary-900 mb-2">追加されたリンクの詳細</h4>
            <div className="space-y-2">
              {linkInsertResults.map((result, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-primary-800">📄 {result.cardTitle}</div>
                  <div className="ml-4 mt-1 space-y-0.5">
                    {result.linksAdded.map((link, linkIndex) => (
                      <div key={linkIndex} className="text-primary-600">
                        → [[{link}]]
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">エクスポート</h3>
          <p className="text-sm text-gray-600 mb-3">
            すべてのカードをJSONファイルとしてダウンロードします。
          </p>
          <button
            onClick={handleExport}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            データをエクスポート
          </button>
        </div>

        {/* Import Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">インポート</h3>
          <p className="text-sm text-gray-600 mb-3">
            JSONファイルからカードをインポートします。<br />
            <span className="text-red-600 font-medium">※ 既存のデータは上書きされます</span>
          </p>
          <button
            onClick={handleImportClick}
            className="w-full px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium"
          >
            ファイルを選択してインポート
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Auto Insert Links Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">リンク管理</h3>
          <p className="text-sm text-gray-600 mb-3">
            すべてのカードの本文を解析し、他のカードのタイトルが含まれている箇所に自動で [[ ]] を追加します。
            <br />
            <span className="text-primary-600 font-medium">※ 既に [[]] で囲まれている箇所はスキップされます</span>
          </p>
          <button
            onClick={handleAutoInsertLinks}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            すべてのカードにリンクを自動挿入
          </button>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
