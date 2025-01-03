import { Card } from "../types/types";
import { v4 as uuidv4 } from "uuid";

export class BlackjackCard implements Card {
  cardId: string;
  imageUrl?: string|undefined;
  value: number[];
  label: string = ""

  constructor(id: string, value: number[], imageUrl?: string){
    this.cardId = id
    this.value = value
    this.imageUrl = imageUrl
  }
}

export class BlackjackDeck {
  cards: Card[];
  validDeck: boolean

  constructor(cards?: Card[]){
    this.cards = cards ? cards : BlackjackDeck.generateDeckOf52()
    this.validDeck = this.isDeckValid()
  }
  

  isDeckValid(): boolean{
    const arrChecker: Card[] = [] // array use to identify if there are dupelicate cards
    for (const card of this.cards){
      if (arrChecker.includes(card)){
        this.validDeck = false
        return false
      }
      arrChecker.push(card)
    }
    this.validDeck = true
    return true
  }

  removeCard(removedCard: Card){
    this.cards = this.cards.filter((card) => card.cardId === removedCard.cardId)
  }

  giveCard(numCards?: number){
    const cardsGiven = numCards ?? 1
    const cardList: Card[] = []
    // Deck will already be shuffled
    // simulates picking the top card
    for (let i = 0; i <= cardsGiven; i++){
      const card = this.cards[this.cards.length - 1]
      this.removeCard(card)
      cardList.push(card)
    }
    
    return cardList
  }

  // useful for testing and could be need future rule variations
  recieveCard(card: Card){
    for (const item of this.cards){
      if (item.cardId === card.cardId){
        return false // false signifies failed operation
      }
    }
    this.cards.push(card)
    return true // successfull addition to deck
  }

  // shuffles the deck using math.random
  shuffle(){
    const shuffledDeck: Card[] = []
    const tempDeck = this.cards // will hold deck while shuffling is occuring
    for (let i = 0; i < this.cards.length; i++){
      const index = Math.floor(Math.random() * tempDeck.length)
      shuffledDeck.push(tempDeck[index]) // appended random chosen card to shuffled deck
      tempDeck.splice(index, 1); // remove from original deck
    }
    this.cards = shuffledDeck
  }

  static generateDeckOf52(){
    const deck: Card[] = [
      ...["♠", "♥", "♦", "♣"].flatMap(suit => [
        ...[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
          cardId: uuidv4(),
          label: `${num}${suit}`,
          value: [num],
          url: "",
        })),
        { cardId: uuidv4(), label: `J${suit}`, value: [10], url: "" },
        { cardId: uuidv4(), label: `Q${suit}`, value: [10], url: "" },
        { cardId: uuidv4(), label: `K${suit}`, value: [10], url: "" },
        { cardId: uuidv4(), label: `A${suit}`, value: [1, 11], url: "" },
      ])
    ];
    console.log(deck)
    return deck
  }

  showDeck(){
    console.log(this.cards)
    return this.cards
  }

}