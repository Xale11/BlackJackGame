import { BlackjackDeck } from "./BlackjackCards"
import { BlackjackPlayer } from "./BlackjackPlayer"

export class BlackJack {

  currentPlayer?: BlackjackPlayer
  deck: BlackjackDeck
  isGameOn: boolean
  players: BlackjackPlayer[]
  // tracks the number players who have played. if index == players.length, gameover and determine winners
  index: number = 0
  

  constructor(player: BlackjackPlayer, numPlayers?: number){
    this.players = this.generatePlayers(player, numPlayers ? numPlayers : 3)
    this.deck = new BlackjackDeck()
    this.isGameOn = false
    this.currentPlayer = undefined
  }

  startGame(){
    //shuffle deck
    this.deck.shuffle()
    // at the start of the game everyone recieves two cards
    for (const player of this.players){
      const cards = this.deck.giveCard(2)
      player.recieveCards(cards)
    }

    // sets current player
    this.nextPlayer()

    this.isGameOn = true
    
  }

  gameOver(){
    this.isGameOn = false
    const dealer = this.players[0]
    for (let i = 1; i < this.players.length; i++){
      const player = this.players[i]
      player.checkIfWinner(dealer)
    }
  }
  
  generatePlayers(player: BlackjackPlayer, numPlayers: number): BlackjackPlayer[]{
    const dealer = BlackjackPlayer.createNewPlayer(true)
    // placing dealer first so it is easier to identify who dealer
    // is in the class array. ALways index 0
    const players = [dealer, player]
    for (let i = 0; i < numPlayers - 1; i++){
      players.push(BlackjackPlayer.createNewPlayer(false, true))
    }
    return players
  }

  nextPlayer(){
    if (this.index >= this.players.length){
      this.gameOver()
      return
    }
    console.log(12, this.index)
    // causes index to never start at 0 which is always the dealer
    this.index = this.index + 1

    // uses the same if statement but at this point the index has increase
    // therefore I slighlt different state is being checked. If greater than player.length at this 
    // it means it is the dealers turn
    if (this.index  >= this.players.length){
      this.currentPlayer = this.players[0]

    } else {
      this.currentPlayer = this.players[this.index]
    }
    
  }

}