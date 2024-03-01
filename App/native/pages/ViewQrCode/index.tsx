import React, {Component} from 'react';
import {View,Image,StyleSheet,TouchableOpacity,ActivityIndicator} from 'react-native';
import { connect, Dispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {scaledSize,widthPercentageToDP,heightPercentageToDP} from '../../../utils';
import {Icon} from 'react-native-elements';
import {Constants} from '../../../styles';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {AppText} from '../../../components/Texts';
import idx from 'idx';
import QRCode from 'react-native-qrcode-svg';
import {liveAnalytics} from '../ShopgLive/redux/actions';
import {Header} from '../../../components/Header/Header';
import {Support} from '../../../components/Support/Support';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import NavigationService from '../../../utils/NavigationService';
import LinearGradientButton from '../../../components/Button/LinearGradientButton';

class ViewQrCodeBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      retryLoading:false
    };
  }

  saveQRCode = () => {
    this.svg.toDataURL(this.callback);
  };

  componentDidMount = () => {
    SetScreenName(Events.LOAD_VIEW_MY_QR_CODE_SCREEN.eventName());
    LogFBEvent(Events.LOAD_VIEW_MY_QR_CODE_SCREEN, null);
  };

  callback = (dataURL) => {
    
    let eventProps = {
      page: this.props.navigation.state.routeName,
      component: 'ViewQRCode',
      sharedBy: this.props.userPref && this.props.userPref.userMode,
    };

    let dataUser = {
      userId: this.props.userPref && this.props.userPref.uid,
      sid: this.props.userPref && this.props.userPref.sid,
    };
    const {t,groupSummary} = this.props;
    const deepLinkUrl = idx(groupSummary, _=>_.groupDetails.info.deepLinkUrl);

    LogFBEvent(Events.SHARE_WHATSAPP_CLICK, eventProps);
    this.props.onAnalytics(
      Events.SHARE_WHATSAPP_CLICK.eventName(),
      eventProps,
      dataUser);

    const message = t('Welcome to my Glowfit Mart.\nGet free delivery, 5% cashback and great discounts when you buy from my Glowfit mart.\nPlease join my Glowfit mart using above QR code or click on this link\n #DEEPLINK#',{DEEPLINK:deepLinkUrl})
    try{
      Share.isPackageInstalled('com.whatsapp').then(
        ({isInstalled}: any) => {
          if (isInstalled) {
            const shareOptions = {
              title: 'Share via',
              message: message,
              url: `data:image/png;base64,${dataURL}`,
              social: Share.Social.WHATSAPP,
              filename: 'test',
            };
            try {
              Share.shareSingle(shareOptions);
            } catch (error) {
              LogFBEvent(Events.SHARE_FAILURE, null)
              console.error(error);
            }
          }
        }
      );
    } catch(err){

    }

  }

  retry = () => {
    this.setState({retryLoading: true});
    setTimeout(() => {
      this.setState({retryLoading: false});
    }, 3000);
  }

  backToTabs = () => {
    NavigationService.goBack();
  }

  render() {
    const {t,groupSummary,userProfile} = this.props;
    const groupCode = idx(groupSummary, _=>_.groupDetails.info.groupCode);
    const { user } = userProfile;
    const deepLinkUrl = idx(groupSummary, _=>_.groupDetails.info.deepLinkUrl);
    const imagePath = deepLinkUrl+"?groupCode="+groupCode+"&name="+user.name;

    if(this.state.retryLoading){
      return(
        <View style={styles.mainContainer}>
          <Header
            t={t}
            title={t('QR code details')}
            rightComponent={<Support t={t} />}/>

          <View style={styles.container}>
            <ActivityIndicator animating size="large" />
          </View>

        </View>
      );
    }

    if(groupCode && deepLinkUrl){
      return (
        <View style={styles.mainContainer}>
            <Header
              t={t}
              title={t('QR code details')}
              rightComponent={<Support t={t} />}/>
  
            <View style={styles.container}>
  
              <QRCode
                value={imagePath} 
                size={185}
                getRef={c => (this.svg = c)}/>
  
              <View style={styles.shareContainer}>
  
                <AppText grey bold size="S">
                    {t('Share this QR code')}
                </AppText>
  
                <TouchableOpacity onPress={()=>this.saveQRCode()}>
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
            </View>
  
        </View>
  
        );
    } else {
      return (
        <View style={styles.mainContainer}>
            <Header
              t={t}
              title={t('QR code details')}
              rightComponent={<Support t={t} />}/>
  
            <View style={styles.container}>
  
              <View style={styles.shareContainer}>
  
                <AppText style={{textAlign: 'center'}} size="XL" bold black>
                    {t('Not able to generate QR code\nplease contact support team')}
                </AppText>

              </View>

              <View style={styles.shareContainer}>

                <TouchableOpacity style={styles.clickHere} onPress={this.retry}>

                  <AppText size="L" bold greenishBlue>
                      {t('Retry')}
                  </AppText>

                </TouchableOpacity>

                <TouchableOpacity style={styles.clickHere} onPress={this.backToTabs}>

                  <AppText size="L" bold greenishBlue>
                      {t('Back')}
                  </AppText>

                </TouchableOpacity>   

              </View>

            </View>
  
        </View>
  
        );
    }

  };
}

const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
  },
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  imageStyle:{
    height:widthPercentageToDP(100),
    width:widthPercentageToDP(100)
  },
  shareContainer:{
    marginTop:scaledSize(10),
    flexDirection:'row',
    width:widthPercentageToDP(100),
    justifyContent:'center',
    alignItems:'center'
  },
  whatsappCircle: {
    marginLeft:scaledSize(10),
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
  },
  textContainer:{
    borderWidth:scaledSize(1),
    borderColor:'grey',
    borderRadius:scaledSize(5),
    justifyContent:'center',
    alignItems:'center',
    margin:scaledSize(5),
    padding:scaledSize(5),
  },
  clickHere: {
    flex:1,
    marginHorizontal: widthPercentageToDP(1),
    height: heightPercentageToDP(5),
    lineHeight: heightPercentageToDP(5),
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: scaledSize(6),
    borderWidth: scaledSize(1),
    borderColor: Constants.primaryColor,
  },
});

const mapStateToProps = (state) => ({
  groupSummary: state.groupSummary,
  userProfile: state.userProfile,
  userPref: state.login.userPreferences,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

const ViewQrCode = connect(
  mapStateToProps,
  mapDipatchToProps
)(ViewQrCodeBase);

export default withTranslation()(ViewQrCode);