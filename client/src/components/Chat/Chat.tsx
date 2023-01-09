import { Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";

interface IChatProps {
}

const Chat: React.FC<IChatProps> = (props) => {
  return (
      <Button onClick={()=>signOut()}>
        LogOut
      </Button>
    )
};

export default Chat;
