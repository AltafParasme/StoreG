import {all, fork, call, put, select, takeLatest, takeEvery} from 'redux-saga/effects';
import {doHttp} from '../../../../state/utils/ajax';
import * as action from './type';
import {LogFBEvent, ErrEvents, Events} from '../../../../Events';
import {ApiConstants, API_URL, API_ANALYTICS_URL} from '../../../../Constants';
import i18n from '../../../../../i18n';
import {getL10s} from '../../../../utils';
import { showToastr } from '../../utils';

const getOffers = state => state.ShopgLive;

const shuffler = Math.floor(Math.random() * (4000 - 2000 + 1) + 2000);

function* getEntityDetails(action) {
  try {
    let size = action.payload.size ? action.payload.size : 5;
    let url = `${API_URL}/${ApiConstants.getEntityDetails}?page=${action.payload.page}&size=${size}&entityType=offers&tags=${action.payload.tag}&shuffler=${shuffler}`;

    yield put({
      type: 'shopglive/SET_STATE',
      payload: {
        liveLoading: true,
        selectedTag: action.payload.tag
      },
    });

    yield* doHttp({
      method: 'GET',
      url: url,
      data: {},
      *onSuccess(res: any) {

        yield put({
          type: 'shopglive/SET_STATE',
          payload: {
            liveLoading: false
          },
        });

        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: url,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        } else {
          console.log(res);
          if (
            res.recommendation &&
            res.recommendation.rows &&
            res.recommendation.rows.length &&
            res.recommendation.rows.length > 0
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

            let {liveOfferList} = yield select(getOffers);
            //This is done for subcategory page, since we already have 5 listing
            if(action.payload.page == 1 && action.payload.size == 20){
              let liveOfferData = [];
              let rows = res.recommendation.rows.slice(5);
              liveOfferList.map(liveOffer => {
                if(liveOffer.tag==action.payload.tag){
                  liveOfferData.push({'tag':action.payload.tag,'data':liveOffer.data.concat(rows)})
                } else {
                  liveOfferData.push({'tag':liveOffer.tag,'data':liveOffer.data})
                }
              })
  
              yield put({
                type: 'shopglive/SET_STATE',
                payload: {
                  liveOfferList: [...liveOfferData]
                },
              });
            } else if (action.payload.page == 1) {
              
              liveOfferList.push({'tag':action.payload.tag,'data':res.recommendation.rows})
  
              yield put({
                type: 'shopglive/SET_STATE',
                payload: {
                  liveOfferList: [...liveOfferList]
                },
              });
            }else {
              let liveOfferData = [];
              liveOfferList.map(liveOffer => {
                if(liveOffer.tag==action.payload.tag){
                  liveOfferData.push({'tag':action.payload.tag,'data':liveOffer.data.concat(res.recommendation.rows)})
                } else {
                  liveOfferData.push({'tag':liveOffer.tag,'data':liveOffer.data})
                }
              })
  
              yield put({
                type: 'shopglive/SET_STATE',
                payload: {
                  liveOfferList: [...liveOfferData]
                },
              });

            }

          }

        }
      },
      *onError(err: any) {
        console.log('error is ', err);
        yield put({
          type: 'shopglive/SET_STATE',
          payload: {
            liveLoading: false
          },
        });

      },
    });
  } catch (err) {
    console.log('error is ', err);
    yield put({
      type: 'shopglive/SET_STATE',
      payload: {
        liveLoading: false
      },
    });
  }
}

function* liveAnalytics(action) {
  try {
    let event = action.payload.eventName
    let userPref = action.payload.userPref;
    let eventName = event
    let url = `${API_ANALYTICS_URL}/${ApiConstants.liveAnalytics}`;

    let data = {
        "userId":userPref.userId,
        "sid": userPref.sid,
        "events":
        [
        {
        "count": 1,
        "name": eventName,
        "data": action.payload.eventData
      }],
      }

    yield* doHttp({
      method: 'POST',
      url: url,
      data: data,
      *onSuccess(res: any) {

        yield put({
          type: 'shopglive/SET_STATE',
          payload: {
            liveLoading: false
          },
        });

        if (res && !res.success) {
          LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
            api: url,
            errMsg: res.errMsg,
            isError: true,
            httpCode: 200,
          });
        } else {
        }
      },
      *onError(err: any) {
        console.log('error is ', err);
        yield put({
          type: 'shopglive/SET_STATE',
          payload: {
            liveLoading: false
          },
        });

      },
    });
  } catch (err) {
    console.log('error is ', err);
    yield put({
      type: 'shopglive/SET_STATE',
      payload: {
        liveLoading: false
      },
    });
  }
}

export default function* rootSaga() {
  yield all([takeEvery(action.LIVE_GET_OFFER_LIST, getEntityDetails)]);
  yield all([takeLatest(action.LIVE_ANALYTICS, liveAnalytics)]);
}
