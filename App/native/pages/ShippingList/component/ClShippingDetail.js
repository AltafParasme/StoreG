import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';
import {AppText} from '../../../../components/Texts';
import {Icon, Tooltip} from 'react-native-elements';
import {Constants} from '../../../../styles';
import {TouchableOpacity} from 'react-native-gesture-handler';

export class ClShippingDetail extends Component {
  render() {
    const {t, groupShippingData, clWeeklyLoading} = this.props;
    const {rewards} = this.props || {};

    if (clWeeklyLoading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: heightPercentageToDP(2),
          }}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }
    if (!(groupShippingData && groupShippingData.clOrderSummaryTotalEarning))
      return null;
    let totalOrderValue =
      groupShippingData &&
      groupShippingData.clOrderSummaryTotalEarning &&
      groupShippingData.clOrderSummaryTotalEarning.totalOrderValue
        ? groupShippingData.clOrderSummaryTotalEarning.totalOrderValue
        : 0;
    return (
      <View style={styles.deliveryDetailBox}>
        <View style={styles.shippingBoxHorizontal}>
          <View style={styles.cellStyle}>
            <AppText style={styles.darkgreyColor} bold size="XS">
              {t('Orders')}
            </AppText>
          </View>
          <View style={styles.cellStyle}>
            <AppText style={styles.darkgreyColor} bold size="XS">
              {t('Users')}
            </AppText>
          </View>

          <View style={[styles.cellStyle, {flex: 2}]}>
            <AppText style={styles.darkgreyColor} bold size="XS">
              {t('Total Order Amount')}
            </AppText>
          </View>

          {groupShippingData.clOrderSummaryTotalEarning &&
          groupShippingData.clOrderSummaryTotalEarning.rewards ? (
            <View style={[styles.cellStyle, {flex: 2, alignItems: 'center'}]}>
              <AppText style={styles.darkgreyColor} bold size="XS">
                {t('Rewards')}
              </AppText>
            </View>
          ) : null}
          {groupShippingData.totalEarning > 0 ? (
            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText black bold size="XS">
                {t('Earnings')}
              </AppText>
            </View>
          ) : (
            <View />
          )}
        </View>
        <View style={styles.shippingBoxHorizontal}>
          <View
            style={[styles.cellStyle, {paddingLeft: widthPercentageToDP(2)}]}>
            <AppText black bold size="XS">
              {(groupShippingData &&
                groupShippingData.clOrderSummaryTotalEarning &&
                groupShippingData.clOrderSummaryTotalEarning.totalOrders) ||
                0}
            </AppText>
          </View>

          <View
            style={[styles.cellStyle, {paddingRight: widthPercentageToDP(9)}]}>
            <AppText black bold size="XS">
              {groupShippingData &&
                groupShippingData.clOrderSummaryTotalEarning &&
                groupShippingData.clOrderSummaryTotalEarning.totalUsers}
            </AppText>
          </View>

          <View
            style={[
              styles.cellStyle,
              ,
              {paddingRight: widthPercentageToDP(8)},
            ]}>
            <AppText black bold size="XS">
              {'\u20B9' + totalOrderValue}
            </AppText>
          </View>
          {groupShippingData.clOrderSummaryTotalEarning &&
          groupShippingData.clOrderSummaryTotalEarning.rewards ? (
            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <View style={{flexDirection: 'row'}}>
                <AppText black bold size="XS">
                  ₹ {groupShippingData.clOrderSummaryTotalEarning.rewards}
                </AppText>
                <Tooltip
                  backgroundColor={'#343c4c'}
                  height={heightPercentageToDP(8)}
                  width={heightPercentageToDP(30)}
                  popover={
                    <AppText white style={{textAlign: 'center'}}>
                      {t(
                        `On the first order of every new customer, you get ₹#REFERRALBONUS# reward.`,
                        {
                          REFERRALBONUS: rewards && rewards.refferalBonus,
                        }
                      )}
                    </AppText>
                  }>
                  <Icon
                    name="exclamation"
                    type="evilicon"
                    color={Constants.primaryColor}
                    size={widthPercentageToDP(5.5)}
                    containerStyle={{
                      alignSelf: 'center',
                      marginLeft: widthPercentageToDP(1.4),
                    }}
                  />
                </Tooltip>
              </View>
            </View>
          ) : null}

          {groupShippingData.totalEarning > 0 ? (
            <View style={styles.cellStyle}>
              <AppText black bold size="XS">
                {'\u20B9' + groupShippingData.totalEarning}
              </AppText>
            </View>
          ) : null}
        </View>
        <View style={styles.tableView}>
          <View style={styles.cellLine} />
          <View
            style={[
              styles.shippingBoxHorizontal,
              {
                borderBottomWidth: 1,
                borderColor: '#d6d6d6',
                padding: heightPercentageToDP(1),
                marginBottom: heightPercentageToDP(1.5),
              },
            ]}>
            <View style={styles.cellStyle}>
              <AppText bold style={styles.darkgreyColor} size="XS">
                {t('Order Status')}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText bold style={styles.darkgreyColor} size="XS">
                {t('Orders')}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText bold style={styles.darkgreyColor} size="XS">
                {t('Amount')}
              </AppText>
            </View>
          </View>
          <View style={styles.cellLine} />

          <View style={styles.shippingBoxHorizontal}>
            <View style={styles.cellStyle}>
              <AppText greenishBlue size="XS">
                {t('Confirmed')}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText greenishBlue size="XS">
                {groupShippingData.totalOfferUnlocked}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText greenishBlue size="XS">
                {`₹${groupShippingData.totalOfferUnlockedValue}`}
              </AppText>
            </View>
          </View>

          <View style={styles.shippingBoxHorizontal}>
            <View style={styles.cellStyle}>
              <AppText greenishBlue size="XS">
                {t('Shipped')}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText greenishBlue size="XS">
                {groupShippingData.totalPacked}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText greenishBlue size="XS">
                {`₹${groupShippingData.totalPackedValue}`}
              </AppText>
            </View>
          </View>

          <View style={styles.shippingBoxHorizontal}>
            <View style={styles.cellStyle}>
              <AppText greenishBlue size="XS">
                {t('Delivered')}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText greenishBlue size="XS">
                {groupShippingData.totalDelivered}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText greenishBlue size="XS">
                {`₹${groupShippingData.totalDeliveredValue}`}
              </AppText>
            </View>
          </View>

          <View style={styles.shippingBoxHorizontal}>
            <View style={styles.cellStyle}>
              <AppText red size="XS">
                {t('Cancel')}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText red size="XS">
                {groupShippingData.totalCancel}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText red size="XS">
                {`₹${groupShippingData.totalCancelValue}`}
              </AppText>
            </View>
          </View>

          <View style={styles.shippingBoxHorizontal}>
            <View style={styles.cellStyle}>
              <AppText red size="XS">
                {t('Returned')}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText red size="XS">
                {groupShippingData.totalReturned}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText red size="XS">
                {`₹${groupShippingData.totalReturnedValue}`}
              </AppText>
            </View>
          </View>

          <View style={styles.shippingBoxHorizontal}>
            <View style={styles.cellStyle}>
              <AppText greenishBlue size="XS">
                {t('Undelivered')}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText greenishBlue size="XS">
                {groupShippingData.totalUndelivered}
              </AppText>
            </View>

            <View style={[styles.cellStyle, {alignItems: 'center'}]}>
              <AppText greenishBlue size="XS">
                {`₹${groupShippingData.totalUndeliveredValue}`}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  deliveryDetailBox: {
    flex: 1,
    flexDirection: 'column',
    padding: scaledSize(5),
    marginLeft: scaledSize(5),
    marginRight: scaledSize(5),
    marginTop: scaledSize(5),
    backgroundColor: 'white',
    paddingBottom: heightPercentageToDP(3),
    alignSelf: 'stretch',
  },
  rewardsInfo: {
    backgroundColor: '#343c4c',
    borderRadius: 6,
    position: 'absolute',
    left: widthPercentageToDP(35),
    width: widthPercentageToDP(60),
    bottom: heightPercentageToDP(24),
  },
  shippingBoxHorizontal: {
    flex: 1,
    padding: 2,
    flexDirection: 'row',
    paddingHorizontal: heightPercentageToDP(1.4),
    justifyContent: 'space-between',
  },
  shippingBoxLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cellStyle: {
    flex: 1,
    alignItems: 'flex-start',
    //textAlign: 'left'
  },
  tableView: {
    borderWidth: 1,
    marginHorizontal: widthPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
    padding: widthPercentageToDP(2),
    borderColor: '#d6d6d6',
    borderRadius: 4,
  },
  cellLine: {
    // marginVertical: scaledSize(5),
    //height: scaledSize(1),
    flex: 1,
    alignItems: 'center',
  },
  triangle: {
    width: widthPercentageToDP(7),
    height: heightPercentageToDP(3),
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    top: heightPercentageToDP(3.5),
    left: widthPercentageToDP(48),
    borderRightWidth: 15,
    borderBottomWidth: 28,
    //position: 'absolute',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#343c4c',
    transform: [{rotate: '180deg'}],
  },
  darkgreyColor: {
    color: '#696868',
  },
  centerAlign: {
    textAlign: 'center',
  },
});
