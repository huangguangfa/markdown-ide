import { initMarkDownIt } from '../markdown/index.js'
import { createElement } from '../utils'

export const id = 'md-ide-markdownide-preview'

const containerClassName = 'md-ide-markdownide-preview markdown-body'

export default class Preview {
  constructor(options = {}) {
    this.md = null
    this.options = null
    this.init(options)
  }

  init(options) {
    this.options = this.initOptions(options)
    const { el } = this.options
    this.md = Object.freeze(initMarkDownIt())
    if (el) this.mount(el)
  }

  mount(el) {
    if (!el) return
    const { content } = this.options
    const previewContainer = this.createPreviewContainer()
    el.appendChild(previewContainer)
    this._el = previewContainer
    content && this.renderPreview(content)
  }

  initOptions(options) {
    return {
      ...options,
    }
  }

  createPreviewContainer() {
    return createElement('div', { class: containerClassName, id }, null, {
      scroll: this.onScroll.bind(this),
    })
  }

  renderPreview(content) {
    if (this.md && this._el) {
      const previewContent = this.md.render(content)
      this._el.innerHTML = previewContent
    }
  }

  scrollToBottom() {
    this._el.scrollTop = this._el.scrollHeight
  }

  onScroll(event) {
    const { onScroll } = this.options
    typeof onScroll === 'function' && onScroll(event)
  }
}
