import { it, expect, describe, beforeEach } from "vitest"
import { BlackjackPlayer } from "../src/classes/BlackjackPlayer"

describe('Outcomes', () => {
  let player: BlackjackPlayer
  let dealer: BlackjackPlayer

  beforeEach(() => {
    player = new BlackjackPlayer(false, "Alex")
    dealer = new BlackjackPlayer(true, "Dealer")
  })

  it('should output draw if dealer score is equal to player score and both score under 22 (no ace in hands) .', () => {
    player.isDraw = true

    dealer.possibleScores = [20]
    player.possibleScores = [20]
    expect(player.checkIfWinner(dealer)).toBe("Draw")

    dealer.possibleScores = [2]
    player.possibleScores = [2]
    expect(player.checkIfWinner(dealer)).toBe("Draw")

    dealer.possibleScores = [21]
    player.possibleScores = [21]
    expect(player.checkIfWinner(dealer)).toBe("Draw")

    dealer.possibleScores = [45]
    player.possibleScores = [45]
    expect(player.checkIfWinner(dealer)).not.toBe("Draw")
  })

  it('should output draw if isDraw .', () => {
    player.isDraw = true
    expect(player.endgameStatus()).toBe("Draw")
  })
})