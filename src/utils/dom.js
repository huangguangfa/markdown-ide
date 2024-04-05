/**
 * 滚动条联动
 * @param {string} source - 触发滚动的源头，'preview' 或 'editor'
 * @param {HTMLElement} editor - 编辑器元素
 * @param {HTMLElement} preview - 预览器元素
 */
let mainFlag = false
export const scrollLink = (source, editorEl, previewEl) => {
  if (!editorEl || !previewEl) return
  if (mainFlag) {
    return mainFlag = false
  }
  mainFlag = true
  const scrollRatio = (editorEl.scrollHeight - editorEl.clientHeight) / (previewEl.scrollHeight - previewEl.clientHeight)
  if (source === 'preview') {
    editorEl.scrollTop = Math.round(previewEl.scrollTop * scrollRatio)
  } else if (source === 'editor') {
    previewEl.scrollTop = Math.round(editorEl.scrollTop / scrollRatio)
  }
  // 延时重置标志，防止循环触发
  setTimeout(() => mainFlag = false, 0)
}

export function copyTextToClipboard(text) {
  const textarea = createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export function createElement(tagName, attributes, textContent, eventHandlers) {
  const element = document.createElement(tagName)
  if (attributes) {
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        element.setAttribute(key, attributes[key])
      }
    }
  }
  if (textContent) {
    element.textContent = textContent
  }
  if (eventHandlers) {
    for (const eventName in eventHandlers) {
      if (eventHandlers.hasOwnProperty(eventName)) {
        element.addEventListener(eventName, eventHandlers[eventName])
      }
    }
  }
  return element
}

export function getScrollTopVal(el) {
  if (!el) return 0
  return el.scrollTop || 0
}


export function debounce(func, delay) {
  let timeoutId
  return function() {
    const context = this
    const args = arguments
    clearTimeout(timeoutId)
    timeoutId = setTimeout(function() {
      func.apply(context, args)
    }, delay)
  }
}
