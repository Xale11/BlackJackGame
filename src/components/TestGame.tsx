import { useEffect, useState } from 'react'
import { BlackjackPlayer } from '../classes/BlackjackPlayer'
import { BlackJack } from '../classes/BlackjackGame'
import { Button, HStack, Text, VStack } from '@chakra-ui/react'
import { BlackjackCard } from '../classes/BlackjackCards'

const TestGame = () => {

  // this is the individual using the device. Will not change once the game starts
  const [user] = useState<BlackjackPlayer>(new BlackjackPlayer(false, "Alex"))
  const [game] = useState<BlackJack>(new BlackJack(user))
  const [currentPlayer, setCurrentPlayer] = useState<BlackjackPlayer>()
  const [cycle, setCycle] = useState<number>(0)

  const amICurrentPlayer = (): boolean => {
    // if currentPlayer id matches the user id (you) it is your turn
    // this function controls when the buttons are enabled to make a play
    if (currentPlayer?.playerId == user.playerId){
      return true
    } else return false
  }   

  const nextPlayer = () => {
    game.nextPlayer()
    setCurrentPlayer(game.currentPlayer)
  }

  const hit = () => {
    currentPlayer?.hit(game.deck)
    setCycle(prev => prev + 1)
    if (currentPlayer && currentPlayer?.evaluate() >= 21){
      nextPlayer()
    }
  }

  const stand = () => {
    nextPlayer()
  }

  const autoPlay = async () => {
    
    setTimeout(() => {
      const play = currentPlayer?.automateNextPlay(game.deck, game.players[0]); 

      if (play == "hit"){
        currentPlayer?.hit(game.deck)
      } else if(play == "stand") {
        currentPlayer?.stand()
      }

      setCycle(prev => prev + 1)

      if ((currentPlayer && currentPlayer?.evaluate() >= 21) || play == "stand"){
        nextPlayer()
      } else {
        autoPlay()
      }
    }, 3000) // simulate player thinking
  }

  // prevent players from taking too long
  const autoPlayAfterTimeOut = (originalCycle: number) => {
    const timeToPlayInMs = 15000 // 15s
    setTimeout(() => {
      const currentCycle = cycle;
      if (currentCycle === originalCycle && !currentPlayer?.isDealer) {
        autoPlay()
      }
    }, timeToPlayInMs); 
  }
 
  useEffect(() => {
    // game is setup when page in render. Only occurs once or else game will reset
    // if window closes the game will end
    game.startGame()
    setCurrentPlayer(game.currentPlayer)
  }, [])

  useEffect(() => {
    autoPlayAfterTimeOut(cycle)
    console.log(game, currentPlayer, user)
    if (currentPlayer?.isAi){
      autoPlay()
    }
  }, [currentPlayer])


  return (
    <VStack w={"100vw"} minH={"100vh"}>
      <HStack>
        {game.players.map((player) => {
          return (
            <VStack color={currentPlayer?.playerId == player?.playerId ? "red" : "white"}>
              <Text>Id: {player.playerId}</Text>
              <Text>Score: {player.possibleScores.join(", ")}</Text>
              {player.name && <Text>{player.name}</Text>}
              {player.isDealer && <Text>Dealer</Text>}
            </VStack>
          )
        })}
      </HStack>
      
      <Button onClick={hit} disabled={!amICurrentPlayer()}>Hit</Button>
      <Button onClick={stand} disabled={!amICurrentPlayer()}>Stand</Button>
    </VStack>
  )
}

export default TestGame
