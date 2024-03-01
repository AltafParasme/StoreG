/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { connect, Dispatch} from 'react-redux';
import Modal from "react-native-modal";
import Icons from 'react-native-vector-icons/MaterialIcons';
import Button from '../../../components/Button/Button';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import NavigationService from '../../../utils/NavigationService';
import { Constants } from '../../../styles';
import { withTranslation } from 'react-i18next';
import { AppText } from '../../../components/Texts';
import CommonInput from '../../../components/Input/Input';
import { userPreferences, changeField} from '../Login/actions';
import idx from 'idx';
import { showToastr } from '../utils';
import {CHECK_PIN} from '../Booking/redux/actions'
import { widthPercentageToDP, heightPercentageToDP } from '../../../utils';
import LocationComponent from '../../../components/LocationComponent/LocationComponent';

class addressPincodeBase extends Component {
  constructor(props) {super(props);
    const prefPinCode = idx(props.login, _ => _.userPreferences.prefPinCode);
    this.state = {
      isContinueDisabled: true,
      pincode: prefPinCode
      ? prefPinCode
      : '',
      isModalVisible: false,
    }
    this.onClickContinue = this.onClickContinue.bind(this);
  }


  componentDidMount () {
    if (
      this.props.login &&
      this.props.login.userPreferences &&
      this.props.login.userPreferences.prefPinCode
    ) {
      this.validatePincode(this.props.login.userPreferences.prefPinCode);
    }
    SetScreenName(Events.LOAD_PREFPINCODE_SCREEN.eventName());
    LogFBEvent(Events.LOAD_PREFPINCODE_SCREEN, null);
  }


  UNSAFE_componentWillReceiveProps = nextProps => {
    if (
      this.props.status !== nextProps.status ||
      this.props.message !== nextProps.message
    ) {
      this.isStatusChange(nextProps.status, nextProps.message);
    }
  };


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }


  validatePincode = (pincode) => {
    const {isPinValid, status} = this.props;
    let errors = {};
    isPinValid(pincode);
    this.isStatusChange(status);
  };

  isStatusChange = (status, msg) => {
    const {message} = this.props;
    let errors = {};
    if (status) {
      errors.pincode = {
        isError: false,
        message: 'Yay! We deliver to your location!',
      };
    } else {
      errors.pincode = {
        isError: true,
        message: message ? message : msg ? msg : undefined,
      };
    }
    this.setState({
      errors,
    });
  };

  handleBackButton() {
    return true;
  }

  handleChange = (pincode) => {
    if (pincode.length === 6) {
    if ((/^[1-9][0-9]{5}$/).test(pincode)) {
      this.validatePincode(pincode);
      this.setState({
        isContinueDisabled: !this.state.isContinueDisabled,
      });
    } else {
      showToastr('Please enter valid pin code')
    }} else {
      if (pincode.length === 1) {
        LogFBEvent(Events.PREFPINCODE_TYPED, null) 
      }
      this.setState({
        isContinueDisabled: true,
      });
    }
    this.setState({
      pincode: pincode
    });
  };

  onClickContinue() {
    const {fireToken, lang} = this.props.login.userPreferences;
    const canGoBack = this.props.navigation.getParam('canGoBack');

    this.props.onUserPreferences(true, fireToken, lang, this.state.pincode, canGoBack)
    if(canGoBack) {
      NavigationService.goBack(null); 
    }
    LogFBEvent(Events.PREFPINCODE_CLICK, {prefPincode: this.state.pincode})
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  render() {
    const {t,pincodeLoder} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.sectionStyleL}>
          {/* <LocationComponent page={"Address Pin Code"} shouldAskPermission={true}/> */}
          <View style={{flex: 0.1}}>
            <AppText style={styles.textM } >{t('We need your pincode to get you the best offers around you')}</AppText>
          </View>
          <View style={styles.addressInputStyle}>
              <CommonInput
                name="pincode"
                label={t('Pincode')}
                placeholder={t('Your pincode')}
                keyboardType="numeric"
                handleChange={this.handleChange}
                placeholderTextColor="#B9BBBF"
                errors={this.state.errors}
                autoFocus
                addressPincodeScreen={true}
                maxLength={6}
                value={this.state.pincode}
          />
          </View>
            <Button 
              isLoading={pincodeLoder}
              disabled={this.state.isContinueDisabled} 
              color={this.state.isContinueDisabled ? Constants.lightGreenishBlue : Constants.primaryColor} 
              styleContainer={this.state.isContinueDisabled? styles.buttonDisabledStyle : styles.buttonStyle} 
              onPress={this.onClickContinue} 
              style={{fontWeight: 'bold'}} label={t(`CONTINUE`)}></Button>
            <View style={styles.tnCContainer}>
              <AppText black size="M">{t('By proceeding, you agree to our')}</AppText>
              <TouchableOpacity onPress={this.toggleModal}><AppText style={{ textDecorationLine: 'underline', textAlign: 'center' }} black size="M">{t('terms and conditions')}</AppText></TouchableOpacity>
            </View>
        </View>


        <Modal isVisible={this.state.isModalVisible} style={styles.modalStyle} onBackButtonPress={this.toggleModal} onBackdropPress={this.toggleModal}>
          {/* <Icons name={'md-close'} size={28} color='#fff' style={{fontSize: 20,
                        left: "45%",
                        right: 0,
                        top: "24%",
                        bottom: 0}} onPress={this.toggleModal}/> */}
            <ScrollView style={{ paddingHorizontal: widthPercentageToDP(10) }}>
              <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
                <AppText size="XXL">{t('Terms and Conditions #NL#', { NL: '\n' })}</AppText>
              </View>
              <View style={{ flex: 0.7 }}>
                <AppText size="S">{t('Please read these app Terms of Use carefully before using this app. These app terms of use govern your access to usage of the app. The app is available for your use only on the condition that you agree to the Terms of Use set forth below. #NL#', { NL: '\n'})}</AppText>
                  <AppText size="M" bold>{t('1. User Eligibility: #NL#', { NL: '\n' })}</AppText>
                  <AppText size="S">{t('The app is provided by Reybhav Private Limited. and available only to entities and person over the age of majority and who can form legally binding agreement(s) under applicable law. If you do not qualify, you are not permitted to use the app. #NL#', { NL: '\n' })}</AppText>
                  <AppText size="M" bold>{t('2. Scope of Terms of Use: #NL#', { NL: '\n' })}</AppText>
                  <AppText size="S">{t('These Terms of Use govern your use of the app and all applications, software and services(collectively, services) available via the app, except the extent of such services are the subject of a seperate agreement. #NL# ', { NL: '\n' })}</AppText>
                  <AppText size="M" bold>{t('3. Privacy Policy: #NL#', { NL: '\n' })}</AppText>
                  <AppText size="S">{t('Reybhav Private Limited. governs the use of information collected from or provided by you at the app. Allow Nyota to contact you over phone or WhatsApp.')}</AppText> 
              </View>
            </ScrollView>
        </Modal>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'stretch',
    },
    buttonStyle: {
       backgroundColor: Constants.primaryColor,
       justifyContent: 'center',
       alignItems: 'center',
       height: 45,
       width: '100%',
       marginTop: 20,
    },
    addressInputStyle: {
      paddingBottom: 20, 
      flex: 0.6, 
      width: "76%", 
      right: "11%"
    },
    buttonDisabledStyle: {
      backgroundColor: Constants.lightGreenishBlue,
      justifyContent: 'center',
      alignItems: 'center',
      height: 45,
      width: '100%',
      marginTop: 20,
    },
    sectionStyleL: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 30,
    },
    textM: {
      fontSize:20,
      fontWeight:"bold",
      //paddingBottom: "5%",
      color: Constants.grey,
      fontFamily: "Roboto-Regular",
    },
    modalStyle : {
      flex: 0.6,
      maxHeight: heightPercentageToDP(50),
      top: "24%",
      backgroundColor: Constants.white,
      alignItems:'center',
      justifyContent: 'center',
      width: "90%"
    },
  });

  const mapStateToProps = (state: any) => ({
    login: state.login,
    status: state.booking.status,
    message: state.booking.message,
    pincodeLoder: state.home.pincodeLoder, 
  });

  const mapDispatchToProps = (dispatch: Dispatch) => ({
    dispatch,
    isPinValid: (pin: any) => {
      dispatch(CHECK_PIN({pin}));
    },
    onUserPreferences: (auth: boolean,  fireToken: string, lang: string, prefPincode: number, canGoBack: boolean) => {
      dispatch(userPreferences(auth,  fireToken, lang, prefPincode, canGoBack));
    },
    onChangeField: (fieldName: string, value: any) => {
      dispatch(changeField(fieldName, value));
    },
  });

  const addressPincode = withTranslation()(connect(
    mapStateToProps,
    mapDispatchToProps
  )(addressPincodeBase));

export default addressPincode;