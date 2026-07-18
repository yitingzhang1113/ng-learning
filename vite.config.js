import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️ 部署到 GitHub Pages 时,把 base 改成 '/<你的仓库名>/'
// 例如仓库叫 algo-roadmap,就写 base: '/algo-roadmap/'
// 如果用的是 <用户名>.github.io 这种根仓库,保持 '/' 即可。
export default defineConfig({
  base: './',
  plugins: [react()],
})
