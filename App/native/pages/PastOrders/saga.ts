import { all, fork, call, put, select, takeLatest } from "redux-saga/effects";
import { GetOrdersAction, GetOfferDetailsAction, CancelOrderAction,ReturnOrderAction,GetOrderDetailsAction }  from './types';
import { PASTORDERS_ACTION_TYPES } from './actions';
import { doHttp } from '../../../state/utils/ajax';
import { showToastr } from '../utils';
import { showAlert } from '../utils';
import * as LoaderActions from '../../../components/Loaders/actions';
import * as loginActions from '../../pages/Login/actions';
import * as groupActions from '../../pages/OrderConfirmation/actions';
import * as actions from './actions';
import NavigationService from '../../../utils/NavigationService';
import { ApiConstants, API_URL, ApiQueryConstants } from '../../../Constants';
import {LogFBEvent, ErrEvents} from '../../../Events';

const getState = state => state.pastOrders;

function *getOrderHistory(action: GetOrdersAction) {
  //const { page } = yield select(getState);
  const {page, group} = action.data;
  try {
    //yield put(LoaderActions.startLoading()); /* Load full screen loader */
    yield put(actions.changeField('loading', true));
    yield* doHttp({
        method: "GET",
        url: `${API_URL}/${ApiConstants.orderHistory}?size=${ApiQueryConstants.sizePastOrders}&page=${page}&group=${group}`,
        data: {
        },
        *onSuccess(res: any) {
            /* End full screen loader */
            if(res && !res.success){
                showToastr(res.errMsg);
                LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.orderHistory}`, errMsg: res.errMsg, isError:true, httpCode: 200})        
            }
            else {
                const { orders, page} = yield select(getState);
                let clubbedOrders;
                if(orders) {
                  clubbedOrders = orders.concat(res.data);
                }
                else {
                  clubbedOrders = res.data;
                }
                if(group) {
                  let contactList = [];
                  for(let i = 0; i < res.data.length; i++) {
                    contactList.push(res.data[i].contactNumber);
                  }
                  const uniqueItems = Array.from(new Set(contactList))
                  yield put(actions.changeField('friendsContactList', uniqueItems));
                }
                yield put(actions.setOrderHistory(clubbedOrders, res.count));
                yield put(actions.changeField('initialApiCallCompleted', true));
                yield put(actions.changeField('loading', false));
            }
        },
        *onError(err: any) {
          //Toast.show(err);
          //yield put(LoaderActions.endLoading()); /* End full screen loader */
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

function *cancelOrder(action: CancelOrderAction) {
  try {
    yield put(LoaderActions.startLoading()); /* Load full screen loader */
    yield* doHttp({
        method: "POST",
        url: `${API_URL}/${ApiConstants.cancelOrder}`,
        data: {
          id: action.data.id,
          paymentMode: action.data.transactionDetails.mode,
          amount: action.data.totalPrice
        },
        *onSuccess(res: any) {
            yield put(LoaderActions.endLoading()); /* End full screen loader */

            if(res && !res.success){
                showAlert(res.errMsg);
                LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.cancelOrder}`, errMsg: res.errMsg, isError:true, httpCode: 200})
               
            }
            else {
                showToastr('Order Cancelled Successfully!');
                yield put(actions.setOrderHistory(null, 0));
                yield put(actions.changeField('initialApiCallCompleted', false));
                yield put(actions.changeField('page', 1));
                // yield put(actions.getOrderHistory());
                yield put(groupActions.getGroupSummary());
                yield put({
                  type: 'home/SET_STATE',
                  payload: {
                    refreshRecentOrder: true,
                  },
                });
                NavigationService.goBack();
                //yield put(loginActions.getUserPreferences());
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

function *returnOrder(action: ReturnOrderAction) {
  try {
    yield put(LoaderActions.startLoading()); /* Load full screen loader */
    yield* doHttp({
        method: "POST",
        url: `${API_URL}/${ApiConstants.returnOrder}`,
        data: {
          id: action.data.id,
          paymentMode: action.data.transactionDetails.mode,
          amount: action.data.totalPrice,
          returnReason: action.data.returnReason
        },
        *onSuccess(res: any) {
            yield put(LoaderActions.endLoading()); /* End full screen loader */
            
            if(res && !res.success){
                showAlert(res.errMsg);
                LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.returnOrder}`, errMsg: res.errMsg, isError:true, httpCode: 200})
               
            }
            else {
                showToastr('Return request placed!');
                yield put(actions.setOrderHistory(null, 0));
                // yield put(actions.getOrderHistory());
                yield put(actions.changeField('initialApiCallCompleted', false));
                yield put(actions.changeField('page', 1));
                yield put(groupActions.getGroupSummary());
                NavigationService.goBack();
                //NavigationService.navigate('PastOrders');
                //yield put(loginActions.getUserPreferences());
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

function *getOfferDetails(action: GetOfferDetailsAction) {
  try {
    yield put({
      type: 'booking/SET_STATE',
      payload: {
        loading: true,
      },
    });
    yield* doHttp({
        method: "GET",
        url: `${API_URL}/${ApiConstants.getOfferDetails}?id=${action.data.id}`,
        data: {
          
        },
        *onSuccess(res: any) {
            yield put({
              type: 'booking/SET_STATE',
              payload: {
                loading: false,
              },
            });
            if(res && !res.success){
              showToastr(res.errMsg);
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.getOfferDetails}?id=${action.data.id}`, errMsg: res.errMsg, isError:true, httpCode: 200})
              
            }
            else {
              res.data.offerinvocations = res.data.offerInvocations[0];
              yield put({
                type: 'booking/GET_BOOKING',
                payload: res.data,
              });
              //yield put(loginActions.getUserPreferences());
              NavigationService.navigate('Booking');
            }
        },
        *onError(err: any) {
          //Toast.show(err);

          yield put({
            type: 'booking/SET_STATE',
            payload: {
              loading: false,
            },
          });

          yield put(LoaderActions.endLoading()); /* End full screen loader */
          console.log('error is ', err);
        }
      });
  } catch (err) {

    yield put({
      type: 'booking/SET_STATE',
      payload: {
        loading: false,
      },
    });
    
  if (err instanceof Error) {
    yield put(LoaderActions.endLoading()); /* End full screen loader */
    console.log('err is ', err)
  } else {
    yield put(LoaderActions.endLoading()); /* End full screen loader */
    console.log('Unknown error is ')
  }
  }
}

function *getOrderDetails(action: GetOrderDetailsAction) {
  try {
    yield put(LoaderActions.startLoading());
    yield put({
      type: 'shippingList/SET_STATE',
      payload: {
        loading:true,
      },
    });
    yield* doHttp({
        method: "GET",
        url: `${API_URL}/${ApiConstants.getOrderDetails}?id=${action.data.id}`,
        data: {
          
        },
        *onSuccess(res: any) {
            yield put(LoaderActions.endLoading());
            if(res && !res.success){
              showToastr(res.errMsg);
              LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {api: `${API_URL}/${ApiConstants.getOrderDetails}?id=${action.data.id}`, errMsg: res.errMsg, isError:true, httpCode: 200})
              
            }
            else {
              yield put({
                type: 'order_detail/GET_ORDER',
                payload: res.data,
              });
              NavigationService.navigate('OrderDetail');
            }
            yield put({
              type: 'shippingList/SET_STATE',
              payload: {
                loading:false,
              },
            });

        },
        *onError(err: any) {
          //Toast.show(err);
          yield put(LoaderActions.endLoading()); /* End full screen loader */
          console.log('error is ', err);
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              loading:false,
            },
          });

        }
      });
  } catch (err) {
  if (err instanceof Error) {
    yield put(LoaderActions.endLoading()); /* End full screen loader */
    yield put({
      type: 'shippingList/SET_STATE',
      payload: {
        loading:false,
      },
    });
    console.log('err is ', err)
  } else {
    yield put(LoaderActions.endLoading()); /* End full screen loader */
    yield put({
      type: 'shippingList/SET_STATE',
      payload: {
        loading:false,
      },
    });
    console.log('Unknown error is ')
  }
  }
}

function* watchFetchRequest() {
    yield takeLatest(PASTORDERS_ACTION_TYPES.GET_ORDER_HISTORY, getOrderHistory);
    yield takeLatest(PASTORDERS_ACTION_TYPES.GET_OFFER_DETAILS, getOfferDetails);
    yield takeLatest(PASTORDERS_ACTION_TYPES.GET_ORDER_DETAILS, getOrderDetails);
    yield takeLatest(PASTORDERS_ACTION_TYPES.CANCEL_ORDER, cancelOrder);
    yield takeLatest(PASTORDERS_ACTION_TYPES.RETURN_ORDER, returnOrder);
}

export default function* orderSaga() {
	yield all([fork(watchFetchRequest)]);
}
