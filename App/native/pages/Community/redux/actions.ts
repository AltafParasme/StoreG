import {
    GET_COMMUNITY_LIST,GET_CURRENT_COMMUNITY_DATA,CREATE_POST,CREATE_COMMENT, GET_COMMENT, JOIN_COMMUNITY,UPLOAD_IMAGE, EDIT_DELETE
  } from './types';
  
export const GetCommunityData = (page, size,callback) => ({
    type: GET_COMMUNITY_LIST,
    payload: {page, size,callback},
});

export const GetCurrentCommunityData = (id,page, size,callback) => ({
  type: GET_CURRENT_COMMUNITY_DATA,
  payload: {id,page, size,callback},
});

export const CreatePost = (postData,callback) => ({
  type: CREATE_POST,
  payload: {postData,callback},
});

export const CreateComment = (postId,index,name,type,data,callback) => ({
  type: CREATE_COMMENT,
  payload: {postId,index,name,type,data,callback},
});

export const GetComment = (postId,index,page,size,isPost) => ({
  type: GET_COMMENT,
  payload: {postId,index,page,size,isPost},
});

export const joinCommunity = (communityId) => ({
  type: JOIN_COMMUNITY,
  payload: {communityId},
});

export const EditDelete = (postData,callback) => ({
  type: EDIT_DELETE,
  payload: {postData,callback}
});

export const uploadImage = (postData,callback) => ({
  type: UPLOAD_IMAGE,
  payload: {postData,callback},
});