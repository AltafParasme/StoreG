import Constants from './constants';

const initialState = {
  loading: false,
  loadingText: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case Constants.START_LOADING:
      return { ...state, ...{ loading: true, loadingText: action.data } };
    case Constants.END_LOADING:
      return { ...state, ...{ loading: false, loadingText: '' } };
    default:
      return state;
  }
}
