import {
  SET_STATE,
  GET_OFFER_LIST,
  GET_OFFER_SUCCESS,
  GET_CATEGORIES_SUCCESS,
  SET_ACTIVE_TAB,
  LIMIT_REACHED,
  LIMIT_TAGS_REACHED,
  SET_ACTIVE_TAG,
} from './type';

export const initialState = {
  loading: false,
  isLoading: false,
  loadingCart: false,
  loadingAddToCart: false,
  loadingPayments: false,
  isFreeGiftEnabled: false,
  qrCodeLoading: false,
  page: 1,
  feedback: null,
  language: 'english',
  list: {},
  categories: [],
  categoryObj: [],
  activeCategoryTab: '',
  activeCategoryTabIndex: 1,
  limit: false,
  freeGiftProductID: '',
  isSharedEver: '',
  index: 0,
  editPincodeClicked: false,
  pincodeChanged: false,
  refreshRecentOrder: false,
  cart: {},
  pamphletOffers: null,
  pamphletShareMedia: null,
  hasCart: false,
  showFeedBackPopUp: true,
  offerIdUpdatedInCart: -1,
  offerIdUpdatingInCart: -1,
  offerSizeUpdatingInCart: '',
  totalCartItems: 0,
  refreshCancelOrder: false,
  cancelOrderCart: {},
  cartOrderPlaced: false,
  location: {},
  isTagsScreen: false,
  pincodeLoder: false,
  paymentSignatureFailed: undefined,
  loadingTags:''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case LIMIT_REACHED:
      return {
        ...state,
        limit: true,
        message: '',
      };
    case LIMIT_TAGS_REACHED:
      return {
        ...state,
        tagsLimit: true,
        message: '',
      };
    case SET_ACTIVE_TAG:
      return {
        ...state,
        tagsLimit: false,
      };
    case GET_OFFER_SUCCESS:
      return {...state, list: action.payload};
    case GET_CATEGORIES_SUCCESS:
      const categoryObj = action.payload.categories.map((item, index) => {
        return {key: index, title: item.name, slug: item.slug};
      });
      return {
        ...state,
        categories: action.payload.categories,
        categoryObj: categoryObj,
        activeCategoryTabIndex: action.payload.activeCategoryTabIndex,
        activeCategoryTab: action.payload.activeCategoryTab,
      };
    case SET_ACTIVE_TAB:
      return {
        ...state,
        limit: false,
        activeCategoryTab: action.payload,
      };
    case 'SET_LANGUAGE':
      return {...state, language: action.payload};
    case 'GIFT_PRODUCT_ID':
      return {...state, freeGiftProductID: action.payload};
    default:
      return state;
  }
};
