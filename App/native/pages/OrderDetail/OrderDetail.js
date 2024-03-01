import React, {Component} from 'react';
import {
  View,
  BackHandler,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Markdown from 'react-native-simple-markdown';
import Modal from 'react-native-modal';
import SimilarProducts from '../Booking/SimilarProducts';
import {changeField as changeFieldLogin} from '../Login/actions';
import {getWidgets} from '../Home/redux/action';
import {Button, Icon} from 'react-native-elements';
import Share from 'react-native-share';
import Tag from '../../../components/Tag/Tag';
import {Header} from '../../../components/Header/Header';
import {ShippingDetail} from './Component/ShippingDetail';
import {AddressDetail} from '../../../components/AddressDetail/AddressDetail';
import {Disclaimer} from '../../../components/Disclaimer/Disclaimer';
import {DialogBox} from '../../../components/DialogBox/DialogBox';
import {TimeLineSlider} from './Component/TimeLineSlider';
import {CancelButton} from '../../../components/Button/CancelButton';
import ListComponent from '../Home/component/ListComponent';
import {withTranslation} from 'react-i18next';
import {Colors, Fonts} from '../../../../assets/global';
import {connect} from 'react-redux';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import NavigationService from '../../../utils/NavigationService';
import {AppText} from '../../../components/Texts';
import GroupOrderOverlay from '../OrderConfirmation/Component/GroupOrderOverlay';
import {Constants} from '../../../styles';
import {OrderStatusTimeLine} from '../../../Constants';
import {cancelOrder, returnOrder, getOfferDetails} from '../PastOrders/actions';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Images} from '../../../../assets/images';
// import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import Booking from '../Booking/Booking';
import ShopgLive from '../ShopgLive';
import RadioButton from '../../../components/RadioButton/RadioButton';
import {
  scaledSize,
  AppWindow,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../utils';
import moment from 'moment';
import {shareToWhatsApp} from '../utils';
import {GetCart} from '../Home/redux/action';
import CustomerFeedBack from '../../../components/LiveComponents/CustomerFeedBack';
import {feedbackWidgetData} from '../ShipmentDetails/Constants';

class OrderDetail extends Component {
  constructor() {
    super();
    this.state = {
      item: '',
      hasSharedNotConfirmed: false,
      defaultItem: -1,
      isModalVisible: false,
      isReturnModalVisible: false,
      returnReason: null,
      cancelItem: false,
      returnItem: false,
      cartId: 0,
      shippingCharges: 0,
      minCartValue: 0,
    };
    this.RBSheet = null;
    this.handleOtherItemClick = this.handleOtherItemClick.bind(this);
    this.onHandler = this.onHandler.bind(this);
    this.toggleReturnModal = this.toggleReturnModal.bind(this);
    this.onPressReturn = this.onPressReturn.bind(this);
  }

  static navigationOptions = {
    header: 'Order Detail',
  };

  toggleReturnModal = () => {
    this.setState({isReturnModalVisible: !this.state.isReturnModalVisible});
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});

    if (this.state.cancelItem) {
      LogFBEvent(Events.ORDER_DETAIL_SCREEN_CANCEL_ORDER_HIDE_POPUP_NO, {
        orderId: this.state.item.id,
      });
    } else if (this.state.returnItem) {
      LogFBEvent(Events.ORDER_DETAIL_SCREEN_RETURN_ORDER_HIDE_POPUP_NO, {
        orderId: this.state.item.id,
      });
    }

    this.setState({cancelItem: false});
    this.setState({returnItem: false});
  };

  handleOtherItemClick = item => {
    LogFBEvent(Events.ORDERDETAILS_SIMILAR_ITEM_CLICK);
    this.props.onGetOfferDetails({id: item.id});
  };

  onHandler = value => {
    this.setState({
      returnReason: value,
    });
  };

  onPressReturn = () => {
    this.toggleReturnModal();
    const obj = {
      ...this.state.item,
      ...{returnReason: this.state.returnReason},
    };
    this.props.onReturnOrder(obj);
    LogFBEvent(Events.ORDER_DETAIL_SCREEN_RETURN_ORDER_HIDE_POPUP_YES, {
      orderId: this.state.item.id,
    });
  };

  handleModalClick = () => {
    if (this.state.cancelItem) {
      this.props.onCancelOrder(this.state.item);
      LogFBEvent(Events.ORDER_DETAIL_SCREEN_CANCEL_ORDER_HIDE_POPUP_YES, {
        orderId: this.state.item.id,
      });
    }
    this.toggleModal();
  };

  componentDidMount() {
    const {dispatch, navigation} = this.props;
    this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
      dispatch(changeFieldLogin('currentScreen', 'OrderDetail'));
    });
    const actionId = this.props.item.order.offerId;
    if (actionId) {
      dispatch({
        type: 'booking/GET_ENTITY_DETAILS',
        data: {entityId: actionId, entityType: 'offers'},
      });
    }
    if (this.props.item) {
      this.setState({item: this.props.item.order});
      this.setState({mediaJson: this.props.item.order.offerDetails.mediaJson});

      this.setState({cartId: this.props.item.cartId});

      let orderStatus =
        OrderStatusTimeLine[this.props.item.order.orderStatus] ||
        this.props.item.order.orderStatus;

      let initialSliderOptions = [
        {value: 0, status: 'Placed', label: 'Placed', date: ''},
        {value: 1, status: 'Confirmed', label: 'Confirmed', date: ''},
        {
          value: 2,
          status: 'Processing for Dispatch',
          label: 'Processing',
          date: '',
        },
        {value: 3, status: 'Shipped', label: 'Shipped', date: ''},
        {value: 4, status: 'Delivered', label: 'Delivery by', date: ''},
      ];

      initialSliderOptions[0]['date'] =
        this.props.item.order.OrderPlacedOn != null
          ? moment(this.props.item.order.OrderPlacedOn).format('Do MMM')
          : '';
      initialSliderOptions[4]['date'] =
        this.props.item.order.deliveryDate != null
          ? moment(this.props.item.order.deliveryDate).format('Do MMM')
          : '';

      if (orderStatus == 'Canceled') {
        let cancelSliderOptions = [
          {value: 0, label: 'Placed', date: ''},
          {value: 1, label: 'Canceled', date: ''},
        ];
        this.setState({defaultItem: 1});
        this.setState({sliderOptions: cancelSliderOptions});
      } else if (orderStatus == 'Return') {
        initialSliderOptions[4].label = 'Delivered';
        initialSliderOptions.push({value: 5, label: 'Return', date: ''});
        this.setState({defaultItem: 5});
        this.setState({sliderOptions: initialSliderOptions});
      } else if (orderStatus == 'Refund') {
        initialSliderOptions[4].label = 'Delivered';
        initialSliderOptions.push(
          {value: 5, label: 'Return', date: ''},
          {value: 6, label: 'Refund', date: ''}
        );
        this.setState({defaultItem: 6});
        this.setState({sliderOptions: initialSliderOptions});
      } else {
        if (orderStatus == 'Delivered') {
          initialSliderOptions[4].label = 'Delivered';
        }
        const found = initialSliderOptions.filter(function(item) {
          return item.status == orderStatus;
        });
        let index = found.length ? found[0].value : 0;
        this.setState({defaultItem: index});
        this.setState({sliderOptions: initialSliderOptions});
      }
    }

    const userId = this.props.login.userPreferences.uid;
    this.props.onGetWidgets(false, true, 'OrderDetail', userId, () => {});

    SetScreenName(Events.LOAD_ORDER_DETAIL_SCREEN.eventName());
    LogFBEvent(Events.LOAD_ORDER_DETAIL_SCREEN, null);
  }

  componentDidUpdate = () => {
    const {t, cancelOrderCart, refreshCancelOrder, dispatch} = this.props;
    if (refreshCancelOrder) {
      dispatch({
        type: 'home/SET_STATE',
        payload: {
          refreshCancelOrder: false,
        },
      });
      let amount =
        cancelOrderCart &&
        cancelOrderCart.billing &&
        cancelOrderCart.billing.shippingCharges
          ? cancelOrderCart.billing.shippingCharges
          : 0;
      const billing =
        cancelOrderCart && cancelOrderCart.billing
          ? cancelOrderCart.billing
          : undefined;
      const amountNeeded =
        cancelOrderCart && billing
          ? billing.rewardRules &&
            billing.rewardRules[0].reward_type == 'delivery_charges'
            ? billing.rewardRules[0].amountNeeded
            : 0
          : 0;

      let titleText = 'Are you sure, you want to cancel the order';
      if (amount > 0) {
        titleText =
          'Your total cart value reduces below #RS# #MINCARTVALUE# by canceling this order.#NL#Delivery charges of #RS# #SHIPPINGCHARGES# will be applicable on your cart order.#NL#Are you sure, you want to cancel the order';
        this.setState({shippingCharges: amount});
        this.setState({minCartValue: amountNeeded});
      }
      this.showCancelDialogBox(titleText);
    }
  };

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    this.props.dispatch(changeFieldLogin('currentScreen', null));
    this._unsubscribe.remove();
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    NavigationService.goBack();
    return true;
  }

  slidingComplete = itemSelected => {};

  onItemClick = item => {};

  onCancelPress = () => {
    const {cartId, item} = this.state;
    if (cartId && cartId != null && cartId != '' && cartId != 0)
      this.props.getCart(cartId, item.id);
    else this.showCancelDialogBox('Are you sure, you want to cancel the order');
  };

  showCancelDialogBox = titleText => {
    this.setState({isModalVisible: true});
    this.setState({cancelDialogTitle: titleText});
    this.setState({cancelItem: true});

    LogFBEvent(Events.ORDER_DETAIL_SCREEN_CANCEL_ORDER_SHOW_POPUP, {
      orderId: this.state.item.id,
    });
  };

  onReturnPress = () => {
    this.setState({isReturnModalVisible: true});
    this.setState({returnItem: true});

    LogFBEvent(Events.ORDER_DETAIL_SCREEN_RETURN_ORDER_SHOW_POPUP, {
      orderId: this.state.item.id,
    });
  };

  handleBottomAction = () => {
    this.RBSheet && this.RBSheet.open();
  };

  handleCloseBottomSheet = () => {
    this.RBSheet && this.RBSheet.close();
  };

  render() {
    const {t, item, groupSummary, entityDetails, rewards} = this.props;
    const {userPreferences} = this.props.login;
    const {isReturnModalVisible} = this.state;
    const language = this.props.i18n.language;
    const returnReasons = item.order.orderReturnReasons
      ? item.order.orderReturnReasons.map(item => {
          return {key: item, text: item};
        })
      : [];

    let eventProps = {
      offerId: item.id,
      type: 'ORDER_DETAIL',
      url:
        (item.mediaJson &&
          item.mediaJson.mainImage &&
          item.mediaJson.mainImage.url) ||
        '',
    };

    const productData = {
      price: item.order.transactionDetails.price,
      offerId: item.order.offerId,
      entityId: item.order.id,
      imageUrl: item.order.offerDetails.mediaJson.square,
      offerPrice: item.order.transactionDetails.offerPrice,
      productName: {
        text: item.order.offerDetails.mediaJson.title.text,
        localizations: item.order.offerDetails.mediaJson.title.localizations,
      },
      description: {
        text: item.order.offerDetails.mediaJson.description.text,
        localizations:
          item.order.offerDetails.mediaJson.description.localizations,
      },
    };

    feedbackWidgetData.data.widgetData.productDetials.price =
      item.order.transactionDetails.price;
    feedbackWidgetData.data.widgetData.productDetials.imageUrl =
      item.order.offerDetails.mediaJson.square;
    feedbackWidgetData.data.widgetData.productDetials.offerPrice =
      item.order.transactionDetails.offerPrice;
    feedbackWidgetData.data.widgetData.productDetials.productName = {
      text: item.order.offerDetails.mediaJson.title.text,
    };

    let start = moment(item.order.OrderPlacedOn);
    let end = moment(new Date().toISOString());
    let duration = moment.duration(end.diff(start));
    let daysDuration = Math.floor(duration.asDays());

    if (!item) {
      return null;
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'column'}}>
          <Header t={t} title={t('Your Order Details')} />
          <View style={styles.container}>
            <ScrollView
              contentContainerStyle={{paddingBottom: heightPercentageToDP(3)}}>
              <View elevation={1} style={styles.timelineStyle}>
                <TimeLineSlider
                  t={t}
                  ref="slider"
                  containerStyle={styles.snapsliderContainer}
                  style={styles.snapslider}
                  itemWrapperStyle={styles.snapsliderItemWrapper}
                  itemStyle={styles.sliderSubTitle}
                  items={this.state.sliderOptions}
                  labelPosition="bottom"
                  defaultItem={this.state.defaultItem}
                  onSlidingComplete={this.slidingComplete}
                />
              </View>
              {item.order &&
              item.order.orderStatus == 'Deal Locked' &&
              item.order.transactionDetails &&
              parseFloat(item.order.transactionDetails.offerPrice) == '0' ? (
                groupSummary &&
                groupSummary.groupDetails &&
                groupSummary.groupDetails.info.groupOfferId ===
                  item.order.groupOfferId ? (
                  <View style={styles.confirmationBox}>
                    <AppText red bold size="XL" style={{flex: 0.9}}>
                      {t(`To confirm, get 4 friends to join ShopG`)}
                    </AppText>
                    <TouchableOpacity
                      onPress={() =>
                        shareToWhatsApp(
                          'OrderDetail',
                          'FreeGift',
                          eventProps,
                          t,
                          rewards,
                          language,
                          groupSummary,
                          userPreferences,
                          (fragment = 'OrderDetail')
                        )
                      }>
                      <View style={styles.whatsappCircle}>
                        <Icon
                          type="font-awesome"
                          name="whatsapp"
                          color={Constants.white}
                          size={widthPercentageToDP(6)}
                          containerStyle={{
                            alignSelf: 'center',
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.confirmationBox}>
                    <AppText red bold size="L" style={{flex: 0.9}}>
                      {t(`Free gift offer expired`)}
                    </AppText>
                  </View>
                )
              ) : null
              // <ShippingDetail item={this.state.item} t={t} showHeader={true}/>
              }
              <View elevation={1} style={styles.itemDetailBox}>
                <AppText black bold size="L">
                  {t('Item Details')}
                </AppText>
                <GroupOrderOverlay
                  t={t}
                  item={this.state.item}
                  isGroupUnlocked={true}
                  withoutButton={true}
                  isLast={false}
                  showPriceTags={true}
                  showRewards={true}
                  showOrderStatus={true}
                  showBottomMenu={false}
                  showOrderId={true}
                  showQuantity={true}
                  mediaJson={this.state.mediaJson}
                  onItemClick={this.onItemClick}
                  screen="OrderDetail"
                  hasSharedNotConfirmed={this.state.hasSharedNotConfirmed}
                  removeActiveOpacity={true}
                />
              </View>

              {this.state.item.userId == userPreferences.uid &&
              (this.state.item.orderStatus === 'Deal Locked' ||
                this.state.item.orderStatus === 'Offer Unlocked') ? (
                <CancelButton
                  label={t('Cancel Order')}
                  onCancelPress={() => this.onCancelPress(this.state.item)}
                />
              ) : (
                <View />
              )}

              {this.state.item.showReturnBtn &&
              this.state.item.orderStatus === 'Order Delivered' ? (
                <CancelButton
                  label={t('Return Order')}
                  onCancelPress={() => this.toggleReturnModal(this.state.item)}
                />
              ) : (
                <View />
              )}
              {this.state.item.orderStatus === 'Order Delivered' &&
              daysDuration <= 30 ? (
                <View>
                  <CustomerFeedBack
                    userComponentData={productData}
                    itemData={feedbackWidgetData.data.widgetData}
                    widgetId={feedbackWidgetData.id}
                    productData={productData}
                    wuserId={feedbackWidgetData.data.wuserId}
                    page={'OrderDetail'}
                    index={0}
                    listItemIndex={0}
                    category={''}
                    widgetType={'customerFeedback'}
                    t={t}
                  />
                </View>
              ) : null}

              {Object.keys(entityDetails).length > 0 ? (
                <View elevation={1} style={styles.similarProductStyle}>
                  <SimilarProducts
                    pdpButton={true}
                    entityDetails={entityDetails}
                    t={t}
                    handleOtherItemClick={this.handleOtherItemClick}
                  />
                </View>
              ) : (
                <View />
              )}

              <DialogBox
                t={t}
                shippingCharges={this.state.shippingCharges}
                title={this.state.cancelDialogTitle}
                isVisible={this.state.isModalVisible}
                onBackButtonPress={this.toggleModal}
                cancelItem={this.state.cancelItem}
                handleModalClick={this.handleModalClick}
                toggleModal={this.toggleModal}
                minCartValue={this.state.minCartValue}
              />

              {isReturnModalVisible ? (
                <Modal
                  isVisible={isReturnModalVisible}
                  style={styles.modalStyle}
                  animationType={'slide'}>
                  <View style={styles.returnBoxContainer}>
                    <AppText size="L" style={{textAlign: 'center'}}>
                      {t(
                        `We would like to know reason for return to help us improve`
                      )}{' '}
                    </AppText>
                    <View style={{marginTop: heightPercentageToDP(1)}}>
                      <RadioButton
                        options={returnReasons}
                        value={this.state.returnReason}
                        onChange={this.onHandler}
                      />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Button
                        containerStyle={{marginHorizontal: 5, flex: 0.5}}
                        buttonStyle={{backgroundColor: Constants.primaryColor}}
                        title="Confirm"
                        onPress={this.onPressReturn}></Button>
                      <Button
                        containerStyle={{marginHorizontal: 5, flex: 0.5}}
                        buttonStyle={{backgroundColor: Constants.primaryColor}}
                        title="Cancel"
                        onPress={this.toggleReturnModal}></Button>
                    </View>
                  </View>
                </Modal>
              ) : null}
            </ScrollView>
          </View>

          <TouchableOpacity
            onPress={this.handleBottomAction}
            style={{flex: 0.08}}>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: scaledSize(22),
                marginTop: scaledSize(16),
                justifyContent: 'space-between',
              }}>
              <AppText size="M" bold secondaryColor>
                {t('Return & Cancellation Policy')}
              </AppText>
              <Icon
                type="font-awesome"
                name={'chevron-up'}
                size={20}
                color={Constants.secondaryColor}
                style={styles.upIconStyle}
              />
            </View>
          </TouchableOpacity>
          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={scaledSize(530)}
            duration={80}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderRadius: 10,
              },
            }}>
            <Disclaimer t={t} />
            <View style={styles.footer}>
              <AppText bold style={{textAlign: 'center'}}>
                © REYBHAV TECHNOLOGIES PRIVATE LIMITED.
              </AppText>
            </View>
          </RBSheet>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: Constants.screenbackground,
  },
  timelineStyle: {
    height: heightPercentageToDP(7),
    flexDirection: 'column',
    padding: scaledSize(5),
    marginLeft: scaledSize(5),
    marginRight: scaledSize(5),
    marginTop: scaledSize(5),
    backgroundColor: 'white',
  },
  similarProductStyle: {
    flexDirection: 'column',
    padding: scaledSize(5),
    marginLeft: scaledSize(5),
    marginRight: scaledSize(5),
    marginTop: scaledSize(5),
    backgroundColor: 'white',
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
  sliderSubTitle: {
    fontSize: scaledSize(8),
    fontWeight: 'bold',
    color: '#000000',
    marginTop: scaledSize(2),
    fontFamily: 'Roboto',
  },
  rbSheetView: {
    height: scaledSize(40),
    width: '85%',
    left: '7%',
    top: '7%',
  },
  upIconStyle: {
    //color: Constants.secondaryColor,
    //fontSize: scaledSize(25),
    right: '75%',
    marginRight: widthPercentageToDP(2),
  },
  confirmationBox: {
    padding: widthPercentageToDP(5),
    flexDirection: 'row',
  },
  buttonImage: {
    height: scaledSize(25),
    width: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
  whatsappCircle: {
    marginLeft: widthPercentageToDP(3),
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  },
  modalStyle: {
    flex: 0.5,
    top: heightPercentageToDP(25),
  },
  returnBoxContainer: {
    flex: 1,
    backgroundColor: Constants.white,
    padding: widthPercentageToDP(2),
  },
});

const mapStateToProps = state => ({
  item: state.orderDetail.item,
  groupSummary: state.groupSummary,
  login: state.login,
  rewards: state.rewards.rewards,
  entityDetails: state.booking.entityDetails,
  refreshCancelOrder: state.home.refreshCancelOrder,
  cancelOrderCart: state.home.cancelOrderCart,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  onCancelOrder: (obj: Object) => {
    dispatch(cancelOrder(obj));
  },
  onReturnOrder: (obj: Object) => {
    dispatch(returnOrder(obj));
  },
  onGetOfferDetails: (obj: Object) => {
    dispatch(getOfferDetails(obj));
  },
  getCart: (cartId, cancelOrderId) => {
    dispatch(GetCart(cartId, cancelOrderId));
  },
  onGetWidgets: (isPublic, isPrivate, page, userId, callback) => {
    dispatch(getWidgets(isPublic, isPrivate, page, userId, callback));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(OrderDetail)
);
