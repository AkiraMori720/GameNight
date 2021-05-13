// import firebase from "react-native-firebase";
import firestore from "@react-native-firebase/firestore";
import * as CT from '../constants/cardKinds';
import database from "@react-native-firebase/database";

const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
}

class firebaseServices {
    setOverbookPenalty = (winScore) => {
        var penaltyScore = 0;
        switch (winScore) {
            case 70:
                penaltyScore = -40;
                break;
            case 100:
                penaltyScore = -50;
                break;
            case 130:
                penaltyScore = -60;
                break;
            case 150:
                penaltyScore = -50;
                break;
            case 200:
                penaltyScore = -60;
                break;
            case 250:
                penaltyScore = -70;
                break;
            default:
                penaltyScore = -40;
                break;
        }
        return penaltyScore;
    }

    getGameoverScore = (winningScore) => {
        switch (winningScore) {
            case 70:
                return -50;
            case 100:
                return -60;
            case 130:
                return -70;
            default:
                return -100;
        }
    }

    getGameCards = (gameStyle) => {
        switch (gameStyle) {
            case 0:
                return CT.cards_no_j2;
            case 1:
                return CT.cards_j2_d;
            case 2:
                return CT.cards_j2;
            default:
                return CT.cards_no_j2;
        }
    }

    shuffle = (cards) => {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    };

    setTeam = (players_num) => {
        if (players_num < 4)
            return false;
        let tm = [0, 1, 2, 3];
        let ranTeam = this.shuffle(tm);
        let teams = []
        teams.push({
            gameScore: 0,
            lostScore: 0,
            bagsTaken: 0,
            blind: 1,
            currentRoundBid: -1,
            currentRoundTricksTaken: 0,
            players: [ranTeam[0], ranTeam[1]]
        });
        teams.push({
            gameScore: 0,
            lostScore: 0,
            bagsTaken: 0,
            blind: 1,
            currentRoundBid: -1,
            currentRoundTricksTaken: 0,
            players: [ranTeam[2], ranTeam[3]]
        });
        return teams;
    }

    setTrickCard = (data, callback) => {
        firestore()
            .collection('rooms')
            .doc(data.roomid)
            .get()
            .then(snapshot => {
                let room = snapshot.data()
                let game = room.game
                const playerId = (game.turnIndex + game.leadIndex) % 4

                if (game.renig || data.playerId !== playerId) {
                    return;
                }

                let player = game.players[data.playerId];
                let card = player.cards[data.cardId];
                if (card.suit === 'S') {
                    game.isSpadesBroken = true;
                }

                if (game.trickCards.length !== 0) {
                    var leadCard = game.trickCards[0];
                    if (card.suit !== leadCard.suit) {
                        //modify to Prevent to place the card in another suit  when exist the card in same kind suit
                        if(player.cards.findIndex(obj => obj.suit === leadCard.suit) > -1) return;  
                              
                        player.isShownVoidInSuit[leadCard.suitInt] = true;
                    }
                }

                game.cardsPlayedThisRound.push(card);

                player.cards.splice(player.cards.indexOf(card), 1);
                game.trickCards.push(card);
                game.turnIndex++
                if ((game.turnIndex % 4) === 0) {
                    game.currentMoveStage = 'trickFinished';
                    this.updateGame(data.roomid, game, (res) => {
                        if (res.isSuccess) {                            
                            callback && callback(res)
                            game.currentMoveStage = 'trickResult';
                            this.evalutionTricks(game);
                            setTimeout(() => {
                                this.updateGame(data.roomid, game, (res) => {
                                    if (game.renig === 0) {
                                        console.log('gameNextTrick', data.roomid, game);
                                        if ((game.turnIndex / 4) === 13) {
                                            setTimeout(() => {
                                                this.finishRound(data.roomid, callback);
                                            }, 2000);
                                        }
                                        else {
                                            setTimeout(() => {
                                                game.trickCards = [];
                                                game.currentMoveStage = 'ChoosingTrickCard';
                                                this.updateGame(data.roomid, game, callback)
                                            }, 2000);
                                        }
                                    }
                                })
                            }, 1000);
                        }
                    })
                }
                else {
                    game.currentMoveStage = 'ChoosingTrickCard';
                    this.updateGame(data.roomid, game, callback)
                }
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }

    evalutionTricks = (game) => {
        var trickResult = {};
        let roundBook = {
            leadIndex: game.leadIndex,
            checked: 0,
            renigIndexs: [],
            trickCards: []
        }
        roundBook.trickCards = [...game.trickCards]
        var leadCard = game.trickCards[0];
        trickResult.highestCard = game.trickCards[0];
        trickResult.trickTaker = game.players[game.leadIndex];
        for (var i = 1; i < game.trickCards.length; i++) {
            var card = game.trickCards[i];
            let player = game.players[(game.leadIndex + i) % 4]
            if (card.suit !== leadCard.suit) {
                if (player.cards.findIndex((card) => card.suit === leadCard.suit) >= 0) {
                    roundBook.renigIndexs.push(player.playerPosition)
                }
            }
            if ((card.suit === trickResult.highestCard.suit && card.value > trickResult.highestCard.value) ||
                (card.suit === 'S' && trickResult.highestCard.suit !== 'S')) {
                trickResult.highestCard = card;
                trickResult.trickTaker = player;
            }
        }
        game.leadIndex = trickResult.trickTaker.playerPosition;
        game.players[game.leadIndex].currentRoundTricksTaken += 1;
        game.roundBooks.push(roundBook)
        console.log('leadIndex: ', game.leadIndex)
        console.log('roundBook: ', roundBook)
    }

    calculateScore = (game) => {
        var maxScore = 0;
        var minScore = 0;
        var aRoundScores = {};
        for (var i = 0; i < 4; i++) {
            var player = game.players[i];

            var score = 0;
            var bagsTaken = 0;
            if (player.currentRoundBid == 0) {
                if (player.currentRoundTricksTaken == 0) {
                    score = 50;
                } else {
                    score = -50 + player.currentRoundTricksTaken;
                }
            } else if (player.currentRoundTricksTaken < player.currentRoundBid) {
                score = -10 * player.currentRoundBid;
            } else {
                bagsTaken = player.currentRoundTricksTaken - player.currentRoundBid;
                score = player.currentRoundBid * 10 + bagsTaken;
            }

            player.bagsTaken += bagsTaken;
            if (player.bagsTaken >= 10) {
                score -= game.penaltyScore;
                player.bagsTaken -= 10;
            }
            aRoundScores[i] = score;
            player.gameScore += score;
            if (maxScore < player.gameScore) {
                maxScore = player.gameScore;
            }
            if (minScore > player.gameScore) {
                minScore = player.gameScore;
            }
        }

        game.roundScores.push(aRoundScores);

        return [maxScore, minScore];
    }

    calculateTeamScore = (game) => {
        var topScore = 0;
        var aRoundTeamScores = [];
        for (var i = 0; i < game.teams.length; i++) {
            let team = game.teams[i];
            const player0 = team.players[0];
            const player1 = team.players[1];
            team.currentRoundTricksTaken += game.players[player0].currentRoundTricksTaken + game.players[player1].currentRoundTricksTaken;

            var score = 0;
            var bagsTaken = 0;
            if (team.currentRoundBid == 0) {
                if (team.currentRoundTricksTaken == 0) {
                    score = 50;
                } else {
                    score = -50 + team.currentRoundTricksTaken;
                }
            } else if (team.currentRoundBid == 10) {
                if (team.currentRoundTricksTaken < team.currentRoundBid) {
                    score = -10 * team.currentRoundBid;
                } else {
                    bagsTaken = team.currentRoundTricksTaken - team.currentRoundBid;
                    score = team.currentRoundBid * 10 * 2 + bagsTaken;
                }
            } else if (team.currentRoundTricksTaken < team.currentRoundBid) {
                score = -10 * team.currentRoundBid;
            } else {
                bagsTaken = team.currentRoundTricksTaken - team.currentRoundBid;
                score = team.currentRoundBid * team.blind * 10 + bagsTaken;
            }

            team.bagsTaken += bagsTaken;
            if (team.bagsTaken >= 10) {
                score -= game.penaltyScore;
                team.bagsTaken -= 10;
            }

            aRoundTeamScores.push(score);
            team.gameScore += score;

            if (score < 0) {
                team.lostScore += score;
            }

            if (topScore < team.gameScore) {
                topScore = team.gameScore;
            }
        }

        game.roundTeamScores.push(aRoundTeamScores);

        return topScore;
    }
    // add 
    addRoom = (room, callback = null) => {
        firestore()
            .collection('rooms')
            .add(room)
            .then((response) => {
                callback && callback({ isSuccess: true, response: { roomid: response.id }, message: null });
                console.log('Room created!', response);
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }

    updateRoom = (roomid, room, callback = null) => {
        firestore()
            .collection('rooms')
            .doc(roomid)
            .update(room)
            .then(response => {
                callback && callback({ isSuccess: true, response: { roomid: roomid }, message: null });
                console.log('User added!');
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }
    


    createPrivateGame = (data, callback = null) => {
        let room = {
            name: 'room name',
            started: false,
            waiting: true,
            private: true,
            players_num: 1,
            game: {
                gameType: data.type,
                gameStyle: data.style,
                gameLobby: data.lobby,
                winningScore: data.winningScore,
                penaltyScore: this.setOverbookPenalty(data.winningScore),
                cardsPlayedThisRound: [],
                trickCards: [],
                roundBooks: [],
                roundNumber: 0,
                dealerIndex: 0,
                leadIndex: 0,
                turnIndex: 0,
                isSpadesBroken: false,
                currentMoveStage: 'None',
                roundScores: [],
                roundTeamScores: [],
                players: [],
                teams: [],
                bidding: 0,
                renig: 0,
                renigResult: null
            }
        }
        let player = {
            username: data.username,
            userid: data.userid,
            playerPosition: 0,
            cards: [],
            currentRoundBid: -1,
            currentRoundTricksTaken: 0,
            bagsTaken: 0,
            gameScore: 0,
            isShownVoidInSuit: [false, false, false, false],
            config: data.config
        }
        room.game.players.push(player);
        firestore()
            .collection('rooms')
            .add(room)
            .then((response) => {
                callback && callback({ isSuccess: true, response: { roomid: response.id }, message: null });
                console.log('Room created!', response);
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }
    /*
    joinPrivateGame = (data, callback) => {
        firestore()
            .collection('rooms')
            .doc(data.roomid)
            .get()
            .then(snapshot => {
                let room = snapshot.data()
                let game = room.game
                if (game.players.length < 4) {
                    let player = {
                        username: data.username,
                        userid: data.userid,
                        playerPosition: 0,
                        cards: [],
                        currentRoundBid: -1,
                        currentRoundTricksTaken: 0,
                        bagsTaken: 0,
                        gameScore: 0,
                        isShownVoidInSuit: [false, false, false, false]
                    }
                    room.game.players.push(player)
                    if (room.game.players.length === 4) {
                        room.waiting = false;
                        room.started = true;

                        if (game.gameType === 'partner') {
                            room.game.teams = this.setTeam(room.game.players.length)
                        }
                        this.initGameForRound(room.game)
                    }
                    firestore()
                        .collection('rooms')
                        .doc(data.roomid)
                        .update({
                            waiting: room.waiting,
                            started: room.started,
                            game: room.game
                        })
                        .then(response => {
                            callback && callback({ isSuccess: true, response: response, message: null });
                            console.log('User added!');
                        })
                        .catch(error => {
                            callback && callback({ isSuccess: false, response: null, message: error });
                            console.error(error)
                        })
                }
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }   */
    getOnlinePlayers = async(roomId, players) => {
        return await asyncFilter(players,
            (async p => {
                const reference = database().ref(`/online/${roomId}/${p.userid}`);
                console.log(`Room: ${roomId} Player: ${p.userid} Presence:`, reference);
                if(reference){
                    const presence = await reference.once('value');
                    return presence.val();
                }
                return false;
            })
        );
    }
    joinPrivateGame = (data, callback = null) => {
        firestore()
            .collection('rooms')
            .doc(data.roomid)
            .get()
            .then(async (snapshot) => {
                let room = snapshot.data()
                let game = room.game
                if (game.players.length < 4) {
                    let player = {
                        username: data.username,
                        userid: data.userid,
                        playerPosition: 0,
                        cards: [],
                        currentRoundBid: -1,
                        currentRoundTricksTaken: 0,
                        bagsTaken: 0,
                        gameScore: 0,
                        isShownVoidInSuit: [false, false, false, false],
                        config: data.config
                    }

                    room.game.players = await this.getOnlinePlayers(data.roomid, room.game.players);

                    room.game.players.push(player)
                    if (room.game.players.length === 4) {
                        room.waiting = false;
                        room.started = true;
                        
                        if(game.gameType === 'partner') {
                            room.game.teams = this.setTeam(room.game.players.length)
                        }
                        this.initGameForRound(room.game)
                    }

                    console.log('Game Room', room);
					// TODO change
                    this.updateRoom(data.roomid, room, callback)
                }
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }
    /*
    joinGame = (data, callback) => {
        firestore()
            .collection('rooms')
            .get()
            .then(querySnapshot => {
                console.log('Total rooms: ', querySnapshot.size);
                debugger;
                let fJoined = false;
                querySnapshot.forEach(documentSnapshot => {
                    let room = documentSnapshot.data()
                    if (!room.started && !room.private) {
                        if (room.game.gameType === data.gameType &&
                            room.game.gameStyle === data.gameStyle &&
                            room.game.gameLobby === data.gameLobby &&
                            room.game.winningScore === data.winningScore) {
                            if (room.game.players.length < 4) {
                                let player = {
                                    name: data.name,
                                    playerPosition: 0,
                                    cards: [],
                                    currentRoundBid: -1,
                                    currentRoundTricksTaken: 0,
                                    bagsTaken: 0,
                                    gameScore: 0,
                                    isShownVoidInSuit: [false, false, false, false]
                                }
                                room.game.players.push(player)
                                if (room.game.players.length === 4) {
                                    room.waiting = false;
                                    room.started = true;
                                    if (game.gameType === 'partner') {
                                        room.game.teams = this.setTeam(room.game.players.length)
                                    }
                                    this.initGameForRound(room.game)
                                }
                                firestore()
                                    .collection('rooms')
                                    .doc(`${documentSnapshot.id}`)
                                    .update({
                                        waiting: room.waiting,
                                        started: room.started,
                                        game: room.game
                                    })
                                    .then(response => {
                                        callback && callback({ isSuccess: true, response: response, message: null });
                                        console.log('User added!');
                                    })
                                    .catch(error => {
                                        callback && callback({ isSuccess: false, response: null, message: error });
                                        console.error(error)
                                    })
                                fJoined = true;
                                Break;

                            }
                        }
                    }
                });
                if (!fJoined) {
                    let room = {
                        name: 'room name',
                        started: false,
                        waiting: true,
                        private: false,
                        players_num: 1,
                        game: {
                            gameType: data.type,
                            gameStyle: data.style,
                            gameLobby: data.lobby,
                            winningScore: data.winningScore,
                            penaltyScore: this.setOverbookPenalty(data.winningScore),
                            cardsPlayedThisRound: [],
                            trickCards: [],
                            roundBooks: [],
                            roundNumber: 0,
                            dealerIndex: 0,
                            leadIndex: 0,
                            turnIndex: 0,
                            isSpadesBroken: false,
                            currentMoveStage: 'None',
                            roundScores: [],
                            roundTeamScores: [],
                            players: [],
                            teams: [],
                            bidding: 0,
                            renig: 0,
                            renigResult: null
                        }
                    }
                    let player = {
                        name: data.name,
                        playerPosition: 0,
                        cards: [],
                        currentRoundBid: -1,
                        currentRoundTricksTaken: 0,
                        bagsTaken: 0,
                        gameScore: 0,
                        isShownVoidInSuit: [false, false, false, false]
                    }
                    room.game.players.push(player);
                    firestore()
                        .collection('rooms')
                        .add(room)
                        .then((response) => {
                            debugger;
                            callback && callback({ isSuccess: true, response: response, message: null });
                            console.log('Room created!', response);
                        })
                        .catch(error => {
                            debugger;
                            callback && callback({ isSuccess: false, response: null, message: error });
                            console.error(error)
                        })
                }
            });
    }
    */
   joinGame = (data, callback = null) => {
        firestore()
        .collection('rooms')
        .get()
        .then(async querySnapshot => {
            console.log('Total rooms: ', querySnapshot.size);
            let fJoined = false;
            await Promise.all(querySnapshot.docs.map(async documentSnapshot => {
                let room = documentSnapshot.data()
                if (!room.started && !room.private) {
                    if (room.game.gameType === data.gameType &&
                        room.game.gameStyle === data.gameStyle &&
                        room.game.gameLobby === data.gameLobby &&
                        room.game.winningScore === data.winningScore) {

                        // Filter Online Users
                        room.game.players = await this.getOnlinePlayers(documentSnapshot.id, room.game.players);

                        console.log('Rooms Users: ', room.game.players.length);

                        if (room.game.players.length < 4) {
                            let player = {
                                username: data.username,
                                userid: data.userid,
                                playerPosition: room.game.players.length,
                                cards: [],
                                currentRoundBid: -1,
                                currentRoundTricksTaken: 0,
                                bagsTaken: 0,
                                gameScore: 0,
                                isShownVoidInSuit: [false, false, false, false],
                                config: data.config
                            }

                            room.game.players.push(player)
                            room.players_num = room.game.players.length;
                            if (room.players_num === 4) {
                                room.waiting = false;
                                room.started = true;
                                if(room.game.gameType === 'partner') {
                                    room.game.teams = this.setTeam(room.game.players.length)
                                }
                                this.initGameForRound(room.game)
                            }

                            console.log('Game Room', room);
                            // TODO change
                            this.updateRoom(documentSnapshot.id, room, callback)
                            fJoined = true;
                        }
                    }
                }
            }));
            if (!fJoined) {
                let room = {
                    name: 'room name',
                    started: false,
                    waiting: true,
                    private: false,
                    players_num: 1,
                    game: {
                        gameType: data.gameType,
                        gameStyle: data.gameStyle,
                        gameLobby: data.gameLobby,
                        winningScore: data.winningScore,
                        penaltyScore: this.setOverbookPenalty(data.winningScore),
                        cardsPlayedThisRound: [],
                        trickCards: [],
                        roundBooks: [],
                        roundNumber: 0,
                        dealerIndex: 0,
                        leadIndex: 0,
                        turnIndex: 0,
                        isSpadesBroken: false,
                        currentMoveStage: 'None',
                        roundScores: [],
                        roundTeamScores: [],
                        players: [],
                        teams: [],
                        bidding: 0,
                        renig: 0
                    }
                }
                let player = {
                    userid: data.userid,
                    username: data.username,
                    playerPosition: 0,
                    cards: [],
                    currentRoundBid: -1,
                    currentRoundTricksTaken: 0,
                    bagsTaken: 0,
                    gameScore: 0,
                    isShownVoidInSuit: [false, false, false, false],
                    config: data.config
                }
                room.game.players.push(player);
                // TODO change
                this.addRoom(room, callback)
            }
        });
    }

    restartGame = (roomid, callback = null) => {
        firestore()
            .collection('rooms')
            .doc(roomid)
            .get()
            .then(snapshot => {
                let room = snapshot.data()
                let game = room.game
                game.trickCards = [];
                game.roundBooks = [];
                game.roundScores = [];
                game.roundTeamScores = [];
                game.cardsPlayedThisRound = [];
                game.roundNumber = 0;
                game.dealerIndex = 0;
                game.leadIndex = 0;
                game.turnIndex = 0;
                game.isSpadesBroken = false;
                game.bidding = 0;
                game.renig = 0;
                game.renigResult = null;
                game.currentMoveStage = 'None';
                for (var i = 0; i < game.players.length; i++) {
                    game.players[i].cards = [];
                    game.players[i].gameScore = 0;
                    game.players[i].bagsTaken = 0;
                    game.players[i].currentRoundBid = -1;
                    game.players[i].currentRoundTricksTaken = 0;
                    game.players[i].isShownVoidInSuit = [false, false, false, false];
                }
                for (var i = 0; i < game.teams.length; i++) {
                    game.teams[i].gameScore = 0;
                    game.teams[i].lostScore = 0;
                    game.teams[i].bagsTaken = 0;
                    game.teams[i].blind = 1;
                    game.teams[i].currentRoundBid = -1;
                    game.teams[i].currentRoundTricksTaken = 0;
                }
                this.updateGame(roomid, game, callback)
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }

    initGameForRound = (game) => {
        game.roundNumber = game.roundNumber + 1;
        game.trickCards = [];
        game.roundBooks = [];
        for (var i = 0; i < game.players.length; i++) {
            game.players[i].cards = [];
            game.players[i].currentRoundBid = -1;
            game.players[i].currentRoundTricksTaken = 0;
            game.players[i].isShownVoidInSuit = [false, false, false, false];
        }
        for (var i = 0; i < game.teams.length; i++) {
            game.teams[i].blind = 1;
            game.teams[i].currentRoundBid = -1;
            game.teams[i].currentRoundTricksTaken = 0;
        }

        // Deal cards for round
        game.leadIndex = game.dealerIndex
        game.turnIndex = 0;
        game.bidding = 0;
        game.renig = 0;
        game.renigResult = null;
        game.isSpadesBroken = false;
        game.cardsPlayedThisRound = [];
        game.currentMoveStage = 'None';
        const gamecards = this.getGameCards(game.gameStyle);
        let cards = this.shuffle(gamecards);
        let deckTopIndex = cards.length - 1;
        for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 4; j++) {
                game.players[j].cards.push(cards[deckTopIndex]);
                deckTopIndex = deckTopIndex - 1;
            }
        }

        // Sort the players hand
        for (var j = 0; j < 4; j++) {
            game.players[j].cards.sort((a, b) => {
                if (a.suit !== b.suit) {
                    return a.suitInt - b.suitInt;
                } else {
                    return a.value - b.value;
                }
            });
        }
    }

    // initGameForRound = (roomid, callback) => {
    //     firestore()
    //         .collection('rooms')
    //         .doc(roomid)
    //         .get()
    //         .then(snapshot => {
    //             let room = snapshot.data()
    //             let game = room.game
    //             game.roundNumber = game.roundNumber + 1;
    //             game.trickCards = [];
    //             game.roundBooks = [];
    //             for (var i = 0; i < game.players.length; i++) {
    //                 game.players[i].cards = [];
    //                 game.players[i].currentRoundBid = -1;
    //                 game.players[i].currentRoundTricksTaken = 0;
    //                 game.players[i].isShownVoidInSuit = [false, false, false, false];
    //             }
    //             for (var i = 0; i < game.teams.length; i++) {
    //                 game.teams[i].blind = 1;
    //                 game.teams[i].currentRoundBid = -1;
    //                 game.teams[i].currentRoundTricksTaken = 0;
    //             }

    //             // Deal cards for round
    //             game.leadIndex = game.dealerIndex
    //             game.turnIndex = 0;
    //             game.bidding = 0;
    //             game.renig = 0;
    //             game.isSpadesBroken = false;
    //             game.cardsPlayedThisRound = [];
    //             game.currentMoveStage = 'None';
    //             const gamecards = this.getGameCards(game.gameStyle);
    //             let cards = this.shuffle(gamecards);
    //             let deckTopIndex = cards.length - 1;
    //             for (var i = 0; i < 13; i++) {
    //                 for (var j = 0; j < 4; j++) {
    //                     game.players[j].cards.push(cards[deckTopIndex]);
    //                     deckTopIndex = deckTopIndex - 1;
    //                 }
    //             }

    //             // Sort the players hand
    //             for (var j = 0; j < 4; j++) {
    //                 game.players[j].cards.sort((a, b) => {
    //                     if (a.suit != b.suit) {
    //                         return a.suitInt - b.suitInt;
    //                     } else {
    //                         return a.value - b.value;
    //                     }
    //                 });
    //             }
    //             this.updateGame(roomid, game, callback)
    //         })
    //         .catch(error => {
    //             callback && callback({ isSuccess: false, response: null, message: error });
    //             console.error(error)
    //         })
    // }

    setBid = (data, callback = null) => {
        firestore()
            .collection('rooms')
            .doc(data.roomid)
            .get()
            .then(snapshot => {
                let room = snapshot.data()
                let game = room.game
                game.players[data.playerId].currentRoundBid = parseInt(data.bid);
                game.turnIndex++;
                if (game.gameType === 'partner') {
                    for (var i = 0; i < game.teams.length; i++) {
                        if (game.teams[i].blind === 1) {
                            const player0 = game.teams[i].players[0];
                            const player1 = game.teams[i].players[1];
                            game.teams[i].currentRoundBid = game.players[player0].currentRoundBid + game.players[player1].currentRoundBid;
                        }
                    }
                }

                game.currentMoveStage = 'SettingBid';
                if (game.turnIndex === 4) {
                    game.turnIndex = 0;
                    game.currentMoveStage = 'ChoosingTrickCard';
                }
                
                // this.sendToAll('updatedGame', this.game);
                this.updateGame(data.roomid, game, callback)
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }

    setBlindBid = (data, callback = null) => {
        firestore()
            .collection('rooms')
            .doc(data.roomid)
            .get()
            .then(snapshot => {
                let room = snapshot.data()
                let game = room.game
                game.players[data.playerId].currentRoundBid = parseInt(data.bid);
                game.teams[data.teamId].blind = 2;
                game.teams[data.teamId].currentRoundBid = parseInt(data.bid);
                game.currentMoveStage = 'SettingBlindBid';
                game.bidding--;
                // if (game.bidding === 0) {
                //     this.sendToAll('start', this.game);
                // }
                this.updateGame(data.roomid, game, callback)
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }

    findRenig = (roomid, callback = null) => {
        firestore()
            .collection('rooms')
            .doc(roomid)
            .get()
            .then(snapshot => {
                let room = snapshot.data()
                let game = room.game
                firestore()
                    .collection('rooms')
                    .doc(roomid)
                    .update({
                        'game.renig': game.renig + 1
                    })
                    .then(response => {
                        callback && callback({ isSuccess: true, response: response, message: null });
                        console.log('updated the game info!');
                    })
                    .catch(error => {
                        callback && callback({ isSuccess: false, response: null, message: error });
                        console.error(error)
                    })
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }

    blindBid = (roomid, callback = null) => {
        firestore()
            .collection('rooms')
            .doc(roomid)
            .get()
            .then(snapshot => {
                let room = snapshot.data()
                let game = room.game
                firestore()
                    .collection('rooms')
                    .doc(roomid)
                    .update({
                        'game.bidding': game.bidding + 1
                    })
                    .then(response => {
                        callback && callback({ isSuccess: true, response: response, message: null });
                        console.log('updated the game info!');
                    })
                    .catch(error => {
                        callback && callback({ isSuccess: false, response: null, message: error });
                        console.error(error)
                    })
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }

    updateGame = (roomid, game, callback = null) => {
        firestore()
            .collection('rooms')
            .doc(roomid)
            .update({
                'game': game
            })
            .then(response => {
                callback && callback({ isSuccess: true, response: response, message: null });
                console.log('updated the game info!');
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }

    renigGame = (data, callback = null) => {
        firestore()
            .collection('rooms')
            .doc(data.roomid)
            .get()
            .then(snapshot => {
                let room = snapshot.data()
                let game = room.game
                var renigPlayer = (data.finderId + 1) % 4;
                const renigTeam = (data.teamId + 1) % 2;
                data.renigBook.checked = 1;
                const book = data.renigBook;
                var fRenig = false;
                if (book.renigIndexs.length > 0) {
                    if (game.gameType === 'solo') {
                        if (book.renigIndexs.findIndex(id => id === renigPlayer) >= 0) {
                            fRenig = true;
                            game.players[renigPlayer].currentRoundTricksTaken -= 1;
                            game.players[data.finderId].currentRoundTricksTaken += 1;
                        }
                        else {
                            game.players[renigPlayer].currentRoundTricksTaken += 1;
                            game.players[data.finderId].currentRoundTricksTaken -= 1;
                        }
                    }
                    else {
                        for (var i = 0; i < 2; i++) {
                            if (book.renigIndexs.findIndex(id => id === game.teams[renigTeam].players[i]) >= 0) {
                                renigPlayer = game.teams[renigTeam].players[i];
                                fRenig = true;
                                break;
                            }
                        }
                        if (fRenig) {
                            game.teams[renigTeam].currentRoundTricksTaken -= 3;
                            game.teams[data.teamId].currentRoundTricksTaken += 3;
                        }
                        else {
                            game.teams[renigTeam].currentRoundTricksTaken += 3;
                            game.teams[data.teamId].currentRoundTricksTaken -= 3;
                        }
                    }
                }
                else {
                    if (game.gameType === 'solo') {
                        game.players[renigPlayer].currentRoundTricksTaken += 1;
                        game.players[data.finderId].currentRoundTricksTaken -= 1;
                    }
                    else {
                        game.teams[renigTeam].currentRoundTricksTaken += 3;
                        game.teams[data.teamId].currentRoundTricksTaken -= 3;
                    }
                }
                game.renigResult = {
                    renig: fRenig,
                    book,
                    finderId: data.finderId,
                    teamId: data.teamId,
                    renigId: renigPlayer,
                    renigTeam
                };
                game.currentMoveStage = 'renigResult';
                // this.sendToAll('renigResult', result);
                this.updateGame(data.roomid, game, (res) => {
                    if (res.isSuccess) {
                        game.renig--;
                        if (game.renig === 0) {
                            if ((game.turnIndex / 4) === 13) {
                                setTimeout(() => {
                                    this.finishRound(data.roomid, callback);
                                }, 3000);
                            }
                            else if ((game.turnIndex % 4) === 0) {
                                setTimeout(() => {
                                    game.trickCards = [];
                                    game.currentMoveStage = 'ChoosingTrickCard';
                                    this.updateGame(data.roomid, game, callback)
                                }, 3000);
                            }
                        }
                    }
                })
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }

    finishRound = (roomid, callback = null) => {
        firestore()
            .collection('rooms')
            .doc(roomid)
            .get()
            .then(snapshot => {
                let room = snapshot.data()
                let game = Object.assign({}, room.game);
                var maxScore = 0;
                var minScore = 0;
                console.log('Finish Round', roomid, game);
                if (game.gameType === 'partner') {
                    maxScore = this.calculateTeamScore(game);
                }
                else {
                    [maxScore, minScore] = this.calculateScore(game);
                }

                if (maxScore >= game.winningScore) {
                    console.log('GameOver MaxScore', roomid, game);
                    game.currentMoveStage = 'gameOver';
                    this.updateGame(roomid, game, callback);
                }
                else if (game.gameType === 'solo' && minScore <= this.getGameoverScore(game.winningScore)) {
                    console.log('GameOver MinScore', roomid, game);
                    game.currentMoveStage = 'gameOver';
                    this.updateGame(roomid, game, callback);
                }
                else {
                    game.dealerIndex = (game.dealerIndex + 1) % 4;
                    this.initGameForRound(game);
                    game.currentMoveStage = 'finishRound';
                    console.log('Next Round Game: Stage => finishRound: ', roomid, game);
                    this.updateGame(roomid, game, (res) => {
                        if (res.isSuccess) {
                            game.currentMoveStage = 'None';
                            setTimeout(() => {
                                if (game.bidding === 0) {
                                    console.log('Next Round Game: Stage => None: ', roomid, game);
                                    this.updateGame(roomid, game, callback);
                                }
                            }, 2000);
                        }
                    });
                }
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }

    removePlayer = (roomid, userid) => {
        firestore()
            .collection('rooms')
            .doc(roomid)
            .get()
            .then(snapshot => {
                let room = snapshot.data()
                let game = room.game
                // Remove player.
                game.players.splice(game.players.findIndex((x) => x.userid === userid), 1);
                // this.sendToAll('exitPlayer', name);
                console.log(`Player ${userid} disconnected.`);

                // If there is not enough people to join.
                if (game.players.length === 0) {
                    console.log('Room is empty. Resetting.');
                    this.deleteRoom(roomid)
                }
                else {
                    firestore()
                        .collection('rooms')
                        .doc(roomid)
                        .update({
                            started: false,
                            waiting: true,
                            game: game
                        })
                        .then(response => {
                            this.restartGame(roomid);
                        })
                        .catch(error => {
                            console.error(error)
                        })

                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    deleteRoom = (roomid, callback) => {
        firestore()
            .collection('rooms')
            .doc(roomid)
            .delete()
            .then(() => {
                console.log('room deleted!');
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error });
                console.error(error)
            })
    }
}

const gameServices = new firebaseServices();

export default gameServices;