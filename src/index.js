const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const fg = require('fast-glob')

async function scan() {
  const files = await fg(['test/*.js'], {
    ignore: ['*.test.js'],
    absolute: true,
  })
  return files
}

scan()

function parse(file) {
  const sourceCode = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
  const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
  })
  traverse(ast, {
    CallExpression(path, state) {
    },
  })
  const { code, map } = generate(ast)
  fs.writeFile('./cloneIndex.js', code)
}

async function run() {
  const files = await scan()
  for (let i = 0; i < files.length; i++) {
    parse(files[i])
    console.log(files[i])
  }
}
run()

