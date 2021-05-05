import { PLAYER_FOUR, PLAYER_ONE, PLAYER_THREE, PLAYER_TWO, TEAM_ONE, TEAM_TWO } from '../constants/constants';

// export const shuffle = cards => {
//     for (let i = cards.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [cards[i], cards[j]] = [cards[j], cards[i]];
//     }
//     return cards;
// };

export const shuffle = (cards) => {
    let new_cards = cards
    let j, x, i;
    for (i = new_cards.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = new_cards[i];
        new_cards[i] = new_cards[j];
        new_cards[j] = x;
    }
    return new_cards
}
