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
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello World!'));
const apolloMiddleware = server.getMiddleware();
app.use(
  (req,res,next) => {
    console.log('before');
    next();
  },
  apolloMiddleware,
  (req,res,next) => {
    console.log('This middleware will never be executed, as apollo middleware have end the request');
    next();
  },
);
app.listen(
  port,
  () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  }
);