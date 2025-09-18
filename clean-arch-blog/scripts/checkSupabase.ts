import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

type CheckResult = {
    ok: boolean;
    message: string;
    details?: any;
};

function fail(message: string, details?: any): CheckResult {
    return { ok: false, message, details };
}

function success(message: string, details?: any): CheckResult {
    return { ok: true, message, details };
}

async function main() {
    const url = process.env.SUPABASE_URL;
    const anon = process.env.SUPABASE_ANON_KEY;

    const results: CheckResult[] = [];

    if (!url) results.push(fail('缺少環境變數 SUPABASE_URL'));
    if (!anon) results.push(fail('缺少環境變數 SUPABASE_ANON_KEY'));

    if (results.some(r => !r.ok)) {
        print(results);
        process.exit(1);
    }

    const client = createClient(url!, anon!);

    // 健康檢查策略：
    // 1. 呼叫 auth.getSession() （不需登入，確認 API 可達）
    // 2. 嘗試對一個不存在的 schema/table 做 select 並檢查錯誤型態
    // 3. （可選）future: 讀取一個 metadata table

    try {
        const { data: sessionData, error: sessionErr } = await client.auth.getSession();
        if (sessionErr) {
            results.push(fail('auth.getSession() 失敗', sessionErr.message));
        } else {
            results.push(success('auth API 可達', { hasSession: !!sessionData.session }));
        }
    } catch (e: any) {
        results.push(fail('auth.getSession() 例外', e.message));
    }

    try {
        const { error: tableErr } = await client.from('_connection_check').select('*').limit(1);
        if (tableErr) {
            // 預期：因為 table 不存在會回錯誤，但代表連線與鑑權流程正常
            if (tableErr.message.includes('relation') || tableErr.code === '42P01') {
                results.push(success('可連線 Supabase（查詢回應錯誤但屬於預期，表示連線成功）'));
            } else {
                results.push(fail('無法查詢（非預期錯誤類型）', { code: tableErr.code, message: tableErr.message }));
            }
        } else {
            // 如果真的存在，當作更進一步成功
            results.push(success('測試資料表 _connection_check 存在並可查詢'));
        }
    } catch (e: any) {
        results.push(fail('查詢測試流程例外', e.message));
    }

    print(results);

    if (results.some(r => !r.ok)) process.exit(2);
}

function print(results: CheckResult[]) {
    const ok = results.every(r => r.ok);
    console.log('--- Supabase 健康檢查結果 ---');
    for (const r of results) {
        const mark = r.ok ? '✅' : '❌';
        console.log(`${mark} ${r.message}`);
        if (r.details) console.log('   details:', r.details);
    }
    console.log('總結：', ok ? '全部通過' : '存在問題');
}

main().catch(e => {
    console.error('腳本未捕捉例外', e);
    process.exit(99);
});
