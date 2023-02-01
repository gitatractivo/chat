import { Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessagesHeader from "./Messages/Header";

interface Props {
  session: Session;
}

const FeedWrapper = ({ session }: Props) => {
  const router = useRouter();
  const {user:{id:userId}}=session

  const { conversationId } = router.query;
  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none", md: "flex" }}
      width="100%"
      direction="column"
      border="1px solid white"
    >
      {conversationId && typeof conversationId === "string"? (
        <Flex
          direction="column"
          justify="space-between"
          overflow="hidden"
          flexGrow={1}
        >
          {conversationId}
          <MessagesHeader userId={userId} conversationId={conversationId } />
        </Flex>
      ) : (
        <Text>No Conversations Found</Text>
      )}
    </Flex>
  );
};

export default FeedWrapper;
