import { useState, useRef } from 'react';
import { exportCardsToJSON, importCardsFromJSON } from '../utils/storage';

interface DataManagementProps {
  onClose: () => void;
  onImportComplete: () => void;
}

export function DataManagement({ onClose, onImportComplete }: DataManagementProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const jsonData = exportCardsToJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chizai-cards-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'データをエクスポートしました' });
    } catch (error) {
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
    } catch (error) {
      setMessage({ type: 'error', text: 'ファイルの読み込みに失敗しました' });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
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
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
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
