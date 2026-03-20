import { useRef, useEffect, useState } from 'react'
import { editor, type IDisposable } from 'monaco-editor/esm/vs/editor/editor.api'
import CreateEditor from './CreateEditor'

export interface MonacoEditorProps {
  language?: string
  value: string
  theme?: string
  options?: editor.IEditorOptions & editor.IGlobalEditorOptions
  onDidValueChange?: (value: string) => void
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  language = 'plaintext',
  value = '',
  theme = 'vs',
  onDidValueChange,
  options,
}) => {
  const lastSubscriptionRef = useRef<IDisposable | null>(null)

  const modelRef = useRef<editor.ITextModel | null>(null)
  const [modelReady, setModelReady] = useState(false)

  // 用于只在挂载时创建 model，避免语言/内容变化时触发 cleanup 过早 dispose
  const initialLanguageRef = useRef(language)
  const initialValueRef = useRef(value)

  useEffect(() => {
    if (!modelRef.current) {
      modelRef.current = editor.createModel(initialValueRef.current, initialLanguageRef.current)
      setModelReady(true)
    }

    return () => {
      lastSubscriptionRef.current?.dispose()
      modelRef.current?.dispose()
      modelRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!modelRef.current) return

    if (modelRef.current.getValue() !== value) {
      modelRef.current.setValue(value)
    }

    // 语言包可能是异步加载的：即便当前语言相同，重复设置可触发重计算 tokenization，修复首屏高亮不渲染问题。
    editor.setModelLanguage(modelRef.current, language)
  }, [language, value])

  useEffect(() => {
    if (!modelRef.current) return

    if (lastSubscriptionRef.current) {
      lastSubscriptionRef.current.dispose()
      lastSubscriptionRef.current = null
    }

    if (onDidValueChange) {
      lastSubscriptionRef.current = modelRef.current.onDidChangeContent(() => {
        onDidValueChange(modelRef.current!.getValue())
      })
    }

    return () => {
      lastSubscriptionRef.current?.dispose()
    }
  }, [onDidValueChange])

  if (!modelRef.current || !modelReady) {
    return null
  }

  return (
    <CreateEditor
      readOnly={!onDidValueChange}
      model={modelRef.current}
      theme={theme}
      options={options}
    ></CreateEditor>
  )
}
export default MonacoEditor
