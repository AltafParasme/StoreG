import React, { Component } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {AppText} from '../../Texts';
import { Images } from '../../../../assets/images';
import { heightPercentageToDP, widthPercentageToDP, scaledSize } from '../../../utils';
let colors = ['#d6dae1', '#e6ddd6', '#eed9eb', '#d3f5ff', '#ffe4df', '#fff7c6'];

class CommunityDataList extends React.Component {
    //state = { :  }

    renderItem (item, index) {
       const {onPressItems} = this.props;
        let zodiacSign = item.zodiacSign.toLowerCase();
        return (
            <TouchableOpacity 
            onPress={() => {
                onPressItems(index);
            }}
            style={[styles.renderItemStyle, {backgroundColor: colors[(index + 1) % colors.length]}]}>
               <Image source={Images[zodiacSign]} style={{width: 25, height: 25}} />
                <AppText bold>{item.zodiacSign}</AppText>
                <AppText style={{marginTop: heightPercentageToDP(2)}}  textProps={{numberOfLines: 3}}>{item.predictions}</AppText>
            </TouchableOpacity>
        );
    }


    render() { 
        const {data, dataBackgroundColor} = this.props
        if (!data)
            return null;
        
        return ( 
            <View style={[styles.mainView, {backgroundColor: dataBackgroundColor}]}>
               <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                renderItem={({item, index}) => this.renderItem(item, index)}
               />
            </View>
         );
    }
}
 
const styles = StyleSheet.create({
    renderItemStyle: {
        width: widthPercentageToDP(25),
        borderRadius: 5,
        //height: heightPercentageToDP(15), 
        paddingVertical: heightPercentageToDP(2),
        paddingHorizontal: widthPercentageToDP(2),
        marginHorizontal: widthPercentageToDP(2),
        alignItems: 'center'
    },
    mainView: {
        //alignSelf: 'center',
        paddingVertical: heightPercentageToDP(2),
        height: heightPercentageToDP(22), 
        paddingLeft: widthPercentageToDP(3),
        marginTop: heightPercentageToDP(2)
    }
})

export default CommunityDataList;