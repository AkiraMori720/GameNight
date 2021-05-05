import {PLAYER_FOUR, PLAYER_ONE, PLAYER_THREE, PLAYER_TWO, TEAM_ONE, TEAM_TWO} from '../constants/constants';
import {
    SET_PLAYER_FOUR_BID,
    SET_PLAYER_FOUR_NAME,
    SET_PLAYER_ONE_BID,
    SET_PLAYER_ONE_NAME,
    SET_PLAYER_THREE_BID,
    SET_PLAYER_THREE_NAME,
    SET_PLAYER_TWO_BID,
    SET_PLAYER_TWO_NAME
} from '../redux/action-types';
import {
    calculateNilScoreForPlayer,
    calculateTeamBags,
    calculateTeamScoreForBids,
    roundHasResults,
    teamHasBidBlindNil
} from '../constants/score-helpers';

export const setNameActionsEnum = {
    [PLAYER_FOUR]: SET_PLAYER_FOUR_NAME,
    [PLAYER_ONE]: SET_PLAYER_ONE_NAME,
    [PLAYER_THREE]: SET_PLAYER_THREE_NAME,
    [PLAYER_TWO]: SET_PLAYER_TWO_NAME
};

export const setBidsActionEnum = {
    [PLAYER_FOUR]: SET_PLAYER_FOUR_BID,
    [PLAYER_ONE]: SET_PLAYER_ONE_BID,
    [PLAYER_THREE]: SET_PLAYER_THREE_BID,
    [PLAYER_TWO]: SET_PLAYER_TWO_BID
};

export const getTeamTotalBids = (currRound, team) => {
    let teamTotalBids;

    if (team === TEAM_ONE) {
        teamTotalBids = Number(currRound.player1Bid) + Number(currRound.player2Bid);

        if (teamHasBidBlindNil(currRound, TEAM_ONE)) {
            teamTotalBids -= 100;
        }
    } else {
        teamTotalBids = Number(currRound.player3Bid) + Number(currRound.player4Bid);

        if (teamHasBidBlindNil(currRound, TEAM_TWO)) {
            teamTotalBids -= 100;
        }
    }

    return teamTotalBids;
};

export const addCurrRoundResults = (currRound, rounds) => [
    {
        ...rounds[0],
        playerFour: {
            ...rounds[0].playerFour,
            actual: Number(currRound.player4Bid)
        },
        playerOne: {
            ...rounds[0].playerOne,
            actual: Number(currRound.player1Bid)
        },
        playerThree: {
            ...rounds[0].playerThree,
            actual: Number(currRound.player3Bid)
        },
        playerTwo: {
            ...rounds[0].playerTwo,
            actual: Number(currRound.player2Bid)
        },
        team1Actual: getTeamTotalBids(currRound, TEAM_ONE),
        team2Actual: getTeamTotalBids(currRound, TEAM_TWO)
    },
    ...rounds.slice(1)
];

export const calculateScore = (rounds) => {
    let score1 = 0,
        score2 = 0,
        bags1 = 0,
        bags2 = 0;

    rounds.forEach((round) => {
        const {playerOne, playerTwo, playerThree, playerFour, team1Actual, team2Actual, team1Bids, team2Bids} = round;

        if (!roundHasResults(round)) {
            return;
        }

        score1 += calculateNilScoreForPlayer(playerOne);
        score1 += calculateNilScoreForPlayer(playerTwo);
        score2 += calculateNilScoreForPlayer(playerThree);
        score2 += calculateNilScoreForPlayer(playerFour);

        score1 += calculateTeamScoreForBids(team1Actual, team1Bids);
        score2 += calculateTeamScoreForBids(team2Actual, team2Bids);

        bags1 += calculateTeamBags(team1Actual, team1Bids);
        bags2 += calculateTeamBags(team2Actual, team2Bids);

        if (bags1 >= 10) {
            bags1 = bags1 - 10;
            score1 -= 100;
        }

        if (bags2 >= 10) {
            bags2 = bags2 - 10;
            score2 -= 100;
        }
    });

    return {
        bags1,
        bags2,
        score1,
        score2
    };
};
