***

### １．システム概要
- プログラミング言語/ツールのチートシートを集約・検索・閲覧するためのWebアプリ（CheatSheet Hub）
- 本文はMarkdownで管理し、カテゴリ/タグ/難易度/対象バージョンで整理
- Directus（CMS）をAPI基盤として使い、Next.jsのフロントで公開/検索/編集UIを提供

### ２．技術スタック
- フロントエンド: Next.js 16（App Router）, React 19, TypeScript, Tailwind CSS v4, NextAuth
- CMS/API: Directus 11.5.1, Directus SDK（REST）
- データベース/キャッシュ: PostgreSQL 16, Redis 7
- Markdown: react-markdown, remark-gfm, rehype-highlight
- 開発環境: Docker Compose

### ３．セットアップ
① ルートに`.env`（任意）を作成してDirectus/DB設定を上書き
```env
POSTGRES_DB=cheatsheet
POSTGRES_USER=cheatsheet
POSTGRES_PASSWORD=cheatsheet
DIRECTUS_SECRET=dev-secret-change-me
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=change-me-please
CORS_ORIGIN=http://localhost:3000
PUBLIC_URL=http://localhost:8055
```

② インフラ起動（DB/Redis/Directus）
```bash
docker compose up -d
```

③ Directusにログインし、必要なら`directus/schema/snapshot.yaml`をインポート

④ `frontend/.env.local`を作成
```env
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_STATIC_TOKEN=***   # Directusで発行したアクセストークン
AUTH_GOOGLE_CLIENT_ID=***
AUTH_GOOGLE_CLIENT_SECRET=***
```

⑤ フロントエンド起動
```bash
cd frontend
npm install
npm run dev
```

### ４．アクセス
- フロントエンド: http://localhost:3000
- Directus管理画面: http://localhost:8055
- Directus API: http://localhost:8055/items/...

### ５．使い方
- 閲覧: トップ/カテゴリ/タグ/検索からチートシートを探し、詳細ページでMarkdownを確認
- 編集: Googleログイン後に`/editor`へアクセスし、新規作成・下書き・公開・アーカイブを操作
- 分類: カテゴリ/タグ/関連チートシート/OG画像などはDirectus管理画面で編集
- Markdown: コードブロックの言語指定（例: `js`）でハイライト表示

### ６．ディレクトリ構成
```text
.
├─ docker-compose.yml        # Directus/Postgres/Redis
├─ db/
│  └─ init.sql               # 拡張(pg_trgm, unaccent)
├─ directus/
│  ├─ schema/snapshot.yaml   # データモデル
│  ├─ uploads/               # 画像/ファイル
│  └─ extensions/            # Directus拡張
├─ frontend/
│  ├─ src/app                # Next.js App Router
│  ├─ src/components         # UIコンポーネント
│  ├─ src/lib                # Directus/Markdown/認証
│  └─ src/types              # 型定義
└─ document.txt              # 要件定義書（UI除外）
```

***
