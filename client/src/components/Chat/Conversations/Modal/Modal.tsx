import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import {
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
  Text,
  Stack,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import UserOperations from "../../../../graphql/operations/user";
import ConversationOperations from "../../../../graphql/operations/conversation";

import {
  SearchUserData,
  SearchUserInput,
  SearchedUser,
} from "../../../../utils/types";
import Participants from "./Participants";
import UserSearchList from "./UserSearchList";
import {
  CreateConversationData,
  CreateConversationInput,
} from "../../../../utils/types";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const ConversationModal = ({ isOpen, onClose, session }: Props) => {

  const router = useRouter()

  const {
    user: { id: userId },
  } = session;
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  //usequery vs uselazyquery this does not render on component did mount

  const [searchUsers, { data, error, loading }] = useLazyQuery<
    SearchUserData,
    SearchUserInput
  >(UserOperations.Queries.searchUsers);

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationInput>(
      ConversationOperations.Mutation.createConversation
    );

  const onCreateConversation = async () => {
    try {
      const participantIds = [userId, ...participants.map((p) => p.id)];
      //cerateusernameMutation

      const { data: conversationData } = await createConversation({
        variables: {
          participantIds,
        },
      });
      if (!conversationData?.createConversation) {
        throw new Error("Failed to create conversation");
      }
      console.log(conversationData);

      const {
        createConversation: { conversationId },
      } = conversationData;

      router.push({query:{conversationId 
      }})
      console.log(conversationId)
      setParticipants([]);
      setUsername('')
      onClose()

    } catch (error: any) {
      console.log("oncreateConversationError", error);
      toast.error(error?.message);
    }
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
  };
  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  // console.log("here is usernames data", data);
  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    //this function is async but this will be handled by uselazy hook
    searchUsers({ variables: { username } });
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Create a New Consersation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button type="submit" disabled={!username} isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data?.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipants={removeParticipant}
                />
                <Button
                  colorScheme="twitter"
                  width="100%"
                  mt={6}
                  _hover={{ bg: "blue.300" }}
                  onClick={() => onCreateConversation()}
                  isLoading={createConversationLoading}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
