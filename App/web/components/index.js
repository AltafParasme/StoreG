import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../../store/rootSaga';
import rootReducer from '../../store/rootReducer';
import Test from './test';

const combinedReducer = combineReducers(rootReducer);

const sagaMiddleware = createSagaMiddleware();
const store = createStore(combinedReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Test />
        <div>hi</div>
      </Provider>
    );
  }
}

export default App;
