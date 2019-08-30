const { GraphQLScalarType } = require('graphql');

// https://ithelp.ithome.com.tw/articles/10206366
const BookId = new GraphQLScalarType({
    name: 'BookId',
    serialize(value) {
      // 輸出到前端
      console.log('serialize')
      if (value !== '1') {
        throw new TypeError('BookId must be 1')
      }
      return value;
    },
    parseValue(value) {
      // 從前端 variables 進來的 input
      console.log('parseValue')
      if (value !== '1') {
        throw new TypeError('BookId must be 1')
      }
      return value;
    },
    parseLiteral(ast) {
      // 從前端 query 字串進來的 input
      console.log('parseLiteral')
      console.log(JSON.stringify(ast, null, 2));
      if (value !== '1') {
        throw new TypeError('BookId must be 1')
      }
      return ast.value;
    }
})

module.exports = BookId