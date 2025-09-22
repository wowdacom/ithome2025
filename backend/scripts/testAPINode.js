#!/usr/bin/env node

import http from "http";

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testAPI() {
  console.log("🧪 測試 API 端點...\n");

  // 測試 1: 檢查伺服器狀態
  try {
    const result = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/",
      method: "GET",
    });
    console.log("✅ 伺服器狀態:", result.statusCode, result.statusMessage);
  } catch (error) {
    console.error("❌ 伺服器錯誤:", error.message);
    return;
  }

  // 測試 2: AI assist API
  try {
    const postData = JSON.stringify({
      prompt: "測試 AI 協助功能",
    });

    const result = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/ai/assist",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      postData
    );

    console.log(
      "🤖 AI Assist API 狀態:",
      result.statusCode,
      result.statusMessage
    );
    console.log("📝 回應內容:", result.body);
  } catch (error) {
    console.error("❌ AI Assist API 錯誤:", error.message);
  }
}

testAPI();
