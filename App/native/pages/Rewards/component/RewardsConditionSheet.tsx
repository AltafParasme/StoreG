import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {scaledSize} from '../../../../utils';
import {Colors, Fonts} from '../../../../../assets/global';
import {withTranslation} from 'react-i18next';
import NavigationService from '../../../../utils/NavigationService';
import {LogFBEvent, Events} from '../../../../Events';
import {AppText} from '../../../../components/Texts';

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    // marginTop: scaledSize(1),
    width: '100%',
    maxHeight: height - 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

const RewardsConditionSheet = ({active, text, index, t, targetReached}) => {
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


export default withTranslation()(RewardsConditionSheet);
