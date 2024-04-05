import { installCodeMirror } from '../codemirror/index.js'
import { createElement } from '../utils'

const containerClassName = 'md-ide-markdownide-edit'

export default class Editor {
  constructor(options = {}) {
    this.editor = null
    this.editorTools = null
    this.options = null
    this.content = null
    this.init(options)
  }

  init(options = {}) {
    const { el } = options
    this.options = this.initOptions(options)
    if (el) this.mount(el)
  }

  initOptions(options) {
    return {
      ...options,
      editorEventHandlers: this.getEditorEventHandlers(options),
    }
  }

  mount(el) {
    const { editorEventHandlers, content } = this.options
    const editorContainer = this.createEditorContainer()
    const { editorView, editorTools } = installCodeMirror({
      el: editorContainer,
      onChange: this.onChange.bind(this),
      content,
      editorEventMaps: editorEventHandlers,
    })
    this.editor = editorView
    this.editorTools = editorTools
    this.content = content
    this._el = editorContainer
    if (el) el.appendChild(editorContainer)
  }

  createEditorContainer() {
    const editorContainer = createElement('div', {
      style: 'width:50%',
      class: containerClassName,
      id: containerClassName,
    })
    this._el = editorContainer
    return editorContainer
  }

  getEditorEventHandlers(options) {
    const { events = {} } = options
    const defaultEvents = {
      scroll: this.onScroll.bind(this),
    }
    return Object.keys({ ...events, ...defaultEvents }).reduce((acc, key) => {
      const eventHandlers = acc[key] || []
      eventHandlers.push(events[key], defaultEvents[key])
      acc[key] = eventHandlers.filter(Boolean)
      return acc
    }, {})
  }

  insertContentAtCursor(content) {
    if (content && this.editorTools) {
      this.editorTools.insertLineContent(content)
    }
  }

  setContent(content) {
    const { editorTools } = this
    if (editorTools) {
      editorTools.setContent(content)
    }
  }

  setPlaceholder(content) {
    this.editorTools.setPlaceholder(content)
  }

  onChange(value) {
    this.content = value
    const { onChange } = this.options
    if (typeof onChange === 'function') {
      onChange(value)
    }
  }

  onScroll(event) {
    const { onScroll } = this.options
    typeof onScroll === 'function' && onScroll(event)
  }
}
