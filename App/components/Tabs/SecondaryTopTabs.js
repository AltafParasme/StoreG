import React from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation';
import {View} from 'react-native';
import globalStyles, {Constants} from '../../styles';
import {TextStyles} from '../../styles/text';

export default class SecondaryTopTabs extends React.Component {
  navigator = createMaterialTopTabNavigator(this.props.routes, {
    lazy: true,
    tabBarPosition: 'top',
    swipeEnabled: true,
    tabBarOptions: {
      activeTintColor: Constants.blue,
      inactiveTintColor: Constants.darkGrey,
      indicatorStyle: {
        backgroundColor: Constants.blue,
        color: Constants.blue,
      },
      upperCaseLabel: false,
      labelStyle: {
        fontFamily: TextStyles.fontFamily.regular,
        fontSize: TextStyles.fontSize.L,
      },
      style: {
        backgroundColor: '#eaeffa',
        borderBottom: 0,
        minWidth: '45%',
        display: 'flex',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
        padding: 0,
        margin: 0,
      },
    },
  });

  render() {
    const Nav = this.navigator;
    return <Nav {...this.props} />;
  }
}
