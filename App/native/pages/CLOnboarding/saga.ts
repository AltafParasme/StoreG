import {
  all,
  fork,
  call,
  put,
  select,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import {CLFlowAction, GetUserSegmentsAction} from './types';
import {CL_FLOW_ACTION_TYPES} from './actions';
import {doHttp} from '../../../state/utils/ajax';
import {showToastr} from '../utils';
import * as actions from './actions';
import * as loginActions from '../Login/actions';
import * as myRewardsActions from '../MyRewards/actions';
import {LogFBEvent, ErrEvents} from '../../../Events';
import {ApiConstants, API_URL, API_ANALYTICS_URL} from '../../../Constants';
import NavigationService from '../../../utils/NavigationService';

const getGroupState = state => state.groupSummary;
const getLoginState = state => state.login;
const getClConfigState = state => state.clOnboarding;

function* getStarterKit(action: CLFlowAction) {
  try {
    yield* doHttp({
      method: 'GET',
      url: `${API_URL}/${ApiConstants.clOnboarding}`,
      data: {},
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
          yield put(actions.changeField('clConfigFetched', true));
          yield put(actions.changeField('clConfig', res.data));
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

function* getUserSegments(action: GetUserSegmentsAction) {
  try {
    const {groupDetails} = yield select(getGroupState);
    const {userPreferences, clDetails} = yield select(getLoginState);

    const groupCode = groupDetails && groupDetails.info.groupCode;
    const clType = clDetails && clDetails.clConfig && clDetails.clConfig.clType;
    const userMode = userPreferences && userPreferences.userMode;
    const taskType = action.data.taskType;
    const userSegment = action.data.userSegment;

    let url = `${API_URL}/${ApiConstants.getUserSegment}?groupCode=${groupCode}&userMode=${userMode}&clType=${clType}&taskType=${taskType}`;
    url = userSegment ? `${url}&userSegment=${userSegment}` : url;
    yield* doHttp({
      method: 'GET',
      url: url,
      data: {},
      *onSuccess(res: any) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/${ApiConstants.getUserSegment}`,
            errMsg: res.errMsg,
            isError: true,
          });
          showToastr(res.errMsg);
        } else {
          const {userSegmentData} = yield select(getClConfigState);
          yield put(
            actions.changeField('userSegmentData', {
              ...userSegmentData,
              [taskType]: res.data,
            })
          );
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

function* getTaskDetails(action: CLFlowAction) {
  let isEarnCoins = action.data.isEarnCoins;
  try {
    yield put(actions.changeField('isTaskLoading', true));
    const {clDetails, userPreferences} = yield select(getLoginState);
    const userMode =
      userPreferences && userPreferences.userMode
        ? userPreferences.userMode
        : 'CL';
    const clType = isEarnCoins
      ? 'EARN_COINS'
      : clDetails && clDetails.clConfig && clDetails.clConfig.clType;
    const whatsAppLink = clDetails && clDetails.clConfig && clDetails.clConfig.whatsAppLink;

    let taskUrl =
      API_ANALYTICS_URL +
      '/' +
      ApiConstants.getTaskList +
      `?userType=${userMode}&userSegment=${clType}`;
    yield* doHttp({
      method: 'GET',
      url: taskUrl,
      headers: {'Content-Type': 'application/json'},
      data: {},
      *onSuccess(res: any) {
        yield put(actions.changeField('isTaskLoading', false));
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: taskUrl,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(res.errMsg);
        } else {
          if (isEarnCoins) {
            let data = res.data;
            const isJoinWhatsAppGroupTask = whatsAppLink && whatsAppLink != '' && userMode === 'CU';
            if(!isJoinWhatsAppGroupTask) {
              data = data.filter((item) => {
                return (item.taskName != 'JoinWhatsAppGroup')
              })
            }
            
            yield put(myRewardsActions.changeField('earnCoins', data));
          } else {
            let PendingTaskData = [];
            let CompletedTaskData = [];
            res.data.map((item, index) => {
              const dataItem = Object.assign(
                {
                  isExpanded: false,
                },
                item
              );
              if (item.isDone) {
                CompletedTaskData.push(dataItem);
              } else {
                PendingTaskData.push(dataItem);
              }
            });
            let TaskData = PendingTaskData.concat(CompletedTaskData);

            if (TaskData && TaskData.length) {
              TaskData[0]['isExpanded'] = true;

              const isDoneTasks =
                TaskData && TaskData.filter(item => item.isDone);
              const lenDoneTasks = isDoneTasks ? isDoneTasks.length : 0;
              yield put(actions.changeField('lenDoneTasks', lenDoneTasks));
              let isTaskComplete =
                (TaskData &&
                  TaskData.length &&
                  TaskData.length - lenDoneTasks) == 0
                  ? true
                  : false;
              if (isTaskComplete) {
                yield put(actions.changeField('isTaskComplete', true));
              }

              yield put(actions.changeField('TaskData', TaskData));
              let actionData = {};
              for (let i = 0; i < TaskData.length; i++) {
                let taskType = TaskData[i].task.taskType;
                actionData[taskType] = TaskData[i].actionData ;
              }
              yield put(actions.changeField('actionData', actionData));
            }
          }
        }
      },
      *onError(err: any) {
        yield put(actions.changeField('isTaskLoading', false));
        console.log('error is ', err);
      },
    });
  } catch (err) {
    yield put(actions.changeField('isTaskLoading', false));
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
  }
}

function* getShareFeedback(action: CLFlowAction) {
  let {userType, page, type} = action.data;
  try {
    let feedbackUrl = `${API_URL}/${ApiConstants.shareFeedback}?type=${type}&size=5&userType=${userType}&page=${page}`;
    yield put(actions.changeField('isShareFeedbackLoading', true));
    yield* doHttp({
      method: 'GET',
      url: feedbackUrl,
      headers: {'Content-Type': 'application/json'},
      data: {},
      *onSuccess(res: any) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: feedbackUrl,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(res.errMsg);
        } else {
          res.data.forEach((item) => {
            item['id'] = item.orderId;
          });
          yield put(actions.changeField('positiveFeedbacks', res.data));
        }
        yield put(actions.changeField('isShareFeedbackLoading', false));
      },
      *onError(err: any) {
        console.log('error is ', err);
        yield put(actions.changeField('isShareFeedbackLoading', false));
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
    yield put(actions.changeField('isShareFeedbackLoading', false));
  }
}

function* getDhamakaCashback(action: CLFlowAction) {
  let {tnc, clUsers} = action.data;
  try {
    let dhamakaCashbackUrl = `${API_URL}/${ApiConstants.dhamakaCashback}?tnc=${tnc}&clUsers=${clUsers}`;
    yield put(actions.changeField('isTaskDhamakaLoading', true));
    yield* doHttp({
      method: 'GET',
      url: dhamakaCashbackUrl,
      headers: {'Content-Type': 'application/json'},
      data: {},
      *onSuccess(res: any) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: dhamakaCashbackUrl,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(res.errMsg);
        } else {
          yield put(actions.changeField('dhamakaCashbackDetails', res.data));
        }
        yield put(actions.changeField('isTaskDhamakaLoading', false));
      },
      *onError(err: any) {
        console.log('error is ', err);
        yield put(actions.changeField('isTaskDhamakaLoading', false));
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
    yield put(actions.changeField('isTaskDhamakaLoading', false));
  }
}

function* getRequestFeedback(action: CLFlowAction) {
  let {userType, mode} = action.data;
  let page = action.data.page || 1;
  let type = action.data.type;
  try {
    yield put(actions.changeField('isRequestFeedbackLoading', true));
    let feedbackUrl = `${API_URL}/${ApiConstants.feedback}/request?type=${mode ? mode : 'order'}&size=5&userType=${userType}&page=${page}`;
    
    yield* doHttp({
      method: 'GET',
      url: feedbackUrl,
      headers: {'Content-Type': 'application/json'},
      data: {},
      *onSuccess(res: any) {
        yield put(actions.changeField('isRequestFeedbackLoading', false));
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: feedbackUrl,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(res.errMsg);
        } else {
          if(mode == 'shipment'){
            yield put(actions.changeField('requestFeedbackOrdersCL', res.data));
          } else {
            yield put(actions.changeField('requestFeedbackOrders', res.data));
          }
          
        }
      },
      *onError(err: any) {
        yield put(actions.changeField('isRequestFeedbackLoading', false));
        console.log('error is ', err);
      },
    });
  } catch (err) {
    yield put(actions.changeField('isRequestFeedbackLoading', false));
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
  }
}

function* updateCLConfig(action: CLFlowAction) {
  try {
    const {whatsAppLink} = action.data.inputBody;
    yield put(actions.changeField('isCLConfigLoading', true));
    yield* doHttp({
      method: 'PUT',
      url: `${API_URL}/${ApiConstants.clOnboarding}`,
      data: {
        whatsAppLink: whatsAppLink,
      },
      *onSuccess(res: any) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/${ApiConstants.clOnboarding}`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          yield put(actions.changeField('isCLConfigLoading', false));
          showToastr(res.errMsg);
        } else {
          showToastr(`Your WhatsAppGroup link is updated!`);
          yield put(actions.changeField('isCLConfigUpdated', true));
          yield put(actions.changeField('isCLConfigLoading', false));
          action.data.successCallBack();
        }
      },
      *onError(err: any) {
        console.log('error is ', err);
        yield put(actions.changeField('isCLConfigLoading', false));
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
    yield put(actions.changeField('isCLConfigLoading', false));
  }
}

function* createCL(action: CLFlowAction) {
  try {
    const {inputBody} = action.data;
    let {userPreferences} = yield select(getLoginState);

    yield* doHttp({
      method: 'POST',
      url: `${API_URL}/${ApiConstants.clCreation}`,
      data: inputBody,
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
          yield put(actions.changeField('isCLCreationApiCalled', true));
          yield put(loginActions.getCLDetails());
          userPreferences.userMode = 'CL';
          yield put(
            loginActions.changeField('userPreferences', userPreferences)
          );
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

function* clMembers(action: CLFlowAction) {
  try {
    yield put(actions.changeField('loadingMembersData', true));
    yield* doHttp({
      method: 'GET',
      url: `${API_URL}/${ApiConstants.clMembers}?size=100&page=1&startDate=${action.data.startDate}&endDate=${action.data.endDate}`,
      data: {
      },
      *onSuccess(res: any) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/${ApiConstants.clOnboarding}`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(res.errMsg);
          yield put(actions.changeField('loadingMembersData', false));
        } else {
          yield put(actions.changeField('clUsers', res.data));
          yield put(actions.changeField('loadingMembersData', false));
        }
      },
      *onError(err: any) {
        console.log('error is ', err);
        yield put(actions.changeField('loadingMembersData', false));
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
      yield put(actions.changeField('loadingMembersData', false));
    } else {
      console.log('Unknown error is ');
      yield put(actions.changeField('loadingMembersData', false));
    }
  }
}

function* clLeaderboard(action: CLFlowAction) {
  try {
    let url = action.data.dateRange ? `${API_URL}/${ApiConstants.clLeaderboard}?dateRange=${action.data.dateRange}` : `${API_URL}/${ApiConstants.clLeaderboard}`;
    yield put(actions.changeField('loadingLeaderboardData', true));
    yield* doHttp({
      method: 'GET',
      url: url,
      data: {
      },
      *onSuccess(res: any) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/${ApiConstants.clOnboarding}`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(res.errMsg);
          yield put(actions.changeField('loadingLeaderboardData', false));
        } else {
          yield put(actions.changeField('clLeaderboardData', res.data));
          yield put(actions.changeField('loadingLeaderboardData', false));
        }
      },
      *onError(err: any) {
        console.log('error is ', err);
        yield put(actions.changeField('loadingLeaderboardData', false));
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
      yield put(actions.changeField('loadingLeaderboardData', false));
    } else {
      console.log('Unknown error is ');
      yield put(actions.changeField('loadingLeaderboardData', false));
    }
  }
}

function* watchFetchRequest() {
  yield takeLatest(CL_FLOW_ACTION_TYPES.GET_STARTER_KIT, getStarterKit),
  yield takeEvery(CL_FLOW_ACTION_TYPES.GET_USER_SEGMENTS, getUserSegments),
  yield takeLatest(CL_FLOW_ACTION_TYPES.GET_TASK_DATA, getTaskDetails),
  yield takeLatest(CL_FLOW_ACTION_TYPES.GET_REQUEST_FEEDBACK, getRequestFeedback),
  yield takeLatest(CL_FLOW_ACTION_TYPES.GET_SHARE_FEEDBACK, getShareFeedback),
  yield takeLatest(CL_FLOW_ACTION_TYPES.GET_DHAMAKA_CASHBACK, getDhamakaCashback),
  yield takeLatest(CL_FLOW_ACTION_TYPES.PUT_CL_CONFIG, updateCLConfig),
  yield takeLatest(CL_FLOW_ACTION_TYPES.CREATE_CL, createCL),
  yield takeLatest(CL_FLOW_ACTION_TYPES.CL_MEMBERS, clMembers);
  yield takeLatest(CL_FLOW_ACTION_TYPES.CL_LEADERBOARD, clLeaderboard);
}

export default function* clOnboardingSaga() {
  yield all([fork(watchFetchRequest)]);
}
