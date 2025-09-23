import { marked } from 'marked'
import hljs from 'highlight.js'

// 配置 marked 的渲染器
const renderer = new marked.Renderer()

// 自定義代碼區塊渲染
renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
    if (lang && hljs.getLanguage(lang)) {
        try {
            const highlighted = hljs.highlight(text, { language: lang }).value
            return `<pre class="hljs bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4"><code class="hljs language-${lang}">${highlighted}</code></pre>`
        } catch (err) {
            console.warn('Code highlighting failed:', err)
        }
    }

    // 如果沒有指定語言或高亮失敗，使用自動檢測
    const highlighted = hljs.highlightAuto(text).value
    return `<pre class="hljs bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4"><code class="hljs">${highlighted}</code></pre>`
}

// 自定義行內代碼渲染
renderer.codespan = function ({ text }: { text: string }) {
    return `<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">${text}</code>`
}

marked.setOptions({
    renderer,
    breaks: true, // 支援 GitHub 風格的換行
    gfm: true,    // 支援 GitHub Flavored Markdown
})

export function useMarkdown() {
    const renderMarkdown = (content: string): string => {
        if (!content) return ''

        try {
            // 使用 marked 解析 Markdown 為 HTML
            return marked(content) as string
        } catch (error) {
            console.error('Markdown parsing error:', error)
            // 如果解析失敗，返回原始內容
            return content.replace(/\n/g, '<br>')
        }
    }

    return {
        renderMarkdown
    }
}
