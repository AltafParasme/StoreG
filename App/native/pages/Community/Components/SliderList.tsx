import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {AppText} from '../../../../components/Texts';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../../../utils';
import { Images } from '../../../../../assets/images';

const SliderList = ({
    t,
    data,
    dataBackgroundColor,
    onPressItems
    }) => {

    const renderItem = (item, index) => {
        let zodiacSign = item.zodiacSign.toLowerCase();
        return (
            <TouchableOpacity 
            onPress={() => {
                onPressItems(index);
            }}
            style={[styles.renderItemStyle, {backgroundColor: item.backgroundColor}]}>
                <Image source={item.sliderImage ? {uri : item.sliderImage} : Images[zodiacSign]} style={{width: 25, height: 25}} />
                <AppText bold>{item.zodiacSign}</AppText>
                <AppText style={{marginTop: heightPercentageToDP(2)}}  textProps={{numberOfLines: 3}}>{item.predictions}</AppText>
            </TouchableOpacity>
        );
    }
    
    return (
        <View style={[styles.mainView, {backgroundColor: dataBackgroundColor}]}>
            <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data}
            renderItem={({item, index}) => renderItem(item, index)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    renderItemStyle: {
        width: widthPercentageToDP(25),
        borderRadius: 5,
        // height: heightPercentageToDP(15), 
        paddingVertical: heightPercentageToDP(2),
        paddingHorizontal: widthPercentageToDP(2),
        marginHorizontal: widthPercentageToDP(2),
        alignItems: 'center'
    },
    mainView: {
        //alignSelf: 'center',
        paddingVertical: heightPercentageToDP(2),
        height: heightPercentageToDP(22), 
        paddingLeft: widthPercentageToDP(3)
    }
});

export default SliderList;