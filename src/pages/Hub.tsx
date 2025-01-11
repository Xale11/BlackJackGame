import { Button, Heading, Input, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Hub = () => {

  const navigate = useNavigate()

  const [name, setName] = useState<string>("")

  return (
    <VStack position={"relative"} w={"100vw"} minH={"100vh"} bgColor={"#105840"}>
      <Heading size={"4xl"} mt={"2em"} textAlign={"center"}>Welcome To The Blackjack Hub</Heading>
      
      <VStack mt={5}>
        <Heading>Enter your name:</Heading>
        <Input w={{base: "sm", md: "md"}} value={name} onChange={(e) => setName(e.target.value)} type='text' color={"black"} placeholder='Enter your name...' bg={"#eaeaea"}/>
      </VStack>
      
      <VStack mt={5}>
        <Button onClick={() => navigate(`/blackjack?name=${name}&numplayers=1`)} w={"xs"} _hover={{w: "sm"}} transition={"300ms all ease-in-out"}>1 v 1</Button>
        <Button onClick={() => navigate(`/blackjack?name=${name}&numplayers=3`)} w={"xs"} _hover={{w: "sm"}} transition={"300ms all ease-in-out"}>1 v 3 (AI)</Button>
      </VStack>
    </VStack>
  )
}

export default Hub
