import React from 'react';
import {
  ListView,
  RefreshControl,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {GetOfferData} from '../redux/action';
import {Colors, Fonts} from '../../../../../assets/global';
import {widthPercentageToDP, scaledSize} from '../../../../utils';

class HoverEffect extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  closePopOver = () => {
    if (this.state.popover) {
      this.setState({
        popover: false,
      });
    }
  };

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: AppWindow.height,
          width: AppWindow.width,
          backgroundColor: 'transparent',
        }}
        onStartShouldSetResponder={this.closePopOver}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: scaledSize(300),
            width: scaledSize(300),
            borderBottomLeftRadius: scaledSize(300),
            backgroundColor: 'rgba(255, 138, 78, 0.9)',
            paddingRight: 8,
          }}>
          <View>
            <View
              style={{
                height: NAVBAR_HEIGHT + 10,
                alignSelf: 'flex-end',
              }}>
              <Rewards isText />
            </View>
            <View
              style={{
                marginTop: NAVBAR_HEIGHT + STATUS_BAR_HEIGHT,
              }}>
              <AppText
                style={{
                  textAlign: 'right',
                  fontSize: scaledSize(18),
                  color: Colors.white,
                }}>
                {t('₹50 Signup reward added!')}
              </AppText>
              <AppText
                style={{
                  textAlign: 'right',
                  fontSize: scaledSize(18),
                  color: Colors.white,
                }}>
                {t('Earn extra ₹50 by sharing')}
              </AppText>
              <AppText
                style={{
                  textAlign: 'right',
                  fontSize: scaledSize(18),
                  color: Colors.white,
                }}>
                {t(' the app with friends!')}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  orMainView: {
    borderWidth: 0.7,
    position: 'relative',
    marginVertical: 15,
    borderColor: Colors.mutedBorder,
  },
  orView: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 40,
    width: 50,
    left: widthPercentageToDP(50) - 50 / 2,
    top: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orInnerView: {
    backgroundColor: '#DDDEDF',
    borderRadius: 30,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orTextStyle: {
    fontSize: scaledSize(14),
    color: '#292f3a',
    fontFamily: Fonts.roboto,
  },
});

export default HoverEffect;
