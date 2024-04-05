import { EditorState } from './esm/state/dist/index'
import { EditorView, keymap } from './esm/view/dist/index'
import { markdown, markdownLanguage } from './esm/lang-markdown/dist/index'
import { basicSetup } from './esm/codemirror/dist/index'
import { getEditorTools } from './utils'
import { markdownCompletions } from './autocomplete/index'
import { indentWithTab } from './esm/commands/dist/index'
import { editorViewdomEventHandlers } from './dom-event-handlers'
import { languages } from './esm/language-data/dist/index'
// import { javascript } from './esm/lang-javascript/dist/index'

export function installCodeMirror({
  el = document.body,
  content,
  editorEventMaps,
  onChange,
}) {
  const state = EditorState.create({
    doc: content,
    extensions: [
      basicSetup,
      markdown({
        codeLanguages: languages
      }),
      keymap.of([indentWithTab]),
      editorViewdomEventHandlers(editorEventMaps),
      EditorView.updateListener.of(viewUpdate => {
        if (viewUpdate.docChanged) {
          onChange(viewUpdate.state.doc.toString())
        }
      }),
      markdownLanguage.data.of({
        autocomplete: markdownCompletions,
      })
    ],
  })
  const editorView = new EditorView({
    state,
    parent: el,
  })
  const editorTools = getEditorTools(editorView)

  return {
    editorView,
    editorTools,
  }
}
