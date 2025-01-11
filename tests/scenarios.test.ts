import { BlackjackCard } from '../src/classes/BlackjackCards';
import { BlackJack } from './../src/classes/BlackjackGame';
import { BlackjackPlayer } from './../src/classes/BlackjackPlayer';
import { it, expect, describe, beforeEach } from 'vitest'

describe("scenarios", () => {
  let user: BlackjackPlayer;
  let game: BlackJack;

  beforeEach(() => {
    user = new BlackjackPlayer(false, "Alex");
    game = new BlackJack(user);
    game.startGame();
  });

  it("should deal a player two cards as the opening hand", () => {
    for (const player of game.players){
      expect(player.hand.length).toBe(2)
    }
  })

  it("should deal a player another card and update their score when they hit assuming they have a valid hand", () => {
    const player = game.players[1] // the user I create manually in the beforeEach function

    const oldHand = [...player.hand] 
    const oldScore = player.possibleScores[0]

    player.hit(game.deck)
    
    const newHand = player.hand
    const newScore = player.possibleScores[0]

    expect(newHand.length > oldHand.length).toBeTruthy()
    expect(newScore > oldScore).toBeTruthy()

    // need to also check the hand doesn't totally change
    for (const card of oldHand){
      expect(newHand.includes(card)).toBeTruthy()
    }
  })

  it("should not deal a player another card and should evaluate their score when they stand assuming they have a valid hand", () => {
    // user.isFinished is boolean state that switches to true when a player stands or busts. This causes the score to be evaluted on the frontend UI
    const player = game.players[1] // the user I create manually in the beforeEach function

    const oldHand = [...player.hand] 
    const oldScore = player.possibleScores[0]

    player.stand()
    
    const newHand = player.hand
    const newScore = player.possibleScores[0]

    expect(newHand.length == oldHand.length).toBeTruthy()
    expect(newScore == oldScore).toBeTruthy()
    expect(player.isFinished).toBeTruthy()

    // need to also check the hand doesn't totally change
    for (const card of oldHand){
      expect(newHand.includes(card)).toBeTruthy()
    }
  })

  it("should state a player's hand as valid if they have an evaluated score less than or equal to 21", () => {
    // user.isBust is used to determine a valid hand. If user.isBust is false it is valid hand otherwise it is invalid
    const player = game.players[1]

    // list of hands and their possible scores.
    const validHandWithAce = [8, 18] // A, 7
    const validHandWithTwoAces = [12, 22] // A, A
    const validHandWithTens = [20] // e.g. J, Q or 10, K etc.
    const validHandWithAceAndMultipleCards = [14, 24] // A, 2, 3, 8
    const validHandWithScoreOf21 = [21] // 2 , 3, 4 , 5, 7

    // player.evaluate() calculates their evaluated score based on the possible scores of their hand
    // player.evaluate() also determine whether a player is bust or not aka a valid hand or not

    player.possibleScores = validHandWithAce
    expect(player.evaluate() <= 21 && !player.isBust).toBeTruthy()

    player.possibleScores = validHandWithTwoAces
    expect(player.evaluate() <= 21 && !player.isBust).toBeTruthy()

    player.possibleScores = validHandWithTens
    expect(player.evaluate() <= 21 && !player.isBust).toBeTruthy()

    player.possibleScores = validHandWithAceAndMultipleCards
    expect(player.evaluate() <= 21 && !player.isBust).toBeTruthy()

    player.possibleScores = validHandWithScoreOf21
    expect(player.evaluate() <= 21 && !player.isBust).toBeTruthy()
  })

  it("should state a player's hand as bust if they have an evaluated score greater than 21 after score is updated", () => {
    // user.isBust is used to determine a valid hand. If user.isBust is false it is valid hand otherwise it is invalid
    // a score is only updated after a hit
    const player = game.players[1]

    // list of hands and their possible scores.
    const validHandWithTens = [20] // e.g. J, Q or 10, K etc.
    const validHandWithScoreOf21 = [21] // 2 , 3, 4 , 5, 7

    // card will recieve on a hit
    const hitCard: BlackjackCard = {
      cardId: "hit-card-123",
      label: "5♥", 
      value: [5]
    }

    // player.evaluate() calculates their evaluated score based on the possible scores of their hand
    // player.evaluate() also determine whether a player is bust or not aka a valid hand or not

    player.isBust = false // reset state
    player.possibleScores = validHandWithTens
    player.recieveCards([hitCard]) // simulates hit - should bust!
    expect(player.evaluate() > 21 && player.isBust).toBeTruthy()

    player.isBust = false // reset state
    player.possibleScores = validHandWithScoreOf21
    player.recieveCards([hitCard]) // simulates hit - should bust!
    expect(player.evaluate() > 21 && player.isBust).toBeTruthy()
  })

  it("should evaulate a score of 21 when a player has been given a king and an ace", () => {
    const player = game.players[1]

    const king: BlackjackCard = {
      cardId: "king-123",
      label: "K♥",
      value: [10]
    }

    const ace: BlackjackCard = {
      cardId: "ace-123",
      label: "A♥",
      value: [1, 11]
    }

    player.hand = []
    player.possibleScores = [0]
    player.recieveCards([ace, king])
    expect(player.evaluate()).toBe(21)
    
  })

  it("should evaulate a score of 21 when a player has been given a king, queen, and an ace", () => {
    const player = game.players[1]

    const king: BlackjackCard = {
      cardId: "king-123",
      label: "K♥",
      value: [10]
    }

    const ace: BlackjackCard = {
      cardId: "ace-123",
      label: "A♥",
      value: [1, 11]
    }

    const queen: BlackjackCard = {
      cardId: "queen-123",
      label: "Q♥",
      value: [10]
    }

    player.hand = []
    player.possibleScores = [0]
    player.recieveCards([ace, king, queen])
    expect(player.evaluate()).toBe(21)
    
  })

  it("should evaulate a score of 21 when a player has been given a king, queen, and an ace", () => {
    const player = game.players[1]

    const king: BlackjackCard = {
      cardId: "king-123",
      label: "K♥",
      value: [10]
    }

    const ace: BlackjackCard = {
      cardId: "ace-123",
      label: "A♥",
      value: [1, 11]
    }

    const queen: BlackjackCard = {
      cardId: "queen-123",
      label: "Q♥",
      value: [10]
    }

    player.hand = []
    player.possibleScores = [0]
    player.recieveCards([ace, king, queen])
    expect(player.evaluate()).toBe(21)
    
  })

  it("should evaulate a score of 21 when a player has been given a nine, ace, and an another ace", () => {
    const player = game.players[1]

    const ace: BlackjackCard = {
      cardId: "ace-123",
      label: "A♥",
      value: [1, 11]
    }

    const nine: BlackjackCard = {
      cardId: "nine-123",
      label: "9♥",
      value: [9]
    }

    player.hand = []
    player.possibleScores = [0]
    player.recieveCards([ace, ace, nine])
    expect(player.evaluate()).toBe(21)
    
  })

})