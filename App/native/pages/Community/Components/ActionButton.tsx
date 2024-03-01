import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {AppText} from '../../../../components/Texts';
import { Images } from '../../../../../assets/images';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../../../utils';
import { Constants } from '../../../../styles';

const ActionButton = ({
    t,
    onPress,
    buttonText,
    cointText
    }) => {
  
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.buttonStyle}>
          <AppText white>{t(buttonText)}</AppText>
          <View style={{flexDirection: 'row'}}>
            <AppText white>{t('Get')}</AppText>
            <Image source={Images.coin} style={styles.coinsImage} />
            <AppText white>{t(cointText)}</AppText>
          </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: heightPercentageToDP(3),
        paddingVertical: heightPercentageToDP(1),
        width: widthPercentageToDP(80),
        backgroundColor: Constants.primaryColor,
    },
    coinsImage: {
        height: scaledSize(12),
        width: scaledSize(12),
        top: heightPercentageToDP(0.5),
        marginHorizontal: widthPercentageToDP(3)
    }
});

export default ActionButton;