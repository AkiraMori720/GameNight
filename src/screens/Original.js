import React from 'react';
import {connect} from 'react-redux'
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    ImageBackground,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import SimpleButton from '../common/SimpleButton';
import {cardLoweredHeight, cardLoweredWidth, cards} from '../constants/cards'
import gameServices from '../firebase/gameService';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {PLAYER_PROPS} from "../constants/constants";
import {RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices} from "react-native-webrtc";
import Character from "../Component/Character";
import RTCView from "react-native-webrtc/RTCView";
import {rgbaColor} from "react-native-reanimated/src/reanimated2/Colors";
import {showToast} from "../common/info";

export const peerConnectionConfig = {
    'iceServers': [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
        {
            urls: 'stun:stun1.l.google.com:19302',
        },
        {
            urls: 'stun:stun2.l.google.com:19302',
        },
    ]
};

const POS_SOUTH = 0;
const POS_WEST = 1;
const POS_NORTH = 2;
const POS_EAST = 3;

const CHARACTER_WIDTH = 64;
const CHARACTER_HEIGHT = 64;

class Original extends React.Component {

    constructor(props) {
        super(props);
        this.localStream = null;
        this.connectionUnSubscribe = {};
        this.connectionCandidateUnSubscribe = {};
        this.state = {
            game: {},
            players: [],
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
            winningScore: props.route.params?.score,
            toggleMic: true,
            remoteStreams: {},
            webRTCConnections: {},
            loading: true
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.state.fPrivate !== true && ((this.props.preference !== undefined && this.props.auth !== undefined) ||
            (nextProps.preference !== undefined && this.props.auth !== undefined) ||
            (nextProps.preference !== undefined && nextProps.auth !== undefined))) {

            const { characterSelectedId, characters, skinColor, accessory, nailColor, spadezDeck, spadezTable } = this.props.auth;
            let character = Object.assign({}, characters.find(item => item.id === characterSelectedId));
            let config = {
                character,
                skinColor,
                nailColor,
                accessory,
                spadezDeck,
                spadezTable,
            }
            const data = {
                username: nextProps.auth.username,
                userid: nextProps.auth.userid,
                gameType: nextProps.preference.gameType === 'random' ? 'partner' : nextProps.preference.gameType,
                gameStyle: nextProps.preference.gameStyle,
                gameLobby: nextProps.preference.gameLobby,
                winningScore: nextProps.preference.gameStyle === 'solo' ? nextProps.preference.soloPoints : nextProps.preference.partnerPoints,
                config
            }
            // this.socket.emit('joinGame', data)
            gameServices.joinGame(data, (res) => {
                if (res.isSuccess) {
                    this.setPresenceHook(res.response.roomid, nextProps.auth.userid);
                    this.setState({ roomid: res.response.roomid })
                    this.playGame(res.response.roomid)
                }
                else {
                    console.log(res.message)
                }
            })
        }
    }

    async componentDidMount() {
        await this.init();
    }

    componentWillUnmount() {
        if (this.state.roomid) {
            if(this.unSubscriber){
                this.unSubscriber();
            }
            this.closeWebrtcConnections();
            if(this.state.roomid){
                this.removePresenceHook(this.state.roomid, this.props.auth.userid);
                gameServices.removePlayer(this.state.roomid, this.props.auth.userid);
            }
        }
    }

    init = async () => {
        const preference = this.props.preference
        const auth = this.props.auth
        const { roomid, fPrivate } = this.state
        console.log('roomid, fPrivate', roomid, fPrivate, preference, auth);
        this.trickAnimate = []

        if (roomid !== undefined && roomid !== null) {
            const { characterSelectedId, characters, skinColor, accessory, nailColor, spadezDeck, spadezTable } = this.props.auth;
            let character = Object.assign({}, characters.find(item => item.id === characterSelectedId));
            let config = {
                character,
                skinColor,
                nailColor,
                accessory,
                spadezDeck,
                spadezTable,
            }
            const data = {
                userid: auth.userid,
                username: auth.username,
                roomid,
                config
            }
            gameServices.joinPrivateGame(data, (res) => {
                if (res.isSuccess) {
                    this.setPresenceHook(res.response.roomid, auth.userid);
                    this.playGame(roomid);
                }
                else { console.log(res.message) }
            })
        }
        else if (!fPrivate && preference !== undefined && auth !== undefined) {
            const { characterSelectedId, characters, skinColor, accessory, nailColor, spadezDeck, spadezTable } = this.props.auth;
            let character = Object.assign({}, characters.find(item => item.id === characterSelectedId));
            let config = {
                character,
                skinColor,
                nailColor,
                accessory,
                spadezDeck,
                spadezTable,
            }
            const data = {
                roomid: roomid,
                username: auth.username,
                userid: auth.userid,
                gameType: preference.gameType === 'random' ? 'partner' : preference.gameType,
                gameStyle: preference.gameStyle,
                gameLobby: preference.gameLobby,
                winningScore: preference.gameStyle === 'solo' ? preference.soloPoints : preference.partnerPoints,
                config
            }
            // this.socket.emit('joinGame', data)
            await gameServices.joinGame(data, (res) => {
                if (res.isSuccess) {
                    this.setPresenceHook(res.response.roomid, auth.userid);
                    this.setState({ roomid: res.response.roomid })
                    this.joinRoom(res.response.roomid).then(() => {
                        this.playGame(res.response.roomid);
                    })
                }
                else {
                    this.setState({ loading: false });
                    showToast('Loading Failed');
                    console.log(res.message)
                }
            })
        }
        else {
            this.playGame(roomid)
        }
    }

    closeWebrtcConnections(){
        if(this.localStream){
            this.localStream.getTracks().forEach(item => item.stop());
            this.localStream.release();
            this.localStream = null;
        }

        Object.keys(this.state.webRTCConnections).forEach(key => {
            if(this.connectionUnSubscribe[key]){
                this.connectionUnSubscribe[key]();
                delete this.connectionUnSubscribe[key];
            }
            if(this.connectionCandidateUnSubscribe[key]){
                this.connectionCandidateUnSubscribe[key]();
                delete this.connectionCandidateUnSubscribe[key];
            }
            let peer = this.state.webRTCConnections[key];
            peer.onicecandidate = null;
            peer.onaddstream = null;
            peer.close();
        });

        this.setState({ webRTCConnections: {}, remoteStreams: {} });
    }

    removeConnection = async (connectionIds) => {
        const { webRTCConnections, remoteStreams } = this.state;
        connectionIds.forEach( id => {
            if(remoteStreams[id]){
                delete remoteStreams[id];
            }
            if(webRTCConnections[id]){
                webRTCConnections[id].onicecandidate = null;
                webRTCConnections[id].onaddstream = null;
                webRTCConnections[id].close();
                delete webRTCConnections[id];
            }
            if(this.connectionUnSubscribe[id]){
                this.connectionUnSubscribe[id]();
                delete this.connectionUnSubscribe[id];
            }
            if(this.connectionCandidateUnSubscribe[id]){
                this.connectionCandidateUnSubscribe[id]();
                delete this.connectionCandidateUnSubscribe[id];
            }

            gameServices.deleteWebRTCConnection(id);
        })
        this.setState({ webRTCConnections, remoteStreams });
        console.log('removeConnection', connectionIds, webRTCConnections, remoteStreams);
    }

    joinRoom = async (roomId) => {
        try{
            await this.startLocalStream();
        } catch (e) {
        }

        const snapshot = await firestore()
            .collection('rooms')
            .doc(roomId)
            .get();

        if(!snapshot || !snapshot.data()){
            return;
        }
        const room = snapshot.data();
        const userId = this.props.auth.userid;

        for (let index = 0; index < room.game.players.length; index++) {
            let player = room.game.players[index];
            if(player.userid === userId){ return; }

            let connectionId = this.getPeerConnectionId(userId, player.userid);

            if(!this.state.webRTCConnections[connectionId]){
                try{
                    await this.requestJoin(connectionId);
                } catch (e){
                }
            }
        }
    }

    requestJoin = async (connectionId) => {
        let newConnections = this.state.webRTCConnections;
        const peerConnection = new RTCPeerConnection(peerConnectionConfig);

        const connectionRef = firestore().collection('webrtcConnections').doc(connectionId);
        const callerCandidatesCollection = connectionRef.collection('callerCandidates');

        //Wait for their video stream
        peerConnection.onicecandidate = function (event) {
            if (event.candidate != null) {
                console.log('onicecandidate');
                // webRTCSdk.signal(connectionId, JSON.stringify({'ice': event.candidate}));
                callerCandidatesCollection.add(event.candidate.toJSON());
            }
        }

        peerConnection.onaddstream = (event) => {
            this.gotRemoteStream(event, connectionId)
        }

        //Add the local video stream
        peerConnection.addStream(this.localStream);

        peerConnection.createOffer().then((offer) => {
            peerConnection.setLocalDescription(offer).then(() => {
                // console.log(connections);
                // webRTCSdk.signal(id, JSON.stringify({'offer': connections[id].localDescription}));
                connectionRef.set({ offer }).then(() => {
                    if(this.connectionUnSubscribe[connectionId]){
                        this.connectionUnSubscribe[connectionId]();
                    }
                    // wait answer
                    this.connectionUnSubscribe[connectionId] = connectionRef.onSnapshot(async snapshot => {
                        const data = snapshot.data();
                        if (!peerConnection.currentRemoteDescription && data.answer) {
                            console.log('answer hook');
                            await connectionRef.update({ answer: null });
                            const rtcSessionDescription = new RTCSessionDescription(data.answer);
                            await peerConnection.setRemoteDescription(rtcSessionDescription);
                        }
                    });

                    if(this.connectionCandidateUnSubscribe[connectionId]){
                        this.connectionCandidateUnSubscribe[connectionId]();
                    }
                    this.connectionCandidateUnSubscribe[connectionId] = connectionRef.collection('calleeCandidates').onSnapshot(snapshot => {
                        snapshot.docChanges().forEach(async change => {
                            if (change.type === 'added') {
                                let data = change.doc.data();
                                console.log('add candidates hook');
                                await peerConnection.addIceCandidate(new RTCIceCandidate(data));
                            }
                        });
                    });
                })
            }).catch(e => console.log(e));
        });

        newConnections[connectionId] = peerConnection;
        this.setState({ webRTCConnections: newConnections });
        console.log('add connection', connectionId);
    }

    acceptJoin = async (connectionId) => {
        const connectionRef = firestore().collection('webrtcConnections').doc(connectionId);
        if(!connectionRef) {
            return setTimeout(() => this.acceptJoin(connectionId), 1000);
        }

        const connectionSnap = await connectionRef.get();
        if(!connectionSnap.data()) {
            return setTimeout(() => this.acceptJoin(connectionId), 1000);
        }
        let offer = connectionSnap.data().offer;
        console.log('connection hook', offer);

        if(!offer){
            return;
        }

        console.log('accepted connection hook', offer);
        let newConnections = this.state.webRTCConnections;

        const peerConnection = new RTCPeerConnection(peerConnectionConfig);

        const callerCandidatesCollection = connectionRef.collection('callerCandidates');

        //Wait for their video stream
        peerConnection.onicecandidate = function (event) {
            if (event.candidate != null) {
                console.log('onicecandidate');
                // webRTCSdk.signal(connectionId, JSON.stringify({'ice': event.candidate}));
                callerCandidatesCollection.add(event.candidate.toJSON());
            }
        }

        peerConnection.onaddstream = (event) => {
            this.gotRemoteStream(event, connectionId)
        }

        //Add the local video stream
        peerConnection.addStream(this.localStream);

        console.log('add connection in receive hook', connectionId);

        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        const roomWithAnswer = {answer, offer: null};
        await connectionRef.update(roomWithAnswer);

        console.log('send answer');

        connectionRef.collection('callerCandidates').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    console.log('onicecandidate');
                    let data = change.doc.data();
                    await peerConnection.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });

        newConnections[connectionId] = peerConnection
        this.setState({webRTCConnections: newConnections});
    }

    startLocalStream = async () => {
        const constraints = {
            audio: true,
            video: false,
        };
        this.localStream = await mediaDevices.getUserMedia(constraints);
    };

    removePresenceHook = (roomId, userId) => {
        const reference = database().ref(`/online/${roomId}/${userId}`);
        if(reference){
            reference.remove().then(() => { console.log(`Remove Room User Presence Room: ${roomId} User: ${userId}`)}).catch(() => {});
        }
    }

    setPresenceHook = (roomId, userId) => {
        const oldRoomId = this.state.roomid;

        // Unset presence of user in old room.
        if(oldRoomId && oldRoomId !== roomId){
            this.removePresenceHook(oldRoomId, userId);
        }

        const reference = database().ref(`/online/${roomId}/${userId}`);

        // Set the /users/:userId value to true
        reference.set(true).then(() => console.log('Online presence set'));

        // Remove the node whenever the client disconnects
        reference
            .onDisconnect()
            .remove().then(() => {});
    }

    playGame = (roomid) => {
        this.setState({loading: false});
    this.unSubscriber = firestore()
        .collection('rooms')
        .doc(roomid)
        .onSnapshot(async snapshot => {
            let room = snapshot.data()
            const { myPosition, teamId, selectedBid } = this.state

            if (room && room.started) {
                let game = room.game;
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
                            // Set character`s position
                            let characterPosition = this.setCharacterPosition(index, myPos);
                            player.style = {
                                left: characterPosition.left,
                                top: characterPosition.top,
                            }
                            // Animate the cards dealt to each player
                            for (let i = 0; i < player.cards.length; i++) {
                                let cardLocation = this.setStartPosition(index, i, myPos);
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
                            let flipUp = (index === myPos);
                            this.animatePlayerHandCardsIntoPosition(player, flipUp, false, 50);
                        }

                        this.setState(prevState => ({
                            game: game,
                            players: game.players,
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
                            if (game.gameType === 'partner' && game.teams[teamId].blind === 2) {
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
                                    let flipUp = (index === this.state.myPosition);
                                    let isClickable = (index === this.state.myPosition) && (playerId === this.state.myPosition);
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
                                    let flipUp = (index === this.state.myPosition);
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
                                if (game.gameType === 'partner') {
                                    const team = game.teams[this.state.teamId]
                                    this.setState(prevState => ({
                                        myScore: team.gameScore,
                                        selectedBid: -1,
                                        showBlindBid: team.lostScore <= -100
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
                                this.props.navigation.navigate('GameOver', { points: this.state.myScore })
                            }
                            break;

                        default:
                            break;
                    }
                }
            }
            else {
                if(room){
                    let game = room.game;
                    const myPos = game.players.findIndex((player) => player.userid === this.props.auth.userid);
                    if(myPos === -1){
                        return setTimeout(() => this.init(), 500);
                    }
                    let players = [];
                    for (let index = 0; index < game.players.length; index++) {
                        let player = game.players[index];
                        // Set character`s position
                        let characterPosition = this.setCharacterPosition(index, myPos);
                        player.style = {
                            left: characterPosition.left,
                            top: characterPosition.top,
                        }
                        players.push(player);
                    }
                    this.setState({
                        // myPosition: myPos,
                        players
                    });
                    ///console.log(`Player ${game.players.length} entered in Game`);
                    console.log(`Player entered in Game`, myPos, players);
                }
            }

            if(room && room.game){
                const userId = this.props.auth.userid;
                const availableConnectionIds = [];
                for (let index = 0; index < room.game.players.length; index++) {
                    let player = room.game.players[index];
                    if(player.userid === userId){ continue; }

                    let connectionId = this.getPeerConnectionId(userId, player.userid);
                    availableConnectionIds.push(connectionId);
                    if (this.state.webRTCConnections[connectionId]) {
                        continue;
                    }

                    this.acceptJoin(connectionId);
                }

                // Connection Check
                const connectionIds = Object.keys(this.state.webRTCConnections);
                const invalidConnectionIds = connectionIds.filter((id => !availableConnectionIds.includes(id)));
                this.removeConnection(invalidConnectionIds);
            }
        })
    }

    getPeerConnectionId = (id1, id2) => {
        if(id1 > id2){
            return `${id1}${id2}`;
        }
        return `${id2}${id1}`;
    }

    gotRemoteStream = (event, connectionId) => {
        console.log('====remote stream====', event, connectionId);
        const { remoteStreams } = this.state;
        remoteStreams[connectionId] = event.stream;
        this.setState({ remoteStreams })
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

    getSpadezDeck = () => {
        const { spadezDeck } = this.props.auth;
        return PLAYER_PROPS.spadezDecks.find(item => item.id === spadezDeck).value;
    }

    setCharacterPosition(position, myPosition) {
        const index = (position + 4 - myPosition) % 4
        switch (index) {
            case POS_SOUTH: //'South'
                return { left: wp(80) * 0.5 - CHARACTER_WIDTH * 0.5 - 170, top: hp(54) }
            case POS_WEST: //'West',
                return { left: 0 - CHARACTER_WIDTH * 0.5, top: 190 - CHARACTER_HEIGHT * 0.5 }
            case POS_NORTH: //'North'
                return { left: wp(80) * 0.5 - CHARACTER_WIDTH * 0.5, top: -10 - CHARACTER_HEIGHT * 0.5 };
            default: //'East'
                return { left: Dimensions.get('screen').width - cardLoweredHeight - CHARACTER_WIDTH * 0.5, top: 190 - CHARACTER_HEIGHT * 0.5 };
        }
    }

    setStartPosition(position, i, myPosition) {
        let startLeft = 0;
        let startTop = 0;
        let cardLocation = this.getHandCardLocation(position, i, 13);
        const index = (position + 4 - myPosition) % 4
        switch (index) {
            case POS_SOUTH: //'South'
                startLeft = Dimensions.get('screen').width * 0.5;
                startTop = Dimensions.get('screen').height + 100;
                break;
            case POS_WEST: //'West',
                startLeft = -300;
                startTop = cardLocation[1];
                break;
            case POS_NORTH: //'North'
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
                return POS_SOUTH;
            case 1:
                return POS_WEST;
            case 2:
                return POS_NORTH;
            default:
                return POS_EAST;
        }
    }

    getHandCardLocation(playerId, index, cardCount) {
        let cardWidthHalf = cardLoweredWidth * 0.5;
        let cardHeightHalf = cardLoweredHeight * 0.5;
        const position = this.getPosition(playerId);
        switch (position) {
            case POS_WEST:
                {
                    let firstLeft = 0;
                    let lastLeft = 0;
                    let firstTop = 100;
                    let lastTop = Dimensions.get('screen').height - 490;
                    let handWidth = lastTop - firstTop;
                    let cardSpacing = handWidth / cardCount;
                    let curTop = firstTop;
                    let maxSpacing = 30;
                    if (cardSpacing > maxSpacing) {
                        cardSpacing = maxSpacing;
                        curTop = firstTop + (handWidth - cardSpacing * cardCount) * 0.5;
                    }
                    curTop = curTop + index * cardSpacing;
                    let curLeft = (firstLeft + lastLeft) * 0.5;
                    return [curLeft - cardWidthHalf, curTop - cardHeightHalf, 90];
                }
            case POS_NORTH:
                {
                    let firstLeft = wp(80) * 0.5 - 110
                    //Dimensions.get('screen').width * 0.5 - 130;
                    let lastLeft = wp(80) * 0.5 + 110//Dimensions.get('screen').width * 0.5 + 100;
                    let firstTop = 0;
                    let lastTop = 0;
                    let handWidth = lastLeft - firstLeft;
                    let cardSpacing = handWidth / (cardCount - 1);
                    let curLeft = firstLeft;
                    let maxSpacing = 30;
                    if (cardSpacing > maxSpacing) {
                        cardSpacing = maxSpacing;
                        curLeft = firstLeft + (handWidth - cardSpacing * (cardCount - 1)) * 0.5;
                    }
                    let curTop = firstTop;
                    curLeft = curLeft + index * cardSpacing;
                    return [curLeft - cardWidthHalf, curTop - cardHeightHalf, 0];
                }
            case POS_EAST:
                {
                    let firstLeft = Dimensions.get('screen').width - cardLoweredHeight;
                    let lastLeft = Dimensions.get('screen').width - cardLoweredHeight;
                    let firstTop = 100;
                    let lastTop = Dimensions.get('screen').height - 490;
                    let handWidth = lastTop - firstTop;
                    let cardSpacing = handWidth / cardCount;
                    let curTop = firstTop;
                    let maxSpacing = 30;
                    if (cardSpacing > maxSpacing) {
                        cardSpacing = maxSpacing;
                        curTop = firstTop + (handWidth - cardSpacing * cardCount) * 0.5;
                    }
                    curTop = curTop + index * cardSpacing;
                    let curLeft = firstLeft;
                    return [curLeft - cardWidthHalf, curTop - cardHeightHalf, -90];
                }
            default:
                {
                    let firstLeft = wp(80) * 0.5 - 110//70;
                    let lastLeft = wp(80) * 0.5 + 110//Dimensions.get('screen').width - 100;
                    let firstTop = hp(54);
                    let lastTop = hp(54);
                    let handWidth = lastLeft - firstLeft;
                    let cardSpacing = handWidth / (cardCount - 1);
                    let curLeft = firstLeft;
                    let maxSpacing = cardWidthHalf;
                    if (cardSpacing > maxSpacing) {
                        cardSpacing = maxSpacing;
                        curLeft = firstLeft + (handWidth - cardSpacing * (cardCount - 1)) * 0.5;
                        firstTop = hp(54);
                        lastTop = hp(54);
                    }
                    curLeft = curLeft + index * cardSpacing;
                    let percent = (curLeft - firstLeft) / handWidth;
                    let radius = handWidth * 3;
                    let distanceFromCenter = handWidth * (0.5 - percent);
                    let curveHeight = Math.sqrt(radius * radius - distanceFromCenter * distanceFromCenter) - Math.sqrt(radius * radius - handWidth * 0.5 * handWidth * 0.5);
                    let curveRotation = Math.asin(-distanceFromCenter / radius) * 180 / Math.PI;
                    let curTop = firstTop - curveHeight;
                    return [curLeft - cardWidthHalf, curTop - cardHeightHalf, curveRotation];
                }
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
            let aposition = this.getHandCardLocation(player.playerPosition, i, player.cards.length)
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
            case POS_SOUTH: //Dimensions.get('screen').width * 0.5
                return [wp(80) * 0.5 - cardLoweredWidth * 0.5, 280 - cardLoweredHeight * 0.5];
            case POS_WEST:
                return [wp(80) * 0.5 - cardLoweredWidth * 1.5 - 20, 190 - cardLoweredHeight * 0.5];
            case POS_NORTH:
                return [wp(80) * 0.5 - cardLoweredWidth * 0.5, 90 - cardLoweredHeight * 0.5];
            default:
                return [wp(80) * 0.5 + cardLoweredWidth * 0.5 + 20, 190 - cardLoweredHeight * 0.5];
        }
    }

    getRenigCardLocation(playerPostion) {
        const position = this.getPosition(playerPostion)
        switch (position) {
            case POS_SOUTH: //Dimensions.get('screen').width * 0.5
                return [wp(80) * 0.5 - cardLoweredWidth * 0.5, wp(80) * 0.5 + cardLoweredHeight * 0.5];
            case POS_WEST:
                return [wp(80) * 0.5 - cardLoweredWidth * 2, wp(80) * 0.5 - cardLoweredHeight * 0.5];
            case POS_NORTH:
                return [wp(80) * 0.5 - cardLoweredWidth * 0.5, wp(80) * 0.5 - cardLoweredHeight * 1.5];
            default:
                return [wp(80) * 0.5 + cardLoweredWidth, wp(80) * 0.5 - cardLoweredHeight * 0.5];
        }
    }

    showRenigCards = (book) => {
        let renigBook = book
        for (let i = 0; i < renigBook.trickCards.length; i++) {
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
        for (let i = 0; i < game.trickCards.length; i++) {
            const playerPosition = (game.leadIndex + i) % 4
            let loc = this.getTrickDiscardLocation(playerPosition);
            console.log('pos: ', playerPosition)
            console.log('loc: ', loc)
            if (i === game.trickCards.length - 1) {
                let start_position = this.getHandCardLocation(playerPosition, 6, 12)
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
        let loc = this.getHandCardLocation(playerPosition, 6, 12);
        const position = this.getPosition(playerPosition)
        switch (position) {
            case POS_SOUTH:
                return [loc[0], Dimensions.get('screen').height + 150];
            case POS_WEST:
                return [-150, loc[1]];
            case POS_NORTH:
                return [loc[0], -150];
            default:
                return [Dimensions.get('screen').width + 150, loc[1]];
        }
    }

    animateTrickResult = (game) => {
        const leadIndex = game.leadIndex
        for (let i = 0; i < game.trickCards.length; i++) {
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

    chooseBook = (index) => {
        console.log('selected book: ', index)
        this.setState(prevState => ({
            selectedBook: index
        }))
    }

    closeBook = () => {
        if (this.state.selectedBook < 0)
            return;
        const data = {
            roomid: this.state.roomid,
            finderId: this.state.myPosition,
            teamId: this.state.teamId,
            renigBook: this.state.game.roundBooks[this.state.selectedBook],
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
                    // avaiableBid
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

    toggleMicrophone = () => {
        const { toggleMic } = this.state;
        if(this.localStream){
            this.localStream.getAudioTracks().forEach( (track) =>{
                track.enabled = !toggleMic;
            });
        }
        this.setState({ toggleMic: !toggleMic });
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
        let books = this.state.game.roundBooks??[];
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.5)", }}>
                <View style={{
                    width: wp('60%'),
                    height: hp('30%'),
                    backgroundColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 8
                }}>

                    <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', textAlign: 'center', marginTop: hp(2), }}>Please set the Book!</Text>
                    <Picker style={{ height: hp(20) }} selectedValue={this.state.selectedBook} onValueChange={this.chooseBook}>
                        {books.map((book, i) => {
                            return <Picker.Item key={i} label={`${i + 1}`} value={i} />
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
                    padding: 8
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

    renderAudio = (player) => {
        const { userid } = this.props.auth;
        const { remoteStreams } = this.state;
        const connectionId = this.getPeerConnectionId(userid, player.userid);
        if(player.userid !== userid && remoteStreams[connectionId]) {
            console.log('player - remoteStream', player.userid, connectionId);
            return (<RTCView
                key={connectionId}
                zOrder={0}
                streamURL={remoteStreams[connectionId].toURL()}
                style={styles.audio}
            />);
        }
        return null;
    }

    render() {
        const { game, renigBook, players, toggleMic, loading, teamId } = this.state
        const curPlayerId = (game.turnIndex + game.leadIndex) % 4;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>
                    {/*<Header onPress={() => this.props.navigation.goBack()} onPressRight={() => this.props.navigation.navigate('Setting')} bgColor={'#2f0801'} headerBorderBottomWidth={0} title={'GAMENIGHT SPADEZ'} imgLeftColor={'#fff'}  imgLeft={images.ic_back} imgRight={images.ic_settings} />*/}
                    <Header onPress={() => this.props.navigation.goBack()} bgColor={'#2f0801'} headerBorderBottomWidth={0} title={'GAMENIGHT SPADEZ'} imgLeftColor={'#fff'}  imgLeft={images.ic_back} />
                    <ImageBackground source={images.gamescreen}  style={styles.backgroundImage}>
                        { loading ? <View style={styles.gameMessage}><Text style={styles.messageText}>Loading....</Text></View>: null }
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
                                                                    source={card.isFlippedUp ? cards[card.image].image : this.getSpadezDeck()} />
                                                            </TouchableOpacity>
                                                            :                                                        
                                                            <Image
                                                                style={[{
                                                                    position: 'absolute',
                                                                    width: 115 / 2,
                                                                    height: 162 / 2,
                                                                    zIndex: 100 + j                                                                
                                                                }, card.style]}
                                                                source={card.isFlippedUp ? cards[card.image].image : this.getSpadezDeck()} />
                                                        }
                                                    </View>
                                                )                                            
                                            })}
                                        </View>
                                    )
                                })}
                                {players && players.map((player, i) => {
                                    return (
                                        <View key={i}>
                                            { player.config &&
                                                <TouchableOpacity
                                                    style={[
                                                        { flex: 1,
                                                            position: 'absolute',
                                                            width: 64,
                                                            height: 64,
                                                            zIndex: 300,
                                                            borderRadius: 48,
                                                            padding: 2,
                                                        },
                                                        player.style,
                                                        curPlayerId === player.playerPosition?styles.curPlayer:{}
                                                    ]}
                                                    onPress={() => {}} >
                                                    <>
                                                        <View
                                                            style={{
                                                                width : "100%",
                                                                height : "100%",
                                                                borderRadius: 48
                                                            }}>
                                                            <Character
                                                                gender={player.config.character.gender}
                                                                hair={player.config.character.hair}
                                                                eyerow={player.config.character.eyerow}
                                                                eye={player.config.character.eye}
                                                                nose={player.config.character.nose}
                                                                lip={player.config.character.lip}
                                                            />
                                                        </View>
                                                        { i === game.dealerIndex ? <Image  style={{ position: 'absolute', width: 16, height: 16, zIndex: 400, right: 4, bottom: 4 }} source={images.ic_dealer} /> : null}
                                                        { player.userid !== this.props.auth.userid ?
                                                            <Text
                                                                style={[
                                                                    styles.playerName,
                                                                    ((teamId > -1) && game.teams && game.teams[teamId].players.includes(player.userid))?styles.teamMember:{}
                                                                ]}
                                                                ellipsizeMode={"tail"}
                                                                numberOfLines={1}>
                                                                {player.config.character.firstName + " " + player.config.character.lastName}
                                                            </Text>
                                                            : null}
                                                        { this.renderAudio(player) }
                                                    </>
                                                </TouchableOpacity>}
                                        </View>
                                    )
                                })}
                            </View>
                        </View>

                        <View style={styles.btnView}>
                            <SimpleButton                        
                                onPress={this.findRenig}
                                btnWidth={wp(40)}   
                                btnHeight={hp(5)}                                                        
                                textColor={'#000000'}
                                fontSize={wp(5)}
                                title={'RENIG'}                                           
                            />
                            {this.state.showBlindBid &&
                                <SimpleButton                        
                                    onPress={this.setBlindBid}
                                    btnWidth={wp(40)}    
                                    btnHeight={hp(5)}                           
                                    textColor={'#000000'}
                                    fontSize={wp(5)}
                                    title={'Blind'}  
                                />                                         
                            }
                            <TouchableOpacity style={styles.touchRecorder} onPress={this.toggleMicrophone}>
                                <Image style={styles.image} source={toggleMic?images.ic_recorder:images.ic_recorder_disable} />
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
                            onRequestClose={() =>
                                this.setState({
                                    renigBook: {},
                                    showRenigResult: false,
                                    renigId: -1})
                            }
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
    gameMessage: {
        position: 'absolute',
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: rgbaColor(0,0,0,0.4),
        zIndex: 10000
    },
    messageText: {
        color: '#fff',
        fontSize: wp(5),
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
    },
    playerName: {
        fontSize: 12,
        fontFamily: 'Montserrat-Bold',
        color: '#fff',
        textAlign: 'center',
        paddingBottom: 4,
    },
    teamMember: {
        color: '#E83528'
    },
    curPlayer: {
        borderWidth: 3,
        borderColor: '#E83528',
    },
    audio: {
        height: 140,
        width: 110
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

