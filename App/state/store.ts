import {combineReducers, createStore} from 'redux';
import {AppState} from './types';
import {userList} from './user-list/reducer';
import {login} from '../native/pages/Login/reducer';
import home from '../native/pages/Home/redux/reducer';
import community from '../native/pages/Community/redux/reducer';
import booking from '../native/pages/Booking/redux/reducer';
import orderDetail from '../native/pages/OrderDetail/redux/reducer';
import Search from '../native/pages/Search/redux/reducer';
import ShopgLive from '../native/pages/ShopgLive/redux/reducer';
import ShippingList from '../native/pages/ShippingList/redux/reducer';
import {userProfile} from '../native/pages/UserProfile/reducer';
import {groupSummary} from '../native/pages/OrderConfirmation/reducer';
import {pastOrders} from '../native/pages/PastOrders/reducer';
import {clOnboarding} from '../native/pages/CLOnboarding/reducer';
import {cartDetails} from '../native/pages/CartDetail/reducer';
import {rewards} from '../native/pages/MyRewards/reducer';
import {editUserProfile} from '../native/pages/EditUserProfile/redux/reducer';
import Loader from '../components/Loaders/reducer';
import {applyMiddleware} from 'redux';
import sagaMiddleware from './middlewares/saga';
import rootSaga from './rootSaga';

const appReducer = combineReducers<AppState>({
  //userList,
  login,
  home,
  Loader,
  booking,
  groupSummary,
  pastOrders,
  userProfile,
  orderDetail,
  Search,
  ShippingList,
  cartDetails,
  clOnboarding,
  ShopgLive,
  rewards,
  editUserProfile,
  community
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware),
);


sagaMiddleware.run(rootSaga);

export default store;
