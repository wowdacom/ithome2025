import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/admin/AdminApp.vue')
    }
  ],
})

export default router
