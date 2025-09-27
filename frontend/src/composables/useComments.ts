// no direct vue refs required here; this is a storage-backed helper

export interface CommentRecord {
  id: string
  author?: string
  email?: string
  message: string
  createdAt: number
}

const STORAGE_PREFIX = 'ithome_comments_v1:'

function keyForArticle(articleId: string) {
  return `${STORAGE_PREFIX}${articleId}`
}

export function useComments() {
  const listeners = new Map<string, Set<() => void>>()

  function loadComments(articleId: string): Promise<CommentRecord[]> {
    try {
      const raw = localStorage.getItem(keyForArticle(articleId))
      if (!raw) return Promise.resolve([])
      const parsed = JSON.parse(raw) as CommentRecord[]
      // sort by createdAt desc
      parsed.sort((a, b) => b.createdAt - a.createdAt)
      return Promise.resolve(parsed)
    } catch (err) {
      console.error('Failed to load comments', err)
      return Promise.resolve([])
    }
  }

  function saveComments(articleId: string, comments: CommentRecord[]) {
    try {
      localStorage.setItem(keyForArticle(articleId), JSON.stringify(comments))
      // notify listeners
      const set = listeners.get(articleId)
      if (set) {
        for (const cb of set) cb()
      }
      // also dispatch a storage event for other tabs
      try {
        // not all browsers allow constructing StorageEvent, but try best-effort
        const ev = new StorageEvent('storage', { key: keyForArticle(articleId), newValue: JSON.stringify(comments) })
        window.dispatchEvent(ev)
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Failed to save comments', err)
    }
  }

  async function addComment(articleId: string, payload: Omit<CommentRecord, 'id' | 'createdAt'>) {
    const list = await loadComments(articleId)
    const item: CommentRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      author: payload.author,
      email: payload.email,
      message: payload.message,
      createdAt: Date.now(),
    }
    const next = [item, ...list]
    saveComments(articleId, next)
    return item
  }

  async function removeComment(articleId: string, id: string) {
    const list = await loadComments(articleId)
    const next = list.filter((c) => c.id !== id)
    saveComments(articleId, next)
  }

  function subscribe(articleId: string, cb: () => void) {
    let set = listeners.get(articleId)
    if (!set) {
      set = new Set()
      listeners.set(articleId, set)
    }
    set.add(cb)

    const handler = (e: StorageEvent) => {
      if (e.key === keyForArticle(articleId)) {
        cb()
      }
    }
    window.addEventListener('storage', handler)

    return () => {
      set!.delete(cb)
      window.removeEventListener('storage', handler)
    }
  }

  return {
    loadComments,
    addComment,
    removeComment,
    subscribe,
  }
}
