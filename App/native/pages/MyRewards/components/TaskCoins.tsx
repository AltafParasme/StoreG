import React, {PureComponent, Component} from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Image,
} from 'react-native';
import idx from 'idx';
import {AppText} from '../../../../components/Texts';
import {Icon, Header} from 'react-native-elements';
import {connect} from 'react-redux';
import {Constants} from '../../../../styles';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  scaledSize,
} from '../../../../utils';
import {Images} from '../../../../../assets/images';
import CoinShare from './CoinShare';
import FeedBackShare from './FeedBackShare';
import DailyCheckIn from './DailyCheckIn';
import ProductShare from './ProductShare';
import UserTaskStrip from '../../Home/component/UserTaskStrip';
import {SvgUri} from 'react-native-svg';
import {getRewards} from '../actions';
import {liveAnalytics} from '../../ShopgLive/redux/actions';
import {withTranslation} from 'react-i18next';
import {shareToWhatsApp} from '../../utils';
import {Events} from '../../../../Events';

const component = 'TaskCoins';

class TaskCoins extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      layoutHeight: 0,
      activeIndex: null,
      eventProps: null,
      dataUser: null,
      components: {
        CoinShare,
        DailyCheckIn,
        ProductShare,
        FeedBackShare,
        UserTaskStrip
      },
    };

    this.onCompleteTask = this.onCompleteTask.bind(this);
  }

  onPressList = id => {
    const {layoutHeight} = this.state;
    let {onPressTasks, data} = this.props;
    if (data.task.isAccordianEnabled) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (layoutHeight == 0) {
        onPressTasks(id);
        this.setState({
          layoutHeight: null,
          activeIndex: id,
        });
      } else {
        this.setState({
          layoutHeight: 0,
        });
      }
    }
  };

  componentDidUpdate(nextProps, nextState) {
    const {userPref} = this.props;
    if (this.state.eventProps == null && userPref) {
      let eventProps = {
        page: this.props.navigation.state.routeName,
        component: component,
        sharedBy: userPref && this.props.userPref.userMode,
      };
      let dataUser = {
        userId: userPref.uid,
        sid: userPref.sid,
      };
      this.setState({
        eventProps: eventProps,
        dataUser: dataUser,
      });
    }
  }

  onCompleteTask = (offerId, event) => {
    const {data, userPref} = this.props;
    let eventProps = {
      taskId: data.id,
    };
    if(offerId) {
      eventProps['actionId'] = offerId;
    }
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };
    let eventDetail = Events.SHARE_OFFER_WHATSAPP_CLICK.eventName();
    this.props.onAnalytics(
      eventDetail,
      eventProps,
      userPrefData
    );
    setTimeout(() => {
      this.props.onGetRewards(false, true, false, false, null, null);
    }, 100)
    
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.activeId !== this.state.activeIndex &&
      this.state.layoutHeight == null
    ) {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }

  render() {
    const {
      data,
      onPressTasks,
      activeId,
      t,
      userPref,
      groupSummary,
      rewards,
      clDetails
    } = this.props;
    const language = this.props.i18n.language;
    const {components} = this.state;
    const TaskInnerComponent =
      data.task.widgetType && components.hasOwnProperty(data.task.widgetType)
        ? components[data.task.widgetType]
        : View;
    const {layoutHeight} = this.state;
    const arrowDirection = layoutHeight == 0 ? 'angle-down' : 'angle-up';
    const whatsAppLink = idx(
      clDetails,
      _ => _.clConfig.whatsAppLink
    );
    const mallInfo = idx(clDetails, _ => _.mallInfo);
    const userId = (userPref && userPref.uid) ? userPref.uid : '';
    const userMode = idx(userPref, _ => _.userMode);
    return (
      <View>
      {data && data.task.isAccordianEnabled ? 
        (<View style={styles.mainView}><TouchableOpacity
          onPress={() => this.onPressList(data.id)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: heightPercentageToDP(1.6),
            }}>
            <SvgUri
              width={scaledSize(36)}
              height={scaledSize(36)}
              uri={data.task.iconUrl}
            />
            <View style={styles.titleView}>
              <AppText textProps={{numberOfLines: 2}} style={{lineHeight: 20}}>
                {data.description}
              </AppText>
              <View style={{ justifyContent: 'center', alignItems: 'center'}}>
              <AppText
                  secondaryColor
                  >
                {t(`Maximum #MAXPOINTSPERDAY# coins per day`, {MAXPOINTSPERDAY: data.maxPointsPerDay})}
                </AppText>
              </View> 
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: heightPercentageToDP(1.6),
              }}>
              <Image source={Images.coin} style={styles.coinImageStyle} />
              <AppText
                bold
                style={{
                  color: '#fa6400',
                  marginRight: widthPercentageToDP(2.5),
                }}>
                {data.pointsPerTask}
              </AppText>
              {data && data.task.isAccordianEnabled ? (
                <Icon
                  name={arrowDirection}
                  type={'font-awesome'}
                  color={Constants.black}
                  solid
                  iconStyle={{
                    fontWeight: 'bold',
                    marginRight: widthPercentageToDP(2),
                  }}
                  size={widthPercentageToDP(5)}
                />
              ) : null}
            </View>
            {data && data.task.buttonText ? (
              <TouchableOpacity
                style={styles.shareView}
                onPress={() => {
                  shareToWhatsApp(
                    this.state.eventProps,
                    t,
                    rewards,
                    language,
                    groupSummary,
                    userPref,
                    (fragment = 'Rewards')
                  );
                  this.props.onAnalytics(
                    Events.SHARE_WHATSAPP_CLICK,
                    this.state.eventProps,
                    this.state.dataUser
                  );
                }}>
                <AppText
                  size="XS"
                  white
                  style={{textAlign: 'center', top: heightPercentageToDP(1)}}>
                  {t(data.task.buttonText)}
                </AppText>
              </TouchableOpacity>
            ) : null}
          </View>
        </TouchableOpacity>
        <View style={{height: layoutHeight, overflow: 'hidden'}}>
          <View
            style={{
              height: layoutHeight,
              //overflow: 'hidden',
            }}>
            <View style={styles.baseLine} />
            <TaskInnerComponent
              screen={'MyRewards'}
              isExpanded={data.isExpanded}
              data={data.task}
              widgetId={data.id}
              pointsPerTask={data.pointsPerTask}
              onCompleteTask={this.onCompleteTask}
              userId={userId}
              mallName={mallInfo}
              whatsAppLink={whatsAppLink}
              userMode={userMode}
            />
          </View>    
        </View>
        </View>)   
      : <TaskInnerComponent data={data} widgetId={data.id}/>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: Constants.white,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    paddingHorizontal: widthPercentageToDP(2),
    marginVertical: heightPercentageToDP(1.6),
    paddingBottom: heightPercentageToDP(1),
  },
  titleView: {
    marginLeft: widthPercentageToDP(3),
    width: widthPercentageToDP(53),
    height: heightPercentageToDP(6),
  },
  coinImageStyle: {
    height: scaledSize(20),
    width: scaledSize(19),
    resizeMode: 'contain',
    marginRight: widthPercentageToDP(1),
  },
  shareView: {
    height: heightPercentageToDP(4),
    width: widthPercentageToDP(20),
    backgroundColor: Constants.primaryColor,
    borderRadius: 5,
    marginVertical: heightPercentageToDP(1.3),
  },
});

const mapStateToProps = state => ({
  rewards: state.rewards.rewards,
  userProfile: state.userProfile,
  groupSummary: state.groupSummary,
  userPref: state.login.userPreferences,
  clDetails: state.login.clDetails
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
  onGetRewards: (getCashback, getCoins, getScratchDetails ,history,page, size) => {
    dispatch(getRewards(getCashback, getCoins, getScratchDetails ,history,page, size));
  },
  // other callbacks go here...
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(TaskCoins)
);
