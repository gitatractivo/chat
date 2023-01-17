const typeDefs = `
    type User{
    id: String
    username: String!
}

type Query{
    searchUsers(username: String): [User]
}

type Mutation {
    createUsername(username: String): CreateUsernameRespose
}

type CreateUsernameRespose{
    success: Boolean!
    error: String!
}
`;
export default typeDefs;
