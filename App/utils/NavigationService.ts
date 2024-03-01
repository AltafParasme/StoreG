// NavigationService.js

import { NavigationActions, StackActions } from 'react-navigation';
import {BackHandler} from 'react-native';
let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function navigateAndReset(routeName, params) {
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    })
  );
}

function goBack() {
  if(_navigator.state.nav.index == 1 && _navigator.state.nav.routes[1].routes.length == 1 && _navigator.state.nav.routes[1].routes[0].index == 0)
    BackHandler.exitApp();

  _navigator.dispatch(
      NavigationActions.back()
  );
}

function dispatch(value) {
  _navigator.dispatch(value);
}

function push(routeName) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName
    })
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  goBack,
  navigateAndReset,
  dispatch,
  push
};