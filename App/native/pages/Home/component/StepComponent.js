import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../../../assets/global';
import {Images} from '../../../../../assets/images';
import PropTypes from 'prop-types';
import {noop, scaledSize} from '../../../../utils';
import {AppText} from '../../../../components/Texts';

const styles = StyleSheet.create({
  container: {
    height: scaledSize(50),
    flexDirection: 'row',
    backgroundColor: Colors.blue,
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  stepView: {
    justifyContent: 'center',
  },
  stepText: {
    fontSize: scaledSize(16),
    color: Colors.white,
    fontWeight: '700',
    fontFamily: Fonts.roboto,
  },
  giftIconView: {
    justifyContent: 'center',
    width: '40%',
    height: scaledSize(50),
  },
  separatorView: {
    flexDirection: 'row',
    height: scaledSize(50),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  giftText: {
    fontSize: scaledSize(15),
    color: Colors.white,
    fontWeight: '700',
    paddingRight: 5,
    fontFamily: Fonts.roboto,
  },
  thumbnailStyle: {
    borderWidth: 2,
    borderColor: Colors.white,
  },
  mainLineView: {
    height: scaledSize(50),
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 5,
  },
  lineView: {
    borderWidth: 0.6,
    height: scaledSize(25),
    borderColor: Colors.mutedBorder,
    opacity: 0.5,
  },
});

const StepComponent = ({t}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.stepView}>
          <AppText style={styles.stepText}>
            {'STEP 1 : Book your free gift'}
          </AppText>
        </View>
        <View style={styles.giftIconView}>
          <View style={styles.separatorView}>
            <View style={styles.mainLineView}>
              <View style={styles.lineView} />
            </View>
            <AppText style={styles.giftText}> {t('Get free gift!')} </AppText>
          </View>
        </View>
      </View>
    </>
  );
};

StepComponent.propTypes = {
  t: PropTypes.func,
};

StepComponent.defaultProps = {
  t: noop,
};

export default StepComponent;
