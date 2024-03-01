/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, ActivityIndicator} from 'react-native';
import idx from 'idx';
import LinearGradient from 'react-native-linear-gradient';
import {Images} from '../../../../../assets/images';
import Button from '../../../../components/Button/Button';
import {Fonts} from '../../../../../assets/global';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../components/Texts';
import {Constants} from '../../../../styles';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {showToastr} from '../../utils';
import {QUANTITY} from '../../Booking/redux/actions';
import {UpdateCart} from '../../Home/redux/action';
import {LogFBEvent, Events} from '../../../../Events';
import {widthPercentageToDP, heightPercentageToDP} from '../../../../utils';

const fontSizeIcon = 14;
const containerHeight = 30;

export class QuantityCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1,
      selectedSize: '',
      selectedColor: '',
      offerId: '',
    };
  }

  componentDidMount = () => {
    const {cart, offerId, local, updateQuantity, screen} = this.props;
    if (cart && cart.cartOrderDetails && cart.cartOrderDetails.length) {
      let quantity = 1;
      let selectedSize = '';
      let selectedColor = '';
      let idToInsert = '';
      cart.cartOrderDetails.map((cartItem, index) => {
        let cartOfferId;
        if (screen == 'CartDetail') {
          cartOfferId = cartItem.offerId || cartItem.parentId;
        } else {
          cartOfferId = cartItem.parentId || cartItem.offerId;
        }

        if (offerId == cartOfferId) {
          idToInsert = cartOfferId;
          quantity = cartItem.quantity;
          selectedSize = cartItem.size;
          selectedColor = cartItem.colour;
        }
      });

      this.setState({
        offerId: idToInsert,
        quantity: quantity,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
      });
      if (local) updateQuantity(quantity);
    }
  };

  quantityIncrease = () => {
    const {
      t,
      local,
      isHome,
      isPDP,
      entityType,
      maxQuantity,
      launchEventDetails,
    } = this.props;
    const source = idx(launchEventDetails, _ => _.source);
    const {offerId, selectedSize, selectedColor} = this.state;
    let quantity = local ? this.state.quantity : this.props.quantity;
    if (maxQuantity && maxQuantity == quantity) {
      showToastr(t('Maximum quantity for this offer is reached'));
    } else {
      if (local) {
        this.setState({quantity: quantity + 1});
        this.props.incQuantity();
      } else {
        this.props.updateCart(
          offerId,
          quantity + 1,
          selectedSize,
          selectedColor,
          null,
          source
        );
      }

      if (entityType) {
        if (entityType === 'offers') {
          LogFBEvent(Events.OTHER_SIMILAR_QUANTITY_INCREASE_CART_DETAILS, {
            offerId: offerId,
            quantity: quantity,
          });
        } else {
          LogFBEvent(Events.OTHER_ESSENTIALS_QUANTITY_INCREASE_CART_DETAILS, {
            offerId: offerId,
            quantity: quantity,
          });
        }
      }

      let screenName = '';
      if (isHome) {
        screenName = 'Home';
      } else {
        if (isPDP) {
          screenName = 'PDP';
        } else {
          screenName = 'CartDetails';
        }
      }

      LogFBEvent(Events.ADD_TO_CART_BUTTON_CLICK, {
        offerId: offerId,
        quantity: quantity,
        page: screenName,
        action: 'quantityIncrease',
      });
    }
  };

  quantityDecrease = () => {
    const {local, isHome, isPDP, entityType, launchEventDetails} = this.props;
    const {offerId, selectedSize, selectedColor} = this.state;
    let quantity = local ? this.state.quantity : this.props.quantity;
    const source = idx(launchEventDetails, _ => _.source);
    const medium = idx(launchEventDetails, _ => _.medium);
    if (quantity > 0) {
      if (local) {
        this.setState({quantity: quantity - 1});
        this.props.decQuantity();
      } else {
        this.props.updateCart(
          offerId,
          quantity - 1,
          selectedSize,
          selectedColor,
          null,
          source,
          medium
        );
      }
    }

    if (entityType) {
      if (entityType === 'offers') {
        LogFBEvent(Events.OTHER_SIMILAR_QUANTITY_DECREASE_CART_DETAILS, {
          offerId: offerId,
          quantity: quantity,
        });
      } else {
        LogFBEvent(Events.OTHER_ESSENTIALS_QUANTITY_DECREASE_CART_DETAILS, {
          offerId: offerId,
          quantity: quantity,
        });
      }
    }

    let screenName = '';
    if (isHome) {
      screenName = 'Home';
    } else {
      if (isPDP) {
        screenName = 'PDP';
      } else {
        screenName = 'CartDetails';
      }
    }

    LogFBEvent(Events.ADD_TO_CART_BUTTON_CLICK, {
      offerId: offerId,
      quantity: quantity,
      page: screenName,
      action: 'quantityDecrease',
    });
  };

  render() {
    const {
      offerSizeUpdatingInCart,
      offerIdUpdatingInCart,
      loadingAddToCart,
      activeCategoryTab,
      height,
      local,
      isCommmunityRelevance,
      t,
      noBorder,
    } = this.props;
    const {offerId, selectedSize} = this.state;

    if (!offerId) return null;

    let quantity = local ? this.state.quantity : this.props.quantity;

    if (
      loadingAddToCart &&
      offerIdUpdatingInCart == offerId &&
      offerSizeUpdatingInCart == selectedSize
    ) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    return (
      <View
        style={[
          isCommmunityRelevance
            ? {
                width: widthPercentageToDP(20),
                borderRadius: 5,
                left: widthPercentageToDP(8),
              }
            : styles.container,
          activeCategoryTab === 'free-gift'
            ? {borderColor: 'transparent', alignItems: 'center'}
            : {},
          noBorder ? {borderRadius: 0} : {},
        ]}>
        <View
          style={[
            styles.buttonContainer,
            {
              height: isCommmunityRelevance
                ? heightPercentageToDP(3)
                : height
                ? height
                : containerHeight,
            },
            noBorder ? {borderRadius: 0} : {},
          ]}>
          <LinearGradient
          colors={['#fdc001', '#fd7400']}
          style={styles.buttonStyleLeft}>
          <Button
            styleContainer={[
              noBorder
                ? {borderBottomLeftRadius: 0, borderTopLeftRadius: 0}
                : {},
            ]}
            onPress={this.quantityDecrease}>
            <Icon
              color={Constants.white}
              name={'remove'}
              type={'material'}
              size={fontSizeIcon}
            />
          </Button>
          </LinearGradient>
          <View style={styles.quantityStyle}>
            <AppText
              primaryColor
              style={{fontSize: fontSizeIcon, fontFamily: Fonts.roboto}}>
              {quantity}
            </AppText>
          </View>

          <LinearGradient
          colors={['#fdc001', '#fd7400']}
          style={styles.buttonStyleRight}>
          <Button
            styleContainer={[
              noBorder
                ? {borderBottomRightRadius: 0, borderTopRightRadius: 0}
                : {},
            ]}
            onPress={this.quantityIncrease}>
            <Icon
              color={Constants.white}
              name={'add'}
              type={'material'}
              size={fontSizeIcon}
            />
          </Button>
          </LinearGradient>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonContainer: {
    borderColor: Constants.primaryColor,
    borderWidth: 1,
    borderRadius: 5,
    height: containerHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonStyleLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    flex: 1,
  },
  buttonStyleRight: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
    flex: 1,
  },
  quantityStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

const mapStateToProps = state => {
  return {
    cart: state.home.cart,
    loadingAddToCart: state.home.loadingAddToCart,
    offerIdUpdatingInCart: state.home.offerIdUpdatingInCart,
    offerSizeUpdatingInCart: state.home.offerSizeUpdatingInCart,
    selectedSize: state.booking.selectedSize,
    selectedColor: state.booking.selectedColor,
    launchEventDetails: state.login.launchEventDetails,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  updateQuantity: quantity => dispatch(QUANTITY(quantity)),
  updateCart: (
    offerId,
    quantity,
    size,
    color,
    currencyMode,
    source,
    medium
  ) => {
    dispatch(
      UpdateCart(offerId, quantity, size, color, currencyMode, source, medium)
    );
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(QuantityCounter)
);
