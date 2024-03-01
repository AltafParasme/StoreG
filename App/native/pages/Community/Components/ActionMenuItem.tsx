import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {AppText} from '../../../../components/Texts';
import { widthPercentageToDP, heightPercentageToDP } from '../../../../utils';

const ActionMenuItem = ({
    t,
    onPress,
    buttonText
    }) => {
  
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.buttonStyle}>
          <AppText size='M' bold black>{t(buttonText)}</AppText>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        borderRadius: widthPercentageToDP(0.4),
        width: widthPercentageToDP(90),
        height:heightPercentageToDP(6),
        justifyContent:'center',
    },
});

export default ActionMenuItem;