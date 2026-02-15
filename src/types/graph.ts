import type { Card } from './card';

// ノードのタイプ
export type NodeType = 'card';

// リンクのタイプ
export type LinkType = 'tag' | 'reference' | 'related';

// グラフノード
export interface GraphNode {
  id: string;
  type: NodeType;
  name: string;
  card: Card;
  // 視覚的プロパティ
  color?: string;
  val?: number; // ノードのサイズを制御
}

// グラフリンク
export interface GraphLink {
  source: string;
  target: string;
  type: LinkType;
  label?: string; // タグ名や参照名
  weight: number; // 関連性の強さ（共通点の数）
  // 視覚的プロパティ
  color?: string;
  width?: number;
}

// グラフデータ
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
