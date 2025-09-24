import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// 管理員路由守衛
export const adminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  // 等待認證狀態初始化完成
  if (authStore.loading) {
    await authStore.initialize()
  }
  
  if (!authStore.isAuthenticated) {
    // 未登入，導向登入頁面
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (!authStore.isAdmin) {
    // 已登入但不是管理員
    next({
      path: '/blog',
      replace: true
    })
  } else {
    // 通過驗證
    next()
  }
}

// 已登入用戶不能訪問登入頁面
export const guestGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (authStore.loading) {
    await authStore.initialize()
  }
  
  if (authStore.isAuthenticated) {
    // 已登入，導向管理後台
    const redirect = (to.query.redirect as string) || '/admin'
    next(redirect)
  } else {
    next()
  }
}