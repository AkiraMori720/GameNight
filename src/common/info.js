import { Alert } from 'react-native';
import { LISTENER } from '../Component/Toast';
import EventEmitter from './events';

export const showErrorAlert = (message, title, onPress = () => {}) => Alert.alert(title, message, [{ text: 'OK', onPress }], { cancelable: true });

export const showToast = (message)=>EventEmitter.emit(LISTENER, {message: message});

export const showConfirmationAlert = ({ message, callToAction, onPress }) => (
	Alert.alert(
		'Are you sure question mark',
		message,
		[
			{
				text: 'Cancel',
				style: 'cancel'
			},
			{
				text: callToAction,
				style: 'destructive',
				onPress
			}
		],
		{ cancelable: false }
	)
);
