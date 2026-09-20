import { Fragment, type ReactNode } from 'react'

/**
 * Fill a `{placeholder}` template with React nodes.
 *
 * Needed because word order differs between the three languages: English puts
 * "since" before the date, while Hindi and Malayalam put their postposition
 * after it. Concatenating fragments in a fixed order produces broken grammar,
 * so each language owns the whole sentence.
 */
export function fill(template: string, values: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{[a-zA-Z]+\})/g).map((part, i) => {
    const m = part.match(/^\{([a-zA-Z]+)\}$/)
    return <Fragment key={i}>{m ? (values[m[1]] ?? part) : part}</Fragment>
  })
}
