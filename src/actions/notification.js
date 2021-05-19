import * as types from './types';

export function notificationOpen(params) {
	return {
		type: types.NOTIFICATION.OPEN,
		data: params
	};
}
