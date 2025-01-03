import { BlackjackDeck } from "./CardHandling"
import { BlackjackPlayer } from "./PlayerHandling"

export class BlackJack {

  currentPlayer?: BlackjackPlayer
  deck: BlackjackDeck
  isGameOn: boolean
  players: BlackjackPlayer[]
  // tracks the number players who have played. if cycle == players.length, gameover and determine winners
  cycle: number = 0
  

  constructor(player: BlackjackPlayer){
    this.players = this.generatePlayers(player, 3)
    this.deck = new BlackjackDeck()
    this.isGameOn = false
    this.currentPlayer = undefined
  }

  startGame(){
    // at the start of the game everyone recieves two cards
    for (const player of this.players){
      player.recieveCards(this.deck.giveCard(2))
    }

    // sets current player
    this.nextPlayer()

    this.isGameOn = true
    
  }

  gameOver(){

  }
  
  generatePlayers(player: BlackjackPlayer, numPlayers: number): BlackjackPlayer[]{
    const dealer = BlackjackPlayer.createNewPlayer(true)
    // placing dealer first so it is easier to identify who dealer
    // is in the class array. ALways index 0
    const players = [dealer, player]
    for (let i = 0; i <= numPlayers - 1; i++){
      players.push(BlackjackPlayer.createNewPlayer(false))
    }
    return players
  }

  nextPlayer(){
    if (this.cycle >= this.players.length){
      this.gameOver()
      return
    }
    // causes index to never start at 0 which is always the dealer
    this.cycle = this.cycle + 1

    // uses the same if statement but at this point the cycle has increase
    // therefore I slighlt different state is being checked. If greater than player.length at this 
    // it means it is the dealers turn
    if (this.cycle  >= this.players.length){
      this.currentPlayer = this.players[0]

    } else {
      this.currentPlayer = this.players[this.cycle]
    }
    
  }

}