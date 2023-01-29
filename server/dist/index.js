import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import typeDefs from './graphql/typeDefs/index.js';
import resolvers from './graphql/resolvers/index.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as dotenv from 'dotenv';
dotenv.config();
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
};
// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);
// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
await server.start();
// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use('/', cors(corsOptions), bodyParser.json(), 
// expressMiddleware accepts the same arguments:
// an Apollo Server instance and optional configuration options
expressMiddleware(server, {
    context: async ({ req, res }) => {
        // const session = await getSession({req})
        // const session = await unstable_getServerSession(req,res,{})
        // console.log(session);
        return {};
    },
}));
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`);
