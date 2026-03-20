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
      // 这里只保留项目中实际使用到的语言，避免打包过大
      languages: [
        'typescript',
        'javascript',
        'python',
        'java',
        'css',
        'html',
        'sql',
        'json',
        'markdown',
        'xml',
        'yaml',
      ],
      // 如果你不需要全部编辑器功能，可进一步缩减（例如不需要格式化、提示等）
      // features: ['coreCommands', 'find', 'bracketMatching', 'suggest'],
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
    /**
     * 同时生成两种格式后，服务器可以根据客户端请求头中的 Accept-Encoding 字段动态选择最优格式：
     * 如果浏览器支持 brotli，就返回 .br 文件（体积更小）
     * 如果不支持，则返回 .gz 文件。
     * 如果都不支持，则返回原始未压缩文件（deleteOriginFile: false 保留了源文件）。
     */
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    // 是 Google 推出的较新压缩算法，压缩率通常比 gzip 更高（文件体积更小），能进一步提升页面加载速度。但部分旧版浏览器（如 IE 11、旧版 Safari）不支持 brotli
    visualizer({
      gzipSize: true, // 显示各文件在经过 gzip 压缩后的大小
      brotliSize: true, // 显示各文件在经过 brotli 压缩后的
      open: false,
      filename: 'visualizer.html', // 生成的报告文件名称
    }),
  ],
  build: {
    chunkSizeWarningLimit: 2000,
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
