import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import {Colors} from '../../../../../assets/global';
import {withTranslation} from 'react-i18next';
import RewardImage from '../../../../../assets/jsStringSvgs/RewardImage';
import RewardStar from '../../../../../assets/jsStringSvgs/RewardStar';
import {AppText} from '../../../../components/Texts';
import {SvgXml} from 'react-native-svg';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import {
  AppWindow,
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';

let now = new Date();
let cutOffTime = new Date();
cutOffTime.setDate(now.getDate() + 1);
cutOffTime.setHours(24);
cutOffTime.setMinutes(0);
cutOffTime.setMilliseconds(0);

let _duration = moment.duration(moment(cutOffTime).diff(moment(now))).valueOf();
let duration = 0;
if (_duration > 86400000) {
  duration = _duration - 86400000;
} else {
  duration = _duration;
}
// const dealCounter = duration / 1000;
const dealCounter = 3600;

const RewardActionView = ({
  handleConfirm,
  rewards,
  inviteToken,
  t,
  fgStatus,
}) => {
  let mssg;
  let buttonText;

  if (!!fgStatus && fgStatus === 'REPEAT') {
    buttonText = 'Claim your reward';
  } else {
    buttonText = 'Claim your free gift';
  }

  if (inviteToken) {
    mssg = `Your friend invited you to join ShopG Saving Group`;
  } else {
    mssg = `Welcome to Glowfit`;
  }

  return (
    <View style={styles.topContainer}>
      <View style={styles.innerView}>
        <SvgXml
          xml={RewardImage}
          width={scaledSize(150)}
          height={scaledSize(150)}
        />
        <AppText size="XL" dark bold style={styles.congratulationsText}>
          {t(mssg)}
        </AppText>
      </View>
      <View style={{flex: 0.5}}>
        {rewards && rewards.rewardsInfo.joiningBonus > 0 ? (
          <View style={{flex: 0.4}}>
            <AppText size="L" style={styles.congratulationsText}>
              {t('You have received joining bonus')}
            </AppText>
            <View style={styles.rewardIconVIew}>
              <SvgXml
                xml={RewardStar}
                width={scaledSize(25)}
                height={scaledSize(25)}
              />
              <AppText size="XXXL" bold style={styles.rewardBal}>
                {`₹ ${rewards.rewardsInfo.joiningBonus}`}
              </AppText>
            </View>
          </View>
        ) : (
          <View style={styles.rewardIconVIew}>
            <SvgXml
              xml={RewardStar}
              width={scaledSize(30)}
              height={scaledSize(30)}
            />
          </View>
        )}

        <View style={styles.timerText}>
          <AppText size="S" bold style={styles.rewardsText}>
            {t('Hurry up! Order reward expires in ')}
          </AppText>

          <CountDown
            until={dealCounter}
            onFinish={() => {
              console.log('Timer finished....');
            }}
            size={scaledSize(12)}
            digitStyle={styles.timerDigit}
            digitTxtStyle={styles.timerDigitTxt}
            showSeparator
            separatorStyle={{color: Colors.slightPink}}
            timeToShow={['H', 'M', 'S']}
            timeLabels={{h: '', m: '', s: ''}}
            timeLabelStyle={{color: Colors.slightPink}}
          />
        </View>
        <TouchableOpacity onPress={handleConfirm}>
          <View style={styles.buttonView}>
            <LinearGradientButton
              colors={[Colors.slightOrange, Colors.darkOrange]}
              title={t(`${buttonText}`)}
              onPress={handleConfirm}
              gradientStyles={{flex: 0}}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    padding: 10,
    width: AppWindow.width - 10,
    flex: 1,
    shadowOffset: {width: 10, height: 10},
    shadowColor: Colors.black,
    shadowOpacity: 1.0,
  },
  innerView: {
    alignItems: 'center',
    marginHorizontal: widthPercentageToDP(2),
    flex: 0.5,
  },
  congratulationsText: {
    textAlign: 'center',
  },
  rewardsText: {
    color: Colors.slightPink,
    textAlign: 'center',
  },
  rewardBal: {
    paddingLeft: 8,
    color: Colors.orange,
  },
  rewardIconVIew: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    flex: 0.3,
    padding: scaledSize(5),
    width: widthPercentageToDP(90),
  },
  timerText: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    width: widthPercentageToDP(90),
    backgroundColor: Colors.partialOrange,
    flexDirection: 'row',
  },
  timerDigit: {
    backgroundColor: 'transparent',
    height: heightPercentageToDP(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerDigitTxt: {
    color: Colors.slightPink,
  },
});

export default withTranslation()(React.memo(RewardActionView));
