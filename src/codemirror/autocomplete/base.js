import { vueTemplate, vueKeywords, jsBaseKeywords } from './javascript'

export const baseSyntaxCheckOptions = [
  {label: 'vue-template', type: 'text', apply: vueTemplate, detail: 'vue模版'},
  {label: 'script', type: 'keyword'},
  {label: 'function', type: 'keyword'},
  {label: 'export', type: 'keyword'},
  {label: 'default', type: 'keyword'},
  ...vueKeywords.map(key => ({
    label: key, type: 'keyword'
  })),
  ...jsBaseKeywords.map(key => ({
    label: key, type: 'keyword'
  }))
]

