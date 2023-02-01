import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import { ConversationPopulated } from "../../../../../server2/src/util/types";
import ConversationsItem from "./ConversationsItem";
import ConversationModal from "./Modal/Modal";
import { useRouter } from "next/router";

interface Props {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversations: (conversationId: string) => void;
}

const ConversationList = ({
  session,
  conversations,
  onViewConversations,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);


  const router = useRouter();
  const {
    user: { id: userId },
  } = session;

  
  return (
    <Box width="100%">
      <Box
        py={2}
        px={4}
        mb={4}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text textAlign="center" color="whiteAlpha.800">
          Find or Start a conversation
        </Text>
      </Box>
      <ConversationModal isOpen={isOpen} onClose={onClose} session={session} />

      {conversations.map((conversation) => (
        <ConversationsItem
          key={conversation.id}
          conversation={conversation}
          onClick={() => onViewConversations(conversation.id)}
          isSelected={conversation.id === router.query.conversationId}
          userId={userId}
        />
      ))}
    </Box>
  );
};

export default ConversationList;
