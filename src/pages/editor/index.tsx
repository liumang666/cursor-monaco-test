import { useEffect, useState } from 'react'
import { Select, Space, Typography } from 'antd'
import MonacoEditor from '@/pages/components/MonacoEditor'
import { editorLanguages, ensureMonacoLanguage } from '@/pages/components/monacoLanguageLoader'

interface OptionItem {
  value: string
  label: string
}

const themes: OptionItem[] = [
  { label: 'Visual Studio', value: 'vs' },
  { label: 'Visual Studio Dark', value: 'vs-dark' },
  { label: 'High Contrast Dark', value: 'hc-black' },
]

// const sampleLoaderMap = import.meta.glob('../../assets/home-samples/sample.*.txt', {
//   query: '?raw',
//   import: 'default',
// })
const EditorPage = () => {
  const [language, setLanguage] = useState<string>('typescript')
  const [theme, setTheme] = useState<string>('vs')
  const [value, setValue] = useState('')
  const [languageReady, setLanguageReady] = useState(false)

  const loadSampleText = async (languageId: string): Promise<string> => {
    try {
      const response = await fetch(`/src/assets/home-samples/sample.${languageId}.txt`)
      if (!response.ok) {
        console.warn(`Failed to load sample for ${languageId}: ${response.status}`)
        return ''
      }
      const text = await response.text()
      console.log(`Loaded sample for ${languageId}:`, text.substring(0, 100) + '...')
      return text
    } catch (error) {
      console.warn('加载示例文本失败：', error)
      return ''
    }
  }

  useEffect(() => {
    let canceled = false
    const initLanguage = async () => {
      setValue('')
      setLanguageReady(false)

      await ensureMonacoLanguage(language)
      if (canceled) return

      const sampleText = await loadSampleText(language)
      if (canceled) return
      console.log(sampleText)
      setValue(sampleText)
      setLanguageReady(true)
    }

    void initLanguage()

    return () => {
      canceled = true
    }
  }, [language])

  const handleLanguageChange = async (languageId: string) => {
    setLanguage(languageId)
    // await ensureMonacoLanguage(languageId)
    // const samplePath = `../../assets/home-samples/sample.${languageId}.txt`
    // const loader = sampleLoaderMap[samplePath]
    // console.log(loader, samplePath)
    // if (!loader) {
    //   setValue('')
    //   return
    // }
    // const result = await loader()
    // setValue(typeof result === 'string' ? result : '')
  }

  return (
    <div style={{ padding: 20 }}>
      <Space
        align="center"
        size="middle"
        style={{ marginBottom: 16 }}
      >
        <Typography.Text strong>主题：</Typography.Text>
        <Select
          value={theme}
          options={themes}
          style={{ width: 200 }}
          onChange={setTheme}
        />
        <Typography.Text strong>语言：</Typography.Text>
        <Select
          value={language}
          options={editorLanguages}
          style={{ width: 200 }}
          onChange={handleLanguageChange}
          placeholder="选择语言，会自动载入示例代码"
        />
      </Space>

      <div
        style={{
          height: 500,
          border: '1px solid #eee',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {languageReady ? (
          <MonacoEditor
            language={language}
            value={value}
            theme={theme}
            onDidValueChange={setValue}
            options={{
              minimap: { enabled: false },
            }}
          />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
            }}
          >
            语言包载入中，稍候...
          </div>
        )}
      </div>
    </div>
  )
}

export default EditorPage
