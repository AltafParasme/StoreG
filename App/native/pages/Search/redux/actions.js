import {SEARCH_GET_OFFER_LIST, SEARCH_LOG} from './type';

export const GetOfferList = (key, userId) => ({
  type: SEARCH_GET_OFFER_LIST,
  payload: {key, userId},
});

export const SearchLog = (key, userId, offerId, selectionType) => ({
  type: SEARCH_LOG,
  payload: {key, userId, offerId, selectionType},
});
