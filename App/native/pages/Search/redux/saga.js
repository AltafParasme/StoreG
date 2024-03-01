import {all, fork, call, put, select, takeLatest} from 'redux-saga/effects';
import {doHttp} from '../../../../state/utils/ajax';
import * as action from './type';
import {LogFBEvent, ErrEvents, Events} from '../../../../Events';
import {showToastr} from '../../utils';
import {API_URL, ApiConstants} from '../../../../Constants';
import i18n from '../../../../../i18n';
import {getL10s} from '../../../../utils';

const getState = state => state.home;

function* getSearchList(action) {
  const searchUrl = `${API_URL}/${ApiConstants.search}?find=${action.payload.key}&size=20&page=1&userId=${action.payload.userId}`;
  try {
    yield* doHttp({
      method: 'GET',
      url: searchUrl,
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: searchUrl,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        } else {
          let searchData = [];
          const {categories} = yield select(getState);
          res.data.map(key => {
            let hasCategory = false;
            key.mediaJson.categories.map(category => {
              categories.map(gotCategory => {
                if (category.slug == gotCategory.slug) {
                  hasCategory = true;
                }
              });
            });

            if (hasCategory) {
              searchData.push(key);
            }
          });

          yield put({
            type: 'SEARCH_SET_OFFER_LIST',
            payload: {
              list: searchData,
            },
          });

          let noSearchResults = searchData.length > 0 ? false : true;
          yield put({
            type: 'SEARCH_SET_RESULT',
            payload: {
              noSearchResults: noSearchResults,
            },
          });

          LogFBEvent(Events.SEARCH_SCREEN_SEARCH_RESULTS, {
            keyword: action.payload.key,
          });

          let eventName = Events.SEARCH_SCREEN_SEARCH_FAIL;
          if (searchData.length > 0) {
            let dataTranslation = getL10s(searchData);
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
            eventName = Events.SEARCH_SCREEN_SEARCH_SUCCESS;
          }

          LogFBEvent(eventName, {
            keyword: action.payload.key,
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

function* setSearchLog(action) {
  const searchUrl = `${API_URL}/${ApiConstants.searchLog}?find=${action.payload.key}&userId=${action.payload.userId}&selectionId=${action.payload.offerId}&selectionType=${action.payload.selectionType}`;
  try {
    yield* doHttp({
      method: 'POST',
      url: searchUrl,
      data: {},
      headers: {'Content-Type': 'application/json'},
      *onSuccess(res) {
        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: searchUrl,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
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

export default function* rootSaga() {
  yield all([
    takeLatest(action.SEARCH_GET_OFFER_LIST, getSearchList),
    takeLatest(action.SEARCH_LOG, setSearchLog),
  ]);
}
