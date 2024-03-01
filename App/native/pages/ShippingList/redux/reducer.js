import {SET_STATE} from './type';

export const initialState = {
  list: [],
  tab: 0,
  expanded: false,
  totalListCount: 0,
  firstDate: null,
  lastDate: null,
  dateArray: null,
  groupList: [],
  isShipmentDetailsLoading: false,
  isShipmentFilterSelected: false,
  totalGroupListCount: 0,
  detail: {},
  loading: false,
  clWeeklyLoading: false,
  selectedShipping: {},
  groupShippingData: {},
  groupShippingDetail: false,
  markDeliver: null,
  markDeliverLoading: false,
  userBankDetails: {},
  bankDetailsSubmitted: false,
  accountVerified: false,
  isBankAccountPresent: false,
  isBankLoading: false,
  shouldNotFocus: false,
  fromShippingList: false,
  scanApiCall: false,
  scanApiNoShipmentFound: false,
  statusList: [],
  customerStatusList: [],
  toBarcodeFromGroup: false,
  refreshChildComponent: false,
  returnShipment: null,
  clEarningDetail: undefined,
  clEarningTask: null,
  detailsListItem: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
