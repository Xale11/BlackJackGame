import { v4 as uuidv4 } from "uuid";
import { BlackjackDeck, BlackjackCard } from "./CardHandling";

export class BlackjackPlayer {

  playerId: string
  isDealer: boolean;
  hand: BlackjackCard[] = [];
  possibleScores: number[] = [0];
  isWinner: boolean | undefined // if undefined it's a draw
  isBust: boolean = false;
  name?: string | undefined;

  constructor(isDealer: boolean, name?: string){
    this.playerId = uuidv4()
    this.isDealer = isDealer
    this.name = name
    this.isWinner = false
  }

  static createNewPlayer(isDealer: boolean): BlackjackPlayer{
    return new BlackjackPlayer(isDealer)
  }


  calculatePossibleScores(): void{
    return
  }

  recieveCards(cards: BlackjackCard[]): void{
    for (const card of cards){
      this.hand.push(card)
      this.possibleScores = BlackjackPlayer.calculatePossibleScores(this.possibleScores, card.value)
    }
  }


  hit(deck: BlackjackDeck): void{
    const card = deck.giveCard()
    this.hand.push(card[0])
    this.possibleScores = BlackjackPlayer.calculatePossibleScores(this.possibleScores, card[0].value)
  }

  stand(): void{
    return
  }

  evaluate(): number{
    // possibleScores is sorted in ascending order
    // filtering leaves close score to 21 at the last index
    const validScores = this.possibleScores.filter(score => score <= 21)

    // if there no valid scores below 22 then your final score will be greater than 21 and the closest score to 21 
    // isBust variable will be set to true
    if (validScores.length === 0){
      this.isBust = true
      this.isWinner = false
      return this.possibleScores[0]
    } else {
      return validScores[validScores.length - 1]
    }
  }

  // this call should only be called once a game is over
  // if not isWinner will be set true if certain conditions are met mid game
  // TODO: add another variable that take Game class and check for game state
  checkIfWinner(dealer: BlackjackPlayer): boolean | undefined {

    // to check whether you a player has won, their needs to be compares
    // with the dealer. Therefore, a check that a dealer is used in the comparison is needed
    if (!dealer.isDealer){
      console.log("This is not the dealer! Return will always be false")
      return false
    }

    // finds your closest score to 21. Could be a valid or invalid score
    // bust state is set within the evaluate() function
    const score = this.evaluate()

    if (dealer.evaluate() === score && score <= 21){
      // when score is equal natural blackjacks can determine a winner
      if (this.hasNaturalBlackjack() && dealer.hasNaturalBlackjack()){
        return false
      } else if (this.hasNaturalBlackjack()) {
        this.isWinner = true
        return true
      } else {
        this.isWinner = undefined
        return undefined
      }
    } 
    // if you score equals 21 you win
    else if (this.evaluate() === 21) {
      this.isWinner = true
      return true
    } 
    // higher score than dealer equals a win
    else if (dealer.evaluate() < this.evaluate() && this.evaluate() <= 21){
      this.isWinner = true
      return true
    } else {
      return false
    }

  }

  // Calculates possibles scores. When you have aces you can have more than one possible score
  static calculatePossibleScores(val1: number[], val2: number[]): number[]{
    const output: number[] = []

    // the 2 for loops interate through each possible addition pair
    for (const num1 of val1){
      for (const num2 of val2){
        const sum = num1 + num2
        // prevents duplicate sums from being in output
        if (!output.includes(sum)){
          output.push(sum)
        }
      }
    }
    // Sorting here makes it easier to evaluate final score at the end of the game
    // At evaluation you can filter values over 21 leaving you with closest value to 21 at the last index
    return output.sort()
  }

  hasNaturalBlackjack = (): boolean => {
    if (!this.possibleScores.includes(21)){
      return false
    }

    const cardValue = this.hand.map((card) => card.value)
    if (cardValue.includes([10]) && (cardValue.includes([1, 11]) || cardValue.includes([11, 1]))){
      return true
    } else {
      return false
    }
  }

  showHand(){
    return this.hand
  }
 
}