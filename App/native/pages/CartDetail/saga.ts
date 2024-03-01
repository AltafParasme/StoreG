import {all, fork, call, put, select, takeLatest} from 'redux-saga/effects';
import moment from 'moment';
import {doHttp} from '../../../state/utils/ajax';
import {CART_DETAILS_ACTION_TYPES, changeField} from './actions';
import {showToastr, removeData, setData, getData} from '../utils';
import NavigationService from '../../../utils/NavigationService';
import {LogFBEvent, ErrEvents, Events} from '../../../Events';
import * as LoaderActions from '../../../components/Loaders/actions';
import {ApiConstants, API_URL} from '../../../Constants';
import {AppConstants} from '../../../Constants';

// cartId amount
function* validateCart({payload}) {
    try {
      yield* doHttp({
        method: 'POST',
        url: `${API_URL}/${ApiConstants.validateCart}`,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
        *onSuccess(res) {
          if (!res.success) {
            LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
              api: `${API_URL}/payments/api/v1/initiation`,
              errMsg: res.errMsg,
              isError: true,
              httpCode: 200,
            });
          } else {
            if(res.data.status === 'SUCCESS') {
              yield put({
                type: 'booking/SET_STATE',
                payload: {
                  transactionToken: res.data.transactionTokn
                },
              }); 
            }
            else {
              // Paytm initiate api failed
              showToastr('Payment Attempt failed, please retry')
            }

          }
        },
        *onError(err) {
          //Toast.show(err);
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

function* initiatePayment({payload}) {
  try {
    yield* doHttp({
      method: 'POST',
      url: `${API_URL}/${ApiConstants.initiatePayment}`,
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
      *onSuccess(res) {
        if (!res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/payments/api/v1/initiation`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        } else {
          if(res.data.status === 'SUCCESS') {
            yield put({
              type: 'booking/SET_STATE',
              payload: {
                transactionToken: res.data.transactionTokn
              },
            }); 
          }
          else {
            // Paytm initiate api failed
            showToastr('Payment Attempt failed, please retry')
          }

        }
      },
      *onError(err) {
        //Toast.show(err);
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

function* validatePayment({payload}) {
    try {
      yield* doHttp({
        method: 'POST',
        url: `${API_URL}/${ApiConstants.validatePayment}`,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
        *onSuccess(res) {
          if (!res.success) {
            LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
              api: `${API_URL}/payments/api/v1/initiation`,
              errMsg: res.errMsg,
              isError: true,
              httpCode: 200,
            });
          } else {
            if(res.data.status === 'SUCCESS') {
              yield put({
                type: 'booking/SET_STATE',
                payload: {
                  transactionToken: res.data.transactionTokn
                },
              }); 
            }
            else {
              // Paytm initiate api failed
              showToastr('Payment Attempt failed, please retry')
            }

          }
        },
        *onError(err) {
          //Toast.show(err);
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

export default function* cartDetailSaga() {
  yield all([takeLatest(CART_DETAILS_ACTION_TYPES.VALIDATE_CART, validateCart)]);
  yield all([takeLatest(CART_DETAILS_ACTION_TYPES.VALIDATE_PAYMENT, validatePayment)]);
  yield all([takeLatest(CART_DETAILS_ACTION_TYPES.INITIATE_PAYMENT, initiatePayment)]);
}