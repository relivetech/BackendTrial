import "@babel/polyfill";

const mongoose = require('mongoose');

const { ApolloServer, gql, ApolloError } = require("apollo-server");

mongoose.connect('mongodb+srv://shivi:mongodb@cluster0.lz0pn.mongodb.net/Wb', {useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("we r connected to mongodb")
});




const waterBotleSchema = new mongoose.Schema({
  name: String,
  price:Number,
  description:String
});

const bottles = mongoose.model('bottles1', waterBotleSchema);
// const Model=new bottles({name:"bfjvfj",price:2,description:"jijjjb"})
// new Model.save()

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
const data = [
  {
    ID: "21",
    name: "bottle 1",
    description: "sjgrjg gtjh ghtoho",
    price: 65,
  },
  {
    ID: "22",
    name: "bottle 2",
    description: "bottle 2 description",
    price: 55,
  },
  {
    ID: "23",
    name: "bottle 3",
    description: "bottle 3 decription",
    price: 454,
  },
];
const resolvers = {
  Query: {
    waterBottle: (parent, args, context) => {
      const { bottleId } = args;

      const payload = data.find((bottle) => bottle.ID === bottleId);
      return { payload, message: "query fetched", status: 200 };
    },

    waterBottles: (parent, args, context) => {
      console.log();
      const payload = data;
      return { payload, message: "query fetched", status: 200 };
    },
  },

  Mutation: {
    addWaterBottle: (parent, args, context) => {
      const { name, description, price } = args;

      var payload = [...data, { ID: Math.random(), name, description, price }];
           const s=new bottles( { name, description, price } ).save()
            
      return { payload, message: "success", status: 200 };
    },

    editWaterBottle: (parent, args, context) => {
      const { bottleId } = args;
      const { name, description, price } = args.bottleDetails;

      data.map((bottle) => {
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

      const payload = data.map((bottle) => {
        if (bottle.ID !== bottleId) {
          return bottle;
        }
      });

      return { payload, message: "success", status: 200 };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

