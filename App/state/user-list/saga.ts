import { all, fork, call, put, select, takeLatest } from "redux-saga/effects";
import { AddUserAction }  from '../types';
import { USER_LIST_ACTION_TYPES } from './actions';
import { doHttp } from '../utils/ajax';

function* handleFetch(action: AddUserAction) {
	try {

        yield* doHttp({
            method: "POST",
            //url: `${config.ClientApiBaseUrl}/sso-login/oauth/revoke/${accessToken}`,
            url: `http://shopg.in/api/v1/auth/otp`,
            data: {phoneNumber: "9632672372"},
            headers: { "Content-Type": "application/json" },
            *onSuccess(res: any) {
              if (res.status === "SUCCESS") {
                console.log('response is ', res);
                // triggerEvent("Logout", {
                //   mobileNumber: mobileNumber
                // });
                // yield put(actions.setAccessToken(null));
                // yield put(actions.updateOtp(null));
                // yield put(AuthLoadingActions.setUserDetails({}));
                yield put(LoaderActions.endLoading());
                // NavigationService.navigate("Login");
              } else {
                // if (res && res.hasOwnProperty("errorMessage") && res.errorMessage) {
                  yield put(LoaderActions.endLoading());
                //   Toast.show(res.errorMessage);
                // } else Toast.show("Please try again later!");
              }
            },
            *onError(err: any) {
              //Toast.show(err);
              console.log('error is ', err);
            }
          });
		// const res: IPostRaw[] | any = yield call(
		// 	apiCaller,
		// 	action.meta.method,
		// 	action.meta.route
		// );

		//yield put(fetchPostsSuccess(res));
	} catch (err) {
		if (err instanceof Error) {
      //yield put(fetchPostsError(err.stack!));
      console.log('err is ', err)
		} else {
      console.log('Unknown error is ')
			//yield put(fetchPostsError("An unknown error occured."));
		}
	}
}

function* watchFetchRequest() {
	yield takeLatest(USER_LIST_ACTION_TYPES.ADD_USER, handleFetch);
}

export default function* userSaga() {
	yield all([fork(watchFetchRequest)]);
}