import {
  all,
  fork,
  call,
  put,
  select,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import {doHttp} from '../../../../state/utils/ajax';
import * as action from './type';
import NavigationService from '../../../../utils/NavigationService';
import {LogFBEvent, ErrEvents, Events} from '../../../../Events';
import {showToastr, errResponse} from '../../utils';
import {
  orderStatusMap,
  orderSummaryMap,
  API_PAYMENTS_URL,
  API_URL,
  ApiConstants,
} from '../../../../Constants';
import i18n from '../../../../../i18n';
import {getL10s} from '../../../../utils';
import * as CLActions from '../../CLOnboarding/actions';
import * as LoaderActions from '../../../../components/Loaders/actions';

const getState = state => state.ShippingList;
const getStateCL = state => state.clOnboarding;

function* getClEarning(action) {
  let getClEarningUrl = `${API_URL}/${ApiConstants.clEarningSummary}`;
  if (action.payload.startDate && action.payload.frequency) {
    getClEarningUrl =
      getClEarningUrl +
      `?frequencyName=${action.payload.startDate}&earningsFrequency=${action.payload.frequency}`;
  }
  try {
    yield* doHttp({
      method: 'GET',
      url: getClEarningUrl,
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        if (res && !res.success) {
          showToastr(res.errMsg);
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: getClEarningUrl,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              clEarningDetail: undefined,
            },
          });
        } else {
          if (action.payload.frequency == null) {
            yield put({
              type: 'shippingList/SET_STATE',
              payload: {
                clEarningTask: res.data,
              },
            });
          }
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              clEarningDetail: res.data,
            },
          });
        }
        action.payload.callback();
      },
      *onError(err) {
        //Toast.show(err);
        if (action.payload.callback) action.payload.callback();
      },
    });
  } catch (err) {
    if (action.payload.callback) action.payload.callback();
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
  }
}

function* getShippingList(action) {
  let shippinghUrl = `${API_URL}/${ApiConstants.shippingHistory}?size=10&page=${action.payload.page}`;
  if (action.payload.status && action.payload.status != '') {
    shippinghUrl = shippinghUrl + `&status=${action.payload.status}`;
  }
  if (action.payload.awb && action.payload.awb != 0) {
    shippinghUrl = shippinghUrl + `&awb=${action.payload.awb}`;
  }
  if (action.payload.shipmentId && action.payload.shipmentId != 0) {
    shippinghUrl = shippinghUrl + `&shipmentId=${action.payload.shipmentId}`;
  }
  if (action.payload.shouldShowLoading) {
    yield put({
      type: 'shippingList/SET_STATE',
      payload: {
        isShipmentDetailsLoading: true,
      },
    });
  }

  try {
    yield* doHttp({
      method: 'GET',
      url: shippinghUrl,
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        if (res && !res.success) {
          showToastr(res.errMsg);
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: shippinghUrl,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        } else {
          if (action.payload.callFromDetail) {
            yield put({
              type: 'shippingList/SET_STATE',
              payload: {
                detailsListItem: res.data[0],
              },
            });
          } else {
            const {scanApiCall, fromShippingList} = yield select(getState);
            if (res.data && res.data.length > 0) {
              if (res.status) {
                yield put({
                  type: 'shippingList/SET_STATE',
                  payload: {
                    customerStatusList: res.status,
                  },
                });
              }
              if (action.payload.page == 1) {
                yield put({
                  type: 'shippingList/SET_STATE',
                  payload: {
                    list: res.data,
                    totalListCount: res.count,
                  },
                });
              } else {
                const {list} = yield select(getState);
                yield put({
                  type: 'shippingList/SET_STATE',
                  payload: {
                    list: list.concat(res.data),
                    totalListCount: res.count,
                  },
                });
              }

              if (!scanApiCall && fromShippingList) {
                yield put({
                  type: 'shippingList/SET_STATE',
                  payload: {
                    scanApiCall: true,
                    scanApiNoShipmentFound: false,
                  },
                });
              }
            } else {
              if (!scanApiCall && fromShippingList) {
                yield put({
                  type: 'shippingList/SET_STATE',
                  payload: {
                    scanApiCall: true,
                    scanApiNoShipmentFound: true,
                  },
                });
              } else if (action.payload.page == 1) {
                yield put({
                  type: 'shippingList/SET_STATE',
                  payload: {
                    list: [],
                    totalListCount: 0,
                  },
                });
              }
            }
          }
        }
        if (action.payload.page == 1) {
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              isShipmentDetailsLoading: false,
            },
          });
        }
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
        if (action.payload.page == 1) {
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              isShipmentDetailsLoading: false,
            },
          });
        }
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
    if (action.payload.page == 1) {
      yield put({
        type: 'shippingList/SET_STATE',
        payload: {
          loading: false,
        },
      });
    }
  }
}

function* getShippingListGroup(action) {
  let isFromCLTask = action.payload.isFromCLTask
    ? action.payload.isFromCLTask
    : false;
  let shippinghUrl = `${API_URL}/${ApiConstants.shippingHistory}?size=10&page=${action.payload.page}`;
  if (action.payload.group) {
    shippinghUrl = shippinghUrl + `&group=true`;
  }
  if (action.payload.phone) {
    shippinghUrl = shippinghUrl + `&phone=${action.payload.phone}`;
  }
  if (action.payload.status && action.payload.status != '') {
    shippinghUrl = shippinghUrl + `&status=${action.payload.status}`;
  }
  if (action.payload.awb && action.payload.awb != 0) {
    shippinghUrl = shippinghUrl + `&awb=${action.payload.awb}`;
  }
  if (action.payload.shipmentId && action.payload.shipmentId != 0) {
    shippinghUrl = shippinghUrl + `&shipmentId=${action.payload.shipmentId}`;
  }

  if (action.payload.shouldShowLoading) {
    yield put({
      type: 'shippingList/SET_STATE',
      payload: {
        isShipmentDetailsLoading: true,
      },
    });
  }

  if (isFromCLTask) {
    yield put(CLActions.changeField('isDeliveredShipmentLoading', true));
  }
  try {
    yield* doHttp({
      method: 'GET',
      url: shippinghUrl,
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        if (res && !res.success) {
          showToastr(res.errMsg);
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: shippinghUrl,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        } else {
          const {scanApiCall, fromShippingList} = yield select(getState);
          if (res.data && res.data.length > 0) {
            if (res.status) {
              yield put({
                type: 'shippingList/SET_STATE',
                payload: {
                  statusList: res.status,
                },
              });
            }
            if (action.payload.page == 1) {
              if (isFromCLTask) {
                yield put(CLActions.changeField('taskGroupList', res.data));
                yield put(
                  CLActions.changeField('totalTaskGroupListCount', res.count)
                );
              } else {
                yield put({
                  type: 'shippingList/SET_STATE',
                  payload: {
                    groupList: res.data,
                    totalGroupListCount: res.count,
                  },
                });
              }
            } else {
              if (isFromCLTask) {
                const {taskGroupList} = yield select(getStateCL);
                yield put(
                  CLActions.changeField(
                    'taskGroupList',
                    taskGroupList.concat(res.data)
                  )
                );
                yield put(
                  CLActions.changeField('totalTaskGroupListCount', res.count)
                );
                yield put(
                  CLActions.changeField('isDeliveredShipmentLoading', false)
                );
              } else {
                const {groupList} = yield select(getState);
                yield put({
                  type: 'shippingList/SET_STATE',
                  payload: {
                    groupList: groupList.concat(res.data),
                    totalGroupListCount: res.count,
                  },
                });
              }
            }

            if (!scanApiCall && fromShippingList) {
              yield put({
                type: 'shippingList/SET_STATE',
                payload: {
                  scanApiCall: true,
                  scanApiNoShipmentFound: false,
                },
              });
            }
          } else {
            if (isFromCLTask) {
              yield put(CLActions.changeField('taskGroupList', []));
              yield put(
                CLActions.changeField('totalTaskGroupListCount', res.count)
              );
            }
            if (!scanApiCall && fromShippingList) {
              yield put({
                type: 'shippingList/SET_STATE',
                payload: {
                  scanApiCall: true,
                  scanApiNoShipmentFound: true,
                },
              });
            } else if (action.payload.page == 1 && !isFromCLTask) {
              yield put({
                type: 'shippingList/SET_STATE',
                payload: {
                  groupList: [],
                  totalListCount: 0,
                },
              });
            }
          }
        }
        if (action.payload.page == 1) {
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              isShipmentDetailsLoading: false,
              //isDeliveredShipmentLoading: false,
            },
          });
          if (isFromCLTask) {
            yield put(
              CLActions.changeField('isDeliveredShipmentLoading', false)
            );
          }
        }
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
        if (action.payload.page == 1) {
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              isShipmentDetailsLoading: false,
            },
          });
          if (isFromCLTask) {
            yield put(
              CLActions.changeField('isDeliveredShipmentLoading', false)
            );
          }
        }
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
    if (action.payload.page == 1) {
      yield put({
        type: 'shippingList/SET_STATE',
        payload: {
          isShipmentDetailsLoading: false,
          //isDeliveredShipmentLoading: false,
        },
      });
    }
  }
}

function* getShippingDetails(action) {
  let shippinghUrl = `${API_URL}/${ApiConstants.shippingDetails}?shipmentId=${action.payload.shipmentId}`;
  yield put({
    type: 'shippingList/SET_STATE',
    payload: {
      loading: true,
    },
  });
  try {
    yield* doHttp({
      method: 'GET',
      url: shippinghUrl,
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        if (res && !res.success) {
          showToastr(res.errMsg);
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: shippinghUrl,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        } else {
          if (res.data) {
            yield put({
              type: 'shippingList/SET_STATE',
              payload: {
                detail: res.data,
              },
            });
          }
        }
        yield put({
          type: 'shippingList/SET_STATE',
          payload: {
            loading: false,
          },
        });
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
        yield put({
          type: 'shippingList/SET_STATE',
          payload: {
            loading: false,
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
    yield put({
      type: 'shippingList/SET_STATE',
      payload: {
        loading: false,
      },
    });
  }
}

function* getGroupShippingData(action) {
  let shippingGroupData = `${API_URL}/${ApiConstants.shippingMonthlyData}?startDate=${action.payload.startDate}&endDate=${action.payload.endDate}`;
  yield put({
    type: 'shippingList/SET_STATE',
    payload: {
      clWeeklyLoading: true,
    },
  });
  try {
    yield* doHttp({
      method: 'GET',
      url: shippingGroupData,
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        if (res && !res.success) {
          showToastr(res.errMsg);
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              clWeeklyLoading: false,
            },
          });
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: shippingGroupData,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        } else {
          if (res.data) {
            let totalAmount = 0,
              totalOrders = 0,
              totalUsers = 0,
              totalEarning = 0,
              totalDelivered = 0,
              totalDeliveredValue = 0,
              totalCancel = 0,
              totalCancelValue = 0,
              totalReturned = 0,
              totalReturnedValue = 0,
              totalRefund = 0,
              totalOfferUnlockedValue = 0,
              totalOfferUnlocked = 0,
              totalPacked = 0,
              totalPackedValue = 0,
              totalUndelivered = 0,
              totalUndeliveredValue = 0,
              totalRefundValue = 0;

            let clOrderSummaryTotalEarning =
              res.data.clOrderSummaryTotalEarning;
            if (res.data.clOrderStatusSummary.length > 0) {
              res.data.clOrderStatusSummary.map(val => {
                let orderStatus =
                  orderSummaryMap[val.orderStatus] || val.orderStatus;
                let subTotalOrder =
                  val.totalOrders && val.totalOrders != ''
                    ? parseInt(val.totalOrders)
                    : 0;
                let subTotalValue =
                  val.totalAmount && val.totalAmount != ''
                    ? parseInt(val.totalAmount)
                    : 0;
                if (orderStatus.label == 'Canceled') {
                  totalCancel = totalCancel + subTotalOrder;
                  totalCancelValue = totalCancelValue + subTotalValue;
                } else if (orderStatus.label == 'Returned') {
                  totalReturned = totalReturned + subTotalOrder;
                  totalReturnedValue = totalReturnedValue + subTotalValue;
                } else if (orderStatus.label == 'Refunded') {
                  totalRefund = totalRefund + subTotalOrder;
                  totalRefundValue = totalRefundValue + subTotalValue;
                } else if (orderStatus.label == 'Delivered') {
                  totalDelivered = totalDelivered + subTotalOrder;
                  totalDeliveredValue = totalDeliveredValue + subTotalValue;
                } else if (orderStatus.label == 'Confirmed') {
                  totalOfferUnlocked = totalOfferUnlocked + subTotalOrder;
                  totalOfferUnlockedValue =
                    totalOfferUnlockedValue + subTotalValue;
                } else if (orderStatus.label == 'Shipped') {
                  totalPacked = totalPacked + subTotalOrder;
                  totalPackedValue = totalPackedValue + subTotalValue;
                } else if (orderStatus.label == 'Undelivered') {
                  totalUndelivered = totalUndelivered + subTotalOrder;
                  totalUndeliveredValue = totalUndeliveredValue + subTotalValue;
                }
                totalOrders = totalOrders + subTotalOrder;
                totalAmount = totalAmount + subTotalValue;
                totalUsers =
                  val.totalUsers && val.totalUsers != '' ? val.totalUsers : 0;
                totalEarning =
                  val.totalEarning && val.totalEarning != ''
                    ? val.totalEarning
                    : 0;
              });
            }

            yield put({
              type: 'shippingList/SET_STATE',
              payload: {
                groupShippingData: {
                  totalAmount: totalAmount,
                  totalOrders: totalOrders,
                  totalUsers: totalUsers,
                  totalDelivered: totalDelivered,
                  totalDeliveredValue: totalDeliveredValue,
                  totalCancel: totalCancel,
                  totalCancelValue: totalCancelValue,
                  totalReturned: totalReturned,
                  totalReturnedValue: totalReturnedValue,
                  totalRefund: totalRefund,
                  totalRefundValue: totalRefundValue,
                  totalEarning: totalEarning,
                  totalOfferUnlocked: totalOfferUnlocked,
                  totalOfferUnlockedValue: totalOfferUnlockedValue,
                  totalPacked: totalPacked,
                  totalPackedValue: totalPackedValue,
                  totalUndelivered: totalUndelivered,
                  totalUndeliveredValue: totalUndeliveredValue,
                  clOrderSummaryTotalEarning: clOrderSummaryTotalEarning,
                },
                clWeeklyLoading: false,
              },
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

function* setDeliveredStatus(action) {
  try {
    yield put({
      type: 'shippingList/SET_STATE',
      payload: {
        markDeliverLoading: true,
      },
    });
    const changeStatustUrl = `${API_URL}/${ApiConstants.changeStatus}`;
    let sendData = {
      shipmentId: action.payload.shipmentId,
      shipmentStatus: 'Delivered',
      pinNumber: action.payload.otp,
    };

    yield* doHttp({
      method: 'POST',
      url: changeStatustUrl,
      data: sendData,
      *onSuccess(res) {
        if (res && !res.success) {
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              markDeliverLoading: false,
            },
          });
          showToastr(res.errMsg);
          errResponse(changeStatustUrl, res, true);
        } else {
          // NavigationService.navigate('ShippingList');
          yield put(LoaderActions.endLoading());
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              markDeliver: {
                shipmentId: action.payload.shipmentId,
                success: true,
              },
              markDeliverLoading: false,
            },
          });
          showToastr(
            `${action.payload.shipmentId} has been marked delivered successfully!`
          );
        }
      },
      *onError(err) {
        //Toast.show(err);
        yield put({
          type: 'shippingList/SET_STATE',
          payload: {
            markDeliverLoading: false,
          },
        });
        console.log('error is ', err);
      },
    });
  } catch (err) {
    yield put({
      type: 'shippingList/SET_STATE',
      payload: {
        markDeliverLoading: false,
      },
    });
    showToastr(
      'Unknown error from ShopG, Please retry after sometime.' + err,
      'top',
      'warning'
    );
  }
}

function* getUserBankDetails() {
  try {
    const getUserBankDetailsUrl = `${API_URL}/${ApiConstants.userBankDetails}`;
    yield* doHttp({
      method: 'GET',
      url: getUserBankDetailsUrl,
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        if (res && !res.success) {
          showToastr(res.errMsg);
          errResponse(getUserBankDetailsUrl, res, true);
        } else {
          let activeValue;
          activeValue = res.data.find(item => {
            return item.isActive;
          });

          let bankDetailsSubmitted = activeValue ? true : false;
          let accountVerified = activeValue
            ? activeValue.isCustomerVerified
            : false;
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              userBankDetails: res.data,
              activeBankAccount: activeValue,
              accountVerified: accountVerified,
              bankDetailsSubmitted: bankDetailsSubmitted,
              isBankAccountPresent: bankDetailsSubmitted,
            },
          });
        }
      },
      *onError(err) {
        console.log('error is ', err);
      },
    });
  } catch (err) {
    showToastr(
      'Unknown error from ShopG, Please retry after sometime.' + err,
      'top',
      'warning'
    );
  }
}

function* addUserBankDetails(action) {
  try {
    yield put({
      type: 'shippingList/SET_STATE',
      payload: {
        isBankLoading: true,
      },
    });
    const addUserBankDetails = `${API_URL}/${ApiConstants.userBankDetails}`;
    let successMssg = action.payload.data.id
      ? 'Account got updated successfully'
      : 'Account added successfully';
    yield* doHttp({
      method: 'POST',
      url: addUserBankDetails,
      data: action.payload.data,
      *onSuccess(res) {
        if (res && !res.success) {
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              bankDetailsSubmitted: false,
              isBankLoading: false,
            },
          });
          showToastr(res.errMsg);
          errResponse(addUserBankDetails, res, true);
        } else {
          let isBankAccountPresent =
            res.data && Object.keys(res.data).length > 0;
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              bankDetailsSubmitted: true,
              isBankLoading: false,
              activeBankAccount: res.data,
              isBankAccountPresent: isBankAccountPresent,
            },
          });
          showToastr(successMssg);
          //NavigationService.goBack();
        }
      },
      *onError(err) {
        console.log('error is ', err);
      },
    });
  } catch (err) {
    showToastr(
      'Unknown error from ShopG, Please retry after sometime.' + err,
      'top',
      'warning'
    );
  }
}

function* checkStatus(action) {
  try {
    const checkStatus = `${API_URL}/${ApiConstants.checkStatus}`;
    yield* doHttp({
      method: 'GET',
      url: checkStatus,
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        if (res && !res.success) {
          showToastr(res.errMsg);
          errResponse(checkStatus, res, true);
        } else {
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              accountVerified: res.data.isCustomerVerified,
              activeBankAccount: res.data,
            },
          });
        }
      },
      *onError(err) {
        console.log('error is ', err);
      },
    });
  } catch (err) {
    showToastr(
      'Unknown error from ShopG, Please retry after sometime.' + err,
      'top',
      'warning'
    );
  }
}

function* returnShipment(action) {
  try {
    const url = `${API_URL}/${ApiConstants.returnShipment}`;
    let sendData = {
      shipmentId: action.payload.shipmentId,
      returnReason: action.payload.returnReason,
      returnType: 'Refund',
    };

    yield* doHttp({
      method: 'POST',
      url: url,
      data: sendData,
      *onSuccess(res) {
        if (res && !res.success) {
          showToastr(res.errMsg);
        } else {
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              returnShipment: {
                shipmentId: action.payload.shipmentId,
                success: true,
              },
            },
          });
          showToastr(
            'Your request is placed. Our team will get in touch to collect the shipment'
          );
        }
      },
      *onError(err) {
        console.log('error is ', err);
      },
    });
  } catch (err) {
    showToastr(
      'Unknown error from ShopG, Please retry after sometime.' + err,
      'top',
      'warning'
    );
  }
}

function* verifyUserBankDetails(action) {
  try {
    const url = `${API_URL}/${ApiConstants.verifyUserBankDetails}`;

    yield* doHttp({
      method: 'POST',
      url: url,
      data: {},
      *onSuccess(res) {
        if (res && !res.success) {
          showToastr(res.errMsg);
        } else {
          yield put({
            type: 'shippingList/SET_STATE',
            payload: {
              accountVerified: true,
            },
          });
        }
      },
      *onError(err) {
        console.log('error is ', err);
      },
    });
  } catch (err) {
    showToastr(
      'Unknown error from ShopG, Please retry after sometime.' + err,
      'top',
      'warning'
    );
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(action.SHIPPING_GET_SHIPPING_LIST, getShippingList),
    takeEvery(action.SHIPPING_GET_SHIPPING_LIST_GROUP, getShippingListGroup),
    takeLatest(action.SHIPPING_GET_SHIPPING_DETAIL, getShippingDetails),
    takeLatest(action.SHIPPING_GET_GROUP_SHIPPING_DETAIL, getGroupShippingData),
    takeLatest(action.CHANGE_STATUS_DELIVERED, setDeliveredStatus),
    takeLatest(action.GET_USER_BANK_DETAILS, getUserBankDetails),
    takeLatest(action.ADD_USER_BANK_DETAILS, addUserBankDetails),
    takeLatest(action.VERIFY_USER_BANK_DETAILS, verifyUserBankDetails),
    takeLatest(action.CHECK_ACCOUNT_VERIFICATION_STATUS, checkStatus),
    takeLatest(action.SHIPPING_RETURN, returnShipment),
    takeLatest(action.GET_CL_EARNING, getClEarning),
  ]);
}
