import React, {Component} from 'react';
import {View, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {AppText} from '../../../../components/Texts';
import {Header} from '../../../../components/Header/Header';
import CommonInput from '../../../../components/Input/Input';
import {heightPercentageToDP, widthPercentageToDP} from '../../../../utils';
import {Constants} from '../../../../styles';
import {withTranslation} from 'react-i18next';
import {AddUserBankDetails} from '../redux/actions';
import Button from '../../../../components/Button/Button';
import {ScrollView} from 'react-native-gesture-handler';
import NavigationService from '../../../../utils/NavigationService';
import {showToastr} from '../../utils';
import {Images} from '../../../../../assets/images';
import {connect} from 'react-redux';

class CLAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isButtonDisabled: false,
      errors: {},
      isErr: false,
      isLoading: false,
      form: {
        accountHolderName: props.isBankAccountPresent
          ? props.activeBankAccount.accountDetails.BANK.accountHolderName
          : '',
        ifscCode: props.isBankAccountPresent ? props.activeBankAccount.accountDetails.BANK.ifscCode : '',
        accountNumber: props.isBankAccountPresent
          ? props.activeBankAccount.accountDetails.BANK.accountNumber
          : '',
        bankName: props.isBankAccountPresent
          ? props.activeBankAccount.accountDetails.BANK.bankName
          : '',
      },
      validation: {
        accountHolderName: false,
        ifscCode: false,
        accountNumber: false,
        bankName: false,
      },
      activePlaceHolderBorder: null,
    };
  }

  handleChange = (value, name) => {
    if (this.state.isButtonDisabled) {
      this.setState({
        isButtonDisabled: !this.state.isButtonDisabled,
      });
    }
    this.setState({
      errors: {},
    });
    this.setState(prev => ({
      form: {
        ...prev.form,
        [name]: value,
      },
      validation: {
        ...prev.validation,
        [name]: !value,
      },
      activePlaceHolderBorder: value,
    }));
  };

  isFieldReady = () => {
    const {
      accountHolderName,
      ifscCode,
      bankName,
      accountNumber,
    } = this.state.form;
    let valid = {};
    let errors = {};
    if (!accountHolderName) {
      valid = {
        ...valid,
        accountHolderName: true,
      };
    }
    if (!ifscCode) {
      valid = {
        ...valid,
        ifscCode: true,
      };
    } else if (ifscCode.length !== 11) {
      errors.ifscCode = {
        ...errors,
        isError: true,
        message: 'Please enter 11 digit IFSC code',
      };
    }
    if (!accountNumber) {
      valid = {
        ...valid,
        accountNumber: true,
      };
    }
    if (!bankName) {
      valid = {
        ...valid,
        bankName: true,
      };
    }
    this.setState({
      validation: valid,
      errors,
    });
  };

  onClickButton = () => {
    const {
      accountHolderName,
      ifscCode,
      accountNumber,
      bankName,
    } = this.state.form;
    let payloadForm = this.state.form;
    this.setState({
      activePlaceHolderBorder: null,
    });
    if (
      !(accountHolderName && ifscCode && accountNumber && bankName) ||
      ifscCode.length !== 11
    ) {
      this.setState({
        isButtonDisabled: !this.state.isButtonDisabled,
      });
      this.isFieldReady();
    } else {
      this.setState({
        isLoading: true,
      });
      if (this.props.isBankAccountPresent) {
        payloadForm.id = this.props.activeBankAccount.id;
      }
      this.props.addUserBankDetails(payloadForm);
      this.setState({
        isButtonDisabled: !this.state.isButtonDisabled,
      });
      if (this.props.bankDetailsSubmitted) {
        this.props.dispatch({
          type: 'shippingList/SET_STATE',
          payload: {
            bankDetailsSubmitted: false,
          },
        });
      }
    }
  };

  render() {
    const {t, isBankAccountPresent, isBankLoading, bankDetailsSubmitted, activeBankAccount} = this.props;
    let buttonTitle = isBankAccountPresent ? 'UPDATE' : 'SUBMIT';
    let middleText = isBankAccountPresent
      ? 'Update Bank Account'
      : 'Add Your Bank Account';

    if(!bankDetailsSubmitted) {
      return (
        <View style={{flex: 1, backgroundColor: '#efefef'}}>
          <Header title={t(middleText)} />
          <View style={{ justifyContent: 'center', alignItems:'center'}}>
            <AppText size="L" black>{t(`We have transferred ₹1 in your bank account`)}</AppText>

            <View style={styles.accountDetails}>
                <AppText>{`${activeBankAccount.accountDetails.BANK.accountNumber}`}</AppText>
                <AppText>{`${activeBankAccount.accountDetails.BANK.bankName}`}</AppText>
                <AppText><AppText bold black>IFSC</AppText>{` - ${activeBankAccount.accountDetails.BANK.ifscCode}`}</AppText>
            </View>
            <Button>
              Confirm
            </Button>
          </View>
        </View>
      )
    }  
    else {
      return (
        <View style={{flex: 1, backgroundColor: '#efefef'}}>
          <Header title={t(middleText)} />
          <ScrollView style={{maxHeight: heightPercentageToDP(82)}}>
            <View
              style={{
                backgroundColor: Constants.white,
                paddingVertical: heightPercentageToDP(2.5),
              }}>
              <Image source={Images.accountSafety} style={styles.accountSafety} />
              <View style={styles.topView}>
                <AppText greenishBlue>
                  {t('All Payments are 100% Safe and secure on Glowfit')}
                </AppText>
              </View>
              <View
                style={{
                  marginTop: heightPercentageToDP(2.6),
                  alignItems: 'center',
                }}>
                <AppText size="M">{middleText}</AppText>
                <View style={styles.infoView}>
                  <AppText style={{textAlign: 'center', lineHeight: 18}}>
                    {t(
                      'Payments & Bonus you receive will be transferred to your bank account.',
                    )}
                  </AppText>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: heightPercentageToDP(1.4),
                backgroundColor: Constants.white,
              }}>
              <View style={{margin: heightPercentageToDP(3)}}>
                <CommonInput
                  name="accountHolderName"
                  label={'ACCOUNT HOLDER NAME'}
                  isPlaceHolderError
                  autoFocus
                  activePlaceHolderBorder={this.state.activePlaceHolderBorder}
                  labelStyle={{color: Constants.primaryColor, fontSize: 12}}
                  isRequired={this.state.validation.accountHolderName}
                  value={this.state.form.accountHolderName}
                  handleChange={this.handleChange}
                  placeholder={'Account Holder Name'}
                />
                <CommonInput
                  name="ifscCode"
                  label={'IFSC CODE'}
                  activePlaceHolderBorder={this.state.activePlaceHolderBorder}
                  labelStyle={{color: Constants.primaryColor, fontSize: 12}}
                  isRequired={this.state.validation.ifscCode}
                  value={this.state.form.ifscCode}
                  keyboardType="alphanumeric"
                  maxLength={11}
                  isPlaceHolderError
                  errors={this.state.errors}
                  handleChange={this.handleChange}
                  placeholder={'IFSC Code'}
                />
                <CommonInput
                  name="accountNumber"
                  label={'ACCOUNT NUMBER'}
                  activePlaceHolderBorder={this.state.activePlaceHolderBorder}
                  labelStyle={{color: Constants.primaryColor, fontSize: 12}}
                  isRequired={this.state.validation.accountNumber}
                  value={this.state.form.accountNumber}
                  keyboardType="numeric"
                  isPlaceHolderError
                  selectionColor={{color: Constants.primaryColor}}
                  handleChange={this.handleChange}
                  placeholder={'Account Number'}
                />
                <CommonInput
                  name="bankName"
                  label={'BANK NAME'}
                  activePlaceHolderBorder={this.state.activePlaceHolderBorder}
                  labelStyle={{color: Constants.primaryColor, fontSize: 12}}
                  value={this.state.form.bankName}
                  isRequired={this.state.validation.bankName}
                  handleChange={this.handleChange}
                  isPlaceHolderError
                  placeholder={'Bank Name'}
                />
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              paddingHorizontal: heightPercentageToDP(2),
              alignItems: 'center',
              paddingBottom: heightPercentageToDP(1),
            }}>
            <Button
              disabled={this.state.isButtonDisabled}
              color={
                this.state.isButtonDisabled && !isBankLoading
                  ? Constants.lightGreenishBlue
                  : Constants.primaryColor
              }
              styleContainer={
                this.state.isButtonDisabled && !isBankLoading
                  ? styles.buttonDisabledStyle
                  : styles.buttonStyle
              }
              onPress={this.onClickButton}
              style={{fontWeight: 'bold'}}>
              {isBankLoading ? (
                <ActivityIndicator
                  color="white"
                  style={styles.activityIndicator}
                  size="small"
                />
              ) : (
                <AppText white>{t(buttonTitle)}</AppText>
              )}
            </Button>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Constants.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 5,
    width: '100%',
    marginTop: 6,
  },
  infoView: {
    alignSelf: 'center',
    width: widthPercentageToDP(85),
    marginTop: heightPercentageToDP(1),
  },
  topView: {
    alignItems: 'center',
    borderRadius: 6,
    borderColor: Constants.primaryColor,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginTop: heightPercentageToDP(2),
    marginHorizontal: widthPercentageToDP(3),
    padding: widthPercentageToDP(2),
  },
  buttonDisabledStyle: {
    backgroundColor: Constants.lightGreenishBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 45,
    width: '100%',
    marginTop: 6,
  },
  accountSafety: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: heightPercentageToDP(2.7),
  },
  activityIndicator: {
    height: 20,
    width: 20,
  },
  accountDetails: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => ({
  userBankDetails: state.ShippingList.userBankDetails,
  activeBankAccount: state.ShippingList.activeBankAccount,
  bankDetailsSubmitted: state.ShippingList.bankDetailsSubmitted,
  isBankAccountPresent: state.ShippingList.isBankAccountPresent,
  isBankLoading: state.ShippingList.isBankLoading,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  addUserBankDetails: data => {
    dispatch(AddUserBankDetails(data));
  },
});
export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CLAccount),
);
