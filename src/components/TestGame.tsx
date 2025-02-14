import { useEffect, useRef, useState } from 'react'
import { BlackjackPlayer } from '../classes/BlackjackPlayer'
import { BlackJack } from '../classes/BlackjackGame'
import { Button, HStack, Text, VStack } from '@chakra-ui/react'
import { dealerSequence } from '../utils/playerHandling'

const TestGame = () => {

  // this is the individual using the device. Will not change once the game starts
  const [user] = useState<BlackjackPlayer>(new BlackjackPlayer(false, "Alex"))
  const [game] = useState<BlackJack>(new BlackJack(user))
  const [currentPlayer, setCurrentPlayer] = useState<BlackjackPlayer>()
  const [cycle, setCycle] = useState<number>(0)
  const [showOutcome, setShowOutcome] = useState<boolean>(false)

  // neeeded to track & clear timeouts and prevent memory leaks. Caused my laptop to crash
  const autoPlayTimer = useRef<number | null>(null)
  const autoPlayAfterTimeOutTimer = useRef<number | null>(null)
  const autoDealerPlayTimer = useRef<number | null>(null)

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

  const autoDealerPlay = () => {
    
    autoDealerPlayTimer.current = window.setTimeout(() => {
      const play = dealerSequence(game.players[0], false)

      if (play == "hit"){
        currentPlayer?.hit(game.deck)
      } else if(play == "stand") {
        currentPlayer?.stand()
      }

      setCycle(prev => prev + 1)

      if ((currentPlayer && currentPlayer?.evaluate() >= 21) || play == "stand"){
        nextPlayer()
        setCurrentPlayer(undefined)
      } else {
        autoDealerPlay()
      }
    }, 1500)
  }

  const autoPlay = () => {
    
    autoPlayTimer.current = window.setTimeout(() => {
      const play = currentPlayer?.automateNextPlay(game.players[0]); 

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
    }, 1000) // simulate player thinking
  }

  // prevent players from taking too long
  const autoPlayAfterTimeOut = (originalCycle: number) => {
    const timeToPlayInMs = 15000 // 15s
    autoPlayAfterTimeOutTimer.current = window.setTimeout(() => {
      const currentCycle = cycle;
      if (currentCycle === originalCycle && !currentPlayer?.isDealer) {
        autoPlay()
      }
    }, timeToPlayInMs); 
  }

  const clearTimeouts = () => {
    if (autoPlayTimer.current !== null) {
      clearTimeout(autoPlayTimer.current);
      autoPlayTimer.current = null;
    }
    if (autoPlayAfterTimeOutTimer.current !== null) {
      clearTimeout(autoPlayAfterTimeOutTimer.current);
      autoPlayAfterTimeOutTimer.current = null;
    }
  };
 
  useEffect(() => {
    // game is setup when page in render. Only occurs once or else game will reset
    // if window closes the game will end
    game.startGame()
    setCurrentPlayer(game.currentPlayer)

    return () => {
      clearTimeouts();
    };
  }, [])

  useEffect(() => {
    if (!game.isGameOn){
      game.gameOver()
      setShowOutcome(true)
      clearTimeouts();
    }

    autoPlayAfterTimeOut(cycle) // auto plays if time runs out
    console.log(game, currentPlayer, user)

    if (currentPlayer?.isDealer){
      autoDealerPlay()
    } else if (currentPlayer?.isAi){
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
              {showOutcome && !player.isDealer && <Text>{player.endgameStatus()}</Text>}
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
