import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../utils';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import {Icon} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {AppText} from '../Texts';
import {liveAnalytics} from '../../native/pages/ShopgLive/redux/actions';
import {LogFBEvent, Events} from '../../Events';
import {Colors, Fonts} from '../../../assets/global';
import {buildDeepLink} from '../../native/pages/utils';
import idx from 'idx';
import moment from 'moment';

export class ShareComponent extends Component {
  constructor() {
    super();
    this.commonShareFn = this.commonShareFn.bind(this);
  }

  commonShareFn = (mssg) => {
    const {widgetId, page, position, category, widgetType, userPref } = this.props;
    let eventProps = {
      widgetId: widgetId,
      page: page,
      category: category,
      widgetType: widgetType,
      position: position,
      sharedBy: userPref && userPref.userMode,
    };

    let userPrefData = {
      userId: userPref && userPref.uid,
      sid: userPref && userPref.sid,
    };
    Share.isPackageInstalled('com.whatsapp').then(({isInstalled}: any) => {
      if (isInstalled) {
        const shareOptions = {
          title: 'Share via',
          message: mssg,
          social: Share.Social.WHATSAPP, // country code + phone number(currently only works on Android)
          filename: 'test', // only for base64 file in Android
        };
        try {
          LogFBEvent(Events.SHARE_WHATSAPP_SHOPG_LIVE_CLICK, eventProps)
          this.props.onAnalytics(Events.SHARE_WHATSAPP_SHOPG_LIVE_CLICK.eventName(), eventProps, userPrefData);
          Share.shareSingle(shareOptions);
        } catch (error) {
          LogFBEvent(Events.SHARE_FAILURE, null)
          this.props.onAnalytics(Events.SHARE_FAILURE.eventName(), eventProps, userPrefData);
          console.error(error);
        }
      }
    });
  }

  shareOfferOnWhatsApp = async () => {
    const {shareMsg, bannerJson, widgetId, page, position, widgetType, category, userPref} = this.props;
    const {t,groupSummary,rewards} = this.props;
    const inviteToken = groupSummary.groupDetails.info.inviteToken;
    const userId =  idx(userPref, _ => _.uid);
    const deepLinkUrl = await buildDeepLink(page, 'ShareComponent', inviteToken, userId, null)
    //const userPreference = this.props.login.userPreferences;
    //const mallInfo = idx(this.props.login, _ => _.clDetails.mallInfo);
    //const mallInfoType = idx(this.props.login, _ => _.clDetails.mallInfo.type);
    const language = this.props.i18n.language;

    let mssg = t(
      `${shareMsg}#NL##NL##DEEPLINKURL##NL##NL#Limited stocks only`,
      {
        DEEPLINKURL: deepLinkUrl,
        NL: '\n',
      },
    );
    let eventProps = {
      widgetId: widgetId,
      page: page,
      category: category,
      widgetType: widgetType,
      position: position,
      sharedBy: userPref && userPref.userMode,
    };

    let userPrefData = {
      userId: userPref && userPref.uid,
      sid: userPref && userPref.sid,
    };


      if(bannerJson && bannerJson.action == 'forward/whatsapp') {
        // Code to share image
        const fs = RNFetchBlob.fs;
        //const imageUrl = `https://cdn.shopg.in/cl-banner/Task/daily/30-Jul-2020-Deal.png`
        let date = moment(new Date()).format("DD-MMM-YYYY")
        let imagePath = `https://cdn.shopg.in/cl-banner/Task/daily/${date}${bannerJson.url}`;
        
        if (imagePath) {
          RNFetchBlob.config({
            fileCache: true,
          })
            .fetch('GET', imagePath)
            .then(resp => {
              imagePath = resp.path();
              return resp.readFile('base64');
            }, (err) => {
              this.commonShareFn(mssg)
              return Promise.reject(err);
            })
            .then(base64Data => {
              Share.isPackageInstalled('com.whatsapp').then(
                ({isInstalled}: any) => {
                  if (isInstalled) {
                    const shareOptions = {
                      title: 'Share via',
                      message: mssg,
                      url: `data:image/png;base64,${base64Data}`,
                      social: Share.Social.WHATSAPP,
                      filename: 'test',
                    };
                    try {
                      LogFBEvent(Events.SHARE_WHATSAPP_SHOPG_LIVE_CLICK, eventProps)
                      this.props.onAnalytics(Events.SHARE_WHATSAPP_SHOPG_LIVE_CLICK, eventProps, userPrefData);
                      Share.shareSingle(shareOptions)
                      .then((res) => { 
                        console.log(res) })
                      .catch((err) => { err && this.commonShareFn(mssg) });
                    } catch (error) {
                      LogFBEvent(Events.SHARE_FAILURE, { component: fragment })
                      this.props.onAnalytics(Events.SHARE_FAILURE, eventProps, userPrefData);
                      console.error(error);
                    }
                  }
                }
              );
              return fs.unlink(imagePath);
            });
        }
      }
      else {
      // Code to share image
      // Share.isPackageInstalled('com.whatsapp').then(({isInstalled}: any) => {
      //   if (isInstalled) {
      //     const shareOptions = {
      //       title: 'Share via',
      //       message: mssg,
      //       social: Share.Social.WHATSAPP, // country code + phone number(currently only works on Android)
      //       filename: 'test', // only for base64 file in Android
      //     };
      //     try {
      //       Share.shareSingle(shareOptions);
      //     } catch (error) {
      //       LogFBEvent(Events.SHARE_FAILURE, { component: fragment })
      //       console.error(error);
      //     }
      //   }
      // });

      this.commonShareFn(mssg);
    } 

  }
    
    render() {
        const {t,shareKey, viewStyle} = this.props
        return (
          <TouchableOpacity onPress={this.shareOfferOnWhatsApp}>
            <View style={[styles.shareData, viewStyle]}>
                <View style={styles.whatsappCircle}>
                    <Icon
                      type="font-awesome"
                      name="whatsapp"
                      color={Colors.white}
                      size={widthPercentageToDP(6)}
                      containerStyle={{
                        alignSelf: 'center',
                      }}
                    />
                </View>
                <AppText greenishBlue bold size="S">
                  {t(shareKey)}
                </AppText>
            </View>
          </TouchableOpacity>
        ); 
    }
}

const styles = StyleSheet.create({
    shareData:{
        flexDirection:'row',
        height:heightPercentageToDP(8),
        justifyContent: 'center',
        alignSelf:'center',
        alignItems:'center',
        width:widthPercentageToDP(80),
      },
    whatsappCircle: {
      marginHorizontal:widthPercentageToDP(1),
      backgroundColor: Colors.whatsappGreen,
      alignItems: 'center',
      justifyContent: 'center',
      width: scaledSize(37),
      height: scaledSize(37),
      borderRadius: 37 / 2,
    },  
});

const mapStateToProps = state => ({
  login: state.login,
  userPref: state.login.userPreferences,
  groupSummary: state.groupSummary,
  rewards: state.rewards.rewards,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
    dispatch,
    onAnalytics: (eventName, eventData, userPrefData) => {
      dispatch(liveAnalytics(eventName, eventData, userPrefData));
    },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(ShareComponent))
);
