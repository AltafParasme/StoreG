import React from 'react';
import {View} from 'react-native';
import {
  createMaterialTopTabNavigator,
  createAppContainer,
} from 'react-navigation';
import globalStyles, {Constants} from '../../styles';
import {TextStyles} from '../../styles/text';

export default class PrimaryTopTabs extends React.Component {
  render() {
    const Nav = createMaterialTopTabNavigator(this.props.routes, {
      activeColor: '#f0edf6',
      inactiveColor: '#3e2465',
      barStyle: {backgroundColor: '#694fad'},
      tabBarOptions: {
        style: {
          backgroundColor: '#f4f3f3',
        },
        labelStyle: {
          color: '#000',
        },
        indicatorStyle: {
          backgroundColor: '#3e2465',
        },
        activeBackgroundColor: '#ffffff',
      },
      initialRouteName: this.props.initialRouteName,
    });
    const App = createAppContainer(Nav);
    return <App {...this.props} />;
  }
}
