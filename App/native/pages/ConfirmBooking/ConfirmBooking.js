import React, {Component} from 'react';
import {SafeAreaView, View, Text, StyleSheet, BackHandler} from 'react-native';
import OrderConfirm from './Component/OrderConfirmText';
import {scaledSize} from '../../../utils';
import ListComponent from '../Home/component/ListComponent';
import {withTranslation} from 'react-i18next';
import {Colors, Fonts} from '../../../../assets/global';
import LinearGradientButton from '../../../components/Button/LinearGradientButton';
import {connect} from 'react-redux';
import NavigationService from '../../../utils/NavigationService';
import {AppText} from '../../../components/Texts';

class ConfirmBooking extends Component {
  static navigationOptions = {
    header: null,
  };

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    NavigationService.navigateBack();
    return true;
  }

  render() {
    const {t, booking} = this.props;
    if (booking && Object.keys(booking).length === 0) {
      return null;
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={{height: scaledSize(500)}}>
          <OrderConfirm date={'Mon, 8 Oct'} />
          <View style={styles.saveTextView}>
            <AppText style={styles.saveText}>
              {' '}
              {t('Congratulations !! You have saved ₹#AMOUNT#', {
                AMOUNT: 100,
              })}{' '}
            </AppText>
          </View>
          {/* <ListComponent item={booking} withoutButton={true} isLast={true} /> */}
        </View>
        <View style={styles.buttonView}>
          <View style={styles.buttonInnerView}>
            <LinearGradientButton
              colors={['#ff8648', '#dc4d04']}
              title={'SHOW ITEM IN GROUP'}
              onPress={() => this.props.navigation.navigate('OrderConfirmation')}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveTextView: {
    height: 50,
    marginVertical: 10,
    backgroundColor: '#E4F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: scaledSize(16),
    color: Colors.blue,
    fontFamily: Fonts.roboto,
  },
  buttonView: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 20,
    width: '90%',
  },
  buttonInnerView: {
    height: 50,
  },
});

const mapStateToProps = state => ({
  booking: state.booking.booking,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ConfirmBooking)
);
