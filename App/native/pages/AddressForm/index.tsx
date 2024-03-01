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
  StyleSheet,
  Image,
  PermissionsAndroid
} from 'react-native';
import { PrimaryButton } from '../../../components/Buttons';
import NavigationService from '../../../utils/NavigationService';
import {connect} from 'react-redux';
import idx from 'idx';
import { Constants } from '../../../styles';
import AsyncStorage from '@react-native-community/async-storage';
import { withTranslation } from 'react-i18next';
import { Button } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import {Header} from '../../../components/Header/Header';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../../utils';
import {changeField, checkPinCode, addAddress} from '../EditUserProfile/redux/actions';
import {LogFBEvent, Events, SetScreenName, } from '../../../Events';
import { AppText } from '../../../components/Texts';
import CommonInput from '../../../components/Input/Input';

class AddressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
          form: {
            pincode: props.primaryAddress && props.primaryAddress.pinCode ? props.primaryAddress.pinCode : '',
            state: props.primaryAddress && props.primaryAddress.state ? props.primaryAddress.state : '',
            streetAddress:
              props.primaryAddress && props.primaryAddress.addressName
                ? props.primaryAddress.addressName
                : '',
            addressLine1:
              props.primaryAddress && props.primaryAddress.addressLine1
                ? props.primaryAddress.addressLine1
                : '',
            city: props.primaryAddress && props.primaryAddress.city ? props.primaryAddress.city : '',
            selectedLocality: ''
          },
          validation: {
            pincode: false,
            streetAddress: false,
            addressLine1: false,
          },
          localityError: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.onAddAddress = this.onAddAddress.bind(this);
      }

  componentDidMount() {
    const pinCode = idx(this.props.primaryAddress, _ => _.pinCode);  
    if(pinCode)
    this.validatePincode(pinCode);
    SetScreenName(Events.LOAD_ADD_CONTACT_SCREEN.eventName());
    LogFBEvent(Events.LOAD_ADD_CONTACT_SCREEN, null); 
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.pincodedata && this.props.pincodedata.status && this.props.pincodedata.pincodechecked) {
        this.setState(prev => ({
          form: {
            ...prev.form,
            state: this.props.pincodedata.data.stateName || '',
            city: this.props.pincodedata.data.city || '',
          },
        }));
        this.props.onChangeField(
            'pincodedata', {
                ...this.props.pincodedata,   
                ...{ pincodechecked: false } ,
            }
          );
        this.isStatusChange(this.props.pincodedata.status, this.props.pincodedata.message);  
    }
    if (
      (prevProps.pincodedata && prevProps.pincodedata.status) !== (this.props.pincodedata && this.props.pincodedata.status)
      ) {
        this.isStatusChange(this.props.pincodedata.status, this.props.pincodedata.message);
      }
  }

  validatePincode = pincode => {
    const {isPinValid} = this.props;
    isPinValid(pincode);
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

  handleChange = (value, name) => {
    const {selectedLocality} = this.state.form;
    const {pincodedata} = this.props;
    const localityData = idx(pincodedata, _ => _.localityData);

    if (name === 'pincode' && value.length > 5) {
        this.props.isPinValid(value);
    }
    if (
        localityData &&
        localityData.length &&
        (name == 'selectedLocality') && 
        value
      ) {
        this.setState({localityError: false});
      }
    this.setState(prev => ({
      form: {
        ...prev.form,
        [name]: value,
      },
      validation: {
        ...prev.validation,
        [name]: !value,
      },
    }));
  };

  isFieldReady = () => {
    const {pincode, streetAddress, addressLine1, selectedLocality} = this.state.form;
    const {pincodedata} = this.props;
    const localityData = idx(pincodedata, _ => _.localityData);

    let valid = {};
    if (!pincode) {
      valid = {
        ...valid,
        pincode: true,
      };
    }
    if (!streetAddress) {
      valid = {
        ...valid,
        streetAddress: true,
      };
    }
    if (!addressLine1) {
      valid = {
        ...valid,
        addressLine1: true,
      };
    }
    if (
      localityData &&
      localityData.length &&
      localityData.length != 0 &&
      (!selectedLocality)
    ) {
      this.setState({localityError: true});
    }
    this.setState({
      validation: valid,
    });
  };

  onAddAddress = () => {
    const {pincode, streetAddress, addressLine1, selectedLocality} = this.state.form;
    const status = idx(this.props.pincodedata, _ => _.status);
    const localityData = idx(this.props.pincodedata, _ => _.localityData);
    if (!status) {
        this.validatePincode(pincode)
    }
    
    const shouldCheckLocality =
      localityData && localityData.length && localityData.length != 0;
    if (
      (shouldCheckLocality
        ? selectedLocality
          ? true
          : false
        : true) &&
      pincode &&
      addressLine1 &&
      status
    ) {
      this.state.form.pinCode = pincode;
      this.state.form.addressName =
        selectedLocality
          ? selectedLocality
          : streetAddress;
      this.props.onAddAddress(this.state.form);
    } else {
      this.isFieldReady();
    }
  };

  render() {
    const {t, pincodedata} = this.props;
    const {pincode, streetAddress, addressLine1, city, state, selectedLocality} = this.state.form;
    const {errors, validation, localityError} = this.state;
    const localityData = idx(pincodedata, _ => _.localityData);

    return (
        <View style={styles.container}>
         <Header 
          title={t('Address Form')} 
          />
      <View style={styles.form}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.8}}>
            <CommonInput
              name="pincode"
              label={t('Pin Code')}
              value={pincode}
              handleChange={this.handleChange}
              placeholder={t('Your pincode')}
              errors={errors}
              isRequired={validation.pincode}
              maxLength={6}
              keyboardType="numeric"
            />
          </View>
        </View>
        <CommonInput
          name="addressLine1"
          label={t('House/flat/block number')}
          value={addressLine1}
          handleChange={this.handleChange}
          placeholder={t('Eg. 502, Sector A, Pocket B')}
          errors={errors}
          isRequired={validation.addressLine1}
        />
        {localityData && localityData.length && localityData.length > 0 ? (
          <View style={{ }}>
            <Dropdown
              label={t('Nearest Locality')}
              labelStyle={{color: Constants.lightFadedGrey, fontSize: 18}}
              valueStyle={[styles.valueStyle]}
              containerStyle={{marginTop: -7}}
              data={localityData}
              value={selectedLocality}
              onChangeText={(value, index, data) => {
                this.handleChange(value, 'selectedLocality')
              }}
              />
             {localityError ? (
               <AppText style={styles.errorText}>
                 {t('Please select locality')}
               </AppText>
             ) : null}
           </View> 
        ) : (
          <CommonInput
            name="streetAddress"
            label={t('Locality & Landmark')}
            value={streetAddress}
            handleChange={this.handleChange}
            placeholder={t('Eg. Koramangala , Near Forum Mall')}
            errors={errors}
            isRequired={validation.streetAddress}
          />
        )}

        <CommonInput
          name="state"
          label={t('State')}
          value={state}
          handleChange={this.handleChange}
          placeholder={t('Your state')}
          errors={errors}
          isRequired={validation.state}
          disabled={true}
        />
        <CommonInput
          name="city"
          label={t('City')}
          value={city}
          handleChange={this.handleChange}
          placeholder={t('Your city')}
          errors={errors}
          isRequired={validation.city}
          disabled={true}
        />
        <View style={styles.submitBtn}>
            <Button
            title={t('SAVE')}
            buttonStyle={{ backgroundColor: Constants.primaryColor }}
            onPress={this.onAddAddress}
            />
          </View>
      </View>
    </View>
      
    );
  };
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
      },
      form: {
        paddingHorizontal: 20,
        paddingVertical: 10,
      },
      inputStyle: {
        marginTop: 5,
        height: 58,
      },
      deliveryTitle: {
        fontSize: 18,
        color: '#292f3a',
        fontWeight: '600',
      },
      titleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      changeText: {
        fontSize: scaledSize(14),
      },
      editBtn: {
        width: widthPercentageToDP(18),
        marginTop: 25,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Constants.primaryColor,
        borderWidth: scaledSize(1),
        borderRadius: scaledSize(8),
      },
      listWrapper: {
        flexDirection: 'column',
        marginVertical: scaledSize(5),
        backgroundColor: 'white',
      },
      pickerStyle: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: heightPercentageToDP(6),
        flexDirection: 'row',
      },
      valueStyle: {
        marginVertical: heightPercentageToDP(1),
        marginLeft: widthPercentageToDP(1),
      },
      errorText: {
        color: 'red',
        paddingVertical: 10,
        fontSize: 13,
      },
      submitBtn:{
          marginTop: heightPercentageToDP(2)
      }
  });


  const mapStateToProps = state => {
    return {
      pincodedata: state.editUserProfile.pincodedata,
      primaryAddress: state.booking.primaryAddress,
      login: state.login,
      newAddressAdded: state.booking.newAddressAdded,
    };
  };
  
const mapDispatchToProps = dispatch => ({
    dispatch,
    onChangeField: (key,value) => {
        dispatch(changeField(key,value));
    },
    isPinValid: (pin) => {
        dispatch(checkPinCode(pin));
    },
    onAddAddress: address => {
        dispatch(addAddress(address));
    },
});


export default withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(AddressForm)
  );