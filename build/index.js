"use strict";

require("@babel/polyfill");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  type waterBottle {\n    ID: String\n    name: String\n    description: String\n    price: Int\n  }\n  type Query {\n    waterBottle(bottleId: ID!): Output\n    waterBottles: BottlesOutput\n  }\n\n  type Mutation {\n    addWaterBottle(name: String!, description: String, price: Int!): Response\n    editWaterBottle(bottleId: ID!, bottleDetails: BottleDetails!): Response\n    deleteWaterBottle(bottleId: ID!): Response\n  }\n\n  type Output {\n    payload: waterBottle\n    message: String\n    status: Int\n  }\n  type Response {\n    payload: [waterBottle]\n    message: String\n    status: Int\n  }\n\n  type BottlesOutput {\n    payload: [waterBottle]\n    message: String\n    status: Int\n  }\n\n  input BottleDetails {\n    name: String\n    price: Int\n    description: String\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _require = require("apollo-server"),
    ApolloServer = _require.ApolloServer,
    gql = _require.gql,
    ApolloError = _require.ApolloError;

var typeDefs = gql(_templateObject());
var data = [{
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
var resolvers = {
  Query: {
    waterBottle: function waterBottle(parent, args, context) {
      var bottleId = args.bottleId;
      var payload = data.find(function (bottle) {
        return bottle.ID === bottleId;
      });
      return {
        payload: payload,
        message: "query fetched",
        status: 200
      };
    },
    waterBottles: function waterBottles(parent, args, context) {
      console.log();
      var payload = data;
      return {
        payload: payload,
        message: "query fetched",
        status: 200
      };
    }
  },
  Mutation: {
    addWaterBottle: function addWaterBottle(parent, args, context) {
      var name = args.name,
          description = args.description,
          price = args.price;
      var payload = [].concat(data, [{
        ID: Math.random(),
        name: name,
        description: description,
        price: price
      }]);
      return {
        payload: payload,
        message: "success",
        status: 200
      };
    },
    editWaterBottle: function editWaterBottle(parent, args, context) {
      var bottleId = args.bottleId;
      var _args$bottleDetails = args.bottleDetails,
          name = _args$bottleDetails.name,
          description = _args$bottleDetails.description,
          price = _args$bottleDetails.price;
      data.map(function (bottle) {
        if (bottle.ID === bottleId) {
          bottle.name = name;
        }
      });
      console.log(data);
      var payload = data;
      return {
        payload: payload,
        message: "success",
        status: 200
      };
    },
    deleteWaterBottle: function deleteWaterBottle(parent, args, context) {
      var bottleId = args.bottleId;
      var payload = data.map(function (bottle) {
        if (bottle.ID !== bottleId) {
          return bottle;
        }
      });
      return {
        payload: payload,
        message: "success",
        status: 200
      };
    }
  }
};
var server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers
});
server.listen().then(function (_ref) {
  var url = _ref.url;
  console.log("Server ready at ".concat(url));
});

var Hello = /*#__PURE__*/function () {
  function Hello() {
    _classCallCheck(this, Hello);
  }

  _createClass(Hello, null, [{
    key: "world",
    value: function world() {
      console.log("Hello, World!");
    }
  }]);

  return Hello;
}();

Hello.world();