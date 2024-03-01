/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Platform, 
  Linking,
  BackHandler,
  ToastAndroid,
  AppState as ApplicationState,
} from 'react-native';
import { Rating, AirbnbRating} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import queryString from 'query-string';
import LinearGradient from 'react-native-linear-gradient';
import { PrimaryButton } from '../../../components/Buttons';
import { AppText } from '../../../components/Texts';
import { Constants } from '../../../styles';
import { customerReviews } from '../../../Constants';
import { connect, Dispatch } from 'react-redux';
import { userPreferences, changeField} from '../Login/actions';
import { AppState } from '../../../state/types';
import NavigationService from '../../../utils/NavigationService';
import LangPopup from '../../../components/PopUp/LangPopup'
import RBSheet from 'react-native-raw-bottom-sheet';
import { getDefaultLanguage } from '../../../utils';
import {Images} from '../../../../assets/images';
import { widthPercentageToDP, heightPercentageToDP, AppWindow } from '../../../utils';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import firebase from '@react-native-firebase/app';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import {LogFBEvent, Events, SetScreenName, parseDeepLinkParams, processDeepLink} from '../../../Events';
import { withTranslation } from 'react-i18next';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LocationComponent from '../../../components/LocationComponent/LocationComponent';

class SplashBase extends Component {
  constructor(private router: Router) {super(); this.state = { isLangPresent: false, isGetStartedVisible: false, count: 0 }}
  accessToken: string = 'default';
  async componentDidMount() {
      ApplicationState.addEventListener('change', this._handleAppStateChange);
    // Initialise Firebase START
      this.initializeFirebasePermission();
      this.initializeFirebaseToken();
      //messaging().onMessage(this.onMessageReceived);
      //messaging().setBackgroundMessageHandler(this.onMessageReceived);
      this.onTokenRefreshListener();
      this.messageListener();
     // this.removeNotificationDisplayedListener();
     // this.removeNotificationListener();
     // this.removeNotificationOpenedListener();
      this.getInitialNotificationListener();
      this.getAppOpenEventAndUrl();
    // Initialise Firebase END
    //this.handleBottomAction();
    let accessToken, fireToken, language, refUser, prefPinCode;
    let asyncObj = await AsyncStorage.multiGet(["accessToken", "fireToken", "language", "FirstRef", "prefPinCode"]);

    accessToken = asyncObj[0][1];
    this.accessToken = accessToken;
    fireToken = asyncObj[1][1];
    language = asyncObj[2][1];
    refUser = asyncObj[3][1];
    prefPinCode = asyncObj[4][1];

    let invitor = refUser && queryString.parse(refUser);
    console.log('Selected Language', language);
    
    if (language) {
      this.setState({
        isLangPresent: !!language,
        language:language,
      })
    } else {
      this.setState({
        //isLangPresent: true,
        language:'english',
      })
    }

    if(!!accessToken) {
      console.log('accessToken is', accessToken);
      this.props.onChangeField('accessToken', accessToken);
      this.props.onUserPreferences(true, fireToken, this.state.language);
    } else {
      // this.setState({
      //   isGetStartedVisible: true
      // });
       this.props.onUserPreferences(false, fireToken, this.state.language);
    }
    this.props.onChangeField('refUser', invitor);
    this.props.onChangeField('prefPinCode', JSON.parse(prefPinCode));
    this.appLaunchEvent = this.appLaunchEvent.bind(this);
    SetScreenName(Events.LOAD_SPLASH_SCREEN.eventName());
    LogFBEvent(Events.LOAD_SPLASH_SCREEN, null);
  }

  initializeFirebasePermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }    

    // Get Firebase token
  async initializeFirebaseToken(){
    await messaging().registerDeviceForRemoteMessages();
    // const id = await iid().get();
    const token = await messaging().getToken();
    console.log('Fire base Token Saving Fire base Token ', token);
    AsyncStorage.setItem('fireToken', token);
    //this.props.onUserPreferences(false, token, null);
  }
    // Refresh Firebase Token
  onTokenRefreshListener(){
    messaging()
      .onTokenRefresh(fcmToken => {
        console.log('Refresh Fire base Token == ', fcmToken);
      });
  }

  onMessageReceived = async (message) => {
    const { type, timestamp } = message.data;
  }

  messageListener() {
    messaging()
      .onMessage((message: RemoteMessage) => {
        if(message){
          console.log('Fire Base Message Received == ', message);
        }
        
      });
  }
 
    getInitialNotificationListener() {
      messaging()
      .getInitialNotification()
      .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
            const data = remoteMessage.data;
            
            if(!!data.dl){
              parseDeepLinkParams(data.dl);
            }
          }
        });
    }

    //Fn determining someone opened app through earn coins flow
    appLaunchEvent = (source, medium, taskId, userId) => {
      this.props.onChangeField('fireAppLaunchEvent', true);
      this.props.onChangeField('launchEventDetails', { source, medium, taskId, userId });
    }

    _handleOpenURL = (event) => {
      console.log('153-> DEEPLINK event', (event && event.url) ? event.url : event);
      let eventparam = (event && event.url) ? event.url : event;
      parseDeepLinkParams(eventparam, this.appLaunchEvent);
    }

    getAppOpenEventAndUrl() {
        dynamicLinks()
          .getInitialLink()
          .then(url => {
            if (!!url) {
              console.log('DEEPLINK Fire Base Deep link open url == ',url);
              this._handleOpenURL(url);
            } else {
              // use deep link to handle the URL.
              if (Platform.OS === 'android') {
                  Linking.getInitialURL()
                  .then((url) => {
                    console.log('DEEPLINK Normal Link for Android url == ',url);
                    if(!!url){
                      this._handleOpenURL(url);
                    }
                  })
                  .catch(err => err);
              } else {
                console.log('DEEPLINK Normal Link for not android url == ',url);
              }
            }
          }, (reason) => alert(reason));
      
      Linking.addEventListener('url', this._handleOpenURL);
      return null;
    }

    handleBottomAction = () => {
      getDefaultLanguage().then(lng => {
        if(lng === null)
          this.RBSheet && this.RBSheet.open();
      });
    };

    handleCloseBottomSheet = () => {
      //this.RBSheet && this.RBSheet.close();
      this.setState({
        isLangPresent: true
         });
         NavigationService.navigate('Home');
    };

    _handleAppStateChange = (nextAppState) => {
      const {dispatch} = this.props;
      if (nextAppState === 'active') {
        console.log('App has come to the foreground!', nextAppState);
        if(!!this.accessToken) {
          dispatch({type: 'GROUPSUMMARY/GET_GROUP_SUMMARY'});
        }
      }
  };

  _renderItem = (item) => {
      return (
          <View style={styles.renderCarouselStyle}>
            <AirbnbRating
               count={5}
               defaultRating={5}
               size={25}
               showRating={false}
             />
             <View style={{alignItems: 'center'}}>
                  <AppText
                    size='M'
                    textProps={{numberOfLines: 3, textAlign: 'center'}}
                    >
                    {item.quote}
                  </AppText>
              <AppText size='XS' bold  style={{textAlign: 'center', color: '#A9A9A9'}} >{item.name}</AppText>
            </View>
          </View>
      );
};

  render() {
    const {t} = this.props;
    
    return (
        <ImageBackground source={Images.backgroundSplash} style={styles.container}>
            {/* <LocationComponent page={"SPLASH"}/> */}
            { this.state.isLangPresent ? null : ( 
              <View style={styles.languageContainer}>
                <LangPopup page={'Splash'} closeAction={this.handleCloseBottomSheet}/>
              </View>
             )}
            {!this.accessToken && this.state.isLangPresent && 
              <View style={styles.submitBtn}>
                <PrimaryButton
                  onPress={() => {
                    NavigationService.navigate('Home');
                    LogFBEvent(Events.SPLASH_GET_STARTED_BUTTON_CLICK, null);
                  }}
                  title={t('GET STARTED')}
                  style={{
                    backgroundColor: Constants.white,
                    height: heightPercentageToDP(7),
                    width: widthPercentageToDP(87)
                  }}
                  textStyle={{
                    color: "#00a9a6",
                    fontSize: 14
                  }}
                  disabled={false}
                 />
             </View>}
          </ImageBackground>
    );
  };
}



const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex:1,
    },
    titleContainer: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textHeading: {
      flex: 0.1,
      alignItems: 'center'
    },
    imageContent: {
      width: widthPercentageToDP(35),
      height: heightPercentageToDP(35),
      resizeMode: 'contain',
    },
    reviewHeading: {
      backgroundColor: Constants.red,
      width: widthPercentageToDP(57),
      height: heightPercentageToDP(3),
      borderRadius: 3,
    },
    descriptionContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 0.15,
    },
    reviewContainer: {
      width: widthPercentageToDP(100),
      flex: 0.30,
      paddingTop: heightPercentageToDP(4),
      justifyContent: 'center',
      alignItems: 'center'
    },
    reviewContent: {
      width: widthPercentageToDP(59),
      height: heightPercentageToDP(30),
      resizeMode: 'stretch',
      justifyContent: 'center',
      alignItems: 'center'
    },
    languageContainer: {
      backgroundColor: Constants.white,
      borderRadius: 10,
      marginTop: heightPercentageToDP(70),
      justifyContent: 'flex-end',
      flex: 1
    },
    renderCarouselStyle: {
      backgroundColor: Constants.white, 
      alignItems: 'center', 
      justifyContent: 'center' , 
      width: widthPercentageToDP(51),
      height: heightPercentageToDP(19),
      marginHorizontal: widthPercentageToDP(2),
    },
    title: {
      color: Constants.white,
      fontWeight: "bold",
      fontSize: 24
    },
    
    description: {
      textAlign: 'center'
    },
    smallText: {
      color: Constants.lightGrey,
      textAlign: 'center'
    },
    submitBtn: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: heightPercentageToDP(78)
    }
  });

const mapStateToProps = (state: AppState) => ({
  login: state.login
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  onUserPreferences: (auth: boolean,  fireToken: string, lang: string) => {
    dispatch(userPreferences(auth,  fireToken, lang));
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
  dispatch
});

const Splash = withTranslation()(connect(
  mapStateToProps,
  mapDipatchToProps
)(SplashBase));

export default Splash;
