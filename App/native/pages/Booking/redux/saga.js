import {all, fork, call, put, select, takeLatest} from 'redux-saga/effects';
import moment from 'moment';
import {doHttp} from '../../../../state/utils/ajax';
import action from './actions';
import {CART_DETAILS_ACTION_TYPES} from '../../CartDetail/actions';
import * as loginActions from '../../Login/actions';
import * as groupActions from '../../OrderConfirmation/actions';
import * as cartActions from '../../CartDetail/actions';
import {pincodeValid} from '../../../../utils/validators';
import {showToastr} from '../../utils';
import NavigationService from '../../../../utils/NavigationService';
import AsyncStorage from '@react-native-community/async-storage';
import {LogFBEvent, ErrEvents, Events} from '../../../../Events';
import * as LoaderActions from '../../../../components/Loaders/actions';
import {NavigationActions} from 'react-navigation';
import {ApiConstants, API_URL, API_PAYMENTS_URL} from '../../../../Constants';
import {removeData, setData, getData} from '../../utils';
import {AppConstants} from '../../../../Constants';
import i18n from '../../../../../i18n';
import {isFreeGiftCategory, getL10s} from '../../../../utils';

const getState = state => state.booking;
const getHomeState = state => state.home;
const getLoginState = state => state.login;
const getGroupState = state => state.groupSummary;

let globalEntityId = '';
function* GET_BOOKING({payload, index}) {
  yield put({
    type: 'booking/SET_STATE',
    payload: {
      booking: payload,
      index: index ? index : 0,
      quantity: 1,
    },
  });
}

function* SELECT_ADDRESS({payload}) {
  const {userPreferences} = yield select(getLoginState);
  AsyncStorage.setItem(
    `address-${userPreferences.uid}`,
    JSON.stringify(payload)
  );
  // AsyncStorage.getItem(`address-${userPreferences.uid}`).then(res => {
  // });
}

function* SET_PRODUCT({payload}) {
  const {list} = yield select(getHomeState);
  // TODO Why always search in hot-deals
  let data = list['hot-deals'] || {};
  const index =
    data && data.data && data.data.findIndex(item => item.id == payload);
  if (index >= 0) {
    yield put({
      type: 'booking/SET_STATE',
      payload: {
        booking: data.data[index],
        quantity: 1,
      },
    });
  }
}

function* UPDATE_ADDRESS({payload}) {
  const {selectedLocality} = yield select(getState);
  let sendData = {};
  sendData['deliveryAddressId'] = payload.addressID;
  sendData['localityId'] = selectedLocality.id;
  try {
    yield put({
      type: 'booking/SET_STATE',
      payload: {
        loading: true,
      },
    });
    yield put({
      type: 'home/SET_STATE',
      payload: {
        loadingCart: true,
      },
    });

    yield* doHttp({
      method: 'POST',
      url: `${API_URL}/api/v1/user/update-address`,
      data: sendData,
      headers: {
        'Content-Type': 'application/json',
      },

      *onSuccess(res) {
        yield put({
          type: 'booking/SET_STATE',
          payload: {
            isLoading: false,
          },
        });

        yield put({
          type: 'home/SET_STATE',
          payload: {
            loadingCart: false,
          },
        });

        if (!res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/api/v1/user/update-address`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        } else {
          yield put({
            type: 'booking/GET_ADDRESS',
          });

          yield put({
            type: 'booking/SET_STATE',
            payload: {
              addressUpdated: true,
            },
          });
        }
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
        yield put({
          type: 'booking/SET_STATE',
          payload: {
            isLoading: false,
          },
        });

        yield put({
          type: 'home/SET_STATE',
          payload: {
            loadingCart: false,
          },
        });
      },
    });
  } catch (err) {
    yield put({
      type: 'booking/SET_STATE',
      payload: {
        isLoading: false,
      },
    });

    yield put({
      type: 'home/SET_STATE',
      payload: {
        loadingCart: false,
      },
    });
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
  }
}

function* ADD_ADDRESS({payload}) {
  const {location} = yield select(getHomeState);
  const {selectedLocality} = yield select(getState);
  let sendData = payload.address;
  sendData['latitude'] = location.lat;
  sendData['longitude'] = location.lng;
  sendData['gpsData'] = location.gpsData;
  sendData['localityId'] = selectedLocality.id;

  try {
    yield put({
      type: 'booking/SET_STATE',
      payload: {
        loading: true,
      },
    });
    yield put({
      type: 'home/SET_STATE',
      payload: {
        loadingCart: true,
      },
    });

    yield* doHttp({
      method: 'POST',
      url: `${API_URL}/api/v1/user/add-address`,
      data: sendData,
      headers: {
        'Content-Type': 'application/json',
      },

      *onSuccess(res) {
        if (!res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/api/v1/user/add-address`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        } else {
          yield put({
            type: 'booking/SELECT_ADDRESS',
            payload: {
              ...res.data,
            },
          });

          yield put({
            type: 'booking/SET_STATE',
            payload: {
              isLoading: false,
              addressField: res.data,
              newAddressAdded: true,
            },
          });

          yield put({
            type: 'home/SET_STATE',
            payload: {
              loadingCart: false,
            },
          });

          yield put({
            type: 'booking/GET_ADDRESS',
          });

          const {booking, quantity, selectedSize} = yield select(getState);
          if (Object.keys(booking).length > 0 && isFreeGiftCategory(booking)) {
            const {activeCategoryTab} = yield select(getHomeState);
            const bookingData = {
              name: booking.mediaJson.title.text,
              addressId: res.data.id,
              useRewards: booking.useRewards || 0,
              orderAmount: booking.orderAmount || 0,
              quantity: quantity,
              offerId: booking.offerinvocations.offerId,
              invocationId: booking.offerinvocations.id,
              category: activeCategoryTab,
              size: selectedSize,
              colour: '',
              weight: '',
            };

            yield put({
              type: 'booking/BOOK_PRODUCT',
              payload: bookingData,
            });
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

function* CHECK_PIN({payload}) {
  try {
    yield put({
      type: 'booking/SET_STATE',
      payload: {
        pinLoading: true,
      },
    });
    if (pincodeValid(payload.pin)) {
      let commonUrl = `${API_URL}/api/v1/postal-code?postalCode=${payload.pin}`;
      let url = payload.offerId
        ? `${commonUrl}&offerId=${payload.offerId}`
        : commonUrl;
      yield* doHttp({
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },

        *onSuccess(res) {
          if (payload.fromAddress) {
            yield put({
              type: 'booking/SET_STATE',
              payload: {
                localityData: [],
                showSearchModal: true,
              },
            });
          }
          if (res.success) {
            yield put({
              type: 'booking/SET_STATE',
              payload: {
                pinLoading: false,
                status: res.success,
                message: res.message,
                pinCodeChecked: res.data,
                localityData: res.localityData,
              },
            });
            LogFBEvent(Events.PDP_IN_SERVICE_AREA, {
              pinCode: payload.pin,
              message: res.message,
            });
            // payload.callback(true)
          } else {
            yield put({
              type: 'booking/SET_STATE',
              payload: {
                pinLoading: false,
                status: res.success,
                message: res.message,
                pinCodeChecked: undefined,
              },
            });
            LogFBEvent(Events.PDP_OUT_OF_SERVICE_AREA, {
              pinCode: payload.pin,
              error: res.message,
            });
            // payload.callback(false)
          }
        },
        *onError(err) {
          //Toast.show(err);
          console.log('error is ', err);
          // payload.callback(false)
        },
      });
    } else {
      // payload.callback(false)
      yield put({
        type: 'booking/SET_STATE',
        payload: {
          pinLoading: false,
          status: false,
          message: undefined,
          pinCodeChecked: undefined,
        },
      });
    }
  } catch (err) {
    // payload.callback(false)
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
  }
}

function* getEntityDetails({data}) {
  try {
    const {entityType} = data;
    const entityId = data.entityId ? data.entityId : '';
    if (!entityId) return;
    if (entityId === globalEntityId) return;
    globalEntityId = entityId;
    let entityDetailsHolder = '';
    if (entityType === 'offers') {
      entityDetailsHolder = 'entityDetails';
    } else {
      entityDetailsHolder = 'essentialEntityDetails';
    }

    let url = `${API_URL}/${ApiConstants.getEntityDetails}?entityType=${entityType}&entityId=${entityId}`;
    yield put({
      type: 'booking/SET_STATE',
      payload: {
        entityDetailsApiLoading: true,
      },
    });

    yield* doHttp({
      method: 'GET',
      url: url,
      data: {},
      *onSuccess(res: any) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/${ApiConstants.getEntityDetails}`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          yield put({
            type: 'booking/SET_STATE',
            payload: {
              entityDetails: {},
              entityDetailsApiLoading: false,
            },
          });
        } else {
          console.log(res);
          if (
            res.recommendation &&
            res.recommendation.rows &&
            res.recommendation.rows.length
          ) {
            let dataTranslation = getL10s(res.recommendation.rows);
            i18n.addResourceBundle(
              'kannada',
              'translation',
              dataTranslation.Kannada
            );
            i18n.addResourceBundle(
              'hindi',
              'translation',
              dataTranslation.Hindi
            );
          }

          yield put({
            type: 'booking/SET_STATE',
            payload: {
              [entityDetailsHolder]: res,
              entityDetailsApiLoading: false,
            },
          });
        }
      },
      *onError(err: any) {
        // yield put(actions.changeField('loading', false));
        console.log('error is ', err);
        yield put({
          type: 'booking/SET_STATE',
          payload: {
            entityDetailsApiLoading: false,
          },
        });
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
      yield put({
        type: 'booking/SET_STATE',
        payload: {
          entityDetailsApiLoading: false,
        },
      });
    } else {
      console.log('Unknown error is ');
      yield put({
        type: 'booking/SET_STATE',
        payload: {
          entityDetailsApiLoading: false,
        },
      });
    }
  }
}

function* GET_ADDRESS({payload}) {
  const {selectedAddress} = yield select(getState);
  try {
    yield put({
      type: 'booking/SET_STATE',
      payload: {
        isLoading: true,
      },
    });
    yield* doHttp({
      method: 'GET',
      url: `${API_URL}/api/v1/user/address-list`,
      headers: {
        'Content-Type': 'application/json',
      },
      *onSuccess(res) {
        if (!res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/api/v1/user/address-list`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        }
        yield put({
          type: 'booking/SET_STATE',
          payload: {
            isLoading: false,
            newAddressAdded: false,
            address: res.data,
            addressListApiCompleted: true,
            primaryAddress: res.data[0],
            selectedAddress:
              Object.entries(selectedAddress).length !== 0
                ? res.data[
                    res.data.findIndex(
                      obj => obj.addressName === selectedAddress.addressName
                    )
                  ]
                : res.data[0] || {},
          },
        });
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

function* BOOK_PRODUCT({payload}) {
  try {
    console.log('Booking payload', payload);
    yield put(LoaderActions.startLoading());
    const url = `${API_URL}/api/v2/order/create`;
    yield put({
      type: 'booking/SET_STATE',
      payload: {
        BookLoading: true,
      },
    });
    yield* doHttp({
      method: 'POST',
      url: url,
      data: payload,
      *onSuccess(res) {
        if (!res.success) {
          yield put(LoaderActions.endLoading());
          showToastr(res.message, 7000, 'top', 'warning');
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: url,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        } else {
          setData(AppConstants.timerRemoved, 'yes');

          yield put({
            type: 'home/SET_STATE',
            payload: {
              refreshRecentOrder: true,
            },
          });
          const deliveryDate = moment(res.data.deliveryDate).format(
            'DD/MM/YYYY'
          );
          if (payload.orderAmount + payload.useRewards > 0) {
            NavigationService.navigate('OrderConfirmation');
          } else {
            // yield put(loginActions.getUserPreferences(true));
            NavigationService.navigate('FreeGift');
          }
          //yield put(groupActions.getGroupSummary());
          yield put(LoaderActions.endLoading());

          LogFBEvent(Events.PDP_SCREEN_PURCHASE_SUCCESS, payload);
        }
        yield put({
          type: 'booking/SET_STATE',
          payload: {
            BookLoading: false,
          },
        });
      },
      *onError(err) {
        yield put(LoaderActions.endLoading());
        //Toast.show(err);
        console.log('error is ', err);
        showToastr(
          'Unknown error from Nyota, Please retry after sometime.' + err,
          'top',
          'warning'
        );
        yield put({
          type: 'booking/SET_STATE',
          payload: {
            BookLoading: false,
          },
        });
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
    yield put(LoaderActions.endLoading());
    showToastr(
      'Unknown error from Nyota, Please retry after sometime.' + err,
      'top',
      'warning'
    );
    yield put({
      type: 'booking/SET_STATE',
      payload: {
        BookLoading: false,
      },
    });
  }
}

function* initiatePayment(payload) {
  if (!payload.data.obj) return;

  yield put({
    type: 'home/SET_STATE',
    payload: {
      loadingPayments: true,
    },
  });

  try {
    yield* doHttp({
      method: 'POST',
      url: `${API_PAYMENTS_URL}/${ApiConstants.initiatePayment}`,
      data: payload.data.obj,
      headers: {
        'Content-Type': 'application/json',
      },
      *onSuccess(res) {
        yield put({
          type: 'home/SET_STATE',
          payload: {
            loadingPayments: false,
          },
        });
        if (!res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_PAYMENTS_URL}/payments/api/v1/initiation`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          payload.data.callback(null, null, 'response false');
        } else {
          if (
            res &&
            res.data &&
            res.data.responseObj &&
            res.data.responseObj.id &&
            res.data.providerResponse &&
            res.data.providerResponse.keyId
          )
            payload.data.callback(
              res.data.responseObj.id,
              res.data.providerResponse.keyId,
              ''
            );
          else payload.data.callback(null, null, 'order id not found');
        }
      },
      *onError(err) {
        yield put({
          type: 'home/SET_STATE',
          payload: {
            loadingPayments: false,
          },
        });
        payload.data.callback(null, null, err);
      },
    });
  } catch (err) {
    yield put({
      type: 'home/SET_STATE',
      payload: {
        loadingPayments: false,
      },
    });
    if (err instanceof Error) {
      payload.data.callback(null, null, err);
    } else {
      payload.data.callback(null, null, 'Unknown error is ');
    }
  }
}

function* validatePayment(payload) {
  if (!payload.data) return;

  try {
    yield* doHttp({
      method: 'POST',
      url: `${API_PAYMENTS_URL}/${ApiConstants.validatePayment}`,
      data: payload.data,
      headers: {
        'Content-Type': 'application/json',
      },
      *onSuccess(res) {
        if (!res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_PAYMENTS_URL}/${ApiConstants.validatePayment}`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(
            res.errMsg ||
              'Payment Attempt failed, please retry or choose pay on delivery'
          );
        } else {
          if (res.data.status === 'SUCCESS') {
            yield put(
              cartActions.changeField(
                'transactionToken',
                res.data.transactionTokn
              )
            );
            yield put(
              cartActions.changeField(
                'internalTransactionId',
                res.data.internalTransactionId
              )
            );
            yield put(cartActions.changeField('transactionInitiated', true));
          } else {
            // Paytm initiate api failed
            showToastr(
              res.errMsg ||
                'Payment Attempt failed, please retry or choose pay on delivery'
            );
          }
        }
      },
      *onError(err) {
        showToastr(err);
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

function* validateCart(payload) {
  if (!payload.data.cartId || !payload.data.pincode) return;
  yield put(LoaderActions.startLoading());

  try {
    yield* doHttp({
      method: 'GET',
      url: `${API_URL}/${ApiConstants.validateCart}&cartId=${payload.data.cartId}&pinCode=${payload.data.pincode}`,
      headers: {
        'Content-Type': 'application/json',
      },
      *onSuccess(res) {
        if (!res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/${ApiConstants.validateCart}`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          yield put({
            type: 'booking/SET_STATE',
            payload: {
              pinLoading: false,
              status: res.success,
              message: res.message,
              pinCodeChecked: undefined,
            },
          });
          yield put(cartActions.changeField('cartError', res.data));
          const toasterMessage =
            res && res.data && res.data.length && res.data[0].message
              ? res.data[0].message
              : 'Something went wrong, Please try again later';
          showToastr(toasterMessage);
          yield put(LoaderActions.endLoading());
          payload.data.callback(false);
        } else {
          yield put({
            type: 'booking/SET_STATE',
            payload: {
              pinLoading: false,
              status: res.success,
              message: res.message,
              pinCodeChecked: res.data,
            },
          });
          yield put(cartActions.changeField('isCartValid', true));
          yield put(LoaderActions.endLoading());
          payload.data.callback(true);
        }
      },
      *onError(err) {
        showToastr(err);
        yield put(LoaderActions.endLoading());
        console.log('error is ', err);
        payload.data.callback(false);
      },
    });
  } catch (err) {
    payload.data.callback(false);
    if (err instanceof Error) {
      yield put(LoaderActions.endLoading());
      console.log('err is ', err);
    } else {
      yield put(LoaderActions.endLoading());
      console.log('Unknown error is ');
    }
  }
}

function* GET_ENTITY_BARCODEID(payload) {
  if (!payload.data.searchBarCodeId) return;

  try {
    let url = `${API_URL}/${ApiConstants.barcodeSearch}?searchBarCodeId=${payload.data.searchBarCodeId}`;
    yield* doHttp({
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      *onSuccess(res) {
        if (!res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/${ApiConstants.barcodeSearch}`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(res.errMsg);
        } else {
          if (res.data.type == 'offer') {
            yield put({
              type: 'booking/GET_BOOKING',
              payload: res.data.rows[0],
            });
            NavigationService.navigate('Booking');
          } else if (res.data.type == 'awb') {
            yield put({
              type: 'shippingList/SET_STATE',
              payload: {
                selectedShipping: res.data.list[0],
                groupShippingDetail: false,
              },
            });
            NavigationService.navigate('ShipmentDetails');
          }
        }
      },
      *onError(err) {
        showToastr(err);
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

export default function* rootSaga() {
  yield all([takeLatest(action.GET_BOOKING, GET_BOOKING)]);
  yield all([takeLatest(action.GET_ENTITY_BARCODEID, GET_ENTITY_BARCODEID)]);
  yield all([takeLatest(action.GET_ADDRESS, GET_ADDRESS)]);
  yield all([takeLatest(action.CHECK_PIN, CHECK_PIN)]);
  yield all([takeLatest(action.ADD_ADDRESS, ADD_ADDRESS)]);
  yield all([takeLatest(action.UPDATE_ADDRESS, UPDATE_ADDRESS)]);
  yield all([takeLatest(action.BOOK_PRODUCT, BOOK_PRODUCT)]);
  yield all([takeLatest(action.GET_ENTITY_DETAILS, getEntityDetails)]);
  yield all([
    takeLatest(action.SET_PRODUCT, SET_PRODUCT),
    takeLatest(action.SELECT_ADDRESS, SELECT_ADDRESS),
  ]);
  yield all([
    takeLatest(CART_DETAILS_ACTION_TYPES.INITIATE_PAYMENT, initiatePayment),
  ]);
  yield all([
    takeLatest(CART_DETAILS_ACTION_TYPES.VALIDATE_CART, validateCart),
  ]);
  yield all([
    takeLatest(CART_DETAILS_ACTION_TYPES.VALIDATE_PAYMENT, validatePayment),
  ]);
}
