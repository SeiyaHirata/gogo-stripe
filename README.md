# GoGoLamp - リアルタイム Stripe 決済通知システム

Stripe ウェブフック受信時に光るリアルタイム決済可視化システム

## 前提条件

- Node.js 18+ と npm
- ウェブフックエンドポイントが設定された Stripe アカウント

## ⚠️ 重要なデプロイメント警告

**🚨 このアプリケーションを Replit のオートスケールモードでデプロイしないでください！**

WebSocket 接続により大量のコンピュートユニットが消費され、予想外の高額料金が発生します。

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

## ライセンス

MIT License
