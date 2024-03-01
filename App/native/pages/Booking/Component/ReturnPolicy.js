import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Colors, Fonts} from '../../../../../assets/global';
import {scaledSize} from '../../../../utils';
import Button from '../../../../components/Button/Button';
import {Images} from '../../../../../assets/images';
import {withTranslation} from 'react-i18next';
import NavigationService from '../../../../utils/NavigationService';
import {AppText} from '../../../../components/Texts';

const navigateTo = () => {
  NavigationService.navigate('ReturnPolicy');
};

const ReturnPolicy = ({t}) => {
  return (
    <View style={styles.container}>
      <Button onPress={navigateTo}>
        <AppText style={styles.returnStyle}>{t('Return Policy')}</AppText>
      </Button>
      <View style={styles.cashView}>
        <Image source={Images.selected} style={styles.imageStyle} />
        <AppText style={styles.cashText}>{t('Pay on Delivery')}</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  returnStyle: {
    fontSize: scaledSize(13),
    color: Colors.orange,
    textDecorationLine: 'underline',
    fontFamily: Fonts.roboto,
  },
  imageStyle: {
    height: 13,
    width: 13,
    marginTop: 3,
    marginRight: 5,
  },
  cashText: {
    fontSize: scaledSize(13),
    color: Colors.blue,
    fontFamily: Fonts.roboto,
  },
  cashView: {flexDirection: 'row'},
});

export default withTranslation()(ReturnPolicy);
