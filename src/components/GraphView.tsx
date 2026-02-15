import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { Card } from '../types/card';
import type { GraphNode, LinkType } from '../types/graph';
import {
  generateGraphData,
  filterGraphByLinkType,
  filterGraphByDistance,
  calculateDistances
} from '../utils/graphUtils';

interface GraphViewProps {
  cards: Card[];
  onNodeClick?: (cardId: string) => void;
  initialCenterNodeId?: string | null;
}

export function GraphView({ cards, onNodeClick, initialCenterNodeId }: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedLinkTypes, setSelectedLinkTypes] = useState<LinkType[]>([
    'tag',
    'reference',
    'related',
  ]);
  const [centerNodeId, setCenterNodeId] = useState<string | null>(initialCenterNodeId || null);
  const [maxDistance, setMaxDistance] = useState<number | null>(2); // デフォルトは2次関連まで

  // 外部から中心ノードが変更された場合に更新
  useEffect(() => {
    if (initialCenterNodeId) {
      setCenterNodeId(initialCenterNodeId);
      setMaxDistance(2); // デフォルトは2次関連まで
    }
  }, [initialCenterNodeId]);

  // コンテナサイズを監視
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // グラフデータを生成
  const graphData = useMemo(() => {
    const fullGraph = generateGraphData(cards);
    const linkFilteredGraph = filterGraphByLinkType(fullGraph, selectedLinkTypes);
    return filterGraphByDistance(linkFilteredGraph, centerNodeId, maxDistance);
  }, [cards, selectedLinkTypes, centerNodeId, maxDistance]);

  // 中心ノードからの距離を計算（強調表示用）
  const distances = useMemo(() => {
    if (!centerNodeId) return null;
    const fullGraph = generateGraphData(cards);
    return calculateDistances(fullGraph, centerNodeId);
  }, [cards, centerNodeId]);

  // ノードクリック時のハンドラ
  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [onNodeClick]
  );

  // ノードの色を距離に応じて調整
  const getNodeColor = useCallback(
    (node: GraphNode) => {
      if (!centerNodeId || !distances) {
        return node.color || '#6366f1';
      }

      const distance = distances.get(node.id);
      if (distance === undefined) return '#cbd5e1'; // 接続なし（グレー）

      // 中心ノード
      if (distance === 0) return '#4f46e5'; // primary-600（濃いインディゴ）

      // 距離に応じて透明度を調整
      if (distance === 1) return '#6366f1'; // primary-500（通常）
      if (distance === 2) return '#818cf8'; // primary-400（薄め）
      return '#a5b4fc'; // primary-300（さらに薄め）
    },
    [centerNodeId, distances]
  );

  // ノードのサイズを距離に応じて調整
  const getNodeSize = useCallback(
    (node: GraphNode) => {
      if (!centerNodeId || !distances) {
        return node.val || 1;
      }

      const distance = distances.get(node.id);
      if (distance === undefined) return 0.5; // 接続なし（小さく）
      if (distance === 0) return 2; // 中心ノード（大きく）
      if (distance === 1) return 1.5; // 直接関連（やや大きく）
      return 1; // その他（通常）
    },
    [centerNodeId, distances]
  );

  // リンクの色を距離に応じて調整
  const getLinkColor = useCallback(
    (link: any) => {
      if (!centerNodeId || !distances) {
        return link.color || '#999';
      }

      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;

      const sourceDistance = distances.get(sourceId);
      const targetDistance = distances.get(targetId);

      // 中心ノードに直接接続されているリンクを強調
      if (sourceDistance === 0 || targetDistance === 0) {
        return link.color || '#4f46e5';
      }

      return link.color || '#cbd5e1';
    },
    [centerNodeId, distances]
  );

  // リンクタイプの切り替え
  const toggleLinkType = useCallback((linkType: LinkType) => {
    setSelectedLinkTypes((prev) => {
      if (prev.includes(linkType)) {
        return prev.filter((t) => t !== linkType);
      } else {
        return [...prev, linkType];
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-surface-light">
      {/* フィルターコントロール */}
      <div className="p-4 border-b border-gray-200 bg-white space-y-3 overflow-y-auto max-h-[50vh] flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">
          関連性グラフ
        </h2>

        {/* 距離フィルター */}
        {centerNodeId && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              表示範囲
            </label>
            <select
              value={maxDistance === null ? 'all' : maxDistance.toString()}
              onChange={(e) =>
                setMaxDistance(e.target.value === 'all' ? null : parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="1">関連性：強（明示的リンク・複数の共通点）</option>
              <option value="2">関連性：中（いくつかの共通点）</option>
              <option value="3">関連性：弱（関連性が薄い）</option>
              <option value="all">すべて表示</option>
            </select>
          </div>
        )}

        {/* リンクタイプフィルター */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            関連性の種類
          </label>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={selectedLinkTypes.includes('tag')}
                onChange={() => toggleLinkType('tag')}
                className="w-4 h-4 text-accent-600 rounded focus:ring-2 focus:ring-accent-500"
              />
              <span className="text-sm font-medium text-gray-700">タグ</span>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#0891b2' }}
              />
            </label>

            <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={selectedLinkTypes.includes('reference')}
                onChange={() => toggleLinkType('reference')}
                className="w-4 h-4 text-secondary-600 rounded focus:ring-2 focus:ring-secondary-500"
              />
              <span className="text-sm font-medium text-gray-700">参照</span>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#64748b' }}
              />
            </label>

            <label className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={selectedLinkTypes.includes('related')}
                onChange={() => toggleLinkType('related')}
                className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">リンク</span>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#4f46e5' }}
              />
            </label>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
          <span>
            {graphData.nodes.length}個のカード、{graphData.links.length}個の関連性
            {centerNodeId && (
              <span className="ml-2 text-primary-600 font-medium">
                （中心: {cards.find((c) => c.id === centerNodeId)?.title}）
              </span>
            )}
          </span>
          {centerNodeId && (
            <button
              onClick={() => {
                setCenterNodeId(null);
                setMaxDistance(null);
              }}
              className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors flex items-center gap-1"
              title="中心を解除"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              中心を解除
            </button>
          )}
        </div>
      </div>

      {/* グラフ表示エリア */}
      <div className="flex-1 relative">
        {graphData.nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">
              表示できる関連性がありません。カードを追加するか、フィルターを変更してください。
            </p>
          </div>
        ) : (
          <ForceGraph2D
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            nodeLabel={(node) => (node as GraphNode).name}
            nodeColor={(node) => getNodeColor(node as GraphNode)}
            nodeVal={(node) => getNodeSize(node as GraphNode)}
            nodeRelSize={6}
            linkColor={getLinkColor}
            linkWidth={(link) => link.width || 1}
            linkDirectionalParticles={0}
            onNodeClick={handleNodeClick}
            cooldownTicks={100}
            d3VelocityDecay={0.3}
          />
        )}
      </div>
    </div>
  );
}
