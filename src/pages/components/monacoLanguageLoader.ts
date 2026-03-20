const loadedLanguageSet = new Set<string>()

type LanguageLoader = () => Promise<unknown>

const languageLoaderMap: Record<string, LanguageLoader> = {
  css: () => import('monaco-editor/esm/vs/basic-languages/css/css.contribution'),
  html: () => import('monaco-editor/esm/vs/basic-languages/html/html.contribution'),
  java: () => import('monaco-editor/esm/vs/basic-languages/java/java.contribution'),
  javascript: () => import('monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'),
  json: () => import('monaco-editor/esm/vs/language/json/monaco.contribution'),
  markdown: () => import('monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution'),
  python: () => import('monaco-editor/esm/vs/basic-languages/python/python.contribution'),
  sql: () => import('monaco-editor/esm/vs/basic-languages/sql/sql.contribution'),
  typescript: () => import('monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution'),
  xml: () => import('monaco-editor/esm/vs/basic-languages/xml/xml.contribution'),
  yaml: () => import('monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution'),
}

export const editorLanguages = Object.keys(languageLoaderMap).map((languageId) => ({
  label: languageId,
  value: languageId,
}))

export async function ensureMonacoLanguage(languageId: string): Promise<void> {
  if (loadedLanguageSet.has(languageId)) return

  const loader = languageLoaderMap[languageId]
  if (!loader) return

  await loader()
  loadedLanguageSet.add(languageId)
}
