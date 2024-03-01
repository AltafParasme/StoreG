import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Images} from '../../../../../assets/images';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../components/Texts';
import {Constants} from '../../../../styles';
import DealExpireCounter from './DealExpireCounter';
import {processTextAndAppendElipsis} from '../../../../utils/misc';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import NavigationService from '../../../../utils/NavigationService';
import {connect} from 'react-redux';
import {Events} from '../../../../Events';
import {shareToWhatsApp} from '../../utils';
import {liveAnalytics} from '../../ShopgLive/redux/actions';

import {Icon} from 'react-native-elements';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';

class GroupDealCouponBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirstItemRendered: false,
    };
  }

  navigateToCashBackDeal() {
    NavigationService.navigate('OrderConfirmation');
  }

  buyNow() {
    NavigationService.navigate('Home');
  }

  render() {
    let {
      t,
      screen,
      rewards,
      groupSummary,
      language,
      RefereeCurrentCycle,
      userName,
      groupDeals,
      referralBonus,
      userPref,
      isBuyNow,
      isEarnCashBack,
    } = this.props;
    let cashbackpercent =
      (rewards && rewards.martGroupTargetCashbackPercent) || 5;

    let RefereeCurrentCycleData =
      RefereeCurrentCycle && RefereeCurrentCycle.length
        ? RefereeCurrentCycle.concat([{id: 1, name: userName}])
        : [
            {id: 1, name: userName},
            {id: 2, name: '1 Friend'},
          ];

    let eventPropsFirst = {
      component: 'GROUP_DEAL_COUPON_PLUS_SIGN',
      page: this.props.screen,
    };

    let eventPropsSecond = {
      component: 'GROUP_DEAL_COUPON_BUTTON',
      page: this.props.screen,
    };

    let dataUser = {
      userId: userPref && userPref.uid,
      sid: userPref && userPref.sid,
    };

    const tagContent = valueItem => {
      let value = valueItem.item || null;
      let initial =
        value &&
        value.name &&
        value.name
          .split(' ')
          .map(function(s) {
            return s.charAt(0);
          })
          .join('');
      let index = valueItem.index;
      let colors = ['#123456', '#654321', '#fdecba', '#abcdef'];
      return (
        <View style={index !== 0 ? {marginLeft: widthPercentageToDP(-5)} : {}}>
          {!(value.name === '1 Friend') ? (
            <View
              style={[
                styles.normalCircle,
                value.name === userName
                  ? {
                      margin: scaledSize(4),
                      backgroundColor: Constants.greenishBlue,
                    }
                  : {
                      margin: scaledSize(4),
                      backgroundColor: colors[index % colors.length],
                    },
              ]}>
              <AppText
                size="XS"
                white
                bold
                style={{textAlign: 'center', top: widthPercentageToDP(2.5)}}>
                {initial}
              </AppText>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                shareToWhatsApp(
                  this.props.screen,
                  'GroupCashbackCoupon',
                  eventPropsFirst,
                  t,
                  rewards,
                  language,
                  groupSummary,
                  userPref,
                  (fragment = 'GroupCashbackCoupon')
                );
                this.props.onAnalytics(
                  Events.SHARE_WHATSAPP_CLICK,
                  eventPropsFirst,
                  dataUser
                );
              }}>
              <View
                style={[
                  groupDeals
                    ? styles.normalCircleGroupDeal
                    : styles.normalCircle,
                  {
                    backgroundColor: Constants.white,
                    borderStyle: 'dashed',
                    borderWidth: 1,
                    borderColor: Constants.greenishBlue,
                  },
                  groupDeals
                    ? {
                        marginLeft: widthPercentageToDP(-7),
                        marginTop: scaledSize(5),
                      }
                    : {
                        margin: scaledSize(4),
                      },
                ]}>
                <Icon
                  type="foundation"
                  name="plus"
                  color={Constants.greenishBlue}
                  size={14}
                  containerStyle={{
                    //left: widthPercentageToDP(4),
                    top: widthPercentageToDP(2.3),
                  }}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    };

    return (
      <TouchableOpacity
        style={[
          styles.actionBox,
          isBuyNow || isEarnCashBack
            ? {
                elevation: 7,
              }
            : {},
        ]}
        onPress={groupDeals ? this.navigateToCashBackDeal.bind(this) : null}>
        <View style={isBuyNow ? styles.textHeadingBuyNow : styles.textHeading}>
          <View
            style={{
              flexDirection: 'row',
              flex: 0.65,
            }}>
            {isBuyNow ? (
              <View style={styles.upperMessageStyle}>
                <AppText size="M" bold white>
                  {t(`GET EXTRA ${cashbackpercent}% CASHBACK`)}
                </AppText>
                <AppText white style={{paddingRight: widthPercentageToDP(3)}}>
                  {t('On kitchen, home, health, women items on Delivery')}
                </AppText>
              </View>
            ) : RefereeCurrentCycle.length < 1 ? (
              <View
                style={
                  groupDeals
                    ? styles.upperMessageGroupDealStyle
                    : styles.upperMessageStyle
                }>
                <AppText size="M" bold white>
                  {t('GET ₹#REFERRAL# CASHBACK', {
                    REFERRAL: referralBonus,
                  })}
                </AppText>
                <AppText size="XS" white>
                  {t('Just get 1 friend to purchase!')}
                </AppText>
              </View>
            ) : (
              <View
                style={
                  groupDeals
                    ? styles.upperMessageGroupDealStyle
                    : styles.upperMessageStyle
                }>
                <AppText size="M" bold white>
                  {t('YOU GOT ₹#REFERRAL# CASHBACK', {
                    REFERRAL: referralBonus,
                  })}
                </AppText>
                <AppText size="XS" white>
                  {t('1 friend purchased on Glowfit')}
                </AppText>
              </View>
            )}
            <View style={styles.imageView}>
              {isBuyNow ? (
                <Image
                  source={Images.coupon_cashback}
                  style={styles.offIconstyle}
                />
              ) : (
                <Image source={Images.cashback} style={styles.iconStyle} />
              )}
            </View>
          </View>
          {!groupDeals && !isBuyNow ? (
            <View
              style={{
                backgroundColor: '#cf2441',
                flex: 0.35,
              }}>
              <DealExpireCounter
                screen={screen}
                targetReached={true}
                isTransparent
                items={this.props.items}
                selfItem={this.props.selfItem}
                dealEndsDate={this.props.dealEndsDate}
              />
            </View>
          ) : null}

          <View
            style={[
              styles.leftCircle,
              styles.couponCircleLeft,
              !isBuyNow && !isEarnCashBack
                ? {bottom: heightPercentageToDP(0), backgroundColor: '#f5f5f5'}
                : {
                    backgroundColor: '#e1e1e1',
                  },
            ]}
          />

          <View
            style={[
              styles.rightCircle,
              styles.couponCircleRight,
              !isBuyNow && !isEarnCashBack
                ? {bottom: heightPercentageToDP(0), backgroundColor: '#f5f5f5'}
                : {
                    backgroundColor: '#e1e1e1',
                  },
            ]}
          />
        </View>

        <View
          style={[
            isBuyNow
              ? {
                  backgroundColor: Constants.white,
                  flexDirection: 'column',
                }
              : {
                  backgroundColor: Constants.white,
                  flexDirection: 'column',
                },
          ]}>
          <View
            style={[
              {
                flexDirection: 'row',
                alignSelf: 'center',
              },
              !isBuyNow ? {paddingVertical: heightPercentageToDP(2)} : {},
            ]}>
            {!isBuyNow ? (
              <View
                style={{
                  marginBottom: heightPercentageToDP(1),
                }}>
                <FlatList
                  contentContainerStyle={styles.grid}
                  numColumns={4}
                  showsVerticalScrollIndicator={false}
                  data={RefereeCurrentCycleData}
                  renderItem={value => tagContent(value)}
                />
              </View>
            ) : null}
            {!groupDeals && !isBuyNow ? (
              <View
                style={{
                  flexDirection: 'column',
                  padding: scaledSize(5),
                }}>
                <AppText bold size="S">
                  {RefereeCurrentCycle.length < 1
                    ? t('Share & ask 1 friend to join')
                    : t('You got ₹#REFERALBONUS# cashback', {
                        REFERALBONUS: referralBonus,
                      })}
                </AppText>
                <AppText size="XS">
                  {t('🔥 1lakh + people got theirs', {
                    REFERRAL: referralBonus,
                  })}
                </AppText>
              </View>
            ) : null}
          </View>

          {!groupDeals && !isBuyNow ? (
            <View
              style={{
                alignItems: 'center',
                height: heightPercentageToDP(5.3),
                marginBottom: heightPercentageToDP(1.6),
              }}>
              <LinearGradientButton
                gradientStyles={{
                  width: widthPercentageToDP(83),
                }}
                colors={['#00a9a6', '#00a9a6', '#00a9a6']}
                title={t('SHARE & EARN', {
                  REFERRAL: referralBonus,
                })}
                titleStyle={{fontSize: scaledSize(14)}}
                onPress={() => {
                  shareToWhatsApp(
                    this.props.screen,
                    'GroupDealCoupon',
                    eventPropsSecond,
                    t,
                    rewards,
                    language,
                    groupSummary,
                    userPref,
                    (fragment = 'MyOrders')
                  );
                  this.props.onAnalytics(
                    Events.SHARE_WHATSAPP_CLICK,
                    eventPropsSecond,
                    dataUser
                  );
                }}
                btnStyles={{flex: 0.45, flexDirection: 'row'}}>
                <Image source={Images.whatsapp} style={styles.buttonImage} />
              </LinearGradientButton>
            </View>
          ) : null}

          {isBuyNow ? (
            <View
              style={{
                alignItems: 'center',
                marginTop: heightPercentageToDP(3.7),
                height: heightPercentageToDP(4.8),
                marginBottom: heightPercentageToDP(2),
              }}>
              <LinearGradientButton
                gradientStyles={{
                  width: widthPercentageToDP(80),
                }}
                colors={['#00a9a6', '#00a9a6', '#00a9a6']}
                title={t('BUY NOW', {
                  REFERRAL: referralBonus,
                })}
                titleStyle={{fontSize: scaledSize(15)}}
                onPress={this.buyNow}></LinearGradientButton>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  actionBox: {
    flex: 1,
    backgroundColor: '#ffff',
    flexDirection: 'column',
    width: '100%',
    borderRadius: 8,
  },
  textHeading: {
    backgroundColor: '#ec3d5a',
    height: heightPercentageToDP(13),
    //flex: 0.23,
  },
  couponCircleLeft: {
    width: widthPercentageToDP(5),
    height: heightPercentageToDP(5),
    position: 'absolute',
    bottom: heightPercentageToDP(3),
    right: widthPercentageToDP(87),
  },
  couponCircleRight: {
    width: widthPercentageToDP(5),
    height: heightPercentageToDP(5),
    position: 'absolute',
    bottom: heightPercentageToDP(3),
    left: widthPercentageToDP(87),
  },
  textHeadingBuyNow: {
    backgroundColor: '#ec3d5a',
    height: heightPercentageToDP(13),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPercentageToDP(2),
  },
  upperMessageStyle: {
    flexDirection: 'column',
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: widthPercentageToDP(3),
  },
  upperMessageGroupDealStyle: {
    flexDirection: 'column',
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  commonCircle: {
    flexDirection: 'row',
  },
  normalCircle: {
    backgroundColor: Constants.greenishBlue,
    margin: scaledSize(10),
    width: widthPercentageToDP(10),
    height: heightPercentageToDP(4.8),
    borderRadius: 44 / 2,
  },
  normalCircleGroupDeal: {
    backgroundColor: Constants.greenishBlue,
    margin: scaledSize(10),
    width: scaledSize(40),
    height: scaledSize(40),
    borderRadius: 40 / 2,
    marginLeft: widthPercentageToDP(-6.5),
  },
  leftCircle: {
    borderTopRightRadius: scaledSize(70),
    borderBottomRightRadius: scaledSize(70),
  },
  rightCircle: {
    left: widthPercentageToDP(81),
    width: widthPercentageToDP(5),
    height: heightPercentageToDP(5),
    borderTopLeftRadius: scaledSize(70),
    borderBottomLeftRadius: scaledSize(70),
  },
  rightCircleGroupDeal: {
    backgroundColor: '#f5f5f5',
    width: widthPercentageToDP(4),
    height: heightPercentageToDP(4),
    borderTopLeftRadius: scaledSize(70),
    borderBottomLeftRadius: scaledSize(70),
    borderLeftWidth: 0.55,
    borderLeftColor: '#f5f5f5',
  },
  offIconstyle: {
    width: widthPercentageToDP(23),
    marginRight: widthPercentageToDP(3),
    height: heightPercentageToDP(5),
    resizeMode: 'contain',
  },
  iconStyle: {
    width: widthPercentageToDP(23),
    height: heightPercentageToDP(13),
    resizeMode: 'contain',
  },
  imageView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.3,
  },
  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.17,
  },
  whatsappCircleGroupDeal: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
  },
  buttonImage: {
    height: scaledSize(25),
    width: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
});

const mapStateToProps = state => {
  return {
    groupSummary: state.groupSummary,
    userPref: state.login.userPreferences,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

const GroupDealCoupon = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(GroupDealCouponBase)
);

export default withTranslation()(GroupDealCoupon);
