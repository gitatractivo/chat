const resolvers = {
    Query:{
        searchUsers: ()=>{},
    },
    Mutation:{
        createUsername: (_: any, args: {username: string}, contextvalue: any)=> {
            const {username} = args
            console.log("hey this is api",username);
            console.log(contextvalue);

        },
    }
}
export default resolvers