import { useRef, useEffect } from 'react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'

const CreateEditor: React.FC<{
  model: editor.ITextModel
  onEditorLoaded?: (editor: editor.IStandaloneCodeEditor) => void
  theme?: string
  readOnly?: boolean
  className?: string
  options?: editor.IEditorOptions & editor.IGlobalEditorOptions
}> = ({ model, onEditorLoaded, theme, readOnly, className, options }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const devRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver>(null)

  useEffect(() => {
    const div = devRef.current
    if (!div) {
      throw new Error('unexpected')
    }

    const editorInstance = editor.create(div, {
      model: model,
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      automaticLayout: false,
      theme,
      readOnly: readOnly || false,
    })

    editorRef.current = editorInstance

    // 设置resize监听
    resizeObserverRef.current = new ResizeObserver(() => {
      editorInstance.layout()
    })
    resizeObserverRef.current.observe(div)

    // 回调
    if (onEditorLoaded) onEditorLoaded(editorInstance)

    return () => {
      resizeObserverRef.current?.disconnect()
      editorInstance.dispose()
    }
  }, [model, onEditorLoaded, readOnly, theme])

  useEffect(() => {
    if (!editorRef.current) return

    // 更新模型
    if (model !== editorRef.current.getModel()) {
      editorRef.current.setModel(model)
    }

    // 更新只读状态
    if (readOnly !== undefined && readOnly !== editorRef.current.getOption(editor.EditorOption.readOnly)) {
      editorRef.current.updateOptions({ readOnly })
    }
  }, [model, readOnly])

  useEffect(() => {
    if (!editorRef.current) return

    // 更新配置
    if (options) editorRef.current.updateOptions(options)
  }, [options])

  useEffect(() => {
    // 更新主题
    if (theme) {
      editor.setTheme(theme)
    }
  }, [theme])

  return (
    <div
      ref={devRef}
      style={{
        height: '100%',
      }}
      className={'monaco-editor-react ' + className}
    ></div>
  )
}
export default CreateEditor
