import React from 'react'
import OverlayText from '../OverlayText'

function OuterBox({ children }: { children: React.ReactNode }) {
  return (
    <OverlayText 
        width="30vw"
        height="20vh"
        bottom="6vh"
        left="4vw"
        typingSpeed={20}
        text='
        void deal() {
            cout << players[currentDealer]->get_name() << " " << "deals\n";
            vector<int> order = {3, 2, 3, 2, 2, 3, 2, 3};
            int playerCount = incrementPlayer(currentDealer);
            for (int i = 0; i < 8; i++) {
                for (int j = 0; j < order[i]; j++) {
                    players[playerCount]->add_card(pack.deal_one());
                }
                playerCount = incrementPlayer(playerCount);
            }

            upCard = pack.deal_one();
            cout << upCard << " turned up\n";
        };

        void scoreTricks (int teamOneTricksWon, int teamTwoTricksWon) {
            if (orderedUpTeam == 1) {
                if (teamOneTricksWon == 5) {
                    cout << players[0]->get_name() << " and " 
                    << players[2]->get_name() << " win the hand\n";
                    cout << "march!" << "\n";
                    teamOnePoints += 2;
                } else if (teamOneTricksWon >= 3) {
                    cout << players[0]->get_name() << " and " 
                    << players[2]->get_name() << " win the hand\n";
                    teamOnePoints += 1;
                } else {
                    cout << players[1]->get_name() << " and " 
                    << players[3]->get_name() << " win the hand\n";
                    cout << "euchred!" << "\n";
                    teamTwoPoints += 2;
                }
            }

            if (orderedUpTeam == 2) {
                if (teamTwoTricksWon == 5) {
                    cout << players[1]->get_name() << " and " 
                    << players[3]->get_name() << " win the hand\n";
                    cout << "march!" << "\n";
                    teamTwoPoints += 2;
                } else if (teamTwoTricksWon >= 3) {
                    cout << players[1]->get_name() << " and " 
                    << players[3]->get_name() << " win the hand\n";
                    teamTwoPoints += 1;
                } else {
                    cout << players[0]->get_name() << " and " 
                    << players[2]->get_name() << " win the hand\n";
                    cout << "euchred!" << "\n";
                    teamOnePoints += 2;
                }
            }
        }

        void playTrick () {
            assert(orderedUpTeam == 1 || orderedUpTeam == 2);

            int teamOneTricksWon = 0;
            int teamTwoTricksWon = 0;
            int playersTurn = incrementPlayer(currentDealer);

            for (int trick = 0; trick < 5; trick++) {
                vector<Card> playedCards;
                vector<int> cardsPlayers;
                Card ledCard = players[playersTurn]->lead_card(trump);
                playedCards.push_back(ledCard);
                cardsPlayers.push_back(playersTurn);
                cout << ledCard << " led by " << players[playersTurn]->get_name() << "\n";
                playersTurn = incrementPlayer(playersTurn);
                for (int i = 0; i < 3; i++) {
                    Card playedCard = players[playersTurn]->play_card(playedCards[0], trump);
                    playedCards.push_back(playedCard);
                    cardsPlayers.push_back(playersTurn);
                    cout << playedCard << " played by " << players[playersTurn]->get_name() << "\n";
                    playersTurn = incrementPlayer(playersTurn);
                }
                int winner = determineTrickWinner(playedCards, cardsPlayers);
                cout << players[winner]->get_name() << " takes the trick\n" << "\n";
                playersTurn = winner;
                if (winner % 2 == 0) {
                    teamOneTricksWon++;
                } else {
                    teamTwoTricksWon++;
                }
            }
            scoreTricks(teamOneTricksWon, teamTwoTricksWon);
        }'
      />
  )
}

export default OuterBox
