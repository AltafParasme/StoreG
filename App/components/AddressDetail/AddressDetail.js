import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Image,
} from 'react-native';
import {AppText} from '../Texts';
import {heightPercentageToDP, scaledSize} from '../../utils';

export class AddressDetail extends Component {
  render() {
    const {t, item} = this.props;
    if (!item) {
      return null;
    }

    return (
      <View>
        {item.deliveryAddress ? (
          <View elevation={1} style={styles.deliveryDetailBox}>
            <View style={styles.shippingBoxLabel}>
              <AppText black bold size="L">
                {t('Delivery Address')}
              </AppText>
            </View>
            <View style={styles.shippingBoxLabel}>
              <AppText bold black size="S">
                {item.deliveryAddress.addressName}
              </AppText>
            </View>
            {!!item.deliveryAddress.addressLine1 && (
              <View style={styles.shippingBoxLabel}>
                <AppText black size="S">
                  {item.deliveryAddress.addressLine1}
                </AppText>
              </View>
            )}
            {(!!item.deliveryAddress.addressLine2 ||
              !!item.deliveryAddress.nearestLandmark) && (
              <View style={styles.shippingBoxLabel}>
                <AppText black size="S">
                  {!!item.deliveryAddress.addressLine2
                    ? item.deliveryAddress.addressLine2
                    : ''}
                  {'\n'}
                  {item.deliveryAddress.nearestLandmark}
                </AppText>
              </View>
            )}
            {item.deliveryAddress.district && (
              <View style={styles.shippingBoxLabel}>
                <AppText black size="S">
                  {item.deliveryAddress.district}
                </AppText>
              </View>
            )}
            <View style={styles.shippingBoxLabel}>
              <AppText black size="S">
                {`${item.deliveryAddress.state},${item.deliveryAddress.pinCode}`}
              </AppText>
            </View>
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  deliveryDetailBox: {
    flexDirection: 'column',
    padding: scaledSize(5),
    marginLeft: scaledSize(5),
    marginRight: scaledSize(5),
    marginTop: scaledSize(5),
    backgroundColor: 'white',
    flexGrow: 1,
  },
  shippingBoxLabel: {
    flex: 1,
    justifyContent: 'center',
  },
});
