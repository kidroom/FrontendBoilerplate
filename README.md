# Frontend Boilerplate（Vue 3 後台模板）

企業後台開發起點：Vue 3、Vite、Vue Router、Pinia、Axios、Tailwind CSS v4、shadcn-vue（Reka UI）、VeeValidate + Zod、vue-sonner。

## 快速開始

```bash
npm install
cp .env.example .env
npm run dev
```

- 開發伺服器預設：`http://localhost:5173`（依 Vite 終端機輸出為準）。
- API 基底位址：於 `.env` 設定 `VITE_API_BASE_URL`（見 `.env.example`）。

## 資料夾結構（摘要）

| 路徑 | 說明 |
|------|------|
| `src/api/` | 依模組封裝 HTTP，禁止在元件內直接 new Axios |
| `src/components/ui/` | 基礎 UI（shadcn-vue） |
| `src/components/common/` | 可複用業務元件（如 PageHeader） |
| `src/components/layout/` | 版面（AppLayout：Header / Sidebar / Content） |
| `src/composables/` | 邏輯 hooks（如 useToast、usePermission） |
| `src/constants/` | 常數（導覽、權限碼範例等） |
| `src/config/` | 全域設定（如 toaster 預設） |
| `src/router/` | 路由與守衛（登入、路由級權限 `meta.permission`） |
| `src/stores/` | Pinia（auth、permission、app） |
| `src/types/` | 共用型別 |
| `src/utils/` | 工具（`http` 攔截器） |
| `src/views/` | 頁面（含 `errors/`、`app/` 與 demo） |

## 內建頁面

- **首頁** `/`：模板說明與進入後台／登入。
- **登入** `/login`：模擬登入（寫入 token + 模板權限），可帶 `?redirect=`。
- **後台** `/app`：`AppLayout`（側欄 + 頂欄 + 內容區）。
  - **儀表板** `/app/dashboard`
  - **範例列表**（查詢／分頁／排序／刪除確認）
  - **範例新增／詳情／編輯**（表單驗證範例）
  - **範例上傳**（檔案選取占位）
  - **權限示範**（`v-auth`、權限列表）
- **403** `/403`、**500** `/500`、**404** 萬用路由。

路由級權限：於 `src/router/routes.ts` 設定 `meta.permission`，與 `stores/permission` 比對；按鈕級可用 `v-auth="'權限碼'"`。

## 打包

```bash
npm run build
npm run preview
```

## 部署範例（靜態）

建置產出於 `dist/`，可交由 Nginx、S3、Azure Static Web Apps 等托管；將所有路徑導向 `index.html` 以支援 SPA（Vue Router history 模式）。

範例 Nginx：

```nginx
server {
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 後續接後端

1. 將 `src/api/example.ts`、`src/api/demo.ts` 改為真實路徑與型別。
2. 登入改為呼叫後端，於成功回應內設定 `auth.setToken` 與 `permission.setPermissions`。
3. 依專案調整 `utils/http` 之 401／403／500／timeout／retry 策略。

此模板刻意保留可運行之假資料與模擬登入，方便離線開發與 UI 驗收。
