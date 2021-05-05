import {getTeamTotalBids} from '../services/score-service';

import {TEAM_ONE, TEAM_TWO} from './constants';

export const isBidBlindNil = (bid) => Number(bid) === 100;

export const isNil = (value) => Number(value) === 0;

export const teamOneHasBidBlindNil = (currRound) => isBidBlindNil(currRound.player1Bid) || isBidBlindNil(currRound.player2Bid);

export const teamTwoHasBidBlindNil = (currRound) => isBidBlindNil(currRound.player3Bid) || isBidBlindNil(currRound.player4Bid);

export const teamHasBidBlindNil = (currRound, team) =>
    team === TEAM_ONE && teamOneHasBidBlindNil(currRound) ||
    team === TEAM_TWO && teamTwoHasBidBlindNil(currRound);

export const bidsAddUpTo13 = (currRound) => getTeamTotalBids(currRound, TEAM_ONE) + getTeamTotalBids(currRound, TEAM_TWO) === 13;

export const roundHasResults = (round) => round.playerOne.actual !== null && round.playerOne.actual !== undefined;

export const getScoreForNil = (player) => isNil(player.actual) ? 100 : -100;

export const getScoreForBlindNil = (player) => isNil(player.actual) ? 200 : -200;

export const calculateNilScoreForPlayer = (player) => {
    if (isNil(player.bid)) {
        return getScoreForNil(player);
    }

    if (isBidBlindNil(player.bid)) {
        return getScoreForBlindNil(player);
    }

    return 0;
};

export const calculateTeamScoreForBids = (actual, bids) => {
    let score = 0;

    if (actual >= bids) {
        score += 10 * bids + (actual - bids);

        if (bids >= 10) {
            score += 100;
        }
    } else {
        score -= 10 * bids;

        if (bids >= 10) {
            score -= 100;
        }
    }

    return score;
};

export const calculateTeamBags = (actual, bids) => actual >= bids ? actual - bids : 0;
