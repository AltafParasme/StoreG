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
  
  export class StatusListItem extends Component {
    constructor() {
      super();
    }
  
    render() {
      const {t, item, index, onPress, selectedIndex} = this.props;
      const backgroundColor =
        selectedIndex == index ? Constants.greenishBlue : Constants.white;
      const textColor =
        selectedIndex == index ? Constants.white : Constants.greenishBlue;
      const borderColor =
        selectedIndex == index ? Constants.white : Constants.greenishBlue;
      return (
        <TouchableOpacity onPress={() => onPress(index)}>
          <View style={[styles.containerStyle, {backgroundColor: backgroundColor,borderColor:borderColor}]}>
            <AppText style={{color: textColor}} bold size="S">
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
      borderRadius: scaledSize(3),
      margin: scaledSize(5),
      paddingHorizontal: scaledSize(8),
      height: heightPercentageToDP(5),
      borderWidth: widthPercentageToDP(0.1),
    },
  });
  