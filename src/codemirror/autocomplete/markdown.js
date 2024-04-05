import { baseSyntaxCheckOptions } from './base'
export function markdownCompletions(context) {
  const word = context.matchBefore(/\w*/)
  if (word.from === word.to && !context.explicit) { return null }
  return {
    from: word.from,
    options: [
      ...baseSyntaxCheckOptions
    ]
  }
}
