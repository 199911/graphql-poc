const { gql } = require('apollo-server-express');

const typeDefs = gql`

  # If no @cacheControl defined, maxAge is 0 by default
  type Book @cacheControl(maxAge: 20, scope: private) {
    title: String
    author: Author
  }

  type Author @cacheControl(maxAge: 10, scope: private) {
    # Field's maxAge must be smaller than the Object's
    # Otherwise, field's maxAge will be override
    # and it is meaningless to define it
    name: String @cacheControl(maxAge: 5, scope: private)
    books: [Book]
  }

  type Query {
    books: [Book]
    authors: [Author]
  }
`;

module.exports = typeDefs;