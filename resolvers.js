const { ApolloError } = require('apollo-server-express');
// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = ['1', '2', '3'].map(id => ({
  id,
  title: `Book ${id}`,
  authors: ['7','8'],
}));

const authors = ['7','8'].map(id => ({
  id,
  name: `Author ${id}`,
  books: ['1', '2', '3'],
}));

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
    Query: {
      books: () => books,
      authors: () => authors,
    },
    Author: {
      name(author) {
        if (author.id === '7') {
          throw new ApolloError('fail to get name of author');
        }
        return author.name;
      },
      books(author) {
        throw new ApolloError('fail to find book');
        return books;
      },
    },
    Book: {
      authors(book) {
        if (book.id === '3') {
          throw new ApolloError('fail to find author');
        }
        return authors;
      },
    }
  };

module.exports = resolvers;