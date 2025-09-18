#!/bin/bash

# 同時啟動前後端開發伺服器
echo "🚀 啟動前後端開發環境..."
echo

# 檢查 Node.js 是否已安裝
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤：未找到 Node.js，請先安裝 Node.js"
    exit 1
fi

echo "✅ Node.js 已安裝 ($(node --version))"

# 檢查 npm 是否已安裝
if ! command -v npm &> /dev/null; then
    echo "❌ 錯誤：未找到 npm，請先安裝 npm"
    exit 1
fi

echo "✅ npm 已安裝 ($(npm --version))"

# 取得腳本所在目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 檢查 backend 目錄是否存在
if [ ! -d "$SCRIPT_DIR/backend" ]; then
    echo "❌ 錯誤：找不到 backend 目錄"
    exit 1
fi

# 檢查 frontend 目錄是否存在
if [ ! -d "$SCRIPT_DIR/frontend" ]; then
    echo "❌ 錯誤：找不到 frontend 目錄"
    exit 1
fi

echo "✅ 專案目錄結構正確"

# 檢查 backend package.json 是否存在
if [ ! -f "$SCRIPT_DIR/backend/package.json" ]; then
    echo "❌ 錯誤：backend/package.json 不存在，請先執行 'cd backend && npm install'"
    exit 1
fi

# 檢查 frontend package.json 是否存在
if [ ! -f "$SCRIPT_DIR/frontend/package.json" ]; then
    echo "❌ 錯誤：frontend/package.json 不存在，請先執行 'cd frontend && npm install'"
    exit 1
fi

echo "✅ 套件配置檔案存在"
echo

# 函數：清理背景程序
cleanup() {
    echo
    echo "🛑 正在停止開發伺服器..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "🔧 Backend 伺服器已停止"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "🎨 Frontend 伺服器已停止"
    fi
    echo "👋 開發環境已關閉"
    exit 0
}

# 設定信號處理
trap cleanup SIGINT SIGTERM

# 啟動 backend 伺服器
echo "🔧 啟動 Backend 伺服器 (PORT=3000)..."
cd "$SCRIPT_DIR/backend"
npm run dev &
BACKEND_PID=$!

# 等待 backend 啟動
echo "⏳ 等待 Backend 伺服器啟動..."
sleep 3

# 啟動 frontend 開發伺服器
echo "🎨 啟動 Frontend 開發伺服器 (PORT=5173)..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo
echo "🎉 前後端開發環境啟動完成！"
echo
echo "📍 服務位址："
echo "   🔗 Backend API:  http://localhost:3000"
echo "   🔗 Frontend App: http://localhost:5173"
echo "   🔗 Admin Panel:  http://localhost:3000/admin.html"
echo
echo "💡 提示："
echo "   - 按 Ctrl+C 停止所有服務"
echo "   - 兩個服務在背景執行"
echo "   - 檢查終端輸出瞭解服務狀態"
echo

# 等待用戶中斷
wait