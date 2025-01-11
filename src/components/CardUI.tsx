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
    <VStack w={"5em"} aspectRatio={1 / 1.4} position={"absolute"} top={0} left={0} boxShadow={"6px 6px 6px rgba(0, 0, 0, 0.4)"} userSelect={"none"} draggable={"false"} color={hide ? "black" : cardColor()} bg={hide ? "black" : "white"} align={"start"} border={"1px solid black"} borderRadius={2} px={1} transform={`translateX(${i}em) translateY(${0 + (i * 1.5)}em)`}>
      {!hide && <Text >{card.label}</Text>}
      <Spacer/>
      {!hide && <Text alignSelf={"center"} fontSize={"2xl"} p={0} m={0}>{card.label[card.label.length - 1]}</Text>}
      <Spacer/>
      {!hide && <Text alignSelf={"end"}>{card.label}</Text>}
    </VStack>
  )
}

export default CardUI
