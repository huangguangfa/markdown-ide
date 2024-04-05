// import { markdownItVue } from './plugin/markdown-it-vue/index.js'
import { MarkdownIt } from './libs/markdown-it.esm.js'
import { alert } from './plugin/markdown-it-img'
import { hljs } from './libs/highlight.min'

export function initMarkDownIt() {
  const defaultConfig = {
    html: true,
    xhtmlOut: true,
    breaks: true,
    langPrefix: 'lang-',
    linkify: false,
    typographer: true,
    quotes: '“”‘’',
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          const code = '<pre><code class="hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
          return code
        } catch (__) {}
      }
      return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
    }
  }
  const md = new MarkdownIt(defaultConfig)
  installMdPlugins(md)
  return md
}

function installMdPlugins(md) {
  // md.use(markdownItVue)
  md.use(alert)
  // md.use(window.markdownItAnchor, { permalink: true, permalinkBefore: true, permalinkSymbol: '🔗' })
  // md.use(window.markdownItTocDoneRight, {
  //   containerClass: 'toc',
  //   containerId: 'toc',
  //   listType: 'ul',
  //   listClass: 'cataloglistClass',
  //   linkClass: 'cataloglinkClass',
  //   callback: function (html, ast) {
  //     const tocContainer = document.getElementById('md-ide-markdownide-toc')
  //     if (tocContainer) {
  //       tocContainer.innerHTML = html
  //     }
  //   }
  // })
}
