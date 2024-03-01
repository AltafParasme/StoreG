import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {View, StyleSheet, Image} from 'react-native';
import {Images} from '../../../../../assets/images';
import {AppText} from '../../../../components/Texts';
import moment from 'moment';
import idx from 'idx';
import {
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
} from '../../../../utils';
import {Colors} from '../../../../../assets/global';
import {Icon} from 'react-native-elements';

class SlottedDeliveryTimeStrip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      t,
      userPrefDelivery,
      groupSummary,
      mallInfoType,
      userMode,
    } = this.props;

    let summary = idx(groupSummary, _ => _.groupDetails.summary);
    let purchasedMembers = summary && summary.filter(item => !item.isSelf);

    // default next delivery date -> 4 days from today
    let groupOrderAmount = idx(
      groupSummary,
      _ => _.groupDetails.info.groupOrderAmount
    );

    let offerStartDate = idx(
      groupSummary,
      _ => _.groupDetails.info.offerStartDate
    );

    offerStartDate = offerStartDate ? offerStartDate / 1000 : null;
    let formattedOfferStartDate = moment
      .unix(offerStartDate)
      .format('MMM Do, YYYY');

    let orderBeforeDate = idx(userPrefDelivery, _ => _.orderBeforeDate);
    let nextdeliveryDt =
      idx(userPrefDelivery, _ => _.deliveryDate) ||
      new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000);
    let orderBeforeDateMS = idx(userPrefDelivery, _ => _.orderBeforeDate);
    let gmtDateTime = moment.utc(orderBeforeDateMS, 'YYYY-MM-DD HH');
    let formattedDeliveryDate = moment(nextdeliveryDt).format('ddd, MMM Do');
    let isValidDate = moment(orderBeforeDateMS).isValid();
    let duration = moment(gmtDateTime).format('ddd, MMM Do h a');
    let durationMini = moment(gmtDateTime).format('hh:mm a');
    const now = new Date();
    let nowTime = moment.utc(now, 'YYYY-MM-DD HH');
    let nowlocal = nowTime.local().format('YYYY-MM-DD');
    let nextdelivery = moment(nextdeliveryDt).format('YYYY-MM-DD');
    orderBeforeDate = moment(orderBeforeDate).format('YYYY-MM-DD');

    let diff = moment(nextdelivery).diff(moment(nowlocal));
    let orderDiff = moment(orderBeforeDate).diff(moment(nowlocal));

    let orderByDay = moment.duration(orderDiff).days();
    let nextOrderDiff = moment.duration(diff).days();

    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: widthPercentageToDP(4.4),
          backgroundColor: '#fff3eb',
        }}>
        <View style={styles.secondSubView}>
          {/* <View
            style={{
              paddingRight: widthPercentageToDP(3),
              flex: 0.2,
              //bottom: heightPercentageToDP(1.5),
            }}>
            <Image
              source={Images.slottedDeliv}
              style={{
                width: widthPercentageToDP(16),
                height: heightPercentageToDP(8),
              }}
            />
          </View> */}
          <View style={{flexDirection: 'row'}}>
            <AppText bold size="XS" style={{lineHeight: 14}}>
              {t('Next Delivery  ')}
            </AppText>
            <AppText
              bold
              size="XS"
              bold
              style={{color: '#fa6400', lineHeight: 14}}>
              {t(`#DAYTEXT##DAYS#`, {
                DAYS: formattedDeliveryDate,
                DAYTEXT:
                  nextOrderDiff === 0
                    ? 'Today, '
                    : nextOrderDiff === 1
                    ? 'Tomorrow, '
                    : null,
              })}
            </AppText>
          </View>
          <View style={styles.dot} />
          <View
            style={{
              flexDirection: 'row',
            }}>
            <AppText bold size="XS" style={{lineHeight: 14}}>
              {t('Order by  ')}
            </AppText>
            <AppText
              bold
              size="XS"
              style={{
                color: '#fa6400',
                paddingRight: heightPercentageToDP(9),
                lineHeight: 14,
              }}>
              {t(`#DAYS##DAYTEXT#`, {
                DAYS: isValidDate
                  ? orderByDay < 2
                    ? durationMini
                    : duration
                  : moment(nextdeliveryDt)
                      .subtract(1, 'days')
                      .format('ddd, MMMM Do'),
                DAYTEXT:
                  orderByDay === 0
                    ? ', Today'
                    : orderByDay === 1
                    ? ', Tomorrow'
                    : null,
              })}
            </AppText>
          </View>
          {/* {mallInfoType === 'MART' || mallInfoType === 'CL' ? (
            <View style={styles.arrowViewStyle}>
              <Icon
                type="feather"
                name="chevron-right"
                color={Colors.black}
                size={widthPercentageToDP(4)}
                containerStyle={{
                  //alignSelf: 'center',
                  bottom: '10%',
                  left: '2%',
                }}
              />
            </View>
          ) : null} */}
        </View>
        {mallInfoType && groupOrderAmount ? (
          <View
            style={{
              flex: 0.5,
              marginTop: heightPercentageToDP(0.5),
              paddingBottom: heightPercentageToDP(1),
            }}>
            <AppText size="XS" style={{lineHeight: 11, color: '#646464'}}>
              {t(
                '#MEMBER# Members bought ₹#TOTAL# worth items from #OFFERSTARTDATE#',
                {
                  MEMBER: purchasedMembers.length,
                  TOTAL: groupOrderAmount,
                  OFFERSTARTDATE: formattedOfferStartDate,
                }
              )}
            </AppText>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  secondSubView: {
    flexDirection: 'row',
    flex: 0.85,
    alignItems: 'center',
  },
  verticalLine: {
    marginHorizontal: widthPercentageToDP(3),
    height: heightPercentageToDP(3),
    width: 1,
    //alignSelf: 'center',
    backgroundColor: Colors.black,
  },
  arrowViewStyle: {
    backgroundColor: Colors.white,
    width: scaledSize(20),
    height: scaledSize(20),
    borderRadius: 20 / 2,
    justifyContent: 'flex-end',
    elevation: 8,
  },
  dot: {
    backgroundColor: 'black',
    height: heightPercentageToDP(1),
    width: heightPercentageToDP(1),
    borderRadius: heightPercentageToDP(1),
    marginHorizontal: widthPercentageToDP(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTranslation()(SlottedDeliveryTimeStrip);
