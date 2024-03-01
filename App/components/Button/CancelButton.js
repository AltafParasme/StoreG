import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Constants} from '../../styles';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  scaledSize,
} from '../../utils';
import {Colors, Fonts} from '../../../assets/global';
import {AppText} from '../Texts';
import Button from './Button';

export class CancelButton extends Component {
  render() {
    return (
      <View elevation={1} style={styles.downButtonContainer}>
        <Button
          styleContainer={styles.cancelButtonStyle}
          onPress={this.props.onCancelPress}>
          <AppText red bold size="M">
            {this.props.label}
          </AppText>
        </Button>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  downButtonContainer: {
    flexDirection: 'column',
    padding: scaledSize(5),
    margin: scaledSize(5),
    backgroundColor: 'white',
    height: heightPercentageToDP(6),
  },
  cancelButtonStyle: {
    flex: 1,
    borderColor: Colors.mutedBorder,
    borderWidth: scaledSize(1),
    borderRadius: scaledSize(15),
    justifyContent: 'center',
    alignItems: 'center',
    height: scaledSize(40),
    backgroundColor: 'white',
  },
});
