const { ApolloServer, gql } = require('apollo-server-express');
const { filter, find } = require('ramda')

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    id: '1',
    title: 'Harry Potter and the Chamber of Secrets',
    author: '1',
  },
  {
    id: '2',
    title: 'Jurassic Park',
    author: '2',
  },
];

const authors = [
  {
    id: '1',
    name: 'J.K. Rowling',
    books: ['1'],
  },
  {
    id: '2',
    name: 'Michael Crichton',
    books: ['2'],
  },
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: Author
  }

  type Author {
    name: String
    books: [Book]
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
    authors: [Author]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors,
  },
  Author: {
    books(author) {
      return filter(book => book.author === author.id, books);
    },
  },
  Book: {
    author(book) {
      console.log('resolving');
      return find( author => book.author === author.id, authors);
    },
  }
};

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