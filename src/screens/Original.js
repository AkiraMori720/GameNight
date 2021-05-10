import React from 'react';
import { connect } from 'react-redux'
import { Modal, Picker, Animated, Easing, View, Text, StyleSheet,ImageBackground,  TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import SimpleButton from '../common/SimpleButton';
import { cards, cardLoweredWidth, cardLoweredHeight } from '../constants/cards'
import gameServices from '../firebase/gameService';
import firestore from '@react-native-firebase/firestore';


class Original extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            game: {},
            showBid: false,
            showBlindBid: false,
            showRenig: false,
            showRenigResult: false,
            avaiableBid: [],
            selectedBid: -1,
            selectedBook: -1,
            myPosition: -1,
            myScore: 0,
            teamId: -1,
            renigBook: {},
            renigId: -1,
            roomid: props.route.params?.roomid,
            fPrivate: props.route.params?.fPrivate,
            gameType: props.route.params?.type,
            gameStyle: props.route.params?.style,
            gameLobby: props.route.params?.lobby,
            winningScore: props.route.params?.score
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.state.fPrivate !== true && ((this.props.preference !== undefined && this.props.auth !== undefined) ||
            (nextProps.preference !== undefined && this.props.auth !== undefined) ||
            (nextProps.preference !== undefined && nextProps.auth !== undefined))) {
            const mode = Math.floor(Math.random() * 2)
            const randomMode = mode === 0 ? 'solo' : 'partner'
            const data = {
                username: nextProps.auth.username,
                userid: nextProps.auth.userid,
                gameType: nextProps.preference.gameType === 'random' ? randomMode : nextProps.preference.gameType,
                gameStyle: nextProps.preference.gameStyle,
                gameLobby: nextProps.preference.gameLobby,
                winningScore: nextProps.preference.gameStyle === 'solo' ? nextProps.preference.soloPoints : nextProps.preference.partnerPoints,
            }
            // this.socket.emit('joinGame', data)
            gameServices.joinGame(data, (res) => {
                if (res.isSuccess) {
                    this.setState({ roomid: res.response.roomid })
                    this.playGame(res.response.roomid)
                }
                else {
                    console.log(res.message)
                }
            })
        }
    }

    componentDidMount() {
        const preference = this.props.preference
        const auth = this.props.auth
        const { roomid, fPrivate, gameType, gameStyle, gameLobby, winningScore } = this.state

        this.trickAnimate = []

        if (fPrivate !== true && roomid !== undefined && roomid !== null) {
            const data = {
                userid: auth.userid,
                username: auth.username,
                roomid,
            }
            gameServices.joinPrivateGame(data, (res) => {
                if (res.isSuccess) { this.playGame(roomid) }
                else { console.log(res.message) }
            })
        }
        else if (fPrivate !== true && preference !== undefined && auth !== undefined) {
            const mode = Math.floor(Math.random() * 2)
            const randomMode = mode == 0 ? 'solo' : 'partner'
            const data = {
                username: auth.username,
                userid: auth.userid,
                gameType: preference.gameType === 'random' ? randomMode : preference.gameType,
                gameStyle: preference.gameStyle,
                gameLobby: preference.gameLobby,
                winningScore: preference.gameStyle === 'solo' ? preference.soloPoints : preference.partnerPoints,
            }
            // this.socket.emit('joinGame', data)
            gameServices.joinGame(data, (res) => {
                if (res.isSuccess) {
                    this.setState({ roomid: res.response.roomid })
                    this.playGame(res.response.roomid)
                }
                else {
                    console.log(res.message)
                }
            })
        }
        else {
            this.playGame(roomid)
        }

    }

    componentWillUnmount() {
        if (this.state.roomid) {
            this.subscriber();
            gameServices.removePlayer(this.state.roomid, this.props.auth.userid)
        }
    }

    playGame = (roomid) => {
        ///useEffect(() => {
            this.subscriber = firestore()
            ///return firestore()
                .collection('rooms')
                .doc(roomid)
                .onSnapshot(snapshot => {
                    let room = snapshot.data()
                    const { myPosition, teamId, selectedBid } = this.state

                    if (room.started) {
                        let game = room.game
                        const playerId = (game.turnIndex + game.leadIndex) % 4
                        if ((game.renig && game.currentMoveStage !== 'renigResult') || game.bidding > 0) {
                            // this.sendToAll('updatedGame', this.game);
                            return;
                        }
                        if (myPosition < 0) {//start
                            let teamId = -1;
                            const myPos = game.players.findIndex((player) => player.userid === this.props.auth.userid)
                            if (game.gameType === 'partner') {
                                for (let index = 0; index < game.teams.length; index++) {
                                    if (game.teams[index].players.findIndex(player => player === myPos) >= 0) {
                                        teamId = index
                                        break;
                                    }
                                }
                            }
                            this.setState(prevState=>({
                                myPosition : myPos,
                                teamId : teamId
                            }), () =>{
                                for (let index = 0; index < game.players.length; index++) {
                                    let player = game.players[index];
                                    // Animate the cards dealt to each player
                                    for (var i = 0; i < player.cards.length; i++) {
                                        var cardLocation = this.setStartPosition(index, i, myPos);
                                        player.cards[i].positionIndex = i;
                                        player.cards[i].isClickable = false;
                                        player.cards[i].isFlippedUp = false;
                                        player.cards[i].style = {
                                            // position: 'absolute',
                                            left: cardLocation.left,
                                            top: cardLocation.top,// + "px",
                                            // left: new Animated.Value(cardLocation.left),
                                            // top: new Animated.Value(cardLocation.top),// + "px",
                                            // zIndex: i + 100,
                                            // transform: [{ rotate: new Animated.Value(0) }]
                                            // visibility: "visible"
                                        }
                                    }
                                }
                                for (let index = 0; index < game.players.length; index++) {
                                    let player = game.players[index];
                                    let flipUp = (index === myPos) ? true : false;
                                    this.animatePlayerHandCardsIntoPosition(player, flipUp, false, 50);
                                }
    
                                this.setState(prevState => ({
                                    game: game,
                                    myPosition: myPos,
                                    teamId: teamId
                                }), () => {
                                    if (myPos === game.dealerIndex) {
                                        if (game.players[myPos].currentRoundBid < 0) {
                                            if (game.gameType === 'partner' && game.teams[teamId].blind == 2) {
                                                const data = {
                                                    roomid: this.state.roomid,
                                                    playerId: playerId,
                                                    teamId: this.state.teamId,
                                                    bid: 0
                                                }
                                                // this.socket.emit('bid', data)
                                                gameServices.setBid(data, (res) => { })
                                                this.setState(prevState => ({
                                                    selectedBid: 0,
                                                }))
                                            }
                                            else {
                                                setTimeout(() => {
                                                    let avaiableBid = []
                                                    for (let index = 0; index <= 13; index++) {
                                                        avaiableBid.push(index)
                                                    }
                                                    this.setState(prevState => ({
                                                        showBid: true,
                                                        avaiableBid
                                                    }));
                                                }, 2000)
                                            }
                                        }
                                        else {
                                            const data = {
                                                roomid: this.state.roomid,
                                                playerId: playerId,
                                                teamId: this.state.teamId,
                                                bid: game.players[playerId].currentRoundBid
                                            }
                                            // this.socket.emit('bid', data)
                                            gameServices.setBid(data, (res) => { })
                                            this.setState(prevState => ({
                                                selectedBid: game.players[playerId].currentRoundBid,
                                            }))
                                        }
                                    }
                                })
                            })
                        }
                        else if (selectedBid < 0) {//updatedGame
                            if (playerId === this.state.myPosition) {
                                if (game.players[playerId].currentRoundBid >= 0) {
                                    const data = {
                                        roomid: this.state.roomid,
                                        playerId: playerId,
                                        teamId: this.state.teamId,
                                        bid: game.players[playerId].currentRoundBid
                                    }
                                    // this.socket.emit('bid', data)
                                    gameServices.setBid(data, (res) => { })
                                    this.setState(prevState => ({
                                        selectedBid: game.players[playerId].currentRoundBid,
                                    }))
                                }
                                else {
                                    if (game.gameType === 'partner' && game.teams[teamId].blind == 2) {
                                        const data = {
                                            roomid: this.state.roomid,
                                            playerId: playerId,
                                            teamId: this.state.teamId,
                                            bid: 0
                                        }
                                        // this.socket.emit('bid', data)
                                        gameServices.setBid(data, (res) => { })
                                        this.setState(prevState => ({
                                            selectedBid: 0,
                                        }))
                                    }
                                    else {
                                        let start = 0
                                        if (game.gameType === 'partner') {
                                            const player0 = game.teams[this.state.teamId].players[0];
                                            const player1 = game.teams[this.state.teamId].players[1];
                                            const currentRoundBid = this.state.myPosition !== player0 ? game.players[player0].currentRoundBid : game.players[player1].currentRoundBid;
                                            if (currentRoundBid >= 0 && currentRoundBid < 4) {
                                                start = 4 - currentRoundBid;
                                            }
                                        }
                                        let avaiableBid = []
                                        for (let index = start; index <= 13; index++) {
                                            avaiableBid.push(index)
                                        }
                                        this.setState(prevState => ({
                                            showBid: true,
                                            avaiableBid
                                        }));
                                    }
                                }
                            }
                        }
                        else {
                            switch (game.currentMoveStage) {
                                case 'ChoosingTrickCard':
                                    {
                                        for (let index = 0; index < game.players.length; index++) {
                                            let player = game.players[index];
                                            let flipUp = (index === this.state.myPosition) ? true : false;
                                            let isClickable = (index === this.state.myPosition) && (playerId === this.state.myPosition) ? true : false;
                                            this.animatePlayerHandCardsIntoPosition(player, flipUp, isClickable, 50)
                                        }
                                        this.animateTrickCards(game)
                                        this.setState(prevState => ({
                                            game: game
                                        }));
                                    }
                                    break;
                                case 'trickFinished':
                                    {
                                        for (let index = 0; index < game.players.length; index++) {
                                            let player = game.players[index];
                                            let flipUp = (index === this.state.myPosition) ? true : false;
                                            this.animatePlayerHandCardsIntoPosition(player, flipUp, false, 50)
                                        }
                                        this.animateTrickCards(game)
                                        this.setState(prevState => ({
                                            game: game
                                        }));
                                    }
                                    break;
                                case 'trickResult':
                                    {
                                        this.animateTrickResult(game)
                                    }
                                    break;
                                case 'renigResult':
                                    {
                                        this.setState(prevState => ({
                                            renigId: game.renigResult.renig ? game.renigResult.renigId : game.renigResult.finderId
                                        }));
                                        this.showRenigCards(game.renigResult.book)
                                    }
                                    break;
                                case 'finishRound':
                                    {
                                        const player = game.players[this.state.myPosition]
                                        if (game.gameMode === 'partner') {
                                            const team = game.teams[this.state.teamId]
                                            this.setState(prevState => ({
                                                myScore: team.gameScore,
                                                selectedBid: -1,
                                                showBlindBid: team.lostScore <= -100 ? true : false
                                            }))
                                            setTimeout(() => {
                                                this.setState(prevState => ({
                                                    showBlindBid: false
                                                }))
                                            }, 3000)
                                        }
                                        else {
                                            this.setState(prevState => ({
                                                myScore: player.gameScore,
                                                selectedBid: -1
                                            }))
                                        }
                                    }
                                    break;
                                case 'gameOver':
                                    {
                                        this.props.navigation.navigate('GameOver')
                                    }
                                    break;

                                default:
                                    break;
                            }
                        }
                    }
                    else {
                        ///console.log(`Player ${game.players.length} entered in Game`);
                        console.log(`Player  entered in Game`);
                    }
                })
                return;
            // Stop listening for updates when no longer required
            ///return () => subscriber();
        ///}, [roomid]);
    }

    playerChoosePlayCard = (playerId, cardId) => {
        let game = this.state.game
        let player = game.players[playerId]
        let sel_card = player.cards[cardId]

        if (!sel_card.isClickable)
            return

        const data = {
            roomid: this.state.roomid,
            playerId: playerId,
            cardId: cardId,
        }

        // this.socket.emit('playGame', data)
        gameServices.setTrickCard(data, (res) => {
            if (res.isSuccess) {
                this.animatePlayerHandCardsIntoPosition(player, true, false, 50)
            }
            else {
                console.log('failed: ', res.message)
            }
        })

    }

    setStartPosition(position, i, myPosition) {
        var startLeft = 0;
        var startTop = 0;
        var cardLocation = this.getHandCardLocation(position, i, 13);
        const index = (position + 4 - myPosition) % 4
        switch (index) {
            case 0: //'South'
                startLeft = Dimensions.get('screen').width * 0.5;
                startTop = Dimensions.get('screen').height + 100;
                break;
            case 1: //'West',
                startLeft = -300;
                startTop = cardLocation[1];
                break;
            case 2: //'North'
                startLeft = cardLocation[0];
                startTop = -300;
                break;

            default: //'East'
                startLeft = Dimensions.get('screen').width + 300;
                startTop = cardLocation[1];
                break;
        }
        return {
            left: startLeft,
            top: startTop,
        }
    }

    getPosition(position) {
        const index = (position + 4 - this.state.myPosition) % 4
        switch (index) {
            case 0:
                return 'South'
                break;
            case 1:
                return 'West'
                break;
            case 2:
                return 'North'
                break;

            default:
                return 'East'
                break;
        }
    }

    getHandCardLocation(playerId, index, cardCount) {
        var cardWidthHalf = cardLoweredWidth * 0.5;
        var cardHeightHalf = cardLoweredHeight * 0.5;
        const position = this.getPosition(playerId);
        switch (position) {
            case 'West':
                var firstLeft = 0;
                var lastLeft = 0;
                var firstTop = 100;
                var lastTop = Dimensions.get('screen').height - 490;
                var handWidth = lastTop - firstTop;
                var cardSpacing = handWidth / cardCount;
                var curTop = firstTop;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curTop = firstTop + (handWidth - cardSpacing * cardCount) * 0.5;
                }
                curTop = curTop + index * cardSpacing;
                curLeft = (firstLeft + lastLeft) * 0.5;
                return [curLeft - cardWidthHalf, curTop - cardHeightHalf, 90];
            case 'North':
                var firstLeft = wp(80) * 0.5 - 110//Dimensions.get('screen').width * 0.5 - 130;
                var lastLeft = wp(80) * 0.5 + 110//Dimensions.get('screen').width * 0.5 + 100;
                var firstTop = 0;
                var lastTop = 0;
                var handWidth = lastLeft - firstLeft;
                var cardSpacing = handWidth / (cardCount - 1);
                var curLeft = firstLeft;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curLeft = firstLeft + (handWidth - cardSpacing * (cardCount - 1)) * 0.5;
                }
                var curTop = firstTop;
                curLeft = curLeft + index * cardSpacing;
                return [curLeft - cardWidthHalf, curTop - cardHeightHalf, 0];
            case 'East':
                var firstLeft = Dimensions.get('screen').width - cardLoweredHeight;
                var lastLeft = Dimensions.get('screen').width - cardLoweredHeight;
                var firstTop = 100;
                var lastTop = Dimensions.get('screen').height - 490;
                var handWidth = lastTop - firstTop;
                var cardSpacing = handWidth / cardCount;
                var curTop = firstTop;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curTop = firstTop + (handWidth - cardSpacing * cardCount) * 0.5;
                }
                curTop = curTop + index * cardSpacing;
                curLeft = firstLeft;
                return [curLeft - cardWidthHalf, curTop - cardHeightHalf, -90];
            default:
                var firstLeft = wp(80) * 0.5 - 110//70;
                var lastLeft = wp(80) * 0.5 + 110//Dimensions.get('screen').width - 100;
                var firstTop = Dimensions.get('screen').height - 420;
                var lastTop = Dimensions.get('screen').height - 420;
                var handWidth = lastLeft - firstLeft;
                var cardSpacing = handWidth / (cardCount - 1);
                var curLeft = firstLeft;
                var maxSpacing = cardWidthHalf;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curLeft = firstLeft + (handWidth - cardSpacing * (cardCount - 1)) * 0.5;
                    firstTop = Dimensions.get('screen').height - 390;
                    lastTop = Dimensions.get('screen').height - 390;
                }
                curLeft = curLeft + index * cardSpacing;
                var percent = (curLeft - firstLeft) / handWidth;
                var radius = handWidth * 3;
                var distanceFromCenter = handWidth * (0.5 - percent);
                var curveHeight = Math.sqrt(radius * radius - distanceFromCenter * distanceFromCenter) - Math.sqrt(radius * radius - handWidth * 0.5 * handWidth * 0.5);
                var curveRotation = Math.asin(-distanceFromCenter / radius) * 180 / Math.PI;
                var curTop = firstTop - curveHeight;
                return [curLeft - cardWidthHalf, curTop - cardHeightHalf, curveRotation];
        }
    }

    animatePlayerHandCardsIntoPosition(player, flipUp, isClickable, duration) {
        for (let i = 0; i < player.cards.length; i++) {
            let card = player.cards[i];
            if (flipUp) {
                this.flipUpCard(card);
            } else {
                this.flipDownCard(card, true);
            }
            card.positionIndex = i;
            card.isClickable = isClickable;
            card.style = {}
            var aposition = this.getHandCardLocation(player.playerPosition, i, player.cards.length)
            card.style.left = aposition[0] //+ "px"
            card.style.top = aposition[1] //+ "px"
            card.style.transform = [{ rotate: aposition[2] + 'deg' }]
            // console.log('pos: ', aposition)
            // Animated.parallel([
            //     Animated.timing(player.cards[i].style.left, {
            //         toValue: aposition[0],
            //         useNativeDriver: true,
            //         duration: duration,
            //         delay: 20,
            //         easing: Easing.out
            //     }),
            //     Animated.timing(player.cards[i].style.top, {
            //         toValue: aposition[1],
            //         useNativeDriver: true,
            //         duration: duration,
            //         delay: 20,
            //         easing: Easing.out
            //     }),
            //     Animated.timing(player.cards[i].rotate, {
            //         toValue: aposition[2],
            //         useNativeDriver: true,
            //         duration: duration,
            //         delay: 20,
            //         easing: Easing.out
            //     })
            //     // Animated.timing(player.cards[i].rotate, {
            //     //     toValue: {
            //     //         left: aposition[0] + "px",
            //     //         top: aposition[1] + "px",
            //     //         transform: [{rotate: aposition[2] + 'deg'}]
            //     //     },
            //     //     duration: 200,
            //     //     delay: 20,
            //     //     easing: Easing.out
            //     // })
            // // ]).start((o) => {
            // ]).start();
        }
    }

    getTrickDiscardLocation(playerPostion) {
        const position = this.getPosition(playerPostion)
        switch (position) {
            case 'South': //Dimensions.get('screen').width * 0.5
                return [wp(80) * 0.5 - cardLoweredWidth * 0.5, 330 - cardLoweredHeight * 0.5];
            case 'West':
                return [wp(80) * 0.5 - cardLoweredWidth * 1.5 - 20, 230 - cardLoweredHeight * 0.5];
            case 'North':
                return [wp(80) * 0.5 - cardLoweredWidth * 0.5, 130 - cardLoweredHeight * 0.5];
            default:
                return [wp(80) * 0.5 + cardLoweredWidth * 0.5 + 20, 230 - cardLoweredHeight * 0.5];
        }
    }

    getRenigCardLocation(playerPostion) {
        const position = this.getPosition(playerPostion)
        switch (position) {
            case 'South': //Dimensions.get('screen').width * 0.5
                return [wp(80) * 0.5 - cardLoweredWidth * 0.5, wp(80) * 0.5 + cardLoweredHeight * 0.5];
            case 'West':
                return [wp(80) * 0.5 - cardLoweredWidth * 2, wp(80) * 0.5 - cardLoweredHeight * 0.5];
            case 'North':
                return [wp(80) * 0.5 - cardLoweredWidth * 0.5, wp(80) * 0.5 - cardLoweredHeight * 1.5];
            default:
                return [wp(80) * 0.5 + cardLoweredWidth, wp(80) * 0.5 - cardLoweredHeight * 0.5];
        }
    }

    showRenigCards = (book) => {
        let renigBook = book
        for (var i = 0; i < renigBook.trickCards.length; i++) {
            let card = renigBook.trickCards[i];
            const playerPosition = (renigBook.leadIndex + i) % 4
            let loc = this.getRenigCardLocation(playerPosition);
            card.style = {
                left: loc[0],
                top: loc[1],
            }
        }
        this.setState(prevState => ({
            renigBook: renigBook,
            showRenigResult: true,
        }))
        setTimeout(() => {
            this.setState(prevState => ({
                renigBook: {},
                showRenigResult: false,
                renigId: -1
            }));
        }, 3000)
    }

    animateTrickCards = (game) => {
        this.trickAnimate = []
        for (var i = 0; i < game.trickCards.length; i++) {
            const playerPosition = (game.leadIndex + i) % 4
            let loc = this.getTrickDiscardLocation(playerPosition);
            console.log('pos: ', playerPosition)
            console.log('loc: ', loc)
            if (i === game.trickCards.length - 1) {
                var start_position = this.getHandCardLocation(playerPosition, 6, 12)
                console.log('start_position: ', start_position)
                this.trickAnimate.push(new Animated.ValueXY({ x: start_position[0], y: start_position[1] }))
                Animated.parallel([
                    Animated.timing(this.trickAnimate[i].x, {
                        toValue: loc[0],
                        useNativeDriver: false,
                        duration: 100,
                        easing: Easing.linear
                    }),
                    Animated.timing(this.trickAnimate[i].y, {
                        toValue: loc[1],
                        useNativeDriver: false,
                        duration: 100,
                        easing: Easing.linear
                    })
                ]).start((o) => {
                })
            }
            else {
                this.trickAnimate.push(new Animated.ValueXY({ x: loc[0], y: loc[1] }))
            }
        }
    }

    getWonTrickCardsPilePostion(playerPosition) {
        var loc = this.getHandCardLocation(playerPosition, 6, 12);
        const position = this.getPosition(playerPosition)
        switch (position) {
            case 'South':
                return [loc[0], Dimensions.get('screen').height + 150];
            case 'West':
                return [-150, loc[1]];
            case 'North':
                return [loc[0], -150];
            default:
                return [Dimensions.get('screen').width + 150, loc[1]];
        }
    }

    animateTrickResult = (game) => {
        const leadIndex = game.leadIndex
        for (var i = 0; i < game.trickCards.length; i++) {
            let loc = this.getWonTrickCardsPilePostion(leadIndex);
            Animated.parallel([
                Animated.timing(this.trickAnimate[i].x, {
                    toValue: loc[0],
                    useNativeDriver: false,
                    duration: 500,
                    easing: Easing.linear
                }),
                Animated.timing(this.trickAnimate[i].y, {
                    toValue: loc[1],
                    useNativeDriver: false,
                    duration: 500,
                    easing: Easing.linear
                })
            ]).start()
        }
    }

    flipUpCard(card) {
        if (card.isFlippedUp) {
            return;
        }
        card.isFlippedUp = true;
    }

    flipDownCard(card) {
        if (!card.isFlippedUp) {
            return;
        }
        card.isFlippedUp = false;
        card.isClickable = false;
    }

    chooseBid = (bid) => {
        console.log('selected bid: ', bid)
        this.setState(prevState => ({
            selectedBid: bid
        }))
    }

    closeBid = () => {
        if (this.state.selectedBid < 0)
            return;
        const data = {
            roomid: this.state.roomid,
            playerId: this.state.myPosition,
            teamId: this.state.teamId,
            bid: this.state.selectedBid
        }
        if (this.state.showBlindBid) {
            // this.socket.emit('blindBid', data)
            gameServices.setBlindBid(data, (res) => {
                if (res.isSuccess) {
                    this.setState(prevState => ({
                        showBid: false,
                        showBlindBid: false,
                        selectedBid: -1
                    }))
                }
            })
        }
        else {
            // this.socket.emit('bid', data)
            gameServices.setBid(data, (res) => {
                if (res.isSuccess) {
                    this.setState(prevState => ({
                        showBid: false,
                        showBlindBid: false
                    }))
                }
            })
        }
        console.log('selected bid: ', data)
    }

    chooseBook = (book) => {
        console.log('selected book: ', book)
        this.setState(prevState => ({
            selectedBook: book
        }))
    }

    closeBook = () => {
        if (this.state.selectedBook < 0)
            return;
        const data = {
            roomid: this.state.roomid,
            finderId: this.state.myPosition,
            teamId: this.state.teamId,
            renigBook: this.state.selectedBook,
        }
        // this.socket.emit('renigGame', data)
        gameServices.renigGame(data, (res) => {
            if (res.isSuccess) {
                this.setState(prevState => ({
                    showRenig: false,
                }))
            }
        })
    }

    findRenig = () => {
        if (this.state.game.currentMoveStage !== 'ChoosingTrickCard')
            return
        // this.socket.emit('renigFound', data)
        gameServices.findRenig(this.state.roomid, (res) => {
            if (res.isSuccess) {
                this.setState(prevState => ({
                    showRenig: true,
                    avaiableBid
                }))
            }
            else {
                console.log('error: ', res.message)
            }
        })
    }

    setBlindBid = () => {
        // this.socket.emit('bidding', data)
        gameServices.blindBid(this.state.roomid, (res) => {
            if (res.isSuccess) {
                let avaiableBid = []
                for (let index = 6; index <= 8; index++) {
                    avaiableBid.push(index)
                }
                this.setState(prevState => ({
                    showBid: true,
                    avaiableBid
                }));
            }
            else {
                console.log('error: ', res.message)
            }
        })
    }

    renderRenigBook() {
        const { renigBook, renigId } = this.state
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.5)", }}>
                <View style={{
                    width: wp('80%'),
                    height: wp('80%'),
                    backgroundColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 5,
                }}>
                    {renigBook.trickCards && renigBook.trickCards.map((card, i) => {
                        const playerId = (renigBook.leadIndex + i) % 4
                        console.log('renig id: ', renigId)
                        console.log('playerId: ', playerId)
                        const borderColor = playerId === renigId ? 'red' : 'transparent'
                        const borderWidth = playerId === renigId ? 3 : 0
                        return (
                            <Image key={i}
                                style={[{
                                    position: 'absolute',
                                    width: 115 / 2,
                                    height: 162 / 2,
                                    zIndex: 200 + i,
                                    transform: [{ rotate: 0 + 'deg' }],
                                    borderColor: borderColor,
                                    borderWidth: borderWidth
                                },
                                card.style]}
                                source={cards[card.image].image} />
                        )
                    })}
                </View>
            </View>
        )
    }

    renderBook() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.5)", }}>
                <View style={{
                    width: wp('60%'),
                    height: hp('30%'),
                    backgroundColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 5,
                }}>

                    <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', textAlign: 'center', marginTop: hp(2), }}>Please set the Book!</Text>
                    <Picker style={{ height: hp(20) }} selectedValue={this.state.selectedBook} onValueChange={this.chooseBook}>
                        {this.state.avaiableBid.map(bid => {
                            return <Picker.Item key={bid} label={`${bid}`} value={bid} />
                        })}
                    </Picker>

                    <View
                        style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ marginLeft: wp('2%') }}>

                            <TouchableOpacity onPress={() => this.closeBook()} style={{
                                width: wp(55), height: hp('5%'),
                                backgroundColor: '#fff',
                                borderRadius: 5,
                                justifyContent: 'center', alignItems: 'center',
                                borderColor: '#d0d0d0',
                            }}>
                                <Text style={{ color: '#871E2C', fontSize: wp(3.5), fontWeight: 'bold', }}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    renderBid() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.5)", }}>
                <View style={{
                    width: wp('60%'),
                    height: hp('30%'),
                    backgroundColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 5,
                }}>

                    <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', textAlign: 'center', marginTop: hp(2), }}>Please set the Bid!</Text>
                    <Picker style={{ height: hp(20) }} selectedValue={`${this.state.selectedBid}`} onValueChange={this.chooseBid}>
                        {this.state.avaiableBid.map(bid => {
                            return <Picker.Item key={bid} label={bid === 0 ? "Nil" : `${bid}`} value={`${bid}`} />
                        })}
                    </Picker>

                    <View
                        style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ marginLeft: wp('2%') }}>

                            <TouchableOpacity onPress={() => this.closeBid()} style={{
                                width: wp(55), height: hp('5%'),
                                backgroundColor: '#fff',
                                borderRadius: 5,
                                justifyContent: 'center', alignItems: 'center',
                                borderColor: '#d0d0d0',
                            }}>
                                <Text style={{ color: '#871E2C', fontSize: wp(3.5), fontWeight: 'bold', }}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { game, renigBook } = this.state
        const curPlayerId = (game.turnIndex + game.leadIndex) % 4        
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>
                    <Header onPress={() => this.props.navigation.goBack()} onPressRight={() => this.props.navigation.navigate('Setting')} bgColor={'#2f0801'} headerBorderBottomWidth={0} title={'GAMENIGHT SPADEZ'} imgLeftColor={'#fff'}  imgLeft={images.ic_back} s imgRight={images.ic_settings} />
                    <ImageBackground source={images.gamescreen}  style={styles.backgroundImage}>
                        <View style={styles.textView}>
                            <Text style={styles.mainText}>ORIGINAL</Text>
                        </View>
                        <View style={styles.pointsView}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '84%', }}>
                                <Text style={styles.text}>POINTS</Text>
                                <View style={{ flexDirection:'row'}}>
                                    <Text style={styles.boldtext}>{this.state.myScore} </Text>
                                    <Text style={styles.text}>Points</Text>    
                                </View>
                                
                                
                            </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.blankView} >
                                {/* {renigBook.trickCards && renigBook.trickCards.map((card, i) => {
                                    const playerId = (renigBook.leadIndex + i) % 4
                                    const borderColor = playerId === this.state.renigId ? 'red' : 'transparent'
                                    const borderWidth = playerId === this.state.renigId ? 2 : 0
                                    return (
                                        <Image key={i}
                                            style={[{
                                                position: 'absolute',
                                                width: 115 / 2,
                                                height: 162 / 2,
                                                zIndex: 200 + i,
                                                transform: [{ rotate: 0 + 'deg' }],
                                                borderColor: borderColor,
                                                borderWidth: borderWidth
                                            },
                                            card.style]}
                                            source={cards[card.image].image} />
                                    )
                                })} */}
                                {game.trickCards && game.trickCards.map((card, i) => {
                                    return (
                                        <Animated.Image key={i}
                                            style={{
                                                position: 'absolute',
                                                width: 115 / 2,
                                                height: 162 / 2,
                                                left: this.trickAnimate[i].x,
                                                top: this.trickAnimate[i].y,
                                                zIndex: 100 + i,
                                                transform: [{ rotate: 0 + 'deg' }]
                                            }}
                                            source={cards[card.image].image} />
                                    )
                                })}
                                {game.players && game.players.map((player, i) => {
                                    return (
                                        <View key={i}>
                                            {player.cards && player.cards.map((card, j) => {                                            
                                                return (
                                                    <View key={j}>
                                                        {player.playerPosition === this.state.myPosition && curPlayerId === this.state.myPosition ?                                                      
                                                            <TouchableOpacity style={[{ flex: 1,
                                                                position: 'absolute',
                                                                width: 115 / 2,
                                                                height: 162 / 2,
                                                                zIndex: 100 + j                                                            
                                                            }, card.style ]}
                                                                onPress={() => this.playerChoosePlayCard(i, j)} >
                                                                <Image
                                                                    style={{
                                                                        width : "100%",
                                                                        height : "100%"
                                                                    }}
                                                                    source={card.isFlippedUp ? cards[card.image].image : images.card_back_blue} />
                                                            </TouchableOpacity>
                                                            :                                                        
                                                            <Image
                                                                style={[{
                                                                    position: 'absolute',
                                                                    width: 115 / 2,
                                                                    height: 162 / 2,
                                                                    zIndex: 100 + j                                                                
                                                                }, card.style]}
                                                                source={card.isFlippedUp ? cards[card.image].image : images.card_back_blue} />
                                                        }
                                                    </View>
                                                )                                            
                                            })}
                                        </View>
                                    )
                                })}
                            </View>
                        </View>

                        <View style={styles.btnView}>
                            <SimpleButton                        
                                onPress={() => this.findRenig}
                                btnWidth={wp(40)}   
                                btnHeight={hp(5)}                                                        
                                textColor={'#000000'}
                                fontSize={wp(5)}
                                title={'RENIG'}                                           
                            />
                            {this.state.showBlindBid &&
                                <SimpleButton                        
                                    onPress={() => this.setBlindBid}
                                    btnWidth={wp(40)}    
                                    btnHeight={hp(5)}                           
                                    textColor={'#000000'}
                                    fontSize={wp(5)}
                                    title={'Blind'}  
                                />                                         
                            }
                            <TouchableOpacity style={styles.touchRecorder} >
                                <Image style={styles.image} source={images.ic_recorder} />
                            </TouchableOpacity>
                        </View>

                        <Modal
                            visible={this.state.showBid}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={this.closeBid}
                        >
                            {this.renderBid()}
                        </Modal>

                        <Modal
                            visible={this.state.showRenig}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={this.closeBook}
                        >
                            {this.renderBook()}
                        </Modal>

                        <Modal
                            visible={this.state.showRenigResult}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={this.closeRenigBook}
                        >
                            {this.renderRenigBook()}
                        </Modal>
                    </ImageBackground>            
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        height: hp(100),
        width: wp(100),
        // backgroundColor:'#810B44',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain', // or 'stretch'
    },
    mainText: {
        fontSize: wp(5.5),
        // fontWeight:'bold',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
    },
    blankView: {
        height: hp(60),
        width: wp(80),
        borderWidth: 2,
        borderColor: '#f9ba37',

    },
    textView: {
        marginVertical: hp(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointsView: {
        alignItems: 'center',
        marginBottom: hp(5),
        // height: hp(42),
        // backgroundColor:'orange'
    },
    btnView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: wp(7),
        marginTop:hp(2),
        // height: hp(20),
        // backgroundColor:'pink'
    },
    image: {
        height: hp(8),
        width: wp(10),
        resizeMode: 'contain',
    },

    boldtext: {
        fontSize: wp(4.5),
        fontWeight:'bold',
        color: '#f9ba37',
        fontFamily: 'Montserrat-Bold',
    },
    
    text: {
        fontSize: wp(4.5),
        fontWeight:'bold',
        color: '#ffffff',
        fontFamily: 'Montserrat-Bold',
        // textAlign: 'center',
    },
    touchBtn: {
        height: hp(4),
        width: wp(23),
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(2),
        backgroundColor: '#C4CFD9',

    },
    touchRecorder: {
        //marginBottom: hp(10)
    }

});

const mapDispatchToProps = (dispatch) => ({
    dispatch
})

const mapStateToProps = (state) => ({
    preference: state.preference,
    auth: state.login.profile
})

export default connect(mapStateToProps, mapDispatchToProps)(Original)

