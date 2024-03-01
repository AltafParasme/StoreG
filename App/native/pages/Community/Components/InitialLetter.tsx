import React, {Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {LogFBEvent, Events, ErrEvents, SetScreenName} from '../../../../Events';
import {
  noop,
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
  AppWindow,
} from '../../../../utils/index';
import {AppText} from '../../../../components/Texts';
import { Constants } from '../../../../styles';

export class InitialLetter extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    const {name,backgroundColor} = this.props;
    if(!name || !name.length) return <View />;
    let first =
      name &&
      name
        .split(' ')
        .slice(0, 1)
        .join(' ');
    let initial =
      first &&
      first
        .split(' ')
        .map(function(s) {
          return s.charAt(0);
        })
        .join('');

    return (
        <View
        style={backgroundColor ? [styles.initialView,{backgroundColor:backgroundColor}] : styles.initialView}>
        <AppText
          white
          size="M"
          style={{textAlign: 'center'}}>
          {initial.toUpperCase()}
        </AppText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    initialView: {
        height: scaledSize(36),
        width: scaledSize(36),
        borderRadius: scaledSize(36),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: Constants.primaryColor,
    }
});

const mapStateToProps = state => ({
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(InitialLetter)
);