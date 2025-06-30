import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import _db from "./_db.js";

const resolvers = {
  Query: {
    games: () => _db.games,
    reviews: () => _db.reviews,
    authors: () => _db.authors,
    review: (_, args) => {
      return _db.reviews.find((review) => review.id === args.id);
    },
    game: (_, args) => {
      return _db.games.find((game) => game.id === args.id);
    },
    author: (_, args) => {
      return _db.authors.find((author) => author.id === args.id);
    },
  },
  Game: {
    reviews: (parent) => {
      const bla = _db.reviews.filter((review) => review.game === parent.id);
      console.log("first, ", bla, parent.id);
      return _db.reviews.filter((review) => review.game_id === parent.id);
    },
  },
  Author: {
    reviews: (parent) => {
      return _db.reviews.filter((review) => review.author_id === parent.id);
    },
  },
  Review: {
    game: (parent) => {
      return _db.games.find((game) => game.id === parent.game_id);
    },
    author: (parent) => {
      return _db.authors.find((author) => author.id === parent.author_id);
    },
  },
  Mutation: {
    deleteGame: (_, arg) => {
      return _db.games.filter((game) => game.id !== arg.id);
    },
    addGame: (_, arg) => {
      const newGame = {
        id: String(_db.games.length + 1),
        title: arg.game.title,
        platform: arg.game.platform,
      };
      _db.games.push(newGame);
      return newGame;
    },
    updateGame: (_, { id, edit }) => {
      // ✅ Correctly extract arguments
      const game = _db.games.find((game) => game.id === id);
      if (!game) {
        throw new Error("Game not found");
      }
      game.title = edit.title; // ✅ No more undefined error
      game.platform = edit.platform;
      return game;
    },
  },
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000,
    },
})


