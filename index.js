const { ApolloServer, gql } = require('apollo-server');
const { filter, find } = require('ramda')

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  type Node {
    id: Int
    leaves: [Node]!
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    tree(
      root: Int!,
      nodes: [NodeInput]!
    ): Node
  }

  input NodeInput {
    id: Int!
    leaves: [Int]!
  }
`;

const nodeFinder = nodes => {
  let cnt = 0;
  return ids => {
    console.log('nodeFinder cnt:', ++cnt, ids);
    return ids.map(
      id => nodes.find(
        n => n.id === id
      )
    )
  }
}

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    tree: (parent, args, context, info) => {
      const {root, nodes} = args;
      const find = nodeFinder(nodes)
      context.find = find;
      const [rootNode] = find([root])
      return rootNode;
    }
  },
  Node: {
    leaves: (parent, args, context, info) => {
      return context.find(parent.leaves)
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
