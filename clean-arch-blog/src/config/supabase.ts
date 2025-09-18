import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
    console.warn('[supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY. Supabase features will be disabled.');
}

// 公開用（驗證使用者 JWT）
export const supabasePublic = (ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY)
    ? createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY)
    : undefined;

// 服務端權限（僅在需要 server-side 操作時使用，例如後台批次作業）
export const supabaseService = (ENV.SUPABASE_URL && ENV.SUPABASE_SERVICE_ROLE_KEY)
    ? createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY)
    : undefined;
