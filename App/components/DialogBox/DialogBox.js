import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Image,
} from 'react-native';
import {AppText} from '../Texts';
import Button from '../Button/Button';
import {heightPercentageToDP, scaledSize} from '../../utils';
import {Images} from '../../../assets/images';
import {Constants} from '../../styles';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../../../assets/global';

export class DialogBox extends Component {
  render() {
    const {
      t,
      title,
      showYes,
      showNo,
      yesText,
      noText,
      yesClick,
      noClick,
      onBackButtonPress,
      isVisible,
      shippingCharges,
      minCartValue,
    } = this.props;

    return (
      <Modal
        isVisible={this.props.isVisible}
        style={[styles.modalStyle, {flex: shippingCharges > 0 ? 0.3 : 0.2}]}
        onBackButtonPress={this.props.onBackButtonPress}>
        {shippingCharges > 0 ? (
          <AppText black bold style={{margin: scaledSize(15)}} size="M">
            {t(this.props.title, {
              SHIPPINGCHARGES: shippingCharges,
              MINCARTVALUE: minCartValue,
              NL: '\n',
              RS: '\u20B9',
            })}
            ?
          </AppText>
        ) : (
          <AppText black bold style={{margin: scaledSize(15)}} size="M">
            {t(this.props.title)}?
          </AppText>
        )}

        <View style={styles.modalContainer}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Button
              styleContainer={styles.buttonStyle}
              onPress={this.props.handleModalClick}>
              <AppText greenishBlue bold size="M">
                {t('YES')}
              </AppText>
            </Button>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Button
              styleContainer={styles.buttonStyle}
              onPress={this.props.toggleModal}>
              <AppText red bold size="M">
                {t('NO')}
              </AppText>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

var styles = StyleSheet.create({
  modalStyle: {
    top: '30%',
    backgroundColor: Constants.white,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  modalContainer: {
    flex: 1,
    padding: heightPercentageToDP(5),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Constants.screenbackground,
  },
  buttonStyle: {
    width: '80%',
    borderColor: Colors.mutedBorder,
    borderWidth: scaledSize(1),
    borderRadius: scaledSize(15),
    justifyContent: 'center',
    alignItems: 'center',
    height: scaledSize(40),
    backgroundColor: 'white',
  },
});
