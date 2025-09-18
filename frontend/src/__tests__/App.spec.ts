import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('部落格後台管理')
    expect(wrapper.text()).toContain('新增文章')
    expect(wrapper.text()).toContain('搜尋文章')
    expect(wrapper.text()).toContain('文章列表')
  })
})
