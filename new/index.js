import "@babel/polyfill";

const { ApolloServer, gql, ApolloError } = require("apollo-server");

const typeDefs = gql`
  type waterBottle {
    ID: String
    name: String
    description: String
    price: Int
  }
  
  type Query {
    waterBottle(bottleId: ID!): Output
    waterBottles: BottlesOutput
  }

  type Mutation {
    addWaterBottle(name: String!, description: String, price: Int!): Response
    editWaterBottle(bottleId: ID!, bottleDetails: BottleDetails!): Response
    deleteWaterBottle(bottleId: ID!): Response
  }

  type Output {
    payload: waterBottle
    message: String
    status: Int
  }
  type Response {
    payload: [waterBottle]
    message: String
    status: Int
  }

  type BottlesOutput {
    payload: [waterBottle]
    message: String
    status: Int
  }

  input BottleDetails {
    name: String
    price: Int
    description: String
  }
`;
const data = [{
  ID: "21",
  name: "bottle 1",
  description: "sjgrjg gtjh ghtoho",
  price: 65
}, {
  ID: "22",
  name: "bottle 2",
  description: "bottle 2 description",
  price: 55
}, {
  ID: "23",
  name: "bottle 3",
  description: "bottle 3 decription",
  price: 454
}];
const resolvers = {
  Query: {
    waterBottle: (parent, args, context) => {
      const { bottleId } = args;

      const payload = data.find(bottle => bottle.ID === bottleId);
      return { payload, message: "query fetched", status: 200 };
    },

    waterBottles: (parent, args, context) => {
      console.log();
      const payload = data;
      return { payload, message: "query fetched", status: 200 };
    }
  },

  Mutation: {
    addWaterBottle: (parent, args, context) => {
      const { name, description, price } = args;

      var payload = [...data, { ID: Math.random(), name, description, price }];
//query
      return { payload, message: "success", status: 200 };
    },

    editWaterBottle: (parent, args, context) => {
      const { bottleId } = args;
      const { name, description, price } = args.bottleDetails;

      data.map(bottle => {
        if (bottle.ID === bottleId) {
          bottle.name = name;
        }
      });
      console.log(data);
      const payload = data;
      return { payload, message: "success", status: 200 };
    },

    deleteWaterBottle: (parent, args, context) => {
      const { bottleId } = args;

      const payload = data.map(bottle => {
        if (bottle.ID !== bottleId) {
          return bottle;
        }
      });

      return { payload, message: "success", status: 200 };
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
