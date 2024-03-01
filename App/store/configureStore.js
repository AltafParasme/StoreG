import {createStore, applyMiddleware, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {persistStore, persistReducer} from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import storage from 'redux-persist/lib/storage';
import rootSaga from './rootSaga';
import _rootReducer from './rootReducer';
import Constants from './constants';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel1,
  whitelist: [
    // this means the reducers under these keys are stored and fetched from LS
    // 'login',
  ],
};

const testMiddleware = store => next => action => {
  //  console.log(action)
  next(action);
};

const combinedReducer = combineReducers(_rootReducer);

const rootReducer = (state, action) => {
  // we are handling the clear store separately
  if (action.type == Constants.CLEAR_STORE) {
    // passing undefined to the app's main reducer gives us the initial state
    // clearing redux persist storage is done separately at logout in utils/misc
    state = undefined;
  }
  return combinedReducer(state, action);
};

export default function configureStore() {
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [testMiddleware, sagaMiddleware];
  const store = createStore(
    persistedReducer,
    undefined,
    applyMiddleware(...middlewares)
  );
  sagaMiddleware.run(rootSaga);
  store.persistor = persistStore(store);
  return store;
}
