# CheatSheet Hub (Docker)

要件定義の機能（CRUD/権限/履歴/検索）を前提に、まずは Directus + Postgres + Redis で CMS/API 基盤を立ち上げる構成です。

## 起動手順
1. cp .env.example .env
2. .env の DIRECTUS_SECRET と DIRECTUS_ADMIN_* を更新
3. Google OAuth を使わない場合は AUTH_PROVIDERS を空のままにする
4. docker compose up -d
5. http://localhost:8055 にアクセス

## トラブルシューティング（起動しない場合）
- `.env` が無い場合は `docker-compose.yml` のデフォルト値で起動します。実運用では必ず `.env` を用意して上書きしてください
- Google OAuth を使う場合のみ `AUTH_PROVIDERS=google` と各種クレデンシャルを設定してください
- それでも起動しない場合は `docker compose logs -f` で該当サービスのエラーを確認してください

## メモ
- 初回起動時に `db/init.sql` が実行されます。
- 以降、Directus でコレクションを作成して要件のデータモデルに合わせてください。
