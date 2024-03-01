import React, {Component} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import {Images} from '../../../assets/images';
import {AppText} from '../Texts';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import CountDown from 'react-native-countdown-component';
import {Icon} from 'react-native-elements';
import {Colors} from '../../../assets/global';
import NavigationService from '../../utils/NavigationService';
import {LogFBEvent, Events} from '../../Events';

export class HeaderComponent extends Component {


  render() {
    const {
      t,
      dealCounter,
      title,
      flashSalesState,
      timerReplaceText,
      isNotTimer,
      iconViewStyle,
      titleStyle,
      onOverlayPress
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onOverlayPress}
        style={[styles.mainContainer, this.props.parentMainStyle]}>
        <View style={styles.leftComponent}>
          <AppText white bold size="XL" style={styles.titleStyle}>
            {t(title)}
          </AppText>
        </View>
        <View style={styles.centerComponent} />
        <View style={styles.rightComponent}>
          <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
            {flashSalesState == 'present' ? (
              <CountDown
                style={styles.countdown}
                until={dealCounter / 1000}
                onFinish={() => {
                  console.log('Timer finished....');
                }}
                size={scaledSize(16)}
                digitStyle={styles.timerDigit}
                digitTxtStyle={styles.timerDigitTxt}
                showSeparator
                separatorStyle={{color: '#fff'}}
                timeToShow={['H', 'M', 'S']}
                timeLabels={{h: 'hrs', m: 'min', s: 'sec'}}
                timeLabelStyle={{color: 'white', fontStyle: 'italic'}}
              />
            ) : (
              <View style={[styles.countdown]}>
                <AppText white size="M">
                  {t('#TIMERREPLACETEXT#', {
                    TIMERREPLACETEXT: timerReplaceText,
                  })}
                </AppText>
              </View>
            )}
          </View>

          <View
            style={[
              {
                justifyContent: 'center',
                alignItems: 'flex-end',
              },
              iconViewStyle
            ]}>
            {!isNotTimer ? (
              <Icon
                name={'chevron-right'}
                type={'font-awesome'}
                color={Colors.white}
                size={20}
              />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: heightPercentageToDP(10),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  countdown: {
    paddingRight: scaledSize(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerDigit: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerDigitTxt: {
    color: 'white',
    fontStyle: 'italic',
    paddingTop: scaledSize(16),
  },
  rightComponent: {
    flexDirection: 'row',
    flex: 0.45,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: scaledSize(10),
  },
  centerComponent: {
    flex: 0.05,
  },
  leftComponent: {
    flex: 0.8,
    justifyContent: 'center',
    paddingLeft: scaledSize(10),
  },
});

const mapStateToProps = state => ({});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(HeaderComponent)),
);
