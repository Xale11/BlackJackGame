export interface Card {
  cardId: string // makes a card unique. players cannot have dupe cards
  imageUrl?: string  // suits are irrelevant to the logic. Just need unique images with images of the suits
  value: number[] // after seeing how to calculate the total a number array is best   
  label: string
}

export interface Deck {
  cards: Card[]
}

export interface Player {
  playerId: string
  hand: Card[]
  hit: (deck: Deck) => void // takes in a deck and a hand and returns a new hand
  possibleScores: number[]
  stand?: () => void
  isBust: boolean
  calculatePossibleScores: () => void
  evaluate?: (hand: Card[]) => void
  name?: string
  isDealer: boolean
}

export interface Game {
  startGame: () => void
  isGameOn: boolean
  endGame: () => void
  generateDeck: () => void
  deck: Deck
  players: Player[]
  currentPlayer?: Player
  nextPlayer: () => void
  shuffle: (deck: Deck) => Deck
  shufflePlayers:(players: Player[]) => Player[]
  evaluatePlayers: () => void
  generatePlayers: (player: Player, numPlayers: number) => Player[]
}
