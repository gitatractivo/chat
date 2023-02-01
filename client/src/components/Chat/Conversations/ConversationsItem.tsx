import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ConversationPopulated } from "../../../../../server2/src/util/types";
import conversation from "../../../graphql/operations/conversation";
import enUS from "date-fns/locale/en-US";
import { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";
import { formatRelative } from "date-fns";
import { formatUsernames } from "../../../utils/functions";

interface Props {
  conversation: ConversationPopulated;
  userId: string;
  onClick: () => void;
  isSelected: boolean;
}

const formatRelativeLocale =  {
  lastWeek: "eeee",
  yesterday: "Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

const ConversationsItem = ({
  conversation,
  userId,
  onClick,
  isSelected,
}: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  console.log(conversation)

  const handleClick = (event: React.MouseEvent) => {
    if (event.type === "click") {
      onClick();
    } else if (event.type === "contextmenu") {
      event.preventDefault();
      setMenuOpen(true);
    }
  };

  return (
    <Stack
      direction="row"
      align="center"
      justify="space-between"
      cursor="pointer"
      p={4}
      m={2}
      borderRadius={6}
      _hover={{ bg: "whiteAlpha.200" }}
      onClick={handleClick}
      onContextMenu={handleClick}
      position="relative"
    >
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuList bg="#2d2d2d">
          <MenuItem
            icon={<AiOutlineEdit fontSize={20} />}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Edit
          </MenuItem>
          {conversation.participants.length > 2 ? (
            <MenuItem
              icon={<BiLogOut fontSize={20} />}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Leave
            </MenuItem>
          ) : (
            <MenuItem
              icon={<AiOutlineEdit fontSize={20} />}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <Avatar />
      <Flex justify="space-between" width="80%" height="100%">
        <Flex direction="column" width="70%" height="100%">
          <Text
            fontWeight={600}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {formatUsernames(conversation.participants, userId)}
          </Text>
          {conversation.latestMessage && (
            <Box width="140%">
              <Text
                color="whiteAlpha.700"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
              {conversation.latestMessage.body}
              </Text>
            </Box>
          )}
        </Flex>
        <Text color="whiteAlpha.700" textAlign="right" position="absolute" right={4}>
          {conversation?.updateAt && formatRelative(new Date(conversation?.updateAt) , new Date(),{
            locale:{
              ...enUS,
              formatRelative: (token)=>
                formatRelativeLocale[
                  token as keyof typeof formatRelativeLocale
                ],
            }
          })}  
        </Text>
      </Flex>
    </Stack>
  );
};

export default ConversationsItem;
