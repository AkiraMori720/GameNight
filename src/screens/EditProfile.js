import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../common/Header';
import images from '../../assets/images';
import { connect } from 'react-redux';
import {
    updateProfileForUser,
} from '../actions/auth';


class EditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            skinColor: 'color1',
            accessory: 'option1',
            nailColor: 'option1',
            handTattoo: 'option1',
            spadezDeck: 'option1',
            spadezTable: 'option1',
            skinColors: ['color1', 'color2', 'color3', 'color4', 'color5'],
            accessories: ['option1', 'option2', 'option3'],
            nailColors: ['option1', 'option2', 'option3'],
            handTattoos: ['option1', 'option2', 'option3'],
            spadezDecks: ['option1', 'option2', 'option3'],
            spadezTables: ['option1', 'option2', 'option3'],
        }
    }

    componentDidMount() {
        console.log('componentdidmount')
        const { skinColor, accessory, nailColor, handTattoo, spadezDeck, spadezTable } = this.props.auth
        this.setState({
            skinColor, accessory, nailColor, handTattoo, spadezDeck, spadezTable
        })
    }

    _onPressSkinColor(idx) {
        const skinColor = this.state.skinColors[idx]
        const profileData = { skinColor }

        this.props.updateProfileForUser(profileData)
            .then(() => {
                this.setState({
                    skinColor
                })
            })
    }

    _onPressAccessory(idx) {
        const accessory = this.state.accessories[idx]
        const profileData = { accessory }

        this.props.updateProfileForUser(profileData)
            .then(() => {
                this.setState({
                    accessory
                })
            })
    }

    _onPressNailColor(idx) {
        const nailColor = this.state.nailColors[idx]
        const profileData = { nailColor }

        this.props.updateProfileForUser(profileData)
            .then(() => {
                this.setState({
                    nailColor
                })
            })
    }

    _onPressHandTattoo(idx) {
        const handTattoo = this.state.handTattoos[idx]
        const profileData = { handTattoo }

        this.props.updateProfileForUser(profileData)
            .then(() => {
                this.setState({
                    handTattoo
                })
            })
    }

    _onPressSpadezDeck(idx) {
        const spadezDeck = this.state.spadezDecks[idx]
        const profileData = { spadezDeck }

        this.props.updateProfileForUser(profileData)
            .then(() => {
                this.setState({
                    spadezDeck
                })
            })
    }

    _onPressSpadezTable(idx) {
        const spadezTable = this.state.spadezTables[idx]
        const profileData = { spadezTable }

        this.props.updateProfileForUser(profileData)
            .then(() => {
                this.setState({
                    spadezTable
                })
            })
    }

    getBtnStyle(id, length) {
        if (id === 0) {
            return styles.typeViewBtnLeft
        }
        else if (id === length - 1) {
            return styles.typeViewBtnRight
        }
        else {
            return styles.typeViewBtnMiddle
        }
    }

    render() {
        const { skinColors, accessories, nailColors, handTattoos, spadezDecks, spadezTables } = this.state
        const { skinColor, accessory, nailColor, handTattoo, spadezDeck, spadezTable } = this.props.auth
        console.log(this.props.auth)

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.mainContainer}>
                    <Header onPress={() => this.props.navigation.pop()} bgColor={'#250901'} headerBorderWidth={2} imgLeft={images.ic_back} title={'GAMENIGHT SPADEZ'} />
                    <View style={styles.contentContainer}>
                        <View style={styles.textView}>
                            <Text style={styles.text}>Choose skin color</Text>
                        </View>
                        <View style={styles.typeView}>
                            <View style={styles.typeInnerView}>
                                {skinColors && skinColors.map((color, i) => {
                                    const btnStyle = this.getBtnStyle(i, skinColors.length)
                                    const backgroundColor = skinColor === color ? 'red' : '#460000'
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => this._onPressSkinColor(i)}
                                            style={[btnStyle, { backgroundColor: backgroundColor }]}
                                        >
                                            <Text style={styles.textBtn}>{color}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.text}>Select Accessory</Text>
                        </View>
                        <View style={styles.typeView}>
                            <View style={styles.typeInnerView}>
                                {accessories && accessories.map((item, i) => {
                                    const btnStyle = this.getBtnStyle(i, accessories.length)
                                    const backgroundColor = accessory === item ? 'red' : '#460000'
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => this._onPressAccessory(i)}
                                            style={[btnStyle, { backgroundColor: backgroundColor }]}
                                        >
                                            <Text style={styles.textBtn}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.text}>Nail Color</Text>
                        </View>
                        <View style={styles.typeView}>
                            <View style={styles.typeInnerView}>
                                {nailColors && nailColors.map((item, i) => {
                                    const btnStyle = this.getBtnStyle(i, nailColors.length)
                                    const backgroundColor = nailColor === item ? 'red' : '#460000'
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => this._onPressNailColor(i)}
                                            style={[btnStyle, { backgroundColor: backgroundColor }]}
                                        >
                                            <Text style={styles.textBtn}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.text}>Hand Tattoo</Text>
                        </View>
                        <View style={styles.typeView}>
                            <View style={styles.typeInnerView}>
                                {handTattoos && handTattoos.map((item, i) => {
                                    const btnStyle = this.getBtnStyle(i, nailColors.length)
                                    const backgroundColor = handTattoo === item ? 'red' : '#460000'
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => this._onPressHandTattoo(i)}
                                            style={[btnStyle, { backgroundColor: backgroundColor }]}
                                        >
                                            <Text style={styles.textBtn}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.text}>Choose Spadez Deck</Text>
                        </View>
                        <View style={styles.typeView}>
                            <View style={styles.typeInnerView}>
                                {spadezDecks && spadezDecks.map((item, i) => {
                                    const btnStyle = this.getBtnStyle(i, nailColors.length)
                                    const backgroundColor = spadezDeck === item ? 'red' : '#460000'
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => this._onPressSpadezDeck(i)}
                                            style={[btnStyle, { backgroundColor: backgroundColor }]}
                                        >
                                            <Text style={styles.textBtn}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.text}>Choose Spadez Table</Text>
                        </View>
                        <View style={styles.typeView}>
                            <View style={styles.typeInnerView}>
                                {spadezTables && spadezTables.map((item, i) => {
                                    const btnStyle = this.getBtnStyle(i, nailColors.length)
                                    const backgroundColor = spadezTable === item ? 'red' : '#460000'
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => this._onPressSpadezTable(i)}
                                            style={[btnStyle, { backgroundColor: backgroundColor }]}
                                        >
                                            <Text style={styles.textBtn}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        height: hp(100),
        width: wp(100),
        backgroundColor: '#881000',
    },
    contentContainer: {
        height: hp(100),
        width: wp(100),
        padding: wp(5),
        // backgroundColor:'#881000',
    },
    text: {
        fontSize: wp(3.6),
        // fontWeight:'bold',
        color: '#fff',
        textAlign: 'center',
        paddingTop: '2%',
        fontFamily: 'Montserrat-Regular'
    },
    textView: {
        height: hp(6),
        justifyContent: 'center',
        alignItems: 'flex-start',
        // backgroundColor: 'green'
    },
    typeView: {
        alignItems: 'flex-start'
    },
    typeInnerView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: hp(5),
        width: wp(80),
        // backgroundColor: 'green',
        borderTopLeftRadius: wp(5),
        borderBottomLeftRadius: wp(5),
        borderTopRightRadius: wp(5),
        borderBottomRightRadius: wp(5)
    },
    typeViewBtnLeft: {
        backgroundColor: 'red',
        height: '100%',
        width: wp(20),
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: wp(5),
        borderBottomLeftRadius: wp(5),
    },
    typeViewBtnRight: {
        backgroundColor: '#460000',
        height: '100%',
        width: wp(20),
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: wp(5),
        borderBottomRightRadius: wp(5)
    },
    typeViewBtnMiddle: {
        backgroundColor: '#460000',
        height: '100%',
        width: wp(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtn: {
        color: '#fff',
        fontSize: wp(3.6),
        fontFamily: 'Montserrat-Bold'
    }

});

const mapDispatchToProps = (dispatch) => ({
    updateProfileForUser: (profileData) => dispatch(updateProfileForUser(profileData)),
    dispatch
})

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
