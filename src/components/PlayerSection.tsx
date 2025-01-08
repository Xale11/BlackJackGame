import React from 'react'
import { BlackjackPlayer } from '../classes/BlackjackPlayer'
import { Text, VStack } from '@chakra-ui/react'
import PlayerHand from './PlayerHand'

interface Props {
  player: BlackjackPlayer
  showOutcome: boolean
  currentPlayer: BlackjackPlayer | undefined
}

const PlayerSection = ({player, showOutcome, currentPlayer}: Props) => {
  console.log(player.isFinished)
  return (
    <VStack color={currentPlayer?.playerId == player.playerId ? "red" : "white"}>
      {/* <Text>Id: {player.playerId}</Text> */}
      {(!player.isDealer || showOutcome) && <Text>Score: {showOutcome || player.isFinished ? player.evaluate() : player.possibleScores.join(", ")}</Text>}
      {player.name && <Text>{player.name}</Text>}
      {player.isDealer && <Text>Dealer</Text>}
      {showOutcome && !player.isDealer && <Text>{player.endgameStatus()}</Text>}
      <PlayerHand hand={player.hand} isDealer={player.isDealer} showOutcome={showOutcome}/>
    </VStack>
  )
}

export default PlayerSection
