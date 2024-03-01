import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {scaledSize} from '../../../../utils';
import {Colors, Fonts} from '../../../../../assets/global';
import CountDown from 'react-native-countdown-component';
import {withTranslation} from 'react-i18next';
import {Constants} from '../../../../styles';

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    // marginTop: scaledSize(1),
    width: '100%',
    maxHeight: height - 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerView: {
    height: 20,
    // backgroundColor: Colors.lightOrange,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: scaledSize(12),
    fontFamily: Fonts.roboto,
    paddingRight: 10,
  },
  countdown: {
    paddingRight: 5,
  },
  digitStyle: {
    backgroundColor: Colors.black,
    height: 20,
    width: 25,
    paddingTop: 8
  },
  digitTxtStyle: {
    fontSize: scaledSize(12),
    color: Colors.black,
    paddingTop: 7,
    //fontStyle: 'italic',
  },
  separatorStyle: {
    color: Colors.black,
  },
});

const DealExpireCounter = ({
  targetReached,
  items,
  selfItem,
  t,
  dealEndsDate,
  isTransparent,
  screen,
}) => {
  const roundDate = Math.round(dealEndsDate / 1000);
  return (
    <View style={styles.container}>
      {/* {!targetReached ? ( */}
      <View style={styles.headerView}>
        <Text
          style={[
            styles.headerText,
            (screen === 'FreeGift' || screen === 'OrderConfirmation') ? {color: Colors.white} : {color: Colors.blac},
          ]}>
          {t('Offer expires in')}
        </Text>
        <CountDown
          style={[
            styles.countdown,
            !(screen === 'FreeGift' || screen === 'OrderConfirmation') ? {paddingBottom: 7} : {},
          ]}
          until={roundDate}
          onFinish={() => {
            console.log('Timer finished....');
          }}
          size={14}
          digitStyle={[
            styles.digitStyle,
            isTransparent ? {backgroundColor: 'transparent'} : {},
          ]}
          digitTxtStyle={[
            styles.digitTxtStyle,
            isTransparent
              ? (screen === 'FreeGift' || screen === 'OrderConfirmation')
                ? {color: Colors.white}
                : {color: Colors.black}
              : {},
          ]}
          showSeparator
          separatorStyle={[
            styles.separatorStyle,
            (screen === 'FreeGift' || screen === 'OrderConfirmation') ? {color: Colors.white} : {color: Colors.black},
          ]}
          timeLabelStyle={
            !(screen === 'FreeGift' || screen === 'OrderConfirmation')
              ? {color: Colors.black, fontStyle: 'italic'}
              : {color: Colors.white, fontStyle: 'italic'}
          }
          timeToShow={['D', 'H', 'M', 'S']}
          timeLabels={{
            d: t('Days'),
            h: t('Hours'),
            m: t('Minutes'),
            s: t('Second'),
          }}
        />
      </View>
    </View>
  );
};

export default withTranslation()(DealExpireCounter);