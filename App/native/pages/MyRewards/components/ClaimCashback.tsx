import React, {PureComponent, Component} from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {AppText} from '../../../../components/Texts';
import {Icon, Header} from 'react-native-elements';
import ScratchCardList from '../../ScratchCardList/ScratchCardList';

export default class ClaimCashback extends PureComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <ScratchCardList hideHeader navigation={this.props.navigation}/>
      </View>
    );
  }
}