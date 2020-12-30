export type MoveNotation = string
export type Line = Array<MoveNotation>

/**
 * Example
 * 
 * {
 *    line: [ 'e4', 'e5' ],
 *    meta: { notes: 'Common response to 1. e4' }
 * }
 */
export interface Move {
  line: Line
  meta: any
}

export interface RepertoireTree {
  node: Move
  children: Map<string, RepertoireTree>
}

export class OpeningRepertoire {
  tree: RepertoireTree

  constructor () {
    this.tree = {
      node: {
        line: [],
        meta: {}
      },
      children: new Map()
    }
  }

  add (move: Move) {
    const line = move.line

    let tree: RepertoireTree = this.tree

    // Tree structure construction
    for (let i = 0; i < line.length; ++i) {
      const currentMoveLabel = line[i]
      if (tree.children.has(currentMoveLabel)) {
        tree = tree.children.get(currentMoveLabel)
      } else {
        const subtree: RepertoireTree = {
          node: {
            line: line.slice(0, i + 1),
            meta: {}
          },
          children: new Map()
        }
        tree.children.set(currentMoveLabel, subtree)
        tree = subtree
      }
    }

    // Move appending
    tree.node.meta = move.meta
  }

  at (line: Line): RepertoireTree {
    let tree = this.tree
    for (const moveNotation of line) {
      // Line not found in the repertoire
      if (tree.children.has(moveNotation) === false) return undefined
      tree = tree.children.get(moveNotation)
    }
    return tree
  }

  static toJSON (repertoire: OpeningRepertoire): string {
    function transform (tree: RepertoireTree) {
      const children = {}
      for (const [ key, child ] of tree.children.entries()) {
        children[key] = transform(child)
      }
      return {
        node: tree.node,
        children
      }
    }
    return JSON.stringify(transform(repertoire.tree))
  }
  
  toJSON (): string {
    return OpeningRepertoire.toJSON(this)
  }

  static fromJSON (json: string): OpeningRepertoire {
    const tree = JSON.parse(json)
    function transform (tree: any): RepertoireTree {
      const children = new Map()
      for (const [ key, child ] of Object.entries(tree.children)) {
        children.set(key, transform(child))
      }
      return {
        node: tree.node,
        children
      }
    }
    const repertoire = new OpeningRepertoire()
    repertoire.tree = transform(tree)
    return repertoire
  }
}
