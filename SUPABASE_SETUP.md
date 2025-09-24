# Supabase 身份驗證設定指南

## 前置準備

1. 前往 [Supabase](https://supabase.com) 建立帳號
2. 建立新的專案

## 設定步驟

### 1. 獲取 Supabase 配置

1. 在 Supabase Dashboard 中，前往 **Settings** > **API**
2. 複製以下資訊：
   - Project URL (例如: `https://your-project-id.supabase.co`)
   - anon/public API key

### 2. 設定環境變數

1. 複製 `frontend/.env.example` 為 `frontend/.env`
2. 將實際的 Supabase 配置填入：

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. 設定身份驗證

在 Supabase Dashboard 中：

1. 前往 **Authentication** > **Settings**
2. 設定 **Site URL**：`http://localhost:5173`
3. 在 **Redirect URLs** 中添加：
   - `http://localhost:5173/admin`
   - `http://localhost:5173/login`

### 4. 建立管理員帳號

有兩種方式建立管理員帳號：

#### 方式一：透過 Supabase Dashboard

1. 前往 **Authentication** > **Users**
2. 點擊 **Add user**
3. 輸入 email 和密碼

#### 方式二：透過應用程式註冊

1. 啟動應用程式：`npm run dev`
2. 前往 `http://localhost:5173/login`
3. 點擊「還沒有帳號？點此註冊」
4. 填寫表單進行註冊

## 使用方式

1. 啟動應用程式：

   ```bash
   cd frontend
   npm run dev
   ```

2. 訪問 `http://localhost:5173`

3. 若要進入後台管理，直接訪問 `http://localhost:5173/admin`

   - 未登入用戶會被重定向到登入頁面
   - 登入後會自動跳轉到後台

4. 在後台可以：
   - 管理文章
   - 新增文章
   - 登出

## 安全性說明

- 所有後台路由都需要身份驗證
- 使用 Vue Router 守衛保護路由
- Supabase 處理安全的身份驗證
- 用戶會話狀態會持久化保存

## 故障排除

### 問題：無法連接到 Supabase

- 檢查環境變數是否正確設定
- 確認 Supabase 專案狀態正常

### 問題：登入後重定向失敗

- 檢查 Supabase 的 Redirect URLs 設定
- 確認路由守衛正常運作

### 問題：TypeScript 錯誤

- 執行 `npm run type-check` 檢查類型錯誤
- 確認所有依賴已正確安裝
