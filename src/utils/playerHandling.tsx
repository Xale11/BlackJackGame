import { BlackjackPlayer } from "../classes/BlackjackPlayer";


// I made this function outside of the class because I wanted it to be exclusive seqeunce only the dealer could do.
export const dealerSequence = (dealer: BlackjackPlayer, soft17: boolean) => {
  // if soft17 is true, then dealer must on soft 17
  if (!dealer.isDealer){
    alert("not dealer")
    return
  }

  const score = dealer.evaluate() // could be a score score
  const hardScore: number = dealer.possibleScores[0] // always the hard score. needed if dealer must play on soft 17

  if (!soft17){
    if (score < 17){
      return "hit"
    } else {
      return "stand"
    }
  } else {
    if (hardScore < 17){
      return "hit"
    } else {
      return "stand"
    }
  }
}