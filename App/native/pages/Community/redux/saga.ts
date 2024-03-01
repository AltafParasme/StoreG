import {all, fork, call, put, select, takeLatest} from 'redux-saga/effects';
import {doHttp} from '../../../../state/utils/ajax';
import * as action from './types';
import idx from 'idx';
import {LogFBEvent, ErrEvents, Events} from '../../../../Events';
import {showToastr, showAlert, errResponse} from '../../utils';
import {
  API_URL,
  API_LOCATION_URL,
  API_ANALYTICS_URL,
  ApiConstants,
} from '../../../../Constants';
import i18n from '../../../../../i18n';
import {getL10s, getL10sFeedback} from '../../../../utils';
import NavigationService from '../../../../utils/NavigationService';
import {getCategoryIndex, removeData, setData, getData} from '../../utils';
import {AppConstants} from '../../../../Constants';

const comunityState = state => state.community;
const groupSummaryState = state => state.groupSummary;
const loginState = state => state.login;

function* getCommunity(action) {
    try {
      yield put({
        type: 'comunity/SET_STATE',
        payload: {
            comunityLoading: true,
        },
      });
      const {isLoggedIn, clDetails} = yield select(loginState);
      const {groupDetails} = yield select(groupSummaryState);
      let groupCode = idx(groupDetails, _ => _.info.groupCode);
       if(!groupCode && clDetails) {
        groupCode = clDetails.groupCode;
       }
      let getComunityUrl;
      if(isLoggedIn) { 
        if(groupCode)
            getComunityUrl = `${API_ANALYTICS_URL}/live/${ApiConstants.getComunities}?groupCode=${groupCode}`;
        else 
            getComunityUrl = `${API_ANALYTICS_URL}/live/${ApiConstants.getComunities}`;
      } else {
        if(groupCode)
            getComunityUrl = `${API_ANALYTICS_URL}/live/no-auth/${ApiConstants.getComunities}?groupCode=${groupCode}`;
        else 
            getComunityUrl = `${API_ANALYTICS_URL}/live/no-auth/${ApiConstants.getComunities}`;
      }
      yield* doHttp({
        method: "GET",
        url: getComunityUrl,
        data: {
        },
        *onSuccess(res: any) {
            yield put({
                type: 'comunity/SET_STATE',
                payload: {
                    comunityLoading: false,
                },
            });
            if(res && !res.success){
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: getComunityUrl, errMsg: res.errMsg, isError:true, httpCode: 200})
              showToastr(res.errMsg);
              action.payload.callback(null);
            }
            else {
                yield put({
                    type: 'comunity/SET_STATE',
                    payload: {
                        communityList: res.data,
                    },
                });
                action.payload.callback(res.data);
            }
        },
        *onError(err: any) {
            yield put({
                type: 'comunity/SET_STATE',
                payload: {
                    comunityLoading: false,
                },
            });
            action.payload.callback(null);
        }
      });
    } catch (err) {
        yield put({
            type: 'comunity/SET_STATE',
            payload: {
                comunityLoading: false,
            },
        });
        action.payload.callback(null);
        if (err instanceof Error) {
            showToastr(err.message);
            console.log('err is ', err)
        } else {
            showToastr(err);
            console.log('Unknown error is ')
        }
    }
  }

  function* editDelete(action) {
    try {
      const postData = action.payload.postData;
      let editDeleteUrl =  `${API_ANALYTICS_URL}/${ApiConstants.editDeleteApiUrl}`;
      yield* doHttp({
        method: "PUT",
        url: editDeleteUrl,
        data: postData,
        onSuccess(res: any) {
            if(res && !res.success){
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: editDeleteUrl, errMsg: res.errMsg, isError:true, httpCode: 200})
              showToastr(res.errMsg);
              action.payload.callback(false);
            }
            else {
                action.payload.callback(true);
            }
        },
        onError(err: any) {
            action.payload.callback(false);
        }
      });
    } catch (err) {
        action.payload.callback(false);
        if (err instanceof Error) {
            showToastr(err.message);
            console.log('err is ', err)
        } else {
            showToastr(err);
            console.log('Unknown error is ')
        }
    }
  }

  function* getCurrentCommunityData(action) {
    try {
      yield put({
        type: 'comunity/SET_STATE',
        payload: {
            comunityWidgetLoading: (action.payload.page==1),
        },
      });
      const {selectedCommunityPage} = yield select(comunityState);
      let page = (action.payload.page==1) ? 1 : selectedCommunityPage + 1;
      const {accessToken} = yield select(loginState);
      let getComunityUrl = accessToken ? `${API_ANALYTICS_URL}/live/${ApiConstants.getCurrentCommunity}?communityId=${action.payload.id}&page=${page}&size=${action.payload.size}`: `${API_ANALYTICS_URL}/live/no-auth/${ApiConstants.getCurrentCommunity}?communityId=${action.payload.id}&page=${page}&size=${action.payload.size}`;
      yield* doHttp({
        method: "GET",
        url: getComunityUrl,
        data: {
        },
        *onSuccess(res: any) {
            yield put({
                type: 'comunity/SET_STATE',
                payload: {
                    comunityWidgetLoading: false,
                },
            });
            if(res && !res.success){
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: getComunityUrl, errMsg: res.errMsg, isError:true, httpCode: 200})
              showToastr(res.errMsg);
            } else {
                const {currentComunityWidgetList} = yield select(comunityState);
                yield put({
                    type: 'comunity/SET_STATE',
                    payload: {
                        currentComunityWidgetList: (page > 1) ?  [...currentComunityWidgetList,...res.data] : res.data,
                        selectedCommunityPage:res.data && res.data.length ? parseInt(res.pageNumber) : -1
                    },
                });

            }
            action.payload.callback();
        },
        *onError(err: any) {
            action.payload.callback();
            yield put({
                type: 'comunity/SET_STATE',
                payload: {
                    comunityWidgetLoading: false,
                },
            });
        }
      });
    } catch (err) {
        action.payload.callback();
        yield put({
            type: 'comunity/SET_STATE',
            payload: {
                comunityWidgetLoading: false,
            },
        });
        if (err instanceof Error) {
            showToastr(err.message);
            console.log('err is ', err)
        } else {
            showToastr(err);
            console.log('Unknown error is ')
        }
    }
  }

  function* createPost(action) {
    try {
      let createPostUrl = `${API_ANALYTICS_URL}/live/${ApiConstants.createPost}`;
      yield* doHttp({
        method: "POST",
        url: createPostUrl,
        data: action.payload.postData,
        *onSuccess(res: any) {
            if(res && !res.success){
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: createPostUrl, errMsg: res.errMsg, isError:true, httpCode: 200})
              showToastr(res.errMsg);
              action.payload.callback(false);
            } else {
                action.payload.callback(true);
                if(res.data && res.data.length){
                    const {currentComunityWidgetList,selectedCommunityId} = yield select(comunityState);
                    let tempArr = [];
                    tempArr.push(res.data[0]);
                    currentComunityWidgetList.map(item => {
                        if (item.communityId == selectedCommunityId) {
                            tempArr.push(item);
                        }
                      });
                    yield put({
                        type: 'comunity/SET_STATE',
                        payload: {
                            currentComunityWidgetList: tempArr,
                        },
                    });
                    yield put({
                        type: 'comunity/SET_STATE',
                        payload: {
                            recentPostCreated: res.data[0],
                        },
                    });
                }
            }
        },
        onError(err: any) {
            action.payload.callback(false);
        }
      });
    } catch (err) {
        action.payload.callback(false);
        if (err instanceof Error) {
            showToastr(err.message);
            console.log('err is ', err)
        } else {
            showToastr(err);
            console.log('Unknown error is ')
        }
    }
  }

  function* uploadImage(action) {
    try {
        yield put({
            type: 'comunity/SET_STATE',
            payload: {
                createPostLoading: true,
            },
          });
      let createPostUrl = `${API_ANALYTICS_URL}/${ApiConstants.uploadImage}`;
      yield* doHttp({
        method: "POST",
        url: createPostUrl,
        data: action.payload.postData,
        *onSuccess(res: any) {
            yield put({
                type: 'comunity/SET_STATE',
                payload: {
                    createPostLoading: false,
                },
              });
            if(res && !res.success){
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: createPostUrl, errMsg: res.errMsg, isError:true, httpCode: 200})
              showToastr(res.errMsg);
              action.payload.callback(undefined)
            } else {
                action.payload.callback(res.data)
            }
        },
        *onError(err: any) {
            yield put({
                type: 'comunity/SET_STATE',
                payload: {
                    createPostLoading: false,
                },
            });
            action.payload.callback(undefined)
        }
      });
    } catch (err) {
        yield put({
            type: 'comunity/SET_STATE',
            payload: {
                createPostLoading: false,
            },
        });
        action.payload.callback(undefined)
        if (err instanceof Error) {
            showToastr(err.message);
            console.log('err is ', err)
        } else {
            showToastr(err);
            console.log('Unknown error is ')
        }
    }
  }

  function* createComment(action) {
    try {
      yield put({
        type: 'comunity/SET_STATE',
        payload: {
            slectedPostId:action.payload.postId
        },
      });
      let data = action.payload.data;
      if(action.payload.type){
        data['type'] = action.payload.type;
      }
      
      let createCommentUrl = `${API_ANALYTICS_URL}/live/${ApiConstants.createComment}?postId=${action.payload.postId}`;

      yield* doHttp({
        method: "POST",
        url: createCommentUrl,
        data: data,
        *onSuccess(res: any) {
            action.payload.callback()
            if(res && !res.success){
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: createCommentUrl, errMsg: res.errMsg, isError:true, httpCode: 200})
              showToastr(res.errMsg);
            } else {
                const {currentComunityWidgetList} = yield select(comunityState);
                let tempArr = [...currentComunityWidgetList]
                tempArr[action.payload.index]['data']['comments'] = res.data.Comments.comments;
                tempArr[action.payload.index]['summary']['action'] = res.data.Count.action;
                yield put({
                    type: 'comunity/SET_STATE',
                    payload: {
                        currentComunityWidgetList: tempArr,
                        selectedPost:tempArr[action.payload.index],
                        selectedPostIndex:action.payload.index
                    },
                });

            }
        },
        onError(err: any) {
            action.payload.callback()
        }
      });
    } catch (err) {
        action.payload.callback()
        if (err instanceof Error) {
            showToastr(err.message);
            console.log('err is ', err)
        } else {
            showToastr(err);
            console.log('Unknown error is ')
        }
    }
  }

  function* getComment(action) {
    try {
      yield put({
        type: 'comunity/SET_STATE',
        payload: {
            getCommentLoading: true,
        },
      });
      const {accessToken} = yield select(loginState);
      let getCommentUrl = accessToken ? `${API_ANALYTICS_URL}/live/${ApiConstants.createComment}?postId=${action.payload.postId}&page=${action.payload.page}&size=${action.payload.size}` : `${API_ANALYTICS_URL}/live/no-auth/${ApiConstants.createComment}?postId=${action.payload.postId}&page=${action.payload.page}&size=${action.payload.size}`;
      yield* doHttp({
        method: "GET",
        url: getCommentUrl,
        data: {},
        *onSuccess(res: any) {
            yield put({
                type: 'comunity/SET_STATE',
                payload: {
                    getCommentLoading: false,
                },
            });
            if(res && !res.success){
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: getCommentUrl, errMsg: res.errMsg, isError:true, httpCode: 200})
              showToastr(res.errMsg);
            } else {
                if(action.payload.isPost){
                    const userPostData = res && res.data && res.data.userPostData;
                    if(userPostData){
                        yield put({
                            type: 'comunity/SET_STATE',
                            payload: {
                                currentComunityWidgetList: res.data.userPostData,
                                selectedPost: res.data.userPostData[0],
                                selectedPostIndex: 0,
                            },
                        });
                    }
                } else {
                    const {currentComunityWidgetList} = yield select(comunityState);
                    let tempArr = [...currentComunityWidgetList]
                    tempArr[action.payload.index]['data']['comments'] = [...tempArr[action.payload.index]['data']['comments'],...res.data.postComment];
                    yield put({
                        type: 'comunity/SET_STATE',
                        payload: {
                            currentComunityWidgetList: tempArr,
                        },
                    });
                }
            }
        },
        *onError(err: any) {
            yield put({
                type: 'comunity/SET_STATE',
                payload: {
                    getCommentLoading: false,
                },
            });
        }
      });
    } catch (err) {
        yield put({
            type: 'comunity/SET_STATE',
            payload: {
                getCommentLoading: false,
            },
        });
        if (err instanceof Error) {
            showToastr(err.message);
            console.log('err is ', err)
        } else {
            showToastr(err);
            console.log('Unknown error is ')
        }
    }
  }

  function* joinCommunity(action) {
    try {
      
      let url = `${API_ANALYTICS_URL}/live/${ApiConstants.joinCommunity}`;  
      const communityId = action.payload.communityId; 
      yield* doHttp({
        method: "POST",
        url: url,
        data: {
            communityId: communityId
        },
        *onSuccess(res: any) {
            if(res && !res.success){
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: url, errMsg: res.errMsg, isError:true, httpCode: 200})
              showToastr(res.errMsg);
            } else {
               showToastr('Joined community successfully')
               const {communityList} = yield select(comunityState);
               
               communityList.forEach(element => {
                if(element.CommunityId == communityId) {
                 element['isMember'] = true;   
                }
               });
               yield put({
                type: 'comunity/SET_STATE',
                payload: {
                    communityList: communityList
                },
               });
            }
        },
        *onError(err: any) {
        }
      });
    } catch (err) {
        if (err instanceof Error) {
            showToastr(err.message);
            console.log('err is ', err)
        } else {
            showToastr(err);
            console.log('Unknown error is ')
        }
    }
  }

export default function* communitySaga() {
    yield all([
        takeLatest(action.GET_COMMUNITY_LIST, getCommunity),
        takeLatest(action.GET_CURRENT_COMMUNITY_DATA, getCurrentCommunityData),
        takeLatest(action.CREATE_POST, createPost),
        takeLatest(action.CREATE_COMMENT, createComment),
        takeLatest(action.GET_COMMENT, getComment),
        takeLatest(action.JOIN_COMMUNITY, joinCommunity),
        takeLatest(action.EDIT_DELETE, editDelete),
        takeLatest(action.UPLOAD_IMAGE, uploadImage),
    ]);
}