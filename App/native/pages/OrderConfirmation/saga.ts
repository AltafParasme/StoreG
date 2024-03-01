import { all, fork, call, put, select, takeLatest } from "redux-saga/effects";
import { GroupSummaryAction }  from './types';
import { GROUPSUMMARY_ACTION_TYPES } from './actions';
import { doHttp } from '../../../state/utils/ajax';
import { showToastr } from '../utils';
import * as LoaderActions from '../../../components/Loaders/actions';
import * as actions from './actions';
import NavigationService from '../../../utils/NavigationService';
import { ApiConstants,API_URL } from '../../../Constants';
import {LogFBEvent, ErrEvents} from '../../../Events';

function *getGroupSummary(action: GroupSummaryAction) {
  try {
    /** implemented limit in case of showing members and their respective contacts in CL Business Member Screen */
    let {limit} = action.data;
    let url = `${API_URL}/${ApiConstants.groupSummary}?showGroupUsers=true&showOrderDetail=true&showReferralUsers=true`;
    url = limit  ? `${url}&limit=${limit}` :  `${url}&limit=50`;
    yield put(actions.changeField('loading', true)); 
    yield* doHttp({
        method: "GET",
        url: url,
        data: {
        },
        *onSuccess(res: any) {  
            if(res && !res.success){
                LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.groupSummary}`, errMsg: res.errMsg, isError:true, httpCode: 200})
                showToastr(res.errMsg);
                yield put(actions.changeField('loading', false)); 
            }
            else {
                yield put(actions.setGroupSummary(res.data));
                yield put(actions.changeField('initialApiCallCompleted', true));
                yield put(actions.changeField('loading', false));
            }
        },
        *onError(err: any) {
          yield put(actions.changeField('loading', false)); 
          console.log('error is ', err);
        }
      });
  } catch (err) {
  yield put(actions.changeField('loading', false)); 
  if (err instanceof Error) {
    console.log('err is ', err)
  } else {
    console.log('Unknown error is ')
  }
  }
  yield put(LoaderActions.endLoading());
}

function* watchFetchRequest() {
    yield takeLatest(GROUPSUMMARY_ACTION_TYPES.GET_GROUP_SUMMARY, getGroupSummary);
}

export default function* groupSummarySaga() {
	yield all([fork(watchFetchRequest)]);
}
