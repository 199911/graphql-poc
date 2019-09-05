const { ApolloServer, gql } = require('apollo-server');
const DataLoader = require('dataloader')

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
    const result = ids.map(
      id =>
      nodes.find(
        n => n.id === id
      )
    )
    return Promise.resolve(result);
  }
}

const withDataloader = true;

const resolvers = {
  Query: {
    tree: async (parent, args, context, info) => {
      const { root } = args;
      if (withDataloader) {
        return context.nodeLoader.load(root)
      } else {
        const [rootNode] = await context.find([root])
        return rootNode;
      }
    }
  },
  Node: {
    leaves: (parent, args, context, info) => {
      if (withDataloader) {
        return context.nodeLoader.loadMany(parent.leaves)
      } else {
        return context.find(parent.leaves)
      }
    }
  }
};

const context = ({ req }) => {
  const variables = req.body.variables;
  const nodes = variables.nodes;
  const find = nodeFinder(nodes)
  const nodeLoader = new DataLoader(find);
  return {
    nodes: req.body.variables.nodes,
    find,
    nodeLoader,
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers, context });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
