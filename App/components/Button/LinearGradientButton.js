import React, {Component} from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Button from './Button';
import {
  scaledSize,
  AppWindow,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import idx from 'idx';
import {Colors, Fonts} from '../../../assets/global';
import {Images} from '../../../assets/images';
import {withTranslation} from 'react-i18next';
import {AppText} from '../Texts';
import {connect} from 'react-redux';
import {UpdateCart} from '../../native/pages/Home/redux/action';
import SizeColorWeightContainer from '../../native/pages/Booking/Component//SizeColorWeightContainer';
import QuantityCounter from '../../native/pages/Booking/Component/QuantityCounter';
import {changeField} from '../../native/pages/Login/actions';
import RBSheet from 'react-native-raw-bottom-sheet';
import {LogFBEvent, Events} from '../../Events';
import {Constants} from '../../styles';
import NavigationService from '../../utils/NavigationService';

export class LinearGradientButton extends Component {
  constructor() {
    super();
    this.state = {
      quantity: 0,
    };
    this.RBSheet = null;
  }

  componentDidMount() {
    const {checkOutOfStock, stockValue, offerId} = this.props;
    if (checkOutOfStock && stockValue < 1) {
      LogFBEvent(Events.OUT_OF_STOCK, {offerId: offerId});
    }
  }

  addToCart = () => {
    const {isLoggedIn, screenName} = this.props;
    if (!isLoggedIn) {
      this.props.onChangeField('loginInitiatedFrom', screenName);
      NavigationService.navigate('Login', {callback: this.addToCartCallback});
    } else {
      this.addToCartCallback();
    }
  };

  addToCartCallback = () => {
    const {
      offerId,
      item,
      screenName,
      onAddTocart,
      entityType,
      widgetId,
      category,
      widgetType,
      position,
      page,
      currencyMode,
      selectedSize,
      selectedColor,
      launchEventDetails,
    } = this.props;

    const source = idx(launchEventDetails, _ => _.source);
    const medium = idx(launchEventDetails, _ => _.medium);
    const sizes =
      (item.sizeColourWeight && item.sizeColourWeight.size) || item.sizes;
    const showSize = sizes && sizes.length > 0;

    const colours =
      (item.sizeColourWeight && item.sizeColourWeight.colour) || item.colours;

    const showColor = colours && colours.length > 0;

    if (showSize && showColor) {
      if (selectedSize === '' || selectedColor === '') {
        this.handleBottomAction();
        return;
      }
    } else if (showSize) {
      if (selectedSize === '') {
        this.handleBottomAction();
        return;
      }
    } else if (showColor) {
      if (selectedColor === '') {
        this.handleBottomAction();
        return;
      }
    }

    if (offerId) {
      this.props.updateCart(
        offerId,
        1,
        selectedSize,
        selectedColor,
        currencyMode,
        source,
        medium
      );
      if (widgetId) {
        LogFBEvent(Events.ADD_TO_CART_BUTTON_CLICK, {
          offerId: offerId,
          widgetId: widgetId,
          widgetType: widgetType,
          category: category,
          position: position,
          page: page,
          utmSource: source,
          utmMedium: medium,
        });
      } else {
        LogFBEvent(Events.ADD_TO_CART_BUTTON_CLICK, {
          offerId: offerId,
          page: screenName,
          utmSource: source,
          utmMedium: medium,
        });
      }
    }
    if (entityType) {
      if (entityType === 'offers') {
        LogFBEvent(Events.OTHER_SIMILAR_ADD_TO_CART_CARTDETAIL, null);
      } else {
        LogFBEvent(Events.OTHER_ESSENTIALS_ADD_TO_CART_CARTDETAIL, null);
      }
    }

    if (onAddTocart) onAddTocart();
  };

  handleBottomAction = () => {
    this.RBSheet && this.RBSheet.open();
  };

  handleCloseBottomSheet = () => {
    this.RBSheet && this.RBSheet.close();
  };

  onSizePress = (index, size) => {
    this.props.dispatch({
      type: 'booking/SET_STATE',
      payload: {selectedSize: size},
    });
    this.closeSizeColorWeightSheet(true, size, false, '');
  };

  onColorPress = (index, color) => {
    this.props.dispatch({
      type: 'booking/SET_STATE',
      payload: {selectedColor: color},
    });
    this.closeSizeColorWeightSheet(false, '', true, color);
  };

  closeSizeColorWeightSheet = (size, _selectedSize, color, _selectedColor) => {
    let selectedSize = '';
    let selectedColor = '';
    if (size) {
      selectedSize = _selectedSize;
    } else {
      selectedSize = this.props.selectedSize;
    }

    if (color) {
      selectedColor = _selectedColor;
    } else {
      selectedColor = this.props.selectedColor;
    }

    const {offerId, currencyMode, item, launchEventDetails} = this.props;
    const source = idx(launchEventDetails, _ => _.source);
    const medium = idx(launchEventDetails, _ => _.medium);
    const sizes =
      (item && item.sizeColourWeight && item.sizeColourWeight.size) ||
      item.sizes;
    const showSize = sizes && sizes.length > 0;

    const colours =
      (item && item.sizeColourWeight && item.sizeColourWeight.colour) ||
      item.colours;

    const showColor = colours && colours.length > 0;

    if (showSize && showColor) {
      if (selectedSize !== '' && selectedColor !== '') {
        this.handleCloseBottomSheet();
        if (offerId) {
          this.props.updateCart(
            offerId,
            1,
            selectedSize,
            selectedColor,
            currencyMode,
            source,
            medium
          );
        }
      }
    } else {
      this.handleCloseBottomSheet();
      if (offerId) {
        this.props.updateCart(
          offerId,
          1,
          selectedSize,
          selectedColor,
          currencyMode,
          source,
          medium
        );
      }
    }
  };

  render() {
    const {
      loadingAddToCart,
      offerIdUpdatingInCart,
      offerId,
      colors,
      title,
      onPress,
      gradientStyles,
      btnStyles,
      viewStyle,
      children,
      titleStyle,
      isBoderOnly,
      t,
      entityType,
      disabled,
      cartButton,
      hasCart,
      cart,
      doNotShowQuantityText,
      stockValue,
      notQuantityText,
      checkOutOfStock,
      screenName,
      outOfStockTextStyle,
      horizontalList,
      QuantityCounterHeight,
      QuantityCounterNoBorder,
      dontShowRemainingStockValue,
      maxQuantity,
      widgetType,
      isCommmunityRelevance,
      currencyMode,
      canBuyFromCoins,
      item,
    } = this.props;

    let sizes = [];
    let colours = [];
    let showSize = false;
    let showColor = false;

    if (item) {
      sizes =
        (item.sizeColourWeight && item.sizeColourWeight.size) || item.sizes;
      showSize = sizes && sizes.length > 0;
      colours =
        (item.sizeColourWeight && item.sizeColourWeight.colour) || item.colours;
      showColor = colours && colours.length > 0;
    }

    if (currencyMode == 'coins' && !canBuyFromCoins) {
      return (
        <View
          style={[
            stylesB2(colors).cartContainer,
            viewStyle,
            {
              alignItems: 'center',
              justifyContent: 'center',
              height: QuantityCounterHeight
                ? QuantityCounterHeight + heightPercentageToDP(2)
                : heightPercentageToDP(7),
            },
          ]}>
          <AppText size="S" style={{color: '#ec3d5a'}}>
            {t('NEED MORE COINS')}
          </AppText>
        </View>
      );
    }

    let minimumStockValue = 10;
    if (screenName == 'InactiveFlashSales') {
      return <View />;
    }

    if (
      screenName == 'InactiveFlashSales' ||
      screenName == 'ActiveFlashSales'
    ) {
      minimumStockValue = 100;
    }

    const customHeight = QuantityCounterHeight
      ? QuantityCounterHeight + heightPercentageToDP(2)
      : 30;

    let {size} = this.props.selectedSize;
    if (checkOutOfStock && stockValue < 1) {
      return (
        <View
          style={[
            stylesB2(colors).cartContainer,
            viewStyle,
            {
              alignItems: 'center',
              justifyContent: 'center',
              height: isCommmunityRelevance
                ? heightPercentageToDP(4)
                : QuantityCounterHeight
                ? QuantityCounterHeight + heightPercentageToDP(2)
                : heightPercentageToDP(7),
            },
            isCommmunityRelevance ? {backgroundColor: 'white'} : {},
          ]}>
          <AppText
            error
            bold
            style={[
              isCommmunityRelevance ? {fontSize: 12} : {fontSize: 16},
              outOfStockTextStyle,
            ]}>
            {t('Out of Stock')}
          </AppText>
        </View>
      );
    }

    let quantity = 0;

    if (hasCart) {
      if (cart && cart.cartOrderDetails && cart.cartOrderDetails.length) {
        cart.cartOrderDetails.map((cartItem, index) => {
          let cartOfferId = cartItem.parentId || cartItem.offerId;
          if (offerId == cartOfferId) {
            quantity = cartItem.quantity;
            size = cartItem.size;
          }
        });
      }
    }

    if (cartButton) {
      return (
        <View style={viewStyle}>
          {loadingAddToCart && offerIdUpdatingInCart == offerId ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: customHeight,
              }}>
              <ActivityIndicator animating size="small" />
            </View>
          ) : (
            <View style={stylesB2(colors).cartContainer}>
              {hasCart && quantity > 0 ? (
                <View
                  style={[
                    stylesB2(colors).cartButtonText,
                    {
                      flexDirection: 'row',
                      borderColor: 'transparent',
                      height: customHeight,
                    },
                  ]}>
                  {doNotShowQuantityText ? (
                    <View></View>
                  ) : !notQuantityText ? (
                    <View style={{flex: 1}}>
                      <AppText black size="L">
                        {t('Quantity: ')}
                      </AppText>
                    </View>
                  ) : null}

                  <QuantityCounter
                    maxQuantity={maxQuantity}
                    isCommmunityRelevance={isCommmunityRelevance}
                    noBorder={QuantityCounterNoBorder}
                    height={customHeight}
                    activeCategoryTab={''}
                    quantity={quantity}
                    offerId={offerId}
                    size={size}
                    entityType={entityType}
                    isHome
                    stockValue={stockValue}
                  />
                </View>
              ) : (
                <LinearGradient
                  colors={colors}
                  style={[styles.linearGradient, gradientStyles]}>
                <Button
                  styleContainer={[
                    //stylesB2(colors).cartButtonText,
                    {
                      height: heightPercentageToDP(6),
                      //borderRadius: scaledSize(5),
                      //borderWidth: scaledSize(2),
                    },
                    btnStyles,
                  ]}
                  onPress={this.addToCart}>
                  {children}
                  <AppText bold style={[stylesB2(colors).title, titleStyle]}>
                    {t(title)}
                  </AppText>
                </Button>
                </LinearGradient>
              )}
              <RBSheet
                ref={ref => {
                  this.RBSheet = ref;
                }}
                height={
                  showSize && showColor
                    ? heightPercentageToDP(28)
                    : heightPercentageToDP(14)
                }
                duration={80}
                closeOnDragDown={true}
                customStyles={{
                  container: {
                    borderRadius: 10,
                  },
                }}>
                <SizeColorWeightContainer
                  t={t}
                  showSize={showSize}
                  sizes={sizes}
                  onSizePress={this.onSizePress}
                  sizeHeader={'Select Size'}
                  showColor={showColor}
                  colorHeader={'Select Colour'}
                  colours={colours}
                  onColorPress={this.onColorPress}
                />
              </RBSheet>
            </View>
          )}

          {!dontShowRemainingStockValue &&
          checkOutOfStock &&
          stockValue > 0 &&
          stockValue < minimumStockValue ? (
            <View style={styles.hurryUp}>
              <AppText size="XXS" warning bold style={{textAlign: 'center'}}>
                {t('Hurry Up, Only #STOCKVALUE# left', {
                  STOCKVALUE: stockValue,
                })}
              </AppText>
            </View>
          ) : // ) : horizontalList ? (
          //   <View style={styles.hurryUp}>
          //   </View>
          null}
        </View>
      );
    } else if (!!isBoderOnly) {
      return (
        <Button
          styleContainer={[stylesB2(colors).buttonText, btnStyles]}
          onPress={onPress}>
          {children}
          <AppText style={[stylesB2(colors).title, titleStyle]}>
            {t(title)}
          </AppText>
        </Button>
      );
    } else {
      return (
        <LinearGradient
          colors={colors}
          style={[styles.linearGradient, gradientStyles]}>
          <Button
            disabled={disabled}
            styleContainer={[styles.buttonText, btnStyles]}
            onPress={onPress}>
            {children}
            <AppText style={[styles.title, titleStyle]}>{t(title)}</AppText>
          </Button>
        </LinearGradient>
      );
    }
  }
}

const stylesB2 = colors =>
  StyleSheet.create({
    cartContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    cartIcon: {
      width: scaledSize(42),
      height: scaledSize(42),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scaledSize(6),
      borderWidth: scaledSize(0.5),
      borderColor: Colors.slightGrey,
    },
    cartIconContainer: {
      height: scaledSize(50),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cartButtonText: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors[0],
    },
    buttonText: {
      width: '100%',
      height: scaledSize(50),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scaledSize(5),
      borderWidth: scaledSize(2),
      borderColor: colors[0],
    },
    title: {
      color: colors[0],
      textTransform: 'uppercase',
      fontSize: scaledSize(14),
      fontFamily: Fonts.roboto,
      fontWeight: '600',
    },
    sizeStyle: {
      marginHorizontal: widthPercentageToDP(2),
      marginBottom: widthPercentageToDP(2),
      height: heightPercentageToDP(8),
      flexDirection: 'column',
    },
    pickerHeader: {
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: heightPercentageToDP(2),
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
    },
    pickerStyle: {
      justifyContent: 'space-between',
      alignItems: 'center',
      height: heightPercentageToDP(6),
      flexDirection: 'row',
    },
  });

const styles = StyleSheet.create({
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    // paddingLeft: 5,
    // paddingRight: 5,
    borderRadius: 4,
  },
  buttonText: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    fontSize: scaledSize(14),
    fontFamily: Fonts.roboto,
    fontWeight: '600',
  },
  hurryUp: {
    height: heightPercentageToDP(2),
  },
});

const mapStateToProps = state => {
  return {
    cart: state.home.cart,
    hasCart: state.home.hasCart,
    loadingAddToCart: state.home.loadingAddToCart,
    offerIdUpdatedInCart: state.home.offerIdUpdatedInCart,
    offerIdUpdatingInCart: state.home.offerIdUpdatingInCart,
    selectedSize: state.booking.selectedSize,
    selectedColor: state.booking.selectedColor,
    launchEventDetails: state.login.launchEventDetails,
    isLoggedIn: state.login.isLoggedIn,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
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
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(LinearGradientButton)
);
