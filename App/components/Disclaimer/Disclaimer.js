import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Image,
} from 'react-native';
import {AppText} from '../Texts';
import {heightPercentageToDP, scaledSize} from '../../utils';
import {Images} from '../../../assets/images';
import {Constants} from '../../styles';

export class Disclaimer extends Component {
  render() {
    const {t} = this.props;

    return (
      <View styles={{flex: 1}}>
        <AppText size={'L'} bold style={styles.earnAndUseView}>
          {t('Cancellation Policy')}
        </AppText>
        <View style={{flexDirection: 'column'}}>
          <View style={styles.iconicImagesView}>
            <Image source={Images.shareEarnProduct} style={styles.imageStyle} />
            <View style={styles.earnUseTextViewCancel}>
              <AppText style={{color: Constants.grey}}>
                {t('You cannot cancel order once it is shipped.')}
              </AppText>

              <AppText style={{color: Constants.grey}}>
                {t('Free gifts cannot be canceled')}
              </AppText>
            </View>
          </View>
        </View>

        <AppText size={'L'} bold style={styles.earnAndUseView}>
          {t('Return Policy')}
        </AppText>
        <View style={styles.iconicImagesView}>
          <Image source={Images.shareEarnProduct} style={styles.imageStyle} />
          <View style={styles.earnUseTextView}>
            <AppText size={'M'} bold style={{left: '1%'}}>
              {t('Return Policy For Grocery Items')}
            </AppText>
            <AppText style={{color: Constants.grey, left: '1%'}}>
              {t(
                'You can only return Grocery Items within 2 days after delivery.'
              )}
            </AppText>
          </View>
        </View>
        <View style={styles.iconicImagesView}>
          <Image source={Images.shareEarnProduct} style={styles.imageStyle} />
          <View style={styles.earnUseTextView}>
            <AppText size={'M'} bold style={{left: '1%'}}>
              {t('Return Policy For Non Grocery Items')}
            </AppText>
            <AppText style={{color: Constants.grey, left: '1%'}}>
              {t(
                'You can only return Non Grocery Items within 7 days after delivery.'
              )}
            </AppText>
          </View>
        </View>

        <View style={styles.iconicImagesView}>
          <Image source={Images.shareEarnProduct} style={styles.imageStyle} />
          <View style={styles.earnUseTextView}>
            <AppText style={{color: Constants.grey}}>
              {t('Free gift cannot be returned')}
            </AppText>

            <AppText style={{color: Constants.grey}}>
              {t(
                'On order return, rewards are cancelled and cannot be refunded'
              )}
            </AppText>
          </View>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  earnAndUseView: {
    fontSize: scaledSize(20),
    justifyContent: 'flex-start',
    margin: '5%',
    top: '3%',
  },
  earnUseTextViewCancel: {
    flexDirection: 'column',
    marginLeft: '3%',
    marginRight: '3%',
    paddingRight: '8%',
    justifyContent: 'center',
  },
  earnUseTextView: {
    flexDirection: 'column',
    margin: '3%',
    paddingRight: '8%',
  },
  iconicImagesView: {
    flexDirection: 'row',
    margin: '2%',
    justifyContent: 'space-between',
    paddingRight: '8%',
  },
  imageStyle: {
    top: '3%',
    height: scaledSize(47),
    width: scaledSize(47),
  },
});
