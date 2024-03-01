/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {scaledSize, widthPercentageToDP} from '../../utils';
import {Fonts} from '../../../assets/global';
import {AppText} from '../Texts';

const Tag = ({
  title,
  price,
  strikeThru,
  textColor = '#000',
  titleStyle,
  priceStyle,
  t,
  isGroupScreen,
  size,
}) => {
  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      flexDirection: 'row',
      // justifyContent: 'space-evenly',
    },
    titleText: {
      fontSize: scaledSize(14),
      color: textColor,
      fontWeight: '500',
      fontFamily: Fonts.roboto,
      marginLeft: scaledSize(5),
    },
    priceText: {
      fontSize: scaledSize(14),
      fontFamily: Fonts.roboto,
      color: textColor,
      //width: widthPercentageToDP(16),
      // textAlign: 'left',
    },
  });
  return (
    <View style={styles.container}>
      <AppText
        size={size}
        style={[
          styles.priceText,
          strikeThru ? {textDecorationLine: 'line-through'} : {},
          titleStyle,
        ]}>
        {'\u20B9' + price}
      </AppText>
      {!isGroupScreen && title ? (
        <AppText size={size} style={[styles.titleText, priceStyle]}>
          {t(title)}{' '}
        </AppText>
      ) : null}
    </View>
  );
};
export default Tag;
