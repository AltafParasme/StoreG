import React, {Component} from 'react';
import {
  View,
  BackHandler,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {getWidgets} from '../Home/redux/action';
import Config from 'react-native-config';
import {getLiveOfferListInBulk} from '../Home/redux/action';
import {CheckBox, Button as ButtonEl} from 'react-native-elements';
import {Header} from '../../../components/Header/Header';
import {withTranslation} from 'react-i18next';
import idx from 'idx';
import {connect} from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import NavigationService from '../../../utils/NavigationService';
import {AppText} from '../../../components/Texts';
import {essentialEntityId} from '../../../Constants';
import GroupOrderOverlay from '../OrderConfirmation/Component/GroupOrderOverlay';
import AddressTab from '../Booking/Component/TabComponent';
import {Constants} from '../../../styles';
import Button from '../../../components/Button/Button';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Images} from '../../../../assets/images';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import {changeField, initiatePayment, validatePayment, validateCart} from './actions';
import {changeField as changeFieldLogin} from '../Login/actions';
import {GetCart} from '../Home/redux/action';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import LinearGradientButton from '../../../components/Button/LinearGradientButton';
import {Colors} from '../../../../assets/global';
import {OrderStatusTimeLine, AppConstants} from '../../../Constants';
import BookingTotalText from '../Booking/Component/BookingTotalText';
import ReturnPolicy from '../Booking/Component/ReturnPolicy';
import {
  scaledSize,
  AppWindow,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../utils';
import moment from 'moment';
import {PlaceOrder,verifyPayment} from '../Home/redux/action';
import SimilarProducts from '../Booking/SimilarProducts';
import {FriendListComponent} from '../ShippingList/component/FriendListComponent';
import { paymentConstants } from '../../../Constants';
import LocationComponent from '../../../components/LocationComponent/LocationComponent';
import { showToastr, getListofCategories, showAlert } from '../utils';
import Modal from 'react-native-modal';
import SearchModal from '../../../components/DropdownWithSearch/SearchModal';
import {CHECK_PIN,UPDATE_ADDRESS} from '../Booking/redux/actions';
import Relevance from '../../../components/LiveComponents/Relevance';
import ShopgLive from '../ShopgLive';
import TrustMarker from './Component/TrustMarker';
import {specialCaseWidgets} from '../../../Constants';
import {freeGiftWidgetData} from './Constants';


let titleChanged = false;
class CartDetail extends Component {
  constructor(props) {
    super();
    this.state = {
      currentTab: 0,
      checked: true,
      addressAdded: true,
      paymentMode: 'ONLINE',
      pincodeselected: '',
      shouldScrollToEnd: true,
      isWidgetPresent: false,
      isTooltipVisible: false,
      backButtonEnabled: false,
      stateLocalityData:[],
      isFreeShipping:false,
      paymentErrorMsg:'',
      razorpay_order_id : null,
      razorpay_payment_id : null,
      razorpay_signature : null,
      paymentError:false
    };
    this.scroll = null;
    this.scrollToEnd = this.scrollToEnd.bind(this);
    this.handleClosePaymentSheet = this.handleClosePaymentSheet.bind(this);
    this.WEBVIEW_REF = React.createRef();
    this.tabComponent = React.createRef();
    this.PaymentSheet = React.createRef();
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.onPressPayment = this.onPressPayment.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.changePaymentOption = this.changePaymentOption.bind(this);
  }

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
    this.props.onChangeField('isCartValid', false);
    this.props.onChangeFieldLogin('currentScreen', '');
  }

  handleBackButtonClick() {
    NavigationService.navigate('Home');
    return true;
  }

  handleClosePaymentSheet = () => {
    this.props.onChangeField('isCartValid', false);
    // this.PaymentSheet && this.PaymentSheet.close();
  };

  onPressPayment = () => {
    const {t} = this.props;
    const { paymentMode } = this.state;
    const { user } = this.props.userProfile;
    const cartId = idx(this.props.cart, _ => _.cartOrderDetails[0].cartId);
    if(!cartId){
      showToastr(t('Cart Id not present'))
      return null;
    } 

    const totalPrice = idx(this.props.cart, _ => _.billing.totalPrice);
    if(!totalPrice){
      showToastr(t('Total Price not present'))
      return null;
    } 
    
    this.saveBooking();
    this.handleClosePaymentSheet();
    LogFBEvent(Events.CONFIRM_CART_ORDER, {
      cartId: this.props.cart.id,
      totalOfferPrice: this.props.cart.billing.totalOfferPrice,
      groupCode: this.props.cart.groupCode,
    });
  }

  scrollToEnd = () => {
    this.scroll && this.scroll.scrollTo({y: scaledSize(AppWindow.height)});
  };

  confirmBooking = () => {
    const {login,address, activeAddress, cart, showSearchModal, localityData,addressUpdated, launchEventDetails} = this.props;
    

    if (
      this.props.newAddressAdded ||
      (!this.state.currentTab && Object.keys(address).length)
    ) {
      if(activeAddress.localityId || (showSearchModal && localityData.length==0) || addressUpdated){

        if(this.props.cartDetails.isCartValid) {

          const razorPayOnlinePayment = idx(login, _ => _.userPreferences.featureConfig.razorPayOnlinePayment);
          
          if(razorPayOnlinePayment){
            LogFBEvent(Events.PAYMENT_MODE_SHEET_OPEN, {
              cartId: cart.id,
              totalOfferPrice: cart.billing.totalOfferPrice,
              groupCode: cart.groupCode,
            });
            LogFBEvent(Events.PAYMENT_SELECTOR, {
              cartId: cart.id,
              paymentMode:'ONLINE',
            });
            this.PaymentSheet && this.PaymentSheet.open();
          } else {
            this.saveBooking();
          }

        } else {
          const cartId = idx(cart, _ => _.cartOrderDetails[0].cartId);
          this.props.onValidateCart(activeAddress.pinCode, cartId,
            callback = (success) => {
              if(success){
                this.confirmBooking()
              }
            });
        }


      } else {
        this.props.isPinValid(activeAddress.pinCode,undefined,true)
      }

    } else {
      this.tabComponent &&
        this.tabComponent.current &&
        this.tabComponent.current.wrappedInstance &&
        this.tabComponent.current.wrappedInstance.addAddressButton &&
        this.tabComponent.current.wrappedInstance.addAddressButton.current &&
        this.tabComponent.current.wrappedInstance.addAddressButton.current
          .wrappedInstance &&
        this.tabComponent.current.wrappedInstance.addAddressButton.current.wrappedInstance.onUpdateAddress();
    }
  };

  saveBooking(){
    let useRewards = 0;
    const {t,login,addressName, address, activeAddress, cart, showSearchModal, localityData,addressUpdated, launchEventDetails} = this.props;
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = this.state;
    const { user } = this.props.userProfile;
    const source = idx(launchEventDetails, _ => _.source);
    const medium = idx(launchEventDetails, _ => _.medium);
    if (cart.billing && cart.billing.reward > 0 && this.state.checked) {
      useRewards = cart.billing.reward;
    }

    const { paymentMode,paymentErrorMsg } = this.state;
    let logObject = {
      cartId: this.props.cart.id,
      totalOfferPrice: this.props.cart.billing.totalOfferPrice,
      groupCode: this.props.cart.groupCode,
      paymentErrorMsg:paymentErrorMsg
    }
    
    this.props.dispatch({
      type: 'booking/SET_STATE',
      payload: {
        showSearchModal: false,
        addressUpdated: false
      },
    });
    this.props.onChangeField('isCartValid', false);
    let listofCategories = getListofCategories(cart.cartOrderDetails);
    this.props.onPlaceOrder(
      cart.id,
      useRewards,
      activeAddress.id,
      addressName,
      paymentMode,
      cart.billing.totalPriceWithRewards,
      cart.cartOrderDetails.length,
      listofCategories,
      source,
      medium,
      callback = (success,key,orderId,errorMessage) => {
        if(success){
          if(paymentMode == 'COD'){
            NavigationService.navigate('OrderConfirmation');
          } else {
            var options = {
              description: AppConstants.orderDescription,
              currency: 'INR',
              key: key, // Your api key
              order_id: orderId,
              name: (user && user.name) ? user.name : '',
              prefill: {
                contact: (user && user.phoneNumber) ? user.phoneNumber : '',
                name: (user && user.name) ? user.name : '',
                email:(user && user.name) ? user.phoneNumber+'@shopg.in' : AppConstants.supportEmail
              },
              readonly: {
                email: true,
                contact: true
              },
              theme: {color: Constants.primaryColor}
            }
            RazorpayCheckout.open(options).then((data) => {
              if(data && data.razorpay_order_id && data.razorpay_payment_id && data.razorpay_signature){
                this.afterPayment(data.razorpay_order_id,data.razorpay_payment_id,data.razorpay_signature);
              } else {
                this.afterPayment(null,null,null);
              }
            }).catch((error) => {
              // handle failure
              this.afterPayment(null,null,null);
            });
          }
        } else {
          showAlert(t(errorMessage))
        }


        LogFBEvent(Events.PLACE_CART_ORDER, {
          cartId: this.props.cart.id,
          totalOfferPrice: this.props.cart.billing.totalOfferPrice,
          groupCode: this.props.cart.groupCode,
          totalCartItems: this.props.totalCartItems,
          source: source,
          medium: medium,
          paymentMode:paymentMode
        });

      }
    );
  }

  afterPayment = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const {dispatch,verifyPayment} = this.props;
    let paymentSuccess = 0;
    if(razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      paymentSuccess = 1;
      LogFBEvent(Events.PLACE_ONLINE_PAYMENT, {
        cartId: this.props.cart.id,
        totalOfferPrice: this.props.cart.billing.totalOfferPrice,
        paymentSuccess:paymentSuccess
      });
      dispatch({type: 'home/SET_STATE',payload: {paymentSignatureFailed: false},});
      verifyPayment(this.props.cart.id,razorpay_order_id,razorpay_payment_id,razorpay_signature);
    } else {
      paymentSuccess = 0;
      this.setState({paymentError:true})
      LogFBEvent(Events.PLACE_ONLINE_PAYMENT, {
        cartId: this.props.cart.id,
        totalOfferPrice: this.props.cart.billing.totalOfferPrice,
        paymentSuccess:paymentSuccess
      });
      dispatch({
        type: 'home/SET_STATE',
        payload: {
          hasCart: false,
          cart: undefined,
          newAddressAdded: false,
          refreshRecentOrder: true,
          cartOrderPlaced: true,
          paymentSignatureFailed: true
        },
      });
    }
  }

  componentDidMount() {
    const {userPreferences} = this.props.login;
    let userId = userPreferences && userPreferences.uid;
    this.props.onChangeFieldLogin('currentScreen', 'CartDetail');
    this.props.onGetWidgets(true, true, 'CartDetail', userId, () => {});
    let findFreeGiftTag = false;
    this.props.offerList && this.props.offerList.forEach(element => {
      if(element.tag == 'ShopgLive_freegift') {
        findFreeGiftTag = true;
      }
    });
    if(!findFreeGiftTag)
      this.props.getOffersListInBulk('ShopgLive_freegift', 1, 5);
    
    SetScreenName(Events.LOAD_CART_DETAILS.eventName());
    LogFBEvent(Events.LOAD_CART_DETAILS, null);
    if (this.props.cart && Object.keys(this.props.cart).length == 0) {
      this.props.getCart();
    }
    const { user } = this.props.userProfile;
    this.props.dispatch({
      type: 'booking/SET_STATE',
      payload: {addressName: ((user && user.name) ? user.name : '')},
    });
    this.props.dispatch({
      type: 'booking/GET_ENTITY_DETAILS',
      data: {entityId: essentialEntityId, entityType: 'entity_tags'},
    });
  }

  componentDidUpdate = prevProps => {
    const {dispatch, login, showSearchModal,localityData, addressUpdated, cartPageWidgets} = this.props;
    let tags = '';
    let isWidgetPresent = null;
    if (cartPageWidgets.length > 0 && cartPageWidgets.length !== prevProps.cartPageWidgets.length) {
      cartPageWidgets.map(widgets => {
       isWidgetPresent = widgets.data.page.find(element => element === 'CartDetail');
        if (isWidgetPresent) {
          // this.setState({
          //   isWidgetPresent: true
          // })
          if(widgets.data.widgetType == 'bannerRelevance') {
            tags += `${item.data.widgetData.bannerJson['english'][0].tags[0].slug},`;
          }else if(specialCaseWidgets.includes(widgets.data.widgetType)){
            //do nothing
          }else 
            tags += `${widgets.data.widgetData.tags[0].slug},`;
        }
      })

      if (tags) {
        tags = tags.substring(0, tags.length - 1);
        this.props.getOffersListInBulk(tags, 1, 5);
      }
    }

    if (this.props.newAddressAdded && this.state.addressAdded) {
      const pinCode = this.props.addressField.pinCode;
      this.setState({
        addressAdded: false,
        currentTab: 0,
        pincodeselected: pinCode
      });
      this.confirmBooking()
    } 
    
    if((showSearchModal && localityData.length==0) || addressUpdated){
      dispatch({
        type: 'booking/SET_STATE',
        payload: {
          showSearchModal: false,
        },
      });
      this.confirmBooking()
    } 
    
    // if(this.props.cartDetails.isCartValid) {
    //   this.confirmBooking()
    // }

    if (
      this.props.cart &&
      this.props.cartOrderDetails &&
      this.props.cartOrderDetails.length > 0 &&
      !this.props.entityDetailsApiLoading &&
      (Object.keys(this.props.entityDetails).length === 0 ||
        (Object.keys(prevProps.entityDetails).length > 0 &&
          prevProps.entityDetails.detail.id !==
            this.props.cart.cartOrderDetails[0].offerId))
    ) {
      dispatch({
        type: 'booking/GET_ENTITY_DETAILS',
        data: {
          entityId: this.props.cart.cartOrderDetails[0].offerId,
          entityType: 'offers',
        },
      });
    }
  };

  onChangeTab = tab => {
    this.setState({
      currentTab: tab,
    });
  };

  onCheck = () => {
    this.setState({
      checked: !this.state.checked,
    })
  };

  toggleTooltip = () => {
    this.setState({
      isTooltipVisible: !this.state.isTooltipVisible
    })
  }

  changePaymentOption = (paymentMode) => {
    // add event here
    LogFBEvent(Events.PAYMENT_SELECTOR, {
      cartId: this.props.cart.id,
      paymentMode:paymentMode
    });
    this.setState({
      paymentMode: paymentMode
    })
  }

  checkFreeShipping = () => {
    const {cart} = this.props;
    const shippingCharges = idx(cart, _ => _.billing.shippingCharges) || 0;
    if(shippingCharges && shippingCharges > 0){
      this.setState({isFreeShipping:true})
    } else {
      this.onPlaceOrderPress();
    }
  }
  
  onPressConfirmToPay = () => {
    this.setState({isFreeShipping:false})
    this.onPlaceOrderPress();
    LogFBEvent(Events.AGREE_TO_PAY_DELIVERY_CHARGES, {
      cartId: this.props.cart.id,
      userId: this.props.login.userPreferences.uid,
    });
  }

  onPressShopMore = () => {
    this.setState({isFreeShipping:false})
    LogFBEvent(Events.AGREE_TO_SHOP_MORE, {
      cartId: this.props.cart.id,
      userId: this.props.login.userPreferences.uid,
    });
    NavigationService.navigate('Home');
  }

  onPlaceOrderPress = () => {

    let useCheck = this.props.address && this.props.address.length>0
    let userId = useCheck ? this.props.address[0].userId : 0;
    let addressType = useCheck ? this.props.address[0].addressType : '';

    const {login} = this.props;
    let clAddressCheck =
      login &&
      login.userPreferences &&
      login.userPreferences.uid != userId &&
      addressType &&
      addressType == 'CL';

    const { user } = this.props.userProfile;
    const { address,addressName } = this.props;
    const userCheck = (!user || !user.name || user.name =='');
    const addressCheck = (!addressName || addressName=='');

    if(!this.state.currentTab && Object.keys(address).length && clAddressCheck && userCheck && addressCheck){
      showToastr(this.props.t('Please add your name'));
    } else {
      this.confirmBooking()
    }
  }

  closeModal = () => {
    this.props.dispatch({
      type: 'booking/SET_STATE',
      payload: {
        showSearchModal: false,
      },
    });
  };

  onSearch = val => {
    const {localityData} = this.props;
    if (val && val != '') {
      let _friendsArray = [];
      if (localityData && localityData.length > 0) {
        localityData.map(el => {
          if (el.areaName.toUpperCase().includes(val.toUpperCase())) {
            _friendsArray.push(el);
          }
        });

        if (_friendsArray && _friendsArray.length > 0) {
          this.setState({stateLocalityData:_friendsArray})
        }
      }
    } else {
      // selectedSizeIndex(-1)
      this.setState({stateLocalityData:localityData})
    }
  };

  onSelectLocality = (index, item, onClick) => {
    onClick();
    const {activeAddress} = this.props;
    // showToastr("activeAddress "+activeAddress.id+" item "+item.id)
    this.props.dispatch({
      type: 'booking/SET_STATE',
      payload: {selectedLocality: item},
    });
    this.props.updateAddress(activeAddress.id);
  };

  render() {
    const {
      t,
      cart,
      hasCart,
      loadingCart,
      loadingAddToCart,
      cartOrderPlaced,
      entityDetails,
      cartDetails,
      essentialEntityDetails,
      showSearchModal,
      localityData,
      loadingPayments,
    } = this.props;
    const { paymentError,paymentMode,stateLocalityData, isWidgetPresent,isFreeShipping} = this.state;

    if(paymentError){
      return (
        <View style={{flex: 1, padding:widthPercentageToDP(5), alignItems: 'center', justifyContent: 'center'}}>
          <AppText size="L" bold black style={{ textAlign: 'center'}}>
            {t('We have not received payment, Your order is converted into COD.')}
          </AppText>
          <View style={styles.emptyView}/>
          <View style={styles.confirmButton}>
            <LinearGradientButton
              cartButton={false}
              btnStyles={{
                flexDirection: 'row',
                backgroundColor: Constants.primaryColor,
                borderColor: 'white',
              }}
              titleStyle={{color: 'white'}}
              colors={['#fdc001', '#fd7400']}
              title={t('VIEW ORDER')}
              onPress={() => NavigationService.navigate('OrderConfirmation')}
            />
          </View>
        </View>
      );
    }

    if(loadingPayments){
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <AppText size="L" bold black>
            {t('Processing Payments ... ')}
          </AppText>
          <View style={styles.emptyView}/>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    if (cartOrderPlaced) return null;
    if (loadingCart || (!hasCart && loadingAddToCart)) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <AppText size="L" bold black>
            {t('Processing Cart Order ... ')}
          </AppText>
          <View style={styles.emptyView}/>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    if (!hasCart) {
      return (
        <TouchableOpacity
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          onPress={() => NavigationService.navigate('Home')}>
          <AppText size="XXL" bold black>
            {t('Your cart is empty.')}
          </AppText>
          <AppText style={styles.clickHere} size="L" bold greenishBlue>
            {t('Shop more')}
          </AppText>
        </TouchableOpacity>
      );
    }
    
    const shippingCharges = idx(cart, _ => _.billing.shippingCharges) || 0;
    const cartError = idx(cartDetails, _=> _.cartError);
    const total =
      cart.billing.reward > 0 && this.state.checked
        ? cart.billing.totalPrice
        : cart.billing.totalPrice + cart.billing.reward;

    const hasOnlineDiscount = (cart && cart.billing && cart.billing.onlinePaymentsDiscount && cart.billing.onlinePaymentsDiscount > 0);

    const totalOnline = hasOnlineDiscount ? (total - cart.billing.onlinePaymentsDiscount) : total;

    const freeDelivery = cart.billing
      ? cart.billing.rewardRules &&
        cart.billing.rewardRules[0].reward_type == 'delivery_charges'
        ? cart.billing.rewardRules[0].amountPending
        : 0
      : 0;
    
      const amountNeeded = cart.billing
        ? cart.billing.rewardRules &&
          cart.billing.rewardRules[0].reward_type == 'delivery_charges'
          ? cart.billing.rewardRules[0].amountNeeded
          : 0
        : 0;

      const amountPendingCart = cart.billing
      ? cart.billing.rewardRules &&
        cart.billing.rewardRules[0].reward_type == 'delivery_charges'
        ? cart.billing.rewardRules[0].amountPendingCart
        : 400
      : 400;

      const cartFreeGiftAmountPending = cart.billing
      ? cart.billing.rewardRules &&
        cart.billing.rewardRules[1].reward_type == 'cart_free_gift'
        ? cart.billing.rewardRules[1].cartFreeGiftAmountPending
        : 0
      : 0;
      if(!titleChanged){
        freeGiftWidgetData.widgetData.title += amountNeeded;
        titleChanged = true;
      }
      
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {/* <LocationComponent page={"CART DETAIL"} shouldAskPermission={true}/> */}
        <Header 
          title={t('Your Cart Details')} 
          overrideBackHandler={true}
          handleBackButtonClick={this.handleBackButtonClick} />
        <View style={styles.container}>
          {shippingCharges > 0 ? (
            <View style={styles.yellowStripStyle}>
              <AppText size="S" black bold>
                {t('Add items worth ₹#FREESHIPPING# to get FREE delivery', {
                  FREESHIPPING: freeDelivery,
                })}
              </AppText>
            </View>
          ) : (
            <View />
          )}

          <Modal
            isVisible={showSearchModal && localityData && localityData.length>0}
            onBackdropPress={this.closeModal}
            onRequestClose={() => {
              this.closeModal();
            }}>
            <SearchModal
              noSearch={false}
              placeholderName={t('Select Nearest Locality')}
              data={(stateLocalityData && stateLocalityData.length && stateLocalityData.length>0) ? stateLocalityData : localityData}
              navigation={this.props.navigation}
              listComponent={({key, data, onClick}) => (
                <View style={{marginVertical:heightPercentageToDP(0.5)}}>
                  <FriendListComponent
                    index={key}
                    showText={data.areaName}
                    t={t}
                    onPress={() => this.onSelectLocality(key, data, onClick)}
                  />
                </View>

              )}
              onChange={this.props.onChange}
              primaryKey={this.props.primaryKey}
              multi={this.props.multi}
              onSearch={this.onSearch}
              closeModal={this.closeModal}
              fetchingData={this.props.fetchingData}
              renderFooter={this.props.renderFooter}
              showFilter={this.props.showFilter}
              filterComponent={this.props.filterComponent}
            />
          </Modal>

          <ScrollView
            ref={node => (this.scroll = node)}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}>
              <View>
              <View style={{ height: heightPercentageToDP(12), marginVertical: heightPercentageToDP(1)}}>
                <TrustMarker/>  
              </View>
              {/* <ShopgLive screenName="CartDetail" isCLMode={false}/> */}
              <Relevance itemData={freeGiftWidgetData.widgetData}
                widgetId={freeGiftWidgetData.id}
                page={'CartDetail'}
                index={0}
                listItemIndex={0}
                widgetType={'relevance'}/>
              </View>
              <View style={styles.cartItemtextStyle}>
                <AppText>{t('Cart Items')}</AppText>
            </View>
            <View>
              <View elevation={1} style={styles.itemDetailBox}>
                {hasCart && cart.cartOrderDetails ? (
                  <FlatList
                    data={cart.cartOrderDetails}
                    extraData={[cart.cartOrderDetails, cart.cartError]}
                    renderItem={({item, index, separators}) => (
                      <GroupOrderOverlay
                        item={item}
                        index={index}
                        withoutButton={true}
                        mediaJson={item.mediaJson}
                        isLast={false}
                        cartError={cartError}
                        showPriceTags={true}
                        showRewards={true}
                        showOrderStatus={false}
                        showBottomMenu={false}
                        showOrderId={false}
                        withoutTag
                        onItemClick={this.onItemClick}
                        showArrow={false}
                        screen="CartDetail"
                        withCounter={true}
                        quantity={item.quantity}
                        isStockOut={item.isStockOut}
                        removeActiveOpacity={true}
                        freeGiftBucket={amountPendingCart}
                        offerQuantity={item.offerQuantity}
                        purchasedQuantity={item.purchasedQuantity}
                        checkOutOfStock={item.checkOutOfStock}
                        dontShowWhatsapp={true}
                      />
                    )}
                  />
                ) : (
                  <View />
                )}
              </View>
              
              {cartFreeGiftAmountPending ? (cartFreeGiftAmountPending > 0) ? (
                  <View style={[styles.itemDetailBox, {paddingLeft: 0}]}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={styles.rectangeleView}><AppText size="S" white bold>{t(`Special Offer`)}</AppText></View>
                      <View style={styles.triangle}></View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={Images.freeGift} style={{ width: widthPercentageToDP(20), height: heightPercentageToDP(8), resizeMode: 'contain', paddingBottom: heightPercentageToDP(2)}}/>
                      <View style={{ flexDirection: 'column', marginTop: heightPercentageToDP(1) }}>
                        <AppText size="M">{t('2 plastic boxes, 180 ml & 350ml')}</AppText>
                        <View style={{ flexDirection: 'row' }}>
                        <AppText greenishBlue bold size="S">{t('FREE')}</AppText>
                        <AppText size="S" style={{ textDecorationLine: 'line-through', marginLeft: 20, color: '#989696' }}>₹249</AppText>
                        </View>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: widthPercentageToDP(7)}}>
                      <AppText size="M" bold greenishBlue>
                        {t('Add products for ₹#FREEGIFTAMOUNTPENDING# to get', {
                          FREEGIFTAMOUNTPENDING: cartFreeGiftAmountPending,
                        })}
                        <AppText size="M" bold greenishBlue>{t(' FREE ')}</AppText>
                        {t('gift')}
                      </AppText>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.itemDetailBox, {paddingLeft: 0}]}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={styles.rectangeleView}><AppText size="S" white bold>{t(`Special Offer`)}</AppText></View>
                      <View style={styles.triangle}></View>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: widthPercentageToDP(7)}}>
                      <AppText size="M" bold greenishBlue style={{ marginTop: heightPercentageToDP(1) }}>
                        {t('Congrats! You get free gift on delivery')}
                      </AppText>
                      
                      <Image source={Images.freeGift} style={{ width: widthPercentageToDP(12), height: heightPercentageToDP(5), resizeMode: 'contain', paddingBottom: heightPercentageToDP(2)}}/>
                    </View>
                    <AppText style={{ fontSize: 8, marginLeft: widthPercentageToDP(7) }}>{t('*Offer applicable once in 2 days')}</AppText>
                  </View>
              ): null}    
              <View elevation={1} style={styles.itemDetailBox}>
                {cart.billing.reward > 0 ? (
                  <View>
                    {this.state.isTooltipVisible ? <TouchableOpacity onPress={this.toggleTooltip}><View style={styles.toolTip}><AppText size="S" white>{t(`Max reward per order is ₹#MAXREWARDPERORDER#`, { NL: '\n', MAXREWARDPERORDER : cart.billing.reward})}</AppText></View></TouchableOpacity> : null}
                  <View style={styles.rewardsContainer}>
                    <CheckBox
                      containerStyle={{
                        backgroundColor: Colors.white,
                        borderWidth: 0,
                        padding: 2,
                      }}
                      checkedColor={Colors.orange}
                      title={t('Rewards')}
                      onPress={this.onCheck}
                      checked={this.state.checked}
                      textStyle={{color: Colors.orange}}
                    />
                    <AppText
                      greenishBlue
                      style={{
                        textAlign: 'right',
                        flex: 1,
                        fontSize: scaledSize(16),
                      }}>
                      ₹{cart.billing.reward}
                    </AppText>
                    <TouchableOpacity style={{ marginLeft: widthPercentageToDP(1)}} onPress={this.toggleTooltip}><Icons name={'information-outline'} size={20} color="#00a9a6" /></TouchableOpacity>
                  </View>
                  </View>
                ) : (
                  <View />
                )}

                <View>
                  <BookingTotalText
                    name={t('MRP')}
                    price={cart.billing.totalMRP}
                  />
                  <BookingTotalText
                    name={t('Offer')}
                    price={cart.billing.totalOfferPrice}
                  />

                  {cart.billing.reward > 0 && this.state.checked ? (
                    <BookingTotalText
                      name={t('Rewards')}
                      price={cart.billing.reward}
                      isRewards={true}
                    />
                  ) : null}

                  <View
                    style={{
                      borderBottomColor: '#DDDEDF',
                      borderBottomWidth: 1,
                      marginTop: heightPercentageToDP(1)
                    }}
                  />

                  {cart.billing.reward > 0 && this.state.checked ? <BookingTotalText
                    name={t('Total Offer Amount')}
                    price={cart.billing.totalPriceWithRewards}
                    saving={cart.billing.saving}
                  /> : null}


                  <BookingTotalText
                    name={t('Delivery Charges')}
                    price={cart.billing.shippingCharges}
                  />

                  {shippingCharges == 0 ? (
                    <AppText size="XS" bold style={styles.beetaTextStyle}>
                      {t('Enjoy free delivery !!')}
                    </AppText>
                  ) : (
                    <AppText size="XS" bold style={styles.gamaTextStyle}>
                      {t('Add ₹#FREESHIPPING# to get free delivery', {
                        FREESHIPPING: freeDelivery,
                      })}
                    </AppText>
                  )}

                  <BookingTotalText name={t('You Pay')} price={total} />
                </View>
              </View>
              <ReturnPolicy/>

              {essentialEntityDetails &&
              Object.keys(essentialEntityDetails).length > 0 ? (
                <SimilarProducts
                  entityDetails={essentialEntityDetails}
                  t={t}
                  isCart
                />
              ) : null}

              <View elevation={1} style={styles.itemDetailBox}>
                {this.props.addressListApiCompleted && (
                  <AddressTab
                    onChangeTab={this.onChangeTab}
                    scrollToEnd={this.scrollToEnd}
                    ref={this.tabComponent}
                    t={t}
                    parentComp={'CartDetail'}
                    payableAmount={total}
                    amountNeeded={amountNeeded}
                  />
                )}
              </View>
            </View>
            {entityDetails && Object.keys(entityDetails).length > 0 ? (
              <SimilarProducts entityDetails={entityDetails} t={t} isCart />
            ) : null}
          </ScrollView>
        </View>

        <View style={styles.place_order_toptext}>
          {shippingCharges == 0 ? (
            <AppText size="XS" bold style={styles.beetaTextStyle}>
              {t('Enjoy free delivery !!')}
            </AppText>
          ) : (
            <AppText size="XS" bold style={styles.gamaTextStyle}>
              {t('Add ₹#FREESHIPPING# to get free delivery', {
                FREESHIPPING: freeDelivery,
              })}
            </AppText>
          )}
        </View>
        <View style={styles.confirmButton}>

          <LinearGradientButton
            cartButton={false}
            btnStyles={{
              flexDirection: 'row',
            }}
            titleStyle={{color: 'white'}}
            colors={['#fdc001', '#fd7400']}
            title={t('PLACE ORDER')}
            onPress={this.checkFreeShipping}
          />
        </View>
        <RBSheet
          ref={ref => {
            this.PaymentSheet = ref;
          }}
          height={heightPercentageToDP(46)}
          duration={150}
          closeOnDragDown={true}
          closeOnPressMask={true}
          closeOnPressBack={true}
          onClose={this.handleClosePaymentSheet}
          customStyles={{
            container: {
              // alignItems: 'center',
              padding: 10,
              borderRadius: 10,
            },
          }}>
          <View>
            <AppText size="XL" black bold>{t('Payment Option')}</AppText>
            <TouchableOpacity>
              <View style={{ marginTop: heightPercentageToDP(2)}}>
                <TouchableOpacity onPress={() => this.changePaymentOption('ONLINE')}>
                  <View style={{paddingVertical: widthPercentageToDP(3), paddingHorizontal: widthPercentageToDP(3)}}>
                    <View style={{ flexDirection: 'row'}}>
                      <View style={{ flexDirection: 'row',flex:0.8}}>
                        <Image source={Images.online} style={{width: 25, height: 25 }} />
                        <AppText size="L" green bold style={{ marginLeft: widthPercentageToDP(5)}}>{t('Pay Online')}</AppText>
                        {paymentMode == 'ONLINE' && (
                          <View style={styles.iconView}>
                            <Image source={Images.selected} style={styles.icon} />
                          </View>
                        )}
                      </View>
                      <View style={{ flexDirection: 'row',flex:0.2}}>
                        <AppText size="M" green bold style={{ marginLeft: widthPercentageToDP(5)}}>{t('₹'+totalOnline)}</AppText>
                      </View>
                      
                    </View>
                    {
                      (hasOnlineDiscount)
                      ?
                      <View style={{ flexDirection: 'row'}}>
                        <View style={{width: 25, height: 25 }} />
                        <AppText size="S" red bold style={{ marginLeft: widthPercentageToDP(5)}}>{t('Pay Online and get ₹#DISCOUNT# discount',{DISCOUNT:cart.billing.onlinePaymentsDiscount})}</AppText>
                      </View>
                      : 
                      <View />
                    }
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.changePaymentOption('COD')}>
                  <View style={{ flexDirection: 'row', paddingVertical: widthPercentageToDP(3), paddingHorizontal: widthPercentageToDP(3) }}>
                    <View style={{ flexDirection: 'row',flex:0.8}}>
                      <Image source={Images.cash} style={{width: 25, height: 25 }} />
                      <AppText size="L" black bold style={{ marginLeft: widthPercentageToDP(5)}}>{t('Pay on delivery')}</AppText>
                      {paymentMode == 'COD' && (
                      <View style={styles.iconView}>
                        <Image source={Images.selected} style={styles.icon} />
                      </View>
                      )}
                      </View>
                      <View style={{ flexDirection: 'row',flex:0.2}}>
                      <AppText size="M" black bold style={{ marginLeft: widthPercentageToDP(5)}}>{t('₹'+total)}</AppText>
                      </View>
                  </View>
                </TouchableOpacity>
              </View>
                <View style={styles.confirmButton}>
                  <LinearGradientButton
                    cartButton={false}
                    btnStyles={{
                      flexDirection: 'row',
                    }}
                    titleStyle={{color: 'white'}}
                    colors={['#fdc001', '#fd7400']}
                    title={t('CONFIRM')}
                    onPress={this.onPressPayment}
                  />
              </View>
            </TouchableOpacity>
          </View>
        </RBSheet> 
        
        <Modal
          isVisible={isFreeShipping}
          onBackdropPress={() => { this.setState({ isFreeShipping:false })} }
          onBackButtonPress={() => { this.setState({ isFreeShipping:false })} }
          style={styles.modalStyle}
          animationType={'slide'}>
          <View style={styles.returnBoxContainer}>
            <AppText size="L" red bold style={{textAlign: 'center',marginBottom:widthPercentageToDP(2)}}>
              {t(
                `Delivery charges of ₹#SHIPPINGCHARGES# added to this cart`,{SHIPPINGCHARGES:shippingCharges}
              )}
            </AppText>
            <AppText size="L" bold greenishBlue >
                {t('Add items worth ₹#FREESHIPPING# to get FREE delivery', {
                  FREESHIPPING: freeDelivery,
                })}
              </AppText>
            <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.onPressShopMore} style={styles.buttonBG}>
                <AppText bold white size="S" style={{textAlign: 'center'}}>
                    {t(
                      `Shop more`
                    )}
                  </AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onPressConfirmToPay} style={[styles.buttonBG,{backgroundColor:Constants.lightFadedGrey,flex:2}]}>
                <AppText bold white size="S" style={{textAlign: 'center'}}>
                    {t(
                      `Pay ₹#DELIVERYCHARGES# delivery charges`,{DELIVERYCHARGES:shippingCharges}
                    )}
                  </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.screenbackground,
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
  itemDetailBox: {
    flexDirection: 'column',
    padding: scaledSize(5),
    marginLeft: scaledSize(5),
    marginRight: scaledSize(5),
    marginTop: scaledSize(5),
    backgroundColor: 'white',
    alignSelf: 'baseline',
    width: widthPercentageToDP(97),
  },
  rewardsContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  beetaTextStyle: {
    color: Colors.blue,
  },
  gamaTextStyle: {
    color: Colors.darkOrange,
  },
  cartItemtextStyle: {
    paddingBottom: heightPercentageToDP(1), 
    paddingTop: heightPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(2)
  },
  clickHere: {
    paddingHorizontal: widthPercentageToDP(1),
    height: heightPercentageToDP(5),
    lineHeight: heightPercentageToDP(5),
    textAlign: 'center',
    alignSelf: 'center',
    borderRadius: scaledSize(6),
    borderWidth: scaledSize(1),
    borderColor: Constants.greenishBlue,
  },
  yellowStripStyle: {
    backgroundColor: Colors.yellowStrip,
    height: heightPercentageToDP(6),
    padding: scaledSize(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangeleView: {
    backgroundColor: Constants.secondaryColor,
    width: 100,
    height: 20,
    padding: scaledSize(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 20,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: Constants.secondaryColor
  },
  toolTip: {
    width: widthPercentageToDP(60),
    marginLeft: widthPercentageToDP(40),
    padding: heightPercentageToDP(1),
    marginRight: widthPercentageToDP(2),
    borderRadius: widthPercentageToDP(1),
    borderWidth: scaledSize(0.5),
    borderColor: '#303030',
    backgroundColor: '#303030',
    alignSelf: 'flex-end'
  },
  iconView: {
    alignItems: 'center',
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginLeft: 20,
  },
  modalStyle: {
    flex: 0.5,
    top: heightPercentageToDP(25),
  },
  returnBoxContainer: {
    backgroundColor: Constants.white,
    padding: widthPercentageToDP(2),
    borderRadius:widthPercentageToDP(1)
  },
  buttonContainer:{
    flexDirection: 'row',
    marginTop:widthPercentageToDP(2)
  },
  buttonBG:{
    backgroundColor:Constants.greenishBlue,
    borderRadius:widthPercentageToDP(0.8),
    alignItems:'center',
    justifyContent:'center',
    height:heightPercentageToDP(6),
    flex:1,
    marginHorizontal:widthPercentageToDP(0.4)
  },
  place_order_toptext:{
    marginLeft:widthPercentageToDP(2),
    marginTop:widthPercentageToDP(2),
    alignItems:'center',
    justifyContent:'center'
  },
  emptyView:{
    height:heightPercentageToDP(1),
    width:widthPercentageToDP(100)
  }
});

const mapStateToProps = state => ({
  item: state.orderDetail.item,
  login: state.login,
  offerList: state.ShopgLive.liveOfferList,
  cartPageWidgets: state.ShopgLive.cartPageWidgets,
  fetchingData:state.ShopgLive.fetchingData,
  groupSummary: state.groupSummary,
  rewards: state.rewards.rewards,
  addressListApiCompleted: state.booking.addressListApiCompleted,
  activeAddress: state.booking.selectedAddress,
  booking: state.booking.booking,
  addressField: state.booking.addressField,
  essentialEntityDetails: state.booking.essentialEntityDetails,
  showSearchModal: state.booking.showSearchModal,
  entityDetails: state.booking.entityDetails,
  entityDetailsApiLoading: state.booking.entityDetailsApiLoading,
  cart: state.home.cart,
  cartOrderPlaced: state.home.cartOrderPlaced,
  totalCartItems: state.home.totalCartItems,
  hasCart: state.home.hasCart,
  newAddressAdded: state.booking.newAddressAdded,
  loadingCart: state.home.loadingCart,
  loadingAddToCart: state.home.loadingAddToCart,
  loadingPayments: state.home.loadingPayments,
  address: state.booking.address,
  selectedLocality:state.booking.selectedLocality,
  addressLoading: state.booking.isLoading,
  addressName: state.booking.addressName,
  cartDetails: state.cartDetails,
  userProfile: state.userProfile,
  localityData:state.booking.localityData,
  addressUpdated:state.booking.addressUpdated,
  launchEventDetails:state.login.launchEventDetails,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
  onChangeFieldLogin: (fieldName: string, value: any) => {
    dispatch(changeFieldLogin(fieldName, value));
  },
  onPlaceOrder: (
    cartId, 
    useRewards, 
    addressId, 
    name, 
    paymentMode, 
    totalPrice,  
    numberOfOrders,
    listofCategories, 
    source, 
    medium,
    callback) => {
    dispatch(PlaceOrder(
      cartId, 
      useRewards, 
      addressId, 
      name, 
      paymentMode, 
      totalPrice, 
      numberOfOrders,
      listofCategories, 
      source, 
      medium,
      callback));
  },
  verifyPayment: (
    cartId,
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature) => {
    dispatch(verifyPayment(
      cartId,
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature));
  },
  onInitiatePayment: (obj,callback) => {
    dispatch(initiatePayment(obj,callback));
  },
  onValidatePayment: (obj) => {
    dispatch(validatePayment(obj));
  },
  onValidateCart: (pincode, cartId,callback) => {
    dispatch(validateCart({pincode, cartId,callback}));
  },
  getCart: () => {
    dispatch(GetCart());
  },
  onGetWidgets: (isPublic, isPrivate, page, userId, callback) => {
    dispatch(getWidgets(isPublic, isPrivate, page, userId, callback));
},
  isPinValid: (pin, offerId,fromAddress) => {
    dispatch(CHECK_PIN(pin, offerId,fromAddress));
  },
  updateAddress: (addressID) => {
    dispatch(UPDATE_ADDRESS({addressID}));
  },
  getOffersListInBulk: (tags,page,size) => {
    dispatch(getLiveOfferListInBulk(tags,page,size));
  },
});

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CartDetail)
);