import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import {Fonts} from '../../../../../assets/global';
import CountDown from 'react-native-countdown-component';
//import Icon from 'react-native-vector-icons/AntDesign';
import {Constants} from '../../../../styles';
import {Colors} from '../../../../../assets/global';
import {AppText} from '../../../../components/Texts';
import {scaledSize} from '../../../../utils';

// (<Icon type="FontAwesome" name="rupee" />
const DealsCountDown = ({
  t,
  fgStatus,
  savingStr,
  groupStr,
  offerDuration,
  handleTimer,
}) => (
  <React.Fragment>
    <View style={[styles.section, styles.giftSection]}>
      <AppText size="XL">
        🛍{' '}
        <AppText size="M" medium white>
          {savingStr}
        </AppText>
      </AppText>

      {/* <AppText
        size="S"
        medium
        style={
          fgStatus === 'UNCLAIMED'
            ? {color: Colors.tomato}
            : {color: Constants.white}
        }>
        {groupStr}
      </AppText> */}
    </View>
    {/* <View style={[styles.section, styles.countDownSection]}>
      <CountDown
        style={styles.countdown}
        until={offerDuration || 259200} //3 days default time
        onFinish={() => {
          console.log('Timer finished....');
          handleTimer();
        }}
        size={14}
        timeLabels={''}
        digitStyle={styles.digitStyle}
        digitTxtStyle={styles.digitTxtStyle}
        showSeparator
        separatorStyle={styles.separatorStyle}
        timeToShow={['D', 'H', 'M', 'S']}
        timeLabelStyle={{color: Constants.white}}
        timeLabels={{
          d: t('Days'),
          h: t('Hours'),
          m: t('Minutes'),
          s: t('Second'),
        }}
      />
    </View> */}

    <View style={[styles.section, styles.countDownSection]}>
      <AppText size="M" white>
        {t(`View Details >>`)}
      </AppText>
    </View>
  </React.Fragment>
);

DealsCountDown.propTypes = {
  handleTimer: PropTypes.func,
};

DealsCountDown.defaultProps = {
  handleTimer: () => {},
};

const styles = StyleSheet.create({
  section: {
    height: '100%',
    justifyContent: 'center',
  },
  giftSection: {
    paddingStart: 15,
  },
  groupTitle: {
    color: Constants.white,
    fontSize: scaledSize(13),
    fontWeight: '700',
    fontFamily: Fonts.roboto,
  },
  freeTitle: {
    color: Colors.tomato,
    fontFamily: Fonts.roboto,
  },
  countDownSection: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 15,
  },
  countdown: {
    paddingRight: 5,
  },
  digitStyle: {
    backgroundColor: Colors.tomato,
  },
  digitTxtStyle: {color: '#fff'},
  separatorStyle: {
    color: '#fff',
  },
});

export default DealsCountDown;
