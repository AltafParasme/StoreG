import {
  SEARCH_SET_OFFER_LIST,
  SEARCH_SET_CACHE_LIST,
  SEARCH_SET_RESULT,
} from './type';

export const initialState = {
  list: [],
  cacheList: [],
  noSearchResults: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_SET_OFFER_LIST:
      return {...state, list: action.payload.list};
    case SEARCH_SET_CACHE_LIST:
      return {...state, cacheList: action.payload.list};
    case SEARCH_SET_RESULT:
      return {...state, noSearchResults: action.payload.noSearchResults};
    default:
      return state;
  }
};
