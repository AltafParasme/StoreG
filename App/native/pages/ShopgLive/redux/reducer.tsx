import {SET_STATE, CHANGE_FIELD} from './type';
  
  export const initialState = {
    liveOfferList: [],
    bannerTags: [],
    liveLoading:false,
    communityRelevanceReaction: '😍',
    selectedTag:'',
    querySnapshot: [],
    widgetList: [],
    cartPageWidgets: [],
    userWidgetData: [],
    comment: [],
    videoShowOfferList:[],
    selectedVideoIndex:0,
    scratchCards:[],
    fetchingData:false,
    productName:'',
    pageUpdating:'',
    isReviewComponent:false
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case SET_STATE:
        return {...state, ...action.payload};
      case CHANGE_FIELD:
        return {...state, ...action.payload};
      default:
        return state;
    }
  };
  