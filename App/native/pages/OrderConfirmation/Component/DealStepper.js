import React, {Component} from 'react';
import {View, Image, StyleSheet, FlatList} from 'react-native';
import {Images} from '../../../../../assets/images';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../components/Texts';
import {Constants} from '../../../../styles';
import DealExpireCounter from './DealExpireCounter';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import Button from '../../../../components/Button/Button';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';

class DealStepper extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {t, referralBonus} = this.props;
    return (
      <View style={styles.stepperContainer}>
        <View
          style={{
            marginTop: widthPercentageToDP(1),
            paddingLeft: scaledSize(15),
            paddingBottom: scaledSize(10),
          }}>
          <AppText size="M" bold>
            {t('How to get ₹#REFERRAL# Cashback?', {REFERRAL: referralBonus})}
          </AppText>
        </View>
        <View style={{justifyContent: 'center'}}>
          <View
            style={{
              marginLeft: scaledSize(40),
              marginRight: scaledSize(60),
              top: scaledSize(30),
              borderBottomColor: '#cdcdcd',
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: widthPercentageToDP(2),
            }}>
            <View
              style={{flexDirection: 'column', paddingLeft: scaledSize(28)}}>
              <View style={styles.iconStyles}>
                <AppText size="XL">🛍</AppText>
              </View>

              <AppText
                size="XS"
                style={{
                  width: widthPercentageToDP(18),
                  paddingTop: scaledSize(13),
                  textAlign: 'center',
                }}>
                {t('Buy a product')}
              </AppText>
            </View>
            <View style={{flexDirection: 'column'}}>
              <View style={styles.iconStyles}>
                <AppText size="XL">👭</AppText>
              </View>
              <AppText
                size="XS"
                style={{
                  width: widthPercentageToDP(18),
                  paddingTop: scaledSize(13),
                  textAlign: 'center',
                }}>
                {t('Invite friends')}
              </AppText>
            </View>
            <View style={{flexDirection: 'column'}}>
              <View style={styles.iconStyles}>
                <AppText size="XL">🗣</AppText>
              </View>
              <AppText
                size="XS"
                style={{
                  width: widthPercentageToDP(18),
                  paddingTop: scaledSize(13),
                  textAlign: 'center',
                }}>
                {t('1 Friend purchases')}
              </AppText>
            </View>
            <View
              style={{flexDirection: 'column', paddingRight: scaledSize(45)}}>
              <View style={styles.iconStyles}>
                <AppText size="XL">💰</AppText>
              </View>
              <AppText
                size="XS"
                style={{
                  width: widthPercentageToDP(18),
                  paddingTop: scaledSize(13),
                  textAlign: 'center',
                }}>
                {t('Get ₹#REFERRAL# cashback', {REFERRAL: referralBonus})}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  stepperContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    //paddingBottom: widthPercentageToDP(1),
    bottom: widthPercentageToDP(3),
  },
  iconStyles: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
    width: widthPercentageToDP(16),
    height: heightPercentageToDP(8),
    borderRadius: 40,
    borderWidth: 0.1,
  },
});

export default withTranslation()(DealStepper);
