const actions = {
  SET_STATE: 'order_detail/SET_STATE',
  GET_ORDER: 'order_detail/GET_ORDER',
  ON_CANCEL_ORDER: 'order_detail/ON_CANCEL_ORDER',
};

export const SET_STATE = payload => ({
  type: actions.SET_STATE,
  payload,
});

export const GET_ORDER = payload => ({
  type: actions.GET_ORDER,
  payload: payload,
});

export default actions;
