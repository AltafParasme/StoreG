import React, { Component } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import {AppText} from '../../../../components/Texts';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../../../utils';
import { Constants } from '../../../../styles';
import { Images } from '../../../../../assets/images';

const ReactionListItem = ({
    t,
    onPress,
    outerCircleStyle,
    innerCircleStyle,
    sharesCoinsStyle,
    count,
    limit,
    countText,
    iconComponent,
    isLoading
    }) => {
  
    return (
        <View style={{flexDirection: 'row'}}>
            <TouchableOpacity 
                onPress={onPress}
                style={outerCircleStyle}>
                <View style={innerCircleStyle}>
                {
                    (isLoading) ?  <ActivityIndicator animating size="large" /> : iconComponent
                }
                </View>
            </TouchableOpacity>
        
            <View style={{marginLeft: widthPercentageToDP(2)}}>
                <AppText size='XS' style={{marginBottom: heightPercentageToDP(0.4)}}>{t(`${count} ${countText}`)}</AppText>
                <View style={{flexDirection: 'row'}}>
                    <AppText size='XXS'>{t('Get')}</AppText>
                    <Image source={Images.coin} style={sharesCoinsStyle} />
                    <AppText size='XXS'>{t(limit)}</AppText>
                </View>
            </View>
        </View>
    )
}

export default ReactionListItem;