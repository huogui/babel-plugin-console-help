const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const types = require('@babel/types')
const fg = require('fast-glob')
const fse = require('fs-extra')
const template = require('@babel/template').default

function consoleHelp(sourceCode) {
  const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx'],
  })

  const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`)

  traverse(ast, {
    CallExpression(path, state) {
      if (path.node.isNew)
        return

      const calleeName = generate(path.node.callee).code
      if (targetCalleeName.includes(calleeName)) {
        const { line, column } = path.node.loc.start

        const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)()
        newNode.isNew = true

        if (path.findParent(path => path.isJSXElement())) {
          path.replaceWith(types.arrayExpression([newNode, path.node]))
          path.skip()
        }
        else {
          path.insertBefore(newNode)
        }
      }
    },
  })

  const { code, decodedMap, map, rawMappings } = generate(ast)
  console.log(code)
}

function scanSourceCode() {
  const files = fg.sync(['*.js'], {
    ignore: ['*.test.js'],
    cwd: 'test',
    absolute: true,
  })
  for (let i = 0; i < files.length; i++) {
    const code = fse.readFileSync(files[i], {
      encoding: 'utf-8',
    })
    consoleHelp(code)
  }
}

scanSourceCode()

