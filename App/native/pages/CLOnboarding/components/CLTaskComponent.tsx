import React, {PureComponent} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  AppState,
  PermissionsAndroid,
} from 'react-native';
import idx from 'idx';
import {Card} from 'react-native-elements';
import {AppText} from '../../../../components/Texts';
import {connect} from 'react-redux';
import CarouselBanner from '../../../../components/CarouselBanner/CarouselBanner';
import {withTranslation} from 'react-i18next';
import {shareToWhatsAppCLTasks, showToastr} from '../../utils';
import Markdown from 'react-native-simple-markdown';
import {liveAnalytics} from '../../ShopgLive/redux/actions';
import NavigationService from '../../../../utils/NavigationService';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  scaledSize,
} from '../../../../utils';
import {Constants} from '../../../../styles';
import {LogFBEvent, Events} from '../../../../Events';

const component = 'CL Task Component';

class CLTaskComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      onShareMode: false,
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    //AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  /** Function when the app comes back after sharing the images */

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      let button = idx(this.props.value, _ => _.button);
      if (this.state.onShareMode) {
        this.actionTask(button, true);
      }
    }
    this.setState({appState: nextAppState});
  };

  actionTask = async buttonAction => {
    const {t, language, userPref} = this.props;
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };
    let imageUrlArr = [];
    let bannerJson = this.props.value.bannerJson;
    let eventProps = {
      id: this.props.value.id,
      page: this.props.screen,
      component: component,
      sharedBy: userPref.userMode,
    }
    try {
      /** to ensure the permission being granted, if granted then sharing images/ texts are confirmed */
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'ShopG wants to store images, media contents and files',
          message: 'ShopG wants to store images, media contents and files',
          buttonNegative: 'Deny',
          buttonPositive: 'Allow',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        if (bannerJson !== '') {
          if (language === 'kannada') {
            bannerJson.kannada.length &&
              bannerJson.kannada.map(banner => {
                if (banner.whatsappimagelink) {
                  imageUrlArr = imageUrlArr.concat(banner.whatsappimagelink);
                }
              });
          } else {
            bannerJson.english.length &&
              bannerJson.english.map(banner => {
                if (banner.whatsappimagelink) {
                  imageUrlArr = imageUrlArr.concat(banner.whatsappimagelink);
                }
              });
          }
        }
        let actionObj = buttonAction[0];
        let screenName = actionObj.action;
        if (actionObj.action === 'share/whatsapp') {
          this.props.onAnalytics(Events.SHARE_WHATSAPP_CL_TASK_CLICK.eventName(), eventProps, userPrefData);
          shareToWhatsAppCLTasks(
            eventProps,
            t,
            actionObj.shareText,
            null,
            'CL_TASK',
            imageUrlArr,
          );
        } else if (actionObj.action === 'group') {
          NavigationService.navigate('OrderConfirmation', null);
          LogFBEvent(Events.CL_TASK_ACTION_BUTTON_CLICK, eventProps);
        } else if (actionObj.action === 'shipments/pending') {
          this.props.onChangeTab(0);
          LogFBEvent(Events.CL_TASK_ACTION_BUTTON_CLICK, eventProps);
        }
      } else {
        console.log('permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    const {value, index, t} = this.props;
    let button = idx(value, _ => _.button);
    return (
      <Card
        containerStyle={{
          width: widthPercentageToDP(100),
          alignSelf: 'center',
          backgroundColor: Constants.white,
        }}>
        <View style={styles.topCardView}>
          {value.task ? (
            <AppText
              size="XS"
              bold
              style={{
                color: '#fa6400',
                paddingBottom: heightPercentageToDP(1),
              }}>
              {t(value.task)}
            </AppText>
          ) : null}
          <View
            style={[
              {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
            ]}>
            <View
              style={{
                flex: 0.97,
                justifyContent: 'center',
              }}>
              <AppText size="M" bold style={styles.taskSubstepsStyle}>
                {t(value.title)}
              </AppText>
            </View>
            {button ? (
              <TouchableOpacity
                style={styles.taskGroupShare}
                onPress={() => this.actionTask(button)}>
                <AppText size="S" white bold style={{textAlign: 'center'}}>
                  {t(button[0].actionText)}
                </AppText>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.horizontalLine} />
        </View>
        {Array.isArray(value.substeps) ? (
          value.substeps.map((value, index) => {
            if (value.text !== '' && value.text) {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: heightPercentageToDP(0.5),
                  }}>
                  <View style={styles.circle} />
                  <Markdown style={styles.childT}>{t(value.text)}</Markdown>
                  {value.mediaLink ? (
                    <Image
                      source={{uri: value.mediaLink}}
                      style={styles.iconImage}
                    />
                  ) : null}
                </View>
              );
            } else {
              return null;
            }
          })
        ) : value.description && value.description !== '' ? (
          <Markdown>{t(value.description)}</Markdown>
        ) : null}
        <View style={{alignSelf: 'center'}}>
          <CarouselBanner
            categories={value}
            language={this.props.language}
            dispatch={this.props.dispatch}
            carouselViewStyle={{
              height: heightPercentageToDP(35),
              bottom: heightPercentageToDP(4),
            }}
            carouselImageStyle={{
              height: heightPercentageToDP(35),
              resizeMode: 'contain',
              borderRadius: 7,
            }}
            videoIconImage={styles.iconCLImage}
            isCLTask
            valId={value.id}
            screen={this.props.screen}
            eventName={'CL_BANNER_TASK'}
            markDownTextEnabled
            mainViewStyle={{
              height: heightPercentageToDP(37),
            }}
            enableImageZooming
            showWhatsappButton
          />
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  iconImage: {
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(35),
    resizeMode: 'contain',
    borderRadius: 6,
    alignSelf: 'center',
  },
  horizontalLine: {
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
    paddingTop: widthPercentageToDP(2.2),
    width: widthPercentageToDP(90),
  },
  topCardView: {
    marginBottom: heightPercentageToDP(1.4),
    //borderBottomWidth: 1,
    borderBottomColor: '#d6d6d6',
    justifyContent: 'center',
  },
  taskGroupShare: {
    backgroundColor: Constants.primaryColor,
    width: widthPercentageToDP(19),
    height: heightPercentageToDP(6.5),
    justifyContent: 'center',
    borderRadius: 6,
    //marginBottom: heightPercentageToDP(4),
    elevation: 5,
  },
  taskSubstepsStyle: {
    color: Constants.greyishBlack,
    lineHeight: 21, 
    paddingBottom: heightPercentageToDP(1),
    paddingRight: widthPercentageToDP(4)
  },
  child: {
    backgroundColor: '#fff',
    paddingHorizontal: widthPercentageToDP(4),
    padding: 2,
  },
  whatsappCircleGroupDeal: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
  },
  childT: {
    color: '#a6a6a6',
    paddingHorizontal: widthPercentageToDP(3),
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    marginTop: heightPercentageToDP(1),
    backgroundColor: Constants.black,
    marginRight: widthPercentageToDP(2),
  },
  whatsappIconView: {
    paddingLeft: widthPercentageToDP(16),
    paddingTop: heightPercentageToDP(1),
    flex: 0.15,
  },
  iconCLImage: {
    width: widthPercentageToDP(18),
    height: heightPercentageToDP(6),
    top: heightPercentageToDP(5),
    resizeMode: 'contain',
  },
});

const mapStateToProps = state => ({
  language: state.home.language,
  rewards: state.rewards.rewards,
  groupSummary: state.groupSummary,
  userPref: state.login.userPreferences,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CLTaskComponent),
);
