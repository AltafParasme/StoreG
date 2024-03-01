import actions from './actions';

export const initialState = {
  item: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ORDER:
      return {...state, item: action.payload};
    default:
      return state;
  }
};
