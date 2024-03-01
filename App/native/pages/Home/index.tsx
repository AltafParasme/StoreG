import React, {PureComponent} from 'react';
import {SafeAreaView, StatusBar, Text, Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {liveAnalytics} from '../ShopgLive/redux/actions';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import idx from 'idx';
import {
  StyleSheet,
  Animated,
  View,
  Image,
  BackHandler,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  ImageBackground
} from 'react-native';
import {Icon, Header, ButtonGroup} from 'react-native-elements';
import Button from '../../../components/Button/Button';
import {withTranslation} from 'react-i18next';
import Icons from 'react-native-vector-icons';
import BottomSheet from 'reanimated-bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  noop,
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
  AppWindow,
} from '../../../utils/index';
import LocationComponent from '../../../components/LocationComponent/LocationComponent';
import {Sticker} from './component/Sticker';
import {CartSticker} from './component/CartSticker';
import Draggable from '../../../components/Draggable/Draggable';
import DealsCountDownCotainer from './countdown/DealsCountDownCotainer';
import CartStrip from './component/CartStrip';
import UserTaskStrip from './component/UserTaskStrip';
import OfferFeed from './component/OfferFeed';
import RBSheet from 'react-native-raw-bottom-sheet';
import NavigationService from '../../../utils/NavigationService';
import {connect} from 'react-redux';
import {changeField} from '../Login/actions';
import {
  GetOfferData,
  SetActiveTab,
  GetCategoriesList,
  GetCart,
  SaveLocation,
  getWidgets,
} from '../Home/redux/action';
import {changeField as changeFieldShopgLive} from '../../../native/pages/ShopgLive/redux/actions';
import {Fonts, Colors} from '../../../../assets/global';
import {Images} from '../../../../assets/images/index';
import {GET_PAGE_OFFER_LIST, GET_FEEDBACK} from '../Home/redux/type';
import {BOOK_PRODUCT} from '../Booking/redux/actions';
import {getRecentOrder} from '../Login/actions';
import {Constants} from '../../../styles';
import Rewards from '../../../components/RewardDetails/Reward';
import CarouselBanner from '../../../components/CarouselBanner/CarouselBanner';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import {NavigationActions} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import {getRewards} from '../MyRewards/actions';
import {AppText} from '../../../components/Texts';
import RewardActionView from './actionview/RewardActionView';
import {processTextAndAppendElipsis} from '../../../utils/misc';
import {packageName} from '../../../Constants';
import CustomerReview from './actionview/CustomerReview';
import {
  setData,
  shareToWhatsApp,
  martShareToWhatsApp,
  participators,
} from '../utils';
import {listOfCustomerIncensitiveOrderStatus} from '../utils';
import TargetReachActionView from './actionview/TargetReachActionView';
import {currentUser} from '../UserProfile/actions';

const NAVBAR_HEIGHT = heightPercentageToDP(9.5);
const TAB_HEIGHT = 50;
const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 0});

const initialLayout = {width: Dimensions.get('window').width};

class MainScreen extends PureComponent {
  constructor(props) {
    super(props);
    const scrollAnim = new Animated.Value(0);
    this.state = {
      activeIndex: props.activeCategoryTabIndex,
      bottomActionItem: {},
      lastPage: 1,
      popover: false,
      rewardsActionSheetShown: false,
      targetReachInfo: false,
      scrollAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          0
        ),
        0,
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT
      ),
      isRewardAction: false,
      count: 0,
      oldPinCode: 0,
      showSticker: true,
    };

    this.RBSheet = null;
    this.bottomSheet = React.createRef();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.startTimeM = '';
    this.durationM = '';
    this.navigateTo = this.navigateTo.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.handleCloseGroupTargetBottomSheet = this.handleCloseGroupTargetBottomSheet.bind(
      this
    );
    this.updateIndex = this.updateIndex.bind(this);
    this.renderTabBar = this.renderTabBar.bind(this);
    this.renderTabBarItem = this.renderTabBarItem.bind(this);
  }

  componentWillMount = () => {
    this.startTimeM = new Date().getTime();
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  };

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
      this.props.dispatch(changeField('currentScreen', 'Home'));
    });
    this.initialSetup(true);
    SetScreenName(Events.LOAD_HOME_SCREEN.eventName());
    LogFBEvent(Events.LOAD_HOME_SCREEN, null);
  };

  initialSetup = shouldCheck => {
    const {fireAppLaunchEvent, launchEventDetails} = this.props;
    const actionId = this.props.navigation.getParam('actionId');
    const userId = this.props.login.userPreferences.uid;
    const sid = this.props.login.userPreferences.sid;
    const isLoggedIn = this.props.login.isLoggedIn;

    if (shouldCheck) {
      if (!Object.keys(this.props.offerList).length > 0) {
        this.props.getCategoriesList(1, 0, actionId, userId);
      }
    } else {
      this.props.getCategoriesList(1, 0, actionId, userId);
    }
    //this.props.onGetWidgets(true, true, 'Home', userId, () => {});

    this.setState({oldPinCode: this.props.login.userPreferences.prefPinCode});

    this.durationM = new Date().getTime() - this.startTimeM;
    SetScreenName(Events.LOAD_HOME_SCREEN.eventName());
    LogFBEvent(Events.LOAD_HOME_SCREEN, {timeTaken: this.durationM});

    const stickerCondition =
      this.props.login.userPreferences &&
      this.props.login.userPreferences.userCat &&
      this.props.login.userPreferences.userCat.fgStatus === 'REPEAT';

    this.setState({showSticker: stickerCondition});
    
      //this.props.getFeedBack();
      if(isLoggedIn) {
       // this.props.onGetRewards(true, false, false, false, null, null);
      // to get cart details asyncrounous
        this.props.getCart();

      // to get address details asyncrounous
        this.props.dispatch({type: 'booking/GET_ADDRESS'});

      // get current user details
        this.props.onCurrentUser();
      }

      //check for earn coins flow
      if(fireAppLaunchEvent) {
        let eventData = { source:launchEventDetails.source, medium: launchEventDetails.medium , referrerUserId: launchEventDetails.userId, refereeUserId: userId, isNewUser: !this.props.login.userRegistered };
        if(launchEventDetails && launchEventDetails.taskId){
          eventData['taskId'] = launchEventDetails.taskId;
        }
        let userPrefData = {userId: userId, sid: sid};  
        this.props.onAnalytics(
          'App_DeepLink_Launch',
          eventData,
          userPrefData
        );
        this.props.dispatch(changeField('fireAppLaunchEvent', false));
      }
  };

  handleBackButtonClick() {
    const {dispatch} = this.props.navigation;

    if (this.props.navigation.isFocused() && this.state.count > 0) {
      BackHandler.exitApp();
    }
    if (this.props.navigation.isFocused()) {
      this.setState(state => {
        return {count: state.count + 1};
      });
      ToastAndroid.show(
        'Press back again to exit',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
    //dispatch(NavigationActions.back());
    return true;
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {isCLCreationApiCalled} = this.props;
    const currentScreen = idx(this.props.login, _ => _.currentScreen);
    let martSheetOpened = idx(this.props.login, _ => _.martSheetOpened);

    const mallInfo = idx(this.props.login, _ => _.clDetails.mallInfo);

    const screenConditions = currentScreen === 'Home';
    // conditions for less than 3000 group purchase
    const openBottomSheet =
      mallInfo &&
      (mallInfo.type === 'MART' || mallInfo.type === 'CL') &&
      !martSheetOpened;

    // Mart/CL users Conditions
    if (openBottomSheet && screenConditions && !isCLCreationApiCalled) {
      //this.RBSheet && this.RBSheet.open();
    }

    if (this.props.refreshRecentOrder) {
      this.props.getRecentOrder();
    }

    if (
      this.props.login &&
      this.props.login.userPreferences &&
      this.props.login.userPreferences.prefPinCode &&
      this.props.login.userPreferences.prefPinCode != this.state.oldPinCode &&
      this.props.login.isLoggedIn
    ) {
      this.initialSetup(false);
    }

    if (
      !this.state.rewardsActionSheetShown &&
      // this.props.refUser &&
      // this.props.refUser.invitorName &&
      !this.props.login.userRegistered &&
      this.props.login.userPreferences &&
      this.props.login.userPreferences.userCat &&
      Object.keys(this.props.login.userPreferences.userCat)
    ) {
      // this.props.getRewards({});
      if (
        this.props.login.userPreferences.userCat.fgStatus === 'REPEAT' &&
        (!this.props.rewards || !this.props.rewards.rewardsInfo.joiningBonus)
      )
        return;

      if (!this.state.isRewardAction) this.openRewardAction();
    }


    if(prevProps.activeCategoryTabIndex !== this.props.activeCategoryTabIndex){
      this.setState({
        activeIndex: this.props.activeCategoryTabIndex
      })
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { querySnapshot : querySnapshotLatest } = nextProps.shopglive;
    const {pageUpdating, querySnapshot} = this.props.shopglive;
    if (nextProps.isTagsScreen || this.props.isTagsScreen) return false;
    if(this.props.login.currentScreen == 'CartDetail')
    return false
    if(querySnapshotLatest.length != querySnapshot.length && pageUpdating !== 'Home')
    return false;

    return true;
    
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }
  
  openRewardAction = () => {
    this.rewardAction && this.rewardAction.open();
    this.setState({
      rewardsActionSheetShown: true,
    });
  };

  closeRewardAction = () => {
    this.rewardAction && this.rewardAction.close();
    this.setState({
      isRewardAction: true,
      rewardsActionSheetShown: false,
    });
    this.bottomSheet.current.snapTo(1);
    this.bottomSheet.current.snapTo(1);
  };

  renderScene = ({route}) => {
    // const recentOrderStatusVisibility = !(
    //   this.props.login.recentOrder &&
    //   listOfCustomerIncensitiveOrderStatus.includes(
    //     this.props.login.recentOrder.status
    //   )
    // );

    // const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    // const whatsAppLink = idx(
    //   this.props.login,
    //   _ => _.clDetails.clConfig.whatsAppLink
    // );

    // const isBottomStripVisible = this.props.hasCart || (whatsAppLink && whatsAppLink != '' && userMode === 'CU') || (!this.props.hasCart && this.props.login.recentOrderExists && recentOrderStatusVisibility);
    
    switch (true) {
      case route.key < 20:
        return <OfferFeed activeIndex={this.state.activeIndex} route={route} openRbSheet={this.openRbSheet}/>;
      default:
        return null;
    }
  };

  renderContent = () => {
    return (
      <View style={styles.rewardsActionSheetContainer}>
        <RewardActionView
          inviteToken={
            this.props.refUser &&
            this.props.refUser.inviteToken &&
            this.props.refUser.inviteToken
          }
          rewards={this.props.rewards}
          handleConfirm={this.closeRewardAction}
          fgStatus={
            this.props.login.userPreferences &&
            this.props.login.userPreferences.userCat &&
            Object.keys(this.props.login.userPreferences.userCat) &&
            this.props.login.userPreferences.userCat &&
            this.props.login.userPreferences.userCat.fgStatus
          }
        />
      </View>
    );
  };


  openRbSheet = () => {
    this.RBSheet && this.RBSheet.open();
  }

  handleCloseGroupTargetBottomSheet = type => {
    const {dispatch} = this.props;
    setData('martSheetOpened', 'sheetclosed');
    dispatch(changeField('martSheetOpened', 'sheetclosed'));
    this.RBSheet && this.RBSheet.close();
    if (type === 'continue') {
      LogFBEvent(Events.SHOPG_SOCIETY_CONTINUE_CLICK, null);
    }
  };

  bottomAnimation = () => {
    return this.state.clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT - 10],
      outputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT + 12],
      extrapolate: 'clamp',
    });
  };

  navigateTo = componentName => {
    NavigationService.navigate(componentName);
  };

  updateIndex = index => {
    const {setActiveTabs, getOffers} = this.props;
    const userId = this.props.login.userPreferences.uid;
    const activeRoute =
      this.props.categories[index] && this.props.categories[index].slug;

    if (!this.props.offerList[activeRoute]) {
      getOffers(1, 10, activeRoute, userId);
    }

    this.setState({
      activeIndex: index,
    });

    setActiveTabs(activeRoute);
    LogFBEvent(Events.HOME_CATEGORY_CLICK, {
      activeCategoryTab: activeRoute,
    });
  };

  renderTabBarItem = props => {
    let isActiveTab = true;
    if (typeof this.state.index == 'number') {
      isActiveTab =
        props.route.title === props.categoryObj[this.state.activeIndex].title;
    }
    const color = isActiveTab ? Constants.secondaryColor : Constants.black;
    return (
      <TouchableOpacity {...props}>
        <View
          style={[
            props.style,
            {backgroundColor: Constants.white},
          ]}>
          <AppText style={[styles.centerAlign, {color: color}]}>
            {props.route.title}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: Constants.orange}}
        getLabelText={({ route }) => this.props.t(route.title)}
        style={{
          backgroundColor: Constants.white,
        }}
        tabStyle={{width: widthPercentageToDP(28), height: heightPercentageToDP(7)}}
        labelStyle={{fontSize: 14}}
        inactiveColor={Constants.grey}
        scrollEnabled={true}
        pressColor={Constants.orange}
        activeColor={Constants.orange}
      />
    );
  }

  render() {
    const {
      loading,
      t,
      activeCategoryTab,
      categories,
      categoryObj,
      message,
      groupSummary,
      rewards,
      shopglive,
      clDetails,
      isLoggedIn
    } = this.props;

    const clInfo = idx(clDetails, _ => _.user);
    const pictureUrl =  (clInfo && clInfo.pictureUrl) ? clInfo.pictureUrl : '';

    let bucketLimitEnd = 250;
    let groupOrderAmount = 0;
    let groupSummaryItem =
      (groupSummary &&
        groupSummary.groupDetails &&
        groupSummary.groupDetails.summary) ||
      [];

    const mallInfoType = idx(this.props.login, _ => _.clDetails.mallInfo.type);
    let summary =
      idx(this.props.groupSummary, _ => _.groupDetails.summary) || [];
    const userPrefDelivery = idx(
      this.props.login,
      _ => _.userPreferences.slottedDelivery
    );
    let participatedUser = participators(summary);
    groupOrderAmount = idx(
      this.props.groupSummary,
      _ => _.groupDetails.info.groupOrderAmount
    );

    let groupUserDetails = idx(
      this.props.groupSummary,
      _ => _.groupDetails.groupUserDetails
    );
    let selfItem = groupSummaryItem.filter(item => item.isSelf)[0] || {};
    const language = this.props.i18n.language;
    const userPreference = this.props.login.userPreferences;

    if (groupSummary && groupSummary.groupDetails) {
      let groupDetails = groupSummary.groupDetails;
      bucketLimitEnd = groupSummary.groupDetails.info.bucketLimitEnd;
      isGroupUnlocked = groupDetails.info.groupOrderAmount >= bucketLimitEnd;
      groupOrderAmount = groupDetails.info.groupOrderAmount;
    }

    let tags = [];
    categories.forEach(element => {
      if (element.slug === activeCategoryTab) {
        tags = element.tags;
      }
    });

    const {clampedScroll} = this.state;
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT - 10],
      outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT + 10)],
      extrapolate: 'clamp',
    });

    const items =
      (groupSummary &&
        groupSummary.groupDetails &&
        groupSummary.groupDetails.summary.filter(
          item =>
            item.isSelf &&
            parseInt(item.items) > 1 &&
            parseInt(item.offerAmount) > 0
        )) ||
      [];
    let disableStripForFreeGift = false;
    const itemInfo = items && items.length > 0 ? items[0] : {};
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    const mallInfo = idx(this.props.login, _ => _.clDetails.mallInfo.name);
    const mallAddress = idx(
      this.props.login,
      _ => _.clDetails.clDeliveryAddress
    );
    const recentOrderStatusVisibility = !(
      this.props.login.recentOrder &&
      listOfCustomerIncensitiveOrderStatus.includes(
        this.props.login.recentOrder.status
      )
    );
    const totalPrice = idx(this.props.login, _ => _.recentOrder.totalPrice);
    const count = idx(this.props.login, _ => _.recentOrder.count);
    const groupOfferId = idx(
      this.props.groupSummary,
      _ => _.groupDetails.info.groupOfferId
    );

    if (parseFloat(totalPrice) == 0 && count > 1) {
      disableStripForFreeGift = true;
    }

    let eventProps = {
      page: this.props.navigation.state.routeName,
      sharedBy: this.props.userPref && this.props.userPref.userMode,
      component: 'Header',
    };

    let dataUser = {
      userId: this.props.userPref && this.props.userPref.uid,
      sid: this.props.userPref && this.props.userPref.sid,
    };
    return (
      <View style={styles.mainContainer}>
        {/* <LocationComponent page={'HOME'} /> */}
        <StatusBar backgroundColor="#00a9a6" barStyle="light-content" />
        <Animated.View
          style={[
            styles.headerView,
            {transform: [{translateY: navbarTranslate}]},
          ]}>
          <Header
            containerStyle={styles.headerContainerStyle}
            leftComponent={
              mallInfo ? (
                <View
                  style={{
                    height: NAVBAR_HEIGHT,
                    width: widthPercentageToDP(40),
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection:'row'
                  }}>
                  <View style={styles.profileImageContainer}>
                    {
                      (pictureUrl == '')
                      ?
                      null 
                      :
                      <Image
                        source={{uri: pictureUrl}}
                        style={styles.profileImage} />
                    }
                    <View style={styles.frontView}>
                      <Image style={styles.iconImage}
                        source={Images.smallerLogo} />
                    </View> 
                  </View>

                    <View style={{marginLeft:widthPercentageToDP(1)}}>
                      <AppText size="S" bold black>
                        {t(`#MALLINFO#\'s`, {MALLINFO: mallInfo.toUpperCase()})}
                      </AppText>
                      <AppText size="M" bold black>
                        {t(`Glowfit Store`,)}
                      </AppText>                      
                    </View>

                </View>
              ) : (
                <Image style={styles.imageContent} source={Images.glowfitLogo} />
              )
            }
            centerComponent={<View />}
            rightComponent={
              <View
                style={{
                  flexDirection: 'row',
                  width: widthPercentageToDP(50),
                  justifyContent: 'space-between',
                }}>
                {/* <View style={styles.iconSizeDefine}>
                  {groupUserDetails && groupUserDetails.size ? (
                    <TouchableOpacity
                      style={{flexDirection: 'row', alignItems: 'center'}}
                      onPress={() => {
                        mallInfoType === 'MART' || mallInfoType === 'CL'
                          ? this.RBSheet && this.RBSheet.open()
                          : null
                      }}>
                      <Image
                        style={styles.mallImageLogo}
                        source={Images.clSheet}
                      />
                      <View style={styles.groupSizeContainer}>
                        <AppText white bold size="XXS">
                          {groupUserDetails.size.toString().length <= 3
                            ? groupUserDetails.size
                            : '999+'}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={styles.iconSizeDefine}>
                  <Rewards />
                </View> */}
                <TouchableOpacity
                  onPress={() => {
                    if (mallInfoType === 'CL') {
                      if(!isLoggedIn) {
                        this.props.onChangeFieldLogin('loginInitiatedFrom', 'Home');
                        NavigationService.navigate('Login', {callback: () => {
                          martShareToWhatsApp(
                            'Home',
                            'Header',
                            eventProps,
                            t,
                            mallInfo,
                            groupSummary,
                            userPreference,
                            rewards
                          );
                        } });
                      }
                      else {
                        martShareToWhatsApp(
                          'Home',
                          'Header',
                          eventProps,
                          t,
                          mallInfo,
                          groupSummary,
                          userPreference,
                          rewards
                        );
                      }
                      
                    } else {
                      if(!isLoggedIn) {
                        this.props.onChangeFieldLogin('loginInitiatedFrom', 'Home');
                        NavigationService.navigate('Login', {callback: () => {
                          shareToWhatsApp(
                            'Home',
                            'Header',
                            eventProps,
                            t,
                            rewards,
                            language,
                            groupSummary,
                            userPreference,
                            (fragment = 'Home')
                          );
                        } });
                      }
                      else {
                        shareToWhatsApp(
                          'Home',
                          'Header',
                          eventProps,
                          t,
                          rewards,
                          language,
                          groupSummary,
                          userPreference,
                          (fragment = 'Home')
                        );
                      }
                    }
                    this.props.onAnalytics(
                      Events.SHARE_WHATSAPP_CLICK.eventName(),
                      eventProps,
                      dataUser
                    );
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}>
                  <View style={styles.shareBox}>
                  <View style={styles.whatsappCircle}>
                    <Icon
                      type="font-awesome"
                      name="whatsapp"
                      color={Constants.white}
                      size={widthPercentageToDP(6)}
                      containerStyle={{
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                  <AppText white>Share & Earn</AppText>
                  </View>
                </TouchableOpacity>
              </View>
            }
          />
        </Animated.View>

          <TabView
            navigationState={{index: this.state.activeIndex, routes: categoryObj}}
            style={styles.categoryTabView}
            renderScene={this.renderScene}
            onIndexChange={this.updateIndex}
            initialLayout={initialLayout}
            renderTabBar={this.renderTabBar}
            swipeEnabled={false}
            lazy
            lazyPreloadDistance={1}
          />

        {this.props.hasCart ? (
          <Animated.View
            style={[
              styles.bottomTabView,
              {transform: [{translateY: this.bottomAnimation()}]},
            ]}>
            <CartStrip
              cart={this.props.cart}
              totalCartItems={this.props.totalCartItems}
            />
          </Animated.View>
        ) 
        : !this.props.hasCart &&
          this.props.login.recentOrderExists &&
          recentOrderStatusVisibility &&
          !disableStripForFreeGift ? (
          <Animated.View
            style={[
              styles.bottomTabView,
              {transform: [{translateY: this.bottomAnimation()}]},
            ]}>
            <DealsCountDownCotainer
              login={this.props.login}
              groupSummary={this.props.groupSummary}
            />
          </Animated.View>
        ) : null}
        {this.state.rewardsActionSheetShown ? (
          <BottomSheet
            ref={this.bottomSheet}
            snapPoints={[
              AppWindow.height - heightPercentageToDP(20),
              heightPercentageToDP(0),
            ]}
            renderContent={this.renderContent}
            initialSnap={0}
            renderHeader={null}
            enabledInnerScrolling={true}
            enabledBottomClamp={true}
            borderRadius={10}
            t={t}
          />
        ) : null}
        {userPrefDelivery &&
        rewards &&
        groupSummary &&
        groupSummary.groupDetails ? (
          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={heightPercentageToDP(88)}
            duration={250}
            closeOnPressBack={false}
            closeOnDragDown={false}
            customStyles={{
              container: {
                backgroundColor: Colors.blue,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              },
            }}>
            <TargetReachActionView
              closeAction={this.handleCloseGroupTargetBottomSheet}
              t={t}
              rewards={rewards}
              groupSummary={groupSummary}
              userPreference={userPreference}
              mallInfo={mallInfo}
              mallAddress={mallAddress}
              mallInfoType={mallInfoType}
              participatedUser={participatedUser}
            />
          </RBSheet>
        ) : null}
        {this.props.feedBack ? (
          <Modal
            isVisible={this.props.showFeedBackPopUp}
            animationType={'slide'}
            style={styles.modalStyle}>
            <CustomerReview
              isVisible={handler}
              feedBack={this.props.feedBack}
            />
          </Modal>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },
  headerContainerStyle: {
    backgroundColor: Constants.white,
    height: NAVBAR_HEIGHT,
    paddingBottom: heightPercentageToDP(2),
  },
  safeAreaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    paddingTop: 15,
  },
  iconStyle: {
    color: '#FF6900',
    fontSize: widthPercentageToDP(4),
    resizeMode: 'contain',
    alignSelf: 'center',
    //marginRight: 10,
  },
  modalStyle: {
    flex: 0.63,
    top: heightPercentageToDP(15),
  },
  shareEarnButtonView: {
    backgroundColor: '#fff',
    marginLeft: widthPercentageToDP(12),
    //marginTop: widthPercentageToDP(2),
    borderRadius: scaledSize(8),
    width: widthPercentageToDP(34),
    height: heightPercentageToDP(4),
    borderColor: '#FFCA9E',
    borderWidth: scaledSize(2),
    padding: scaledSize(3),
    flexDirection: 'row',
  },
  orMainView: {
    borderWidth: 0.7,
    position: 'relative',
    borderColor: Colors.mutedBorder,
  },
  grid: {
    //justifyContent: 'center',
    flexDirection: 'row',
    //flexWrap: 'wrap',
    justifyContent: 'space-between',
    // flex: 1,
  },
  profileImage:{
    height:heightPercentageToDP(4),
    width:heightPercentageToDP(4),
    borderRadius:heightPercentageToDP(4)
  },
  profileImageContainer:{
    height:heightPercentageToDP(5),
    width:heightPercentageToDP(5),
  },
  iconImage:{
    height:heightPercentageToDP(3),
    width:heightPercentageToDP(3),
    alignSelf:'flex-end'
  },
  header: {
    backgroundColor: Constants.primaryColor,
  },
  activeIconStyle: {
    opacity: 1,
  },
  textStyle: {
    fontSize: scaledSize(12),
    color: '#000',
    alignContent: 'center',
    textAlign: 'center',
  },
  activeFontStyle: {
    color: Colors.orange,
    fontSize: scaledSize(12),
    fontWeight: '500',
    fontFamily: Fonts.roboto,
  },
  activityView: {
    flex: 1,
    width: widthPercentageToDP(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  orView: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 45,
    width: 55,
    left: widthPercentageToDP(50) - 50 / 2,
    top: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orInnerView: {
    backgroundColor: '#DDDEDF',
    borderRadius: 30,
    height: heightPercentageToDP(6),
    width: widthPercentageToDP(12.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  orTextStyle: {
    fontSize: scaledSize(14),
    color: '#292f3a',
    fontFamily: Fonts.roboto,
  },
  upIconStyle: {
    color: Constants.white,
    fontSize: 30,
  },
  noMoreText: {
    margin: 15,
    textAlign: 'center',
    fontSize: scaledSize(14),
  },
  mallImageContent: {
    width: widthPercentageToDP(40),
    height: heightPercentageToDP(4),
    resizeMode: 'contain',
  },
  mallImageLogo: {
    width: scaledSize(34),
    height: scaledSize(34),
    resizeMode: 'contain',
  },
  imageContent: {
    width: widthPercentageToDP(30),
    height: heightPercentageToDP(30),
    resizeMode: 'contain',
  },
  headerView: {
    paddingTop: STATUS_BAR_HEIGHT,
    height: NAVBAR_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    shadowOffset: {width: 1, height: 1},
    shadowColor: Colors.darkBlack,
    shadowOpacity: 15,
    elevation: 10,
  },
  bottomTabView: {
    height: NAVBAR_HEIGHT,
    paddingTop: STATUS_BAR_HEIGHT,
    position: 'absolute',
    bottom: heightPercentageToDP(7),
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  categoryTabView: {
    marginTop: NAVBAR_HEIGHT
  },
  innerView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#28000000',
    paddingHorizontal: 5,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#28000000',
  },
  boxShadow: {
    shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  iconSizeDefine: {
    width: scaledSize(34),
    height: scaledSize(34),
  },
  whatsappCircle: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(34),
    height: scaledSize(34),
    borderRadius: 37 / 2,
  },
  rewardsActionSheetContainer: {
    backgroundColor: '#c7c7c7',
    position: 'absolute',
    zIndex: 1,
    marginLeft: widthPercentageToDP(1.57),
  },
  delayedDelivery: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(20),
    resizeMode: 'contain',
  },
  scanButton: {
    backgroundColor: 'white',
  },
  groupSizeContainer: {
    position: 'absolute',
    width: widthPercentageToDP(5),
    height: widthPercentageToDP(5),
    borderRadius: widthPercentageToDP(8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ec3d5a',
    right: 0,
    top: 1,
    left: 25,
    bottom: 80,
  },
  frontView:{
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height:'100%',
    justifyContent: 'flex-end'
  },
  shareBox: {
    flexDirection: 'row',
    backgroundColor: '#1ad741',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingRight: widthPercentageToDP(1)
  }
});

const mapStateToProps = state => {
  return {
    showFeedBackPopUp: state.home.showFeedBackPopUp,
    loading: state.home.loading,
    isCLCreationApiCalled: state.clOnboarding.isCLCreationApiCalled,
    isLoading: state.home.isLoading,
    offerList: state.home.list,
    feedBack: state.home.feedback,
    categories: state.home.categories,
    categoryObj: state.home.categoryObj,
    totalCartItems: state.home.totalCartItems,
    cart: state.home.cart,
    hasCart: state.home.hasCart,
    activeCategoryTab: state.home.activeCategoryTab,
    activeCategoryTabIndex: state.home.activeCategoryTabIndex,
    editPincodeClicked: state.home.editPincodeClicked,
    pincodeChanged: state.home.pincodeChanged,
    isLimitReached: state.home.limit,
    order: state.orderDetail,
    language: state.home.language,
    isTagsScreen: state.home.isTagsScreen,
    message: state.home.message,
    refreshRecentOrder: state.home.refreshRecentOrder,
    quantity: state.booking.quantity,
    groupSummary: state.groupSummary,
    login: state.login,
    isLoggedIn: state.login.isLoggedIn,
    userPref: state.login.userPreferences,
    isRewardAction: state.login.isRewardAction,
    refUser: state.login.refUser,
    fireAppLaunchEvent: state.login.fireAppLaunchEvent,
    launchEventDetails:state.login.launchEventDetails,
    clDetails:state.login.clDetails,
    rewards: state.rewards.rewards,
    initialRewardsApiCallCompleted:
      state.rewards.initialRewardsApiCallCompleted,
    shopglive: state.ShopgLive,
    clConfig: state.clOnboarding.clConfig,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  getOffers: (page, size, slug, userId) => {
    dispatch(GetOfferData(page, size, slug, userId));
  },
  onGetWidgets: (isPublic, isPrivate, page, userId, callback) => {
    dispatch(getWidgets(isPublic, isPrivate, page, userId, callback));
  },
  getPageOffers: (slug, userId) => {
    dispatch({type: GET_PAGE_OFFER_LIST, payload: {slug, userId}});
  },
  getFeedBack: () => {
    dispatch({type: GET_FEEDBACK});
  },
  getCategoriesList: (page, size, actionId, userId) => {
    dispatch(GetCategoriesList(page, size, actionId, userId));
  },
  getCart: () => {
    dispatch(GetCart());
  },
  setActiveTabs: tab => {
    dispatch(SetActiveTab(tab));
  },
  addBookProduct: product => dispatch(BOOK_PRODUCT(product)),
  onGetRewards: (getCashback, getCoins, getScratchDetails ,history,page, size) => {
    dispatch(getRewards(getCashback, getCoins, getScratchDetails ,history,page, size));
  },
  getRecentOrder: () => {
    dispatch(getRecentOrder());
  },
  saveLocation: (userId, type, page, obj) => {
    dispatch(SaveLocation(userId, type, page, obj));
  },
  onCurrentUser: () => {
    dispatch(currentUser());
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeFieldShopgLive(fieldName, value));
  },
  onChangeFieldLogin: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

const ConnectHome = connect(mapStateToProps, mapDispatchToProps)(MainScreen);

export default withTranslation()(ConnectHome);
