import * as React from 'react';
import { Component } from 'react';
import {View, Image, StyleSheet, PermissionsAndroid,} from 'react-native';
import {Icon} from 'react-native-elements';
import {AppText} from '../../../../../components/Texts';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../../../../utils';
import { Constants } from '../../../../../styles';
import {Images} from '../../../../../../assets/images/index';

export default class TaskShareWhatsapp extends Component {
  render() {
    let {shareKey, t, pointsPerTask} = this.props;
    
      return (
        <View style={styles.shareData}>
        <View style={styles.whatsappCircle}>
          <Icon
            type="font-awesome"
            name="whatsapp"
            color={Constants.white}
            size={widthPercentageToDP(4.5)}
            containerStyle={{
              alignSelf: 'center',
            }}
          />
        </View>
        <AppText bold greenishBlue size="S">
          {t(shareKey)}
        </AppText>
        { pointsPerTask ? 
          <View style={styles.sharingBox}>
          <Image source={Images.coin} style={styles.coinImageStyle} />
          <AppText bold secondaryColor size="XS">
            {t(`#POINTSPERTASK# COINS`, { POINTSPERTASK : pointsPerTask })}
          </AppText>
          </View>
        : null }
      </View>
      );
  }
}

const styles = StyleSheet.create({
    shareData: {
        flexDirection: 'row',
        height: heightPercentageToDP(4),
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: widthPercentageToDP(10),
      },
      whatsappCircle: {
        marginHorizontal: widthPercentageToDP(3),
        backgroundColor: '#1ad741',
        alignItems: 'center',
        justifyContent: 'center',
        width: scaledSize(26),
        height: scaledSize(26),
        borderRadius: 28 / 2,
      },
      sharingBox: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginLeft: widthPercentageToDP(1)
      },
      coinImageStyle: {
        width: widthPercentageToDP(4),
        height: heightPercentageToDP(4),
        resizeMode: 'contain'
      }
})