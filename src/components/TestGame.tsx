import { BlackjackDeck } from '../utils/CardHandling'
import { BlackjackPlayer } from '../utils/PlayerHandling'

const TestGame = () => {
  console.log(BlackjackDeck.generateDeckOf52())
  console.log(BlackjackPlayer.calculatePossibleScores([1], [2]))
  return (
    <div>
      
    </div>
  )
}

export default TestGame
