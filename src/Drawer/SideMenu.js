import React, { Component } from 'react';
import { StyleSheet, FlatList, Text, View, TouchableOpacity,Image,ImageBackground } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {NavigationActions, StackActions} from "react-navigation";
import SideMenuHeader from './SideMenuHeader';
import DrawerItem from './DrawerItem';
import images from "../../assets/images";




export default class SideMenu extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            lists : [
                {
                    id: 0,
                    title:'Market Place',
                    img: images.ic_marketplace
                },
                {
                    id: 1,
                    title:'Messages',
                    img: images.ic_message
                },
                {
                    id: 2,
                    title:'Transaction',
                    img: images.ic_transaction
                },
                {
                    id: 3,
                    title:'Shopping Cart',
                    img: images.ic_shopping_cart
                },
                {
                    id: 4,
                    title:'Setting',
                    img: images.ic_settings
                },
            ]

        }

    }

    //
    // _signOut() {
    //     FirebaseService.signOut((Resp) => {
    //         console.log('firebaseResp--->>', Resp);
    //         if (!Resp.error) {
    //             alert('Sign out');
    //             this.props.navigation.navigate('Signin');
    //         } else {
    //             alert(Resp.message);
    //         }
    //     });
    // }


    onNavigate (id){
        console.log("ID-->",id);
        if(id===0){
            this.props.navigation.navigate('MarketPlace')

        }else if(id===1){

            this.props.navigation.navigate('Messages')
        }
        else if (id===2) {
            this.props.navigation.navigate('Transactions')
        }
        else if (id===3) {
            this.props.navigation.navigate('ShoppingCart')
        }
        else if (id===4) {
            this.props.navigation.navigate('Setting')
        }
        else {
            // this._signOut()
        }
    }

    _navigate ()   {
        const navigateAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Login'})]
        });
        this.props.navigation.dispatch(navigateAction);
    };


    _renderItem = item => {
        return (
            <DrawerItem
                img={item.img}
                title={item.title}
                onPress={()=> this.onNavigate(item.id)}
            />
        );
    };



    render() {
        return (

            <ImageBackground style={styles.MainContainer} source={images.ic_background}>
                <SideMenuHeader onPress={() => this.props.navigation.navigate('Profile')}/>
                <FlatList
                    keyExtractor={item => item.id}
                    data={ this.state.lists }
                    renderItem={({item}) =>
                        this._renderItem(item)
                    }
                />
                <View style={styles.viewBtn}>
               <DrawerItem onPress={() => this._navigate()} bgColor={'#CD727A'} img={images.ic_logout} title={'Log Out'} />
                </View>
            </ImageBackground>

        );
    }
}

const styles = StyleSheet.create({

    MainContainer :{
        justifyContent: 'center',
        flex:1,
        // backgroundColor:'green',
    },
    viewBtn: {
        paddingBottom:hp(5),
    }
});
