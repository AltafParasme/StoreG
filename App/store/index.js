import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import configureStore from './configureStore';
// import { configureGoogleAnalytics } from "../utils/googleAnalytics";
// import { configureAnalytics } from "../utils/analytics";

const store = configureStore();

// Uncomment if you want to clear local storage for dev
// store.persistor.purge()

/*
	This section sets up the redux store,
	    the redux-saga middleware,
	    the interaction with the clients local storage (using redux-persist)
      and also common actions, reducers, selectors, sagas (should it be in utils?)
*/

export default class myStore extends Component {
  onBeforeLift = () => {
    // ga is configured because we may now have the user
    // configureGoogleAnalytics();
    // configureAnalytics(store);
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate
          persistor={store.persistor}
          onBeforeLift={this.onBeforeLift}>
          {this.props.children}
        </PersistGate>
      </Provider>
    );
  }
}

export {store};
