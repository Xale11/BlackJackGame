import { v4 as uuidv4 } from "uuid";
import { BlackjackDeck, BlackjackCard } from "./BlackjackCards";
import { probabilityOutput } from "../utils/probabilityHandling";

export class BlackjackPlayer {

  playerId: string
  isDealer: boolean;
  isAi: boolean;
  hand: BlackjackCard[] = [];
  possibleScores: number[] = [0];
  isWinner: boolean = false
  isDraw: boolean = false
  isBust: boolean = false;
  isFinished: boolean = false; // tracks when they have finished their turn
  name?: string | undefined;

  constructor(isDealer: boolean, name?: string, isAi?: boolean){
    this.playerId = uuidv4()
    this.isDealer = isDealer
    this.name = name
    this.isAi = isAi ? isAi : false
  }

  static createNewPlayer(isDealer: boolean, isAi?: boolean): BlackjackPlayer{
    return new BlackjackPlayer(isDealer, undefined, isAi)
  }


  endgameStatus = (): string => this.isDraw ? "Draw" : `${this.isWinner ? "Win" : "Lose"}`

  recieveCards(cards: BlackjackCard[]): void{
    for (const card of cards){
      this.hand.push(card)
      this.possibleScores = BlackjackPlayer.calculatePossibleScores(this.possibleScores, card.value)
      if (this.evaluate() == 21){
        this.isFinished = true
      }
    }
  }


  hit(deck: BlackjackDeck): void{
    const card = deck.giveCard()
    this.hand.push(card[0])
    this.possibleScores = BlackjackPlayer.calculatePossibleScores(this.possibleScores, card[0].value)
    if (this.evaluate() == 21){
      this.isFinished = true
    }
  }

  stand(): void{
    this.isFinished = true
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

  // if not isWinner will be set true if certain conditions are met mid game
  checkIfWinner(dealer: BlackjackPlayer) {
    // to check whether you a player has won, their needs to be a comparison with the dealer. Therefore, a check that a dealer is used in the comparison is needed
    if (!dealer.isDealer){
      console.log("This is not the dealer! Return will always be false")
      return "Not Dealer"
    }

    // finds your closest score to 21. Could be a valid or invalid score. Bust state is set within the evaluate() function
    const score = this.evaluate()

    if (dealer.evaluate() === score && score <= 21){
      // when score is equal natural blackjacks can determine a winner
      if (this.hasNaturalBlackjack() && dealer.hasNaturalBlackjack()){
        this.isDraw = true
        return "Draw"
      } else if (this.hasNaturalBlackjack()) {
        this.isWinner = true
        return "Win"
      } else if (dealer.hasNaturalBlackjack()) {
        return "Lose"
      } else {
        this.isDraw = true
        return "Draw"
      }
    } 
    // if you score equals 21 you win
    else if (score === 21) {
      this.isWinner = true
      return "Win"
    } 
    // higher score than dealer equals a win
    else if (dealer.evaluate() < 21 && dealer.evaluate() < score && score < 21){
      this.isWinner = true
      return "Win"
    } else if (dealer.evaluate() > 21 && score < 21 ){
      this.isWinner = true
      return "Win"
    }  else {
      return "Lose"
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
    return output.sort(function(a, b){return a-b});
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

  // can be used for AI or if timer is up
  automateNextPlay = (dealer: BlackjackPlayer) => {

    if (!dealer.isDealer){
      console.log("The player you are referencing is not the dealer")
      return
    }

    const upCard = dealer.hand[0].value[0] // dealer upcard
    const score = this.evaluate() // highest valid score
    let secondScoreOffset = 0 // lowest score needed when ace it present alter the decision/outcome made by the algorithm
   
    if (this.possibleScores.length >= 1 && score !== this.possibleScores[0]){ // need to check that are not multiple scores but only one is valid
      // ace is present in deck
      const lowestScore = this.possibleScores[0]
      if (lowestScore < 10){ // 10 or above would mean a blackjack or bust
        secondScoreOffset = (12 - lowestScore) / 2 // having an ace improves odds of winning and increase player confidence
      }
    }

    if (score < 12){
      return "hit"
    } else if (score >= 12 && score <= 14){

      const percentage = 85 // the probability as a percentage they will hit
      // I want the play to be slightly unpredictable to replicate possible things players will do
      // that why it's stochastic outcome instead deterministic

      if (probabilityOutput(percentage + secondScoreOffset)){
        return "hit"
      } else {
        return "stand"
      }

    } else if (score >= 15 && score <= 16){
      // After researching how to strategically play blackjack within this range, you play based on the dealers upcard to improve your odds of winning. This will make the AI slightly more competitive
      let percentage: number

      if (upCard >= 4 && upCard <= 6){
        // ~41% chance dealer will bust (best odds in this situation)
        percentage = 65
      } else {
        percentage = 45
      }

      if (probabilityOutput(percentage + secondScoreOffset)){
        return "hit"
      } else {
        return "stand"
      }

    } else {
      // for score 17, 18, 19, 20
      const percentage = 2 // it is a bad move to hit with hard scores close to 20
      const offset = (20 - score) * 2 // the further the away from 21 the score, the higher the higher chance a player may risk (still very low)
      // based on odds of busting from another hit & player behaviour
      if (probabilityOutput(percentage + offset + secondScoreOffset)){
        return "hit"
      } else {
        return "stand"
      }
    }
  }
 
}