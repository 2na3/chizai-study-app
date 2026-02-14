# ChizaiLog

知財知識の記録・蓄積アプリ

ChizaiLogは、知的財産法の学習を支援するカード型知識管理Webアプリケーションです。Zettelkasten方式を採用し、知識の関連性を可視化します。

## 特徴

- **カードベースの知識管理**: Zettelkasten方式で知識を整理
- **Markdownサポート**: 見やすい記法で内容を記述
- **タグフィルタリング**: 効率的な検索と絞り込み
- **データエクスポート/インポート**: JSONファイルでバックアップ可能
- **レスポンシブデザイン**: PC・タブレット・モバイルに対応

## 使い方

### ローカルで編集（フル機能版）

```bash
# インストール
pnpm install

# 開発サーバー起動
pnpm dev

# http://localhost:5173 でアクセス
```

### データのエクスポート

1. アプリのヘッダーにあるフォルダアイコンをクリック
2. 「データをエクスポート」をクリック
3. JSONファイルがダウンロードされる

### 閲覧専用サイトへのデプロイ

1. エクスポートしたJSONファイルを`public/data.json`に配置
2. GitHubにpush
3. GitHub Actionsが自動的にビルド＆デプロイ
4. `https://<username>.github.io/chizai-study-app/`で閲覧可能

## Tech Stack

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
