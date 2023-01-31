import { Flex, Text } from "@chakra-ui/react"
import { Session } from "next-auth"
import { useRouter } from 'next/router';

interface Props  {
  session: Session
}

const FeedWrapper = ({session}: Props) => {
  const router = useRouter()

  const {conversationId} = router.query
  return (
    <Flex display={{base:conversationId ? 'flex': 'none', md: 'flex'}}width="100%" direction='column' border="1px solid white">
      {
      conversationId ? (
        <Flex>{conversationId }</Flex>
      ):(
        <Text>No Conversations Found</Text>
      )}

    </Flex>
  )
}

export default FeedWrapper