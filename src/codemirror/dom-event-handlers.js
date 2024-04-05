import { EditorView } from './esm/view/dist/index'

function dispatchEditorEvent({ eventKey, editorEventMaps }, ...arg) {
  const events = editorEventMaps[eventKey] || []
  events.forEach(fn => fn(...arg))
}

function createEventHandler(editorEventMaps) {
  return Object.keys(editorEventMaps).reduce((handlers, eventKey) => {
    handlers[eventKey] = (...arg) => dispatchEditorEvent({
      eventKey,
      editorEventMaps
    }, ...arg)
    return handlers
  }, {})
}

export function editorViewdomEventHandlers(editorEventMaps = {}) {
  const events = createEventHandler(editorEventMaps)
  return EditorView.domEventHandlers(events)
}
