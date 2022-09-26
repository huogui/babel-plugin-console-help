const fs = require('fs')
const fse = require('fs-extra')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const types = require('@babel/types')
const fg = require('fast-glob')

async function scan() {
  const files = await fg(['test/*.js'], {
    ignore: ['test/*.test.js'],
    absolute: true,
  })
  return files
}

scan()

async function parse(file) {
  const sourceCode = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
  const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx'],
  })
  traverse(ast, {
    CallExpression(path, state) {
      if (types.isMemberExpression(path.node.callee)) {}
    },
  })
  const { code, map } = generate(ast)
  if (await isExist('dist/test.js'))
    return
  console.log(code)
  fse.outputFile('dist/test.js', code)
}

async function isExist(filePath) {
  return await fse.emptyDir(filePath)
}

async function run() {
  const files = await scan()
  for (let i = 0; i < files.length; i++)
    parse(files[i])
}
run()

