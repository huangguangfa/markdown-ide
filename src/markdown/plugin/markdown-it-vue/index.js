import { createMdToVueComponentContainer, createdMdScopeComponents } from './vue-component-parse'

function mounteComponent(vm, elId) {
  const el = document.getElementById(elId)
  if (vm && el) {
    vm.$mount(el)
  }
}

export function markdownItVue(md) {
  const wrap = (wrapped) => (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    // eslint-disable-next-line no-useless-escape
    const tokenInfo = token.info.trim().replace(/\"/g, '\'')
    if (tokenInfo === 'vue') {
      const code = token.content
      const { elTemplate, id: ElId } = createMdToVueComponentContainer()
      setTimeout(() => {
        const vm = createdMdScopeComponents(code)
        vm && mounteComponent(vm, ElId)
      }, 100)
      return elTemplate
    } else {
      const rawCode = wrapped(...args)
      return `<div class="language-${tokenInfo} markdown-ide__codeBlock">${rawCode}</div>`
    }
  }
  const { fence, code_block: codeBlock } = md.renderer.rules
  md.renderer.rules.fence = wrap(fence)
  md.renderer.rules.code_block = wrap(codeBlock)
}



