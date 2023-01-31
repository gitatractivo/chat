import { ConversationPopulated } from '../../../server2/src/util/types';
export interface CreateUsernameData {
  createUsername: {
    success: boolean,
    error: string
  }
}
export interface CreateUsernameVariables {
  username: string
}
export interface SearchUserInput {
  username: string
}
export interface SearchUserData {
  searchUsers: Array<SearchedUser>
  // returned users will have only two propterties id and username
}
export interface SearchedUser {
  id: string, 
  username: string 
}

// conversatoins

export interface CreateConversationData{
  createConversation:{
    conversationId: string
  }
}

export interface CreateConversationInput {
  participantIds: Array<String>
}


export interface ConversationsData{
  conversations: Array<ConversationPopulated>
}