import React from 'react'
import { Session } from 'next-auth';
import { Box } from '@chakra-ui/react';
import ConversationList from './ConversationList';

interface Props {
  session: Session
}

export default function ConversationsWrapper({ session }: Props) {
  return (
    <Box width={{ base: '100%', md: '400px' }} border='1px solid red ' bg='whiteAlpha.50' py={6} px={3}>
      ConversationsWrapper
      <ConversationList session={session} />
    </Box>
  )
}