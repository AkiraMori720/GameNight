// import AsyncStorage from "@react-native-community/async-storage";
import RNFetchBlob from "rn-fetch-blob";
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import storage from '@react-native-firebase/storage';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import moment from 'moment'

GoogleSignin.configure({
    webClientId: '657946000234-6f1kng83oolvm5g5vcoe77intsvd67oj.apps.googleusercontent.com',
 });

class firebaseServices {
    signinWithGoogle = async function (callback) {
        let self = this;

        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn().catch(e => {
            console.log('Google Sign In error', e);
        });

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // const provider = new firebase.auth.GoogleAuthProvider();
        auth()
            .signInWithCredential(googleCredential)
            // .signInWithPopup(provider)
            .then(res => {
                const token = "";///res.credential.accessToken;
                const user = res.user
                self.getProfileForUser(user, (response) => {
                    if (response.isSuccess) {
                        callback && callback({ isSuccess: true, response })
                    }
                    else {
                        self.setProfileForUser(user, token, callback)
                    }
                })
                // callback({ isSuccess: true, token, user })
                // AsyncStorage.setItem('google_token', token)
            })
            .catch(err => {
                const errCode = err.code
                const errMsg = err.message
                callback && callback({ isSuccess: false, message: errMsg })
            })
    }

    // need extra code for facebook inits for mobile
    signinWithFacebook = async function (callback) {
        let self = this;

        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        // Once signed in, get the users AccesToken
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw 'Something went wrong obtaining access token';
        }

        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
        // const provider = new firebase.auth.FacebookAuthProvider();
        
        auth()
            .signInWithCredential(facebookCredential)
            // .signInWithPopup(provider)
            .then(function (res) {
                var token = "";////res.credential.accessToken;
                var user = res.user;
                self.getProfileForUser(user, (response) => {
                    if (response.isSuccess) {
                        callback && callback({ isSuccess: true, response })
                    }
                    else {
                        self.setProfileForUser(user, token, callback)
                    }
                })
                // callback({ isSuccess: true, token, user })
            }).catch(function (error) {
                callback && callback({ isSuccess: false, response: null, message: error.message });
            });
    }

    signout(callback) {
        auth()
            .signOut()
            .then(() => {
                callback && callback({ isSuccess: true })
            }, () => {
                callback && callback({ isSuccess: false })
            })
    }

    signUpWithEmailAndPassword(email, password, callback) {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(user => {
                this.setProfileForUser(user, null, callback);
                return user;
                // callback({isSuccess: true, user: user.user});// user.user;
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error.message });
            });
    }

    loginWithEmailPass(email, password, callback) {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                this.getProfileForUser(user.user, callback);
                return user;
                // callback({isSuccess: true, user: user.user});// user.user;
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error.message });
            });
    }

    updatePassword(newpassword, callback) {
        return auth().currentUser
            .updatePassword(newpassword)
            .then(res => {
                callback({isSuccess: true, response: res, message: 'Successfully changed! please login again.'});// user.user;
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error.message });
            });
    }

    loginWithSocialMediaCredentials(socialCredentials, callback) {
        return auth()
            .signInWithCredential(socialCredentials)
            .then(user => {
                // AsyncStorage.setItem('CURRENT_USER', JSON.stringify(user.user));
                callback && callback({ isSuccess: true, response: user.user, message: "user logged in successfully." });// user.user;
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error.message });
            });
    }

    setProfileForUser(user/*,email,fcmToken*/, token, callback) {
        const user_profile = {
            user: user.user._user,
            userid: user.user.uid,
            token: token,
            disabled: false,
            avatarId: 0,
            crewCount: 0,
            avatars: [],
            skinColor: 'color1',
            accessory: 'option1',
            nailColor: 'option1',
            handTattoo: 'option1',
            spadezDeck: 'option1',
            spadezTable: 'option1',
            createAt: moment().valueOf()
        };

        firestore()
            .collection("userProfile")
            .doc(user.user.uid)
            .set(user_profile)
            .then(response => {
                callback && callback({ isSuccess: true, response : user_profile, message: "Profile created successfully successfully" });
                //callback && callback({ isSuccess: true, response: response.data(), message: "Profile created successfully successfully" });
            }).catch(error => {
                callback && callback({ isSuccess: false, message: error.message });
            });
    }

    updateProfileForUser(user, profileData, callback) {
        let firebaseRef = firestore().collection("userProfile").doc(user.uid);

        firebaseRef.update(profileData).then(async() => {
            let response = await firestore().collection("userProfile").doc(user.uid).get();
            callback && callback({ isSuccess: true, response: response.data(), message: "Profile updated successfully" });
        }).catch(error => {
            callback && callback({ isSuccess: false, response: null, message: error.message });
        });
    }

    getProfileForUser = (user, callback) => {
        firestore().collection("userProfile").doc(user.uid).get()
            .then((snapshot) => {
                callback && callback({ isSuccess: true, response: snapshot.data(), message: "successfully" });
            })
            .catch((error) => {
                callback && callback({ isSuccess: false, response: null, message: error.message });
            });

    }

    updateFCMTokenForUser = (user, fcmToken, isFromSocialMedia, callback) => {

        let firebaseRef = firestore().collection("userProfile").doc(user.uid);

        if (isFromSocialMedia) {
            return firebaseRef.set({ fcmToken: fcmToken, })
                .then(response => {
                    callback({ isSuccess: true, response: null, message: "FCM token updated successfully" });
                }).catch(error => {
                    callback({ isSuccess: false, response: null, message: error.message });
                });
        } else {
            return firebaseRef.update({ fcmToken: fcmToken, })
                .then(response => {
                    callback({ isSuccess: true, response: null, message: "FCM token updated successfully" });
                }).catch(error => {
                    callback({ isSuccess: false, response: null, message: error.message });
                });
        }
    };

    // prferences related
    getPreferencesForUser = (userId, callback) => {
        firestore().collection("userPreferences").doc(userId).get()
            .then((snapshot) => {
                callback && callback({ isSuccess: true, response: snapshot.data(), message: "successfully" });
            })
            .catch((error) => {
                callback && callback({ isSuccess: false, response: null, message: error.message });
            });
    }

    setPreferencesForUser = (userId, preferences, callback) => {
        firestore()
            .collection("userPreferences")
            .doc(userId)
            .get()
        .then(doc => {
            if (!doc.exists) {
                firestore()
                .collection("userPreferences")
                .doc(userId)
                .set(preferences)
                .then(response => {
                    callback && callback({ isSuccess: true, response: doc.data(), message: "Preference updated successfully" });
                }).catch(error => {
                    callback && callback({ isSuccess: false, response: null, message: error.message });
                });    
            } else {
                firestore()
                .collection("userPreferences")
                .doc(userId)
                .update(preferences)
                .then(response => {
                    callback && callback({ isSuccess: true, response: doc.data(), message: "Preference updated successfully" });
                }).catch(error => {
                    callback && callback({ isSuccess: false, response: null, message: error.message });
                });    
            }
        })
        .catch(error => {
            callback && callback({ isSuccess: false, response: null, message: error.message });
        });

    }

    uploadImage(imagePath, imageName, callback) {
        const image = (Platform.OS === 'android') ? imagePath.uri : imagePath.uri.replace('file://', '') //imagePath.uri;
        const uid = auth().currentUser.uid;
        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;

        let uploadBlob = null;
        const imageRef = storage().ref(`profileImage/${uid}/${imageName}.png`);
        let mime = "image/jpg";
        return fs.readFile(image, "base64")
            .then(data => {
                return Blob.build(data, { type: `${mime};BASE64` });
            })
            .then(blob => {
                uploadBlob = blob;
                return imageRef.put(blob._ref, { contentType: mime });
            })
            .then(() => {
                uploadBlob.close();
                return imageRef.getDownloadURL();
            })
            .then(url => {
                callback && callback({ isSuccess: true, response: url, message: "Image uploaded successfully" });
                return url;
            })
            .catch(error => {
                callback && callback({ isSuccess: false, response: null, message: error.message });
                console.log(error);
            });
    }



    fetchProducts(callback) {
        let firebaseCollection = firestore().collection('products');
        this.firebaseFetch(firebaseCollection, (response) => {
            callback(response);
        });
    }

    fetchCommentsForProduct = (productID, callback) => {

        let firebaseCollection = firestore().collection('productsComments').where("productID", "==", productID);

        this.firebaseFetch(firebaseCollection, (response) => {
            callback(response);
        });
    }



    addNewOrder = (order, callback) => {
        let firebaseRef = firestore().collection("orders");
        firebaseRef.add(order).then(response => {
            callback({ isSuccess: true, response: null, message: "New order created Successfully" });
        }).catch(error => {
            callback({ isSuccess: false, response: null, message: error.message });
        });
    }

    fetchOrdersForUser = (user, status, callback) => {
        let firestore = firestore();
        let firebaseCollection = firestore.collection('orders').where("status", "==", status).where("userID", "==", user.uid);

        this.firebaseFetch(firebaseCollection, (response) => {
            callback(response);
        });
    }

    fetchAllhOrdersForUser = (user, callback) => {
        let firestore = firestore();
        let firebaseCollection = firestore.collection('orders').where("userID", "==", user.uid);

        this.firebaseFetch(firebaseCollection, (response) => {
            callback(response);
        });
    }

    fetchAllhOrders = (callback) => {
        let firestore = firestore();
        let firebaseCollection = firestore.collection('orders');

        this.firebaseFetch(firebaseCollection, (response) => {
            callback(response);
        });
    }


    updateOrder = (order, orderData, callback) => {
        console.log("ORDER TO UPDATE ===>>>", order);
        let firebaseRef = firestore().collection("orders").doc(order.id);
        firebaseRef.update(orderData)
            .then(response => {
                callback({ isSuccess: true, response: null, message: "Order updated Successfully" });
            }).catch(error => {
                callback({ isSuccess: false, response: null, message: error.message });
            });
    }



    addNewComment = (commentData, callback) => {
        console.log("New Order===>>>", commentData);
        let firebaseRef = firestore().collection("productsComments");
        firebaseRef.add(commentData).then(response => {
            callback({ isSuccess: true, response: null, message: "Thank you for your review" });
        }).catch(error => {
            callback({ isSuccess: false, response: null, message: error.message });
        });
    }


    firebaseFetch(collection, callback) {
        collection.get().then(snapshot => {
            callback({ isSuccess: true, response: snapshot, message: "Data collected successfully" });
        }).catch(error => {
            callback({ isSuccess: false, response: null, message: error.message });
        });
    }


    fetchOrderHistory() {
        return firestore().collection('orderHistory').get().then(snapshot => {
            return snapshot
        }).catch(error => {
            console.log(error);
        });
    }

    fetchOrderQueue() {
        return firestore().collection('orderQueue').get().then(snapshot => {
            return snapshot
        }).catch(error => {
            console.log(error);
        });
    }

    fetchUserInfo(uid) {
        console.log("UID ===>>>", uid)
        return firestore()
            .collection("userProfile")
            .doc(uid)
            .get().then((snapshot) => {
                return snapshot.data();
            })
            .catch((error) => {
                return error;
            });
    }


    addToUserCart(userCart, uid) {
        let userCarts = [];
        return firestore()
            .collection("userProfile")
            .doc(uid)
            .get()
            .then(snapshot => {
                if (snapshot.data().userCartList !== undefined) {
                    userCarts = snapshot.data().userCartList;
                    let arr = [...userCarts, ...userCart];
                    return firestore()
                        .collection("userProfile")
                        .doc(uid)
                        .update({
                            userCartList: arr
                        });
                } else {
                    // User Create his cart list first time
                    return firestore()
                        .collection("userProfile")
                        .doc(uid)
                        .update({
                            userCartList: userCart
                        });
                }
            });
    }



    setImageNameToUserFirestore = (imageName) => {
        return firestore()
            .collection("userProfile")
            .doc(auth().currentUser.uid)
            .update({
                profileImage: `${imageName}.png`
            });
    };



    makeOrder(amount, userCartList, uid) {
        return firestore()
            .collection("orderQueue")
            .add({
                userUID: uid,
                total_amount: amount,
                status: 'Requested',
                cart_list: userCartList,
            });
    }

    clearUserCart(uid) {
        return firestore()
            .collection("userProfile")
            .doc(uid)
            .update({
                userCartList: "",
            });
    }

    addOrderReference(referenceId, uid) {
        let array = [];
        let orderArray = [];
        array.push({
            order_id: referenceId,
            // stripe_resp: stripeResponse.data,
        });
        firestore()
            .collection("userProfile")
            .doc(uid)
            .get()
            .then(snapshot => {
                if (snapshot.data().orders !== undefined) {
                    orderArray = [...snapshot.data().orders, ...array];
                    return firestore()
                        .collection("userProfile")
                        .doc(uid)
                        .set(
                            { orders: orderArray },
                            { merge: true }
                        );
                } else {
                    return firestore()
                        .collection("userProfile")
                        .doc(uid)
                        .set(
                            { orders: [{ order_id: referenceId }] },
                            { merge: true }
                        );
                }
            });
    }

    fetchRequestedOrdersId(uid) {
        return firestore()
            .collection("userProfile")
            .doc(uid)
            .get()
            .then(snapshot => {
                return snapshot.data()
            })
            .catch((error) => {
                return error;
            })
    }

    fetchRequestedOrders(orderId) {
        return firestore()
            .collection("orderQueue")
            .doc(orderId)
            .get()
            .then(snapshot => {
                return snapshot.data()
            })
            .catch((error) => {
                return error;
            })
    }

    fetchOrderDelivery() {
        return firestore().collection("OrderDelivery").get().then(response => {
            return response;
        })
    }

    orderDeliveryCart(orderId) {
        return firestore()
            .collection("orderQueue").doc(orderId.trim())
            .get()
            .then(snapshot => {
                return snapshot.data()
            })
            .catch((error) => {
                return error;
            })
    }

    getOrderHistory() {
        return firestore()
            .collection("orderHistory")
            .get()
            .then(snapshot => {
                return snapshot
            })
            .catch((error) => {
                return error;
            })
    }





    commentHandler = (comments) => {
        return firestore().collection("comments").doc(auth().currentUser.uid).set(
            {
                comment: comments
            }
        )
    };

    addComments = (review, rating, date) => {
        let Comments = [];
        let data;
        return firestore().collection("comments").get().then(response => {
            response.forEach(response => {
                console.log("response===>", response.data())
                data = response.data();
                console.log("data reso--->", data)
            })
            console.log("data--->", data)
            if (data !== undefined) {
                Comments = data.comment;
                let arr = [...Comments, review];
                return firestore()
                    .collection("comments")
                    .doc()
                    .update({
                        comment: arr,
                        rating: rating,
                        date: date
                    });
            } else {
                return firestore()
                    .collection("comments")
                    .doc()
                    .set({
                        comment: review,
                        rating: rating,
                        date: date
                    });
            }
        })
    };
    getComment = () => {
        return firestore().collection("comments").doc().get().then(resp => {
            return resp
        })
    };

    sendNotification = (fcmToken, title, message, callback) => {
        const dataModal = {
            "priority": "HIGH",
            "content_available": true,
            "notification": {
                "title": title,
                "body": message,
            },
            "data": {
                "channelId": "e7eee0aa8551c5e",
            },
            "to": fcmToken
        };

        fetch('https://fcm.googleapis.com/fcm/send', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAABrDmIXI:APA91bE49OgtNUbjCiTsuVMFZjZtV8fhayzgC0n_7iGlRNjbB0SdLXLl3Pves4ONm9U0eHbzZ635qZQlJA621zNBydOPT-zTvgBz6iJq0aEa93OjkVbGV4QPEwq-h8niMON0nxdQQGJ2'
            },
            body: JSON.stringify(dataModal)
        }).then((res) => {
            callback(true);
        }).catch(error => {
            console.log(error);
            callback(false);
        })
    }

    sendEmailWithPassword = (email, callback) => {
        auth().sendPasswordResetEmail(email)
            .then(res => {
                callback && callback({ isSuccess: true, response: res, message: "Email sent successfully" });
            }).catch(error => {
                let message = ''
                switch (error.code) {
                    case "auth/invalid-email":
                        message = "Invalid email address format."
                        break;
                    case "auth/user-not-found":
                        message = "User with this email does not exist."
                        break;
                    case "auth/too-many-requests":
                        message = "Too many request. Try again in a minute."
                        break;
                    default:
                        message = "Check your internet connection."
                        break;
                }
                callback && callback({ isSuccess: false, response: null, message: message });
            })
    }
}

const apiService = new firebaseServices();

export default apiService;

