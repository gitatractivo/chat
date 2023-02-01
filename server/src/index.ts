import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4'
import express from 'express';
import http from 'http';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as dotenv from 'dotenv';
import { getSession } from 'next-auth/react';
import { GraphQLContext, Session, SubscriptionContext } from './util/types';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import cors from 'cors'
import { json } from 'body-parser';

async function main() {
    dotenv.config();
    const app = express();
    const httpServer = http.createServer(app);
    const prisma = new PrismaClient()
    const pubsub = new PubSub()


    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql/subscriptions',
    });

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    })

    const serverCleanup = useServer({
        schema, context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
            if (ctx.connectionParams && ctx.connectionParams.session) {
                const { session } = ctx.connectionParams
                return { session, prisma, pubsub }
            }
            return { session: null, prisma, pubsub }
        }
    }, wsServer);

    



    // Same ApolloServer initialization as before, plus the drain plugin
    // for our httpServer.
    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        // context: async ({ req, res }): Promise<GraphQLContext> => {
        //     const session = await getSession({ req }) as Session
        //     res.header("Access-Control-Allow-Origin", process.env.CLIENT_ORIGIN)
        //     // console.log(session);
        //     return { session,prisma,pubsub }
        // },
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),

            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        }, pubsub
                    };
                },
            },
            // ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ],
    });

    // More required logic for integrating with Express
    await server.start();
    const corsOptions = {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    }
    
    const PORT = 4000;

    app.use(
        "/graphql",
        cors<cors.CorsRequest>(corsOptions),
        json(),
        expressMiddleware(server,{
            context: async({req}): Promise<GraphQLContext>=>{
                const session = await getSession({req})
                return {session: session as Session,prisma,pubsub}


            }
        })
    )

    // Modified server startup
    await new Promise<void>((resolve) => httpServer.listen(PORT, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

main().catch(err => console.log(err));