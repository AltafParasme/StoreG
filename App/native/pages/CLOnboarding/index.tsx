import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {getStarterKit} from './actions';
import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {liveAnalytics} from '../ShopgLive/redux/actions';
import Button from '../../../components/Button/Button';
import LinearGradient from 'react-native-linear-gradient';
import {AppText} from '../../../components/Texts';
import {Images} from '../../../../assets/images';
import idx from 'idx';
import {createCL, changeField} from './actions';
import NavigationService from '../../../utils/NavigationService';
import CarouselBanner from '../../../components/CarouselBanner/CarouselBanner';
import {Constants} from '../../../styles';
import {shareToWhatsApp, listOfStepsCL} from '../utils';
import {LogFBEvent, Events} from '../../../Events';
import BottomSheet from 'reanimated-bottom-sheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
  AppWindow
} from '../../../utils';
import {Icon} from 'react-native-elements';
import CLStepsComponent from './components/CLStepsComponent';
import CLCreationBottomSheet from './components/CLCreationBottomSheet';

const component = 'CL OnBoarding';

class CLOnboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCLCreated: false,
    };
    this.RBSheet = null;
    this.bottomSheet = React.createRef();
  }

  componentDidMount() {
    const {dispatch, clBusiness, userPref} = this.props;
    const userMode = idx(userPref, _ => _.userMode);
    this.props.onGetCLOnboarding();
    if(userMode== 'CL')
      NavigationService.navigate('MyOrderBusinessCheckout')      
    
    if (!clBusiness) {
      LogFBEvent(Events.CL_STARTER_KIT_LOAD, null);
    }
  }

  componentDidUpdate() {
    const {userPref} = this.props;
    if (userPref.userMode === 'CL' && this.state.isCLCreated) {
      this.RBSheet && this.RBSheet.open();
      this.setState({
        isCLCreated: false
      })
    }

  }

  onClickConfirm = () => {
    const {userProfile} = this.props;
    let phoneNumber = userProfile && userProfile.user.phoneNumber;
    this.setState({
      isCLCreated: true
    })
    let inputBody = {
      "phoneNumber": phoneNumber,
      "userMode":"CL",
      "clType":"DEMAND"
    }
    this.props.onCreateCL(inputBody);
    LogFBEvent(Events.CL_STARTER_KIT_CLICK, inputBody);
  };

  trainingCL = (valueItem, index) => {
    return <CLStepsComponent training={valueItem} screen={this.props.navigation.state.routeName} index={index + 1} />;
  };

  renderContent = () => {
    const {t, userPreference} = this.props;
   return <CLCreationBottomSheet 
           closeAction={this.handleCloseGroupTargetBottomSheet}
            t={t}
            userPreference={userPreference}
   />
  }

  handleCloseGroupTargetBottomSheet = () => {
    this.RBSheet && this.RBSheet.close();
    NavigationService.navigate('EditUserProfile')
    
  };

  activityContent = (valueItem, index) => {
    const {t} = this.props;
    return (
      <View style={styles.feedContainer}>
        <View
          style={[
            styles.circleUserView,
            {backgroundColor: Constants.primaryColor},
          ]}>
          <AppText
            bold
            white
            size="S"
            style={{paddingLeft: widthPercentageToDP(3)}}>
            {index + 1}
          </AppText>
        </View>

        <View style={styles.flatListTextInfoView}>
          <AppText size="S" style={{paddingRight: widthPercentageToDP(22)}}>
            {t(valueItem)}
          </AppText>
        </View>
      </View>
    );
  };
  render() {
    const {
      clConfig,
      t,
      rewards,
      groupSummary,
      language,
      userPref,
      clBusiness,
    } = this.props;
    const offerId = (clConfig && clConfig.starterKitOfferId) || 0;
    let clSteps = idx(clConfig, _ => _.training[0].steps);
    let eventProps = {
      component: component,
      page: this.props.navigation.state.routeName,
      sharedBy: userPref.userMode,
    };
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };

    return (
      <View style={{flex: 1}}>
        <ScrollView
          style={[
            styles.contentBox,
            clBusiness
              ? {maxHeight: heightPercentageToDP(72)}
              : {maxHeight: heightPercentageToDP(92)},
          ]}
          scrollEnabled={true}>
          <View style={{flex: 0.3, justifyContent: 'center'}}>
            {clConfig ? (
              <CarouselBanner
                categories={clConfig}
                language={this.props.language}
                dispatch={this.props.dispatch}
                isStarterCLFlow
                itemWidthProps={widthPercentageToDP(100)}
                carouselViewStyle={
                  clBusiness
                    ? {height: heightPercentageToDP(30)}
                    : {height: heightPercentageToDP(35)}
                }
                carouselImageStyle={
                  clBusiness
                    ? {height: heightPercentageToDP(30), resizeMode: 'cover'}
                    : {height: heightPercentageToDP(35), resizeMode: 'cover'}
                }
                playIconStyle={styles.playIconStyle}
                clBusiness={clBusiness}
                innerTextStyle={
                  clBusiness ? styles.clBusinessText : styles.clOnboardText
                }
              />
            ) : (
              <View />
            )}
            {!clBusiness ? (
              <View style={styles.topView}>
                <View>
                  <Image
                    source={Images.shopGLogo}
                    style={{
                      width: widthPercentageToDP(12),
                      height: heightPercentageToDP(8),
                      position: 'absolute',
                    }}
                  />
                </View>

                <View style={styles.whatsappIconView}>
                  <TouchableOpacity
                    elevation={2}
                    onPress={() => {
                      shareToWhatsApp(
                        'CLOnboarding',
                        'CLOnboarding',
                        eventProps,
                        t,
                        rewards,
                        language,
                        groupSummary,
                        userPref,
                        'CLOnboarding',
                      );
                      this.props.onAnalytics(Events.SHARE_OFFER_WHATSAPP_CLICK, eventProps, userPrefData);
                    }
                    }
                    style={styles.whatsappCircleGroupDeal}>
                    <Icon
                      type="font-awesome"
                      name="whatsapp"
                      color={Constants.white}
                      size={widthPercentageToDP(6)}
                      containerStyle={{
                        alignSelf: 'center',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#7e3a77', '#ec3d5a']}
            style={
              !clBusiness
                ? {height: heightPercentageToDP(66)}
                : {height: heightPercentageToDP(17)}
            }>
            {!clBusiness ? (
              <View>
              <View
                style={{
                  marginTop: heightPercentageToDP(2),
                  marginHorizontal: heightPercentageToDP(1.5),
                }}>
                <View style={{flexDirection: 'row', marginLeft: widthPercentageToDP(6)}}>
                <AppText
                  white
                  size="M"
                  bold
                  style={{textAlign: 'center', lineHeight: 24}}
                  >
                  {t(
                    'EARN UPTO ₹15,000. ',
                  )}
                </AppText>
                  <AppText white size="M" style={{paddingLeft: widthPercentageToDP(1), textAlign: 'center', lineHeight: 24}}>
                    {t('Become a ShopG')}
                  </AppText>
                </View>
                <AppText white size="M" style={{lineHeight: 24, textAlign: 'center', }}>
                {t('community leader with ')}
                <AppText bold>
                    {t('ZERO INVESTMENT')}
                  </AppText>
                  </AppText>
              </View>
              <View style={{
                marginTop: heightPercentageToDP(2),
                marginHorizontal: heightPercentageToDP(1.5),
              }}>
                <AppText
                  white
                  size="M"
                  style={{textAlign: 'center', lineHeight: 25}}>
                  {t(
                    'You '
                  )}
                  <AppText bold>
                    {t('EARN UPTO 16% COMMISSION ')}
                  </AppText>
                  <AppText>
                    {t('on grocery, Kitchen, home & 1000+ products.')}
                  </AppText>
                </AppText>
              </View>
              </View>
            ) : null}
            <View style={styles.middleWhiteSection}>
              <View style={styles.middleWhiteSubSection}>
                <AppText bold>
                  1000+ 
                </AppText>
                <AppText>{t(' Community Leader on Nyota')}</AppText>
              </View>
              <AppText
                size="XXS"
                style={{textAlign: 'center', color: '#292f3a', paddingTop: heightPercentageToDP(0.5)}}>
                {t('Partnered with')}
              </AppText>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View style={styles.logoView}>
                  <Image
                    source={Images.partnerLogo}
                    style={{
                      width: widthPercentageToDP(16),
                      height: heightPercentageToDP(7),
                    }}
                  />
                </View>
                <View style={{marginLeft: widthPercentageToDP(2)}}>
                  <AppText
                    size="XS"
                    style={{paddingTop: heightPercentageToDP(0.5)}}>
                    {t('Tumkur City corporation, BBMP')}
                  </AppText>
                </View>
              </View>
            </View>
            {!clBusiness ? (
               <View style={{marginTop: heightPercentageToDP(2.4), alignItems: 'center'}}>
              <AppText white bold>{t('Complete simple tasks as a Community Leader')}</AppText>
              <View style={{marginTop: heightPercentageToDP(3), flexDirection: 'row'}}>
                <View style={{alignItems: 'center'}}>
                  <Image source={Images.createTask} 
                  style={styles.iconImageView} />
                  <AppText bold size="XS" white style={{textAlign: 'center', paddingTop: heightPercentageToDP(2)}}>{t('TASK 1')}</AppText>
                  <View style={styles.lastSectionTextView}>
                    <AppText white style={{textAlign: 'center'}}>{t('Create a whatsapp group of friends')}</AppText>
                  </View>
                </View>
                <View 
                style={{ 
                  marginHorizontal: widthPercentageToDP(7)
                  }}>
                <Icon
                  name={'chevron-right'}
                  type={'font-awesome'}
                  color={Constants.white}
                  size={20}
                  containerStyle={{
                    top: heightPercentageToDP(4),
                  }}
                />
              </View>
                <View style={{alignItems: 'center',}}>
                  <Image source={Images.shareTask} 
                  style={styles.iconImageView}
                   />
                  <AppText bold size="XS" white style={{textAlign: 'center', paddingTop: heightPercentageToDP(2)}}>{t('TASK 2')}</AppText>
                  <View style={styles.lastSectionTextView}>
                    <AppText white style={{textAlign: 'center'}}>{t('Share daily offers on WhatsApp every day')}</AppText>
                  </View>
                </View>
              </View>
              </View>
            ) : null}
          </LinearGradient>
          {!clBusiness ? (
            null
          ) : (
            <View
              style={{
                justifyContent: 'space-evenly',
                marginTop: heightPercentageToDP(1),
              }}>
              <View
                style={{margin: heightPercentageToDP(2), alignItems: 'center'}}>
                <AppText size="S" bold>
                  {t('Nyota Community Leader Training Guide')}
                </AppText>
              </View>
              {clConfig ? (
                <View style={[styles.flatlistView]}>
                  <FlatList
                    data={clSteps}
                    renderItem={value =>
                      this.trainingCL(value.item, value.index)
                    }
                  />
                </View>
              ) : (
                <View style={styles.loadingView}>
                  <ActivityIndicator size="large" />
                </View>
              )}
            </View>
          )}
        </ScrollView>
        {!clBusiness ? (
          <View style={styles.buttonView}>
            <Button
              color={Constants.primaryColor}
              styleContainer={styles.buttonStyle}
              onPress={this.onClickConfirm}>
                {this.state.isCLCreated ? (
                    <View style={{alignItems: 'center'}}>
                    <ActivityIndicator size="small" color={Constants.white}/>
                  </View> 
                ) : (
              <AppText white>
                {t('I AGREE TO BECOME COMMUNITY LEADER')}
              </AppText>)}
            </Button>
            <AppText
              style={{
              textAlign: 'center', 
              padding: heightPercentageToDP(1)}}
            >{t('I agree to GNyota Community Leader terms and conditions and authorize Nyota to connect with me on WhatsApp, SMS and call.')}</AppText>
          </View>
        ) : null}
        {userPref.userMode === 'CL' ? (
        <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        height={heightPercentageToDP(67)}
        duration={250}
        closeOnPressBack={false}
        closeOnDragDown={false}
        customStyles={{
          container: {
            backgroundColor: Constants.primaryColor,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        }}>
          <CLCreationBottomSheet 
           closeAction={this.handleCloseGroupTargetBottomSheet}
            t={t}
            userPreference={userPref}
            />
        </RBSheet>
      
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: heightPercentageToDP(2.5),
    paddingTop: heightPercentageToDP(1.5),
    flex: 0.2,
  },
  middleGradientSection: {
    flexDirection: 'row',
    marginTop: heightPercentageToDP(3),
    justifyContent: 'space-between',
  },
  loadingView: {
    flex: 0.8,
    alignItems: 'center',
    marginTop: heightPercentageToDP(6),
  },
  contentBox: {
    flex: 0.85,
  },
  middleWhiteSection: {
    backgroundColor: Constants.white,
    marginTop: heightPercentageToDP(2),
    flex: 0.68,
  },
  lastSectionTextView: {
    width: widthPercentageToDP(36), 
    alignItems: 'center', 
    marginTop: heightPercentageToDP(1)
  },
  iconImageView: {
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(21),
    resizeMode: 'contain'
  },
  middleWhiteSubSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: heightPercentageToDP(1.6),
  },
  playIconStyle: {
    zIndex: 1,
    position: 'absolute',
    top: heightPercentageToDP(9),
    bottom: 0,
    left: widthPercentageToDP(35),
    right: 0,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.8,
    position: 'absolute',
    bottom: heightPercentageToDP(28),
    width: widthPercentageToDP(100),
    paddingHorizontal: widthPercentageToDP(3.4),
  },
  buttonView: {
    flex: 0.22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clBusinessText: {
    zIndex: 1,
    position: 'absolute',
    top: heightPercentageToDP(18),
    left: widthPercentageToDP(6),
  },
  clOnboardText: {
    zIndex: 1,
    position: 'absolute',
    top: heightPercentageToDP(20),
    left: widthPercentageToDP(6),
  },
  clSaveIcon: {
    width: widthPercentageToDP(9),
    height: heightPercentageToDP(5),
  },
  whatsappIconView: {
    paddingLeft: widthPercentageToDP(16),
    paddingTop: heightPercentageToDP(1),
    flex: 0.15,
  },
  logoView: {
    alignItems: 'center',
    bottom: heightPercentageToDP(2),
    flex: 0.4,
  },
  whatsappCircleGroupDeal: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
  },
  buttonStyle: {
    backgroundColor: Constants.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    paddingVertical: heightPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(3),
    borderRadius: 6,
    width: '90%',
    elevation: 3,
  },
  flatlistView: {
    flex: 1,
  },
  flatListTextInfoView: {
    flexDirection: 'column',
    marginLeft: widthPercentageToDP(2),
  },
  feedContainer: {
    flexDirection: 'row',
    margin: widthPercentageToDP(2.4),
    marginBottom: heightPercentageToDP(2),
    width: widthPercentageToDP(96),
    height: heightPercentageToDP(3.5),
  },
  circleUserView: {
    marginRight: scaledSize(7),
    marginTop: scaledSize(25),
    width: scaledSize(32),
    height: scaledSize(32),
    borderRadius: 32 / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: heightPercentageToDP(4),
  },
});

const mapStateToProps = state => ({
  clConfig: state.clOnboarding.clConfig,
  rewards: state.rewards.rewards,
  clDetails: state.login.clDetails,
  language: state.home.language,
  groupSummary: state.groupSummary,
  userProfile: state.userProfile,
  userPref: state.login.userPreferences,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  onGetCLOnboarding: () => {
    dispatch(getStarterKit());
  },
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
  onCreateCL: (inputBody) => {
    dispatch(createCL(inputBody))
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value))
  }
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CLOnboarding),
);
