# GoGoLamp - リアルタイム Stripe 決済通知システム

[🇯🇵 日本語版 README](README.ja.md) | [🇬🇧 English README](README.md)

Stripe ウェブフック受信時に光るリアルタイム決済可視化システムです。視覚的・音声通知機能とモダンなアニメーションインターフェースを提供します。

## 機能

- 🔴 Stripe ウェブフック経由でのリアルタイム決済通知
- 🎵 決済受信時の音声アラート
- 💡 カスタム画像を使用したランプアニメーション
- 📊 決済履歴追跡
- 🌐 Socket.IO による瞬時通信
- 🎨 Framer Motion アニメーション搭載のモダンUI
- 💳 安全なウェブフック署名検証

## 技術スタック

- **フロントエンド**: React 18 + TypeScript + Vite
- **バックエンド**: Express.js + Socket.IO
- **ストレージ**: インメモリストレージ（PostgreSQLに簡単拡張可能）
- **UI**: Tailwind CSS + shadcn/ui コンポーネント
- **アニメーション**: Framer Motion
- **決済処理**: Stripe ウェブフック

## 前提条件

- Node.js 18+ と npm
- ウェブフックエンドポイントが設定された Stripe アカウント

## 環境変数

ルートディレクトリに `.env` ファイルを作成し、以下の変数を設定してください：

```env
# Stripe 設定
STRIPE_SECRET_KEY=sk_test_...                    # Stripe シークレットキー
STRIPE_WEBHOOK_SECRET=whsec_...                  # ウェブフックエンドポイントシークレット
VITE_STRIPE_PUBLIC_KEY=pk_test_...               # Stripe 公開可能キー

# 開発環境
NODE_ENV=development
```

### Stripe API キーの取得方法

1. [Stripe ダッシュボード API キー](https://dashboard.stripe.com/apikeys) にアクセス
2. **公開可能キー**（`pk_` で始まる）を `VITE_STRIPE_PUBLIC_KEY` にコピー
3. **シークレットキー**（`sk_` で始まる）を `STRIPE_SECRET_KEY` にコピー
4. ウェブフック設定：
   - [Stripe ウェブフック](https://dashboard.stripe.com/webhooks) にアクセス
   - `https://your-domain.com/api/webhook` を指す新しいウェブフックエンドポイントを作成
   - イベント選択: `payment_intent.succeeded`
   - **署名シークレット**（`whsec_` で始まる）を `STRIPE_WEBHOOK_SECRET` にコピー

## インストール

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/yourusername/gogolamp.git
   cd gogolamp
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **環境変数を設定**
   ```bash
   cp .env.example .env
   # .env ファイルを設定内容で編集
   ```

4. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

アプリケーションは `http://localhost:5000` で利用できます

## デプロイ

### Replit デプロイ（推奨）

1. このリポジトリを Replit にインポート
2. Secrets タブで環境変数を設定
3. 「Deploy」をクリックして本番デプロイを作成
4. デプロイ URL を Stripe ウェブフックエンドポイントとして使用

### 手動デプロイ

1. アプリケーションをビルド：
   ```bash
   npm run build
   ```

2. 本番環境変数を設定

3. 本番サーバーを起動：
   ```bash
   npm start
   ```

## カスタマイズ

### カスタム画像

`client/public/images/` にある標準ランプ画像を置き換え：
- `lamp-off.png` - 決済未検出時に表示される画像
- `lamp-on.png` - 決済受信時に表示される画像

### 音声

`client/public/sounds/` にある決済音を置き換え：
- `payment-sound.m4a` - 決済受信時に再生される音

### ウェブフックイベント

システムは以下の Stripe イベントをリッスンします：
- `payment_intent.succeeded` - ランプ点灯をトリガー

## API エンドポイント

- `GET /api/payments` - 決済履歴を取得
- `POST /api/webhook` - Stripe ウェブフックエンドポイント（Stripe ダッシュボードで設定）
- `POST /api/test-payment` - 開発用テストエンドポイント

## 開発コマンド

```bash
# 開発サーバーを起動
npm run dev

# 本番用にビルド
npm run build

# 本番サーバーを起動
npm start

# 型チェック
npm run check
```

## プロジェクト構造

```
├── client/                 # React フロントエンド
│   ├── public/            # 静的アセット（画像、音声）
│   └── src/
│       ├── components/    # React コンポーネント
│       ├── pages/         # アプリケーションページ
│       └── lib/           # ユーティリティと設定
├── server/                # Express バックエンド
│   ├── index.ts          # サーバーエントリーポイント
│   ├── routes.ts         # API ルート
│   └── storage.ts        # データベースインターフェース
├── shared/                # 共有型とスキーマ
└── README.ja.md
```

## 貢献

1. リポジトリをフォーク
2. 機能ブランチを作成: `git checkout -b feature-name`
3. 変更をコミット: `git commit -m 'Add feature'`
4. ブランチにプッシュ: `git push origin feature-name`
5. プルリクエストを送信

詳細については [CONTRIBUTING.ja.md](CONTRIBUTING.ja.md) をご覧ください。

## ライセンス

このプロジェクトは MIT ライセンスの下でライセンスされています - 詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## サポート

問題が発生した場合や質問がある場合：
1. [Issues](https://github.com/yourusername/gogolamp/issues) ページを確認
2. 問題に関する詳細情報を含む新しい Issue を作成
3. 環境詳細とエラーメッセージを含める

## 謝辞

- [Stripe](https://stripe.com) 決済処理
- [Socket.IO](https://socket.io) リアルタイム通信
- [Framer Motion](https://www.framer.com/motion/) アニメーション
- [shadcn/ui](https://ui.shadcn.com) UI コンポーネント