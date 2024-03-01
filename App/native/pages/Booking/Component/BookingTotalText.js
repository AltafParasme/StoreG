import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../../../assets/global';
import {scaledSize} from '../../../../utils';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../components/Texts';

const BookingTotalText = ({name, price, t, saving, ...props}) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.textStyle}>
        {t(name)}
        {!!saving ? (
          <AppText style={styles.saveText}>
            {t(`   (Save ₹#SAVING#)`, {
              SAVING: saving,
            })}
          </AppText>
        ) : null}
      </AppText>
      <AppText>
        {props.isRewards ? '- \u20B9 ' : '\u20B9 '}
        <AppText style={styles.priceStyle}>{t(price)}</AppText>
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textStyle: {
    fontSize: scaledSize(16),
    color: Colors.textMuted,
    fontFamily: Fonts.roboto,
  },
  priceStyle: {
    fontSize: scaledSize(16),
    fontFamily: Fonts.roboto,
    textTransform: 'capitalize',
  },
  saveText: {
    fontSize: 10,
    color: Colors.blue,
    textAlign: 'center',
    textAlignVertical: 'top',
  },
});

export default withTranslation()(BookingTotalText);
