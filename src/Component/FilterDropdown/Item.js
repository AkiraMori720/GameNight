import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import images from "../../../assets/images";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = {
	sortItemButton: {
		height: hp(8),
		justifyContent: 'center'
	},
	sortItemContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	sortItemText: {
		color: '#54585E',
		fontSize: 18,
		fontWeight: 'normal',
		flex: 1
	},
	sortIcon: {
		width: hp(4),
		height: hp(4),
		marginHorizontal: 16,
		// resizeMode: 'contain',
		// justifyContent: 'center',
		color: '#9ea2a8'
	},
	filterImage: {
		width: hp(6),
		height: hp(6),
		marginHorizontal: 16,
 	}
};

export const FilterItemButton = ({ children, onPress }) => (
	<TouchableOpacity
		style={styles.sortItemButton}
		onPress={onPress}
	>
		{children}
	</TouchableOpacity>
);

FilterItemButton.propTypes = {
	children: PropTypes.node,
	onPress: PropTypes.func
};

export const FilterItemContent = ({
	label, icon, image, checked
}) => (
	<View style={styles.sortItemContainer}>
		{icon && <Image style={styles.sortIcon} source={icon} />}
		{image && <Image style={styles.filterImage} source={image} />}
		<Text style={styles.sortItemText}>{label}</Text>
		{checked ? <Image style={styles.sortIcon} source={images.ic_clicked} /> : null}
	</View>
);

FilterItemContent.propTypes = {
	label: PropTypes.string,
	icon: PropTypes.string,
	imageUri: PropTypes.string,
	checked: PropTypes.bool
};
