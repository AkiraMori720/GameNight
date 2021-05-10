import React from 'react';

export const defaultHeader = {
	headerBackTitleVisible: false,
	headerTitleAlign: 'center',
	cardOverlayEnabled: true,
	cardStyle: { backgroundColor: 'transparent' }
};


// Gets the current screen from navigation state
export const getActiveRoute = (state) => {
	const route = state?.routes[state?.index];

	if (route?.state) {
		// Dive into nested navigators
		return getActiveRoute(route.state);
	}

	return route;
};

export const getActiveRouteName = state => getActiveRoute(state)?.name;
