# czimg — ブラウザ画像圧縮・変換ツール

ブラウザ上で完結する画像圧縮・変換ツール。
Rust + WebAssembly で構築されており、画像はサーバーに送信されません。

## 機能

- **フォーマット変換** — PNG / JPEG / WebP への変換
- **品質調整** — JPEG・WebP の品質を 1〜100 で指定
- **リサイズ** — 幅・高さ指定（アスペクト比維持オプション付き）
- **プレビュー** — 変換前後の画像をブラウザ上で確認
- **サイズ比較** — 変換前後のファイルサイズと圧縮率を表示
- **ダウンロード** — 変換後の画像をダウンロード

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| 画像処理 | Rust + WebAssembly（`image` クレート） |
| ビルドツール | wasm-pack |
| フロントエンド | TypeScript + Vite |
| WebP 変換 | Canvas API（ブラウザネイティブ） |
| デプロイ | GitHub Pages / Cloudflare Pages |

## セットアップ

### 必要なもの

- Rust（stable）
- wasm-pack
- Node.js 18+

```bash
# wasm32 ターゲットの追加
rustup target add wasm32-unknown-unknown

# wasm-pack のインストール
cargo install wasm-pack
```

### 開発サーバーの起動

```bash
# WASM ビルド + 開発サーバー起動
npm run dev
```

### プロダクションビルド

```bash
npm run build
# 出力先: web/dist/
```

## プロジェクト構成

```
czimg/
├── Cargo.toml          # Rust クレート設定
├── src/
│   └── lib.rs          # WASM 公開 API（デコード・リサイズ・エンコード）
├── web/
│   ├── index.html      # UI
│   ├── style.css       # スタイル
│   ├── main.ts         # TypeScript ロジック
│   ├── vite.config.ts  # Vite 設定
│   └── pkg/            # wasm-pack ビルド出力（gitignore）
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages 自動デプロイ
└── package.json        # ルートビルドスクリプト
```

## ライセンス

MIT
