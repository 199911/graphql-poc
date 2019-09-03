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

module.exports = resolvers;