import { createElement } from '../utils'

const containerClassName = 'md-ide-markdownide-footer'
const footerLeft = 'md-ide-markdownide-footer_left'
const footerRightClaaName = 'md-ide-markdownide-footer_right'
const checkboxClassName = 'md-ide-markdownide-footer_checkbox'

export const scrollSync = 'sync'

function createCheckboxWithChangeEvent(opt = {}) {
  const { scrollType, checkboxChange, backToTopClick } = opt
  const div = createElement('div', { class: footerRightClaaName })
  const checkbox = createElement('input', { type: 'checkbox' })
  if (scrollSync === scrollType) {
    checkbox.checked = true
  }
  const label = createElement('label', { class: checkboxClassName }, null, {
    change: checkboxChange
  })
  const span = createElement('span', { style: 'padding-left:4px;font-size:12px;' }, '同步滚动')
  const backToTop = createElement('div', { style: 'margin-left: 16px;cursor: pointer;' }, '回到顶部', {
    click: backToTopClick
  })

  label.appendChild(checkbox)
  label.appendChild(span)
  div.appendChild(label)
  div.appendChild(backToTop)
  return div
}

export default class Footer {
  constructor(options = {}) {
    this.options = null
    this._data = {
      scrollType: scrollSync
    }
    this.init(options)
  }

  init(options) {
    this.options = this.initOptions(options)
    const { el, scrollType } = this.options
    this._data.scrollType = scrollType
    if (el) this.mount(el)
  }

  mount(el) {
    if (!el) return
    const { content, scrollType } = this.options
    const previewContainer = this.createContainer({
      scrollType,
      checkboxChange: (e) => this.checkboxChange(e),
      backToTopClick: (e) => this.backToTopClick(e)

    })
    el.appendChild(previewContainer)
    this._el = previewContainer
    content && this.updateFooterText(content)
  }

  createContainer(opt) {
    const container = createElement('div', {
      class: containerClassName,
    }, null)
    const leftContainer = createElement('div', {
      class: footerLeft
    }, null)
    const checkbox = createCheckboxWithChangeEvent(opt)
    container.appendChild(leftContainer)
    container.appendChild(checkbox)
    return container
  }

  initOptions(options) {
    const { scrollType } = options
    return {
      ...options,
      scrollType: scrollType || scrollSync,
    }
  }

  updateFooterText(content) {
    const contentLength = content.length
    const lineNum = content.split('\n').length
    const innerHtml = `字数：${contentLength}&nbsp;&nbsp;&nbsp;&nbsp;行数：${lineNum}`
    const [ footerLeftEl ] = this._el.getElementsByClassName(footerLeft)
    footerLeftEl.innerHTML = innerHtml
  }

  checkboxChange(event) {
    this._data.scrollType = event.target.checked ? scrollSync : ''
  }

  backToTopClick() {
    const { scrollTo } = this.options
    scrollTo && scrollTo(0)
  }
}
