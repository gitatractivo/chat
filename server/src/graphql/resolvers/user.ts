import { User } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { GraphQLContext, CreateUsernameResonse } from '../../util/types';
const resolvers = {
    Query: {
        searchUsers: async (_: any,
            args: { username: string },
            context: GraphQLContext,
        ): Promise<Array<User>> => {
            console.log("search called")
            const { username: searchedUsername } = args
            const { session, prisma } = context;

            if (!session?.user) {
                throw new GraphQLError("Not Authorized")
            }
            const {
                user: { username: myUsername },
            } = session

            try {
                const users = await prisma.user.findMany({
                    where: {
                        username: {
                            contains: searchedUsername,
                            not: myUsername,
                            mode: 'insensitive'
                        }
                    }
                })
                // console.log("users",users)
                return users
            } catch (error: any) {
                console.log("searchUsers Error", error)
                throw new GraphQLError(error?.message)
            }
        },
    },
    Mutation: {
        createUsername: async (
            _: any,
            args: { username: string },
            context: GraphQLContext,
        ): Promise<CreateUsernameResonse> => {
            const { username } = args
            const { session, prisma } = context
            console.log("hey this is api", username);
            if (!session?.user) {
                return {
                    error: "Not authorised",
                }
            }
            const userId = session?.user?.id;
            try {
                // chech that username is not taken 
                const existingUser = await prisma.user.findUnique({
                    where: {
                        username,
                    }
                })
                if (existingUser) {
                    return {
                        error: "Username already taken. Try another"
                    }
                }
                await prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        username
                    }
                })
                console.log("success");
                return { success: true }

                //if username is available then make changes 

            } catch (error: any) {

                console.log("createUsername Error", error)

                return {
                    error: error?.message as string
                }
            }

        },
    }
}
export default resolvers