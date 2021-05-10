import { APP } from './types';

export const ROOT_OUTSIDE = 'outside';
export const ROOT_INSIDE = 'inside';
export const ROOT_LOADING = 'loading';
export const ROOT_ONBOARD = 'onboard';

export function appStart({ root, ...args }) {
	return {
		type: APP.START,
		root,
		...args
	};
}

export function appReady() {
	return {
		type: APP.READY
	};
}

export function appInit() {
	return {
		type: APP.INIT
	};
}
