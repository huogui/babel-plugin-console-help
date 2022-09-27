const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const types = require('@babel/types')
const fg = require('fast-glob')
const fse = require('fs-extra')

function consoleHelp(sourceCode) {
  const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx'],
  })

  const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`)

  traverse(ast, {
    CallExpression(path, state) {
      const calleeName = path.get('callee').toString()

      if (targetCalleeName.includes(calleeName)) {
        const { line, column } = path.node.loc.start
        path.node.arguments.unshift(types.stringLiteral(`filename: (${line}, ${column})`))
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

