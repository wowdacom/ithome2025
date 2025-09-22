#!/usr/bin/env tsx

import 'dotenv/config';
import { OpenAIService } from '../src/data/OpenAIService.js';
import { ENV } from '../src/config/env.js';

async function testOpenAI() {
    try {
        console.log('🧪 測試 OpenAI API 整合...\n');

        // 檢查 API key 是否設定
        if (!ENV.OPENAI_API_KEY || ENV.OPENAI_API_KEY === 'your_openai_api_key_here') {
            console.error('❌ 錯誤: 請在 .env 檔案中設定 OPENAI_API_KEY');
            console.log('提示: 複製 .env.example 到 .env 並填入你的 OpenAI API key');
            process.exit(1);
        }

        const openaiService = new OpenAIService();

        // 測試 1: 基本文章協助
        console.log('📝 測試 1: 文章協助功能');
        const assistResult = await openaiService.generateArticleAssistance(
            '請幫我改善這篇文章的結構和流暢度',
            '這是我的部落格文章。我想要讓它更好。文章內容需要改進。'
        );
        console.log('✅ 文章協助結果:');
        console.log(assistResult.substring(0, 200) + '...\n');

        // 測試 2: 部落格文章生成
        console.log('📄 測試 2: 部落格文章生成');
        const blogResult = await openaiService.generateBlogPost('JavaScript 的最新特性', {
            style: '技術教學',
            length: 'short',
            includeOutline: true
        });
        console.log('✅ 部落格文章結果:');
        console.log(blogResult.substring(0, 300) + '...\n');

        console.log('🎉 所有測試通過！OpenAI API 整合成功！');

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ 測試失敗:', errorMessage);

        if (errorMessage.includes('401')) {
            console.log('提示: 請檢查你的 OpenAI API key 是否正確');
        } else if (errorMessage.includes('quota')) {
            console.log('提示: 你的 OpenAI 帳戶可能已達到使用額度限制');
        }

        process.exit(1);
    }
}

testOpenAI();