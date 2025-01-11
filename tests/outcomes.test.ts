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

  it('should output win if dealer score is greater than 21 and player score is less than 22.', () => {

    dealer.possibleScores = [22]
    player.possibleScores = [20]
    expect(player.checkIfWinner(dealer)).toBe("Win")
    expect(player.isWinner).toBeTruthy()

    dealer.possibleScores = [24]
    player.possibleScores = [2]
    expect(player.checkIfWinner(dealer)).toBe("Win")
    expect(player.isWinner).toBeTruthy()

    dealer.possibleScores = [26]
    player.possibleScores = [21]
    expect(player.checkIfWinner(dealer)).toBe("Win")
    expect(player.isWinner).toBeTruthy()

  })

  it('should output win if dealer score is less than 21 and player score is less than 22 and greater than dealer score.', () => {

    dealer.possibleScores = [20]
    player.possibleScores = [21]
    expect(player.checkIfWinner(dealer)).toBe("Win")
    expect(player.isWinner).toBeTruthy()

    dealer.possibleScores = [13]
    player.possibleScores = [15]
    expect(player.checkIfWinner(dealer)).toBe("Win")
    expect(player.isWinner).toBeTruthy()

    dealer.possibleScores = [18]
    player.possibleScores = [19]
    expect(player.checkIfWinner(dealer)).toBe("Win")
    expect(player.isWinner).toBeTruthy()

  })

  it('should output lose if dealer score is less than 22 and player score is less than dealer score.', () => {

    dealer.possibleScores = [20]
    player.possibleScores = [19]
    expect(player.checkIfWinner(dealer)).toBe("Lose")

    dealer.possibleScores = [16]
    player.possibleScores = [15]
    expect(player.checkIfWinner(dealer)).toBe("Lose")

    dealer.possibleScores = [18]
    player.possibleScores = [15]
    expect(player.checkIfWinner(dealer)).toBe("Lose")

  })

  it('should output draw if isDraw .', () => {
    player.isDraw = true
    expect(player.endgameStatus()).toBe("Draw")
  })
})