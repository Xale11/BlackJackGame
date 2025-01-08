import { Spacer, Text, VStack } from '@chakra-ui/react'
import { BlackjackCard } from '../classes/BlackjackCards'

interface Props {
  card: BlackjackCard
  i: number
  hide?: boolean
}

const CardUI = ({card, i, hide}: Props) => {

  // "♠", "♥", "♦", "♣"

  const cardColor = (): "black" | "red" => {
    if (card.label[card.label.length - 1] == "♠" || card.label[card.label.length - 1] == "♣"){
      return "black"
    } else {
      return "red"
    }
  }

  return (
    <VStack position={"absolute"} color={hide ? "black" : cardColor()} bg={hide ? "black" : "white"} w={"5em"} aspectRatio={1 / 1.4} align={"start"} border={"1px solid black"} borderRadius={2} px={1} transform={`translateX(${i}em) translateY(${0 + (i * 1.5)}em)`}>
      <Text >{card.label}</Text>
      <Spacer/>
      <Text alignSelf={"center"} fontSize={"2xl"} p={0} m={0}>{card.label[card.label.length - 1]}</Text>
      <Spacer/>
      <Text alignSelf={"end"}>{card.label}</Text>
    </VStack>
  )
}

export default CardUI
