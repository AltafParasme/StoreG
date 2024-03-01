import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Icon} from 'react-native-elements';
import {Constants} from '../../styles';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils';
import NavigationService from '../../utils/NavigationService';
import {AppText} from '../Texts';
import {AppConstants} from '../../Constants';

export class Header extends Component {
  componentWillMount() {
    if (!this.props.overrideBackHandler) {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick
      );
    }
  }

  componentWillUnmount() {
    if (!this.props.overrideBackHandler) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick
      );
    }
  }

  handleBackButtonClick() {
    NavigationService.goBack();
    return true;
  }

  render() {
    const {rightComponent, overrideBackHandler, withoutHeader} = this.props;
    return (
      <View style={styles.header}>
        <View
          style={[
            styles.headerLeft,
            rightComponent ? {flex: 0.5} : {flex: 0.9},
          ]}>
          {!withoutHeader ? (
            <TouchableOpacity
              onPress={
                overrideBackHandler
                  ? this.props.handleBackButtonClick
                  : this.handleBackButtonClick
              }>
              <Icons
                name={'arrow-back'}
                size={28}
                color="#000"
                style={{marginLeft: '3%', top: '3%'}}
              />
            </TouchableOpacity>
          ) : null}
          <AppText black bold size="M" style={{marginLeft: 15}}>
            {this.props.title}
          </AppText>
        </View>
        {rightComponent ? (
          <View style={styles.rightView}>{rightComponent}</View>
        ) : null}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  header: {
    backgroundColor: Constants.white,
    height: heightPercentageToDP(8),
    width: '100%',
    flexDirection: 'row',
  },
  headerLeft: {
    flex: 0.5,
    marginLeft: widthPercentageToDP(1),
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  rightView: {
    flex: 0.5,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: widthPercentageToDP(1),
    height: '100%',
  },
});
