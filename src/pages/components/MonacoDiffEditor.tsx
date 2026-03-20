import { useRef, useEffect } from 'react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import CreateDiffEditor from './CreateDiffEditor'

export interface MonacoDiffEditorProps {
  language?: string
  originalValue: string
  modifiedValue: string
}

const MonacoDiffEditor: React.FC<MonacoDiffEditorProps> = ({
  language = 'plaintext',
  originalValue = '',
  modifiedValue = '',
}) => {
  const initialDataRef = useRef({
    language,
    originalValue,
    modifiedValue,
  })
  const originalModelRef = useRef<editor.ITextModel | null>(null)
  const modifiedModelRef = useRef<editor.ITextModel | null>(null)

  useEffect(() => {
    if (!originalModelRef.current) {
      originalModelRef.current = editor.createModel(
        initialDataRef.current.originalValue,
        initialDataRef.current.language
      )
    }
    if (!modifiedModelRef.current) {
      modifiedModelRef.current = editor.createModel(
        initialDataRef.current.modifiedValue,
        initialDataRef.current.language
      )
    }

    return () => {
      originalModelRef.current?.dispose()
      modifiedModelRef.current?.dispose()
      originalModelRef.current = null
      modifiedModelRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!originalModelRef.current || !modifiedModelRef.current) return

    if (originalModelRef.current.getValue() !== originalValue) {
      originalModelRef.current.setValue(originalValue)
    }
    if (modifiedModelRef.current.getValue() !== modifiedValue) {
      modifiedModelRef.current.setValue(modifiedValue)
    }

    const originalLanguage = originalModelRef.current.getLanguageId()
    if (originalLanguage !== language) {
      editor.setModelLanguage(originalModelRef.current, language)
    }

    const modifiedLanguage = modifiedModelRef.current.getLanguageId()
    if (modifiedLanguage !== language) {
      editor.setModelLanguage(modifiedModelRef.current, language)
    }
  }, [language, originalValue, modifiedValue])

  if (!originalModelRef.current || !modifiedModelRef.current) {
    return null
  }

  return (
    <CreateDiffEditor
      originalModel={originalModelRef.current}
      modifiedModel={modifiedModelRef.current}
    ></CreateDiffEditor>
  )
}

export default MonacoDiffEditor
