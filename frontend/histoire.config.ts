import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  plugins: [
    HstVue(),
  ],
  vite: {
    resolve: {
      dedupe: ['vue'],           // 關鍵：確保只用一份 vue
    },
  }
})
