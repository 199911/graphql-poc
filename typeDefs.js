const { gql } = require('apollo-server-express');

const typeDefs = gql`

  # If no @cacheControl defined, maxAge is 0 by default
  type Book @cacheControl(maxAge: 20, scope: private) {
    title: String
    author: Author
  }

  type Author @cacheControl(maxAge: 10, scope: private) {
    name: String
    books: [Book]
  }

  type Query {
    books: [Book]
    authors: [Author]
  }
`;

module.exports = typeDefs;