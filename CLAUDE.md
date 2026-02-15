# 知財検定 学習ノート - プロジェクトガイドライン

## プロジェクト概要

知財検定の学習を支援するカード型知識管理 Web アプリケーション。
Zettelkasten 方式を採用し、知識の関連性を可視化する。

## デザイン哲学

### Material Design 3 準拠

- すべての UI コンポーネントは Material Design 3 のガイドラインに従う
- カラーシステム、タイポグラフィ、スペーシングを遵守
- アクセシビリティ基準（WCAG AA 以上）を満たす
- 公式ドキュメント: https://m3.material.io/

### Dieter Rams の 10 原則

1. **革新的である** - 新しい技術やアプローチを取り入れる
2. **有用である** - 学習効率を最優先
3. **美しい** - シンプルで洗練されたデザイン
4. **分かりやすい** - 直感的な UI/UX
5. **控えめである** - 学習に集中できるよう装飾は最小限
6. **誠実である** - ユーザーを操作しない
7. **長持ちする** - 流行に左右されないデザイン
8. **細部まで一貫** - すべての要素に統一感
9. **環境に優しい** - パフォーマンス最適化
10. **シンプル** - "Less, but better"

## カラーパレット

### ライトモード（現在）

- **Primary**: `bg-blue-500` (#2196f3) - メインアクション
- **Primary Hover**: `bg-blue-600` (#1e88e5)
- **Surface**: `bg-white` (#ffffff) - カード背景
- **Surface Variant**: `bg-gray-50` (#f5f5f5) - ページ背景
- **Header**: `bg-slate-800` (#1e293b) - ヘッダー背景
- **Text Primary**: `text-gray-900` (#1f2937)
- **Text Secondary**: `text-gray-600` (#6b7280)

### ダークモード（将来実装）

- **Primary**: `bg-blue-600` (#1e88e5)
- **Surface**: `bg-slate-800` (#1e1e1e)
- **Surface Variant**: `bg-slate-900` (#121212)
- **Header**: `bg-slate-900` (#0f172a)
- **Text Primary**: `text-white` (#f9fafb)
- **Text Secondary**: `text-gray-300` (#d1d5db)

## UI コンポーネント原則

### ボタンヒエラルキー（Material Design 準拠）

#### Primary Button (Filled)

- **用途**: 最も重要なアクション（保存、作成）
- **スタイル**: `px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg font-medium`
- **例**: 「カードを作成」「保存」

#### Secondary Button (Text)

- **用途**: 二次的なアクション（キャンセル）
- **スタイル**: `px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium`
- **例**: 「キャンセル」

#### Destructive Button (Text, Red)

- **用途**: 破壊的アクション（削除）
- **スタイル**: `px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium`
- **例**: 「削除」

### 入力フィールド

- **Border radius**: `rounded-md` (6px) - ボタンより控えめ
- **フォーカス**: `focus:outline-none focus:ring-2 focus:ring-blue-500`
- **標準スタイル**: `px-4 py-2 border border-gray-300 rounded-md`
- **ダーク対応**: `dark:bg-slate-800 dark:text-white dark:border-slate-600`

### カード

- **Border radius**: `rounded-lg` (8px)
- **Shadow**: `shadow-sm` 通常時、`shadow-md` ホバー時
- **Padding**: `p-3` または `p-4`
- **選択状態**: `border-2 border-blue-500 bg-blue-50`

### スペーシング

- **コンポーネント間**: `gap-3` または `gap-4`
- **セクション間**: `space-y-6`
- **ページ余白**: `px-4 py-4` または `p-6`

## タイポグラフィ

### フォント

- **本文・UI**: Noto Sans JP (400, 500, 600, 700)
- **コード・Markdown**: M PLUS 1 Code (400, 500)

### フォントサイズ

- **見出し（H1）**: `text-2xl font-bold` (24px)
- **見出し（H2）**: `text-xl font-semibold` (20px)
- **本文**: `text-base` (16px)
- **小さいテキスト**: `text-sm` (14px)
- **ラベル**: `text-sm font-semibold`

### フォントウェイト

- **太字（強調）**: `font-bold` (700)
- **セミボールド（見出し）**: `font-semibold` (600)
- **ミディアム（ボタン、タグ）**: `font-medium` (500)
- **通常**: `font-normal` (400)

## UX ライティング原則

### ボタンテキスト

- **行動動詞を使用**: 「作成」「検索」「保存」
- **具体的な対象を明示**: 「カードを作成」「タイトルやタグで検索...」
- **簡潔に**: 最大 30 文字
- **能動的表現**: ユーザー主体
- **敬語不要**: 「登録する」ではなく「登録」

### プレースホルダー

- **アクション指向**: 「検索」「入力」などの動詞で始める
- **具体的なヒント**: 「タイトルやタグで検索...」
- **30 文字以内**: 簡潔に

### エラーメッセージ

- **問題を明確に**: 何が起きたか
- **解決方法を提示**: 次に何をすべきか
- **優しいトーン**: 責めない

## アクセシビリティ要件

### コントラスト比（WCAG AA 準拠）

- **通常テキスト**: 最低 4.5:1
- **大きなテキスト（18pt 以上または 14pt 太字）**: 最低 3:1
- **UI コンポーネント**: 最低 3:1

### キーボード操作

- すべてのインタラクティブ要素は Tab/Shift+Tab でフォーカス可能
- Enter キーで実行可能
- Esc キーでモーダル・ダイアログを閉じる

### フォーカス表示

- フォーカス状態が視覚的に明確
- `focus:ring-2 focus:ring-blue-500` を使用

## レスポンシブデザイン

### ブレークポイント

- **モバイル**: デフォルト（~767px）
- **デスクトップ**: `md:` プレフィックス（768px 以上）

### モバイルファーストアプローチ

- デフォルトはモバイルレイアウト
- `md:` でデスクトップレイアウトを追加
- タッチターゲットサイズ: 最低 48x48px（Material Design 推奨）

### レイアウトパターン

- **モバイル**: 縦スクロール、全画面遷移
- **デスクトップ**: サイドバー + メインコンテンツ

## コーディング規約

### TypeScript

- 厳密モード有効
- `import type` を型のみのインポートに使用（`verbatimModuleSyntax: true`）
- 明示的な型定義を推奨

### React

- 関数コンポーネントのみ使用
- カスタムフックで状態管理ロジックを分離
- props は明示的にインターフェース定義

### ファイル構成

```
src/
├── components/     # UIコンポーネント
├── hooks/          # カスタムフック
├── types/          # 型定義
├── utils/          # ユーティリティ関数
└── App.tsx         # メインアプリ
```

### 命名規則

- **コンポーネント**: PascalCase（例: `CardList.tsx`）
- **フック**: camelCase, `use` プレフィックス（例: `useCards.ts`）
- **型**: PascalCase（例: `Card`, `CardInput`）
- **関数**: camelCase（例: `handleSubmit`）
- **定数**: UPPER_SNAKE_CASE（例: `STORAGE_KEY`）

## パフォーマンス最適化

### React 最適化

- `useCallback` でコールバック関数をメモ化
- 必要に応じて `useMemo` でコストの高い計算をメモ化
- 不要な re-render を避ける

### ストレージ

- localStorage への書き込みは必要最小限に
- 将来的にはデバウンスを検討

## 今後の実装予定

### Phase 1: 基本機能（完了）

- [x] カード CRUD 機能
- [x] 検索・フィルタリング
- [x] レスポンシブ対応
- [x] Material Design 準拠の UI

### Phase 2: 機能拡張

- [ ] タグの選択式 UI（デフォルトタグ設定）
- [ ] Markdown レンダリング
- [ ] カード間双方向リンク
- [x] 問題番号 → 参照フィールドへの拡張（完了）
- [ ] 参照フィールドからの自動タグ付け機能
  - 法律名（特許法、商標法、意匠法など）の自動抽出
  - 条文番号（第 67 条など）の自動抽出
  - ユーザーが手動で削除可能な提案タグとして表示
  - 試験種別の自動判定（知財検定、弁理士試験など）

### Phase 3: 高度な機能

- [ ] グラフビュー（react-force-graph）
  - タグによる関連性の可視化
  - 参照フィールドによる関連性の可視化
  - 明示的なカードリンク（relatedCardIds）による接続表示
  - インタラクティブなノード選択とフィルタリング
- [ ] ダークモード切り替え
- [ ] データエクスポート/インポート
- [ ] Firebase 連携（オプション）
- [ ] ロゴ画像作成後、ヘッダーに適用+ホーム URL へのリンクを設定

## 参考リンク

- [Material Design 3](https://m3.material.io/)
- [Dieter Rams: 10 Principles](https://www.interaction-design.org/literature/article/dieter-rams-10-timeless-commandments-for-good-design)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
