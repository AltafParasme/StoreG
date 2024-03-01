import React, {Component} from 'react';
import {StyleSheet, View, Linking, BackHandler, Image} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {Constants} from '../../../styles';
import idx from 'idx';
import MyShippingList from './component/MyShippingList';
import ShippingTabs from './ShippingTabs';
import NavigationService from '../../../utils/NavigationService';
import {Header} from '../../../components/Header/Header';
import {Support} from '../../../components/Support/Support';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import {AppText} from '../../../components/Texts';
import {Images} from '../../../../assets/images';
import Button from '../../../components/Button/Button';
import {AppConstants} from '../../../Constants';
import {startWhatsAppSupport} from '../utils';
import FgDealCouponSummary from '../../pages/FreeGift/FgDealCouponSummary';
import CLFlowBanner from '../PastOrders/Component/CLFlowBanner';
import {
  scaledSize,
  AppWindow,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../utils';
import {GetShippingListGroup, GetShippingList} from './redux/actions';
import FreeGiftDealCoupon from '../FreeGift/FreeGiftDealCoupon';

class ShippingList extends Component {
  constructor() {
    super();
    this.state = {userMode: ''};
    this.startTimeM = '';
    this.durationM = '';
  }

  componentWillMount() {
    this.startTimeM = new Date().getTime();
  }

  componentDidMount() {
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    this.setState({userMode: userMode});

    this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
      if (!this.props.shouldNotFocus) {
        this.resetBarcodeReader();
        if (userMode == 'CL') {
          this.props.getShippingListGroup(
            1,
            true,
            undefined,
            '',
            0,
            0,
            true,
            false
          );
        }
        this.props.getShippingList(1, undefined, undefined, undefined, true);
      }
    });

    this.durationM = new Date().getTime() - this.startTimeM;
    SetScreenName(Events.LOAD_SHIPPING_LIST_SCREEN.eventName());
    LogFBEvent(Events.LOAD_SHIPPING_LIST_SCREEN, {timeTaken: this.durationM});
  }

  resetBarcodeReader = () => {
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        scanApiCall: false,
        fromShippingList: false,
      },
    });
  };

  componentWillMount() {
    // BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.handleBackButtonClick
    // );
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    this._unsubscribe.remove();
    // BackHandler.removeEventListener(
    //   'hardwareBackPress',
    //   this.handleBackButtonClick
    // );
    // return true;
  }

  // handleBackButtonClick = () => {
  //   NavigationService.goBack();
  //   BackHandler.removeEventListener(
  //     'hardwareBackPress',
  //     this.handleBackButtonClick
  //   );
  //   return true;
  // };

  callUs = () => {
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    const callNumber =
      userMode == 'CL'
        ? AppConstants.supportCLCallNumber
        : AppConstants.supportCallNumber;
    Linking.openURL(`tel:${callNumber}`);
  };

  render() {
    const {t, clBusiness, rewards, userProfile, groupSummary} = this.props;
    const {userMode} = this.state;
    const mallInfo = idx(this.props.login, _ => _.clDetails.mallInfo);
    const userPreferences = idx(this.props.login, _ => _.userPreferences);

    const {groupDetails} = groupSummary;
    const offerEndDate = (groupDetails && groupDetails.info.offerEndDate) || '';
    const now = Date.now();
    const dealEndsDate = offerEndDate - now;

    const refferalUserDetails =
      (groupDetails &&
        groupDetails.referralUserDetails &&
        groupDetails.referralUserDetails.userInfo) ||
      [];
    const items = (groupDetails && groupDetails.summary) || [];
    const selfItem = items.filter(item => item.isSelf)[0] || {};
    const referralBonus =
      rewards && rewards.rewardsInfo && rewards.rewardsInfo.refferalBonus;

    const RefereeCurrentCycleAll = refferalUserDetails.filter(
      data => data.isCurrentCycleUser
    );

    let RefereeCurrentCycle = [];
    RefereeCurrentCycleAll.forEach(element => {
      groupDetails.summary.forEach(sum => {
        if (element.userid === sum.userId)
          RefereeCurrentCycle = RefereeCurrentCycle.concat(element);
      });
    });
    const userName = (userProfile && userProfile.name) || '--';

    let referralUsers =
      refferalUserDetails.filter(
        data => data.isMyReferral && data.isCurrentCycleUser
      ) || [];
    const currentCycleUsers = referralUsers.filter(
      data => data.userId !== groupDetails.info.userId
    );
    const freeGiftClaimed = currentCycleUsers.length >= 4 ? true : false;

    const language = this.props.i18n.language;

    return (
      <View style={styles.container}>
        {!clBusiness ? (
          <Header
            t={t}
            withoutHeader
            title={t('Your Shipping List')}
            rightComponent={<Support t={t} userMode={userMode} />}
            overrideBackHandler={true}
          />
        ) : null}
        {!clBusiness ? (
          <View style={styles.subHeaderStyle}>
            <View
              style={{
                flexDirection: 'column',
                height: heightPercentageToDP(7),
                width: widthPercentageToDP(90),
                justifyContent: 'space-between',
              }}>
              <AppText size="M" black style={styles.listTitle}>
                {t(`Need help? Reach out to us on `)}
              </AppText>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Button
                  onPress={() => startWhatsAppSupport(userMode, 'shippingList')}
                  styleContainer={styles.supportBtn}>
                  <AppText white bold size="M">
                    <Image
                      source={Images.whatsapp}
                      style={styles.whatsappImage}
                    />
                    {t(' WhatsApp')}
                  </AppText>
                </Button>
                <Button
                  onPress={this.callUs}
                  styleContainer={[
                    styles.supportBtn,
                    {marginLeft: 10, backgroundColor: Constants.white},
                  ]}>
                  <AppText greenishBlue bold size="M">
                    {t('Call us')}
                  </AppText>
                </Button>
              </View>
            </View>
          </View>
        ) : null}
        {this.props.isFreeGiftEnabled ? (
          <View style={styles.freegiftsummaryBox}>
            {/* {userMode == 'CU' && mallType != 'CL' ? <CLFlowBanner /> : null} */}
            <FgDealCouponSummary
              screen={'ShippingList'}
              items={items}
              selfItem={selfItem}
              dealEndsDate={dealEndsDate}
              referralBonus={referralBonus}
              t={t}
              freeGiftClaimed={freeGiftClaimed}
              currentCycleUsers={currentCycleUsers}
              userName={userName}
              rewards={rewards}
              groupSummary={groupSummary}
              language={language}
              userPreference={userPreferences}
            />
          </View>
        ) : null}
        {userMode == 'CL' ? (
          <ShippingTabs t={t} navigation={this.props.navigation} />
        ) : (
          <MyShippingList t={t} navigation={this.props.navigation} />
        )}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.backgroundGrey,
  },
  subHeaderStyle: {
    // shadowOffset: {width: 4, height: 1.5},
    // shadowColor: Colors.darkBlack,
    // shadowOpacity: 45,
    // elevation: 100,
    //height: heightPercentageToDP(9),
    alignItems: 'center',
    justifyContent: 'center',
    padding: widthPercentageToDP(4),
  },
  listTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  whatsappImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  supportBtn: {
    backgroundColor: Constants.greenishBlue,
    height: 40,
    padding: 5,
    flex: 0.45,
    color: Constants.primaryColor,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Constants.greenishBlue,
  },
  freegiftsummaryBox: {
    marginTop: heightPercentageToDP(1),
    alignItems: 'center',
    //justifyContent: 'center',
    marginHorizontal: widthPercentageToDP(4.5),
    width: widthPercentageToDP(91),
    height: heightPercentageToDP(20),
  },
});

const mapStateToProps = state => ({
  login: state.login,
  isFreeGiftEnabled: state.home.isFreeGiftEnabled,
  shouldNotFocus: state.ShippingList.shouldNotFocus,
  groupSummary: state.groupSummary,
  rewards: state.rewards.rewards,
  userProfile: state.userProfile,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getShippingList: (page, status, shipmentId, awb, shouldShowLoading) => {
    dispatch(GetShippingList(page, status, shipmentId, awb, shouldShowLoading));
  },
  getShippingListGroup: (
    page,
    group,
    phone,
    status,
    awb,
    shouldShowLoading,
    isFromCLTask
  ) => {
    dispatch(
      GetShippingListGroup(
        page,
        group,
        phone,
        status,
        awb,
        shouldShowLoading,
        isFromCLTask
      )
    );
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ShippingList)
);
