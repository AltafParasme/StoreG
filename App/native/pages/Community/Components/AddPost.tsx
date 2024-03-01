import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {AppText} from '../../../../components/Texts';
import { Images } from '../../../../../assets/images';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../../../utils';
import { Constants } from '../../../../styles';
import {Icon} from 'react-native-elements';

const AddPost = ({
    t,
    onPress,
    coinValue,
    containerStyle
    }) => {
  
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[containerStyle,styles.buttonStyle]}>
            <View style={styles.addBuutonBG}>
                <Icon
                    name={'plus'}
                    type={'font-awesome'}
                    color={Constants.darkBlack}
                    size={16}
                />
            </View>
            <AppText white>{t('Add post and Get #COINS#',{COINS:coinValue})}</AppText>
            <Image source={Images.coin} style={styles.coinsImage} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: Constants.darkBlack,
        flexDirection:'row'
    },
    addBuutonBG:{
        marginRight:widthPercentageToDP(3),
        width:widthPercentageToDP(7),
        height:widthPercentageToDP(7),
        borderRadius:widthPercentageToDP(7),
        backgroundColor:Constants.orangeTextCommision,
        justifyContent:'center',
        alignItems:'center'
    },
    coinsImage: {
        height: widthPercentageToDP(5),
        width: widthPercentageToDP(5),
        marginLeft:widthPercentageToDP(2)
    }
});

export default AddPost;