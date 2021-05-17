import React, { PureComponent } from 'react';
import {
	View, Text, Animated, Easing, TouchableWithoutFeedback, TouchableOpacity, StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

import {FilterItemButton, FilterItemContent} from './Item';
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import images from "../../../assets/images";

const ANIMATION_DURATION = 200;

const styles = {
	backdrop: {
		...StyleSheet.absoluteFill,
		backgroundColor: '#000000'
	},
	dropdownContainerHeader: {
		height: hp(7),
		borderBottomWidth: StyleSheet.hairlineWidth,
		alignItems: 'center',
		backgroundColor: '#fff',
		flexDirection: 'row'
	},
	sortToggleContainerClose: {
		position: 'absolute',
		top: 0,
		width: '100%'
	},
	sortItemContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	sortToggleText: {
		color: '#000000',
		fontSize: 15,
		fontWeight: 'bold',
		flex: 1,
		marginLeft: 15
	},
	dropdownContainer: {
		backgroundColor: '#fff',
		width: '100%',
		position: 'absolute',
		top: hp(15)
	},
};

class FilterDropdown extends PureComponent {
	static propTypes = {
		onlyFriends: PropTypes.bool,
		close: PropTypes.func,
		showOnlyFriends: PropTypes.func,
	}

	constructor(props) {
		super(props);
		this.animatedValue = new Animated.Value(0);
	}

	componentDidMount() {
		Animated.timing(
			this.animatedValue,
			{
				toValue: 1,
				duration: ANIMATION_DURATION,
				easing: Easing.inOut(Easing.quad),
				useNativeDriver: true
			}
		).start();
	}

	showOnlyFriends = (block) => {
		return () => {
			const { showOnlyFriends } = this.props;
			showOnlyFriends(block);
		}
	};


	close = () => {
		const { close } = this.props;
		Animated.timing(
			this.animatedValue,
			{
				toValue: 0,
				duration: ANIMATION_DURATION,
				easing: Easing.inOut(Easing.quad),
				useNativeDriver: true
			}
		).start(() => close());
	}

	render() {
		const translateY = this.animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: [-326, 0]
		});
		const backdropOpacity = this.animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 0.3]
		});
		const {
			onlyFriends
		} = this.props;

		return (
			<>
				<TouchableWithoutFeedback onPress={this.close}>
					<Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
				</TouchableWithoutFeedback>
				<Animated.View
					style={[
						styles.dropdownContainer,
						{
							transform: [{ translateY }],
						}
					]}
				>
					<TouchableOpacity
						onPress={this.close}
					>
						<View style={styles.dropdownContainerHeader}>
							<View style={styles.sortItemContainer}>
								<Text style={styles.sortToggleText}>{!onlyFriends?'All Users':'Only Friends'}</Text>
							</View>
						</View>
					</TouchableOpacity>
					<FilterItemButton onPress={this.showOnlyFriends(true)}>
						<FilterItemContent
							image={images.ic_bear}
							label='Show Only Friends'
							checked={onlyFriends}
						/>
					</FilterItemButton>
					<FilterItemButton onPress={this.showOnlyFriends(false)}>
						<FilterItemContent
							image={images.ic_boy}
							label='Show All Users'
							checked={!onlyFriends}
						/>
					</FilterItemButton>
				</Animated.View>
			</>
		);
	}
}

export default FilterDropdown;
