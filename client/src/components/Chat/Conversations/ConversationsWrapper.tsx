import React, { useEffect } from "react";
import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import ConversationList from "./ConversationList";
import { useQuery } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationsData } from "../../../utils/types";
import { ConversationPopulated } from "../../../../../server2/src/util/types";
import { useRouter } from "next/router";

interface Props {
  session: Session;
}

export default function ConversationsWrapper({ session }: Props) {
  const {
    data: ConversationData,
    loading: ConversationLoading,
    error: ConversationError,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations
  );
  console.log("conversation data updated",ConversationData);

  const router = useRouter();

  const onViewConvesations = async (conversationId: string) => {
    /* 
    1.Push conversatioinId to router query params
     */

    router.push({ query: { conversationId } });
    // 2. Mark the conversation as read
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  const {
    query: { conversationId },
  } = router;

  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Box
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "400px" }}
      bg="whiteAlpha.50"
      py={6}
      px={3}
    >
      <ConversationList
        session={session}
        conversations={ConversationData?.conversations || []}
        onViewConversations={onViewConvesations}
      />
    </Box>
  );
}
