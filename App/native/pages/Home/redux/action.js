import {
  GET_OFFER_LIST,
  SET_ACTIVE_TAB,
  GET_CATEGORIES_LIST,
  GET_CART_DETAIL,
  UPDATE_CART,
  SET_FEEDBACK,
  PLACE_ORDER,
  SET_GPS_LOCATION,
  SET_GROUP,
  GET_WIDGETS,
  LIVE_GET_OFFER_LIST_IN_BULK,
  VERIFY_PAYMENT,
  GET_PINCODE_FROM_LOCATION,
} from './type';

export const GetOfferData = (page, size, slug, userId, tags) => ({
  type: GET_OFFER_LIST,
  payload: {page, size, slug, userId, tags},
});

export const SetFeedBack = (feedBackPayload, isFeedBackShare) => ({
  type: SET_FEEDBACK,
  payload: {feedBackPayload, isFeedBackShare: isFeedBackShare},
});

export const GetCategoriesList = (page, size, actionId, userId) => ({
  type: GET_CATEGORIES_LIST,
  payload: {page, size, actionId, userId},
});

export const SetActiveTab = tab => ({
  type: SET_ACTIVE_TAB,
  payload: tab,
});

export const GetCart = (cartId, cancelOrderId) => ({
  type: GET_CART_DETAIL,
  payload: {cartId, cancelOrderId},
});

export const UpdateCart = (
  offerId,
  quantity,
  size,
  color,
  currencyMode,
  source,
  medium
) => ({
  type: UPDATE_CART,
  payload: {offerId, quantity, size, color, currencyMode, source, medium},
});

export const PlaceOrder = (
  cartId,
  useRewards,
  addressId,
  name,
  paymentMode,
  totalPrice,
  listofCategories,
  numberOfOrders,
  source,
  medium,
  // razorpay_order_id,
  // razorpay_payment_id,
  // razorpay_signature,
  callback
) => ({
  type: PLACE_ORDER,
  payload: {
    cartId,
    useRewards,
    addressId,
    name,
    paymentMode,
    totalPrice,
    listofCategories,
    numberOfOrders,
    source,
    medium,
    // razorpay_order_id,
    // razorpay_payment_id,
    // razorpay_signature,
    callback,
  },
});

export const SaveLocation = (userId, page, lat, lng, obj) => ({
  type: SET_GPS_LOCATION,
  payload: {userId, page, lat, lng, obj},
});

export const getPincodeFromLocation = (lat, lng) => ({
  type: GET_PINCODE_FROM_LOCATION,
  payload: {lat, lng},
});

export const SaveGroup = groupCode => ({
  type: SET_GROUP,
  payload: {groupCode},
});

export const getWidgets = (
  isPublic,
  isPrivate,
  page,
  userId,
  callback,
  category,
  comunityName,
  pageNumber,
  size
) => ({
  type: GET_WIDGETS,
  payload: {
    isPublic,
    isPrivate,
    page,
    userId,
    callback,
    category,
    comunityName,
    pageNumber,
    size,
  },
});

export const getLiveOfferListInBulk = (tags, page, size) => ({
  type: LIVE_GET_OFFER_LIST_IN_BULK,
  payload: {tags, page, size},
});

export const verifyPayment = (
  cartId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => ({
  type: VERIFY_PAYMENT,
  payload: {cartId, razorpay_order_id, razorpay_payment_id, razorpay_signature},
});
