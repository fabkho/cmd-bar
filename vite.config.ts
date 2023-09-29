import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts({ rollupTypes: true })],
  resolve: {
    alias: {
      '@': resolve(__dirname, '/.')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CmdBar',
      fileName: 'cmd-bar'
    },
    outDir: 'lib',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
