import { Prisma, PrismaClient } from '@prisma/client';
import { Context } from 'graphql-ws/lib/server';
import { ISODateString } from 'next-auth';
import { conversationPopulated, participantPopulated } from '../graphql/resolvers/conversation';
import { PubSub } from 'graphql-subscriptions';


//server Config


export interface GraphQLContext {
    session: Session | null;
    prisma: PrismaClient
    pubsub: PubSub
}


export interface Session {
    user: User,
    expires: ISODateString
}


export interface SubscriptionContext extends Context {
    connectionParams: {
        session?: Session
    }
}









export interface User {
    id: string,
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    username?: string,
    emailVerified: boolean
}

export interface CreateUsernameResonse {
    success?: boolean,
    error?: string | null,
}

export type ConversationPopulated = Prisma.ConversationGetPayload<{
    include: typeof conversationPopulated
}>

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
    include: typeof participantPopulated
}>