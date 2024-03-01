import React, {Component} from 'react';
import {Linking, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import Markdown from 'react-native-simple-markdown';
import idx from 'idx';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {Placeholder, PlaceholderLine, Fade} from 'rn-placeholder';
import {AppText} from '../../../../components/Texts';
import {Colors} from '../../../../../assets/global';
import Tag from '../../../../components/Tag/Tag';
import {Images} from '../../../../../assets/images/index';
import {Icon} from 'react-native-elements';
import {Constants} from '../../../../styles';
import moment from 'moment';
import {invokeDialler} from '../../utils';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {shipmentStatusMap} from '../../../../Constants';
import {AppConstants} from '../../../../Constants';
import {startWhatsAppSupport, getPaymentMode, isIncluded} from '../../utils';

class ShippingListItem extends Component {
  callUs = () => {
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    startWhatsAppSupport(userMode, 'shippingList');
  };

  render() {
    const {
      t,
      item,
      onItemPress,
      showRightArrow,
      clConfig,
      type,
      isShipmentDetailsLoading,
      isReturnRequestPlaced,
    } = this.props;
    // const cellHeight = heightPercentageToDP(25);
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);

    const FULFILLMENT_CL =
      clConfig &&
      clConfig.clType &&
      (clConfig.clType == 'FULFILLMENT' ||
        clConfig.clType == 'SHOPG_FULFILLMENT')
        ? true
        : false;

    let clConfigType = undefined;
    if (FULFILLMENT_CL) {
      const {markDeliver} = this.props;
      if (markDeliver && markDeliver.success) {
        clConfigType = {
          label: 'Customer Delivery Done',
          color: Constants.green,
        };
      } else {
        if (item.customerDeliveredDate) {
          clConfigType = {
            label: 'Customer Delivery Done',
            color: Constants.green,
          };
        } else {
          if (item.showButton) {
            clConfigType = {
              label: 'Customer Delivery Pending',
              color: Constants.red,
            };
          }
        }
      }
    }

    let shipmentStatus = shipmentStatusMap.hasOwnProperty(item.shipmentStatus)
      ? t(shipmentStatusMap[item.shipmentStatus].label)
      : t(item.shipmentStatus);

    let excludedFromPaymentStatus = ['Cancelled', 'Returned', 'Refund'];
    const excludedPaymentStatus = isIncluded(
      excludedFromPaymentStatus,
      item.shipmentStatus
    );

    if (type == 'GroupShippingList' && shipmentStatus == 'Shipment Delivered') {
      shipmentStatus = item.customerDeliveredDate
        ? 'Shipment Delivered to Customer'
        : 'Shipment Delivered to you';
    }

    isReturnRequestPlaced
      ? (shipmentStatus = 'Shipment Returned')
      : shipmentStatus;
    const shipmentStatusColor = shipmentStatusMap.hasOwnProperty(
      item.shipmentStatus
    )
      ? shipmentStatusMap[item.shipmentStatus].color
      : item.shipmentStatus;

    const pinNumber = item.pinNumber ? item.pinNumber : 0;
    const statusMssg = idx(item, _ => _.statusMsg);

    let totalPrice = item.totalPrice ? item.totalPrice : null;
    let clEarning =
      shipmentStatus === 'Shipment Delivered' ||
      shipmentStatus === 'Shipment Delivered to Customer'
        ? item.clEarning
        : null;

    let paymentMode = item.paymentMode;
    let paymentStatus = item.paymentStatus;

    if (isShipmentDetailsLoading) {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: heightPercentageToDP(4),
            marginTop: heightPercentageToDP(3),
          }}>
          <Placeholder Animation={Fade}>
            <PlaceholderLine
              height={heightPercentageToDP(1.4)}
              width={widthPercentageToDP(20)}
            />
          </Placeholder>
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={onItemPress ? onItemPress : null}>
        {statusMssg ? (
          <View style={styles.delayedContainer}>
            <View>
              <Image source={Images.delayedDelivery} style={styles.imageBox} />
            </View>
            <View style={{padding: widthPercentageToDP(2)}}>
              <AppText black bold>
                {t(`Delivery attempt ${statusMssg.attemptNumber}`)}
              </AppText>
              <Markdown>{t(`${statusMssg.mappedMessage}`)}</Markdown>
            </View>
          </View>
        ) : null}
        <View
          style={[
            styles.container,
            {
              // height: cellHeight,
              marginHorizontal: scaledSize(6),
              marginTop: scaledSize(6),
            },
          ]}>
          <View style={styles.middleView}>
            <AppText black bold size="S">
              {t('Shipment ID - #SHIIPPINGID#', {SHIIPPINGID: item.shipmentId})}
            </AppText>

            {shipmentStatus && shipmentStatus.trim() != '' ? (
              <AppText bold size="S" style={{color: shipmentStatusColor}}>
                {t('#ShipmentStatus#', {ShipmentStatus: shipmentStatus})}
              </AppText>
            ) : null}

            <AppText bold size="S" black>
              {t('Payment Mode : #PAYMENTMODE#', {
                PAYMENTMODE: t(getPaymentMode(paymentMode)),
              })}
            </AppText>
            {excludedPaymentStatus ||
            !paymentStatus ||
            paymentStatus.trim() == '' ? null : paymentStatus == 'FAILED' ? (
              <TouchableOpacity onPress={this.callUs}>
                <AppText size="S" error bold>
                  {t(
                    'Your order is converted to COD. As online payment failed. Call or whatsApp #SUPPORT# in case of any issue.',
                    {SUPPORT: AppConstants.supportWhatsAppNumber}
                  )}
                </AppText>
              </TouchableOpacity>
            ) : paymentStatus == 'IN_PROGRESS' ? (
              <TouchableOpacity onPress={this.callUs}>
                <AppText size="S" black bold>
                  {t('Payment Status : IN PROGRESS')}
                </AppText>
                <AppText size="S" error bold>
                  {t('Call or whatsApp support #SUPPORT# for any issue.', {
                    SUPPORT: AppConstants.supportWhatsAppNumber,
                  })}
                </AppText>
              </TouchableOpacity>
            ) : paymentStatus ? (
              <AppText bold size="S" black>
                {t('Payment Status : #PAYMENTSTATUS#', {
                  PAYMENTSTATUS: paymentStatus,
                })}
              </AppText>
            ) : null}

            {moment(item.deliveryDate).format('LL') != 'Invalid date' ? (
              <AppText greenishBlue bold size="S">
                {t('Delivery by - #DELIVERYDATE#', {
                  DELIVERYDATE: moment(item.deliveryDate).format('LL'),
                })}
              </AppText>
            ) : null}
            <View style={styles.mainTagView}>
              <AppText black bold size="S">
                {t('#ITEMS# item(s) #TOTALPRICE# #LINE#', {
                  ITEMS: item.items,
                  TOTALPRICE: totalPrice ? `| ₹${totalPrice} ` : null,
                  LINE: clEarning ? '|' : null,
                })}
                <AppText style={{fontStyle: 'italic'}}>
                  {t('#EARNINGS#', {
                    EARNINGS: clEarning ? ` Earnings ₹ ${clEarning}` : null,
                  })}
                </AppText>
              </AppText>
            </View>

            {userMode == 'CL' && item.userName && item.phoneNumber ? (
              <TouchableOpacity
                onPress={() => invokeDialler(item.phoneNumber)}
                style={{
                  flexDirection: 'row',
                  marginBottom: heightPercentageToDP(1),
                }}>
                <Icon name={'phone'} size={20} color={Constants.greenishBlue} />
                <AppText greenishBlue bold size="S">
                  {t('#USERNAME# - #PHONENUMBER#', {
                    USERNAME: item.userName,
                    PHONENUMBER: item.phoneNumber,
                  })}
                </AppText>
              </TouchableOpacity>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                marginBottom: heightPercentageToDP(2),
              }}>
              {clConfigType ? (
                <View>
                  <AppText style={{color: clConfigType.color}} bold size="XS">
                    {t(clConfigType.label)}
                  </AppText>
                </View>
              ) : null}
              {userMode == 'CL' && item.shipmentClType ? (
                <View
                  style={{
                    backgroundColor: Constants.black,
                    marginLeft: widthPercentageToDP(3),
                    borderRadius: 4,
                    padding: heightPercentageToDP(0.5),
                  }}>
                  <AppText style={{fontSize: 8, color: '#e57373'}}>
                    {item.shipmentClType.toUpperCase()}
                  </AppText>
                </View>
              ) : null}
            </View>
          </View>

          {showRightArrow ? (
            <View style={styles.rightView}>
              <Icon
                type="feather"
                name="chevron-right"
                color={Constants.darkGrey}
                size={widthPercentageToDP(5)}
                containerStyle={{
                  alignSelf: 'center',
                  marginRight: widthPercentageToDP(1),
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d6d6d6',
  },
  middleView: {
    justifyContent: 'center',
    flex: 0.9,
    marginHorizontal: scaledSize(5),
  },
  rightView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.1,
  },
  buttonTitleStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  mainTagView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusStyle: {
    alignSelf: 'baseline',
    padding: scaledSize(2),
  },
  delayedContainer: {
    backgroundColor: '#f4e2d6',
    flexDirection: 'row',
    padding: widthPercentageToDP(2),
  },
  imageBox: {
    resizeMode: 'contain',
    width: widthPercentageToDP(10),
    height: heightPercentageToDP(10),
  },
});

const mapStateToProps = state => ({
  clConfig: state.clOnboarding.clConfig,
  login: state.login,
  isShipmentDetailsLoading: state.ShippingList.isShipmentDetailsLoading,
});

export default withTranslation()(
  connect(mapStateToProps, null)(ShippingListItem)
);
