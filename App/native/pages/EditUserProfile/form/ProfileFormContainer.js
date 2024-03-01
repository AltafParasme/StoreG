import React, {Component} from 'react';
import ProfileForm from './ProfileForm';
import {connect} from 'react-redux';
import {StyleSheet, BackHandler, View, TouchableOpacity} from 'react-native';
import idx from 'idx';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import Button from '../../../../components/Button/Button';
import {editProfile, currentUser} from '../../UserProfile/actions';
import RBSheet from 'react-native-raw-bottom-sheet';
import LangPopup from '../../../../components/PopUp/LangPopup';
import {LogFBEvent, Events, SetScreenName} from '../../../../Events';
import {AppText} from '../../../../components/Texts';
import NavigationService from '../.././../../utils/NavigationService';
import {GetUserBankDetails} from '../../ShippingList/redux/actions';
import {Constants} from '../../../../styles';

class ProfileFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: props.profile && props.profile.name ? props.profile.name : '',
        phoneNumber:
          props.profile && props.profile.phoneNumber
            ? props.profile.phoneNumber
            : '',
        email: props.profile && props.profile.email ? props.profile.email : '',
        age: props.profile && props.profile.age ? props.profile.age : '',
        gender:
          props.profile && props.profile.gender ? props.profile.gender : '',
      },
      validation: {
        name: false,
        email: false,
        phoneNumber: false,
        age: false,
        gender: false,
      },
      error: {},
      genderList: [
        {key: 'MALE', text: 'Male'},
        {key: 'FEMALE', text: 'Female'},
      ],
    };
    this.RBSheet = null;
  }

  componentDidMount() {
    if (!this.props.profile) this.props.getCurrentUser();
    this.props.getUserBankDetails();
    this.props.dispatch({type: 'booking/GET_ADDRESS'});
    SetScreenName(Events.LOAD_EDIT_PROFILE_SCREEN.eventName());
    // LogFBEvent(Events.LOAD_EDIT_PROFILE_SCREEN, {
    //   id: this.props.profile.id,
    //   name: this.props.profile.name,
    //   invitedBy: this.props.profile.invitedBy,
    //   status: this.props.profile.status,
    // });
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (this.props.profile !== nextProps.profile) {
      this.setState(prev => ({
        form: {
          ...prev.form,
          name:
            nextProps.profile && nextProps.profile.name
              ? nextProps.profile.name
              : '',
          phoneNumber:
            nextProps.profile && nextProps.profile.phoneNumber
              ? nextProps.profile.phoneNumber
              : '',
          email:
            nextProps.profile && nextProps.profile.email
              ? nextProps.profile.email
              : '',
          age:
            nextProps.profile && nextProps.profile.age
              ? nextProps.profile.age
              : '',
          gender:
            nextProps.profile && nextProps.profile.gender
              ? nextProps.profile.gender
              : '',
        },
      }));
    }
  };

  handleChange = (value, name) => {
    this.setState(prev => ({
      form: {
        ...prev.form,
        [name]: value,
      },
    }));
  };

  isFieldReady = () => {
    const {name, email, phoneNumber} = this.state.form;
    let valid = {};
    if (!name) {
      valid = {
        ...valid,
        name: true,
      };
    }
    // if (!email) {
    //   valid = {
    //     ...valid,
    //     email: true,
    //   };
    // }
    if (!phoneNumber) {
      valid = {
        ...valid,
        phoneNumber: true,
      };
    }
    this.setState({
      validation: valid,
    });
  };

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  isValid = inputName => {
    let error = {};
    if (inputName == 'email') {
      if (!this.validateEmail(this.state.form.email)) {
        error = {
          ...error,
          [inputName]: {
            message: 'Please Enter Valid email',
            isError: true,
          },
        };
      } else {
        delete error[inputName];
      }
    }

    if (
      inputName == 'age' &&
      (this.state.form.age < 18 || this.state.form.age > 99)
    ) {
      error = {
        ...error,
        [inputName]: {
          message: 'Please Enter Valid Age!',
          isError: true,
        },
      };
    } else {
      delete error[inputName];
    }

    this.setState({
      error: error,
    });
  };

  onChangeProfile = () => {
    const {onUpdateProfile, profile} = this.props;
    const {name, email, phoneNumber} = this.state.form;
    if (name && phoneNumber) {
      onUpdateProfile({...this.state.form, id: profile.id});
    } else {
      this.isFieldReady();
    }
  };

  // onChangeLanguage = () => {
  //   this.RBSheet && this.RBSheet.open();
  // };

  // handleCloseBottomSheet = () => {
  //   this.RBSheet && this.RBSheet.close();
  // };

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    NavigationService.goBack(null);
    return true;
  }

  navigateTo(screen) {
    NavigationService.navigate(screen);
  }

  render() {
    const {
      isGroupUnlocked,
      selectedLanguage,
      userPref,
      isBankAccountPresent,
      primaryAddress,
      activeBankAccount,
      isCLCreationApiCalled,
      t,
    } = this.props;
    const userMode = idx(userPref, _ => _.userMode);
    const isPrimaryAddressValid =
      primaryAddress && Object.keys(primaryAddress).length > 0 ? true : false;
    return (
      <View>
        {isCLCreationApiCalled ? (
          <View style={styles.center}>
            <AppText secondaryColor bold size="L" style={{textAlign: 'center'}}>
              {t(`Complete your profile to start`)}
            </AppText>
            <AppText secondaryColor bold size="L" style={{textAlign: 'center'}}>
              {t(`earning upto 5000/month`)}
            </AppText>
          </View>
        ) : null}
        <ProfileForm
          isLoading={this.props.loading}
          form={this.state.form}
          handleChange={this.handleChange}
          validation={this.state.validation}
          isValid={this.isValid}
          error={this.state.error}
          genderList={this.state.genderList}
        />
        {isPrimaryAddressValid ? (
          <View style={styles.addressContainer}>
            <AppText size="S" style={{color: '#989A9F'}}>
              {t(`Primary Address`)}
            </AppText>
            <View style={styles.addressBox}>
              <View style={{flex: 0.85}}>
                {!!primaryAddress && primaryAddress.addressName && (
                  <View style={styles.shippingBoxLabel}>
                    <AppText bold black size="S">
                      {primaryAddress.addressName}
                    </AppText>
                  </View>
                )}
                {!!primaryAddress && primaryAddress.addressLine1 && (
                  <View style={styles.shippingBoxLabel}>
                    <AppText black size="S">
                      {primaryAddress.addressLine1}
                    </AppText>
                  </View>
                )}
                {(!!primaryAddress && primaryAddress.addressLine2) ||
                (!!primaryAddress && primaryAddress.nearestLandmark) ? (
                  <View style={styles.shippingBoxLabel}>
                    <AppText black size="S">
                      {!!primaryAddress.addressLine2
                        ? primaryAddress.addressLine2
                        : ''}
                      {'\n'}
                      {primaryAddress.nearestLandmark}
                    </AppText>
                  </View>
                ) : (
                  <View />
                )}
                {primaryAddress && primaryAddress.district && (
                  <View style={styles.shippingBoxLabel}>
                    <AppText black size="S">
                      {primaryAddress.district}
                    </AppText>
                  </View>
                )}
                {primaryAddress && (
                  <View style={styles.shippingBoxLabel}>
                    <AppText black size="S">
                      {`${primaryAddress.state},${primaryAddress.pinCode}`}
                    </AppText>
                  </View>
                )}
              </View>
              <View style={{flex: 0.15}}>
                <TouchableOpacity
                  onPress={() => this.navigateTo('AddressForm')}>
                  <AppText size="M" greenishBlue bold>
                    {t(`Edit`)}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.addressContainer}>
            <AppText size="S" style={{color: '#989A9F'}}>
              {t(`Primary Address`)}
            </AppText>
            <View style={styles.addressBox}>
              <View style={{flex: 0.85}}>
                <AppText size="M">{t(`No address added`)}</AppText>
              </View>
              <View style={{flex: 0.15}}>
                <TouchableOpacity
                  onPress={() => this.navigateTo('AddressForm')}>
                  <AppText size="M" greenishBlue bold>
                    {t(`Add`)}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {userMode == 'CL' ? (
          <View style={styles.bankAccountBox}>
            <AppText size="S" style={{color: '#989A9F'}}>
              {t(`Bank Account Details`)}
            </AppText>
            <View style={styles.bankAccountContainer}>
              {isBankAccountPresent ? (
                <View style={styles.accountDetails}>
                  <AppText>{`${activeBankAccount.accountDetails.BANK.accountNumber}`}</AppText>
                  <AppText>{`${activeBankAccount.accountDetails.BANK.bankName}`}</AppText>
                  <AppText>
                    <AppText bold black>
                      IFSC
                    </AppText>
                    {` - ${activeBankAccount.accountDetails.BANK.ifscCode}`}
                  </AppText>
                  {activeBankAccount.isVerified ? (
                    <AppText bold greenishBlue>
                      {t(`Glowfit Verified`)}
                    </AppText>
                  ) : null}
                </View>
              ) : (
                <View style={styles.accountDetails}>
                  <AppText size="M">{t(`No bank account added`)}</AppText>
                </View>
              )}
              <View style={{flex: 0.15}}>
                <TouchableOpacity onPress={() => this.navigateTo('CLAccount')}>
                  <AppText size="M" greenishBlue bold>
                    {isBankAccountPresent ? t(`Edit`) : t('Add')}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View />
        )}
        <View style={styles.confirmButton}>
          <LinearGradientButton
            colors={
              isGroupUnlocked ? ['#00a9a6', '#006260'] : ['#ff8648', '#dc4d04']
            }
            title={t('SAVE')}
            onPress={this.onChangeProfile}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
  confirmButton: {
    height: 70,
    padding: 10,
    //Shadow Style
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  languageButton: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  languageText: {color: '#989A9F'},
  innerText: {padding: 5, borderWidth: 1},
  addressContainer: {
    paddingLeft: 20,
  },
  addressBox: {
    flexDirection: 'row',
    padding: 10,
  },
  bankAccountBox: {
    paddingLeft: 20,
  },
  bankAccountContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 0,
  },
  accountDetails: {
    flex: 0.85,
    paddingHorizontal: 10,
    padding: 5,
  },
});

const mapStateToProps = state => {
  return {
    loading: state.booking.pinLoading,
    profile: state.userProfile.user,
    selectedLanguage: state.home.language,
    userPref: state.login.userPreferences,
    isCLCreationApiCalled: state.clOnboarding.isCLCreationApiCalled,
    isBankAccountPresent: state.ShippingList.isBankAccountPresent,
    userBankDetails: state.ShippingList.userBankDetails,
    activeBankAccount: state.ShippingList.activeBankAccount,
    addressListApiCompleted: state.booking.addressListApiCompleted,
    primaryAddress: state.booking.primaryAddress,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentUser: () => {
    dispatch(currentUser());
  },
  onUpdateProfile: profile => {
    dispatch(editProfile(profile));
  },
  getUserBankDetails: () => {
    dispatch(GetUserBankDetails());
  },
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(ProfileFormContainer);
