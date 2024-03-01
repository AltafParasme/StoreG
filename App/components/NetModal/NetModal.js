import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import Modal from 'react-native-modal';
import {Colors} from '../../../assets/global';
import {
  scaledSize,
  heightPercentageToDP,
  AppWindow,
  widthPercentageToDP,
} from '../../utils';
import {withTranslation} from 'react-i18next';
import {SvgXml} from 'react-native-svg';
import noInternetIcon from '../../../assets/jsStringSvgs/NoInternetConnect';
import LinearGradientButton from '../Button/LinearGradientButton';
import {AppText} from '../Texts';

class VideoModal extends PureComponent {
  render() {
    const {visible, tryAgain, t} = this.props;
    return (
      <Modal
        style={{alignItems: 'center'}}
        presentationStyle="overFullScreen"
        hasBackdrop={true}
        isVisible={visible}
        coverScreen={true}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}>
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
          <SvgXml
            xml={noInternetIcon}
            width={scaledSize(150)}
            height={scaledSize(150)}
          />
          <AppText style={styles.opsText}>{t('Oops!')}</AppText>
          <AppText style={styles.internetText}>
            {t('No internet connection Found.')}
          </AppText>
          <AppText style={styles.internetText}>
            {t('Check your connection')}
          </AppText>
          <View style={{height: 30, margin: 20}}>
            <LinearGradientButton
              btnStyles={{alignItems: 'center', justifyContent: 'center'}}
              colors={[Colors.blue, Colors.blue]}
              title={'TRY AGAIN'}
              onPress={tryAgain}
            />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  modalView: {
    borderRadius: 10,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPercentageToDP(60),
  },
  opsText: {
    fontSize: scaledSize(25),
    color: '#727374',
    fontWeight: 'bold',
  },
  internetText: {
    textAlign: 'center',
    fontSize: scaledSize(14),
    color: '#B0B1B2',
    fontWeight: '500',
  },
});
export default withTranslation()(VideoModal);
