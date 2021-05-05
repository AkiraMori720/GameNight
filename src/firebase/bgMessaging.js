import firebase from '@react-native-firebase';
// Optional flow type
import RemoteMessage from "../../node_modules/@react-native-firebase/dist/modules/messaging/RemoteMessage";
export default async (message: RemoteMessage) => {
    // handle your message
    const notification = new firebase.notifications.Notification()
        .setNotificationId(message.messageId)
        .setTitle(message.data.title)
        .setBody(message.data.message)
        .setData(message.data)
        .android.setChannelId('e7eee0aa8551c5e')
        .android.setSmallIcon(message.data.image)
        .android.setBigPicture(message.data.image)
        .android.setPriority(firebase.notifications.Android.Priority.High);
    // Build a channel
    const channelId = new firebase.notifications.Android.Channel(message.data.channelId, "hello test", firebase.notifications.Android.Importance.Max);
    // Create the channel
    firebase.notifications().android.createChannel(channelId);
    firebase.notifications().displayNotification(notification).catch(err => console.log("Error On Message", err));
    return Promise.resolve();
}