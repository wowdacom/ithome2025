#!/usr/bin/env node

// 測試前端 AI 功能的腳本
import http from "http";

async function testFrontendAI() {
  console.log("🧪 測試前端 AI 功能整合...\n");

  // 測試管理面板是否可訪問
  try {
    const adminResponse = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/admin.html",
      method: "GET",
    });

    console.log("✅ 管理面板狀態:", adminResponse.statusCode);

    if (adminResponse.body.includes("AI 協助")) {
      console.log("✅ AI 協助功能已整合到前端");
    } else {
      console.log("❌ 未檢測到 AI 協助功能");
    }
  } catch (error) {
    console.error("❌ 管理面板測試失敗:", error.message);
    return;
  }

  // 測試 AI API 是否可從前端呼叫
  try {
    const testPrompt = "請幫我寫一個簡短的技術文章介紹";
    const postData = JSON.stringify({
      prompt: testPrompt,
    });

    const aiResponse = await makeRequest(
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

    console.log("✅ AI API 狀態:", aiResponse.statusCode);

    if (aiResponse.statusCode === 200) {
      const result = JSON.parse(aiResponse.body);
      console.log(
        "✅ AI 回應預覽:",
        result.improvedContent?.substring(0, 100) + "..."
      );
    }
  } catch (error) {
    console.error("❌ AI API 測試失敗:", error.message);
  }

  console.log("\n🎉 前端整合測試完成！");
  console.log("📋 請在瀏覽器中訪問: http://localhost:3000/admin.html");
  console.log('🤖 點擊 "AI 協助" 按鈕測試 AI 功能');
}

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

testFrontendAI();
