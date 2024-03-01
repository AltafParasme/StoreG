import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Icon} from 'react-native-elements';
import {Constants} from '../../styles';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils';
import NavigationService from '../../utils/NavigationService';
import {AppText} from '../Texts';
import {AppConstants} from '../../Constants';
import {startWhatsAppSupport} from '../../native/pages/utils';

export class Support extends Component {
  render() {
    const {t, userMode} = this.props;
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => startWhatsAppSupport(userMode, 'shippingListHeader')}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <AppText
            white
            bold
            size="S"
            style={{paddingRight: widthPercentageToDP(1)}}>
            {t(`Support`)}
          </AppText>
          <View style={styles.whatsappCircle}>
            <Icon
              type="font-awesome"
              name="whatsapp"
              color={Constants.white}
              size={widthPercentageToDP(6)}
              containerStyle={{
                alignSelf: 'center',
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  whatsappCircle: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
    marginRight: widthPercentageToDP(1),
  },
});
