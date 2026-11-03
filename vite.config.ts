import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build:offline` packs the whole app (code, styles, fonts, images)
// into one self-contained HTML file that opens from disk with no network.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'offline' ? [react(), viteSingleFile()] : [react()],
  server: { host: true },
  build: mode === 'offline' ? { outDir: 'dist-offline' } : {},
}))
