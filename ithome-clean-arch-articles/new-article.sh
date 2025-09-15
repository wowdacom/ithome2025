#!/bin/bash

# 檢查是否有輸入檔名
if [ -z "$1" ]; then
  echo "請輸入檔名，例如： ./newmd.sh mynote"
  exit 1
fi

DIR="articles"
FILENAME="$DIR/$1.md"

# 確保 articles 資料夾存在
mkdir -p "$DIR"

# 如果檔案已存在，提醒使用者
if [ -e "$FILENAME" ]; then
  echo "檔案 $FILENAME 已經存在。"
else
  # 建立檔案並寫入初始內容
  cat << EOF > "$FILENAME"
# $1

建立日期：$(date +"%Y-%m-%d %H:%M:%S")

---

## 今日主題：

## 範例故事：

## 在程式中的應用是什麼？

## 小結與一個思考問題：

EOF

  echo "已建立 Markdown 檔案：$FILENAME"
fi
