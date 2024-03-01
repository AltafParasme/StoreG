import React, {memo, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import Tag from '../../../../components/Tag/Tag';
import {Colors, Fonts} from '../../../../../assets/global';
import {liveAnalytics} from '../../ShopgLive/redux/actions';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
  isFreeGiftCategory,
} from '../../../../utils';
import Modal from 'react-native-modal';
import Button from '../../../../components/Button/Button';
import {withTranslation} from 'react-i18next';
import VideoModal from '../../../../components/VideoModal/VideoModal';
import {connect} from 'react-redux';
import QuantityCounter from '../../Booking/Component/QuantityCounter';
import {QUANTITY} from '../../Booking/redux/actions';
import {Images} from '../../../../../assets/images';
import OffTag from '../../../../components/Tag/OffTag';
import ImageModal from '../../../../components/ImageModal/ImageModal';
import {LogFBEvent, Events} from '../../../../Events';
import {getOrderStatus, getOrderStatusColor} from '../../utils';
import {AppText} from '../../../../components/Texts';
import ViewMoreText from 'react-native-view-more-text';
import {Constants} from '../../../../styles';
import {listOfNegativeOrderStatus} from '../../../../Constants';
import {AppConstants} from '../../../../Constants';
import {Icon} from 'react-native-elements';
import {shareOfferOnWhatsApp, getPaymentMode, isIncluded} from '../../utils';
import idx from 'idx';
import CustomerReview from '../../Home/actionview/CustomerReview';
import {processTextAndAppendElipsis} from '../../../../utils/misc';

import moment from 'moment';
const SimpleLine = () => (
  <View style={styles.lineMainView}>
    <View style={styles.lineView} />
  </View>
);

const BUTTONS = ['View Offer', 'Cancel Order'];
const BUTTON = ['View Offer'];
const DESTRUCTIVE_INDEX = 3;
const CANCEL_INDEX = 2;

const GroupOrderOverlay = ({
  item,
  mediaJson,
  quantity,
  t,
  screen,
  onGetOfferDetails,
  onCancelOrder,
  showPriceTags,
  showRewards,
  showOrderStatus,
  showBottomMenu,
  showOrderId,
  showName,
  onItemClick,
  index,
  showArrow,
  isGroupUnlocked = false,
  withCounter,
  onAnalytics,
  rewards,
  language,
  groupSummary,
  userPreference,
  removeActiveOpacity,
  dontShowWhatsapp,
  user,
  showQuantity,
  freeGiftBucket,
  offerQuantity,
  purchasedQuantity,
  checkOutOfStock,
  cartError,
  isReturnRequestPlaced,
  clMediumLogoImage
}) => {
  let stockValue = -1;
  if (!isNaN(offerQuantity) && !isNaN(purchasedQuantity) && checkOutOfStock) {
    stockValue = offerQuantity - purchasedQuantity;
  }

  let coinsUsed = item.coinsUsed ? item.coinsUsed : null;
  let cashback = idx(item.categoryFeatures, _ => _.cashback);
  let component = 'Group Order Overlay';
  let eventProps = {
    offerId: item.offerId,
    page: screen,
    position: index,
    sharedBy: user.userMode,
    component: component,
  };

  const isFreeGiftCategoryItem = isFreeGiftCategory(item);
  if (!item || (isFreeGiftCategoryItem && screen === 'OrderConfirmation'))
    return null;
  const [isFeedbackOn, setFeedbackOn] = useState(false);
  const paymentMode = t(getPaymentMode(item.paymentMode));
  const status = getOrderStatus(item.orderStatus);
  const statusColor = getOrderStatusColor(item.orderStatus);
  const orderStatus = isReturnRequestPlaced ? 'Order Returned' : status;
  let paymentStatus =
    item.paymentDetails && item.paymentDetails.paymentStatus
      ? item.paymentDetails.paymentStatus
      : '';

  if (
    isIncluded(listOfNegativeOrderStatus, orderStatus) &&
    paymentMode == 'Online' &&
    paymentStatus == 'SUCCESSFUL'
  ) {
    if (item.refundStatus && item.refundStatus == 'SUCCESSFUL') {
      paymentStatus = 'refund_processed';
    } else {
      paymentStatus = 'refund_initiated';
    }
  }
  const orderid = item.orderid || item.id;
  let mrpAmount =
    item.mrpamount ||
    (item.transactionDetails && item.transactionDetails.price) ||
    (item.offerinvocations && item.offerinvocations.price);
  mrpAmount = quantity
    ? quantity * mrpAmount
    : item.quantity
    ? item.quantity * mrpAmount
    : mrpAmount;
  let sellingPrice =
    item.totalPrice ||
    (item.transactionDetails && item.transactionDetails.offerPrice) ||
    (item.offerinvocations && item.offerinvocations.offerPrice);
  sellingPrice = quantity ? quantity * sellingPrice : sellingPrice;

  const statusMsg = item.statusMsg;
  const userName = item.userName || item.contactNumber || '';
  const productSize = item.size
    ? item.size
    : item.offerDetails
    ? item.offerDetails.size
    : '';

  const shareOffer = () => {
    let userPrefData = {
      userId: user.uid,
      sid: user.sid,
    };
    shareOfferOnWhatsApp(
      clMediumLogoImage,
      screen,
      'GroupOrderOverlay',
      t,
      groupSummary,
      item,
      eventProps,
      'GroupOrderOverlay',
      coinsUsed,
      userPrefData
    );
    onAnalytics(
      Events.SHARE_OFFER_WHATSAPP_CLICK.eventName(),
      eventProps,
      userPrefData
    );
  };

  const handler = nextState => {
    setFeedbackOn(nextState);
  };

  let error;
  if (cartError && Object.keys(cartError).length > 0) {
    cartError.forEach(element => {
      if (item.id === element.entityId) {
        error = element.message;
        return;
      }
    });
  }

  return (
    <TouchableOpacity
      activeOpacity={removeActiveOpacity ? 1 : 0.2}
      style={{
        backgroundColor: Constants.white,
        color: Constants.black,
        width: '100%',
        borderWidth: scaledSize(0.5),
        borderColor: '#f9f9f9',
        borderRadius: scaledSize(20),
      }}
      onPress={() => (onItemClick ? onItemClick(item, index) : null)}>
      <View
        elevation={screen === 'OrderDetail' ? 0 : 1}
        style={{
          marginVertical: heightPercentageToDP(1),
        }}>
        <View style={styles.container}>
          <View style={styles.subView}>
            <View style={styles.viewInside}>
              <View style={styles.imageView}>
                {mediaJson != null &&
                mediaJson.mainImage != null &&
                mediaJson.mainImage != undefined ? (
                  <ImageBackground
                    source={{uri: mediaJson.square}}
                    style={styles.image}
                  />
                ) : (
                  <View />
                )}
              </View>

              <View style={styles.textView}>
                <View style={styles.textHeader}>
                  {mediaJson != null &&
                  mediaJson.mainImage != null &&
                  mediaJson.mainImage != undefined ? (
                    <AppText size="S" textProps={{numberOfLines: 2}}>
                      {processTextAndAppendElipsis(t(mediaJson.title.text), 35)}
                    </AppText>
                  ) : (
                    <View />
                  )}

                  
                  {showName ? (
                    <AppText size="XS" bold textProps={{numberOfLines: 2}}>
                      {t('Name ' + userName)}
                    </AppText>
                  ) : (
                    <View />
                  )}
                </View>
                {productSize && productSize != '' ? (
                  <AppText size="XS" bold textProps={{numberOfLines: 2}}>
                    {t('Size #SIZE#', {SIZE: productSize})}
                  </AppText>
                ) : (
                  <View />
                )}
                {showPriceTags ? (
                  <View style={styles.mainTagView}>
                    <View style={styles.innerTag}>
                      {item.offerprice === 0 ||
                      (item.transactionDetails &&
                        item.transactionDetails.offerPrice === 0) ||
                      (item.offerinvocations &&
                        item.offerinvocations.offerPrice === 0) ? (
                        <AppText
                          size="M"
                          bold
                          secondaryColor
                          style={{width: widthPercentageToDP(16)}}>
                          {t(`FREE`)}
                        </AppText>
                      ) : (
                        <Tag
                          title={'Buy with friend'}
                          strikeThru={false}
                          price={parseInt(sellingPrice)}
                          textColor={Constants.black}
                          titleStyle={{fontWeight: 'bold'}}
                          priceStyle={{fontWeight: 'bold'}}
                          size="XS"
                          t={t}
                          isGroupScreen={true}
                        />
                      )}
                    </View>
                    {mrpAmount != undefined && mrpAmount != null ? (
                      <View style={styles.innerTag}>
                        <Tag
                          title={'MRP'}
                          strikeThru={true}
                          price={mrpAmount}
                          textColor={Colors.priceColor}
                          t={t}
                          size="XS"
                          titleStyle={{marginLeft: 1}}
                          isGroupScreen={true}
                        />
                      </View>
                    ) : (
                      <View />
                    )}
                    <View>
                      {item.saving != undefined && item.saving != null ? (
                        <AppText bold primaryColor size="XS">
                          {t('(Saved ₹#SAVE#)', {SAVE: item.saving})}
                        </AppText>
                      ) : mrpAmount != undefined &&
                        mrpAmount != null &&
                        sellingPrice != undefined &&
                        sellingPrice != null ? (
                        <AppText bold primaryColor size="XS">
                          {t('(Saved ₹#SAVE#)', {
                            SAVE: mrpAmount - sellingPrice,
                          })}
                        </AppText>
                      ) : (
                        <View />
                      )}
                    </View>
                  </View>
                ) : (
                  <View />
                )}

                {coinsUsed && parseInt(coinsUsed) > 0 ? (
                  <View
                    style={{
                      marginTop: heightPercentageToDP(1),
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={Images.coin}
                      style={{
                        height: scaledSize(16),
                        width: scaledSize(16),
                        marginRight: widthPercentageToDP(2),
                      }}
                    />
                    <AppText bold size="XS" style={{color: '#fa6400'}}>
                      {t(`FREE WITH ${coinsUsed} COINS`)}
                    </AppText>
                  </View>
                ) : null}
                {cashback ? (
                  <View style={{marginTop: heightPercentageToDP(1)}}>
                    <AppText bold size="XS" style={{color: '#00a02b'}}>
                      {t(`Get Extra ${cashback}% Cashback`)}
                    </AppText>
                  </View>
                ) : null}

                {showRewards ? (
                  <View style={{alignSelf: 'baseline'}}>
                    {item.reward > 0 ? (
                      <AppText greenishBlue size="XS">
                        {t(`Rewards used : #USEDREWARDS#`, {
                          USEDREWARDS: parseInt(item.reward),
                        })}
                      </AppText>
                    ) : null}
                  </View>
                ) : (
                  <View />
                )}
                {showQuantity ? (
                  <View style={styles.statusBox}>
                    <AppText black size="XS">
                      {t('Quantity : #TOTALITEMQUANTITY#', {
                        TOTALITEMQUANTITY: item.quantity,
                      })}
                    </AppText>
                  </View>
                ) : null}
                {showOrderId ? (
                    <View style={{ flexDirection: 'row'}}>
                    <View style={{ flex: 0.5}}>
                      <AppText size="XS" textProps={{numberOfLines: 2}}>
                        {t('Order ID' + ' : ' + orderid)}
                      </AppText>
                    </View>
                    {showOrderStatus ? 
                    <View style={{ flex: 0.5}}>
                      <AppText bold size="XS" style={{color: statusColor, textAlign: 'right'}}>
                        {t(orderStatus)}
                      </AppText>
                    </View> : null}
                    </View>
                  ) : (
                    <View />
                  )}
                {paymentMode ? (
                  <View style={styles.statusBox}>
                    <AppText black size="XS">
                      {t('Payment Mode : #MODE#', {
                        MODE: paymentMode,
                      })}
                    </AppText>
                  </View>
                ) : null}
                {paymentStatus && paymentStatus != '' ? (
                  <View style={styles.statusBox}>
                    {paymentStatus == 'refund_processed' ? (
                      <AppText black size="XS">
                        {t(
                          'Your refund is processed, it will be credited in 3-4 bussiness days, please contact support #SUPPORT# in case of any issue',
                          {
                            SUPPORT: AppConstants.supportWhatsAppNumber,
                          }
                        )}
                      </AppText>
                    ) : paymentStatus == 'refund_initiated' ? (
                      <AppText black size="XS">
                        {t(
                          'Your refund is initiated, it will be processed within 48 hours, please contact support #SUPPORT# in case of any issue.',
                          {
                            SUPPORT: AppConstants.supportWhatsAppNumber,
                          }
                        )}
                      </AppText>
                    ) : (
                      <AppText black size="XS">
                        {t('Payment Status : #STATUS#', {
                          STATUS: paymentStatus,
                        })}
                      </AppText>
                    )}
                  </View>
                ) : null}
                {showOrderStatus ? (
                  <View
                    style={[
                      styles.statusBox,
                      orderStatus === 'Order Delivered'
                        ? {
                            paddingVertical: 9,
                          }
                        : {},
                    ]}>
                    {orderStatus === 'Order Delivered' ? (
                      <TouchableOpacity onPress={() => setFeedbackOn(true)}>
                        <AppText
                          bold
                          //white
                          size="XXS"
                          style={styles.customerFeedBack}>
                          {t('Product Feedback ⭐')}
                        </AppText>
                      </TouchableOpacity>
                    ) : null}
                    {statusMsg && screen == 'OrderDetail' ? (
                      <AppText
                        bold
                        black
                        size="XS"
                        style={{width: widthPercentageToDP(60)}}>
                        {t(`#ORDERSTATUSMSG#`, {ORDERSTATUSMSG: statusMsg})}
                      </AppText>
                    ) : null}
                  </View>
                ) : (
                  <View />
                )}

                {/* <View style={styles.statusBox}>
                  {item.OrderPlacedOn && item.OrderPlacedOn != 'null' ? (
                    <AppText
                      bold
                      greenishBlue
                      size="XS"
                      lightGrey
                      style={styles.textStyle}>
                      {t('Placed on #PLACEDON#', {
                        PLACEDON: moment(item.OrderPlacedOn).format('LL'),
                      })}
                    </AppText>
                  ) : (
                    <View />
                  )}
                </View> */}
                {error ? (
                  <View>
                    <AppText red size="XS">
                      {error}
                    </AppText>
                  </View>
                ) : null}
                {item.offerPrice == 0 && !isFreeGiftCategoryItem ? (
                  freeGiftBucket > 0 ? (
                    <AppText size="XS" bold secondaryColor>
                      {t('Add items for ₹#FREESHIPPING# to claim free gift', {
                        FREESHIPPING: freeGiftBucket,
                      })}
                    </AppText>
                  ) : (
                    <AppText size="XS" bold secondaryColor>
                      {t('Enjoy free gift')}
                    </AppText>
                  )
                ) : null}
              </View>
              {/* <View style={{flex: 0.3, padding: widthPercentageToDP(1)}}>
              <AppText
                bold
                white
                size="XS"
                textProps={{ numberOfLines: 1 }}
                style={{
                  flexWrap: 'wrap',
                  alignSelf: 'flex-end',
                  textAlign: 'center',
                  backgroundColor: orderStatus === 'Not Confirmed' ? Colors.tomato : Constants.primaryColor,
                  padding: widthPercentageToDP(1),
                }}>
                {t(`#ORDERSTATUS#`, {ORDERSTATUS: orderStatus})}
              </AppText>
            </View> */}
            </View>
            {showBottomMenu ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  flex: 0.1,
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Constants.white,
                    color: Constants.black,
                    width: '100%',
                  }}
                  onPress={() =>
                    ActionSheet.show(
                      {
                        options:
                          item.orderStatus === 'Deal Locked' ||
                          item.orderStatus === 'Offer Unlocked'
                            ? BUTTONS
                            : BUTTON,
                        cancelButtonIndex: CANCEL_INDEX,
                        destructiveButtonIndex: DESTRUCTIVE_INDEX,
                        title: '',
                      },
                      buttonIndex => {
                        if (buttonIndex === 1) {
                          // this.props.onCancelOrder({id: item.id});
                          onCancelOrder(item, index);
                        } else if (buttonIndex === 0) {
                          onGetOfferDetails({id: item.offerDetails.id});
                        }
                      }
                    )
                  }>
                  <Icon
                    type="FontAwesome"
                    name="ellipsis-v"
                    color="#000000"
                    style={{
                      fontSize: 20,
                      color: Constants.darkGrey,
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )}
            {withCounter && (
              <View style={styles.buttonMainView}>
                <View style={{height: 30}}>
                  <QuantityCounter
                    activeCategoryTab={''}
                    quantity={quantity}
                    screen={screen}
                    offerId={
                      (screen = 'CartDetail'
                        ? item.offerId || item.parentId
                        : item.parentId || item.offerId)
                    }
                    size={productSize}
                  />
                </View>
                {checkOutOfStock && stockValue <= 0 ? (
                  <AppText size="XS" bold red style={styles.gamaTextStyle}>
                    {t('Out of stock !!')}
                  </AppText>
                ) : null}
              </View>
            )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  flex: 0.1,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    //marginTop: widthPercentageToDP(10),
                    justifyContent: 'space-between',
                  }}>
                  {dontShowWhatsapp ? null : (
                      <View>
                        <View style={{}}>
                          <Button onPress={shareOffer}>
                            <Icon
                              type="font-awesome"
                              name="whatsapp"
                              color={Constants.green}
                              size={widthPercentageToDP(6)}
                              containerStyle={{
                                alignSelf: 'center',
                              }}
                            />
                          </Button>
                        </View>
                      </View>
                  )}
                  {showArrow ?
                  <Icon
                    type="feather"
                    name="chevron-right"
                    color={Constants.darkGrey}
                    size={widthPercentageToDP(5)}
                    containerStyle={{
                      alignSelf: 'center',
                      marginRight: widthPercentageToDP(1),
                    }}
                  /> : null }
                </View>
              </View>
          </View>
        </View>
        <SimpleLine />
        {isFeedbackOn ? (
          <Modal
            isVisible={isFeedbackOn}
            animationType={'slide'}
            style={styles.modalStyle}>
            <CustomerReview
              isVisible={handler}
              customFeedBack
              entityId={orderid}
              userId={user.uid}
            />
          </Modal>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 4,
  },
  subView: {
    flexDirection: 'row',
  },
  textHeader: {
    flexDirection: 'column',
  },
  viewInside: {
    flexDirection: 'row',
    flex: 0.9,
  },
  imageView: {
    flex: 0.2,
  },
  image: {
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(15),
    resizeMode: 'contain',
  },
  textView: {
    flex: 0.8,
    marginLeft: widthPercentageToDP(5),
    justifyContent: 'space-between',
  },
  statusBox: {
    //alignSelf: 'baseline',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  innerView: {
    paddingBottom: 5,
  },
  mainTagView: {
    flexDirection: 'row',
  },
  innerTag: {
    flex: 0.4,
    alignItems: 'flex-start',
  },
  customerFeedBack: {
    textAlign: 'center',
    padding: widthPercentageToDP(1),
    borderWidth: 1,
    borderColor: Constants.primaryColor,
  },
  lineMainView: {width: '100%', alignItems: 'center'},
  lineView: {width: '100%', borderWidth: 3, borderColor: 'transparent'},
  statusText: {
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    textAlign: 'center',
    padding: widthPercentageToDP(1),
  },
  buttonMainView: {
    flex: 0.2,
    marginTop: 10,
    height: 30,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
});

const mapStateToProps = state => ({
  language: state.home.language,
  user: state.login.userPreferences,
  preference:
    state.login.userPreferences &&
    state.login.userPreferences.userCat &&
    state.login.userPreferences.userCat.fgStatus,
  activeCategoryTab: state.home.activeCategoryTab,
  clMediumLogoImage: state.clOnboarding.clMediumLogoImage,
});

const mapDipatchToProps = dispatch => ({
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(GroupOrderOverlay))
);
