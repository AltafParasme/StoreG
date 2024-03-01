import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Constants} from '../../../../styles';
import {AppText} from '../../../../components/Texts';
import {Images} from '../../../../../assets/images';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';

const TrustMarker = ({icon, name, t}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        <Image 
          resizeMethod = {'resize'}
          resizeMode = {'contain'}
          source={Images.greenCheck} 
          style={styles.imageStyle}
        />
      <View style={styles.textView}>
        <AppText size="XS" bold style={styles.textStyle}>
          {t(`100% Genuine`)}
        </AppText>
        <AppText size="XS" style={styles.textStyle}>
          {t(`Products`)}
        </AppText>
      </View>
      </View>
      <View style={styles.imageView}>
        <Image 
            resizeMethod = {'resize'}
            resizeMode = {'contain'}
            source={Images.greenCheck} 
            style={styles.imageStyle}
          />
      <View style={styles.textView}>
        <AppText size="XS" bold style={styles.textStyle}>
          {t(`7 Day Easy Return`)}
        </AppText>
        <AppText size="XS" style={styles.textStyle}>
          {t(`No Questions Asked`)}
        </AppText>
      </View>
      </View>
      <View style={styles.imageView}>
        <Image 
          resizeMethod = {'resize'}
          resizeMode = {'contain'}
          source={Images.greenCheck} 
          style={styles.imageStyle}
        />
      <View style={styles.textView}>
        <AppText size="XS" bold style={styles.textStyle}>
          {t(`Cash on Delivery`)}
        </AppText>
        <AppText size="XS" style={styles.textStyle}>
          {t(`Accepted`)}
        </AppText>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageView: {
    flexDirection: 'column',
    width: widthPercentageToDP(33),
    justifyContent: 'center',
    alignItems: 'center'
  },
  textView: {
    width: widthPercentageToDP(33),
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    height: widthPercentageToDP(5),
    width: widthPercentageToDP(5),
    resizeMode: 'contain'
  },
  textStyle: {
    textAlign: 'center'
  }
});
export default withTranslation()(TrustMarker);
