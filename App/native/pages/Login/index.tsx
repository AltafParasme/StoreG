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
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  InteractionManager,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import codePush from 'react-native-code-push';
import Button from '../../../components/Button/Button'
import Config from "react-native-config";
import { connect, Dispatch } from 'react-redux';
import RNSmsRetriever from 'react-native-sms-retriever-api';
import { Constants } from '../../../styles';
import { LoginState } from './types';
import { AppText } from '../../../components/Texts';
import { sendOtp, verifyOtp, changeField, registerUser } from './actions';
import NavigationService from '../../../utils/NavigationService';
import {NativeEventEmitter, NativeModules, DeviceEventEmitter} from 'react-native';
import { withTranslation } from 'react-i18next';
import { scaledSize, heightPercentageToDP, widthPercentageToDP } from '../../../utils';
import {LogFBEvent, Events, SetScreenName, } from '../../../Events';
import {NavigationActions} from 'react-navigation';
import { showToastr } from '../utils';

class LoginBase extends Component {
  constructor(private router: Router) {super();
    this.verifyOtp = this.verifyOtp.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      isDisabled: false,
      timer: 60,
      onPressNext: false,
      count: 0,
    }

    this.listenEventsFromAndroidNative = this.listenEventsFromAndroidNative.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.startTimeM = '';
    this.durationM = '';
  }

  componentWillMount() {
    // this.listenEventsFromAndroidNative();
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    codePush.disallowRestart();
    this.startTimeM = new Date().getTime();
  }

  componentWillUnmount() {
    this._unsubscribe.remove();
    codePush.allowRestart();
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    NavigationService.goBack();
    return true;
  }

  componentDidMount() {

  this._unsubscribe = this.props.navigation.addListener('didFocus', () => {
    try{
      InteractionManager.runAfterInteractions(() => {
        this.listenEventsFromAndroidNative();
      });
    } catch {
      console.log('--- Listening from android native failed ---');
    }
  });  

  this.durationM = new Date().getTime() - this.startTimeM;
  SetScreenName(Events.LOAD_LOGIN_SCREEN.eventName());
  LogFBEvent(Events.LOAD_LOGIN_SCREEN, {timeTaken: this.durationM});
  }

  async listenEventsFromAndroidNative() {
    console.log("i am here0");
    try{
      if(RNSmsRetriever){
        try {  
          RNSmsRetriever.requestHint().then( (phoneNumber)=> {
            if(!!phoneNumber && phoneNumber.length >= 10 ){
              phoneNumber = phoneNumber.substr(phoneNumber.length - 10);
              this.props.onSendOtp( phoneNumber);
              this.props.onChangeField('phoneNumber', phoneNumber);
              this.props.onChangeField('phoneNumberValid', true)
              console.log('Phone phoneNumber is -----> '+ phoneNumber );
            }
          })
        } catch (error) {
            console.log('error', JSON.stringify(error));
        }; 
        try {
            RNSmsRetriever.getOtp().then( ( res )=> {
            if (res) {
              RNSmsRetriever.addListener(this.readOtp);
            }
            }).catch(e => {
              console.log('126-> res error', e);
            })
          } catch (error) {
            console.log('error', JSON.stringify(error));
          }
      }
  } catch (error) {
      console.log('error', JSON.stringify(error));
    }
  }

  // componentDidUpdate() {
  //   console.log('login props value is ', this.props);
  //   if (this.props.login.resendOtpEnable) {
  //     if (this.state.onPressNext)
  //       this.setState({ onPressNext: !this.state.onPressNext});
  //   }
  // }


  readOtp = ({message}) => {
    try {
      let getOTP = (str) => {
        let match = str.match(/\b\d{4}\b/)
        return match && match[0]
      }
      let OTP = getOTP(message);
      this.props.onChangeField('otp', OTP);
      this.verifyOtp();
    }catch(error) {
     console.log('--- read otp failed --', error);
   }
  }

  
  handleResendOTP() {
    this.props.onSendOtp(this.props.login.phoneNumber)
    this.setState({
        isDisabled: true
    });

    setTimeout(() => this.setState({ isOTPDisabled: false }), 60000);
  
    let timeInterval = setInterval(
        () => {this.setState(()=> ({ timer: this.state.timer - 1 }))
        if (this.state.timer < 1) {
            clearInterval(timeInterval)
            this.setState({ timer : 60, isDisabled: false})
          }
        },
        1000
      );
  }

  

  onChange(name, e) {
    const value = e.nativeEvent.text || '';
    this.props.onChangeField(name, value)
    let phoneNumberValid = this.props.login.phoneNumberValid, otpValid = this.props.login.otpValid,nameValid = this.props.login.nameValid, formValid = this.props.login.formValid;

    switch(name) {
      case "phoneNumber":
        let isPhoneNumberLengthValid =  (value.length === 10);
        phoneNumberValid = isPhoneNumberLengthValid ? (((/^\d{3}\d{3}\d{4}$/).test(value)) ? true : false ) : false
        if (!phoneNumberValid && isPhoneNumberLengthValid) {
          showToastr('Please enter a valid phone number');
        }
        break;
      case "otp":
        otpValid = (value.length === 4) ? true : false
        break;
        case "name":
        nameValid = (value.length <= 60) ? true : false
        break;  
    }

    console.log('phone number valid is ', phoneNumberValid);

    if(this.props.login.userRegistered)
      formValid = phoneNumberValid && otpValid;
    else {
      formValid = phoneNumberValid && otpValid && nameValid;
    }
    // this.setState({
    //   phoneNumberValid: phoneNumberValid,
    //   otpValid: otpValid,
    //   formValid: formValid
    // })

    this.props.onChangeField('phoneNumberValid', phoneNumberValid)
    this.props.onChangeField('otpValid', otpValid)
    this.props.onChangeField('nameValid', nameValid)
    this.props.onChangeField('formValid', formValid)

    if(name === 'phoneNumber' && phoneNumberValid) {
      this.props.onSendOtp( value )
    }
  }

  verifyOtp() {
    const callback = this.props.navigation.getParam('callback');
    if (this.props.login.userRegistered) {
          this.props.onVerifyOtp( null, this.props.login.otp, this.props.login.phoneNumber, callback )
        }
        else {
          this.props.onRegisterUser( null, this.props.login.otp, this.props.login.phoneNumber, this.props.login.name, callback )
      }
      LogFBEvent(Events.LOGIN_LOGIN_BUTTON_CLICK, null);
  }

  render() {
    const {navigate} = this.props.navigation;
    const {t} = this.props;
    
    console.log('212-> this.props.login', this.props.login);
    return (
        <View style={styles.container}>
        <View style={{flex: 2, marginTop: heightPercentageToDP(2), alignSelf: 'center'}}>
          <View style={styles.titleContainer}><AppText black medium bold size="L" style={styles.title}>{t(`Enter mobile number to #NL# get started!`, { NL: '\n'})}</AppText></View>
          <View style={{ marginTop: heightPercentageToDP(3), flex: 1.7}}>
            <View style={{width: widthPercentageToDP(87), alignSelf: 'center'}}>
              <TextInput autoFocus={true} label={t('Your Number')} maxLength={10} style={styles.inputStyle} placeholder={t('Your Number')} value={this.props.login.phoneNumber} keyboardType = 'numeric' onChange={(event) => {this.onChange("phoneNumber", event)}}/>
              {this.props.login.lodding && (
                  <ActivityIndicator
                    color="black"
                    style={styles.activityIndicator}
                    size="small"
                  />
                )}
           
            {this.props.login.otpCallStatus === 'Success' ?
              <View>
                <TextInput label='Your OTP Number' maxLength={4} style={[styles.inputStyle, {marginTop: 10 }]} placeholder="OTP" value={this.props.login.otp} keyboardType = 'numeric' onChange={(event) => this.onChange('otp', event)}/> 
                {!this.props.login.userRegistered ? <TextInput label='Name' maxLength={60} style={[styles.inputStyle, {marginTop: 10 }]} placeholder="Your name" value={this.props.login.name} onChange={(event) => this.onChange('name', event)}/> : null}
              </View>
              : null

            }
             </View>
           <View style={{alignSelf: 'center', flex: 0.6,}}>
            <Button 
              disabled={!this.props.login.formValid} 
              color={!this.props.login.formValid ? Constants.lightOrangish : Constants.primaryColor} 
              styleContainer={!this.props.login.formValid ? styles.disabledBtn : styles.submitBtn} 
              onPress={this.verifyOtp}
              isLoading={this.props.login.verifyOtpCallStatus === 'Loading'}>
                <AppText bold medium white size="S" >{t('NEXT')}</AppText>
            </Button>
            </View>
            {this.props.login.verifyOtpCallStatus === 'Loading' ? <><AppText size='M' style={{color: Constants.primaryColor, marginTop: 13}}>Checking...</AppText></>: null}
            <View style={styles.resendOtpBox}>
              {this.props.login.otpCallStatus === 'Success' && this.props.login.phoneNumberValid ? <TouchableOpacity style={{flexDirection: "row"}} disabled={this.state.isDisabled} onPress={this.handleResendOTP.bind(this)}><AppText style={this.state.isDisabled ? styles.disabledResendOtpText : styles.resendOtpText }>{t('RESEND OTP')}</AppText>
              {this.state.isDisabled ? (<AppText size="M" style={{top: "18%", paddingRight: "20%", color: Constants.lightGreenishBlue}}>({this.state.timer}s)</AppText>) : null}
            </TouchableOpacity> : null}
            </View>
          </View>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
    header: {
      backgroundColor: Constants.primaryColor
    },
    container: {
      flex: 2,
      paddingTop: heightPercentageToDP(3),
      paddingHorizontal: widthPercentageToDP(3),
    },
    center: {
      width: "100%",
      alignItems: "center"
    },
    titleContainer: {
      justifyContent: 'center',
      flex: 0.2
    },
    title: {
     // fontWeight: "bold",
     // fontSize: 20
    },
    inputStyle: {
      borderBottomWidth: 2,
      borderBottomColor: Constants.primaryColor,
      color: '#000',
      paddingRight: 5,
      paddingLeft: 5,
      fontSize: 16,
      lineHeight: 23,
    },
    descriptionContainer: {
      width: "100%",
      marginTop: "60%",
      justifyContent: 'center',
      flex: 0.4,
      padding: "15%"
    },
    description: {
      //color: Constants.white,
      color: Constants.primaryColor,
      fontWeight: "bold",
      fontSize: 24,
      textAlign: 'center'
    },
    smallText: {
      //color: Constants.white,
      color: Constants.primaryColor,
      fontWeight: "bold",
      fontSize: 14,
      textAlign: 'center',
      marginTop: 10
    },
    submitBtn: {
      borderRadius: 4,
      borderWidth: 1.5,
      color: Constants.primaryColor,
      borderColor: Constants.primaryColor,
      marginTop: 35,
      backgroundColor: Constants.primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
      height: heightPercentageToDP(6),
      width: widthPercentageToDP(87)
    },
    disabledBtn: {
      borderRadius: 4,
      borderWidth: 1.5,
      color: Constants.lightOrangish,
      borderColor: Constants.lightOrangish,
      marginTop: 35,
      backgroundColor: Constants.lightOrangish,
      justifyContent: 'center',
      alignItems: 'center',
      height: heightPercentageToDP(6),
      width: widthPercentageToDP(87)
      
    },
    activityIndicator: {
      position: 'absolute',
      right: scaledSize(10),
      top: scaledSize(15)
    },
    resendOtpBox: {
      flex: 0.8,
      justifyContent: 'space-between', 
      flexDirection: 'row', 
      backgroundColor: Constants.white
    },
    resendOtpText : {
      color: Constants.primaryColor,
      fontSize: 16,
      padding: 10,
      marginTop: 30,
      fontWeight: "bold"
    },
    disappearResendOtpText : {
      color: Constants.white,
      fontSize: 16,
      padding: 10,
      marginTop: 30,
      fontWeight: "bold"
    },
    disabledResendOtpText : {
      color: Constants.lightOrangish,
      fontSize: 16,
      padding: 10,
      marginTop: 30,
      fontWeight: "bold"
    }
  });

const mapStateToProps = (state: LoginState) => ({
  login: state.login
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  onSendOtp: (phoneNumber: string) => {
      dispatch(sendOtp(phoneNumber));
  },
  onVerifyOtp: (inviteToken: string, otp: string, phoneNumber: string, callback: object) => {
    dispatch(verifyOtp(inviteToken, otp, phoneNumber, callback));
  },
  onRegisterUser: (inviteToken: string, otp: string, phoneNumber: string, name: string, callback: object) => {
    dispatch(registerUser(inviteToken, otp, phoneNumber,name, callback));
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  }
  // other callbacks go here...
});

const Login = withTranslation()(connect(
  mapStateToProps,
  mapDipatchToProps
)(LoginBase));

export default Login;