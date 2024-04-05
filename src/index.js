import Editer from './view/edit.js'
import Preview from './view/preview.js'
import Footer, { scrollSync as footerScrollSync } from './view/footer.js'
import { createElement } from './utils/index.js'
import { scrollLink, debounce } from './utils/dom.js'
import { defaultOptions } from './config.js'

function markdownIdeClassMaps() {
  return {
    ideContainer: `md-ide-markdownide`
  }
}
let updateRenderTimer

class MarkdownIde {
  constructor(options) {
    this._data = {
      isStarMoveEditor: false,
      starMovePos: {},
      isFocus: false,
      _updatePreviewRender: false
    }
    this._updateRenderPreview = debounce(this.updateRenderPreview, 500)
    this.init(options)
  }

  init(options) {
    this.options = this.getOptions(options)
    this.editer = this.initEditer()
    this.footer = this.initFooter()
    this.preview = this.initPreview()
    this.mount()
  }

  initPreview() {
    const { content } = this.options
    return new Preview({
      el: null,
      content: content,
      onScroll: this.onPreviewScroll.bind(this)
    })
  }

  initEditer() {
    const { editer, content } = this.options
    return new Editer({
      el: null,
      content,
      onChange: this.onChange.bind(this),
      onScroll: this.onEditScroll.bind(this),
      events: {
        ...(editer && editer.events || {}),
        focus: this.onFocus.bind(this),
        blur: this.onBlur.bind(this),
      }
    })
  }

  initFooter() {
    const { content, scrollType } = this.options
    return new Footer({
      content,
      scrollType,
      scrollTo: this.scrollTo.bind(this)
    })
  }

  mount(container) {
    let { el, classMaps, type, placeholder, content } = this.options
    const IdeContainer = createElement('div', {class: classMaps.ideContainer}, null, {
      mousemove: this.mouseMoveEditorHandler.bind(this),
      mouseup: this.mouseupEditorHandler.bind(this)
    })
    this._el = IdeContainer
    if (container) el = container
    if (el) {
      this.editer.mount(IdeContainer)
      this.mountSeekBar(IdeContainer)
      this.preview.mount(IdeContainer)
      this.footer.mount(IdeContainer)
      el.appendChild(IdeContainer)
    }
    this.setType(type || 0)
    this.setPlaceholder(placeholder || '')
    this.onChange(content, true)
  }

  getOptions(options) {
    return {
      editer: {},
      ...defaultOptions,
      ...options,
      classMaps: markdownIdeClassMaps(),
    }
  }

  // methods
  mouseMoveEditorHandler(event) {
    const { isStarMoveEditor, starMovePos } = this._data
    const { editer } = this
    if (!isStarMoveEditor) return
    const px = event.screenX - starMovePos.screenX
    const editorEl = editer._el
    editorEl.style.width = (editorEl.offsetWidth + px) + 'px'
    this._data.starMovePos = event
  }

  mouseupEditorHandler() {
    this._data.isStarMoveEditor = false
  }

  mouseDownEditorHandler(event) {
    this._data.isStarMoveEditor = true
    this._data.starMovePos = event
  }

  mountSeekBar(el) {
    const seekBarEl = createElement('div', {class: 'md-ide-markdownide__seekBar'}, '||', {
      mousedown: this.mouseDownEditorHandler.bind(this)
    })
    this._seekBarEl = seekBarEl
    el.appendChild(seekBarEl)
  }

  setType(type) {
    const { editer, preview, footer, _seekBarEl } = this

    const styles = {
      editer: {
        el: editer._el,
        style: {
          display: type === 2 ? 'none' : 'block',
          width: type === 1 ? '100%' : '50%'
        }
      },
      preview: {
        el: preview._el,
        style: {
          display: type === 1 ? 'none' : 'block',
          borderLeft: type === 2 ? 'none' : '1px solid #eee'
        }
      },
      footer: {
        el: footer._el,
        style: {
          display: type === 2 ? 'none' : 'flex'
        }
      },
      seekBar: {
        el: _seekBarEl,
        style: {
          display: type !== 0 ? 'none' : 'flex'
        }
      }
    }

    Object.entries(styles).forEach(([keyName, values]) => {
      const elementEl = values.el
      Object.entries(values.style).forEach(([property, value]) => {
        if (property !== 'el') {
          elementEl.style[property] = value
        }
      })
    })

    this.options.type = type
  }

  insertContentAtCursor(content) {
    this.editer.insertContentAtCursor(content)
  }

  setContent(content) {
    this.editer.setContent(content)
  }

  setPlaceholder(content) {
    this.editer.setPlaceholder(content)
  }

  onChange(val, init = false) {
    const { onChange } = this.options
    if (!init) {
      typeof onChange === 'function' && onChange(val)
    }
    this._updateRenderPreview(val)
    this.footer.updateFooterText(val)
  }

  onFocus(...arg) {
    this._data.isFocus = true
    const { editer } = this.options
    typeof editer.focus === 'function' && editer.focus(...arg)
  }

  onBlur(...arg) {
    const { editer } = this.options
    typeof editer.blur === 'function' && editer.blur(...arg)
    this._data.isFocus = false
  }

  updateRenderPreview(val) {
    const { isFocus } = this._data
    this._data._updatePreviewRender = true
    this.preview.renderPreview(val)
    clearTimeout(updateRenderTimer)
    if (isFocus) {
      this.preview.scrollToBottom()
    }
    updateRenderTimer = setTimeout(() => {
      this._data._updatePreviewRender = false
    }, 800)
  }

  onPreviewScroll(event) {
    const { scrollType } = this.footer._data
    const { _updatePreviewRender } = this._data
    const { target } = event
    if (scrollType !== footerScrollSync || _updatePreviewRender) return
    const { _el } = this.editer
    const [cmScroller] = _el.getElementsByClassName('cm-scroller') || []
    cmScroller && scrollLink('preview', cmScroller, target)
  }

  onEditScroll(event) {
    const { scrollType } = this.footer._data
    if (scrollType !== footerScrollSync) return
    const { target } = event
    const { _el } = this.preview
    _el && scrollLink('editor', target, _el)
  }

  scrollTo(val = 0) {
    const { _el } = this.editer
    const [editerEl] = _el.getElementsByClassName('cm-scroller') || []
    const { _el: previewEl } = this.preview
    previewEl && (previewEl.scrollTop = val)
    editerEl && (editerEl.scrollTop = val)
  }
}

export {
  Editer,
  Preview,
  MarkdownIde
}
