import {call, put, select} from 'redux-saga/effects';
import axios from 'axios';
import {string} from 'prop-types';
//import types from './types';
//import Toast from "react-native-simple-toast";
import store from "../store";
//import { accessTokenSelector } from "../store/commonSelectors";
//import { NavigationService } from "../native/router";
//import config from "../config";
import { showToastr } from '../../../App/native/pages/utils';
import NavigationService from '../../../App/utils/NavigationService';
import {LogFBEvent, ErrEvents} from '../../Events';
import {API_TIMEOUT} from '../../Constants';
const timeout = parseInt(API_TIMEOUT);

const addAccessToken = headers => {
  const state = store.getState();
  const accessToken = state.login && state.login.accessToken;
  console.log('accesstoken is ', accessToken);

  if (!headers['access-token'] && accessToken) {
    headers['access-token'] = accessToken;
  }
};

export function* doHttp({
  method,
  url,
  data,
  headers = { "Content-Type": "application/json" },
  onSuccess,
  onError,
  //   successToast?any,
  //   errorToast?,
  //   mockSuccessRes?,
  //   handleResponse?,
  auth = true
}): any {
  if (
    (method == 'POST' ||
      method == 'PATCH' ||
      method == 'PUT' ||
      method == 'DELETE') &&
    typeof data !== 'object' &&
    typeof data !== 'string'
  ) {
    throw new Error(`No data for ${method} call`);
  }
  if (typeof onSuccess !== 'function') {
    throw new Error('Check type of onSuccess');
  }
  if (typeof onError !== 'function') {
    throw new Error('Check type of onError');
  }
  //   if (__DEV__ && mockSuccessRes) {
  //     // for mocking while developing
  //     yield* onSuccess(mockSuccessRes);
  //     return mockSuccessRes;
  //   }

  try {
    if (auth != false) {
        addAccessToken(headers);
    }
    
    
    // console.log('***** sending headers *** ', headers);
    // const response = yield call(
    //   axios,
    //   method == "POST" ||
    //     method == "PATCH" ||
    //     method == "PUT" ||
    //     method == "DELETE"
    //     ? {
    //         url,
    //         method,
    //         headers,
    //         data
    //       }
    //     : { url, method, headers }
    // );
    const start = new Date();
    const response = yield call(() => axios({method, url, headers, data, timeout}));
    // if (handleResponse) {
    //   // custom response handling. Remember to handle your success condition yourself
    //   return yield* handleResponse(response, onSuccess, onError);
    // }
    // default response handling
   
    if (
      response.status == '200' ||
      response.status === 'DONE' ||
      response.status === 'SUCCESS'
    ) {
      const timeTaken= (new Date()) - start;
      console.log('API URL :', url, " Response : ", { ...response});
      console.log('API URL : ', url, ' TIMEOUT : ', timeout, ' TIME TAKEN : ', timeTaken);

      if (timeTaken > 500) {
        LogFBEvent(ErrEvents.API_LOAD_TIME, {api: url.split("?")[0], timeTaken: timeTaken})
      }
      let result = response.data.response || response.data.payload || response.data;
      result = !result ? response.data : result;
      return yield* onSuccess(result);
      
    }

    if (
      (response.status == 'ERROR' || response.status == 'FAILURE') &&
      response.errorMessage
    ) {
      throw new Error(response.errorMessage);
    }

    if (method === 'DELETE') {
      return yield* onSuccess({status: 'SUCCESS'});
    }

    throw new Error('An error has occured');
  } catch (error) {
    console.warn('API error : API : ',url,' ERROR :' , error, ' status : ', error.response);
    // if api call fails because token has expired (in cases when user is away from screen for long)

    if (
      error &&
      error.response &&
      error.response.status &&
      parseInt(error.response.status) == 401
    ) {
      showToastr("Please login to continue");
      // yield put({ type: "USER_LOGOUT"});
      NavigationService.navigate("Login");
      LogFBEvent(ErrEvents.API_AUTH_ERROR, {api: url, errMsg: error.message, isError:true, httpCode: 401})
    }
    else {
      console.log('url at the  is  ,', url);
      LogFBEvent(ErrEvents.API_UNKNOWN_ERROR, {api: url, errMsg: error.message, isError:true, httpCode: error.response?error.response.status:408})
    }
    const errorMessage =
      (error.response &&
        error.response.data &&
        error.response.status &&
        error.response.data.errorMessage) ||
      error.message;
    return yield* onError(errorMessage, error);
  }
}
