const path = require('path')
const { transformFileSync } = require('@babel/core')
const insertParametersPlugin = require('./plugin/index')

const { code } = transformFileSync(path.join(__dirname, '../test/index.js'), {
  plugins: [insertParametersPlugin],
  parserOpts: {
    sourceType: 'unambiguous',
    plugins: ['jsx'],
  },
})

console.log(code)
