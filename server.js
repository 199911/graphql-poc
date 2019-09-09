const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (params) => {
    console.log('context');
    console.log(Object.keys(params));
  },
  formatResponse: (params) => {
    // We can use this as a post-GraphQL middleware
    // But the limitation is we cannot access express context object, like (req, res, context)
    console.log('formatResponse');
    console.log(Object.keys(params));
    console.log(params);
  },
  // Playground does not support GET method
  // https://github.com/prisma/graphql-playground/issues/1024
  playground: false,
});

module.exports = server;