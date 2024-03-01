/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, PureComponent} from 'react';
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
import { currentUser,} from '../UserProfile/actions';
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
import {isFreeGiftCategory, scaledSize, AppWindow, heightPercentageToDP, widthPercentageToDP} from '../../../utils';
import {Colors, Fonts} from '../../../../assets/global';
import { FreeGiftListComponent, GroupOrderOverlay, DealExpireCounter } from '../OrderConfirmation/Component';
import Steps from './Component/Steps';
import LinearGradientButton from '../../../components/Button/LinearGradientButton';
import Checked from '../../../../../assets/jsStringSvgs/Checked';
import {Images} from '../../../../assets/images';
import {withTranslation} from 'react-i18next';
import {changeField, getGroupSummary} from '../OrderConfirmation/actions';
import NavigationService from '../../../utils/NavigationService';
import {Constants} from '../../../styles';
import {AppText} from '../../../components/Texts';
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
import Rewards from '../../../components/RewardDetails/Reward';
// import CountDown from 'react-native-countdown-component';
import { getOrderDetails } from '../PastOrders/actions';
import { showToastr } from '../utils';
import FreeGiftDealCoupon from './FreeGiftDealCoupon';
import DealStepperFreeGift from './DealStepperFreeGift.js'

class FreeGiftBase extends PureComponent {
  constructor(private router: Router) {
    super();
    this.state = {
      targetReached: false,
      bottomStepsLayoutHight: scaledSize(590),
      isOverlay: true,
      viewMoreOrders: true,
      value: 0,
    };
  }


  componentDidMount() {
    if (!this.props.userProfile)
      this.props.onCurrentUser();
    this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
      this.props.onGetGroupSummary();  
    });
    SetScreenName(Events.LOAD_FREEGIFT_SCREEN.eventName());
    LogFBEvent(Events.LOAD_FREEGIFT_SCREEN, null);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    this._unsubscribe.remove();
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    NavigationService.navigate('Home', {actionId: 'hot-deals'});
    return true;
  }

  componentDidUpdate(previousProps, previousState) {
    console.log('free gift', this.props);
    console.log('free gift state:', this.state);
  }

  
   
  onBottomStepsLayout(event) {
    //const { x,y, width, height } = event.nativeEvent.layout;
    const y = (AppWindow.height * 75) / 100;
    this.setState({
      bottomStepsLayoutHight: y,
    });
  }

  navigateTo = () => {
    const {dispatch} = this.props;
    NavigationService.navigate('Home');
  };

  onItemClick = (item) => {
    this.props.onGetOrderDetails({ id: item.orderid });
  }  

  render() {
    const {t, loading, groupSummary, rewards, userProfile } = this.props;
    
    if (!this.props.groupSummary.initialApiCallCompleted) {
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
    const {groupDetails, isOverlay} = this.props.groupSummary;
    const {userPreferences} = this.props.login;
    const language = this.props.i18n.language;
    const refferalUserDetails = groupDetails.referralUserDetails.userInfo || [];
    
    const items = groupDetails.summary || [];
    const selfItem = items.filter(item => item.isSelf)[0] || {};
    const orderItems = groupDetails.ordersDetails;
    const freeOrderItem = orderItems.filter(orderItems => isFreeGiftCategory(orderItems)) || [];
    const freeItem = freeOrderItem[0];
    const offerEndDate = groupDetails.info.offerEndDate;
    const ordersDetails = groupDetails.ordersDetails || [];
    const now = Date.now();
    const dealEndsDate = offerEndDate - now;
    
   // const fgStatus = userPreferences.userCat.fgStatus;
    const deliveryDate = groupDetails.info.deliveryDate;
    const formattedDeliveryDate = moment.unix(deliveryDate / 1000).format('LL');
    const referralBonus =
      rewards && rewards.rewardsInfo && rewards.rewardsInfo.refferalBonus;
    const {width, height} = Dimensions.get('window');
    let referralUsers = refferalUserDetails.filter((data) => data.isMyReferral && data.isCurrentCycleUser) || [];
    const currentCycleUsers = referralUsers.filter((data) => data.userId !== groupDetails.info.userId);
    const freeGiftClaimed = currentCycleUsers.length >= 4 ? true : false;  
    const userName = userProfile && userProfile.name || '--'
  
    let orderStatus = '';
    let imageSrc = '';
    let backgroundColor;
    if (freeOrderItem.length > 0 ) {
        if(freeGiftClaimed) {
          orderStatus = t('Congrats!, Your FREE gift is confirmed#NL#Now get it delivered with your next paid order', { NL: '\n' });
          imageSrc = Images.tick;
          backgroundColor = Constants.primaryColor;
        } else {
          orderStatus = t('Free gift selected but not confirmed.',  { NL: '\n' });      
          imageSrc = Images.error;
          backgroundColor = Constants.pink;
        }   
    } else {
        orderStatus = t('Please select your free gift');
        backgroundColor = '#959595'
    }    

    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1}}>
            <ScrollView style={{ maxHeight: heightPercentageToDP(100), paddingBottom: scaledSize(5) }}>
            <View style={styles.textView}>
              <View style={[styles.textStyle, { backgroundColor: backgroundColor }]}>
                {freeItem ? <View style={{flexDirection: 'row'}}>
                 <ImageBackground
                      source={{uri: freeItem.mediaJson.square}}
                      style={styles.topImage}
                    />
                {freeOrderItem.length > 0 ? <Image source={imageSrc} style={styles.iconStatus}/> : null}
                </View> : null }
                <AppText white size="M" bold style={{textAlign: 'center', padding: scaledSize(3)}}>
                {orderStatus}
              </AppText>
              </View>
                <View style={styles.orderConfirmationBox}>
                  <FreeGiftDealCoupon 
                    screen={'FreeGift'}
                    items={items}
                    selfItem={selfItem}
                    dealEndsDate={dealEndsDate}
                    freeOrderItem={freeOrderItem}
                    referralBonus={referralBonus}
                    t={t}
                    freeGiftClaimed={freeGiftClaimed}
                    currentCycleUsers={currentCycleUsers}
                    userName={userName}
                    rewards={rewards}
                    groupSummary={groupSummary}
                    language={language}
                    userPreference={userPreferences}
                  /></View>
            </View> 
            <DealStepperFreeGift  
                t={t}
                referralBonus={referralBonus}
                />
            <View style={[styles.orderBox, {paddingHorizontal: widthPercentageToDP(2)}]}>
              <View style={styles.orderStatus}>
                {freeItem ?
                <View style={[styles.pastOrders, {paddingVertical: heightPercentageToDP(2)}]}>
                  <View style={{ flexDirection: 'row', padding: scaledSize(5)}}>
                    <AppText bold black size="M" style={{ flex: 0.5 }}>{t(`Free Gift Details`)}</AppText>
                  </View> 
                 {
                   <GroupOrderOverlay
                    item={freeItem}
                    isGroupUnlocked={this.state.targetReached}
                    withoutButton={true}
                    isLast={false}
                    showPriceTags={true}
                    showRewards={true}
                    showOrderStatus={true}
                    showBottomMenu={false}
                    showOrderId={true}
                    withoutTag
                    mediaJson={freeItem.mediaJson}
                    onItemClick={this.onItemClick}
                    showArrow={true}
                    screen="FreeGift"
                    deliveryDate={formattedDeliveryDate}
                    rewards={rewards}
                    groupSummary={groupSummary}
                    language={language}
                    userPreference={userPreferences}
                  />
                  }
                </View>: null}
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
    backgroundColor: '#f5f5f5'
  },
  iconStatus: {
    width: 25, 
    height: 25, 
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginLeft: -5,
  },
  targetReachedContainer: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    // flex: 0.35,
    height: scaledSize(125),
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    zIndex: 10,
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
    justifyContent: 'center',
    // padding: widthPercentageToDP(3),
    flex: 1,
    height: heightPercentageToDP(71),
  },
  orderConfirmationBox: {
    backgroundColor: Constants.white,
    flex: 0.7,
    alignItems: 'center',
    marginTop: heightPercentageToDP(-5),
    width: widthPercentageToDP(91),
  },
  textStyle: {
    color: Constants.white,
    flex: 0.3,
    width: widthPercentageToDP(100),
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
    loading: state.login.prefLoading,
    booking: state.booking.booking,
    userProfile: state.userProfile.user,
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

const FreeGift = withTranslation()(
  connect(
    mapStateToProps,
    mapDipatchToProps,
  )(FreeGiftBase),
);

export default FreeGift;
