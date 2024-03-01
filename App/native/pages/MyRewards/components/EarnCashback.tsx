import React, {PureComponent, Component} from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../components/Texts';
import {connect} from 'react-redux';
import idx from 'idx';
import GroupDealCoupon from '../../OrderConfirmation/Component/GroupDealCoupon';
import {getGroupSummary} from '../../OrderConfirmation/actions';
import {Icon, Header} from 'react-native-elements';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  scaledSize,
} from '../../../../utils';
import {Constants} from '../../../../styles';
import {ScrollView} from 'react-native-gesture-handler';
import {Images} from '../../../../../assets/images';
import { currentUser} from '../../UserProfile/actions';
import NavigationService from '../../../../utils/NavigationService';

class EarnCashback extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      RefereeCurrentCycle: null,
      referralBonus: 0,
      dealEndsDate: null,
      selfItem: null,
      userName: '--',
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    if (!this.props.userProfile.user)
      this.props.onCurrentUser();
  }

  onPressTasks = () => {
    NavigationService.navigate('MyOrderBusinessCheckout');
  };

  render() {
    let {
      userPref,
      rewards,
      groupSummary,
      t,
      userProfile,
      TaskData,
      lenDoneTasks,
    } = this.props;
    let pendingTask =
      TaskData && lenDoneTasks && TaskData.length - lenDoneTasks;
    let userMode = idx(userPref, _ => _.userMode);
    const language = this.props.i18n.language;
    let groupDetails = idx(groupSummary, _ => _.groupDetails);
    const refferalUserDetails =
    groupDetails && groupDetails.referralUserDetails &&
      groupDetails.referralUserDetails.userInfo;
    const RefereeCurrentCycleAll =
      refferalUserDetails &&
      refferalUserDetails.filter(data => data.isCurrentCycleUser);
    let RefereeCurrentCycle = [];
    RefereeCurrentCycleAll &&
      RefereeCurrentCycleAll.forEach(element => {
        groupDetails && groupDetails.summary.forEach(summ => {
          if (element.userid === summ.userId)
            RefereeCurrentCycle = RefereeCurrentCycle.concat(element);
        });
      });
    const now = Date.now();
    const offerEndDate = groupDetails && groupDetails.info.offerEndDate || now;
    const dealEndsDate = offerEndDate - now;
    const referralBonus = idx(rewards, _ => _.rewardsInfo.refferalBonus);
    const items = groupDetails && groupDetails.summary || [];
    const selfItem = items.filter(item => item.isSelf)[0] || {};
    const userName = idx(userProfile, _ => _.user.name) || '--';

    return (
      <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
        <ScrollView
          style={{maxHeight: heightPercentageToDP(63)}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View style={styles.orderConfirmationBox}>
              <GroupDealCoupon
                items={items}
                selfItem={selfItem}
                screen={this.props.navigation.state.routeName}
                dealEndsDate={dealEndsDate}
                referralBonus={referralBonus}
                t={t}
                isEarnCashBack
                rewards={rewards}
                groupSummary={groupSummary}
                language={language}
                userPreference={userPref}
                RefereeCurrentCycle={RefereeCurrentCycle}
                userName={userName}
              />
            </View>
            <View style={styles.cashbackCoupon}>
              <GroupDealCoupon
                items={items}
                selfItem={selfItem}
                screen={this.props.navigation.state.routeName}
                dealEndsDate={dealEndsDate}
                referralBonus={referralBonus}
                t={t}
                isBuyNow
                rewards={rewards}
                groupSummary={groupSummary}
                language={language}
                userPreference={userPref}
                RefereeCurrentCycle={RefereeCurrentCycle}
                userName={userName}
              />
            </View>
          </View>
          {userMode === 'CL' ? (
            <ImageBackground
              source={Images.earnCashback}
              style={styles.imageBackgroundStyle}>
              {pendingTask ? (
                <View style={styles.contentTextView}>
                  <AppText bold white style={styles.contentTextStyle}>
                    {t(`${pendingTask} TASKS PENDING`)}
                  </AppText>
                </View>
              ) : (
                <View
                  style={[
                    styles.contentTextView,
                    {backgroundColor: 'transparent'},
                  ]}
                />
              )}
              <View style={styles.contentView}>
                <Image
                  source={Images.reward_generic_image}
                  style={styles.contentImage}
                />
                <AppText
                  size="XXS"
                  style={{marginTop: heightPercentageToDP(1.6)}}>
                  {t('Win a Scratch Card!')}
                </AppText>
                <TouchableOpacity
                  style={styles.taskButton}
                  onPress={this.onPressTasks}>
                  <AppText white size="XS">
                    {t('SHOW TASKS')}
                  </AppText>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  orderConfirmationBox: {
    backgroundColor: Constants.white,
    alignItems: 'center',
    flex: 0.38,
    marginTop: heightPercentageToDP(2),
    width: widthPercentageToDP(91),
  },
  cashbackCoupon: {
    backgroundColor: Constants.white,
    marginTop: heightPercentageToDP(3.2),
    alignItems: 'center',
    flex: 0.2,
    width: widthPercentageToDP(91),
  },
  imageBackgroundStyle: {
    alignItems: 'center',
    marginVertical: heightPercentageToDP(2),
    flex: 0.29,
    width: widthPercentageToDP(100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: heightPercentageToDP(3.33),
  },
  contentView: {
    backgroundColor: Constants.white,
    height: heightPercentageToDP(25),
    width: widthPercentageToDP(34),
    alignItems: 'center',
  },
  contentImage: {
    width: widthPercentageToDP(28),
    height: heightPercentageToDP(13),
    marginTop: heightPercentageToDP(1.6),
    borderRadius: 5,
  },
  taskButton: {
    width: widthPercentageToDP(28),
    height: heightPercentageToDP(4.3),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.primaryColor,
    borderRadius: 5,
    marginTop: heightPercentageToDP(1.6),
  },
  contentTextStyle: {
    fontSize: 9,
    paddingVertical: heightPercentageToDP(0.8),
    paddingHorizontal: widthPercentageToDP(2),
    letterSpacing: 2,
  },
  contentTextView: {
    backgroundColor: '#ec3d5a',
    top: heightPercentageToDP(5),
    borderRadius: 3,
  },
});

const mapStateToProps = state => ({
  rewards: state.rewards.rewards,
  userProfile: state.userProfile,
  groupSummary: state.groupSummary,
  userPref: state.login.userPreferences,
  lenDoneTasks: state.clOnboarding.lenDoneTasks,
  TaskData: state.clOnboarding.TaskData,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
  onGetGroupSummary: () => {
    dispatch(getGroupSummary());
  },
  onCurrentUser: () => {
    dispatch(currentUser());
  },
  // other callbacks go here...
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(EarnCashback)
);
