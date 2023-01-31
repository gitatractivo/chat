import { SearchedUser } from "../../../../utils/types";
import { Avatar, Flex, Stack, Text } from "@chakra-ui/react";

interface Props {
  users: Array<SearchedUser>;
  addParticipant: (user:SearchedUser) => void
}

const UserSearchList = ({ users , addParticipant}: Props) => {
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify="center">
          <Text>No Users Found</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map((user) => (
            <Stack
              key={user.id}
              direction="row"
              align="center"
              spacing={5}
              px={4}
              py={2}
              borderRadius={8}
              cursor="pointer"
              // border="1px solid white"
              bg="blackAlpha.400"
              _hover={{bg:"whiteAlpha.200"}}
              onClick={()=>{addParticipant(user)}}
            >
              <Avatar src=""/>
              <Text color="whiteAlpha.700" >

                {user.username}
              </Text>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
};

export default UserSearchList;
