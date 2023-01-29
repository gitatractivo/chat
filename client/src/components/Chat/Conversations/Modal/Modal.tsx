import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,Modal,Text, Stack, Input } from "@chakra-ui/react"
import { useState } from "react"
import UserOperations from '../../../../graphql/operations/user'
import { SearchUserData, SearchUserInput } from '../../../../utils/types';

interface Props  {
    isOpen: boolean;
    onClose: ()=> void
}

const ConversationModal = ({isOpen,onClose}: Props) => {
    const [username, setUsername] = useState("")
    
    //usequery vs uselazyquery this does not render on component did mount
    const [searchUsers, {data,error,loading}]=useLazyQuery< SearchUserData,SearchUserInput>(UserOperations.Queries.searchUsers) 

    console.log("here is usernames data", data);
    const onSearch = (event: React.FormEvent)=>{
        event.preventDefault();

        //this function is async but this will be handled by uselazy hook
        searchUsers({variables: {username}})
        console.log("INSIDE ON SUBMIT",username)
    }
  return (
    <>

      <Modal isOpen={isOpen} onClose={onClose}  >
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}> 
                <Stack spacing={4}>
                    <Input placeholder="Enter a username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <Button type="submit" disabled={!username} isLoading={loading}>Search</Button>
                </Stack>
            </form>
          </ModalBody>

        </ModalContent>
      </Modal>
    </>
  )
}

export default ConversationModal