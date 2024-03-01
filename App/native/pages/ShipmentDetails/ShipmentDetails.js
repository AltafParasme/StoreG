import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TextInput,
  Image,
  BackHandler,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import {CheckBox} from 'react-native-elements';
import {connect} from 'react-redux';
import idx from 'idx';
import {Button} from 'react-native-elements';
import moment from 'moment';
import NavigationService from '../../../utils/NavigationService';
import {Constants} from '../../../styles';
import {Header} from '../../../components/Header/Header';
import {Support} from '../../../components/Support/Support';
import ShippingListItem from '../ShippingList/component/ShippingListItem';
import {AddressDetail} from '../../../components/AddressDetail/AddressDetail';
import GroupOrderOverlay from '../OrderConfirmation/Component/GroupOrderOverlay';
import {getOrderDetails} from '../PastOrders/actions';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  scaledSize,
} from '../../../utils';
import ShipmentEarnings from './ShipmentEarnings';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import {
  GetShippingDetails,
  SetDelivered,
  returnShipment,
  GetShippingList,
} from '../ShippingList/redux/actions';
import BookingTotalText from '../Booking/Component/BookingTotalText';
import {showToastr} from '../utils';
import {AppText} from '../../../components/Texts';
import {CancelButton} from '../../../components/Button/CancelButton';
import RadioButton from '../../../components/RadioButton/RadioButton';
import CustomerFeedBack from '../../../components/LiveComponents/CustomerFeedBack';
import {feedbackWidgetData} from './Constants';

class ShipmentDetails extends Component {
  constructor() {
    super();
    this.state = {
      listItem: '',
      showMarkDeliver: false,
      deliveryOtpValue: 0,
      deliveryPin: 0,
      isModalVisible: false,
      returnReason: null,
      apiForEarnings: null,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.onPressReturn = this.onPressReturn.bind(this);
    this.onHandler = this.onHandler.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentDidMount() {
    const {t, navigation, selectedShipping, groupShippingDetail} = this.props;
    const actionId = navigation.getParam('actionId');
    let shipmentID = actionId || selectedShipping.shipmentId;
    if (!actionId && groupShippingDetail)
      this.setState({showMarkDeliver: selectedShipping.showButton});

    if (actionId) {
      this.props.getShippingList(
        1,
        undefined,
        shipmentID,
        undefined,
        false,
        true
      );
    } else {
      this.setState({
        listItem: selectedShipping,
        deliveryPin: selectedShipping.pinNumber,
      });
    }

    this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
      this.props.getShippingDetails(shipmentID);

      LogFBEvent(Events.SHIPPING_LIST_ITEM_CLICK, {
        shipmentId: shipmentID,
      });
    });

    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        fromShippingList: false,
      },
    });

    SetScreenName(Events.LOAD_SHIPPING_DETAILS_SCREEN.eventName());
    LogFBEvent(Events.LOAD_SHIPPING_DETAILS_SCREEN, null);
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    this._unsubscribe.remove();
    dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        markDeliver: null,
      },
    });
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
    return true;
  }

  handleBackButtonClick = () => {
    NavigationService.navigate('MyOrderBusinessCheckout');
    return true;
  };

  onItemClick = item => {
    this.props.onGetOrderDetails({id: item.orderid});
  };

  markDeliver = () => {
    // if (this.state.deliveryOtpValue == 0) {
    //   showToastr('Please enter delivery pin');
    // } else if (this.state.deliveryOtpValue.length < 4) {
    //   showToastr('Please enter valid pin');
    // } else {
    //   this.props.setDelivered(
    //     this.state.listItem.shipmentId,
    //     this.state.deliveryOtpValue
    //   );
    // }
    this.props.setDelivered(
      this.state.listItem.shipmentId,
      this.state.deliveryOtpValue
    );
  };

  handleChange = value => {
    this.setState({
      deliveryOtpValue: value,
    });
  };

  onHandler = value => {
    this.setState({
      returnReason: value,
    });
  };

  onPressReturn = () => {
    this.toggleModal();
    this.props.returnShipment(
      this.state.listItem.shipmentId,
      this.state.returnReason
    );
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  render() {
    if (
      this.props.loading ||
      !this.props.detail ||
      Object.keys(this.props.detail).length == 0
    ) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    const {t, detail, ShippingList, detailsListItem} = this.props;

    let earningDetails =
      detail.shipmentDetails && detail.shipmentDetails.earningDetals;
    const {listItem, showMarkDeliver, deliveryPin, isModalVisible} = this.state;
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    const userId = idx(this.props.login, _ => _.userPreferences.uid);
    const addressItem = {deliveryAddress: detail.list[0]};
    const returnReasons =
      detail.shipmentDetails && detail.shipmentDetails.shipmentReturnReason
        ? detail.shipmentDetails.shipmentReturnReason.map(item => {
            return {key: item, text: item};
          })
        : [];

    const isReturnRequestPlaced = ShippingList.returnShipment
      ? ShippingList.returnShipment.shipmentId ==
          detail.shipmentDetails.shipmentId &&
        ShippingList.returnShipment.success
      : false;
    let shippingDetail = undefined;
    let billing = undefined;
    if (
      detail.cart &&
      detail.cart != null &&
      Object.keys(detail.cart).length != 0
    ) {
      billing = detail.cart.billing ? detail.cart.billing : null;
    } else if (
      detail.shipmentDetails &&
      Object.keys(detail.shipmentDetails).length != 0
    ) {
      billing = detail.shipmentDetails;
    }
    if (billing) {
      shippingDetail = {
        mrp: billing.totalMRP,
        rewards: billing.reward,
        shipping_charges:
          billing.shippingCharges == '' ? 0 : billing.shippingCharges,
        totalToBePaid: billing.totalPrice,
        totalOfferPrice: billing.totalOfferPrice,
        saving: billing.saving,
      };
    }

    return (
      <View style={styles.container}>
        <Header
          t={t}
          handleBackButtonClick={this.handleBackButtonClick}
          overrideBackHandler={true}
          title={t('Shipping Details')}
          rightComponent={<Support t={t} userMode={userMode} />}
        />
        <ScrollView
          contentContainerStyle={{
            paddingTop: heightPercentageToDP(3),
            paddingBottom: heightPercentageToDP(3),
          }}>
          <ShippingListItem
            t={t}
            item={detailsListItem || listItem}
            showRightArrow={false}
            markDeliver={ShippingList.markDeliver}
            isReturnRequestPlaced={isReturnRequestPlaced}
          />

          {earningDetails ? (
            <ShipmentEarnings data={earningDetails} t={t} />
          ) : null}

          {/* mark deliver to client */}
          {showMarkDeliver && !ShippingList.markDeliver ? (
            <View>
              {/* <TextInput
                style={styles.inputStyle}
                value={this.state.deliveryOtpValue}
                placeholder={'Enter delivery otp'}
                keyboardType="numeric"
                placeholderTextColor="#B9BBBF"
                onChangeText={text => this.handleChange(text)}
                maxLength={4}
              /> */}
              <Button
                title="Mark Deliver"
                loading={this.props.ShippingList.markDeliverLoading}
                buttonStyle={{backgroundColor: Constants.primaryColor}}
                containerStyle={{
                  width: widthPercentageToDP(96),
                  alignSelf: 'center',
                  marginTop: heightPercentageToDP(2),
                }}
                onPress={this.markDeliver}
              />
            </View>
          ) : null}

          <AddressDetail item={addressItem} t={t} />
          {shippingDetail ? (
            <View style={styles.listWrapper}>
              <BookingTotalText name={t('MRP')} price={shippingDetail.mrp} />
              <BookingTotalText
                name={t('Offer')}
                price={shippingDetail.totalOfferPrice}
                saving={shippingDetail.saving}
              />
              <BookingTotalText
                name={t('Shipping Charges')}
                price={shippingDetail.shipping_charges}
              />
              <BookingTotalText
                name={t('Rewards')}
                price={shippingDetail.rewards}
              />
              <BookingTotalText
                name={t('You Pay')}
                price={shippingDetail.totalToBePaid}
              />
            </View>
          ) : null}

          <View style={styles.listWrapper}>
            <FlatList
              data={detail.list}
              extraData={isReturnRequestPlaced}
              renderItem={({item, index, separators}) => {
                const productData = {
                  price: item.transactionDetails.price,
                  offerId: item.offerId,
                  entityId: item.orderid,
                  imageUrl: item.mediaJson.square,
                  offerPrice: item.transactionDetails.offerPrice,
                  productName: {
                    text: item.mediaJson.title.text,
                  },
                };

                feedbackWidgetData.data.widgetData.productDetials.price =
                  item.transactionDetails.offerPrice;
                feedbackWidgetData.data.widgetData.productDetials.imageUrl =
                  item.mediaJson.square;
                feedbackWidgetData.data.widgetData.productDetials.offerPrice =
                  item.transactionDetails.offerPrice;
                feedbackWidgetData.data.widgetData.productDetials.productName = {
                  text: item.mediaJson.title.text,
                };

                let start = moment(item.createdAt);
                let end = moment(new Date().toISOString());
                let duration = moment.duration(end.diff(start));
                let daysDuration = Math.floor(duration.asDays());
                return (
                  <View>
                    <GroupOrderOverlay
                      t={t}
                      item={item}
                      index={index}
                      isGroupUnlocked={true}
                      withoutButton={true}
                      isLast={false}
                      showPriceTags={true}
                      showRewards={true}
                      showOrderStatus={true}
                      showBottomMenu={false}
                      showOrderId={true}
                      showQuantity={true}
                      mediaJson={item.mediaJson}
                      onItemClick={this.onItemClick}
                      screen="ShipmentDetail"
                      showArrow={true}
                      isReturnRequestPlaced={isReturnRequestPlaced}
                      dontShowWhatsapp={true}
                    />
                    {userId == item.userId &&
                    item.orderStatus === 'Order Delivered' &&
                    daysDuration <= 30 ? (
                      <CustomerFeedBack
                        userComponentData={productData}
                        itemData={feedbackWidgetData.data.widgetData}
                        widgetId={feedbackWidgetData.id}
                        productData={productData}
                        wuserId={feedbackWidgetData.data.wuserId}
                        page={'ShipmentDetails'}
                        index={0}
                        listItemIndex={0}
                        category={''}
                        widgetType={'customerFeedback'}
                        t={t}
                      />
                    ) : null}
                  </View>
                );
              }}
            />
          </View>

          {!isReturnRequestPlaced &&
          detail.shipmentDetails &&
          detail.shipmentDetails.showReturnBtn ? (
            <CancelButton
              label={t('Return Shipment')}
              onCancelPress={this.toggleModal}
            />
          ) : (
            <View />
          )}
        </ScrollView>
        {isModalVisible ? (
          <Modal
            isVisible={isModalVisible}
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
                  onPress={this.toggleModal}></Button>
              </View>
            </View>
          </Modal>
        ) : null}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.backgroundGrey,
  },
  listWrapper: {
    flexDirection: 'column',
    padding: scaledSize(5),
    marginLeft: scaledSize(5),
    marginRight: scaledSize(5),
    marginTop: scaledSize(5),
    backgroundColor: 'white',
    flexGrow: 1,
  },
  inputStyle: {
    borderColor: '#e3e3e3',
    borderBottomWidth: scaledSize(1),
    height: heightPercentageToDP(5),
    paddingTop: scaledSize(8),
    paddingRight: scaledSize(50),
    marginHorizontal: scaledSize(10),
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
  ShippingList: state.ShippingList,
  loading: state.ShippingList.loading,
  login: state.login,
  detail: state.ShippingList.detail,
  detailsListItem: state.ShippingList.detailsListItem,
  selectedShipping: state.ShippingList.selectedShipping,
  groupShippingDetail: state.ShippingList.groupShippingDetail,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  onGetOrderDetails: (obj: Object) => {
    dispatch(getOrderDetails(obj));
  },
  getShippingList: (
    page,
    status,
    shipmentId,
    awb,
    shouldShowLoading,
    callFromDetail
  ) => {
    dispatch(
      GetShippingList(
        page,
        status,
        shipmentId,
        awb,
        shouldShowLoading,
        callFromDetail
      )
    );
  },
  getShippingDetails: shipmentId => {
    dispatch(GetShippingDetails(shipmentId));
  },
  setDelivered: (shipmentId, otp) => {
    dispatch(SetDelivered(shipmentId, otp));
  },
  returnShipment: (shipmentId, returnReason) => {
    dispatch(returnShipment(shipmentId, returnReason));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ShipmentDetails)
);
