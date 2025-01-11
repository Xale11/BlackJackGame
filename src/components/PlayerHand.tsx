import { VStack } from "@chakra-ui/react"
import { BlackjackCard } from "../classes/BlackjackCards"
import CardUI from "./CardUI"

interface Props {
  hand: BlackjackCard[]
  isDealer: boolean
  showOutcome: boolean
}

const PlayerHand = ({hand, isDealer, showOutcome}: Props) => {

  return (
    <VStack position={"relative"} w={"5em"} aspectRatio={1 / 1.4}>
      {hand.map((card, i) => {
        if (isDealer && i == 1 && hand.length <= 2 && !showOutcome){
          return (<CardUI card={card} i={i} hide={isDealer} />)
        }
        return (<CardUI card={card} i={i} />)
      })}

    </VStack>
    
  )
}

export default PlayerHand
