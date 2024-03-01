import * as React from 'react';
import { Component } from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    Image
  } from 'react-native';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import idx from 'idx';
import {Images} from '../../../../../assets/images';
import Share from 'react-native-share';
import {buildDeepLink} from '../../utils';
import {withTranslation} from 'react-i18next';
import {liveAnalytics} from '../../ShopgLive/redux/actions';
import {AppText} from '../../../../components/Texts';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import { heightPercentageToDP, widthPercentageToDP, scaledSize } from '../../../../utils';
import { LogFBEvent, Events } from '../../../../Events';

class FreeSampleBanner extends Component {

    constructor(props) {
      super(props);
      this.shareToWhatsApp = this.shareToWhatsApp.bind(this);
    }

    shareToWhatsApp = async () => {
      const {t,groupSummary, screen, userPref} = this.props;
      this.setState({
        isLoading: true,
      });
      let eventProps = {
        screen: screen,
        type: 'FreeSampleBanner',
      };
      let dataUser = {
        userId: this.props.userPref && this.props.userPref.uid,
        sid: this.props.userPref && this.props.userPref.sid,
      };
      
      const inviteToken = groupSummary.groupDetails.info.inviteToken;
      const userId =  idx(userPref, _ => _.uid);
      const deepLinkUrl = await buildDeepLink(screen, 'FreeSampleBanner', inviteToken, userId, null);
      
      let shareMsg = t('Hi Friends, #NL##NL#Claim the FREE SAMPLE of *Ohayo Natural Glow Face Pack* on Glowfit #NL##NL#This is a *100% Natural* product both for Women & Men. #NL##NL#Product contains 100% natural *Rose & Orange Peel* 🌹🌹🍊🍊 that does wonders to skin. #NL##NL#Here is the review by one of customer *Arifa Banu* #NL##NL#*This product gave an instant  glow to my face and the skin felt softer .. !!* #NL##NL##DEEPLINKURL# #NL# #NL#*Hurry up* and claim your FREE SAMPLE now ☝️☝️ #NL##NL# Limited *FREE SAMPLES* only !!', { NL: '\n', DEEPLINKURL: deepLinkUrl });
      
      const fs = RNFetchBlob.fs;
        let imagePath = null;
          RNFetchBlob.config({
            fileCache: true,
          })
            .fetch('GET', 'http://cdn.shopg.in/shopg_live/ohayo_free_sample.png')
            .then(resp => {
              imagePath = resp.path();
              return resp.readFile('base64');
            })
            .then(base64Data => {
              Share.isPackageInstalled('com.whatsapp').then(
                ({isInstalled}: any) => {
                  if (isInstalled) {
                    const shareOptions = {
                      title: 'Share via',
                      message: shareMsg,
                      url: `data:image/png;base64,${base64Data}`,
                      social: Share.Social.WHATSAPP,
                      filename: 'test',
                    };
                    try {
                      Share.shareSingle(shareOptions);
                    } catch (error) {
                      LogFBEvent(Events.SHARE_FAILURE, null);
                      console.error(error);
                    }
                  }
                }
              );
              this.setState({
                isLoading: false,
              });
              return fs.unlink(imagePath);
            });
       LogFBEvent(Events.SHARE_WHATSAPP_CLICK, eventProps);
       this.props.onAnalytics(
        Events.SHARE_WHATSAPP_CLICK.eventName(),
        eventProps,
        dataUser
      );
    }

    render() {
      const {t} = this.props;
      
        return (
            <ImageBackground
            source={Images.order_confirm_free_sample}
            imageStyle={{borderRadius: 12 }}
              style={{
                height: heightPercentageToDP(34), 
                width: widthPercentageToDP(93),
                marginTop: heightPercentageToDP(2),
                justifyContent: 'flex-end',
              }}
            >
              <View
              style={{
                alignItems: 'center',
                marginBottom: heightPercentageToDP(1.5),
                height: heightPercentageToDP(6),
              }}>
              <LinearGradientButton
                gradientStyles={{
                  width: widthPercentageToDP(84),
                }}
                colors={['#0dc143', '#0dc143', '#0dc143']}
                title={t('Share Free Face Pack with Friends')}
                titleStyle={{fontSize: scaledSize(15), fontWeight: 'bold'}}
                onPress={this.shareToWhatsApp}
                btnStyles={{flex: 0.45, flexDirection: 'row'}}>
                <Image source={Images.whatsapp} style={styles.buttonImage} />
              </LinearGradientButton>
            </View>
            </ImageBackground>
        );
    }
}

const styles =  StyleSheet.create({
  buttonImage: {
    height: scaledSize(16),
    width: scaledSize(16),
    marginRight: 10,
    resizeMode: 'contain',
  },
})

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

export default withTranslation()(
  connect(
    null,
    mapDipatchToProps,
  )(FreeSampleBanner),
);