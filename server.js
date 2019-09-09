const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Playground does not support GET method
  // https://github.com/prisma/graphql-playground/issues/1024
  playground: false,
  // cacheControl options is not required to use cache control directive
});

module.exports = server;