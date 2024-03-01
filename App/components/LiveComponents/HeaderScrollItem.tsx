import {
  StyleSheet,
  Text,
  Slider,
  View,
  ViewPropTypes,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import {
  scaledSize,
  AppWindow,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import {AppText} from '../Texts';

export class HeaderScrollItem extends Component {
  constructor() {
    super();
  }

  render() {
    const {t, item, index, onPress, borderColor} = this.props;
    return (
      <TouchableOpacity onPress={() => onPress(index)}>
        <View style={[styles.containerStyle, {borderColor: borderColor}]}>
          <AppText style={{color: borderColor}} bold size="S">
            {t(item)}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaledSize(50),
    marginHorizontal: scaledSize(5),
    paddingHorizontal: scaledSize(12),
    height: heightPercentageToDP(5),
    borderWidth: 2,
  },
});
