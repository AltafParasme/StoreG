import {LIVE_GET_OFFER_LIST, LIVE_GET_OFFER_LIST_IN_BULK, LIVE_ANALYTICS ,CHANGE_FIELD} from './type';

export const GetLiveOfferList = (tag,page,size) => ({
  type: LIVE_GET_OFFER_LIST,
  payload: {tag,page,size},
});

export const liveAnalytics = (eventName: string, eventData: any, userPref: any) => ({
  type: LIVE_ANALYTICS,
  payload: {eventName, eventData, userPref},
});

export const changeField = (fieldName, value) => ({
  type: CHANGE_FIELD,
  payload: {
    [fieldName] : value
  },
});
