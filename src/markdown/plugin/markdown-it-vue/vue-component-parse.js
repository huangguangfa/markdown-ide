import Vue from 'vue'
import { parseComponent, compileToFunctions } from 'vue-template-compiler'
import VueCodePreview from './vue-code-preview.vue'
import { hljs } from '../../libs/highlight.min'

function getRootVue() {
  try {
    const [erpHeaderEl] = document.getElementsByClassName('md-ide-header-panel') || []
    if (erpHeaderEl) {
      const Vue = erpHeaderEl.__vue__
      return Vue
    }
  } catch (e) {
    return ''
  }
}

export function createdMdScopeComponents(code) {
  const opt = parseComponentOptions(code)
  const mdCtor = Vue.extend(opt)
  const rootVue = getRootVue()
  const VueContainerCtor = Vue.extend({
    render(h) {
      return h('div',
        {
          class: 'md-ide-markdownide_vueCodePreview'
        }, [
          h('div', {
            class: 'md-ide-markdownide_vue-tips'
           }, 'vue解析预览'),
          h(mdCtor, {
          class: 'md-ide-markdownide_vue'
        }),
        h(VueCodePreview,
          {
            props: {
              hlCode: '<pre><code class="hljs">' +
                hljs.highlight(code, { language: 'html', ignoreIllegals: true }).value +
                '</code></pre>',
              code
            }
          }
        )
      ])
    },
    errorCaptured(err, vm, info) {
      console.log(2222, err, vm, info)
    }
  })
  const vueCodeContainer = new VueContainerCtor()
  vueCodeContainer.$store = rootVue.$store
  vueCodeContainer.$parent = rootVue
  vueCodeContainer._routerRoot = rootVue._routerRoot
  return vueCodeContainer
}

function parseComponentOptions(code) {
  const { template = {}, script = {} } = parseComponent(code)
  const { render } = compileToFunctions(template && template.content)
  const _script = genScript(script && script.content)
  return {
    render,
    ..._script,
  }
}

function genScript(content) {
  try {
    if (!content) {
      return {}
    }
    const { _content } = resolveScript(content)
    // eslint-disable-next-line no-new-func
    const func = new Function('args', 'return ' + _content)
    return func()
  } catch (e) {
    return ''
  }
}

const resolveScript = (content) => {
  let c = ''
  let index = content.indexOf('export default')
  const _variable = content.slice(0, index)
  c = content.slice(index)
  index = c.indexOf('{')
  return {
    _content: c.slice(index).replace(/data\s*\(\s*\)\s*\{/, `data(){${_variable}`),
  }
}


let counter = 0
function generateUniqueId() {
  return 'md-ide-markdownide-vue_' + (++counter)
}

export function createMdToVueComponentContainer() {
  const id = generateUniqueId()
  return {
    elTemplate: `<div class="md-ide-markdownide-preview__vue" id="${id}"></div>`,
    id
  }
}




