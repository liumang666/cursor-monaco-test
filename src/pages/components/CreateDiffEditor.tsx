import { useRef, useEffect } from 'react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'

const CreateEditor: React.FC<{
  originalModel: editor.ITextModel
  modifiedModel: editor.ITextModel
  onEditorLoaded?: (editor: editor.IStandaloneDiffEditor) => void
  theme?: string
}> = ({ originalModel, modifiedModel, onEditorLoaded, theme }) => {
  const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null)
  const devRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver>(null)

  useEffect(() => {
    const div = devRef.current
    if (!div) {
      throw new Error('unexpected')
    }

    const editorInstance = editor.createDiffEditor(div, {
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      automaticLayout: false,
      theme,
      originalEditable: true,
    })

    editorInstance.setModel({
      original: originalModel,
      modified: modifiedModel,
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
  }, [modifiedModel, onEditorLoaded, originalModel, theme])

  return (
    <div
      ref={devRef}
      style={{
        height: '100%',
      }}
      className="monaco-editor-react"
    ></div>
  )
}
export default CreateEditor
