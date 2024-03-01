const actions = {
  SET_STATE: 'booking/SET_STATE',
  GET_BOOKING: 'booking/GET_BOOKING',
  GET_ENTITY_DETAILS: 'booking/GET_ENTITY_DETAILS',
  GET_ENTITY_BARCODEID: 'booking/GET_ENTITY_BARCODEID',
  GET_ADDRESS: 'booking/GET_ADDRESS',
  SET_ADDRESS: 'booking/SET_ADDRESS',
  CHECK_PIN: 'booking/CHECK_PIN',
  ADD_ADDRESS: 'booking/ADD_ADDRESS',
  UPDATE_ADDRESS: 'booking/UPDATE_ADDRESS',
  SELECT_ADDRESS: 'booking/SELECT_ADDRESS',
  BOOK_PRODUCT: 'booking/BOOK_PRODUCT',
  QUANTITY: 'booking/QUANTITY',
  SET_PRODUCT: 'booking/SET_PRODUCT',
  SET_BOOKED_PRODUCT: 'booking/SET_BOOKED_PRODUCT',
};

export const SET_STATE = payload => ({
  type: actions.SET_STATE,
  payload,
});

export const GET_BOOKING = (payload, index) => ({
  type: actions.GET_BOOKING,
  payload: payload,
  index: index,
});

export const GET_ENTITY_BARCODEID = payload => ({
  type: actions.GET_ENTITY_BARCODEID,
  payload: payload,
});

export const CHECK_PIN = (pin, offerId, fromAddress) => ({
  type: actions.CHECK_PIN,
  payload: {pin, offerId, fromAddress},
});

export const ADD_ADDRESS = payload => ({
  type: actions.ADD_ADDRESS,
  payload,
});

export const UPDATE_ADDRESS = payload => ({
  type: actions.UPDATE_ADDRESS,
  payload,
});

export const SELECT_ADDRESS = payload => ({
  type: actions.SELECT_ADDRESS,
  payload,
});

export const BOOK_PRODUCT = payload => ({
  type: actions.BOOK_PRODUCT,
  payload,
});

export const QUANTITY = payload => ({
  type: actions.QUANTITY,
  payload,
});

export const GET_ENTITY_DETAILS = payload => ({
  type: actions.GET_ENTITY_DETAILS,
  payload,
});

export default actions;
