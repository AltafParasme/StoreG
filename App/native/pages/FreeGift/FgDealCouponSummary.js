import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Images} from '../../../../assets/images';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../components/Texts';
import {Constants} from '../../../styles';
import {processTextAndAppendElipsis} from '../../../utils/misc';
import DealExpireCounter from '../OrderConfirmation/Component/DealExpireCounter';
import LinearGradientButton from '../../../components/Button/LinearGradientButton';
import Button from '../../../components/Button/Button';
import NavigationService from '../../../utils/NavigationService';
import {connect, Dispatch} from 'react-redux';
import {Icon} from 'react-native-elements';
import {shareToWhatsApp} from '../utils';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
  isFreeGiftCategory,
} from '../../../utils';
import idx from 'idx';

class FgDealCouponSummaryBase extends Component {
  constructor(props) {
    super(props);
    this.navigateToFreeGiftDeal = this.navigateToFreeGiftDeal.bind(this);
  }

  navigateToFreeGiftDeal() {
    const ordersDetails = idx(this.props.groupSummary, _ => _.groupDetails.ordersDetails) || [];
    const freeOrderItem =
      ordersDetails.filter(orderItems => isFreeGiftCategory(orderItems)) || [];

    if (freeOrderItem.length) {
      NavigationService.navigate('FreeGift');
    } else {
      NavigationService.navigate('Home', {
        actionId: 'free-gift',
      });
    }
  }

  render() {
    let {
      t,
      rewards,
      userPreference,
      groupSummary,
      language,
      referralBonus,
      freeOrderItem,
      freeGiftClaimed,
      currentCycleUsers,
      userName,
      groupDeals,
    } = this.props;
    const len = currentCycleUsers.length;
    const remaining = 4 - len;
    const displayUsers = [1, 2];
    let eventProps = {
      component: 'FG_DEAL_COUPON',
      page: 'Group Discount',
    };

    const tagContent = valueItem => {
      let value = valueItem.item || null;
      let index = valueItem.index;
      let initial =
        value &&
        value.name &&
        value.name
          .split(' ')
          .map(function(s) {
            return s.charAt(0);
          })
          .join('');
      let colors = ['#123456', '#654321', '#fdecba', '#abcdef'];

      return (
        <View>
          {index === 0 ? (
            <View style={styles.normalCircle}>
              <AppText size="XS" white bold style={{textAlign: 'center'}}>
                {userName && userName.charAt(0)}
              </AppText>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() =>
                shareToWhatsApp(
                  this.props.screen,
                  'FgDealCoupon',
                  eventProps,
                  t,
                  rewards,
                  language,
                  groupSummary,
                  userPreference,
                  'FgDealCoupon'
                )
              }>
              <View
                style={[
                  styles.normalCircle,
                  {
                    backgroundColor: Constants.white,
                    borderStyle: 'dashed',
                    borderWidth: 1,
                    borderColor: Constants.primaryColor,
                    marginLeft: -10,
                  },
                ]}>
                <Icon
                  type="foundation"
                  name="plus"
                  color={Constants.primaryColor}
                  size={14}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    };

    let dealSummaryText;
    let dealSummarySubText;

    if (!freeGiftClaimed) {
      dealSummaryText = t('GET YOUR FREE GIFT');
      dealSummarySubText = t(`Get #REMAINING# friends to join Glowfit`, {
        REMAINING: remaining,
      });
    } else {
      dealSummaryText = t('You got your free gift');
      dealSummarySubText = t(`4 friends joined on Glowfit`);
    }

    return (
      <TouchableOpacity
        style={styles.actionBox}
        onPress={this.navigateToFreeGiftDeal.bind(this)}>
        <View style={styles.textHeadingGroupDeals}>
          <View
            style={{
              flexDirection: 'row',
              //justifyContent: 'space-between',
              flex: 1,
            }}>
            <View style={styles.upperMessageGroupDealStyle}>
              {/* <AppText size="M" bold white>
                {dealSummaryText}
              </AppText> */}
              <AppText size="S" black>
                {dealSummarySubText}
              </AppText>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: Constants.white,
            flex: 0.95,
            flexDirection: 'column',
          }}>
          <View
            style={[
              styles.commonCircle,
              {flex: 0.4},
            ]}>
            <View
              style={{
                flex: 1,
              }}>
              <DealExpireCounter
                targetReached={true}
                isTransparent
                items={this.props.items}
                selfItem={this.props.selfItem}
                dealEndsDate={this.props.dealEndsDate}
              />
            </View>
            {/* <View style={styles.rightCircleGroupDeal} /> */}
          </View>

          {
            <View
              style={{
                flex: 0.95,
                //borderWidth: 1,
                //borderColor: '#e3e3e3',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: heightPercentageToDP(1),
                  flex: 0.9,
                }}>
                <View style={{flex: 0.85, flexDirection: 'row'}}>
                  {/* <View
                    style={{
                      flex: 0.3,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <FlatList
                      contentContainerStyle={styles.grid}
                      numColumns={4}
                      showsVerticalScrollIndicator={false}
                      data={displayUsers}
                      renderItem={value => tagContent(value)}
                    />
                  </View> */}
                  <View style={{flex: 0.05}}/>
                  <View
                    style={{
                      flex: 0.65,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <AppText bold size="S">
                      {freeGiftClaimed
                        ? t(`Free gift confirmed, now get it delivered with your next paid order.`)
                        : t(`Waiting for #REMAINING# friends to join`, {
                            REMAINING: remaining,
                          })}
                    </AppText>
                    <AppText size="XS">
                      {t('🔥 123132 people got free gift')}
                    </AppText>
                  </View>
                </View>
                <View style={styles.iconView}>
                  {freeGiftClaimed ? <View style={styles.detailBox}><AppText white>Check Details</AppText></View> :
                  <TouchableOpacity
                    onPress={() =>
                      shareToWhatsApp(
                        this.props.screen,
                        'FgDealCoupon',
                        eventProps,
                        t,
                        rewards,
                        language,
                        groupSummary,
                        userPreference,
                        'FgDealCoupon'
                      )
                    }
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center"
                    }}>
                    <View style={styles.shareBox}>
                    <View style={styles.whatsappCircle}>
                      <Icon
                        type="font-awesome"
                        name="whatsapp"
                        color={Constants.white}
                        size={widthPercentageToDP(6)}
                        containerStyle={{
                          alignSelf: "center",
                        }}
                      />
                    </View>
                    <AppText white>Share & Earn</AppText>
                  </View>
                  </TouchableOpacity>}
                </View>
                <View style={{flex: 0.05}}/>
              </View>
            </View>
          }
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
    borderColor: '#e3e3e3',
    borderWidth: 1
  },
  textHeading: {
    backgroundColor: '#ff7200',
    flex: 0.28,
    // justifyContent: 'space-between',
  },
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  commonCircle: {
    flexDirection: 'row',
    flex: 0.1,
  },
  normalCircle: {
    backgroundColor: Constants.primaryColor,
    width: scaledSize(40),
    height: scaledSize(40),
    borderRadius: 40 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftCircle: {
    backgroundColor: '#f5f5f5',
    width: widthPercentageToDP(5),
    height: heightPercentageToDP(5),
    borderTopRightRadius: scaledSize(70),
    borderBottomRightRadius: scaledSize(70),
    borderRightWidth: 0.56,
    borderRightColor: '#f5f5f5',
  },
  rightCircle: {
    backgroundColor: '#f5f5f5',
    left: widthPercentageToDP(81),
    width: widthPercentageToDP(5),
    height: heightPercentageToDP(5),
    borderTopLeftRadius: scaledSize(70),
    borderBottomLeftRadius: scaledSize(70),
    borderLeftWidth: 0.56,
    borderLeftColor: '#f5f5f5',
  },
  rightCircleGroupDeal: {
    backgroundColor: '#f5f5f5',
    //left: widthPercentageToDP(21),
    width: widthPercentageToDP(4),
    height: heightPercentageToDP(4),
    borderTopLeftRadius: scaledSize(70),
    borderBottomLeftRadius: scaledSize(70),
    borderLeftWidth: 0.55,
    borderLeftColor: '#f5f5f5',
  },
  offIconstyle: {
    width: widthPercentageToDP(15),
    height: heightPercentageToDP(6),
    resizeMode: 'contain',
  },
  upperMessageStyle: {
    flexDirection: 'column',
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: widthPercentageToDP(5),
  },
  upperMessageGroupDealStyle: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: widthPercentageToDP(5),
  },
  imageView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%'
  },
  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.35,
  },
  detailBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.primaryColor,
    height: widthPercentageToDP(6),
    paddingVertical: 15,
    paddingHorizontal: 5
  },
  buttonImage: {
    height: scaledSize(25),
    width: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
  textHeadingGroupDeals: {
    //backgroundColor: '#ff7200',
    flex: 0.28,
    alignItems: 'center',
    justifyContent: 'center',
    // justifyContent: 'space-between',
  },
  shareBox: {
    flexDirection: 'row',
    backgroundColor: '#1ad741',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingRight: widthPercentageToDP(1)
  },
  whatsappCircle: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
  },
});

const mapStateToProps = state => {
  return {
    groupSummary: state.groupSummary,
  };
};

const FgDealCouponSummary = withTranslation()(
  connect(mapStateToProps)(FgDealCouponSummaryBase)
);

export default FgDealCouponSummary;