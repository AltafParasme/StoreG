import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';
import {Icon, Header} from 'react-native-elements';
import CLOnboarding from '../CLOnboarding';
import CLLeaderBoard from '../CLOnboarding/components/CLLeaderBoard';
import {AppText} from '../../../components/Texts';
import {Images} from '../../../../assets/images/index';
import {Constants} from '../../../styles';
import ShippingList from '../ShippingList/ShippingList.js';
import CLMembers from '../CLOnboarding/CLMembers';
import {liveAnalytics} from '../ShopgLive/redux/actions';
import {
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
} from '../../../utils/index';
import {LogFBEvent, Events} from '../../../Events';
import {shareToWhatsApp} from '../utils';
import {withTranslation} from 'react-i18next';
import idx from 'idx';
import CLTasks from '../CLOnboarding/CLTasks';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {ScrollView} from 'react-native-gesture-handler';
import CLEarnings from '../ShippingList/component/CLEarnings';

const initialLayout = {width: widthPercentageToDP(100)};
const component = 'CL Business';

class CLBusinessBase extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeCategoryTab: 'Tasks',
      visitedTab: [],
      index: props.navigation.getParam('actionId')
        ? props.navigation.getParam('actionId')
        : props.clType!='DEMAND' ? 3: 0,
      routes: props.clType!='DEMAND' ? [
        {key: 'first', title: props.t('Earnings')},
        {key: 'second', title: props.t('Orders')},
        {key: 'third', title: props.t('Win Upto ₹25 Lakh cash')},
        {key: 'fourth', title: props.t('Tasks')},
        {key: 'fifth', title: props.t('Training')},
        {key: 'sixth', title: props.t('Members')},
      ]: [
        {key: 'first', title: props.t('Earnings')},
        {key: 'second', title: props.t('Orders')},
        {key: 'third', title: props.t('Win Upto ₹25 Lakh cash')},
        {key: 'sixth', title: props.t('Members')},
      ],
    };
    this.FirstRoute = this.FirstRoute.bind(this);
    this.SecondRoute = this.SecondRoute.bind(this);
    this.ThirdRoute = this.ThirdRoute.bind(this);
    this.FourthRoute = this.FourthRoute.bind(this);
    this.FifthRoute = this.FifthRoute.bind(this);
    this.SixthRoute = this.SixthRoute.bind(this);
    //this.renderTabBar = this.renderTabBar.bind(this);
    this._renderTabBar = this._renderTabBar.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.scroll = null;
  }

  renderLabel = route => (
    <AppText
      size="S"
      medium
      style={
        route &&
        route.key === this.state.routes[this.state.index] &&
        this.state.routes[this.state.index].key
          ? {color: Constants.orange}
          : {}
      }>
      {route.title}
    </AppText>
  );

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
      let index = this.props.navigation.getParam('actionId')
      if (index) {
        this.setState({
          index: index
        })
        this.props.navigation.setParams({actionId: null });
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe.remove();
  }

  onTabPressed = index => {
    this.setState({
      index: index,
    });
    setTimeout(() => {
      this.scroll &&
        this.scroll.scrollTo({
          x: widthPercentageToDP(index * 20),
        });
      this.eventChangeOnClick();
    }, 50);
  };

  eventChangeOnClick() {
    let title =
      this.state.routes[this.state.index].title === 'Win Upto ₹25 Lakh cash'
        ? 'LeaderBoard'
        : this.state.routes[this.state.index].title;
    let isPresentTab = false;
    this.state.visitedTab.map(item => {
      if (item === title) {
        isPresentTab = true;
      }
    });
    if (!isPresentTab) {
      if (title === 'Tasks') {
        LogFBEvent(Events.CL_TASKS_LOAD, null);
      } else if (title === 'LeaderBoard') {
        LogFBEvent(Events.CL_LEADERBOARD_LOAD, null);
      } else if (title === 'Training') {
        LogFBEvent(Events.CL_TRAINING_LOAD, null);
      } else if (title === 'Members') {
        LogFBEvent(Events.CL_MEMBERS_LOAD, null);
      }
    }
    this.setState({
      visitedTab: this.state.visitedTab.concat(title),
    });
  }

  _renderTabBar = props => {
    return (
      <SafeAreaView>
        <ScrollView
          ref={node => (this.scroll = node)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{height: heightPercentageToDP(5)}}
          style={styles.tabBar}>
          {props.navigationState.routes.map((route, i) => {
            return (
              <TouchableOpacity
                onPress={() => this.onTabPressed(i)}
                style={[
                  styles.tabButtonStyle,
                  route.key === this.state.routes[this.state.index].key
                    ? {borderBottomWidth: 3, borderColor: Constants.orange}
                    : i === 2
                    ? {marginBottom: heightPercentageToDP(15)}
                    : {},
                ]}>
                {i === 2 ? (
                  <Image
                    source={Images.coin}
                    style={{
                      height: scaledSize(30),
                      width: scaledSize(30),
                      marginRight: widthPercentageToDP(2),
                    }}
                  />
                ) : null}
                <View style={i === 2 ? {width: widthPercentageToDP(24)} : {}}>
                  <AppText
                    size="S"
                    medium
                    style={[
                      route.key === this.state.routes[this.state.index].key
                        ? {color: Constants.orange}
                        : i === 3
                        ? {paddingBottom: heightPercentageToDP(20)}
                        : {},
                    ]}>
                    {route.title}
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  };

  SecondRoute = () => (
    <ShippingList navigation={this.props.navigation} clBusiness />
  );

  FirstRoute = () => <CLEarnings navigation={this.props.navigation} />;

  ThirdRoute = () => <CLLeaderBoard navigation={this.props.navigation} />;

  FourthRoute = () => (
    <CLTasks navigation={this.props.navigation} onChangeTab={this.onChange} />
  );

  FifthRoute = () => (
    <CLOnboarding clBusiness navigation={this.props.navigation} />
  );

  SixthRoute = () => <CLMembers />;

  renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
    third: this.ThirdRoute,
    fourth: this.FourthRoute,
    fifth: this.FifthRoute,
    sixth: this.SixthRoute,
  });

  onChange = tab => {
    this.setState({
      index: tab,
    });
  };

  render() {
    const {login, t, rewards, groupSummary, language, userPref} = this.props;
    const mallInfo = idx(login, _ => _.clDetails.mallInfo.name);
    let eventProps = {
      component: component,
      sharedBy: userPref.userMode,
      page: this.props.navigation.state.routeName,
    };
    let dataUser = {
      userId: userPref && userPref.uid,
      sid: userPref && userPref.sid,
    };
    return (
      <View style={{flex: 1}}>
        <Header
          containerStyle={styles.headerContainerStyle}
          leftComponent={
            mallInfo ? (
              <View
                style={{
                  width: widthPercentageToDP(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: "row",
                }}>
                <View style={styles.profileImageContainer}>
                      <Image
                        style={styles.mallImageContent}
                        source={Images.smallerLogo}
                      />
                  </View>

                  <View style={{ marginLeft: widthPercentageToDP(1) }}>
                    <AppText size="S" bold black>
                      {t(`#MALLINFO#\'s`, { MALLINFO: mallInfo.toUpperCase() })}
                    </AppText>
                    <AppText size="M" bold black>
                      {t(`Nyota Store`)}
                    </AppText>
                  </View>
              </View>
            ) : (
              <Image style={styles.imageContent} source={Images.glowfitLogo} />
            )
          }
          rightComponent={
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  shareToWhatsApp(
                    'CLBusiness',
                    'CLHeader',
                    eventProps,
                    t,
                    rewards,
                    language,
                    groupSummary,
                    userPref,
                    'CLHeader'
                  );
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
              </TouchableOpacity>
            </View>
          }
        />

        <TabView
          navigationState={{index: this.state.index, routes: this.state.routes}}
          renderScene={this.renderScene}
          onIndexChange={this.onChange}
          initialLayout={initialLayout}
          swipeEnabled={false}
          renderTabBar={this._renderTabBar}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mallImageContent: {
    width: widthPercentageToDP(5),
    height: heightPercentageToDP(5),
    resizeMode: 'contain',
  },
  headerContainerStyle: {
    backgroundColor: Constants.white,
    height: heightPercentageToDP(9.5),
    paddingBottom: heightPercentageToDP(3),
  },
  tabButtonStyle: {
    paddingHorizontal: widthPercentageToDP(2.5),
    height: heightPercentageToDP(5),
    paddingBottom: widthPercentageToDP(5),
    flexDirection: 'row',
  },
  imageContent: {
    width: widthPercentageToDP(30),
    height: heightPercentageToDP(30),
    resizeMode: 'contain',
  },
  profileImageContainer:{
    height:heightPercentageToDP(5),
    width:heightPercentageToDP(5),
  },
  whatsappCircle: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
  },
  tabBar: {
    flexDirection: 'row',
    maxHeight: heightPercentageToDP(6.5),
    paddingTop: heightPercentageToDP(1.4),
    paddingRight: heightPercentageToDP(3),
    borderBottomWidth: 0.2,
    elevation: 1.6,
  },
});

const mapStateToProps = state => {
  return {
    login: state.login,
    rewards: state.rewards.rewards,
    language: state.home.language,
    groupSummary: state.groupSummary,
    userPref: state.login.userPreferences,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  }
});

const CLBusiness = connect(mapStateToProps, mapDispatchToProps)(CLBusinessBase);

export default withTranslation()(CLBusiness);
