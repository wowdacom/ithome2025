import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Auth helper functions
export const auth = {
    // 登入
    async signIn(email: string, password: string) {
        return await supabase.auth.signInWithPassword({
            email,
            password,
        })
    },

    // 註冊
    async signUp(email: string, password: string) {
        return await supabase.auth.signUp({
            email,
            password,
        })
    },

    // 登出
    async signOut() {
        return await supabase.auth.signOut()
    },

    // 獲取當前用戶
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },

    // 獲取當前 session
    async getCurrentSession() {
        const { data: { session } } = await supabase.auth.getSession()
        return session
    },

    // 監聽認證狀態變化
    onAuthStateChange(callback: (event: string, session: unknown) => void) {
        return supabase.auth.onAuthStateChange(callback)
    }
}
