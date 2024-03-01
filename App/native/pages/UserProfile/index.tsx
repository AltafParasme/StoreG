/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Linking,
  Image, 
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  View,
  BackHandler
} from 'react-native';
import {Header } from 'react-native-elements';
import Modal from "react-native-modal";
import DeviceInfo from 'react-native-device-info';
import Icons from 'react-native-vector-icons/FontAwesome';
import {Icon as ElementIcon} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import codePush from 'react-native-code-push';
import { connect, Dispatch } from 'react-redux';
import { Constants } from '../../../styles';
import { UserProfileState } from './types';
import { withTranslation } from 'react-i18next';
import { currentUser, changeField, logout } from './actions';
import {changeField as changeFieldLogin} from '../Login/actions';
import NavigationService from '../../../utils/NavigationService';
import { AppConstants, trustMarkerLogoMap } from '../../../Constants';
import { LogFBEvent, Events, SetScreenName } from '../../../Events';
import { AppText } from '../../../components/Texts';
import Accordian from '../../../components/Accordion/Accordion';
import {Images} from '../../../../assets/images';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../../utils';
import RBSheet from 'react-native-raw-bottom-sheet';
import LangPopup from '../../../components/PopUp/LangPopup';
import {startWhatsAppSupport} from '../utils';
import idx from 'idx';

class UserProfileBase extends Component {
  constructor(private router: Router) {super(); this.RBSheet = null;
    this.state = {
      version: null,
      label: null,
      description: null,
      isModalVisible: false
    }
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentWillMount = () => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  };

  handleBackButtonClick() {
    NavigationService.goBack();
    return true;
  }

  componentDidMount() {
    if(!this.props.isLoggedIn) {
      this.props.onChangeFieldLogin('loginInitiatedFrom', 'UserProfile');
      NavigationService.navigate('Login');
    }  
    else {  
    if (!this.props.userProfile.user)
      this.props.getCurrentUser();
      const av = DeviceInfo.getVersion();
      codePush.getUpdateMetadata().then((metadata) =>{
        this.setState({label: metadata.label, version: av, description: metadata.description});
      });
      SetScreenName(Events.LOAD_USER_SETTING_SCREEN.eventName());
      LogFBEvent(Events.LOAD_USER_SETTING_SCREEN, null);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('user profile props are ', this.props);
    if(this.props.isLoggedIn != prevProps.isLoggedIn && this.props.isLoggedIn) {
      if (!this.props.userProfile.user)
        this.props.getCurrentUser();
    }
  }

  callUs = () => {
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    const callNumber = userMode == 'CL' ? AppConstants.supportCLCallNumber : AppConstants.supportCallNumber;
    Linking.openURL(`tel:${callNumber}`)
  }

  navigateTo(screeName) {
    NavigationService.navigate(screeName);
  }

  onChangeLanguage = () => {
    this.RBSheet && this.RBSheet.open();
  };

  openQrCode = () => {
    NavigationService.navigate('ViewQrCode');
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  handleCloseBottomSheet = () => {
    this.RBSheet && this.RBSheet.close();
  };

  onPressLogin = () => {
    LogFBEvent(Events.LOGIN_TO_CONTINUE, {
        screen: 'UserProfile',
    });
    NavigationService.navigate('Login');
}

  render() { 
    const {t,login, isLoggedIn} = this.props;
    const av = DeviceInfo.getVersion();
    const userMode = idx(login, _ => _.userPreferences.userMode);
    if(!isLoggedIn) {
      return (
        <TouchableOpacity
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          onPress={this.onPressLogin}>
          <AppText size="XXL" bold black>
            {t('Kindly login to continue')}
          </AppText>
          <AppText style={styles.buttonLogin} size="L" bold greenishBlue>
            {t(' Press here ')}
          </AppText>
      </TouchableOpacity>
      )
    }

    if(!this.props.userProfile.initialApiCallCompleted) return null;
    const { user } = this.props.userProfile;
    return (
      <View style={{flex: 1}}>
          <Header containerStyle={styles.header}
          rightComponent={<TouchableOpacity onPress={() => this.navigateTo('Home')}><Image style={styles.imageContent}  source={Images.logo} /></TouchableOpacity>}
          />
            {/* <StatusBar backgroundColor="#00a9a6" barStyle="light-content" /> */}
          <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: heightPercentageToDP(3)}} style={styles.contentBox}>
            <View style={styles.card}>
              <View style={styles.profileBox}>
                    <AppText>
                      <Icons
                        name={'user-circle'}
                        size={46}
                        color="#fff"
                        style={{marginLeft: '3%', top: '3%'}}
                      />
                    </AppText>
                      {user ? <AppText style={styles.nameText}>{user.name || '--'}</AppText> : <AppText>--</AppText>}
                      {user ? <AppText style={styles.mobileNumber}>{user.phoneNumber || '--'}</AppText> : <AppText>--</AppText>}
                      <TouchableOpacity onPress={()=>NavigationService.navigate('EditUserProfile')} style={styles.editBtn}><AppText white style={{textAlign: 'center'}}>{t('Edit Profile')}</AppText></TouchableOpacity>
                
              </View>
            </View>
            <View>
              <View style={styles.sectionStyle}>
              <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }} onPress={() => {
                  NavigationService.navigate('MyOrderBusinessCheckout');
                }
              }>
                <View style={{ flex: 0.8 }}>
                  <AppText style={styles.listTitle}>{t('My Orders')}</AppText>
                </View>
              <View style={styles.arrowViewStyle}>
                  <ElementIcon
                    type="feather"
                    name="chevron-right"
                    color={Constants.black}
                    size={widthPercentageToDP(7)}
                    containerStyle={{
                      alignSelf: 'center',
                      bottom: '2%',
                    }}
                  /> 
              </View>
              </TouchableOpacity>
              </View>
              <View style={styles.sectionStyle}>
              <TouchableOpacity
                style={{ flexDirection: 'row', flex: 1 }}
              onPress={() => {
                NavigationService.navigate('MyRewards');
                }}>
                <View style={{ flex: 0.8 }}>
                  <AppText style={styles.listTitle}>{t('My Rewards')}</AppText>
                </View>
                <View style={styles.arrowViewStyle}>
                  <ElementIcon
                    type="feather"
                    name="chevron-right"
                    color={Constants.black}
                    size={widthPercentageToDP(7)}
                    containerStyle={{
                      alignSelf: 'center',
                      bottom: '2%',
                    }}
                  /> 
                </View>
              </TouchableOpacity>
              </View>
              <View style={styles.sectionStyle}>
              <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }} onPress={() => {
                  LogFBEvent(Events.PREFPINCODE_UPDATE_USER, null);
                  
                  this.props.dispatch({type: 'home/SET_STATE', payload: {editPincodeClicked: true}});
                  
                  NavigationService.navigate('AddressPincode');
                  }}>
                  <View style={{ flex: 0.8 }}>
                    <AppText style={styles.listTitle}>{t('Change My Pincode')}</AppText>
                  </View>
              <View style={styles.arrowViewStyle}>
                  <ElementIcon
                    type="feather"
                    name="chevron-right"
                    color={Constants.black}
                    size={widthPercentageToDP(7)}
                    containerStyle={{
                      alignSelf: 'center',
                      bottom: '2%',
                    }}
                  /> 
              </View>
              </TouchableOpacity>
              </View>
              <View style={styles.sectionStyle}>
              <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }} onPress={this.onChangeLanguage}>
                <View style={{ flex: 0.8 }}>
                  <AppText style={styles.listTitle}>{t('Change Language')}</AppText>
                </View>  
              <View style={styles.arrowViewStyle}>
                  <ElementIcon
                    type="feather"
                    name="chevron-right"
                    color={Constants.black}
                    size={widthPercentageToDP(7)}
                    containerStyle={{
                      alignSelf: 'center',
                      bottom: '2%',
                    }}
                  /> 
              </View>
              </TouchableOpacity>
              </View>

              {
                (userMode == 'CL')
                ?
                <View style={styles.sectionStyle}>
                  <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }} onPress={this.openQrCode}>
                  <View style={{ flex: 0.8 }}>
                      <AppText style={styles.listTitle}>{t('View my QR code')}</AppText>
                  </View>
                  <View style={styles.arrowViewStyle}>
                  <ElementIcon
                    type="feather"
                    name="chevron-right"
                    color={Constants.black}
                    size={widthPercentageToDP(7)}
                    containerStyle={{
                      alignSelf: 'center',
                      bottom: '2%',
                    }}
                  /> 
                </View>
                </TouchableOpacity>
                </View>
                :
                <View style={styles.sectionStyle}>
                  <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }} onPress={() => this.navigateTo('QRContainer')}>
                  <View style={{ flex: 0.8 }}>
                      <AppText style={styles.listTitle}>{t('Scan QR & add to Mart')}</AppText>
                  </View>
                  <View style={styles.arrowViewStyle}>
                  <ElementIcon
                    type="feather"
                    name="chevron-right"
                    color={Constants.black}
                    size={widthPercentageToDP(7)}
                    containerStyle={{
                      alignSelf: 'center',
                      bottom: '2%',
                    }}
                  /> 
                </View>
                </TouchableOpacity>
                </View>
              }


              <View style={{marginTop: heightPercentageToDP(2)}}>  
                <View style={{ flexDirection: 'column', height: heightPercentageToDP(7) }}> 
                    <AppText size="M" black style={styles.helpText}>{t(`Need help? Reach out to us on `)}</AppText>          
                  <View style={{ flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => startWhatsAppSupport(userMode, 'UserProfile')} style={[styles.supportBtn, {backgroundColor: Constants.greenishBlue , paddingLeft: widthPercentageToDP(2)}]}><AppText white bold size="M" style={{textAlign: 'center'}}><Image source={Images.whatsapp} style={styles.whatsappImage}/>{t(' WhatsApp')}</AppText></TouchableOpacity>
                    <TouchableOpacity onPress={this.callUs} style={[styles.supportBtn, { backgroundColor: Constants.white }]}><AppText greenishBlue bold size="M"  style={{textAlign: 'center'}}>{t('Call us')}</AppText></TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.tnCContainer}>
                <TouchableOpacity onPress={this.toggleModal}><AppText style={{ textDecorationLine: 'underline', textAlign: 'center' }} black size="M">{t('Terms and conditions')}</AppText></TouchableOpacity>
              </View>
          </View>
              <TouchableOpacity onPress={this.props.onLogout}>
                <AppText style={[styles.listTitle, { textAlign: 'center', marginVertical: heightPercentageToDP(5)} ]}>
                  {t('Logout')}
                  <Icon
              name={'logout'}
              size={20}
              color="#000"
              //style={{marginLeft: '3%', top: '3%'}}
            />
                </AppText>
              </TouchableOpacity>
              <View style={styles.versionBox}>
                {av ? <AppText size="M" black>Version: {av} {this.state.label}</AppText> : null}
              </View>
          </ScrollView>
          <RBSheet
          key={'Language'}
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={250}
          duration={250}
          closeOnDragDown={true}
          customStyles={{
            container: {
              alignItems: 'center',
              borderRadius: 10,
            },
          }}>
          <LangPopup closeAction={this.handleCloseBottomSheet} />
        </RBSheet>
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
                  <AppText size="S">{t('Reybhav Private Limited. governs the use of information collected from or provided by you at the app. Allow Glowfit to contact you over phone or WhatsApp.')}</AppText> 
              </View>
            </ScrollView>
        </Modal>
      </View>
    );
  };
}

const styles = StyleSheet.create({
    contentBox: {
      flex: 1,
      maxHeight: heightPercentageToDP(81),
    },
    sectionStyle: {
      borderWidth: 1, 
      borderColor: '#e3e3e3',
      flex: 0.18,
      flexDirection: 'row',
      marginVertical: heightPercentageToDP(0.16),
      paddingLeft: widthPercentageToDP(5),
    },
    header: {
      backgroundColor: Constants.white,
      height: heightPercentageToDP(8),
      paddingBottom: heightPercentageToDP(3),
    },
    arrowViewStyle: {
      flex: 0.2,
      justifyContent: 'flex-end',
    },
    card: {
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    imageContent: {
      width: widthPercentageToDP(30),
      height: heightPercentageToDP(30),
      resizeMode: 'contain',
    },
    profileBox: { 
      width: "100%",
      alignItems: "center",
      backgroundColor: Constants.greenishBlue,
      paddingTop: heightPercentageToDP(2),
      paddingBottom: heightPercentageToDP(2),
    },
    nameText: {
      marginTop: heightPercentageToDP(1),
      fontSize: 24,
      color: Constants.white,
      textAlign: 'center',
    },
    mobileNumber: {
      marginTop: heightPercentageToDP(1),
      fontSize: 24,
      color: Constants.white
    },
    center: {
      width: "100%",
      alignItems: "center"
    },
    editBtn: {
      paddingHorizontal: widthPercentageToDP(1),
      marginTop: heightPercentageToDP(2),
      height: heightPercentageToDP(3.5),
      color: Constants.white,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Constants.white 
    },
    titleContainer: {
      justifyContent: 'center',
      flex: 0.2
    },
    listTitle: {
      fontWeight: "bold",
      fontSize: 20,
      paddingTop: heightPercentageToDP(2),
    },
    helpText: {
      fontWeight: "bold",
      fontSize: 20,
      textAlign: 'center',
    },
    footerIcon: {
      color: Constants.black
    },
    wpIcon: {
      color: Constants.greenishBlue,
      marginLeft: widthPercentageToDP(2)
    },
    supportBtn: {
      height: 40,
      padding: 10,
      marginHorizontal: widthPercentageToDP(4),
      flex: 0.5,
      color: Constants.greenishBlue,
      textAlign: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Constants.greenishBlue
    },
    whatsappImage: {
      height: 20,
      width: 20,
      resizeMode: 'contain',
    },
    versionBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    },
    tnCContainer: {
      marginTop: heightPercentageToDP(2),
      justifyContent: 'center',
      alignItems: 'center',
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
    buttonLogin: {
      height: heightPercentageToDP(5),
      lineHeight: heightPercentageToDP(5),
      textAlign: 'center',
      alignSelf: 'center',
      borderRadius: scaledSize(6),
      borderWidth: scaledSize(1),
      borderColor: Constants.greenishBlue,
    }
});

const mapStateToProps = (state: UserProfileState) => ({
  userProfile: state.userProfile,
  login: state.login,
  isLoggedIn: state.login.isLoggedIn,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
  onChangeFieldLogin: (fieldName: string, value: any) => {
    dispatch(changeFieldLogin(fieldName, value));
  },
  getCurrentUser: () => {
    dispatch(currentUser());
  },
  onLogout: () => {
    dispatch(logout());
  }
  // other callbacks go here...
});

const UserProfile = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfileBase);

export default withTranslation()(UserProfile);
