import { EditorState, StateEffect, Compartment } from './esm/state/dist/index'
import { keymap, placeholder } from './esm/view/dist/index'
import { indentWithTab } from './esm/commands/dist/index'
import { indentUnit } from './esm/language/dist/index'

const createEditorCompartment = (view) => {
  const compartment = new Compartment()
  const run = (extension) => {
    compartment.get(view.state)
      ? view.dispatch({ effects: compartment.reconfigure(extension) }) // reconfigure
      : view.dispatch({ effects: StateEffect.appendConfig.of(compartment.of(extension)) }) // inject
  }
  return { compartment, run }
}

const createEditorExtensionToggler = (view, extension) => {
  const { compartment, run } = createEditorCompartment(view)
  return (targetApply) => {
    const exExtension = compartment.get(view.state)
    const apply = targetApply || exExtension !== extension
    run(apply ? extension : [])
  }
}

export function getEditorTools(view) {
  const toggleIndentWithTab = createEditorExtensionToggler(view, keymap.of([indentWithTab]))

  const { run: reTabSize } = createEditorCompartment(view)
  const setTabSize = (tabSize) => {
    reTabSize([EditorState.tabSize.of(tabSize), indentUnit.of(' '.repeat(tabSize))])
  }

  const getContent = () => view.state.doc.toString()

  const setContent = (content) => {
    if (content !== getContent()) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: content
        }
      })
    }
  }

  const { run: rePlaceholder } = createEditorCompartment(view)
  const setPlaceholder = (value) => {
    rePlaceholder(placeholder(value))
  }


  const setScrollTop = (top) => {
    console.log(view)
  }

  const insertLineContent = (content, to = null, from = null) => {
    const { ranges } = view.state.selection
    const [range] = ranges || []
    if (!content || !range) return
    const { from: selectionFrom, to: selectionTo } = range
    const fromPos = from !== null ? from : selectionFrom
    const toPos = to !== null ? to : selectionTo
    view.dispatch({
      changes: {
        from: fromPos,
        to: toPos,
        insert: content
      }
    })
  }

  return {
    toggleIndentWithTab,
    setTabSize,
    setContent,
    getContent,
    setScrollTop,
    insertLineContent,
    setPlaceholder
  }
}
