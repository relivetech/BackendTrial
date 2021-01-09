import "@babel/polyfill";

const mongoose = require('mongoose');
import crypto from "crypto"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const salt = bcrypt.genSaltSync(10);
const { ApolloServer, gql, ApolloError,AuthenticationError } = require("apollo-server");

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

const accountSchema=new mongoose.Schema({
  name: String,
  email:String,
  password:String
})

const bottles = mongoose.model('bottles1', waterBotleSchema);
const accountModel=mongoose.model("account", accountSchema);
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
    accountCreate(name:String,email:String,password:String):AccountResponse
    accountLogin(email:String,password:String):AccountResponse
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
  type AccountResponse{
    name:String
    email: String
    Password:String
    token:String
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
accountCreate:async(parent, args, context)=>{
 const{name,email,password}=args
 const ID=crypto.randomBytes(16).toString("hex")
 const passwordHashed = await bcrypt.hash(password, salt);
//  console.log(passwordHashed
//  console.log(ID)
 
 const createdAccount= await new accountModel({name,email,passwordHashed,ID}).save();
 console.log(createdAccount)
  const Account=createdAccount.toJSON()
console.log({Account})
//  const user = JSON.parse(JSON.stringify(Account));
//  console.log({user})
const token= new Promise((resolve, reject) => {
  jwt.sign(Account, "shivani", { expiresIn: 604800 }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});

  return {name,email,password,token }
},

accountLogin:async(parent, args, context)=>{
console.log({context})
  const {email,password}=args;
  const isAccount= await accountModel.findOne({email}).exec()
  // console.log(isAccount);
  if(!isAccount) throw new ApolloError("Invalid Account")
 const Account= isAccount.toJSON();

//  const isPasswordRight=bcrypt.compareSync(password,Account.password)
//  console.log(isPasswordRight)
//  if(!isPasswordRight){
//    throw new ApolloError("Invalid credientails")
//  }
 new Promise((resolve, reject) => {
  jwt.sign(Account, "shivani", { expiresIn: 604800 }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
 
});
return {email,password}
     },

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

const server = new ApolloServer({ typeDefs, resolvers ,context:({req,conn})=>{
  const authorizationHeader = req.headers.authorization;
 
  if (authorizationHeader === undefined) {
    throw new AuthenticationError('Authentication Required');
  } 

  else {
    const bearerToken = authorizationHeader.split(' ');
    try {
      let account={}
      // console.log(bearerToken[1])
       account = jwt.verify(bearerToken[1], "shivani");
      // console.log({account})
       const accountId = account._id;
       const vv=req.body.variables
       console.log({vv})
      if (req.body.variables.Id !== undefined) {
        if (accountId !== req.body.variables.accountId) throw new AuthenticationError('Invalid Context From http');
      }
      // account.headers = req.headers;
      // account.protocol = req.protocol;
      return account;
    } catch (error) {
      throw new AuthenticationError(error.message);
    }
  }
  // console.log(conn)
}});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

