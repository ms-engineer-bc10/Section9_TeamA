# ベースイメージとして軽量なNode.js 18イメージを使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 開発モードで実行
CMD ["npm", "run", "dev"]

# 本番用のコマンドをコメントアウトで準備
# CMD ["npm", "start"]
