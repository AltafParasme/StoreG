import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import idx from 'idx';
import moment from 'moment';
import {Constants} from '../../../../styles';
import {heightPercentageToDP, scaledSize} from '../../../../utils';
import {AppText} from '../../../../components/Texts';
import Tag from '../../../../components/Tag/Tag';
import {Colors, Fonts} from '../../../../../assets/global';

export class ShippingDetail extends Component {
  render() {
    const {t, item, showHeader} = this.props;
    if (!item) {
      return null;
    }

    return (
      <View elevation={1} style={styles.shippingBox}>
        {showHeader ? (
          <View style={styles.shippingBoxInternal}>
            <View style={styles.shippingBoxLabel}>
              <AppText black bold size="L">
                {t('Shipment Info')}
              </AppText>
            </View>
          </View>
        ) : (
          <View />
        )}
        {item.shipmentDetails ? (
          <View style={styles.shippingBoxInternal}>
            <View style={styles.shippingBoxLabel}>
              <AppText black bold size="S">
                {t('Shipment ID')}
              </AppText>
            </View>
            <View style={styles.shippingBoxValue}>
              <AppText black size="S">
                {t('#' + item.shipmentDetails.shipmentId)}
              </AppText>
            </View>
          </View>
        ) : (
          <View />
        )}
        {item.quantity ? (
          <View style={styles.shippingBoxInternal}>
            <View style={styles.shippingBoxLabel}>
              <AppText black bold size="S">
                {t('Total Quantity')}
              </AppText>
            </View>
            <View style={styles.shippingBoxValue}>
              <AppText black size="S">
                {t(item.quantity)}
              </AppText>
            </View>
          </View>
        ) : (
          <View />
        )}
        {item.mrp ? (
          <View style={styles.shippingBoxInternal}>
            <View style={styles.shippingBoxLabel}>
              <AppText black bold size="S">
                {t('MRP')}
              </AppText>
            </View>
            <View style={styles.shippingBoxValue}>
              <AppText black size="S">
                {t((isNaN(item.mrp) ? '' : '\u20B9') + item.mrp)}
              </AppText>
            </View>
          </View>
        ) : (
          <View />
        )}
        {item.offer ? (
          <View style={styles.shippingBoxInternal}>
            <View style={styles.shippingBoxLabel}>
              <AppText black bold size="S">
                {t('Offer')}
              </AppText>
            </View>
            <View style={styles.shippingBoxValue}>
              <AppText black size="S">
                {t((isNaN(item.offer) ? '' : '\u20B9') + item.offer)}
              </AppText>
            </View>
          </View>
        ) : (
          <View />
        )}
        {item.shipping_charges ? (
          <View style={styles.shippingBoxInternal}>
            <View style={styles.shippingBoxLabel}>
              <AppText black bold size="S">
                {t('Shipping Charges')}
              </AppText>
            </View>
            <View style={styles.shippingBoxValue}>
              <AppText black size="S">
                {t(
                  (isNaN(item.shipping_charges) ? '' : '\u20B9') +
                    item.shipping_charges
                )}
              </AppText>
            </View>
          </View>
        ) : (
          <View />
        )}
        {item.totalPrice ? (
          <View style={styles.shippingBoxInternal}>
            <View style={styles.shippingBoxLabel}>
              <AppText black bold size="S">
                {t('Total Amount')}
              </AppText>
            </View>
            <View style={styles.shippingBoxValue}>
              <Tag
                title={''}
                strikeThru={false}
                price={item.totalPrice}
                textColor={Colors.black}
                t={t}
                size="S"
                titleStyle={{marginLeft: 1}}
                isGroupScreen={false}
              />
            </View>
          </View>
        ) : (
          <View />
        )}
        {item.reward ? (
          <View style={styles.shippingBoxInternal}>
            <View style={styles.shippingBoxLabel}>
              <AppText black bold size="S">
                {t('Total Discount')}
              </AppText>
            </View>
            <View style={styles.shippingBoxValue}>
              <Tag
                title={''}
                strikeThru={false}
                price={400}
                textColor={Colors.blue}
                t={t}
                size="S"
                titleStyle={{marginLeft: 1}}
                isGroupScreen={false}
              />
            </View>
          </View>
        ) : (
          <View />
        )}
        <View style={styles.shippingBoxInternal}>
          <View style={styles.shippingBoxLabel}>
            <AppText black bold size="S">
              {t('Payment mode')}
            </AppText>
          </View>
          <View style={styles.shippingBoxValue}>
            <AppText black size="S">
              {t('Pay on Delivery(Cash/UPI)')}
            </AppText>
          </View>
        </View>
        {item.totalToBePaid ? (
          <View style={styles.shippingBoxInternal}>
            <View style={styles.shippingBoxLabel}>
              <AppText black bold size="S">
                {t('Total payable amount')}
              </AppText>
            </View>
            <View style={styles.shippingBoxValue}>
              <AppText black size="S">
                {t(
                  (isNaN(item.totalToBePaid) ? '' : '\u20B9') +
                    item.totalToBePaid
                )}
              </AppText>
            </View>
          </View>
        ) : (
          <View />
        )}
        {item.deliveryDate ? (
          <View style={styles.shippingBoxInternal}>
            <View style={styles.shippingBoxLabel}>
              <AppText black bold size="S">
                {t('Delivery by #COUNT#', {COUNT: ''})}
              </AppText>
            </View>
            <View style={styles.shippingBoxValue}>
              <AppText black size="S">
                {t(moment(item.deliveryDate).format('LL'))}
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
  shippingBox: {
    flexDirection: 'column',
    padding: scaledSize(5),
    marginLeft: scaledSize(5),
    marginRight: scaledSize(5),
    marginTop: scaledSize(5),
    backgroundColor: 'white',
  },
  shippingBoxInternal: {
    flexDirection: 'row',
    margin: scaledSize(2),
    flex: 0.2,
  },
  shippingBoxLabel: {
    flex: 1,
    justifyContent: 'center',
  },
  shippingBoxValue: {
    flex: 1,
    justifyContent: 'center',
  },
});
