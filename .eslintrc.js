// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: false,
    node: true,
    es6: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    'arrow-parens': 0,////箭头函数用小括号括起来
    'generator-star-spacing': 0,////生成器函数*的前后空格
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,//禁止使用debugge
    'eol-last': 0,//文件以单一的换行符结束
    'space-before-function-paren': 0,//函数定义时括号前面要不要有空格
    'no-delete-var': 2,//不能对var声明的变量使用delete操作符
    'no-inline-comments': 0,//禁止行内备注
    'no-multi-spaces': 1,//不能用多余的空格
    'no-trailing-spaces': 1,//一行结束后面不要有空格
    'no-undef': 1,//不能有未定义的变量
    'no-unused-expressions': 2,//禁止无用的表达式
    'no-var': 0,//禁用var，用let和const代替
    'indent': [2, 2],//缩进风格
    'semi': [2, 'always'],//语句强制分号结尾
  },
  globals: {
    App: true,
    Page: true,
    wx: true,
    getApp: true,
    getPage: true,
    requirePlugin: true
  }
}
