import { Button, Stack, Text } from "@chakra-ui/react";
import { Router, useRouter } from "next/router";
import React from "react";
import { useQuery } from "@apollo/client";
import ConversationOperations from "../../../../graphql/operations/conversation";
import { ConversationsData } from "../../../../utils/types";
import { formatUsernames } from '../../../../utils/functions';
type Props = {
  userId: string;
  conversationId: string;
};

const MessagesHeader = ({ userId, conversationId }: Props) => {
  const router = useRouter();
  const { data, loading } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations
  );

  const conversation = data?.conversations.find(
    (conversation) => conversation.id === conversationId
  );

  // if (data?.conversations && !loading && !conversation) {
  //   router.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
  // }
  return (
    <Stack
      direction="row"
      align="center"
      spacing={6}
      py={5}
      px={{ base: 4, md: 0 }}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Button
        display={{ md: "none" }}
        onClick={() =>
          router.replace("?conversationId", "/", {
            shallow: true,
          })
        }
      >
        Back
      </Button>

      {conversation && (
        <Stack direction="row">
          <Text color="whiteAlpha.600">T0:</Text>
          <Text fontWeight={600}>
            {formatUsernames(conversation.participants, userId)}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export default MessagesHeader;
