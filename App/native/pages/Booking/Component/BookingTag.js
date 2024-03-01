import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Colors, Fonts} from '../../../../../assets/global';
import {scaledSize} from '../../../../utils';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../components/Texts';

const BookingTag = ({icon, name, t}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        <Image source={icon} style={styles.imageStyle} />
      </View>
      <View style={styles.textView}>
        <AppText numberOfLines={2} style={styles.textStyle}>
          {t(name)}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageStyle: {
    height: 35,
    width: 35,
  },
  textStyle: {
    fontSize: scaledSize(12),
    color: Colors.textMuted,
    flexWrap: 'wrap',
    fontWeight: '500',
    fontFamily: Fonts.roboto,
  },
  imageView: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  textView: {
    height: 50,
    width: scaledSize(75),
    justifyContent: 'center',
  },
});
export default withTranslation()(BookingTag);
