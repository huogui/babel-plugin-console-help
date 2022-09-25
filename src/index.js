const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const fg = require('fast-glob')
const sourceCode = 'console.log(1);'

const entries = fg(['src/*.js'], { dot: true })

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
})

traverse(ast, {
  CallExpression(path, state) {
  },
})

const { code, map } = generate(ast)
