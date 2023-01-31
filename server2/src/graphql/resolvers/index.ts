import userReslovers from './user'
import conversationResolvers from './conversation'
import merge from 'lodash.merge';

const resolvers = merge({},userReslovers,conversationResolvers)

export default resolvers