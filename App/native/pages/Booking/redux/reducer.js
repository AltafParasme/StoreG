import actions from './actions';

export const initialState = {
  loading: false,
  booking: {},
  entityDetails: {},
  essentialEntityDetails: null,
  entityDetailsApiLoading: false,
  address: [],
  pinLoading: false,
  primaryAddress: {},
  selectedAddress: {},
  addressListApiCompleted: false,
  quantity: 1,
  index: 0,
  selectedSize: '',
  selectedColor: '',
  refreshScreen: false,
  newAddressAdded: false,
  addressName: '',
  localityData: [],
  selectedLocality: {},
  showSearchModal: false,
  addressUpdated: false,
  sourceComponent: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_STATE:
      return {...state, ...action.payload};
    case actions.SELECT_ADDRESS:
      return {
        ...state,
        selectedAddress: action.payload,
        addressField: action.payload,
      };
    case actions.QUANTITY:
      return {...state, quantity: action.payload};
    default:
      return state;
  }
};
