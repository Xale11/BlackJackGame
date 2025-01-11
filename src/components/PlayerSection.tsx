import React from 'react'
import { BlackjackPlayer } from '../classes/BlackjackPlayer'
import { HStack, Icon, Span, Text, VStack } from '@chakra-ui/react'
import PlayerHand from './PlayerHand'
import { FaCrown } from 'react-icons/fa'

interface Props {
  player: BlackjackPlayer
  showOutcome: boolean
  currentPlayer: BlackjackPlayer | undefined
}

const finalScoreStyling = (player: BlackjackPlayer) => {

  if (player.isFinished && player.evaluate() > 21){
    return {
      bgColor: "#DC2626",
      textColor: "white"
    }
  } else if (player.isFinished && player.evaluate() == 21){
    return {
      bgColor: "#FFD700",
      textColor: "black"
    }
  }

  return {
    bgColor: "white",
    textColor: "black"
  }
}

const outcomeStyling = (player: BlackjackPlayer) => {

  if (player.endgameStatus() == "Win"){
    return {
      bgColor: "#16A34A",
      textColor: "white"
    }
  } else if (player.endgameStatus() == "Lose"){
    return {
      bgColor: "#DC2626",
      textColor: "white"
    }
  }

  return {
    bgColor: "black",
    textColor: "white"
  }
}

const PlayerSection = ({player, showOutcome, currentPlayer}: Props) => {
  return (
    <VStack>

      {player.name && <HStack>
        <Text textAlign={"center"}>{player.name} {player.isDealer && "(Dealer)"} </Text>
        {currentPlayer?.playerId == player.playerId && <Icon color={"gold"}>
          <FaCrown />
        </Icon>}
      </HStack>}

      <HStack align={"end"} gap={5} wrap={{base: "wrap", md: "nowrap"}}>

        <VStack align={{base: "center", md: "end"}} w={{base: "100%", md: "unset"}}>

          <HStack bg={`${finalScoreStyling(player).bgColor}`} boxShadow={"4px 4px 4px rgba(0, 0, 0, 0.4)"} borderRadius={10} h={"2em"} minW={"2em"} px={5} justify={"center"} align={"center"} gap={0}>
            
            {showOutcome || player.isFinished ? 
              <Text color={`${finalScoreStyling(player).textColor}`}>{player.evaluate()}</Text> 
              :
              player.possibleScores.map((score, i) => {
                if (i == 0) return <Text color={score > 21 ? "red" : "black"}>{score}</Text>
                  return <Text w={"max-content"}>,<Span color={score > 21 ? "red" : "black"}>{` ${score}`}</Span></Text>
              })
            }

          </HStack>
          
          {showOutcome && !player.isDealer && <HStack bg={`${outcomeStyling(player).bgColor}`} color={`${outcomeStyling(player).textColor}`} boxShadow={"4px 4px 4px rgba(0, 0, 0, 0.4)"} borderRadius={10} h={"2em"} minW={"2em"} px={8} py={2} justify={"center"} gap={0}>
            <Text >{player.endgameStatus()}</Text>
          </HStack>}
        </VStack>
          
        <PlayerHand hand={player.hand} isDealer={player.isDealer} showOutcome={showOutcome}/>
        
      </HStack>
      
      
    </VStack>
  )
}

export default PlayerSection
