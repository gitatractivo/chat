import { ConversationPopulated, GraphQLContext, Session } from '../../util/types';
import { ApolloError } from 'apollo-server-core';
import { Prisma } from '@prisma/client';
import { withFilter } from 'graphql-subscriptions';

const resolvers = {
    Query: {
        conversations: async (_: any, __: any, context: GraphQLContext): Promise<Array<ConversationPopulated>> => {
            const { session, prisma } = context;
            console.log("inside resolvers")
            if (!session?.user) {
                throw new ApolloError('Not Authorised')
            }

            const { user: { id: userId } } = session;

            try {
                const conversations: Array<ConversationPopulated> = await prisma.conversation.findMany({
                    where: {
                        participants: {
                            some: {
                                userId: {
                                    equals: userId
                                }
                            }
                        }
                    },
                    include: conversationPopulated,
                })
                console.log("conversations resolver update", (conversations ))
                return conversations
            } catch (error: any) {
                console.log('Conversations error', error)
                throw new ApolloError(error?.message)
            }

        }
    },


    Mutation: {
        createConversation: async (_: any, args: { participantIds: Array<string>, }, context: GraphQLContext): Promise<{ conversationId: string }> => {
            const { participantIds } = args
            const { session, prisma, pubsub } = context

            if (!session?.user) {
                throw new ApolloError('Not Authorised')
            }
            const { user: { id: userId } } = session

            try {
                const conversation = await prisma.conversation.create({
                    data: {
                        participants: {
                            createMany: {
                                data: participantIds.map(id => ({
                                    userId: id,
                                    hasSeenLatestMessage: id === userId
                                }))
                            }
                        },
                    },
                    include: conversationPopulated,
                })

                console.log("from server",conversation)

                pubsub.publish('CONVERSATION_CREATED', {
                    conversationCreated: conversation,
                })

                return {
                    conversationId: conversation.id
                }
            } catch (error: any) {
                console.log('createConversation error')
                console.log(error)
                throw new ApolloError('Error creating conversation', error?.message)
            }
        }
    },
    Subscription: {
        conversationCreated: {
            subscribe: withFilter((_: any, __: any, context: GraphQLContext) => {
                const { pubsub } = context
                console.log("inside subs")
                return pubsub.asyncIterator(['CONVERSATION_CREATED'])
            },
            (payload:ConversationCreatedSubscriptionPayload,_:any,context:GraphQLContext)=>{
                const {conversationCreated:{participants}}=payload
                const {session}= context
                return !!participants.find(p => p.userId === session?.user?.id)
            })
        }
    }
}


export interface ConversationCreatedSubscriptionPayload  {
    conversationCreated: ConversationPopulated
}

export const participantPopulated = Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
        select: {
            id: true,
            username: true
        }
    }
})

export const conversationPopulated = Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
        include: participantPopulated
    },
    latestMessage: {
        include: {
            sender: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    },
    

    
})

export default resolvers