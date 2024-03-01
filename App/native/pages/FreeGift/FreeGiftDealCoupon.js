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
import {Icon} from 'react-native-elements';
import {shareToWhatsApp} from '../utils';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../utils';
import NavigationService from '../../../utils/NavigationService';

class FreeGiftDealCoupon extends Component {
  constructor(props) {
    super(props);
    this.navigateToHome = this.navigateToHome.bind(this);
  }

  navigateToHome() {
    NavigationService.navigate('Home', {actionId: 'free-gift'});
  }

  render() {
    let {
      t,
      screen,
      referralBonus,
      currentCycleUsers,
      freeGiftClaimed,
      freeOrderItem,
      userName,
      rewards,
      userPreference,
      groupSummary,
      language,
    } = this.props;

    let displayUsers = [];
    const len = currentCycleUsers.length;
    const remaining = 4 - len;

    let eventProps = {
      component: 'FREE_GIFT_DEAL_COUPON',
      page: 'Group Discount',
    };
    //Case when no one else has joined
    if (currentCycleUsers.length == 0) {
      displayUsers.push(
        {name: userName, type: 'Normal'},
        {name: t('Friend 1'), type: 'Dashed'},
        {name: t('Friend 2'), type: 'Dashed'},
        {name: t('Friend 3'), type: 'Dashed'},
        {name: t('Friend 4'), type: 'Dashed'}
      );
    }
    //Case when joined users are less than 4
    else if (currentCycleUsers.length < 4) {
      displayUsers.push({name: userName, type: 'Normal'});
      displayUsers = displayUsers.concat(currentCycleUsers);
      for (let i = 0; i < remaining; i++) {
        displayUsers.push({name: `Friend ${len + i + 1}`, type: 'Dashed'});
      }
    } else {
      displayUsers.push({name: userName, type: 'Normal'});
      displayUsers = displayUsers.concat(currentCycleUsers);
    }
    const tagContent = valueItem => {
      let value = valueItem.item || null;
      let type = value && value.type;
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
        <View>
          {!(type == 'Dashed') ? (
            <View
              style={[
                styles.normalCircle,
                value.name === userName
                  ? {
                      margin: scaledSize(4),
                      backgroundColor: Constants.primaryColor,
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
                style={{textAlign: 'center', marginTop: widthPercentageToDP(3.5)}}>
                {initial}
              </AppText>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() =>
                shareToWhatsApp(
                  this.props.screen,
                  'FreeGiftDealCoupon',
                  eventProps,
                  t,
                  rewards,
                  language,
                  groupSummary,
                  userPreference,
                  'FreeGiftDealCoupon'
                )
              }>
              <View
                style={[
                  styles.normalCircle,
                  {
                    margin: scaledSize(4),
                    backgroundColor: Constants.white,
                    borderStyle: 'dashed',
                    borderWidth: 1,
                    borderColor: Constants.primaryColor,
                  },
                ]}>
                <Icon
                  type="feather"
                  name="plus"
                  color={Constants.primaryColor}
                  containerStyle={{
                    top: widthPercentageToDP(3),
                  }}
                  size={18}
                />
              </View>
            </TouchableOpacity>
          )}
          <AppText
            size="XXS"
            style={{
              textAlign: 'center',
              paddingHorizontal: widthPercentageToDP(2),
            }}>
            {processTextAndAppendElipsis(value.name, 8)}
          </AppText>
        </View>
      );
    };

    return (
      <View style={styles.actionBox}>
        <View style={styles.textHeading}>
          <View
            style={{
              flexDirection: 'row',
              flex: 0.65,
            }}>
            {
              <View
                style={{
                  flexDirection: 'column',
                  flex: 0.7,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  paddingLeft: widthPercentageToDP(5),
                }}>
                {/* <AppText size="M" bold white>
                  {!freeGiftClaimed
                    ? t('GET YOUR FREE GIFT')
                    : t('You got your free gift')}
                </AppText> */}
                <AppText size="S" white>
                  {!freeGiftClaimed
                    ? t(` Get #REMAINING# friends to join Glowfit`, {
                        REMAINING: remaining,
                      })
                    : t('4 friends joined on Glowfit')}
                </AppText>
              </View>
            }
            <View style={styles.imageView}>
              <Image source={Images.gift} style={styles.offIconstyle} />
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#e25b00',
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
        </View>

        <View
          style={{
            backgroundColor: Constants.white,
            flex: 0.72,
            flexDirection: 'column',
          }}>
          <View
            style={{
              flex: 0.35,
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <AppText bold size="S">
              {freeGiftClaimed
                ? t('Get your free gift with next paid order')
                : t(`Waiting for #REMAINING# friends to join`, {
                    REMAINING: remaining,
                  })}
            </AppText>
            <AppText size="XS">{t('🔥 123132 people got free gift')}</AppText>
          </View>
          <View style={styles.commonCircle}>
            <View style={styles.leftCircle} />
            <View style={styles.rightCircle} />
          </View>
          <View style={{flex: 0.28, marginTop: heightPercentageToDP(-5)}}>
            <FlatList
              contentContainerStyle={styles.grid}
              numColumns={4}
              showsVerticalScrollIndicator={false}
              data={displayUsers}
              renderItem={value => tagContent(value)}
            />
          </View>
          <View style={{ flex: 0.1}} />
          <View
            style={{
              flex: 0.18,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: heightPercentageToDP(2),
              //height: heightPercentageToDP(60),
            }}>
            {freeOrderItem.length > 0 ? (
              <LinearGradientButton
                gradientStyles={{
                  width: widthPercentageToDP(75),
                }}
                colors={!freeGiftClaimed ? ['#0dc143', '#0dc143', '#0dc143'] : [Constants.greenishBlue, Constants.greenishBlue]}
                title={!freeGiftClaimed ? t('Invite Friends to get your free gift'): t('Buy Now')}
                titleStyle={{fontSize: scaledSize(15)}}
                onPress={() => {
                  !freeGiftClaimed ? shareToWhatsApp(
                    this.props.screen,
                    'FreeGiftDealCoupon',
                    eventProps,
                    t,
                    rewards,
                    language,
                    groupSummary,
                    userPreference,
                    'FreeGift'
                  ) : NavigationService.navigate('Home')
                }
                }
                btnStyles={{flex: 0.45,flexDirection: 'row'}}>
                {!freeGiftClaimed ? <Image source={Images.whatsapp} style={styles.buttonImage} />: null}
              </LinearGradientButton>
            ) : (
              <LinearGradientButton
                gradientStyles={{
                  width: widthPercentageToDP(75),
                }}
                colors={['#ff7200', '#ff7200', '#ff7200']}
                title={t('Show Free gift')}
                titleStyle={{fontSize: scaledSize(15)}}
                onPress={this.navigateToHome}
                btnStyles={{flex: 0.45, flexDirection: 'row'}}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionBox: {
    flex: 1,
    backgroundColor: '#ffff',
    flexDirection: 'column',
    width: '100%',
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
    margin: scaledSize(10),
    width: scaledSize(44),
    height: scaledSize(44),
    borderRadius: 44 / 2,
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
  offIconstyle: {
    width: widthPercentageToDP(15),
    height: heightPercentageToDP(6),
    resizeMode: 'contain',
  },
  imageView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.3,
  },
  buttonImage: {
    height: scaledSize(25),
    width: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
});

export default withTranslation()(FreeGiftDealCoupon);