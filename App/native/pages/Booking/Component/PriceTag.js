/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {scaledSize} from '../../../../utils';
import {Fonts} from '../../../../../assets/global';
import {AppText} from '../../../../components/Texts';

const PriceTag = ({
  title,
  price,
  strikeThru,
  textColor = '#000',
  titleStyle,
  priceStyle,
  t,
  isGroupScreen,
}) => {
  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      flexDirection: 'column',
      // justifyContent: 'space-evenly',
    },
    titleText: {
      fontSize: scaledSize(14),
      color: textColor,
      fontWeight: '500',
      fontFamily: Fonts.roboto,
      textAlign: 'center',
    },
    priceText: {
      fontSize: scaledSize(12),
      fontFamily: Fonts.roboto,
      color: textColor,
      // width: scaledSize(55),
      textAlign: 'center',
    },
  });
  return (
    <View style={styles.container}>
      <AppText style={[styles.titleText, priceStyle]}>{t(title)} </AppText>
      <AppText
        style={[
          styles.priceText,
          strikeThru ? {textDecorationLine: 'line-through'} : {},
          titleStyle,
        ]}>
        {'\u20B9' + price}
      </AppText>
    </View>
  );
};
export default PriceTag;
