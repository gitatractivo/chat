import { Flex, Stack ,Text} from '@chakra-ui/react';
import { SearchedUser } from '../../../../utils/types';
import { IoIosCloseCircleOutline} from 'react-icons/io'

interface Props {
    participants: Array<SearchedUser>
    removeParticipants: (userId: string) => void
}

const Participants = ({participants,removeParticipants}: Props) => {
  return (
    <Flex mt={8} gap="10px">
        {participants.map(participant=>(
            <Stack direction="row" key={participant.id}  bg="whiteAlpha.200" p={2} borderRadius={4}>
                <Text>{participant.username}</Text>
                <IoIosCloseCircleOutline size={20} cursor='pointer' onClick={()=>{removeParticipants(participant.id)}}/>
            </Stack>
        ))}
    </Flex>
  )
}

export default Participants