/**
 * 格式化日期為本地化字串
 */
export function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return 'N/A'

    try {
        return new Date(dateStr).toLocaleString('zh-TW')
    } catch {
        return 'N/A'
    }
}

/**
 * 截斷文字並加入省略號
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

/**
 * 延遲執行 (for testing)
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 防抖函數
 */
export function debounce<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | undefined

    return (...args: Parameters<T>): void => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}
