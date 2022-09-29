const path = require('path')
const { transformFileSync } = require('@babel/core')
const insertParametersPlugin = require('../core/index')

const { code } = transformFileSync(path.join(__dirname, 'sourceCode.js'), {
  plugins: [insertParametersPlugin],
  parserOpts: {
    sourceType: 'unambiguous',
    plugins: ['jsx'],
  },
})

