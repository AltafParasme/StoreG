/**
 * @format
 */

import 'react-native-gesture-handler'
import {AppRegistry, YellowBox} from 'react-native';
import App from './App.tsx';
import {name as appName} from './app.json';
import codePush from 'react-native-code-push';

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};

AppRegistry.registerComponent(appName, () => codePush(codePushOptions)(App));

//AppRegistry.registerComponent(appName, () => App);

YellowBox.ignoreWarnings(['Remote debugger']);