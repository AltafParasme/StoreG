import {all, fork} from 'redux-saga/effects';
import userSaga from './user-list/saga';
import loginSaga from '../native/pages/Login/saga';
import homeSaga from '../native/pages/Home/redux/saga';
import searchSaga from '../native/pages/Search/redux/saga';
import shippingListSaga from '../native/pages/ShippingList/redux/saga';
import bookingSaga from '../native/pages/Booking/redux/saga';
import userProfileSaga from '../native/pages/UserProfile/saga';
import orderSaga from '../native/pages/PastOrders/saga';
import groupSummarySaga from '../native/pages/OrderConfirmation/saga';
import clOnboardingSaga from '../native/pages/CLOnboarding/saga';
import cartDetailSaga from '../native/pages/CartDetail/saga';
import shopgLiveSaga from '../native/pages/ShopgLive/redux/saga';
import rewardsSaga from '../native/pages/MyRewards/saga';
import editProfileSaga from '../native/pages/EditUserProfile/redux/saga';
import communitySaga from '../native/pages/Community/redux/saga';

export default function* rootSaga() {
  yield all([loginSaga(), userSaga(), homeSaga(), bookingSaga(), userProfileSaga(), orderSaga(), clOnboardingSaga(), groupSummarySaga(),searchSaga(),shippingListSaga(), cartDetailSaga(),shopgLiveSaga(), rewardsSaga(), editProfileSaga(), communitySaga()]);
}
