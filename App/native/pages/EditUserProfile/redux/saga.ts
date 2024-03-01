import {
    all,
    fork,
    call,
    put,
    select,
    takeLatest,
    takeEvery,
  } from 'redux-saga/effects';
  import {EditUserProfileAction} from './types';
  import {EDITUSERPROFILE_ACTION_TYPES} from './actions';
  import {doHttp} from '../../../../state/utils/ajax';
  import {showToastr} from '../../utils';
  import * as actions from './actions';
  import * as loginActions from '../../Login/actions';
  import * as myRewardsActions from '../../MyRewards/actions';
  import {LogFBEvent, ErrEvents} from '../../../../Events';
  import {ApiConstants, API_URL, API_ANALYTICS_URL} from '../../../../Constants';
  import NavigationService from '../../../../utils/NavigationService';
  
  function* checkPinCode(action: EDITUSERPROFILE_ACTION_TYPES) {
    try {
      yield* doHttp({
        method: 'GET',
        url: `${API_URL}/${ApiConstants.checkPinCode}?postalCode=${action.data.pincode}`,
        data: {},
        *onSuccess(res: any) {
          if (res && !res.success) {
            LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
              api: `${API_URL}/${ApiConstants.checkPinCode}`,
              errMsg: res.errMsg,
              isError: true,
              httpCode: 200,
            });
            yield put(actions.changeField('pincodedata', {
              pincodechecked: true,
              status: res.success,
              message: res.message,
            }));
            
          } else {
            let derivedLocalityData = res.localityData.map(element => {
              return {
                ...element,
                value: element.areaName
              };
            });
            yield put(actions.changeField('pincodedata', {
              pincodechecked: true,
              status: res.success,
              data: res.data,
              localityData: derivedLocalityData,
            }));
          }
        },
        *onError(err: any) {
          console.log('error is ', err);
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log('err is ', err);
      } else {
        console.log('Unknown error is ');
      }
    }
  }

  function* addAddress(action: EDITUSERPROFILE_ACTION_TYPES) {
    try {
      yield* doHttp({
        method: 'POST',
        url: `${API_URL}/${ApiConstants.addAddress}`,
        data: action.data.address,
        *onSuccess(res: any) {
          if (res && !res.success) {
            LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
              api: `${API_URL}/${ApiConstants.clOnboarding}`,
              errMsg: res.errMsg,
              isError: true,
              httpCode: 200,
            });
            showToastr(res.errMsg);
          } else {
            showToastr('Address added successfully!');
            yield put({
              type: 'booking/SET_STATE',
              payload: {
                primaryAddress: res.data,
              },
            });
          }
        },
        *onError(err: any) {
          console.log('error is ', err);
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log('err is ', err);
      } else {
        console.log('Unknown error is ');
      }
    }
  }
  
  function* watchFetchRequest() {
    yield takeLatest(EDITUSERPROFILE_ACTION_TYPES.CHECK_PINCODE, checkPinCode);
    yield takeLatest(EDITUSERPROFILE_ACTION_TYPES.ADD_ADDRESS, addAddress);
  }
  
  export default function* editProfileSaga() {
    yield all([fork(watchFetchRequest)]);
  }
  