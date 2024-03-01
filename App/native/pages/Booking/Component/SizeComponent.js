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
} from '../../../../utils';
import {AppText} from '../../../../components/Texts';
import {Constants} from '../../../../styles';

export class SizeComponent extends Component {
  constructor() {
    super();
  }

  render() {
    const {
      t,
      item,
      index,
      onPress,
      selectedIndex,
      isSelectedItem,
      isColor,
    } = this.props;
    const borderColor = isSelectedItem
      ? isColor
        ? item.toLowerCase()
        : Constants.primaryColor
      : Constants.grey;
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
