import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MessageDisplay from '@/components/MessageDisplay.vue'
import type { MessageState } from '@/types/article'

describe('MessageDisplay', () => {
    it('should render success message', () => {
        // Red: 這個測試會失敗，因為 MessageDisplay.vue 還不存在
        const message: MessageState = {
            text: 'Success message',
            type: 'success'
        }

        const wrapper = mount(MessageDisplay, {
            props: { message }
        })

        expect(wrapper.text()).toContain('Success message')
        expect(wrapper.classes()).toContain('message')
        expect(wrapper.classes()).toContain('success')
    })

    it('should render error message', () => {
        const message: MessageState = {
            text: 'Error message',
            type: 'error'
        }

        const wrapper = mount(MessageDisplay, {
            props: { message }
        })

        expect(wrapper.text()).toContain('Error message')
        expect(wrapper.classes()).toContain('message')
        expect(wrapper.classes()).toContain('error')
    })

    it('should not render when message text is empty', () => {
        const message: MessageState = {
            text: '',
            type: 'success'
        }

        const wrapper = mount(MessageDisplay, {
            props: { message }
        })

        expect(wrapper.html()).toBe('<!--v-if-->')
    })

    it('should emit clear event after timeout', async () => {
        const message: MessageState = {
            text: 'Test message',
            type: 'success'
        }

        // Mock timers
        vi.useFakeTimers()

        const wrapper = mount(MessageDisplay, {
            props: { message }
        })

        // Fast-forward time by 3 seconds
        vi.advanceTimersByTime(3000)
        await nextTick()

        expect(wrapper.emitted('clear')).toBeTruthy()
        expect(wrapper.emitted('clear')).toHaveLength(1)

        vi.useRealTimers()
    })

    it('should use longer timeout for error messages', async () => {
        const message: MessageState = {
            text: 'Error message',
            type: 'error'
        }

        vi.useFakeTimers()

        const wrapper = mount(MessageDisplay, {
            props: { message }
        })

        // Should not emit after 3 seconds (success timeout)
        vi.advanceTimersByTime(3000)
        await nextTick()
        expect(wrapper.emitted('clear')).toBeFalsy()

        // Should emit after 5 seconds (error timeout)
        vi.advanceTimersByTime(2000) // Total 5 seconds
        await nextTick()
        expect(wrapper.emitted('clear')).toBeTruthy()

        vi.useRealTimers()
    })

    it('should handle prop updates correctly', async () => {
        const initialMessage: MessageState = {
            text: 'Initial message',
            type: 'success'
        }

        const wrapper = mount(MessageDisplay, {
            props: { message: initialMessage }
        })

        expect(wrapper.text()).toContain('Initial message')

        // Update message
        const newMessage: MessageState = {
            text: 'Updated message',
            type: 'error'
        }

        await wrapper.setProps({ message: newMessage })

        expect(wrapper.text()).toContain('Updated message')
        expect(wrapper.classes()).toContain('error')
    })
})
