import test from 'ava'
import { OpeningRepertoire } from '../dist/corf.js'

const moves = [{
  line: ['e4'],
  meta: { foo: 1 }
}, {
  line: ['e4', 'e5'],
  meta: { foo: 2 }
}, {
  line: ['e4', 'e5', 'Nf3', 'Nc6'],
  meta: { foo: 3 }
}, {
  line: ['d4', 'd5'],
  meta: { foo: 4 }
}]

test('OpeningRepertoire.constructor', t => {
  const repertoire = new OpeningRepertoire()
  t.deepEqual(repertoire.tree.node, {
    line: [],
    meta: {}
  })

  t.is(repertoire.tree.children.size, 0)
})

test('OpeningRepertoire.add', t => {
  const repertoire = new OpeningRepertoire()

  for (const move of moves) {
    repertoire.add(move)
  }

  t.deepEqual(repertoire.tree, {
    node: {
      line: [],
      meta: {}
    },
    children: new Map(Object.entries({
      e4: {
        node: {
          line: ['e4'],
          meta: {
            foo: 1
          }
        },
        children: new Map(Object.entries({
          e5: {
            node: {
              line: ['e4', 'e5'],
              meta: {
                foo: 2
              }
            },
            children: new Map(Object.entries({
              Nf3: {
                node: {
                  line: ['e4', 'e5', 'Nf3'],
                  meta: {}
                },
                children: new Map(Object.entries({
                  Nc6: {
                    node: {
                      line: ['e4', 'e5', 'Nf3', 'Nc6'],
                      meta: {
                        foo: 3
                      }
                    },
                    children: new Map()
                  }
                }))
              }
            }))
          }
        }))
      },
      d4: {
        node: {
          line: ['d4'],
          meta: {}
        },
        children: new Map(Object.entries({
          d5: {
            node: {
              line: ['d4', 'd5'],
              meta: {
                foo: 4
              }
            },
            children: new Map()
          }
        }))
      }
    }))
  })
})

test('OpeningRepertoire.at', t => {
  const repertoire = new OpeningRepertoire()

  for (const move of moves) {
    repertoire.add(move)
  }

  for (const move of moves) {
    t.deepEqual(repertoire.at(move.line).node, move)
  }

  t.is(repertoire.at(['g4']), undefined)
})

test('OpeningRepertoire.toJSON,fromJSON', t => {
  const repertoire = new OpeningRepertoire()

  for (const move of moves) {
    repertoire.add(move)
  }

  t.deepEqual(repertoire.tree, OpeningRepertoire.fromJSON(repertoire.toJSON()).tree)
})
