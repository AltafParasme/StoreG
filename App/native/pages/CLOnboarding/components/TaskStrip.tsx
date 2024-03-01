import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    PermissionsAndroid,
  } from 'react-native';
import {AppText} from '../../../../components/Texts';
import {Images} from '../../../../../assets/images';
import {Colors} from '../../../../../assets/global.js';
import { scaledSize, widthPercentageToDP, heightPercentageToDP } from '../../../../utils';

export default class TaskStrip extends Component {
    render() {
        const {t} = this.props;
        let {superSale} = this.props.clConfig;
        let earningTask =  superSale && superSale.substeps && superSale.substeps[0].text

        return (
            <View style={styles.container}>
               <Image source={Images.coin} 
            style={styles.imageStyle} 
            />
            <View>
                <AppText bold white>{t(earningTask)}</AppText>
                <AppText bold greenishBlue size='XS'>{t(superSale && superSale.title)}</AppText>
            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: heightPercentageToDP(8),
        backgroundColor: Colors.darkishBlue,
        paddingHorizontal: scaledSize(10),
        paddingBottom: heightPercentageToDP(0.5)
      },
      imageStyle: {
        height: scaledSize(32), 
        width: scaledSize(32),
        marginRight: widthPercentageToDP(2)
      },
})