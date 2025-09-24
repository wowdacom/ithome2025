import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  // 狀態
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 計算屬性
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => {
    // 可以根據需要添加管理員判斷邏輯
    // 例如檢查用戶的 role 或特定 email
    return isAuthenticated.value
  })

  // 初始化認證狀態
  const initialize = async () => {
    loading.value = true
    try {
      const currentSession = await auth.getCurrentSession()
      const currentUser = await auth.getCurrentUser()
      
      session.value = currentSession
      user.value = currentUser
    } catch (err) {
      console.error('認證初始化失敗:', err)
      error.value = '認證初始化失敗'
    } finally {
      loading.value = false
    }
  }

  // 登入
  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: signInError } = await auth.signIn(email, password)
      
      if (signInError) {
        throw signInError
      }

      user.value = data.user
      session.value = data.session
      
      return { success: true }
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || '登入失敗'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 註冊
  const signUp = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: signUpError } = await auth.signUp(email, password)
      
      if (signUpError) {
        throw signUpError
      }

      // 註冊成功但可能需要郵箱驗證
      if (data.user && !data.session) {
        return { success: true, needsVerification: true }
      }

      user.value = data.user
      session.value = data.session
      
      return { success: true }
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || '註冊失敗'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const signOut = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { error: signOutError } = await auth.signOut()
      
      if (signOutError) {
        throw signOutError
      }

      user.value = null
      session.value = null
      
      return { success: true }
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || '登出失敗'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 清除錯誤
  const clearError = () => {
    error.value = null
  }

  // 監聽認證狀態變化
  const setupAuthListener = () => {
    auth.onAuthStateChange((event, authSession) => {
      console.log('Auth state changed:', event, authSession)
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // 類型守衛檢查 authSession 是否有效
        if (authSession && typeof authSession === 'object' && 'user' in authSession) {
          session.value = authSession as Session
          user.value = (authSession as Session).user || null
        }
      } else if (event === 'SIGNED_OUT') {
        session.value = null
        user.value = null
      }
    })
  }

  return {
    // 狀態
    user,
    session,
    loading,
    error,
    
    // 計算屬性
    isAuthenticated,
    isAdmin,
    
    // 方法
    initialize,
    signIn,
    signUp,
    signOut,
    clearError,
    setupAuthListener
  }
})