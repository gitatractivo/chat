import { Button, Center, Image, Input, Stack, TagLeftIcon, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface IAuthProps {
  session: Session| null;
  reloadSession: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({session,reloadSession}) => {
  const [username,setUsername] = useState('');
  const onSubmit = async()=>{
    try {
      //
    } catch (error) {
      console.log("onSubmit Error", error);
    }
  }
  return (
    <Center height="100vh" border="1px solid red">
      <Stack spacing={6} align="center">
        {
          session?(
            <>
              <Text>Create a Username</Text>
              <Input placeholder="Enter a username" value={username} onChange={e=>setUsername(e.target.value)}/>
              <Button onClick={onSubmit}>Save</Button>
            </>
          ):
          (<Text>
            MessengerQl
          </Text>
          )
        }
      <Button onClick={()=>signIn('google')} leftIcon={< Image height="20px" src="/images/googlelogo.png" />}>Continue with Google</Button>
      </Stack>

    </Center>)
};

export default Auth;
