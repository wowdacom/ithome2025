import 'dotenv/config';

function requireEnv(name: string, options?: { optional?: boolean }) {
    const val = process.env[name];
    if (!val && !options?.optional) {
        console.warn(`[env] Missing required environment variable: ${name}`);
    }
    return val || '';
}

export const ENV = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    SUPABASE_URL: requireEnv('SUPABASE_URL'),
    SUPABASE_ANON_KEY: requireEnv('SUPABASE_ANON_KEY'),
    SUPABASE_SERVICE_ROLE_KEY: requireEnv('SUPABASE_SERVICE_ROLE_KEY', { optional: true })
};

export function envReadyForSupabase(): boolean {
    return !!(ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY);
}
