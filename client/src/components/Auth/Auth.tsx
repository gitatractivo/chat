import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, TagLeftIcon, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import UserOperations from '../../graphql/operations/user'
import { CreateUsernameData, CreateUsernameVariables } from "../../utils/types";

interface IAuthProps {
  session: Session| null;
  reloadSession: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({session,reloadSession}) => {
  const [username,setUsername] = useState('');

  //types of typescript and graphql are different here typescript does not know what type of data will useMutation will return hernce we have to specify that
  const [createUsername, {loading,error}] = useMutation<CreateUsernameData,CreateUsernameVariables>(UserOperations.Mutations.createUsername)

  const onSubmit = async()=>{
    if(!username) return;
    try {
      const {data} = await createUsername({variables:{username}})
      if(!data?.createUsername){
        throw new Error()
        
      }
      if(data.createUsername.error){
        const {createUsername: {error}}=data
        throw new Error(error)
      }
      
      toast.success('Username Created Succesfully')
      
      reloadSession()
    } catch (error:any) {
      // reloadSession() 
       
      toast.error(error?.message)
      console.log("onSubmit Error", error);
    }
  }
  return (
    <Center height="100vh" >
      <Stack spacing={6} align="center">
        {
          session?(
            <>
              <Text>Create a Username</Text>
              <Input placeholder="Enter a username" value={username} onChange={e=>setUsername(e.target.value)}/>
              <Button onClick={onSubmit} isLoading={loading}>Save</Button>
            </>
          ):
          (<>
            <Text>MessengerQl</Text>
            <Button onClick={()=>signIn('google')} leftIcon={< Image height="20px" src="/images/googlelogo.png" />}>Continue with Google</Button>
          </>
          
          )
        }
      </Stack>

    </Center>)
};

export default Auth;
