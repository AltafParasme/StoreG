import React, {Component} from 'react';
import {View, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {AppText} from '../../../components/Texts';
import {Header} from '../../../components/Header/Header';
import CommonInput from '../../../components/Input/Input';
import {heightPercentageToDP, widthPercentageToDP} from '../../../utils';
import {Constants} from '../../../styles';
import {withTranslation} from 'react-i18next';
import {AddUserBankDetails, verifyUserBankDetails, checkAccountVerificationStatus} from '../ShippingList/redux/actions';
import Button from '../../../components/Button/Button';
import {ScrollView} from 'react-native-gesture-handler';
import NavigationService from '../../../utils/NavigationService';
import {showToastr} from '../utils';
import {Images} from '../../../../assets/images';
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
        panNumber: props.isBankAccountPresent
        ? props.activeBankAccount.panNumber
        : '',
      },
      validation: {
        accountHolderName: false,
        ifscCode: false,
        accountNumber: false,
        bankName: false,
      },
      activePlaceHolderBorder: null,
      isCheckStatusBtn: true
    };
    this.onClickStatusButton = this.onClickStatusButton.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(this.props.bankDetailsSubmitted && !this.props.accountVerified && this.state.isCheckStatusBtn) {
      let count = 0;
      this.setState({
        isCheckStatusBtn: false
      })
      let intervalId = setInterval(() => {
        this.props.checkAccountVerificationStatus();
        if (++count === 6) {
          clearInterval(intervalId)
        }
      }, 5000);
    }
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
      panNumber
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
      let data = {
        accountType: 'BANK',
        panNumber: payloadForm.panNumber,
        accountDetails: payloadForm
      }
      this.props.addUserBankDetails(data);
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

  onClickVerifyButton = () => {
    this.props.verifyUserBankDetails()
  }

  onClickStatusButton = () => {
    this.props.checkAccountVerificationStatus();
  }

  onClickEditButton = () => {
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        bankDetailsSubmitted: false,
      },
    });
  }

  navigateBack = () => {
    NavigationService.goBack();
    return true;
  }

  render() {
    const {t, isBankAccountPresent, isBankLoading, bankDetailsSubmitted, accountVerified, activeBankAccount} = this.props;
    let buttonTitle = isBankAccountPresent ? 'UPDATE' : 'SUBMIT';
    let middleText = isBankAccountPresent
      ? 'Update Bank Account'
      : 'Add Your Bank Account';

    if(bankDetailsSubmitted && accountVerified) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems:'center' }}>
          <View style={styles.accountDetailsBox}>
            <AppText size="M" bold>{`Account Details`}</AppText>  
            <AppText>{`Account Number - ${activeBankAccount.accountDetails.BANK.accountNumber}`}</AppText>
            <AppText>{`Bank Name - ${activeBankAccount.accountDetails.BANK.bankName}`}</AppText>
            <AppText>{`IFSC - ${activeBankAccount.accountDetails.BANK.ifscCode}`}</AppText>
            <Button
              color={
                  Constants.lightGreenishBlue
              }
              styleContainer={styles.editbtnStyle}
              onPress={this.onClickEditButton}
              style={{fontWeight: 'bold'}}>
                <AppText white>{t(`Edit Account`)}</AppText>
            </Button>
          </View> 
          <Image source={Images.confirm} style={styles.icon}/>
          <AppText black>{t(`Your account is verified`)}</AppText>
          <Button
              color={
                  Constants.lightGreenishBlue
              }
              styleContainer={styles.verifybtnStyle}
              onPress={this.navigateBack}
              style={{fontWeight: 'bold'}}>
                <AppText white>{t(`Go Back`)}</AppText>
            </Button>
        </View>
      )
    }
    if(bankDetailsSubmitted && !accountVerified) {
      return (
        <View style={{flex: 1, backgroundColor: '#efefef'}}>
          <Header title={t(middleText)} />
          <View style={{ marginTop: heightPercentageToDP(10)}}>
           <View style={styles.accountDetailsBox}>
            <AppText size="L" bold>{`Account Details`}</AppText>  
            <AppText>{`Account Number - ${activeBankAccount.accountDetails.BANK.accountNumber}`}</AppText>
            <AppText>{`Bank Name - ${activeBankAccount.accountDetails.BANK.bankName}`}</AppText>
            <AppText>{`IFSC - ${activeBankAccount.accountDetails.BANK.ifscCode}`}</AppText>
            <Button
              color={
                  Constants.lightGreenishBlue
              }
              styleContainer={styles.editbtnStyle}
              onPress={this.onClickEditButton}
              style={{fontWeight: 'bold'}}>
                <AppText white>{t(`Edit Account`)}</AppText>
            </Button>
          </View> 
          <View style={{ justifyContent: 'center', alignItems: 'center'}}>
          {activeBankAccount.isVerified ? 
          <AppText bold black>{t(`If you have received ₹1 in your bank account #NL# Click verify to confirm your bank account`, { NL: '\n'})}</AppText> :
          activeBankAccount.paymentStatus == 'FAILED' ? <AppText black>{t(`Verification Failed, retry with correct bank details`, { NL: '\n'})}</AppText> : 
          activeBankAccount.paymentStatus== 'IN_PROGRESS' ? <View style={{ marginHorizontal: widthPercentageToDP(10)}}><AppText black style={{ textAlign: 'center'}}>{t(`We are still verifying your bank account, please come back after 12hrs`)}</AppText></View> :
          !this.state.isCheckStatusBtn ? <View style={{ flexDirection: 'row'}}>
              <AppText black>{t(`Verifying your bank account`, { NL: '\n'})}</AppText>
              <ActivityIndicator
                    color="black"
                    style={styles.indicator}
                    size="small"
                  />
            </View> : null
          }
          </View>
          <View style={{ flexDirection: 'row', flex: 1}}>
            <View style={{ flex: 1,alignItems: 'center' }}>
            {activeBankAccount.isVerified ? 
            <Button
              color={
                  Constants.lightGreenishBlue
              }
              styleContainer={styles.verifybtnStyle}
              onPress={this.onClickVerifyButton}
              style={{fontWeight: 'bold'}}>
                <AppText white>{t(`Verify`)}</AppText>
            </Button> : null}
            {!activeBankAccount.isVerified && this.state.isCheckStatusBtn ? 
            <Button
              color={
                  Constants.lightGreenishBlue
              }
              styleContainer={styles.verifybtnStyle}
              onPress={this.onClickStatusButton}
              style={{fontWeight: 'bold'}}>
                <AppText white>{t(`Check Status`)}</AppText>
            </Button> : null}
            {activeBankAccount.isVerified ?
            <View style={{ marginTop: heightPercentageToDP(10)}}>
              <AppText black>{t(`* It may take around 30 seconds to receive money`, { NL: '\n'})}</AppText>
              <AppText black>{t(`* Not received yet, please try again with correct bank details`, { NL: '\n'})}</AppText>
            </View>: null}
            </View>
          </View>
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
                {t('All Payments are 100% Safe and secure on Nyota')}
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
              <CommonInput
                name="panNumber"
                label={'PAN NUMBER'}
                isPlaceHolderError
                activePlaceHolderBorder={this.state.activePlaceHolderBorder}
                labelStyle={{color: Constants.primaryColor, fontSize: 12}}
                isRequired={false}
                value={this.state.form.panNumber}
                handleChange={this.handleChange}
                placeholder={'PAN Number'}
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
  accountDetailsBox: {
    justifyContent: 'flex-start', 
    alignItems: 'flex-start', 
    marginLeft: widthPercentageToDP(5), 
    marginBottom: heightPercentageToDP(5)
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
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
  verifybtnStyle: {
    backgroundColor: Constants.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    borderRadius: 5,
    width: widthPercentageToDP(35),
    marginTop: 10,
  },
  editbtnStyle: {
    backgroundColor: Constants.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderRadius: 5,
    width: widthPercentageToDP(25),
    marginTop: 10,
  },
  indicator: {
    height: 20,
    width: 20,
    marginLeft: widthPercentageToDP(5)
  }
});

const mapStateToProps = state => ({
  userBankDetails: state.ShippingList.userBankDetails,
  activeBankAccount: state.ShippingList.activeBankAccount,
  bankDetailsSubmitted: state.ShippingList.bankDetailsSubmitted,
  accountVerified: state.ShippingList.accountVerified,
  isBankAccountPresent: state.ShippingList.isBankAccountPresent,
  isBankLoading: state.ShippingList.isBankLoading,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  addUserBankDetails: data => {
    dispatch(AddUserBankDetails(data));
  },
  verifyUserBankDetails: data => {
    dispatch(verifyUserBankDetails(data));
  },
  checkAccountVerificationStatus: () => {
    dispatch(checkAccountVerificationStatus());
  }
});
export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CLAccount),
);
