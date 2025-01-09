import { Button, Heading, VStack } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hub = () => {

  const navigate = useNavigate()

  return (
    <VStack position={"relative"} w={"100vw"} minH={"100vh"} bgColor={"#105840"}>
      <Heading size={"4xl"} mt={"2em"}>Welcome To The Blackjack Hub</Heading>
      <VStack mt={10}>
        <Button disabled={true} onClick={() => navigate("/tutorial")} w={"xs"} _hover={{w: "sm"}} transition={"300ms all ease-in-out"}>Tutorial Mode</Button>
        <Button disabled={true} onClick={() => navigate("/onevsdealer")} w={"xs"} _hover={{w: "sm"}} transition={"300ms all ease-in-out"}>1 v 1 (Dealer)</Button>
        <Button onClick={() => navigate("/onevsthree")} w={"xs"} _hover={{w: "sm"}} transition={"300ms all ease-in-out"}>1 v 3 (AI)</Button>
        <Button disabled={true} onClick={() => navigate("/online")} w={"xs"} _hover={{w: "sm"}} transition={"300ms all ease-in-out"}>1 v 3 (Online)</Button>
      </VStack>
    </VStack>
  )
}

export default Hub
