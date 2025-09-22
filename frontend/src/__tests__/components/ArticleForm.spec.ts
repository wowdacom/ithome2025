import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ArticleForm from '@/components/ArticleForm.vue'
import type { CreateArticleRequest } from '@/types/article'

describe('ArticleForm', () => {
  it('should render form fields correctly', () => {
    // Red: 這個測試會失敗，因為 ArticleForm.vue 還不存在
    const wrapper = mount(ArticleForm)

    expect(wrapper.find('input[name="title"]').exists()).toBe(true)
    expect(wrapper.find('input[name="category"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="content"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    expect(wrapper.find('button[type="button"]').exists()).toBe(true)
  })

  it('should have empty initial form values', () => {
    const wrapper = mount(ArticleForm)

    const titleInput = wrapper.find('input[name="title"]')
    const categoryInput = wrapper.find('input[name="category"]')
    const contentTextarea = wrapper.find('textarea[name="content"]')

    expect(titleInput.element.value).toBe('')
    expect(categoryInput.element.value).toBe('')
    expect(contentTextarea.element.value).toBe('')
  })

  it('should update form values when user types', async () => {
    const wrapper = mount(ArticleForm)

    const titleInput = wrapper.find('input[name="title"]')
    const categoryInput = wrapper.find('input[name="category"]')
    const contentTextarea = wrapper.find('textarea[name="content"]')

    await titleInput.setValue('Test Title')
    await categoryInput.setValue('Test Category')
    await contentTextarea.setValue('Test Content')

    expect(titleInput.element.value).toBe('Test Title')
    expect(categoryInput.element.value).toBe('Test Category')
    expect(contentTextarea.element.value).toBe('Test Content')
  })

  it('should emit create-article event when form is submitted', async () => {
    const wrapper = mount(ArticleForm)

    // Fill form
    await wrapper.find('input[name="title"]').setValue('New Article')
    await wrapper.find('input[name="category"]').setValue('tech')
    await wrapper.find('textarea[name="content"]').setValue('Article content')

    // Submit form
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('create-article')).toBeTruthy()
    expect(wrapper.emitted('create-article')).toHaveLength(1)

    const emittedData = wrapper.emitted('create-article')![0][0] as CreateArticleRequest
    expect(emittedData).toEqual({
      title: 'New Article',
      category: 'tech',
      content: 'Article content'
    })
  })

  it('should not submit form when required fields are empty', async () => {
    const wrapper = mount(ArticleForm)

    // Try to submit empty form
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('create-article')).toBeFalsy()
  })

  it('should require all fields to be filled', async () => {
    const wrapper = mount(ArticleForm)

    const titleInput = wrapper.find('input[name="title"]')
    const categoryInput = wrapper.find('input[name="category"]')
    const contentTextarea = wrapper.find('textarea[name="content"]')

    expect(titleInput.attributes('required')).toBeDefined()
    expect(categoryInput.attributes('required')).toBeDefined()
    expect(contentTextarea.attributes('required')).toBeDefined()
  })

  it('should reset form when reset button is clicked', async () => {
    const wrapper = mount(ArticleForm)

    // Fill form
    await wrapper.find('input[name="title"]').setValue('Test Title')
    await wrapper.find('input[name="category"]').setValue('Test Category')
    await wrapper.find('textarea[name="content"]').setValue('Test Content')

    // Click reset button (specifically the one with text 清除)
    const resetBtn = wrapper.findAll('button').find(b => b.text().includes('清除'))!
    await resetBtn.trigger('click')

    // Check form is reset
    expect(wrapper.find('input[name="title"]').element.value).toBe('')
    expect(wrapper.find('input[name="category"]').element.value).toBe('')
    expect(wrapper.find('textarea[name="content"]').element.value).toBe('')
  })

  it('should render AI 建議 button (AI assist feature)', () => {
    // Red: 初始實作中還沒有 AI 建議按鈕，這個測試會失敗，驅動實作
    const wrapper = mount(ArticleForm)
    const aiBtn = wrapper.find('button.ai-assist')
    expect(aiBtn.exists()).toBe(true)
    expect(aiBtn.text()).toContain('AI')
  })

  it('should disable submit button when loading', async () => {
    const wrapper = mount(ArticleForm, {
      props: { loading: true }
    })

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
    expect(submitButton.text()).toContain('新增中')
  })

  it('should enable submit button when not loading', async () => {
    const wrapper = mount(ArticleForm, {
      props: { loading: false }
    })

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeUndefined()
    expect(submitButton.text()).toContain('新增文章')
  })

  it('should clear form via exposed method', async () => {
    const wrapper = mount(ArticleForm)

    // Fill form
    await wrapper.find('input[name="title"]').setValue('Test Title')
    await wrapper.find('input[name="category"]').setValue('Test Category')
    await wrapper.find('textarea[name="content"]').setValue('Test Content')

    // Call exposed clear method
    wrapper.vm.clearForm()
    await nextTick()

    // Check form is cleared
    expect(wrapper.find('input[name="title"]').element.value).toBe('')
    expect(wrapper.find('input[name="category"]').element.value).toBe('')
    expect(wrapper.find('textarea[name="content"]').element.value).toBe('')
  })

  it('should validate form before submission', async () => {
    const wrapper = mount(ArticleForm)

    // Submit with only title filled
    await wrapper.find('input[name="title"]').setValue('Test Title')
    await wrapper.find('form').trigger('submit.prevent')

    // Should not emit because form is incomplete
    expect(wrapper.emitted('create-article')).toBeFalsy()
  })
})
