import {
  StyleSheet,
  Text,
  Slider,
  View,
  ViewPropTypes,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {Component} from 'react';
import {
  scaledSize,
  AppWindow,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {Colors, Fonts} from '../../../../../assets/global';
import LinearGradient from 'react-native-linear-gradient';
import {AppText} from '../../../../components/Texts';
import {Images} from '../../../../../assets/images';

export class CartSticker extends Component {
  render() {
    const {t, onPress} = this.props;
    return (
      <TouchableOpacity onPress={() => onPress()}>
        <LinearGradient
          colors={[Colors.slightOrange, Colors.darkOrange]}
          style={styles.container}>
          <View style={styles.cartView}>
            <Image source={Images.cartWhite} style={styles.cartImage} />

            <AppText size="L" white bold style={styles.cartNumber}>
              {t('10')}
            </AppText>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

let CIRCLE_RADIUS = 24;

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scaledSize(70),
    height: scaledSize(48),
    borderTopLeftRadius: CIRCLE_RADIUS,
    borderBottomLeftRadius: CIRCLE_RADIUS,
  },
  cartView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cartImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scaledSize(21),
    height: scaledSize(18),
  },
  cartNumber: {
    marginLeft: scaledSize(6),
  },
});
