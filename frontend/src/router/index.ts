import { createRouter, createWebHistory } from 'vue-router'
import { adminGuard, guestGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/blog'
    },
    {
      path: '/blog',
      name: 'BlogHome',
      component: () => import('../views/blog/BlogApp.vue'),
      children: [
        {
          path: '',
          name: 'BlogList',
          component: () => import('../views/blog/BlogArticleList.vue')
        },
        {
          path: 'article/:id',
          name: 'ArticleDetail',
          component: () => import('../views/blog/ArticleDetail.vue'),
          props: true
        }
      ]
    },
    {
      path: '/login',
      name: 'AuthLogin',
      component: () => import('../views/auth/Login.vue'),
      beforeEnter: guestGuard
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/admin/AdminApp.vue'),
      redirect: '/admin/articles',
      beforeEnter: adminGuard,
      children: [
        {
          path: 'create-article',
          name: 'CreateArticle',
          component: () => import('../views/admin/CreateArticle.vue')
        },
        {
          path: 'articles',
          name: 'AdminArticles',
          component: () => import('../views/admin/ArticleManagement.vue')
        }
      ]
    }
  ],
})

export default router
