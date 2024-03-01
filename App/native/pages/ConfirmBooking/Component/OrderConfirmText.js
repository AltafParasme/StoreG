import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Images} from '../../../../../assets/images';
import {withTranslation} from 'react-i18next';
import {scaledSize, widthPercentageToDP} from '../../../../utils';
import {Fonts} from '../../../../../assets/global';
import {AppText} from '../../../../components/Texts';

const OrderConfirm = ({t, date}) => {
  return (
    <View style={styles.container}>
      <Image source={Images.confirm} style={styles.imageStyle} />
      <View style={styles.imageView}>
        <AppText style={styles.confirmText}>
          {t('Your order is confirmed!')}
        </AppText>
      </View>
      <View style={styles.textView}>
        <AppText style={styles.dateText}>
          {t('Delivery by #COUNT#', {COUNT: date})}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: widthPercentageToDP(70),
    alignItems: 'center',
    alignSelf: 'center',
  },
  imageStyle: {height: 55, width: 55},
  confirmText: {
    fontSize: scaledSize(30),
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 38,
    fontFamily: Fonts.roboto,
  },
  imageView: {
    marginTop: 15,
  },
  textView: {
    marginTop: 10,
    marginBottom: 15,
  },
  dateText: {
    fontSize: scaledSize(16),
    fontFamily: Fonts.roboto,
  },
});
export default withTranslation()(OrderConfirm);
