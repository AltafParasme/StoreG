import {
  all,
  fork,
  call,
  put,
  select,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import {doHttp} from '../../../../state/utils/ajax';
import * as action from './type';
import * as homeActions from './action';
import * as loginAction from '../../Login/actions';
import * as shopgLiveActions from '../../ShopgLive/redux/actions';
import * as cartActions from '../../CartDetail/actions';
import * as myRewardsActions from '../../MyRewards/actions';
import {LogFBEvent, ErrEvents, Events} from '../../../../Events';
import {showToastr, showAlert, errResponse} from '../../utils';
import {
  API_URL,
  API_LOCATION_URL,
  API_ANALYTICS_URL,
  ApiConstants,
  specialCaseWidgets,
} from '../../../../Constants';
import i18n from '../../../../../i18n';
import {getL10s, getL10sFeedback} from '../../../../utils';
import NavigationService from '../../../../utils/NavigationService';
import {getCategoryIndex, removeData, setData, getData} from '../../utils';
import {AppConstants} from '../../../../Constants';

const getLoginState = state => state.login;
const getOffers = state => state.home;
const getLiveOffers = state => state.ShopgLive;
const getRewardsState = state => state.rewards;

const shuffler = Math.floor(Math.random() * (4000 - 2000 + 1) + 2000);
function* getOfferList(action) {
  try {
    yield put({
      type: 'home/SET_STATE',
      payload: {
        loading: true,
      },
    });
    yield put({
      type: 'GET_PAGE_OFFER_LIST',
      payload: action.payload,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
  }
}

function* GET_PAGE_OFFER_LIST({payload}) {
  let {slug, size, userId, tags} = payload;
  const {list, pamphletOffers} = yield select(getOffers);
  let page = !tags
    ? (list &&
        list[slug] &&
        Object.keys(list[slug]) &&
        list[slug].currentPage) ||
      1
    : list['tags'] && list['tags'].name === tags
    ? (list &&
        list['tags'] &&
        Object.keys(list['tags']) &&
        list['tags'].currentPage) ||
      1
    : 1;
  let sizeValue = size ? size : 10;
  const commonUrl = `${API_URL}/api/v1/offer/list?page=${page}&size=${sizeValue}`;
  let urld = tags
    ? `${commonUrl}&tags=${encodeURIComponent(tags)}&category=${slug}`
    : `${commonUrl}&category=${slug}`;
  let url = userId ? `${urld}&userId=${userId}` : urld;
  try {
    yield put({
      type: 'home/SET_STATE',
      payload: {
        isLoading: true,
      },
    });
    yield* doHttp({
      method: 'GET',
      url: url,
      headers: {'Content-Type': 'application/json'},

      *onSuccess(res) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: url,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(res.errMsg);
        }
        if (res.data && res.data.rows && res.data.rows.length) {
          let dataTranslation = getL10s(res.data.rows);
          i18n.addResourceBundle(
            'kannada',
            'translation',
            dataTranslation.Kannada
          );
          i18n.addResourceBundle('hindi', 'translation', dataTranslation.Hindi);
        }

        if (
          tags &&
          list &&
          list['tags'] &&
          list['tags'].name &&
          list['tags'].name !== tags
        ) {
          yield put({
            type: action.SET_ACTIVE_TAG,
          });
        }
        if (
          (res.data.rows && !(res.data.rows.length > 0) && res.data.count) ||
          (!tags &&
            list[slug] &&
            list[slug].data &&
            list[slug].data.length > res.data.count) ||
          (tags &&
            list['tags'] &&
            list['tags'].name &&
            list['tags'].name === tags &&
            list['tags'].data &&
            list['tags'].data.length > res.data.count)
        ) {
          if (!tags) {
            yield put({
              type: action.LIMIT_REACHED,
            });
          } else {
            yield put({
              type: action.LIMIT_TAGS_REACHED,
            });
          }
          yield put({
            type: 'home/SET_STATE',
            payload: {
              loading: false,
              isLoading: false,
            },
          });
        } else {
          yield put({
            type: 'home/SET_STATE',
            payload: {
              loading: false,
              isLoading: false,
              list: {
                ...list,
                [slug]: {
                  currentPage: !tags
                    ? page + 1
                    : list[slug]
                    ? list[slug].currentPage
                    : page,
                  data: !tags
                    ? list[slug]
                      ? list[slug].data.concat(res.data.rows)
                      : // .sort(
                        //   (a, b) => a.displayPosition - b.displayPosition
                        // )
                        [].concat(res.data.rows)
                    : // .sort(
                    //   (a, b) => a.displayPosition - b.displayPosition
                    // )
                    list[slug]
                    ? list[slug].data
                    : [].concat(res.data.rows),
                  // .sort(
                  //   (a, b) => a.displayPosition - b.displayPosition
                  // ),
                },
                tags: {
                  name: tags,
                  currentPage: tags
                    ? list['tags'] &&
                      list['tags'].data.length &&
                      list['tags'].name &&
                      list['tags'].name === tags
                      ? page + 1
                      : 2
                    : null,
                  data: tags
                    ? list['tags'] &&
                      list['tags'].data.length &&
                      list['tags'].name &&
                      list['tags'].name === tags
                      ? list['tags'].data.concat(res.data.rows)
                      : // .sort(
                        //   (a, b) => a.displayPosition - b.displayPosition
                        // )
                        [].concat(res.data.rows)
                    : // .sort(
                      //   (a, b) => a.displayPosition - b.displayPosition
                      // )
                      [],
                },
              },
            },
          });
        }
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
        yield put({
          type: 'home/SET_STATE',
          payload: {
            loading: false,
            isLoading: false,
          },
        });
      },
      auth: false,
    });
  } catch (err) {
    yield put({
      type: 'home/SET_STATE',
      payload: {
        loading: false,
        isLoading: false,
      },
    });
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
  }
}

function* GET_FEEDBACK() {
  const url = `${API_URL}/api/v1/feedback`;
  try {
    yield* doHttp({
      method: 'GET',
      url: url,
      headers: {'Content-Type': 'application/json'},

      *onSuccess(res) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: url,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(res.errMsg);
        }
        yield put({
          type: 'home/SET_STATE',
          payload: {
            feedback: res.data,
          },
        });
        if (res.data) {
          yield put({
            type: 'home/SET_STATE',
            payload: {
              showFeedBackPopUp: true,
            },
          });
        }
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
      },
      //auth: false,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
  }
}

function* getCategoriesList(action) {
  yield put({
    type: 'home/SET_STATE',
    payload: {
      loading: false,
    },
  });
  try {
    yield* doHttp({
      method: 'GET',
      url: `${API_URL}/api/v1/offer/list?page=${
        action.payload.page ? action.payload.page : 1
      }&size=${action.payload.size}&userId=${action.payload.userId}`,
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: `${API_URL}/api/v1/offer/list?page=${
              action.payload.page ? action.payload.page : 1
            }&size=${action.payload.size}`,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(res.errMsg);
        } else {
          let categoryList = res.categoryList || [];
          let isFreeGiftSlug = categoryList.some(
            element => element.slug === 'free-gift'
          );

          yield put({
            type: 'home/SET_STATE',
            payload: {
              isFreeGiftEnabled: isFreeGiftSlug,
            },
          });

          let activeIndex;
          if (action.payload.actionId) {
            activeIndex = res.categoryList
              ? getCategoryIndex(res.categoryList, action.payload.actionId)
              : 1;
          } else {
            activeIndex = res.categoryList
              ? getCategoryIndex(res.categoryList, 'hot-deals', 'super-deals')
              : 1;
          }

          yield put({
            type: 'GET_OFFER_LIST',
            payload: {
              page: 1,
              size: 10,
              slug: action.payload.actionId
                ? action.payload.actionId
                : res.categoryList && res.categoryList[activeIndex].slug,
              userId: action.payload.userId,
            },
          });

          // yield put({
          //   type: 'GET_WIDGETS',
          //   payload: {
          //     page: 1,
          //     size: 3,
          //     category: action.payload.actionId
          //       ? action.payload.actionId
          //       : res.categoryList && res.categoryList[activeIndex].slug,
          //     isPublic: true,
          //     isPrivate: true,
          //     userId: action.payload.userId,
          //     comunityName: groupCode
          //   },
          // });

          yield put({
            type: 'GET_CATEGORIES_SUCCESS',
            payload: {
              categories: res.categoryList.sort((a, b) => a.order - b.order),
              activeCategoryTabIndex: activeIndex,
              activeCategoryTab: action.payload.actionId
                ? action.payload.actionId
                : res.categoryList && res.categoryList[activeIndex].slug,
            },
          });
        }
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
      },
      auth: false,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
  }
}

function* getCartData(action) {
  try {
    yield put({
      type: 'home/SET_STATE',
      payload: {
        loadingCart: true,
        cartOrderPlaced: false,
      },
    });
    let getCartUrl = `${API_URL}/${ApiConstants.getCartDetails}?type=CART&isGetCartOrder=true`;
    if (action.payload.cartId) {
      getCartUrl = getCartUrl + '&cartId=' + action.payload.cartId;
    }
    if (action.payload.cancelOrderId) {
      getCartUrl =
        getCartUrl + '&cancelOrderId=' + action.payload.cancelOrderId;
    }
    yield* doHttp({
      method: 'GET',
      url: getCartUrl,
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        if (res && !res.success) {
          errResponse(getCartUrl, res);
        } else {
          if (action.payload.cartId && action.payload.cancelOrderId) {
            yield put({
              type: 'home/SET_STATE',
              payload: {
                cancelOrderCart: res.data,
                refreshCancelOrder: true,
              },
            });
          } else {
            if (
              res.success &&
              res.data &&
              res.data.cartOrderDetails &&
              res.data.cartOrderDetails.length > 0
            ) {
              let totalQuantity = 0;
              res.data.cartOrderDetails.map((item, index) => {
                totalQuantity = totalQuantity + item.quantity;
              });

              yield put({
                type: 'home/SET_STATE',
                payload: {
                  cart: res.data,
                  hasCart: true,
                  totalCartItems: totalQuantity,
                },
              });
            } else {
              yield put({
                type: 'home/SET_STATE',
                payload: {
                  hasCart: false,
                },
              });
            }
          }
        }

        yield put({
          type: 'home/SET_STATE',
          payload: {
            loadingCart: false,
            refreshCancelOrder: false,
          },
        });
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
        yield put({
          type: 'home/SET_STATE',
          payload: {
            loadingCart: false,
            refreshCancelOrder: false,
          },
        });
      },
    });
  } catch (err) {
    showToastr(
      'Unknown error from ShopG, Please retry after sometime.' + err,
      'top',
      'warning'
    );
    yield put({
      type: 'home/SET_STATE',
      payload: {
        loadingCart: false,
        refreshCancelOrder: false,
      },
    });
  }
}

function* addToCart(action) {
  try {
    yield put({
      type: 'booking/SET_STATE',
      payload: {
        selectedSize: '',
        selectedColor: '',
      },
    });

    yield put({
      type: 'home/SET_STATE',
      payload: {
        loadingAddToCart: true,
        offerIdUpdatingInCart: action.payload.offerId,
        offerSizeUpdatingInCart: action.payload.size,
        cartOrderPlaced: false,
      },
    });
    let updateCartUrl = `${API_URL}/${ApiConstants.updateCart}`;
    let sendData = {
      offerId: action.payload.offerId,
      quantity: action.payload.quantity,
      size: action.payload.size,
      colour: action.payload.color,
      currencyMode: action.payload.currencyMode,
    };
    if (action.payload.source != '') {
      sendData['utmSource'] = action.payload.source;
    }
    if (action.payload.medium != '') {
      sendData['utmMedium'] = action.payload.medium;
    }
    yield* doHttp({
      method: 'PUT',
      url: updateCartUrl,
      data: sendData,
      *onSuccess(res) {
        yield put({
          type: 'home/SET_STATE',
          payload: {
            offerIdUpdatingInCart: -1,
            offerSizeUpdatingInCart: '',
            loadingAddToCart: false,
            loadingCart: false,
          },
        });

        if (res && !res.success) {
          errResponse(updateCartUrl, res);
        } else {
          if (
            res.success &&
            res.data &&
            res.data.cartOrderDetails &&
            res.data.cartOrderDetails.length > 0
          ) {
            let totalQuantity = 0;
            res.data.cartOrderDetails.map((item, index) => {
              totalQuantity = totalQuantity + item.quantity;
            });

            yield put({
              type: 'home/SET_STATE',
              payload: {
                offerIdUpdatedInCart: action.payload.offerId,
                cart: res.data,
                hasCart: true,
                totalCartItems: totalQuantity,
              },
            });
          } else {
            yield put({
              type: 'home/SET_STATE',
              payload: {
                hasCart: false,
                cartOrderPlaced: false,
                cart: undefined,
              },
            });
          }
        }
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
        yield put({
          type: 'home/SET_STATE',
          payload: {
            offerIdUpdatingInCart: -1,
            offerSizeUpdatingInCart: '',
            loadingAddToCart: false,
            loadingCart: false,
          },
        });
      },
    });
  } catch (err) {
    showToastr(
      'Unknown error from ShopG, Please retry after sometime.' + err,
      'top',
      'warning'
    );
    yield put({
      type: 'home/SET_STATE',
      payload: {
        offerIdUpdatingInCart: -1,
        loadingAddToCart: false,
        loadingCart: false,
      },
    });
  }
}

function* SET_FEEDBACK({payload}) {
  const {feedBackPayload, isFeedBackShare} = payload;
  try {
    yield* doHttp({
      method: 'POST',
      url: `${API_URL}/api/v1/feedback`,
      data: feedBackPayload,
      headers: {
        'Content-Type': 'application/json',
      },
      *onSuccess(res) {
        if (!res.success) {
          errResponse(`${API_URL}/api/v1/feedback`, res);
        } else {
          if (isFeedBackShare) {
            yield put(
              myRewardsActions.getRewards(false, true, false, false, null, null)
            );
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

function* placeOrder(action) {
  const {location} = yield select(getOffers);
  try {
    yield put({
      type: 'home/SET_STATE',
      payload: {
        loadingCart: true,
      },
    });
    const placeCartUrl = `${API_URL}/${ApiConstants.placeOrder}`;
    let sendData = {
      cartId: action.payload.cartId,
      useRewards: action.payload.useRewards,
      addressId: action.payload.addressId,
      paymentMode: action.payload.paymentMode,
      latitude: location.lat,
      longitude: location.lng,
      gpsData: location.gpsData,
      // razorpay_order_id : action.payload.razorpay_order_id,
      // razorpay_payment_id : action.payload.razorpay_payment_id,
      // razorpay_signature : action.payload.razorpay_signature
    };

    if (action.payload.name != '') {
      sendData['name'] = action.payload.name;
    }
    if (action.payload.source != '') {
      sendData['utmSource'] = action.payload.source;
    }
    if (action.payload.medium != '') {
      sendData['utmMedium'] = action.payload.medium;
    }
    yield* doHttp({
      method: 'POST',
      url: placeCartUrl,
      data: sendData,
      *onSuccess(res) {
        if (res && !res.success) {
          // errResponse(placeCartUrl, res, true);
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: placeCartUrl,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          let errorMsg =
            res && res.errMsg ? res.errMsg : 'Something went wrong!';
          if (
            Object.keys(res.errMsg).length === 0 &&
            res.errMsg.constructor === Object
          ) {
            errorMsg = 'Something went wrong!';
          }
          action.payload.callback(false, '', '', errorMsg);
        } else {
          if (
            res.data &&
            res.data.providerResponse &&
            res.data.providerResponse.keyId &&
            res.data.providerResponse.orderId
          ) {
            action.payload.callback(
              true,
              res.data.providerResponse.keyId,
              res.data.providerResponse.orderId,
              ''
            );
          } else {
            action.payload.callback(true, '', '', '');
          }

          setData(AppConstants.timerRemoved, 'yes');
          yield put(cartActions.changeField('isCartValid', false));

          if (action.payload.paymentMode == 'COD') {
            yield put({
              type: 'home/SET_STATE',
              payload: {
                hasCart: false,
                cart: undefined,
                newAddressAdded: false,
                refreshRecentOrder: true,
                cartOrderPlaced: true,
              },
            });
          }

          LogFBEvent(Events.CART_PURCHASE_SUCCESS, {
            cartId: action.payload.cartId,
            useRewards: action.payload.useRewards,
            addressId: action.payload.addressId,
            name: action.payload.name,
            value: action.payload.totalPrice,
            currency: 'INR',
            categories: action.payload.listofCategories,
            numberOfOrders: action.payload.numberOfOrders,
          });
          LogFBEvent(Events.CART_NUMBER_OF_ORDERS, {
            numberOfOrders: action.payload.numberOfOrders,
          });
        }

        yield put({
          type: 'home/SET_STATE',
          payload: {
            loadingCart: false,
          },
        });
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
        action.payload.callback(false, '', '', err);
        yield put({
          type: 'home/SET_STATE',
          payload: {
            loadingCart: false,
          },
        });
      },
    });
  } catch (err) {
    action.payload.callback(
      false,
      '',
      '',
      'Unknown error from ShopG, Please retry after sometime.' + err
    );
    showToastr(
      'Unknown error from ShopG, Please retry after sometime.' + err,
      'top',
      'warning'
    );
    yield put({
      type: 'home/SET_STATE',
      payload: {
        loadingCart: false,
      },
    });
  }
}

function* verifyPayment(action) {
  try {
    yield put({
      type: 'home/SET_STATE',
      payload: {
        loadingCart: true,
      },
    });
    const placeCartUrl = `${API_URL}/${ApiConstants.paymentStatus}`;
    let sendData = {
      cartId: action.payload.cartId,
      providerResponse: {
        razorpay_order_id: action.payload.razorpay_order_id,
        razorpay_payment_id: action.payload.razorpay_payment_id,
        razorpay_signature: action.payload.razorpay_signature,
      },
    };

    yield* doHttp({
      method: 'POST',
      url: placeCartUrl,
      data: sendData,
      *onSuccess(res) {
        if (res && !res.success) {
          errResponse(placeCartUrl, res, true);
        } else {
          yield put({
            type: 'home/SET_STATE',
            payload: {
              hasCart: false,
              cart: undefined,
              newAddressAdded: false,
              refreshRecentOrder: true,
              cartOrderPlaced: true,
            },
          });

          NavigationService.navigate('OrderConfirmation');
        }

        yield put({
          type: 'home/SET_STATE',
          payload: {
            loadingCart: false,
          },
        });
      },
      *onError(err) {
        console.log('error is ', err);
        yield put({
          type: 'home/SET_STATE',
          payload: {
            loadingCart: false,
          },
        });
      },
    });
  } catch (err) {
    showToastr(
      'Unknown error from ShopG, Please retry after sometime.' + err,
      'top',
      'warning'
    );
    yield put({
      type: 'home/SET_STATE',
      payload: {
        loadingCart: false,
      },
    });
  }
}

function* setGroup(action) {
  try {
    yield put({
      type: 'home/SET_STATE',
      payload: {
        qrCodeLoading: true,
      },
    });
    const addGrouptUrl = `${API_URL}/${ApiConstants.changeGroup}`;
    let sendData = {groupCode: action.payload.groupCode};

    yield* doHttp({
      method: 'POST',
      url: addGrouptUrl,
      data: sendData,
      *onSuccess(res) {
        if (res && !res.success) {
          errResponse(addGrouptUrl, res, true);
        } else {
          showToastr('Your Group has changed');
          NavigationService.navigate('Splash');
        }

        yield put({
          type: 'home/SET_STATE',
          payload: {
            qrCodeLoading: false,
          },
        });
      },
      *onError(err) {
        //Toast.show(err);
        console.log('error is ', err);
        yield put({
          type: 'home/SET_STATE',
          payload: {
            qrCodeLoading: false,
          },
        });
      },
    });
  } catch (err) {
    showToastr(
      'Unknown error from ShopG, Please retry after sometime.' + err,
      'top',
      'warning'
    );
    yield put({
      type: 'home/SET_STATE',
      payload: {
        qrCodeLoading: false,
      },
    });
  }
}

function* SaveLocation(action) {
  try {
    const saveLocationUrl = `${API_LOCATION_URL}/${ApiConstants.savelocation}`;
    let sendData = {
      userId: action.payload.userId,
      latitude: action.payload.lat,
      longitude: action.payload.lng,
      page: action.payload.page,
      gpsData: action.payload.obj,
    };

    yield* doHttp({
      method: 'POST',
      url: saveLocationUrl,
      data: sendData,
      *onSuccess(res) {
        if (res && !res.success) {
          errResponse(saveLocationUrl, res, true);
        }
      },
      *onError(err) {
        //Toast.show(err);
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

function* getWidgets(action) {
  let {
    isPublic,
    isPrivate,
    page,
    userId,
    callback,
    pageNumber,
    size,
    category,
    comunityName,
  } = action.payload;
  // const url = `${API_ANALYTICS_URL}/${ApiConstants.getWidgets}?isPublic=${isPublic}&isPrivate=${isPrivate}&page=${page}&userId=${userId}`;
  let url = `${API_ANALYTICS_URL}/${ApiConstants.getWidgets}?`;
  let firstParam = true;
  if (isPublic) {
    url = url + `isPublic=${isPublic}`;
    firstParam = false;
  }
  if (isPrivate) {
    if (firstParam) {
      url = url + `isPrivate=${isPrivate}`;
    } else {
      url = url + `&isPrivate=${isPrivate}`;
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
  if (userId) {
    if (firstParam) {
      url = url + `userId=${userId}`;
    } else {
      url = url + `&userId=${userId}`;
    }
    firstParam = false;
  }
  if (pageNumber) {
    if (firstParam) {
      url = url + `pageNumber=${pageNumber}`;
    } else {
      url = url + `&pageNumber=${pageNumber}`;
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
  if (category) {
    if (firstParam) {
      url = url + `category=${category}`;
    } else {
      url = url + `&category=${category}`;
    }
    firstParam = false;
  }
  if (comunityName) {
    if (firstParam) {
      url = url + `comunityName=${comunityName}`;
    } else {
      url = url + `&comunityName=${comunityName}`;
    }
    firstParam = false;
  }
  yield put(shopgLiveActions.changeField('fetchingData', true));
  yield put(shopgLiveActions.changeField('pageUpdating', page));

  try {
    yield* doHttp({
      method: 'GET',
      url: url,
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        yield put(shopgLiveActions.changeField('fetchingData', false));
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: url,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          showToastr(res.errMsg);
        } else {
          let widgetData = [],
            privateWidgetsScratchCards = [];
          res.data.forEach(doc => {
            let dataToAdd = {
              id: doc.widgetId,
              data: doc,
            };
            if (
              doc &&
              doc.widgetType &&
              doc.widgetType == 'scratchCardRewards'
            ) {
              privateWidgetsScratchCards.push(doc);
            }
            if (
              doc &&
              doc.widgetType &&
              doc.widgetType == 'customerFeedback' &&
              doc.data
            ) {
              let dataTranslation = getL10sFeedback(doc.data);
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
            widgetData.push(dataToAdd);
          });

          if (page == 'CartDetail') {
            yield put(
              shopgLiveActions.changeField('cartPageWidgets', widgetData)
            );
          } else {
            let {querySnapshot, widgetList} = yield select(getLiveOffers);

            // let mergedWidgetList = [...widgetData, ...querySnapshot];
            // let set = new Set();
            // let unionWidgetList = mergedWidgetList.filter(item => {
            //   if (!set.has(item.id)) {
            //     set.add(item.id);
            //     return true;
            //   }
            //   return false;
            // }, set);

            // yield put(
            //   shopgLiveActions.changeField('querySnapshot', unionWidgetList)
            // );

            const data =
              widgetList && widgetList[category] && widgetList[category].data;
            if (page == 'ClaimCoins') {
              yield put(
                shopgLiveActions.changeField('querySnapshot', widgetData)
              );
            }
            if (page == 'Home') {
              let mergedWidgetList,
                limitReached = false;
              if (data && data.length) {
                mergedWidgetList = [...data, ...widgetData];
              } else mergedWidgetList = widgetData;
              if (widgetData.length == 0) limitReached = true;
              let tags = '';
              let relevantWidgets = widgetData.filter(item => {
                if (!item || !item.data || !item.data.category) return false;

                if (item.data.category.includes(category)) {
                  if (item.data.widgetType == 'bannerRelevance') {
                    tags += `${item.data.widgetData.bannerJson['english'][0].tags[0].slug},`;
                  } else if (
                    specialCaseWidgets.includes(item.data.widgetType)
                  ) {
                    //do nothing
                  } else
                    tags += `${item.data.widgetData.tags &&
                      item.data.widgetData.tags[0].slug},`;
                  return true;
                }
              });

              if (relevantWidgets.length > 0) {
                tags = tags.substring(0, tags.length - 1);
                yield put(homeActions.getLiveOfferListInBulk(tags, 1, 5));
                //this.props.getOffersListInBulk();
              }

              yield put(
                shopgLiveActions.changeField('widgetList', {
                  ...widgetList,
                  [category]: {
                    page: pageNumber,
                    data: mergedWidgetList,
                    limitReached: limitReached,
                  },
                })
              );
            }
            if (page == 'ScratchCardList') {
              yield put(
                shopgLiveActions.changeField(
                  'scratchCards',
                  privateWidgetsScratchCards
                )
              );
            }
          }
          callback();
        }
      },
      *onError(err) {
        //Toast.show(err);
        yield put(shopgLiveActions.changeField('fetchingData', false));
        console.log('error is ', err);
        callback();
      },
      auth: false,
    });
  } catch (err) {
    yield put(shopgLiveActions.changeField('fetchingData', false));
    callback();
    if (err instanceof Error) {
      console.log('err is ', err);
    } else {
      console.log('Unknown error is ');
    }
  }
}

function* getEntityDetailsInBulk(action) {
  try {
    let size = action.payload.size ? action.payload.size : 5;
    let url = `${API_URL}/${ApiConstants.getEntityDetailsInBulk}?page=${action.payload.page}&size=${size}&entityType=offers&tags=${action.payload.tags}&shuffler=${shuffler}`;

    yield put({
      type: 'shopglive/SET_STATE',
      payload: {
        liveLoading: true,
        loadingTags: action.payload.tags
      },
    });

    yield* doHttp({
      method: 'GET',
      url: url,
      data: {},
      *onSuccess(res: any) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: url,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          yield put({
            type: 'shopglive/SET_STATE',
            payload: {
              liveLoading: false,
              loadingTags: ''
            },
          });
        } else {
          const tags = action.payload.tags;
          const tagsList = tags.split(',');
          let liveOfferData = [];
          let {liveOfferList} = yield select(getLiveOffers);
          tagsList.forEach(tag => {
            let data = res.data[tag];
            if (data && data.length > 0) {
              let dataTranslation = getL10s(data);
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
              liveOfferData.push({tag: tag, data: data});
            }
          });

          let mergedLiveOfferList = [...liveOfferList, ...liveOfferData];
          let set = new Set();
          let unionLiveOfferList = mergedLiveOfferList.filter(item => {
            if (!set.has(item.tag)) {
              set.add(item.tag);
              return true;
            }
            return false;
          }, set);
          yield put({
            type: 'shopglive/SET_STATE',
            payload: {
              liveOfferList: unionLiveOfferList,
              liveLoading: false,
              loadingTags: ''
            },
          });
        }
      },
      *onError(err: any) {
        console.log('error is ', err);
        yield put({
          type: 'shopglive/SET_STATE',
          payload: {
            liveLoading: false,
            loadingTags: ''
          },
        });
      },
    });
  } catch (err) {
    console.log('error is ', err);
    yield put({
      type: 'shopglive/SET_STATE',
      payload: {
        liveLoading: false,
        loadingTags: ''
      },
    });
  }
}

function* getPincodeFromLocation(action) {
  try {
    let url = `${API_URL}/${ApiConstants.getPincodeFromLocation}`;
    if(action.payload.lat && action.payload.lng)
      url = `${url}?lat=${action.payload.lat}&long=${action.payload.lng}`

    yield* doHttp({
      method: 'GET',
      url: url,
      data: {},
      *onSuccess(res: any) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: url,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
          NavigationService.navigateAndReset('Tab');
        } else {
          const {userPreferences} = yield select(getLoginState);
          let updatedPreferences = {
            ...userPreferences,
            ...res.data,
          };
          yield put(
            loginAction.changeField('userPreferences', updatedPreferences)
          );
          setData('prefPinCode', JSON.stringify(res.data));
          NavigationService.navigateAndReset('Tab');
        }
      },
      *onError(err: any) {
        console.log('error is ', err);
        yield put({
          type: 'shopglive/SET_STATE',
          payload: {
            liveLoading: false,
          },
        });
      },
    });
  } catch (err) {
    console.log('error is ', err);
    yield put({
      type: 'shopglive/SET_STATE',
      payload: {
        liveLoading: false,
      },
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(action.GET_OFFER_LIST, getOfferList),
    takeLatest(action.GET_PAGE_OFFER_LIST, GET_PAGE_OFFER_LIST),
    takeLatest(action.GET_FEEDBACK, GET_FEEDBACK),
    takeLatest(action.SET_FEEDBACK, SET_FEEDBACK),
    takeLatest(action.GET_CATEGORIES_LIST, getCategoriesList),
    takeLatest(action.GET_CART_DETAIL, getCartData),
    takeLatest(action.UPDATE_CART, addToCart),
    takeLatest(action.PLACE_ORDER, placeOrder),
    takeLatest(action.SET_GPS_LOCATION, SaveLocation),
    takeLatest(action.GET_PINCODE_FROM_LOCATION, getPincodeFromLocation),
    takeLatest(action.SET_GROUP, setGroup),
    takeLatest(action.GET_WIDGETS, getWidgets),
    takeEvery(action.LIVE_GET_OFFER_LIST_IN_BULK, getEntityDetailsInBulk),
    takeLatest(action.VERIFY_PAYMENT, verifyPayment),
  ]);
}
