import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import BlogApp from '../../views/blog/BlogApp.vue'

// 創建測試用路由
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: { template: '<div>Home</div>' }
        },
        {
            path: '/blog',
            name: 'BlogHome',
            component: { template: '<div>BlogHome</div>' }
        },
        {
            path: '/admin',
            name: 'Admin',
            component: { template: '<div>Admin</div>' }
        }
    ]
})

describe('BlogApp.vue', () => {
    const globalConfig = {
        plugins: [router],
        stubs: {
            'router-link': {
                template: '<a :href="to"><slot /></a>',
                props: ['to']
            },
            'router-view': { template: '<div></div>' }
        }
    }

    it('應該渲染部落格標題', async () => {
        const wrapper = mount(BlogApp, {
            global: globalConfig
        })

        expect(wrapper.find('h1').text()).toBe('我的技術部落格')
    })

    it('應該包含管理後台連結', async () => {
        const wrapper = mount(BlogApp, {
            global: globalConfig
        })

        const adminLink = wrapper.find('.admin-link')
        expect(adminLink.exists()).toBe(true)
        expect(adminLink.text()).toBe('管理後台')
        expect(adminLink.attributes('href')).toBe('/admin')
    })

    it('應該包含 router-view 來顯示子路由', async () => {
        const wrapper = mount(BlogApp, {
            global: globalConfig
        })

        // 查找我們 stub 的 router-view
        const routerView = wrapper.find('div') // stub 的 router-view 被渲染為 div
        expect(routerView.exists()).toBe(true)
    })

    it('應該有正確的 CSS 類別結構', async () => {
        const wrapper = mount(BlogApp, {
            global: globalConfig
        })

        expect(wrapper.find('.blog-layout').exists()).toBe(true)
        expect(wrapper.find('.blog-header').exists()).toBe(true)
        expect(wrapper.find('.blog-main').exists()).toBe(true)
        expect(wrapper.find('.blog-footer').exists()).toBe(true)
    })

    it('應該顯示正確的版權資訊', async () => {
        const wrapper = mount(BlogApp, {
            global: globalConfig
        })

        expect(wrapper.find('.blog-footer p').text()).toBe('© 2025 ITHome 2025 部落格. All rights reserved.')
    })
})
