import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
// 代码压缩
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    (monacoEditorPlugin as any).default({
      // 可选配置：指定需要支持的语言工作器（Worker），按需加载以减少打包体积
      languageWorkers: ['editorWorkerService'],
      // 其他插件选项...
    }),
    viteCompression({
      // 压缩代码
      algorithm: 'gzip', // 压缩算法，可选['gzip', 'brotliCompress', 'deflate', 'deflateRaw']
      ext: '.gz', // 压缩文件的扩展名
      threshold: 10240, // 文件大小超过10240字节（10KB）时才进行压缩
      deleteOriginFile: false, // 压缩后是否删除源文件
      // verbose: true, // 是否在控制台输出压缩结果，默认为true
      // disable: false, // 是否禁用压缩，默认为false
      // filter: /\.(js|css|html)$/i, // 指定需要压缩的文件类型
      // compressionOptions: {}, // 压缩算法的参数
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    visualizer({
      gzipSize: true, // 显示各文件在经过 gzip 压缩后的大小
      brotliSize: true, // 显示各文件在经过 brotli 压缩后的
      open: false,
      filename: 'visualizer.html', // 生成的报告文件名称
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router'],
          antd: ['antd'],
          monaco: ['monaco-editor/esm/vs/editor/editor.api'],
          axios: ['axios'],
        },
      },
    },
  },
})
