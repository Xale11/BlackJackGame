import { useEffect, useRef, useState } from 'react'
import { BlackjackPlayer } from '../classes/BlackjackPlayer'
import { BlackJack } from '../classes/BlackjackGame'
import { Box, Button, HStack, Icon, MenuContent, MenuItem, MenuRoot, MenuTrigger, Spacer, Text, VStack } from '@chakra-ui/react'
import { dealerSequence } from '../utils/playerHandling'
import PlayerSection from '../components/PlayerSection'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IoMenu } from 'react-icons/io5'

const OneVsThree = () => {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // this is the individual using the device. Will not change once the game starts
  const [user] = useState<BlackjackPlayer>(new BlackjackPlayer(false, `${searchParams.get("name") == "" ? "Player 1" : searchParams.get("name")} (You)`))
  const [game] = useState<BlackJack>(new BlackJack(user))
  const [currentPlayer, setCurrentPlayer] = useState<BlackjackPlayer>()
  const [cycle, setCycle] = useState<number>(0) // used to determine whether autoplay should execute if player has not played in time. Also used to force rerenders after hitting or standing 
  const [showOutcome, setShowOutcome] = useState<boolean>(false)
  const timeToPlayInMs = 15000
  const aiTimeToPlayInMs = 1000

  // neeeded to track & clear timeouts and prevent memory leaks. Caused my laptop to crash
  const autoPlayTimer = useRef<number | null>(null)
  const autoPlayAfterTimeOutTimer = useRef<number | null>(null)
  const autoDealerPlayTimer = useRef<number | null>(null)


  const resetGame = () => {
    setCurrentPlayer(undefined)
    setCycle(0)
    game.resetGame()
    setShowOutcome(false)

    game.startGame()
    setCurrentPlayer(game.currentPlayer)
  }

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
    currentPlayer?.stand()
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
        game.gameOver()
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
    }, aiTimeToPlayInMs) // simulate player thinking
  }

  // prevent players from taking too long
  const autoPlayAfterTimeOut = (originalCycle: number) => {
    autoPlayAfterTimeOutTimer.current = window.setTimeout(() => {
      const currentCycle = cycle;
      if (currentCycle === originalCycle && !currentPlayer?.isDealer) {
        
        if (game.isGameOn){
          autoPlay()
        }
        
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
      return
    }

    autoPlayAfterTimeOut(cycle) // auto plays if time runs out

    if (currentPlayer?.isDealer){
      autoDealerPlay()
    } else if (currentPlayer?.isAi){
      autoPlay()
    }
  }, [currentPlayer])


  return (
    <VStack overflowX={"hidden"} position={"relative"} w={"100vw"} minH={"100vh"} bgColor={"#105840"}>

      <Box position={"absolute"} top={5} left={5} zIndex={555}>
        <MenuRoot>
          <MenuTrigger asChild>
            <Icon top={5} left={5} fontSize={"2em"} cursor={"pointer"}>
              <IoMenu/>
            </Icon>
          </MenuTrigger>
          <MenuContent top={"10%"} left={5}>
            <MenuItem onClick={() => window.location.reload()} value="restart">Restart</MenuItem>
            <MenuItem onClick={() => navigate("/")} value="backToMenu">Back To Menu</MenuItem>
          </MenuContent>
        </MenuRoot>
      </Box>
      
      {showOutcome && !game.isGameOn && <VStack w={"7em"} position={"absolute"} top={5} right={5} zIndex={555}>
        <Button w={"100%"} onClick={() => navigate("/")}>Back to menu</Button>
        <Button w={"100%"} onClick={resetGame}>Play again</Button>
      </VStack>}

      {game.players[0] && <VStack transform={{base: "scale(0.7)", md: "unset"}}>
        <PlayerSection player={game.players[0]} showOutcome={showOutcome} currentPlayer={currentPlayer}/>
      </VStack>}

      <HStack mt={{base: "3.5em", md: "12em"}} gap={"5em"} transform={{base: "scale(0.7)", md: "scale(0.8)", lg: "unset"}}>
        {game.players.map((player, i) => {
          if (i == 0) return null
          return (
            <PlayerSection player={player} showOutcome={showOutcome} currentPlayer={currentPlayer}/>
          )
        })}
      </HStack>

      <Spacer/>

      <HStack mb={5} mt={{base: 0, md: 10, lg: 0}}>
        <Button w={{base: "6em", md: "7em"}} h={{base: "6em", md: "7em"}} boxShadow={"4px 4px 4px rgba(0, 0, 0, 0.4)"} colorPalette={"green"} onClick={hit} disabled={!amICurrentPlayer()}>
          <VStack>
            <Text fontSize={"lg"}>+</Text>
            <Text fontSize={"lg"}>HIT</Text>
          </VStack>
        </Button>
        <Button w={{base: "6em", md: "7em"}} h={{base: "6em", md: "7em"}} boxShadow={"4px 4px 4px rgba(0, 0, 0, 0.4)"} colorPalette={"red"} onClick={stand} disabled={!amICurrentPlayer()}>
          <VStack>
            <Text fontSize={"lg"}>-</Text>
            <Text fontSize={"lg"}>STAND</Text>
          </VStack>
        </Button>
      </HStack>
    </VStack>
  )
}

export default OneVsThree