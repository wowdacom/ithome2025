#!/usr/bin/env tsx

// 簡單的 API 測試腳本
async function testAPI() {
    const baseUrl = 'http://localhost:3000';

    console.log('🧪 測試 API 端點...\n');

    // 測試 1: 檢查伺服器是否運行
    try {
        const response = await fetch(`${baseUrl}/`);
        console.log('✅ 伺服器運行中，狀態:', response.status);
    } catch (error) {
        console.error('❌ 伺服器未運行:', error.message);
        return;
    }

    // 測試 2: 檢查 AI assist API
    try {
        const response = await fetch(`${baseUrl}/api/ai/assist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: '測試 AI 協助功能'
            })
        });

        console.log('🤖 AI Assist API 狀態:', response.status);

        if (response.ok) {
            const result = await response.json();
            console.log('✅ AI Assist 回應:', result);
        } else {
            const error = await response.text();
            console.log('❌ AI Assist 錯誤:', error);
        }
    } catch (error) {
        console.error('❌ AI Assist API 錯誤:', error.message);
    }

    // 測試 3: 檢查文章 API
    try {
        const response = await fetch(`${baseUrl}/api/articles`);
        console.log('📝 Articles API 狀態:', response.status);

        if (response.ok) {
            const articles = await response.json();
            console.log('✅ 文章數量:', articles.length);
        }
    } catch (error) {
        console.error('❌ Articles API 錯誤:', error.message);
    }
}

testAPI();