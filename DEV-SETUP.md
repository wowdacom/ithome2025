# 開發環境啟動腳本使用說明

這個專案提供了兩個腳本，讓你能夠同時啟動前後端開發伺服器。

# 開發環境啟動腳本使用說明

這個專案提供了多種腳本，讓你能夠同時啟動前後端開發伺服器。

## 🚀 快速開始

### Windows 使用者 (三種方式)

#### 方式 1: 批次檔 (推薦)

```cmd
# 在命令提示字元 (cmd) 中執行
start-dev.bat
```

#### 方式 2: PowerShell 腳本

```powershell
# 在 PowerShell 中執行
powershell -ExecutionPolicy Bypass -File "start-dev.ps1"

# 或者如果執行政策允許
.\start-dev.ps1
```

#### 方式 3: 直接在 PowerShell 中執行批次檔

```powershell
cmd /c start-dev.bat
```

### Linux/Mac 使用者

```bash
# 確保腳本有執行權限
chmod +x start-dev.sh

# 執行腳本
./start-dev.sh
```

## 📋 前置需求

在執行腳本之前，請確保已完成以下設定：

1. **安裝 Node.js** (建議版本 18+)

   ```bash
   node --version
   npm --version
   ```

2. **安裝後端依賴**

   ```bash
   cd backend
   npm install
   ```

3. **安裝前端依賴**
   ```bash
   cd frontend
   npm install
   ```

## 🎯 服務位址

腳本成功執行後，你可以透過以下網址存取服務：

- **Backend API**: http://localhost:3000
  - 測試端點：http://localhost:3000/api/articles
- **Frontend 應用程式**: http://localhost:5173
- **Admin 管理面板**: http://localhost:3000/admin.html

## 🛠 腳本功能

### Windows 批次檔 (start-dev.bat)

- ✅ 自動檢查 Node.js 安裝狀態
- ✅ 驗證專案目錄結構
- ✅ 檢查套件配置檔案
- ✅ 在新 CMD 視窗啟動 Backend 伺服器
- ✅ 在新 CMD 視窗啟動 Frontend 開發伺服器
- ✅ 提供清楚的狀態訊息和服務位址
- ✅ 相容於 Windows 命令提示字元和 PowerShell

### Windows PowerShell 腳本 (start-dev.ps1)

- ✅ 彩色輸出和更豐富的使用者介面
- ✅ 詳細的錯誤訊息和版本資訊
- ✅ 支援 -Help 參數顯示使用說明
- ✅ 在新 PowerShell 視窗啟動兩個開發伺服器
- ✅ 自動處理路徑和執行政策問題
- ✅ 更好的 Windows 原生整合

### Linux/Mac 腳本 (start-dev.sh)

- ✅ 自動檢查 Node.js 和 npm 安裝狀態
- ✅ 驗證專案目錄結構
- ✅ 檢查套件配置檔案
- ✅ 在背景啟動兩個開發伺服器
- ✅ 優雅的程序管理和清理
- ✅ 支援 Ctrl+C 停止所有服務

## 🔧 手動啟動 (替代方案)

如果腳本無法正常執行，你也可以手動啟動：

### 終端 1 - 啟動 Backend

```bash
cd backend
npm run dev
```

### 終端 2 - 啟動 Frontend

```bash
cd frontend
npm run dev
```

## 🐛 常見問題

### 問題 1：Port 已被占用

```
Error: listen EADDRINUSE: address already in use :::3000
```

**解決方案**：

1. 找出占用端口的程序：
   - Windows: `netstat -ano | findstr :3000`
   - Linux/Mac: `lsof -i :3000`
2. 終止該程序或更改配置中的端口

### 問題 2：npm 指令未找到

```
'npm' is not recognized as an internal or external command
```

**解決方案**：

1. 確認 Node.js 已正確安裝
2. 重新啟動命令列工具
3. 檢查 PATH 環境變數

### 問題 3：依賴套件未安裝

```
Error: Cannot find module 'express'
```

**解決方案**：

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 💡 開發提示

1. **監控日誌**：兩個服務都會顯示即時日誌，監控 API 請求和錯誤
2. **熱重載**：前端和後端都支援熱重載，修改代碼後會自動重啟
3. **測試 API**：可以使用 `backend/test-api.http` 檔案測試 API 端點
4. **除錯模式**：後端支援 Node.js debugger，可在 VSCode 中設定中斷點

## 📚 相關文件

- [Backend API 文件](./backend/README.md)
- [Frontend 開發指南](./frontend/README.md)
- [Clean Architecture 架構說明](./ithome-clean-arch-articles/README.md)
