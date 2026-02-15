import type { Card } from '../types/card';
import type { GraphData, GraphNode, GraphLink } from '../types/graph';

// カラーパレット（TailwindのカスタムカラーをRGBで定義）
const COLORS = {
  node: '#6366f1', // primary-500 (indigo)
  link: {
    tag: '#0891b2', // accent-600 (cyan) - タグによる関連
    reference: '#64748b', // secondary-500 (slate) - 参照による関連
    related: '#4f46e5', // primary-600 (indigo) - 明示的なリンク
  },
};

/**
 * カードデータからグラフデータを生成
 */
export function generateGraphData(cards: Card[]): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // 1. カードをノードに変換
  cards.forEach((card) => {
    nodes.push({
      id: card.id,
      type: 'card',
      name: card.title || '（タイトルなし）',
      card,
      color: COLORS.node,
      val: 1, // ノードサイズ（後で接続数に応じて調整可能）
    });
  });

  // 2. カード間の共通タグと共通参照を計算してリンクを生成
  const cardMap = new Map<string, Card>();
  cards.forEach((card) => {
    cardMap.set(card.id, card);
  });

  // カード間の関連性を計算
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      const card1 = cards[i];
      const card2 = cards[j];

      // 共通タグを計算
      const commonTags = card1.tags.filter((tag) => card2.tags.includes(tag));

      // 共通参照を計算
      const commonReferences = card1.references.filter((ref) =>
        card2.references.includes(ref)
      );

      // 明示的なリンクをチェック
      const hasExplicitLink =
        card1.relatedCardIds.includes(card2.id) ||
        card2.relatedCardIds.includes(card1.id);

      // リンクを作成（いずれかの関連性がある場合）
      if (commonTags.length > 0 || commonReferences.length > 0 || hasExplicitLink) {
        // 重みを計算（共通点が多いほど重みが高い）
        let weight = 0;
        let linkType: 'tag' | 'reference' | 'related' = 'tag';
        let label = '';

        if (hasExplicitLink) {
          // 明示的なリンクは最も強い関連性
          weight = 10;
          linkType = 'related';
        } else if (commonReferences.length > 0) {
          // 参照が共通している場合（タグより強い関連性）
          weight = commonReferences.length * 3;
          linkType = 'reference';
          label = commonReferences.join(', ');
        } else if (commonTags.length > 0) {
          // タグが共通している場合
          weight = commonTags.length;
          linkType = 'tag';
          label = commonTags.join(', ');
        }

        links.push({
          source: card1.id,
          target: card2.id,
          type: linkType,
          label,
          weight,
          color: COLORS.link[linkType],
          width: Math.min(weight / 2, 3), // 重みに応じて線の太さを調整（最大3）
        });
      }
    }
  }

  return { nodes, links };
}

/**
 * 特定のリンクタイプでフィルタリング
 */
export function filterGraphByLinkType(
  graphData: GraphData,
  linkTypes: ('tag' | 'reference' | 'related')[]
): GraphData {
  const filteredLinks = graphData.links.filter((link) =>
    linkTypes.includes(link.type)
  );

  // リンクに含まれるノードのみを抽出
  const connectedNodeIds = new Set<string>();
  filteredLinks.forEach((link) => {
    connectedNodeIds.add(link.source.toString());
    connectedNodeIds.add(link.target.toString());
  });

  const filteredNodes = graphData.nodes.filter((node) =>
    connectedNodeIds.has(node.id)
  );

  return {
    nodes: filteredNodes,
    links: filteredLinks,
  };
}

/**
 * 中心ノードからの重み付き距離を計算
 * 重みが高いほど距離が近い（関連性が強い）
 */
export function calculateDistances(
  graphData: GraphData,
  centerNodeId: string
): Map<string, number> {
  const distances = new Map<string, number>();
  const visited = new Set<string>();

  // 隣接リストを作成（重み付き）
  const adjacencyList = new Map<string, Array<{ id: string; weight: number }>>();
  graphData.nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  graphData.links.forEach((link) => {
    const sourceId = typeof link.source === 'string' ? link.source : (link.source as any).id;
    const targetId = typeof link.target === 'string' ? link.target : (link.target as any).id;
    const weight = link.weight || 1;

    adjacencyList.get(sourceId)?.push({ id: targetId, weight });
    adjacencyList.get(targetId)?.push({ id: sourceId, weight });
  });

  // 優先度付きキューの代わりに配列を使用（簡易実装）
  const queue: Array<{ id: string; cumulativeDistance: number }> = [];

  // 開始ノード
  queue.push({ id: centerNodeId, cumulativeDistance: 0 });
  distances.set(centerNodeId, 0);

  while (queue.length > 0) {
    // 距離が最小のノードを取得
    queue.sort((a, b) => a.cumulativeDistance - b.cumulativeDistance);
    const current = queue.shift()!;

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    const neighbors = adjacencyList.get(current.id) || [];

    neighbors.forEach(({ id: neighborId, weight }) => {
      // 重みの逆数を距離として加算（重みが高いほど距離が短い）
      // 重み10 → 距離0.1、重み1 → 距離1
      const edgeDistance = 1 / weight;
      const newDistance = current.cumulativeDistance + edgeDistance;

      const existingDistance = distances.get(neighborId);
      if (existingDistance === undefined || newDistance < existingDistance) {
        distances.set(neighborId, newDistance);
        queue.push({ id: neighborId, cumulativeDistance: newDistance });
      }
    });
  }

  // 累積距離を段階的な距離レベルに変換
  // 0: 中心ノード
  // 0-0.5: 1次関連（重み2以上の直接リンク）
  // 0.5-1.5: 2次関連
  // 1.5-2.5: 3次関連
  // それ以上: 遠い関連
  const leveledDistances = new Map<string, number>();
  distances.forEach((distance, nodeId) => {
    if (distance === 0) {
      leveledDistances.set(nodeId, 0);
    } else if (distance <= 0.5) {
      leveledDistances.set(nodeId, 1);
    } else if (distance <= 1.5) {
      leveledDistances.set(nodeId, 2);
    } else if (distance <= 2.5) {
      leveledDistances.set(nodeId, 3);
    } else {
      leveledDistances.set(nodeId, 4);
    }
  });

  return leveledDistances;
}

/**
 * 中心ノードとその周辺ノードのみをフィルタリング
 */
export function filterGraphByDistance(
  graphData: GraphData,
  centerNodeId: string | null,
  maxDistance: number | null
): GraphData {
  // 中心ノードが選択されていない、または距離制限がない場合は全て表示
  if (!centerNodeId || maxDistance === null) {
    return graphData;
  }

  const distances = calculateDistances(graphData, centerNodeId);

  // 距離制限内のノードのみ抽出
  const filteredNodes = graphData.nodes.filter((node) => {
    const distance = distances.get(node.id);
    return distance !== undefined && distance <= maxDistance;
  });

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));

  // フィルタリングされたノード間のリンクのみ抽出
  const filteredLinks = graphData.links.filter((link) => {
    const sourceId = typeof link.source === 'string' ? link.source : (link.source as any).id;
    const targetId = typeof link.target === 'string' ? link.target : (link.target as any).id;
    return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
  });

  return {
    nodes: filteredNodes,
    links: filteredLinks,
  };
}
