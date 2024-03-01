/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component, PureComponent} from 'react';
import {
  Dimensions,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  Linking,
  //Share,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { currentUser} from '../UserProfile/actions';
import { changeField as changeFieldLogin } from '../Login/actions';
import {connect, Dispatch} from 'react-redux';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import { Slider } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import ViewMoreText from 'react-native-view-more-text';
import Button from '../../../components/Button/Button';
import moment from 'moment';
import {scaledSize, AppWindow, heightPercentageToDP, widthPercentageToDP} from '../../../utils';
import {Colors, Fonts} from '../../../../assets/global';
import ItemCard from './Component/ItemCard';
import { FreeGiftListComponent, GroupOrderOverlay, DealExpireCounter, FreeSampleBanner } from './Component';
import Steps from './Component/Steps';
import LinearGradientButton from '../../../components/Button/LinearGradientButton';
import Checked from '../../../../../assets/jsStringSvgs/Checked';
import {Images} from '../../../../assets/images';
import {withTranslation} from 'react-i18next';
import {changeField, getGroupSummary} from './actions';
import NavigationService from '../../../utils/NavigationService';
import {Constants} from '../../../styles';
import {AppText} from '../../../components/Texts';
import CLFlowBanner from '../PastOrders/Component/CLFlowBanner';
import {
  LogFBEvent,
  Events,
  SetScreenName,
  inviteToken,
  invitorName,
} from '../../../Events';
import {
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native-gesture-handler';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import idx from 'idx';
import Rewards from '../../../components/RewardDetails/Reward';
// import CountDown from 'react-native-countdown-component';
import { getOrderDetails } from '../PastOrders/actions';
import { showToastr } from '../utils';
import GroupDealCoupon from './Component/GroupDealCoupon';
import DealStepper from './Component/DealStepper'

class OrderConfirmationBase extends PureComponent {
  constructor(private router: Router) {
    super();
    this.state = {
      targetReached: true,
      bottomStepsLayoutHight: scaledSize(590),
      viewMoreOrders: true,
      value: 0,
      paymentSignatureFailed:undefined
    };
    this.shareToWhatsApp = this.shareToWhatsApp.bind(this);
    this.startTimeM = '';
    this.durationM = '';
  }
  
   componentWillMount() {
    this.startTimeM = new Date().getTime();
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick
      );
   }

   componentDidMount() {
    const {dispatch,paymentSignatureFailed} = this.props;
    if (!this.props.userProfile)
      this.props.onCurrentUser();
    this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
      this.props.onGetGroupSummary(); 
      this.props.dispatch(changeFieldLogin('currentScreen', 'OrderConfirmation'));
    });

    if(paymentSignatureFailed){
      this.setState({paymentSignatureFailed:paymentSignatureFailed})
      dispatch({
        type: 'home/SET_STATE',
        payload: {
          paymentSignatureFailed:undefined,
        },
      });
    } 
    
    dispatch({
      type: 'home/SET_STATE',
      payload: {
        cartOrderPlaced: false,
      },
    });
    this.durationM = new Date().getTime() - this.startTimeM;
    SetScreenName(Events.LOAD_GROUP_SCREEN.eventName());
    LogFBEvent(Events.LOAD_GROUP_SCREEN, {timeTaken: this.durationM});
  }

  componentWillUnmount() {
    this.props.dispatch(changeFieldLogin('currentScreen', null));
    this._unsubscribe.remove();

    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    NavigationService.goBack();
    return true;
  }

  componentDidUpdate(previousProps, previousState) {
    console.log('group summary props are', this.props);
    console.log('group discount state:', this.state);
  }

   shareToWhatsApp = async (text): Promise<void> => {
    this.closeOverly();
    const {t, rewards, dispatch} = this.props;

    const language = this.props.i18n.language;
    const {groupDetails} = this.props.groupSummary;
    const items = groupDetails.summary || [];
    const selfItem = items.filter(item => item.isSelf)[0] || {};
    const joiningBonus =
      rewards && rewards.rewardsInfo && rewards.rewardsInfo.joiningBonus;
    const fgStatus =
      (this.props.login.userPreferences &&
        this.props.login.userPreferences.userCat &&
        this.props.login.userPreferences.userCat.fgStatus) ||
      'UNCLAIMED';
    const offerEndDate =
      this.props.groupSummary.groupDetails.info.offerEndDate / 1000;
    const formattedDate = moment.unix(offerEndDate).format('LL');

    const deepLinkUrl = this.props.groupSummary.groupDetails.info.deepLinkUrl;
    let shareMsg = '';
    let youtubeLink = '';
    if(fgStatus === 'UNCLAIMED' || fgStatus === 'CLAIMED') {
     if (language === 'kannada') {
        youtubeLink = 'https://youtu.be/L5XhsnzYEN4'
      } else {
        youtubeLink = 'https://youtu.be/xre13f15uYc';
      }
      shareMsg = t(
        '#YOUTUBELINK# #NL# 👁 *Bigg Boss Chaitra* has invited you to select a free gift🆓🆓🎁 #NL##NL# I already claimed my *free gift*💃 #NL##NL# Claim your free gift now 🎉🎉 before offer expires on *#DATE#*  - *#DEEPLINKURL#*',
        {
          YOUTUBELINK: youtubeLink,
          DATE: formattedDate,
          DEEPLINKURL: deepLinkUrl,
          NL: '\n',
          interpolation: {escapeValue: false},
        },
      );
    } else {
      //youtubeLink = encodeURI('https://youtu.be/IiArPcpiAoM')
      if (language === 'kannada') {
        youtubeLink = 'https://youtu.be/SXoDWCXXBLg'
      } else {
        youtubeLink = 'https://youtu.be/-Zq0e3dqCoM';
      }
      groupDetails.summary.length > 0
        ? (shareMsg = t(
          '#YOUTUBELINK# #NL##NL# 🙏🙏I am gifting you *₹#JOININGBONUS# reward & FREE GIFT* on your first purchase #NL##NL#Join my *Savings group* and get lowest prices in the city, upto *70%* off on food, personal care, kitchen & 500+ more items on *Glowift* .*#NL##NL# I have already saved *₹#SAVEDAMOUNT#* #NL##NL# *Hurry up and order now* #NL# #DEEPLINKURL# #NL# Offer expires on *#DATE#*',
            {
              YOUTUBELINK: youtubeLink,
              SAVEDAMOUNT: selfItem.saving || 100,
              JOININGBONUS: joiningBonus || 50,
              DATE: formattedDate,
              DEEPLINKURL: deepLinkUrl,
              NL: '\n',
              interpolation: {escapeValue: false},
            },
          ))
        : (shareMsg = t(
          '#YOUTUBELINK# #NL##NL# 🙏🙏I am gifting you *₹#JOININGBONUS# reward & FREE GIFT* on your first purchase #NL##NL#Join my *Savings group* and get lowest prices in the city, upto *70%* off on food, personal care, kitchen & 500+ more items on *Glowfit*.*#NL##NL# I have already saved *₹#SAVEDAMOUNT#* #NL##NL# *Hurry up and order now* #NL# #DEEPLINKURL# #NL# Offer expires on *#DATE#*',
            {
              YOUTUBELINK: youtubeLink,
              SAVEDAMOUNT: selfItem.saving || 100,
              JOININGBONUS: joiningBonus || 50,
              DATE: formattedDate,
              DEEPLINKURL: deepLinkUrl,
              NL: '\n',
              interpolation: {escapeValue: false},
            },
          ));
    }

    // Code to share image
    Share.isPackageInstalled('com.whatsapp').then(({isInstalled}: any) => {

      if (isInstalled) {
        const shareOptions = {
          title: 'Share via',
          message: shareMsg,
          social: Share.Social.WHATSAPP,  // country code + phone number(currently only works on Android)
          filename: 'test' , // only for base64 file in Android 
        };
        try {
          Share.shareSingle(shareOptions);
        } catch (error) {
          LogFBEvent(Events.SHARE_FAILURE, null)
          console.error(error);
        }
      }
    })

    LogFBEvent(Events.SHARE_WHATSAPP_CLICK, {
      isGroupTargetReached: this.state.targetReached,
      groupCode: this.props.groupSummary.groupDetails.info.groupCode,
      userId: this.props.groupSummary.groupDetails.info.userId,
      groupAmount: this.props.groupSummary.groupDetails.info.groupOrderAmount,
      groupSize: this.props.groupSummary.groupDetails.summary.length,
      page: this.props.navigation.state.routeName,
      component: 'GROUP_DISCOUNT'
    });
  };

  onItemClick = (item) => {
    this.setState({paymentSignatureFailed:undefined})
    this.props.onGetOrderDetails({ id: item.orderid });
  }  

  render() {
    const {t, loading, groupSummary, rewards, userProfile } = this.props;
    if (!this.props.groupSummary.initialApiCallCompleted || loading) {
      return (
        <View style={{flex: 1, marginTop: 10, padding: 10}}>
          {[1, 2, 3, 4, 5].map(() => {
            return (
              <Placeholder Animation={Fade} Left={PlaceholderMedia}>
                <PlaceholderLine width={80} />
                <PlaceholderLine style={{marginVertical: 10}} />
                <PlaceholderLine width={30} />
              </Placeholder>
            );
          })}
        </View>
      );
    }

    const earned = rewards && rewards.earned || 0;
    const {groupDetails} = this.props.groupSummary;
    const language = this.props.i18n.language;
    const userPreference = this.props.login.userPreference
    const refferalUserDetails = groupDetails.referralUserDetails && groupDetails.referralUserDetails.userInfo;
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    const mallInfo = idx(this.props.login, _ => _.clDetails.mallInfo);
    const mallType = mallInfo && mallInfo.type;

    const items = groupDetails.summary || [];
    const selfItem = items.filter(item => item.isSelf)[0] || {};
    const orderItems = groupDetails.ordersDetails || [];
    const deliveryCharges = groupDetails.deliveryCharges || 0;
    let lastOrderedItemArr = orderItems.length > 0 ? orderItems[0] : {};
    const isLastOrderJoiningFreeGift = lastOrderedItemArr ? lastOrderedItemArr.isJoiningFreeGift : false; 
    
    const offerEndDate = groupDetails.info.offerEndDate;
    const ordersDetails = groupDetails.ordersDetails || [];
    let sumTotal = ordersDetails.reduce((total, num) => {
      return total + parseInt(num.totalPrice)
    }, 0);
    sumTotal = sumTotal+deliveryCharges;
    const totalSaving = ordersDetails.reduce((total, num) => {
      return total + parseInt(num.saving)
    }, 0);
    const now = Date.now();
    const dealEndsDate = offerEndDate - now;
    const groupOrderAmount = groupDetails.info.groupOrderAmount || 0;
    const bucketLimitEnd = groupDetails.info.bucketLimitEnd;
    //const dealEndsDate = ((moment(groupDetails.info.offerEndDate)).diff(moment(new Date()))).format("HH:mm:ss");
    let stepsData, selectedStep;
    const {userPreferences} = this.props.login;
    const fgStatus = userPreferences.userCat.fgStatus;
    const deliveryDate = idx(userPreferences, _ => _.userPreferences.slottedDelivery.deliveryDate);
    // const formattedDeliveryDate = moment.unix(deliveryDate / 1000).format('LL');
    const formattedDeliveryDate = deliveryDate;
    const referralBonus =
      rewards && rewards.rewardsInfo && rewards.rewardsInfo.refferalBonus;
      const joiningBonus =
      rewards && rewards.rewardsInfo && rewards.rewardsInfo.joiningBonus;
    const pendingAmount = bucketLimitEnd - groupOrderAmount;
    const {width, height} = Dimensions.get('window');
    const isFriendsOrder = groupDetails.summary.filter((data) => !data.isSelf);
    const RefereeCurrentCycleAll = refferalUserDetails && refferalUserDetails.filter((data) => data.isCurrentCycleUser);
    let hasUserPlacedOrder = selfItem.isSelf;

    let RefereeCurrentCycle = [];
    RefereeCurrentCycleAll && RefereeCurrentCycleAll.forEach(element => {
      groupDetails.summary.forEach(summ => {
        if(element.userid === summ.userId)
        RefereeCurrentCycle = RefereeCurrentCycle.concat(element)
      });
    });
    const userName = userProfile && userProfile.name || '--'
  
    let orderStatus = '';
   
   if (hasUserPlacedOrder) {
    orderStatus = t('Orders Confirmed');
   }

    let imageSrc = this.state.targetReached ? Images.tick: Images.error;
    if(isLastOrderJoiningFreeGift) {
      lastOrderedItemArr = orderItems[1] || [];
    }

    const {paymentSignatureFailed} = this.state;
    let errorText = (paymentSignatureFailed) ? 'We have not received payment, Your order is converted into COD' : 'Your order is placed if we do not receive your payment we will convert this order into COD';

    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1}}>
            <ScrollView style={{ maxHeight: heightPercentageToDP(100), paddingBottom: scaledSize(5) }}>
            <View style={[styles.textView]}>
            {hasUserPlacedOrder && Object.keys(lastOrderedItemArr).length > 0 ? 
              <View style={[styles.textStyle, { backgroundColor: Constants.white}]}>
                <View style={{flexDirection: 'row'}}>
                 <ImageBackground
                      source={{uri: lastOrderedItemArr.mediaJson.square}}
                      style={styles.topImage}
                    />
                <Image source={imageSrc} style={styles.iconStatus}/>
                </View>
                <AppText black size="M" bold style={{textAlign: 'center', padding: scaledSize(3)}}>
                {orderStatus}
              </AppText>
              </View> : <View style={styles.textStyle} /> }
              {
                (paymentSignatureFailed != undefined)
                ?
                <View style={{paddingHorizontal:widthPercentageToDP(3)}}>
                  <AppText bold red size="M" style={{ textAlign: 'center'}}>{t(errorText)}</AppText>
                </View> : null
              }
            {this.props.login && (
            <FreeSampleBanner screen={this.props.navigation.state.routeName} 
            userPref={this.props.login.userPreferences} groupSummary={groupSummary}/>)} 
                <View style={styles.orderConfirmationBox}>
                  <GroupDealCoupon 
                    items={items}
                    selfItem={selfItem}
                    screen={this.props.navigation.state.routeName}
                    dealEndsDate={dealEndsDate}
                    referralBonus={referralBonus}
                    t={t}
                    rewards={rewards}
                    groupSummary={groupSummary}
                    language={language}
                    userPreference={userPreference}
                    //shareToWhatsApp={this.shareToWhatsApp}
                    RefereeCurrentCycle={RefereeCurrentCycle}
                    userName={userName}
                  /></View>
            </View> 
            <DealStepper  
              t={t}
              referralBonus={referralBonus}
            />
            {/* {userMode=='CU' && mallType != 'CL' ? <CLFlowBanner />  : null}        */}
            <View style={[styles.orderBox, {paddingHorizontal: widthPercentageToDP(2)}]}>
              <View style={styles.orderStatus}>
                {hasUserPlacedOrder ?
                <View style={[styles.pastOrders, {paddingVertical: heightPercentageToDP(2)}]}>
                  <View style={{ flexDirection: 'row'}}>
                    <AppText bold black size="M" style={{ flex: 0.5 }}>{t(`Your Order Details`)}</AppText>
                  </View> 
                 {
                   ordersDetails.map((order, index) => <GroupOrderOverlay
                   item={order}
                   index={index}
                   isGroupUnlocked={this.state.targetReached}
                   withoutButton={true}
                   isLast={false}
                   showPriceTags={true}
                   showRewards={true}
                   showOrderStatus={true}
                   showBottomMenu={false}
                   showOrderId={true}
                   showQuantity={true}
                   withoutTag
                   mediaJson={order.mediaJson}
                   onItemClick={this.onItemClick}
                   showArrow={false}
                   screen={this.props.navigation.state.routeName}
                   deliveryDate={formattedDeliveryDate}
                   rewards={rewards}
                    groupSummary={groupSummary}
                    language={language}
                    userPreference={userPreference}
                   //shareToWhatsApp={this.shareToWhatsApp}
                  />) }
                  <View>
                    <View style={styles.priceSummary}>
                      <View style={{ flexDirection: 'row'}}>
                        <AppText size="S" style={{ flex: 0.4 }}>{t(`Total items`)}</AppText>
                        <AppText size="S" style={{ flex: 0.6, textAlign: 'right' }}>{t(`#ORDERLENGTH#`, { ORDERLENGTH: ordersDetails.length} )}</AppText>
                      </View>
                      <View style={{ flexDirection: 'row'}}>
                        <AppText size="S" style={{ flex: 0.4 }}>{t(`You Save`)}</AppText>
                        <AppText size="S" style={{ flex: 0.6, textAlign: 'right', color: Constants.greenishBlue }}>{t(`₹#TOTALSAVING#`, {TOTALSAVING: totalSaving} )}</AppText>
                      </View>
                      <View style={{ flexDirection: 'row'}}>
                        <AppText size="S" style={{ flex: 0.4 }}>{t(`Delivery Fee`)}</AppText>
                        <AppText size="S" style={{ flex: 0.6, textAlign: 'right', color: Constants.greenishBlue }}>{t(deliveryCharges)}</AppText>
                      </View>
                      <View style={{ flexDirection: 'row', marginTop: scaledSize(2)}}>
                        <AppText size="L" bold style={{ flex: 0.4 }}>{t(`You Pay`)}</AppText>
                        <AppText size="L" bold style={{ flex: 0.6, textAlign: 'right' }}>{t(`₹#SUMTOTAL#`, { SUMTOTAL: sumTotal } )}</AppText>
                      </View>
                    </View>
                  </View>
                </View> : null}
                <View style={styles.itemView}>
                  {isFriendsOrder.length > 0 ? 
                  <View>
                    <View style={{ flexDirection: 'row'}}>
                      <AppText size="M" bold black style={{ flex: 0.5 }}>{t(`Friend's Order Details`)}</AppText>
                      {/* <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                        <AppText white bold size="XXS" style={{ backgroundColor: orderStatus === 'Order Not Complete' ? Colors.tomato : Constants.primaryColor, padding: widthPercentageToDP(1) }}>{t(`#ORDERSTATUS#`, { ORDERSTATUS : orderStatus } )}</AppText>
                      </View> */}
                    </View> 
                    <ItemCard
                      targetReached={this.state.targetReached}
                      fgStatus={fgStatus}
                      isTransparent
                      items={items}
                      selfItem={selfItem}
                      dealEndsDate={dealEndsDate}
                      deliveryDate={deliveryDate}
                    />
                  </View> : null}
                  <View style={{ height: heightPercentageToDP(5) }}></View>
                </View>
              </View>
            </View>
              </ScrollView>
          </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: heightPercentageToDP(3),
    // backgroundColor: '#f5f5f5'
  },
  iconStatus: {
    width: 25, 
    height: 25, 
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginLeft: -5,
  },
  imagestyle: {
    alignSelf: 'center',
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginTop: 5,
  },
  offIconstyle: {
    width: widthPercentageToDP(25), 
    height: heightPercentageToDP(8), 
    resizeMode: 'contain'
  },
  groupTargetBox: {
    width: '80%',
    height: scaledSize(30),
    backgroundColor: Constants.black,
    color: Constants.white,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  productView: {
    flexDirection: 'row', 
    marginTop: scaledSize(14)
  },
  topImage: {
    height: heightPercentageToDP(8),
    width: widthPercentageToDP(12),
    resizeMode: 'contain',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    alignSelf: 'center',
  },
  arrowDown: {
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderTopColor: Constants.black,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  congratsText: {
    textAlign: 'center',
  },
  textView: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    width: widthPercentageToDP(100),
    flex: 1,
    height: heightPercentageToDP(88),
  },
  orderConfirmationBox: {
    backgroundColor: Constants.white,
    alignItems: 'center',
    flex: 0.4,
    marginTop: heightPercentageToDP(2),
    width: widthPercentageToDP(91),
  },
  textStyle: {
    color: Constants.white,
    width: widthPercentageToDP(100),
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: scaledSize(3),
  },
  progressView: {
    // marginTop: scaledSize(140),
    margin: scaledSize(5),
    marginBottom: 2
  },
  itemView: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.mutedBorder,
  },
  stepView: {
    margin: scaledSize(10),
  },
  buttonMainView: {
    alignItems: 'center',
    padding: scaledSize(5),
    width: '100%',
  },
  buttonInnerText: {
    width: '95%',
  },
  buttonImage: {
    height: scaledSize(25),
    width: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
  footerView: {
    // position: 'absolute',
    // bottom: 0,
    paddingBottom: scaledSize(10),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.mutedBorder,
    // zIndex: 0,
    width: '100%',
  },
  thumbStyle: {
    height: 20,
    width: 20,
    borderRadius: 25,
    backgroundColor: '#E1540E', //Constants.secondaryColor
    borderWidth: 3,
    borderColor: Constants.white,
    shadowColor: '#00f',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
  },
  trackStyle: {
    height: 10,
    borderRadius: 10,
  },
  orSeperator: {
    flex: 0.2,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: scaledSize(5),
    paddingBottom: scaledSize(5),
  },
  orderStatus: {
    flex: 0.8,
  },
  orderConfirmation: {
    flex: 0.3,
    padding: scaledSize(5)
  },
  orderBox: {
    flex: 0.3,
  },
  pastOrders: {
    // backgroundColor: Constants.primaryColor 
    flex: 0.8,
    //paddingVertical: heightPercentageToDP(2)
  },
  readMoreText: {
    color: '#b0aeae',
    fontWeight: '500',
    fontFamily: Fonts.roboto,
  },
  priceSummary: {
    flex:1,
    flexDirection: 'column',
    // alignItems: 'flex-end',
  }
});

const mapStateToProps = state => {
  return {
    groupSummary: state.groupSummary,
    login: state.login,
    rewards: state.rewards.rewards,
    loading: state.ShippingList.loading,
    booking: state.booking.booking,
    userProfile: state.userProfile.user,
    paymentSignatureFailed:state.home.paymentSignatureFailed,
  };
};

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  onGetGroupSummary: () => {
    dispatch(getGroupSummary());
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
  onGetOrderDetails: (obj: Object) => {
    dispatch(getOrderDetails(obj));
  }, 
  onCurrentUser: () => {
    dispatch(currentUser());
  },
  // other callbacks go here...
});
const style = {
  height: 50,
};

const OrderConfirmation = withTranslation()(
  connect(
    mapStateToProps,
    mapDipatchToProps,
  )(OrderConfirmationBase),
);

export default OrderConfirmation;
