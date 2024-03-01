import { all, fork, call, put, select, takeLatest, takeEvery } from "redux-saga/effects";
import { RewardAction }  from './types';
import { REWARD_ACTION_TYPES } from './actions';
import { doHttp } from '../../../state/utils/ajax';
import { showToastr } from '../utils';
import * as actions from './actions';
import * as homeActions from '../Home/redux/action';
import NavigationService from '../../../utils/NavigationService';
import { ApiConstants,API_URL } from '../../../Constants';
import {LogFBEvent, ErrEvents} from '../../../Events';

const getRewardsState = state => state.rewards;
const getHomeState = state => state.home;
function *getRewards(action) {
  try {
    yield put(actions.changeField('initialRewardsApiCallCompleted', false));
    yield put(actions.changeField('rewardsApiLoading', true));
    let url = `${API_URL}/${ApiConstants.rewards}?`;
    let {getCashback, getCoins, getScratchDetails, history, page, size} = action.data;
    let firstParam = true;
    if (getCashback) {
      url = url + `getRewards=${getCashback}`;
      firstParam = false;
    }
    if (getCoins) {
      if (firstParam) {
        url = url + `getCoins=${getCoins}`;
      } else {
        url = url + `&getCoins=${getCoins}`;
      }
      firstParam = false;
    }
    if (history) {
      if (firstParam) {
        url = url + `history=${history}`;
      } else {
        url = url + `&history=${history}`;
      }
      firstParam = false;
    }
    if (page) {
      if (firstParam) {
        url = url + `page=${page}`;
      } else {
        url = url + `&page=${page}`;
      }
      firstParam = false;
    }
    if (size) {
      if (firstParam) {
        url = url + `size=${size}`;
      } else {
        url = url + `&size=${size}`;
      }
      firstParam = false;
    }
    if (getScratchDetails) {
      if (firstParam) {
        url = url + `getScratchDetails=${getScratchDetails}`;
      } else {
        url = url + `&getScratchDetails=${getScratchDetails}`;
      }
      firstParam = false;
    }
    yield* doHttp({
        method: "GET",
        url: url,
        data: {},
        *onSuccess(res: any) {
            yield put(actions.changeField('initialRewardsApiCallCompleted', true));
            yield put(actions.changeField('rewardsApiLoading', false));
            if(res && !res.success){
              showToastr(res.errMsg);
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.rewards}`, errMsg: res.errMsg, isError:true, httpCode: 200})
                  }
            else {
              if((action.data.getCashback || action.data.getCoins) && !action.data.history){
                // const {cart,hasCart} = yield select(getHomeState);
                // if(hasCart){
                //   let tempRewards = {};
                //   Object.assign(tempRewards, res.data);
                //   tempRewards['totalBalance'] = {rewardsBalance:res.data.totalBalance.rewardsBalance,coinsBalance:(res.data.totalBalance.coinsBalance-cart.billing.coinsUsed)};
                //   yield put(actions.changeField('rewards', tempRewards));
                // } else {
                //   yield put(homeActions.GetCart());
                  yield put(actions.changeField('rewards', res.data));
                // }
                // yield put(actions.changeField('rewardsBackup', res.data));
              }
                
              if(action.data.getScratchDetails)
                yield put(actions.changeField('scratchCardRewards', res.data));
              if(action.data.history && action.data.getCashback) {
                const {cashbackHistory} = yield select(getRewardsState);
                let rewardsValue;
                if(cashbackHistory && Object.keys(cashbackHistory).length > 0) 
                   rewardsValue = cashbackHistory.rewardsDetails.concat(res.data.rewardsDetails);
                else 
                  rewardsValue = res.data.rewardsDetails;
                yield put(actions.changeField('cashbackHistory', {
                  data: res.data,
                  currentPage: page,
                  rewardsDetails: rewardsValue
                }));
              }  
              
              if(action.data.history && action.data.getCoins) {
                const {coinsHistory} = yield select(getRewardsState);
                let coinsValue;
                if(coinsHistory && Object.keys(coinsHistory).length > 0) 
                  coinsValue = coinsHistory.coinDetails.concat(res.data.coinDetails);
                else 
                  coinsValue = res.data.coinDetails;
                yield put(actions.changeField('coinsHistory', {
                  data: res.data,
                  currentPage: page,
                  coinDetails: coinsValue
                }));
              }  
            }
        },
        *onError(err: any) {
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

function* watchFetchRequest() {
    yield takeEvery(REWARD_ACTION_TYPES.GET_REWARDS, getRewards);
}

export default function* rewardsSaga() {
	yield all([fork(watchFetchRequest)]);
}
