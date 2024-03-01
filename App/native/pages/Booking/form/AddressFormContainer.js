import React, {Component} from 'react';
import AddressForm from './AddressForm';
import {connect} from 'react-redux';
import {
  CHECK_PIN,
  ADD_ADDRESS,
  SELECT_ADDRESS,
  BOOK_PRODUCT,
} from '../redux/actions';
import {validateCart} from '../../CartDetail/actions';
import {View} from 'react-native';
import {LogFBEvent, Events} from '../../../../Events';
import NavigationService from '../../../../utils/NavigationService';
import {showToastr} from '../../utils';

class AddressFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: props.address && props.address.name ? props.address.name : '',
        pincode: props.login.userPreferences.prefPinCode
          ? props.login.userPreferences.prefPinCode
          : props.address && props.address.pinCode
          ? props.address.pinCode
          : '',
        state: props.address && props.address.state ? props.address.state : '',
        streetAddress:
          props.address && props.address.addressName
            ? props.address.addressName
            : '',
        addressLine1:
          props.address && props.address.addressLine1
            ? props.address.addressLine1
            : '',
        city: props.address && props.address.city ? props.address.city : '',
      },
      validation: {
        name: false,
        pincode: false,
        streetAddress: false,
        addressLine1: false,
      },
      localityError: false,
    };
    this.onUpdateAddress = this.onUpdateAddress.bind(this);
    this.editPinCode = this.editPinCode.bind(this);
  }

  componentDidMount() {
    if (
      this.props.login &&
      this.props.login.userPreferences &&
      this.props.login.userPreferences.prefPinCode &&
      !this.props.newAddressAdded
    ) {
      this.validatePincode(this.props.login.userPreferences.prefPinCode);
    }
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (this.props.address !== nextProps.address) {
      this.setState(prev => ({
        form: {
          ...prev.form,
          name: nextProps.address.name || '',
          pincode: nextProps.address.pinCode || '',
          state: nextProps.address.state || '',
          streetAddress: nextProps.address.addressName || '',
          addressLine1: nextProps.address.addressLine1 || '',
          city: nextProps.address.city || '',
        },
      }));
    }

    if (nextProps.pinCodeChecked && nextProps.pinCodeChecked) {
      this.setState(prev => ({
        form: {
          ...prev.form,
          state: nextProps.pinCodeChecked.stateName || '',
          city: nextProps.pinCodeChecked.city || '',
        },
      }));
      //this.props.scrollToEnd();
    }
    if (
      this.props.status !== nextProps.status ||
      this.props.message !== nextProps.message
    ) {
      this.isStatusChange(nextProps.status, nextProps.message);
    }
  };

  validatePincode = pincode => {
    const {isPinValid, status} = this.props;
    const {id} = this.props.booking;
    let errors = {};
    isPinValid(pincode, id, false);
    this.isStatusChange(status);
  };

  validateCart = pincode => {
    const {isCartValidOnSelectPin, status} = this.props;
    const cartId = this.props.cart.cartOrderDetails[0].cartId;
    if (pincode) isCartValidOnSelectPin(pincode, cartId);
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

  handleChange = (value, name) => {
    if (name === 'pincode' && value.length > 5) {
      // this.props.parentComp == 'Booking'
      //   ? this.validatePincode(value)
      //   : this.validateCart(value);
      this.props.isPinValid(value, undefined, false);
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
    const {name, pincode, streetAddress, addressLine1} = this.state.form;
    const {localityData, selectedLocality} = this.props;
    let valid = {};
    if (!name) {
      valid = {
        ...valid,
        name: true,
      };
    }
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
      (!selectedLocality || !selectedLocality.id || selectedLocality.id == '')
    ) {
      this.setState({localityError: true});
    }
    this.setState({
      validation: valid,
    });
  };

  onUpdateAddress = () => {
    const {name, pincode, streetAddress, addressLine1} = this.state.form;
    const {id} = this.props.booking;
    if (!this.props.status) {
      this.props.parentComp == 'Booking'
        ? this.validatePincode(pincode)
        : this.validateCart(pincode);
    }
    const {localityData, selectedLocality} = this.props;
    const shouldCheckLocality =
      localityData && localityData.length && localityData.length != 0;
    if (
      (shouldCheckLocality
        ? selectedLocality && selectedLocality.id && selectedLocality.id != ''
          ? true
          : false
        : true) &&
      name &&
      pincode &&
      addressLine1 &&
      this.props.status
    ) {
      this.state.form.pinCode = pincode;
      this.state.form.addressName =
        selectedLocality && selectedLocality.areaName
          ? selectedLocality.areaName
          : streetAddress;
      this.state.form.offerId = id;
      this.props.addAddress(this.state.form);
    } else {
      this.isFieldReady();
      this.props.scrollToEnd();
    }
  };

  editPinCode = () => {
    LogFBEvent(Events.ADDRESS_FORM_EDIT_PINCODE, {});
    this.props.dispatch({
      type: 'home/SET_STATE',
      payload: {editPincodeClicked: true},
    });
    NavigationService.navigate('AddressPincode', {canGoBack: true});
  };

  render() {
    return (
      <View>
        <AddressForm
          isLoading={this.props.loading}
          form={this.state.form}
          handleChange={this.handleChange}
          errors={this.state.errors}
          validation={this.state.validation}
          localityError={this.state.localityError}
          prefPinCode={this.props.login.userPreferences.prefPinCode}
          takeToEditPinCode={this.editPinCode}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.booking.pinLoading,
    status: state.booking.status,
    message: state.booking.message,
    address: state.booking.addressField,
    pinCodeChecked: state.booking.pinCodeChecked,
    selectedLocality: state.booking.selectedLocality,
    activeAddress: state.booking.selectedAddress,
    booking: state.booking.booking,
    cart: state.home.cart,
    login: state.login,
    localityData: state.booking.localityData,
    newAddressAdded: state.booking.newAddressAdded,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  isPinValid: (pin, offerId, fromAddress) => {
    dispatch(CHECK_PIN(pin, offerId, fromAddress));
  },
  isCartValidOnSelectPin: (pincode, cartId) => {
    dispatch(validateCart({pincode, cartId}));
  },
  selectAddress: address => {
    dispatch(SELECT_ADDRESS(address));
  },
  addAddress: address => {
    dispatch(ADD_ADDRESS({address}));
  },
  addBookProduct: product => dispatch(BOOK_PRODUCT(product)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(AddressFormContainer);
