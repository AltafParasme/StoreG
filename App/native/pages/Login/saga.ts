import { all, fork, call, put, select, takeLatest } from "redux-saga/effects";
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from "react-native";
import { SendOtpAction, VerifyOtpAction, RegisterUserAction, UserPreferencesAction, GetUserPreferencesAction, GetRecentOrderAction }  from './types';
import { LOGIN_ACTION_TYPES } from './actions';
import { doHttp } from '../../../state/utils/ajax';
import { showToastr, listOfValidRoutes } from '../utils';
import * as actions from './actions';
import * as groupActions from '../OrderConfirmation/actions';
import * as clActions from '../CLOnboarding/actions';
import * as homeActions from '../Home/redux/action.js';
import * as rewardActions from '../MyRewards/actions';
import * as communityActions from '../Community/redux/actions';
import * as shopgliveActions from '../ShopgLive/redux/actions';
import * as userProfileActions from '../UserProfile/actions';
import * as LoaderActions from '../../../components/Loaders/actions';
import NavigationService from '../../../utils/NavigationService';
import { ApiConstants, API_URL } from '../../../Constants';
import DeviceInfo from 'react-native-device-info';
import firebase from '@react-native-firebase/app';
import {LogFBEvent, ErrEvents, Events} from '../../../Events';


let FBAnalytics = firebase.analytics();
const getHomeState = state => state.home;
const getLoginState = state => state.login;

function* sendOtp(action: SendOtpAction) {
	try {
        const { phoneNumber } = action.data;
        yield put(actions.changeField('lodding', true));
        yield* doHttp({
            method: "POST",
            url: `${API_URL}/api/v1/auth/otp`,
            data: {phoneNumber: phoneNumber},
            auth: false,
            headers: { "Content-Type": "application/json" },
            *onSuccess(res: any) {
              if(res && !res.success){
                showToastr(res.errMsg);
                LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/api/v1/auth/otp`, errMsg: res.errMsg, isError:true, httpCode: 200})
              }
              else {
                if (!res.data.userExists) {
                  LogFBEvent(Events.LOGIN_FIRST_USER, null);
                }
                yield put(actions.changeField('otpCallStatus', 'Success'));
                yield put(actions.changeField('userRegistered', res.data.userExists));
                showToastr(`Otp Sent on ${phoneNumber}`);
              }
              yield put(actions.changeField('lodding', false));
            },
            *onError(err: any) {
              showToastr(err);
              yield put(actions.changeField('lodding', false));
              console.log('error is ', err);
            }
          });
	} catch (err) {
		if (err instanceof Error) {
      console.log('err is ', err)
		} else {
      console.log('Unknown error is ')
		}
	}
}
function *registerUser(action: RegisterUserAction) {
  try {
    const { otp, phoneNumber, name } = action.data;
    const sid= yield AsyncStorage.getItem('sid');
    const fireToken= yield AsyncStorage.getItem('fireToken');
    const inviteToken= yield AsyncStorage.getItem('inviteToken');
    yield* doHttp({
        method: "POST",
      url: `${API_URL}/api/v1/auth/register`,
        data: {
            inviteToken: inviteToken,
            otp: otp,
            phoneNumber: phoneNumber,
            name: name,
            sid:sid,
            fireToken:fireToken
        },
        auth: false,
        headers: { "Content-Type": "application/json" },
        *onSuccess(res: any) {
          if(res && !res.success){
            LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/api/v1/auth/register`, errMsg: res.errMsg, isError:true, httpCode: 200})
            yield put(actions.changeField('resendOtpEnable', true));
            showToastr(res.errMsg);         
          }
          else {
            AsyncStorage.setItem('accessToken', res.data.user.accessToken);
            yield put(actions.changeField('accessToken', res.data.user.accessToken));
            yield put(actions.changeField('isLoggedIn', true));
            if(Platform.OS == 'android') {
              let eventData = { taskId: 27, widgetType: "AppDownload" };
              let userPrefData = {userId: res.data.user.id, sid: sid};
              yield put(shopgliveActions.liveAnalytics('App_Download_PlayStore',eventData ,userPrefData));
            }
            yield put(groupActions.getGroupSummary());
            yield put(actions.getUserPreferences(false));
            yield put({type: 'booking/GET_ADDRESS'});
            //getNextPageToLoad('Home');
            const {loginInitiatedFrom} = yield select(getLoginState);
            if(listOfValidRoutes(loginInitiatedFrom)){
              NavigationService.navigate(loginInitiatedFrom)
            }
            else NavigationService.navigate('Home')
            action.data.callback ? action.data.callback() : null;
          }
        },
        *onError(err: any) {
          //Toast.show(err);
          console.log('error is ', err);
        }
      });
  } catch (err) {
  if (err instanceof Error) {
          console.log('err is ', err)
  } else {
          console.log('Unknown error is ')
  }
  }
}

function *getRecentOrder(action: GetRecentOrderAction) {
  try {
    yield* doHttp({
      method: "GET",
      url: `${API_URL}/api/v2/order/history?size=1&page=1`,
      data: {
      },
      headers: { "Content-Type": "application/json" },
      *onSuccess(res: any) {
        if(res && !res.success){
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/api/v2/order/history?size=1&page=1`, errMsg: res.errMsg, isError:true, httpCode: 200})
        }
        else {
          yield put({
            type: 'home/SET_STATE',
            payload: {
              refreshRecentOrder: false,
            },
          });
          if(res.data.length > 0){
            yield put(actions.changeField('recentOrderExists', true));
            yield put(actions.changeField('recentOrder', { status: res.data[0].orderStatus, totalPrice: res.data[0].totalPrice, name: res.data[0].name, groupOfferId: res.data[0].groupOfferId, count: res.count }));
          }  
        }
      },
      *onError(err: any) {
        //Toast.show(err);
        console.log('error is ', err);
      }
    });
  } catch (err) {
  if (err instanceof Error) {
          console.log('err is ', err)
  } else {
          console.log('Unknown error is ')
  }
  }
}

function* verifyOtp(action: VerifyOtpAction) {
	try {
        yield put(actions.changeField('verifyOtpCallStatus', 'Loading'));
        const { otp, phoneNumber } = action.data;
        const inviteToken= yield AsyncStorage.getItem('inviteToken');

        yield* doHttp({
            method: "POST",
          url: `${API_URL}/api/v1/auth/login`,
            data: {
                inviteToken: inviteToken,
                otp: otp,
                phoneNumber: phoneNumber
            },
            auth: false,
            headers: { "Content-Type": "application/json" },
            *onSuccess(res: any) {
              yield put(actions.changeField('verifyOtpCallStatus', 'Completed'));
              if(res && !res.success){
                LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/api/v1/auth/login`, errMsg: res.errMsg, isError:true, httpCode: 200})
                yield put(actions.changeField('resendOtpEnable', true));
                showToastr(res.errMsg);               
              }
              else {
                showToastr("Otp Verified Successfully", 500);
                yield put(actions.changeField('accessToken', res.data.data.user.accessToken));
                yield put(actions.changeField('isLoggedIn', true));
                AsyncStorage.setItem('accessToken', res.data.data.user.accessToken);
                 yield put(groupActions.getGroupSummary());
                 yield put(actions.getUserPreferences(false));
                 yield put(actions.getRecentOrder());
                 yield put(rewardActions.getRewards(true, false, false, false, null, null));
                 yield put(homeActions.GetCart());
                 yield put({type: 'booking/GET_ADDRESS'});
                 yield put(userProfileActions.currentUser());
                // //getNextPageToLoad('Home');
                const {loginInitiatedFrom} = yield select(getLoginState);
                if(listOfValidRoutes(loginInitiatedFrom)){
                  NavigationService.push(loginInitiatedFrom)
                } else NavigationService.push('Home')
                action.data.callback ? action.data.callback() : null;
              }
            },
            *onError(err: any) {
              //Toast.show(err);
              yield put(actions.changeField('verifyOtpCallStatus', 'Completed'));
              console.log('error is ', err);
            }
          });
	} catch (err) {
		if (err instanceof Error) {
            console.log('err is ', err)
		} else {
            console.log('Unknown error is ')
		}
	}
}

function* getUserPreferences(action: GetUserPreferencesAction) {
  try {
    const skipAppUpdate = action.data.skipAppUpdate;
    yield put(actions.changeField('prefLoading', true));
    const {fireAppLaunchEvent, launchEventDetails, userRegistered} = yield select(getLoginState);
    yield* doHttp({
        method: "GET",
        url: `${API_URL}/${ApiConstants.userPreferences}`,
        data: {
        },
        *onSuccess(res: any) {
          //console.log('the response of the user preference for FORCE UPDATE :', res)
            if(res && !res.success){
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.userPreferences}`, errMsg: res.errMsg, isError:true, httpCode: 200})
              showToastr(res.errMsg);
            }
            else {
                  yield put(actions.changeField('userPreferences', res.data));
                  yield put(actions.getCLDetails(res.data));
                  if (!skipAppUpdate) {
                    yield put(actions.changeField('updateUrl', res.data.appVersion.force_update_store_url));
                    yield put(actions.changeField('app_update_type', res.data.appVersion.app_update_type));
                    if(fireAppLaunchEvent) {
                      let eventData = { source:launchEventDetails.source, medium: launchEventDetails.medium, taskId: launchEventDetails.taskId, referrerUserId: launchEventDetails.userId, refereeUserId: res.data.uid, isNewUser: !userRegistered };
                      let userPrefData = {userId: res.data.uid, sid: res.data.sid};  
                      yield put(shopgliveActions.liveAnalytics('App_DeepLink_Launch',eventData ,userPrefData));
                      yield put(actions.changeField('fireAppLaunchEvent', false));
                    }
                    //forceUpdateNavigate(res);
                  }
                    //getNextPageToLoad('Home');
                
            }
            yield put(actions.changeField('prefLoading', false));
        },
        *onError(err: any) {
          yield put(actions.changeField('prefLoading', false));
          showToastr(res.errMsg);
          console.log('error is ', err);
        }
      });
  } catch (err) {
  if (err instanceof Error) {
    yield put(actions.changeField('prefLoading', false));
    showToastr(err.message);
    console.log('err is ', err)
  } else {
    showToastr(err);
    console.log('Unknown error is ')
  }
  }
  yield put(LoaderActions.endLoading()); /* End full screen loader */
}

function* userPreferences(action: UserPreferencesAction) {
  try{
    const { auth, fireToken , lang, prefPinCode, canGoBack } = action.data;
    console.log('195-> action', action.data);
    
    const sid=yield AsyncStorage.getItem('sid');
    const newFireToken = !fireToken
      ? yield AsyncStorage.getItem('fireToken')
      : fireToken;
    const av = DeviceInfo.getVersion();

    yield put({ type: 'home/SET_STATE', payload: { pincodeLoder: true }});

    const unAuthParam = !auth?'/unauth':'';
    console.log('Data for uer Pref ', action.data, `${API_URL}/${ApiConstants.userPreferences}${unAuthParam}`);
    yield* doHttp({
      method: "POST",
      url: `${API_URL}/${ApiConstants.userPreferences}${unAuthParam}`,
        data: {
          sid:sid,
          lang:lang, 
          fireToken:newFireToken,
          prefPinCode: prefPinCode,
          av:av,
        },
        auth: auth,
        headers: { "Content-Type": "application/json" },
        *onSuccess(res: any) {
          yield put({ type: 'home/SET_STATE', payload: { pincodeLoder: false }});
          if(res && !res.success){
            LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.userPreferences}${unAuthParam}`, errMsg: res.errMsg, isError:true, httpCode: 200})
            NavigationService.navigate('Login');
          }
          else {
            const {editPincodeClicked} = yield select(getHomeState);
            if(editPincodeClicked) {
              yield put({ type: 'home/SET_STATE', payload: { editPincodeClicked: false }});
              yield put({ type: 'home/SET_STATE', payload: { pincodeChanged: true }});
              // yield put({ type: 'home/GET_CATEGORIES_LIST', payload: { page: 1, size: 0, actionId: '', userId: res.data.uid }});
              
              // homeActions.GetCategoriesList(1, 0, '', res.data.uid);
              yield put(actions.changeField('userPreferences', res.data));
              if(!canGoBack)
                NavigationService.navigate('Home');
              return;
            } else {
                try {
                  // const value = yield AsyncStorage.getItem('freeGiftProductID');
                  // if(value){
                  //   yield put({type:'GIFT_PRODUCT_ID', payload: value});
                  // }
                  console.log('Fire base Token User Pref ', res);
                  if(!!res.data && !!res.data.sid){
                    AsyncStorage.setItem('sid', res.data.sid);
                    if(!!auth && res.data.fireToken){
                      AsyncStorage.setItem('fireToken', res.data.fireToken);
                    }
                    // Set Sid on firbase to enable FB analytics to ShopG user Linking
                    FBAnalytics.setUserId(res.data.sid);
                    FBAnalytics.setUserProperties(res.data);

                  }
                } catch (e) {
                  console.warn('error on Async', e);
                }
                const prefPinCode = yield AsyncStorage.getItem('prefPinCode');  
                let updatedPreferences;
                if(prefPinCode && !res.data.prefPinCode) {
                  updatedPreferences = {
                    ...res.data,
                    ...JSON.parse(prefPinCode)
                  };
                } else  {
                   updatedPreferences = res.data 
                }
                yield put(actions.changeField('userPreferences', updatedPreferences));
                if(auth) {
                  yield put(actions.changeField('isLoggedIn', true));
                  yield put(actions.changeField('userRegistered', true));
                  yield put(actions.getCLDetails(res.data));
                  yield put(groupActions.getGroupSummary());
                  yield put(actions.getRecentOrder());
                  if (!!res.data) {
                    yield put(actions.changeField('updateUrl', res.data.appVersion.force_update_store_url));
                    yield put(actions.changeField('app_update_type', res.data.appVersion.app_update_type));
                    forceUpdateNavigate(res);
                  } else {
                    getNextPageToLoad('Home');
                  }
                } else {
                  getNextPageToLoad('App');
                  const inviteToken = yield AsyncStorage.getItem('inviteToken');  
                  if(inviteToken) {
                    //user came through someone's link
                    yield put(actions.getClDetailsWithInviteToken({groupIdentifer: inviteToken}));
                  }  
                  else {
                    yield put(communityActions.GetCommunityData(1, 10, () => {}));
                  }  
                }
            } 
          }
        },
        async *onError(err: any) {
          //Toast.show(err);
          console.log('error is ', err);
          await AsyncStorage.removeItem('accessToken');
          NavigationService.navigate('Login');
          yield put({ type: 'home/SET_STATE', payload: { pincodeLoder: false }});
        }
      });
    } catch (err) {
      yield put({ type: 'home/SET_STATE', payload: { pincodeLoder: false }});
    if (err instanceof Error) {
          console.log('err is ', err)
          AsyncStorage.removeItem('accessToken');
          NavigationService.navigate('Login');
    } else {
          console.log('Unknown error is ', err);
          AsyncStorage.removeItem('accessToken');
          NavigationService.navigate('Login');
    }
  }
}

function* getCLDetails(action: CLAction) {
  try {
    yield* doHttp({
      method: "GET",
      url: `${API_URL}/${ApiConstants.clDetails}?isCLAddress=true&isMallInfo=true`,
      headers: { "Content-Type": "application/json" },
      *onSuccess(res: any) {
        if(res && !res.success){
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.clDetails}`, errMsg: res.errMsg, isError:true, httpCode: 200})
        }
        else {
          yield put(actions.changeField('clDetails', res.data));
          if(Object. keys(res.data). length == 0) {
            yield put(communityActions.GetCommunityData(1, 10, () => {}));
          }
          FBAnalytics.setUserProperties({'clId': res.data.clConfig.clId});
        }
      },
      async *onError(err: any) {
        console.log('error is ', err);
      }
      });
    } catch (err) {
    if (err instanceof Error) {
        console.log('err is ', err)
    } else {
        console.log('Unknown error is ', err);
    }
  }
}

function* getClDetailsWithInviteToken(action: CLAction) {
  try {
    yield* doHttp({
      method: "GET",
      url: `${API_URL}/${ApiConstants.v3clDetails}?groupIdentifer=${action.data.groupIdentifer}`,
      headers: { "Content-Type": "application/json" },
      *onSuccess(res: any) {
        if(res && !res.success){
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.v3clDetails}`, errMsg: res.errMsg, isError:true, httpCode: 200})
        }
        else {
          yield put(actions.changeField('clDetails', res.data));
          FBAnalytics.setUserProperties({'clId': res.data.clConfig.clId});
        }
      },
      async *onError(err: any) {
        console.log('error is ', err);
      }
      });
    } catch (err) {
    if (err instanceof Error) {
        console.log('err is ', err)
    } else {
        console.log('Unknown error is ', err);
    }
  }
}

function forceUpdateNavigate(res: any) {
  try {
      let appVersion = res.data.appVersion.min_android_av;
      let av = DeviceInfo.getVersion();
      console.log('difference between app version and user app ',appVersion, av, res.data)
      if (appVersion > av && res.data.appVersion.app_update_type !== 'NOUPDATE') {
        NavigationService.navigate('ForceUpdate');
        return ;
      } 
      else {
          getNextPageToLoad('Home');
        return;
      } 
  } catch (e) {
    getNextPageToLoad('Home');
    LogFBEvent(ErrEvents.APP_UPDATE_ERROR, {error: e});
  }
}


function getNextPageToLoad(routeTo){
      AsyncStorage.getItem("deepLinkTo").then((deepLinkTo)=>{
        if(!!deepLinkTo){
          //console.log('DEEPLINK to ', deepLinkTo);
          AsyncStorage.removeItem("deepLinkTo");
          let params = deepLinkTo.split('/');
          params=params.filter(Boolean);

          if(!!params[0]){
            //console.log('DEEPLINK action ', params[0]);
            if(!!params[1]){
              //console.log('DListtionId Param ', params[1]);
              NavigationService.navigate(params[0], {'actionId':params[1]});

            }else{
              if(params[0] === 'Booking') //In case of booking screen if actionid is not present take to Home
                NavigationService.navigate('Home');
              else
              listOfValidRoutes(params[0]) ? NavigationService.navigate(params[0]) : NavigationService.navigate('Home');
            }
          }
          
        }else{
          //console.log('DEEPLINK Base ', routeTo);
          if(!!routeTo){
            NavigationService.navigate(routeTo);
           }else {
             NavigationService.navigate('Home');
           }
         }      
       
     });
 }

function* watchFetchRequest() {
    yield takeLatest(LOGIN_ACTION_TYPES.SEND_OTP, sendOtp);
    yield takeLatest(LOGIN_ACTION_TYPES.VERIFY_OTP, verifyOtp);
    yield takeLatest(LOGIN_ACTION_TYPES.REGISTER_USER, registerUser);
    yield takeLatest(LOGIN_ACTION_TYPES.USER_PREFERENCES, userPreferences);
    yield takeLatest(LOGIN_ACTION_TYPES.GET_USER_PREFERENCES, getUserPreferences);
    yield takeLatest(LOGIN_ACTION_TYPES.GET_RECENT_ORDER, getRecentOrder);
    yield takeLatest(LOGIN_ACTION_TYPES.GET_CL_DETAILS, getCLDetails);
    yield takeLatest(LOGIN_ACTION_TYPES.GET_CL_DETAILS_INVITETOKEN, getClDetailsWithInviteToken);
}

export default function* loginSaga() {
	yield all([fork(watchFetchRequest)]);
}
