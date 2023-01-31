import { Box, Text } from '@chakra-ui/react';
import { Session } from "next-auth"
import { useState } from 'react';
import { ConversationPopulated } from '../../../../../server2/src/util/types';
import ConversationsItem from './ConversationsItem';
import ConversationModal from './Modal/Modal';

interface Props  {
  session: Session,
  conversations: Array<ConversationPopulated>
}

const ConversationList = ({session,conversations}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
    const onOpen = () =>setIsOpen(true)
    const onClose = () =>setIsOpen(false)
  return (
    <Box width='100%'>
      <Box py={2} px={4} mb={4} bg='blackAlpha.300' borderRadius={4} cursor='pointer' onClick={onOpen}>
        <Text textAlign='center' color="whiteAlpha.800">
          Find or Start a conversation
        </Text>
      </Box>
      <ConversationModal isOpen={isOpen} onClose={onClose} session={session}/>

      {
        conversations.map(conversation => (
          <ConversationsItem key={conversation.id} conversation={conversation}/>
        ))
      }
    </Box>
  )
}

export default ConversationList