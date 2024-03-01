import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Images} from '../../../../../assets/images';
import {widthPercentageToDP, scaledSize} from '../../../../utils';
import {Colors, Fonts} from '../../../../../assets/global';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../components/Texts';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: widthPercentageToDP(26),
    flexDirection: 'column',
    marginHorizontal: 8,
  },
  imagestyle: {
    height: scaledSize(25),
    width: scaledSize(25),
  },
  indexView: {
    height: scaledSize(25),
    backgroundColor: Colors.orange,
    width: scaledSize(25),
    borderRadius: scaledSize(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: Colors.white,
    fontSize: scaledSize(14),
    fontWeight: 'bold',
    fontFamily: Fonts.roboto,
  },
  textView: {
    marginTop: scaledSize(10),
  },
  textStyle: {
    fontSize: scaledSize(12),
    fontWeight: '700',
    fontFamily: Fonts.roboto,
    textAlign: 'center',
  },
});

const StepTag = ({active, text, index, t, targetReached}) => {
  return (
    <View style={styles.container}>
      {targetReached > 0 ? (
        <Image source={Images.confirm} style={styles.imagestyle} />
      ) : active === text ? (
        <Image source={Images.confirm} style={styles.imagestyle} />
      ) : (
        <View style={styles.indexView}>
          <AppText style={styles.indexText}>{index + 1}</AppText>
        </View>
      )}
      <View style={styles.textView}>
        <AppText style={styles.textStyle}>{t(text)}</AppText>
      </View>
    </View>
  );
};
export default withTranslation()(StepTag);
