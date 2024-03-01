import {
    SET_STATE,
    GET_COMMUNITY_LIST,
  } from './types';
  
  export const initialState = {
    comunityLoading: false,
    comunityWidgetLoading: false,
    communityList:[],
    currentComunityWidgetList:[],
    createPostLoading:false,
    lastComment:{postId:-1,comment:''},
    addCommentLoading:false,
    reactionLoading:false,
    shareLoading:false,
    recentPostCreated:undefined,
    selectedCommunityId:undefined,
    selectedCommunityPage:1,
    getCommentLoading:false,
    slectedPostId:undefined,
    selectedPost:undefined,
    selectedPostIndex:0
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
  