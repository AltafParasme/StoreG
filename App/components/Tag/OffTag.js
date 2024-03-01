/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {scaledSize} from '../../utils';
import {Fonts} from '../../../assets/global';
import {Constants} from '../../styles';
import {AppText} from '../Texts';

const OffTag = ({
  title,
  price,
  strikeThru,
  textColor = Constants.white,
  t,
  styleExtra,
}) => {
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      zIndex: 9999,
    },
    titleText: {
      color: textColor,
      fontFamily: Fonts.roboto,
      textTransform: 'uppercase',
      fontStyle: 'italic',
    },
    priceText: {
      fontFamily: Fonts.roboto,
      color: textColor,
    },
    offTag: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 50 / 2,
      borderBottomRightRadius: -10,
      marginTop: -90,
      marginLeft: -10,
      backgroundColor: '#ec3d5a',
    },
  });
  return (
    <View style={styles.container}>
      <View style={[styles.offTag, styleExtra]}>
        <AppText
          size="S"
          bold
          style={[
            styles.priceText,
            strikeThru ? {textDecorationLine: 'line-through'} : {},
          ]}>
          {'₹' + price}
        </AppText>
        <AppText bold size="S" style={styles.titleText}>
          {t(title)}{' '}
        </AppText>
      </View>
    </View>
  );
};
export default OffTag;
