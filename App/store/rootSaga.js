import {all, fork} from 'redux-saga/effects';
// import loginSaga from '../native/screens/Login/saga.js';
// import authLoadingSaga from '../native/screens/AuthLoading/saga.js';
// import newUserRegistionSaga from '../native/screens/NewUserRegistration/saga';
// import trackConsignmentSaga from '../native/screens/TrackConsignment/saga';
// import requestCallbackSaga from '../native/screens/CreateBooking/RequestCallback/saga';
// import createBookingSaga from '../native/screens/CreateBooking/saga';
// import searchSaga from '../native/screens/Search/saga';
// import SelectAddressSaga from '../native/screens/SelectAddress/saga';

function* rootSaga() {
  try {
    yield all([
      // fork(loginSaga),
      // fork(trackConsignmentSaga),
      // fork(newUserRegistionSaga),
      // fork(authLoadingSaga),
      // fork(requestCallbackSaga),
      // fork(createBookingSaga),
      // fork(searchSaga),
      // fork(SelectAddressSaga),
    ]);
  } catch (e) {
    console.log('rootSaga...', e);
  }
}

export default rootSaga;
