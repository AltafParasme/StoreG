import { all, fork, call, put, select, takeLatest, takeEvery } from "redux-saga/effects";
import Config from "react-native-config";
import AsyncStorage from '@react-native-community/async-storage';
import { CurrentUserAction, LogoutAction }  from './types';
import { USERPROFILE_ACTION_TYPES } from './actions';
import { doHttp } from '../../../state/utils/ajax';
import { showToastr, removeData } from '../utils';
import * as LoaderActions from '../../../components/Loaders/actions';
import * as MyRewardsActions from '../MyRewards/actions';
import * as actions from './actions';
import * as loginActions from '../Login/actions';
import NavigationService from '../../../utils/NavigationService';
import { ApiConstants, API_URL } from '../../../Constants';
import { StackActions, NavigationActions } from "react-navigation";
import {LogFBEvent, ErrEvents} from '../../../Events';
import * as clActions from '../CLOnboarding/actions';

const getClConfigState = state => state.clOnboarding;

function *currentUser(action: CurrentUserAction) {
  try {
    yield put(LoaderActions.startLoading()); /* Load full screen loader */
    yield* doHttp({
        method: "GET",
      url: `${API_URL}/${ApiConstants.currentUser}`,
        data: {
        },
        *onSuccess(res: any) {
            yield put(actions.changeField('initialApiCallCompleted', true));
            yield put(LoaderActions.endLoading()); /* End full screen loader */
            if(res && !res.success){
              showToastr(res.errMsg);
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.currentUser}`, errMsg: res.errMsg, isError:true, httpCode: 200})
            }
            else {
                yield put(actions.setCurrentUser(res.data));
            }
        },
        *onError(err: any) {
          //Toast.show(err);
          yield put(LoaderActions.endLoading()); /* End full screen loader */
          console.log('error is ', err);
        }
      });
  } catch (err) {
  if (err instanceof Error) {
    yield put(LoaderActions.endLoading()); /* End full screen loader */
    console.log('err is ', err)
  } else {
    yield put(LoaderActions.endLoading()); /* End full screen loader */
    console.log('Unknown error is ')
  }
  }
}

function *logout(action: LogoutAction) {
  try {
    yield put(LoaderActions.startLoading()); /* Load full screen loader */
    console.log('Logout Data initialed ', LogoutAction );

    yield* doHttp({
        method: "POST",
      url: `${API_URL}/${ApiConstants.logout}`,
        data: {
        },
        *onSuccess(res: any) {
            yield put(LoaderActions.endLoading()); /* End full screen loader */
            removeData('accessToken');
            console.log('Logout Data ', res);
            if(res && !res.success){
              yield put(loginActions.changeField('isLoggedIn', true));
              yield put({ type: "USER_LOGOUT"});
              console.log('Logout Data fails ', res.success);
              showToastr(res.errMsg);
              // NavigationService.navigate('Login');
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.logout}`, errMsg: res.errMsg, isError:true, httpCode: 200})
             }
            else {
              console.log('Logout Data ', res.message);
              yield put(loginActions.changeField('isLoggedIn', true));
              yield put({ type: "USER_LOGOUT"});
              showToastr("You are logged out successfully");
            }
            NavigationService.navigate('Splash');
        },
        *onError(err: any) {
          console.log('error is ', err);
          yield put(LoaderActions.endLoading()); /* End full screen loader */
        }
      });
  } catch (err) {
      if (err instanceof Error) {
        yield put(LoaderActions.endLoading()); /* End full screen loader */
        console.log('error is ', err)
      } else {
        yield put(LoaderActions.endLoading()); /* End full screen loader */
        console.log('error is  ', err)
      }
  }
}

function* editProfile({payload}) {
  console.log('17-> payload', payload);
  try {
    yield put(LoaderActions.startLoading());
    yield* doHttp({
      method: 'POST',
      url: `${API_URL}/api/v1/user/edit`,
      data: payload,
      *onSuccess(res: any) {
        if (!res.success) {
          yield put(LoaderActions.endLoading());
          showToastr(res.message);
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/api/v1/user/edit`, errMsg: res.errMsg, isError:true, httpCode: 200})
        } else {
          showToastr(res.message);
          yield put(actions.setCurrentUser(res.data));
          yield put(LoaderActions.endLoading());
          const {isCLCreationApiCalled} = yield select(getClConfigState);
          if(isCLCreationApiCalled)
          NavigationService.navigate('MyOrderBusinessCheckout');
          else 
          NavigationService.navigate('UserProfile');
        }
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
        yield put(LoaderActions.endLoading());
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
    yield takeLatest(USERPROFILE_ACTION_TYPES.CURRENT_USER, currentUser);
    yield takeLatest(USERPROFILE_ACTION_TYPES.EDIT_PROFILE, editProfile);
    yield takeLatest(USERPROFILE_ACTION_TYPES.LOGOUT, logout);
}

export default function* userProfileSaga() {
	yield all([fork(watchFetchRequest)]);
}
