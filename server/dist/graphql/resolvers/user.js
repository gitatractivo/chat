const resolvers = {
    Query: {
        searchUsers: () => { },
    },
    Mutation: {
        createUsername: (_, args, contextvalue) => {
            const { username } = args;
            console.log("hey this is api", username);
            console.log(contextvalue);
        },
    }
};
export default resolvers;
