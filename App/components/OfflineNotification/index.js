import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import SvgParser from '@target-corp/react-native-svg-parser';
import {NetworkConnection} from '../../utils/networkInfo';
import {AppText} from '../Texts';
import NoConnectionSvg from '../../../assets/jsStringSvgs/no-connection-image';
import IconGroup from 'react-native-vector-icons/MaterialCommunityIcons';
const NoConnectionImage = SvgParser(NoConnectionSvg, '');

export default class Offline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: !NetworkConnection.isConnected(),
    };
  }

  componentDidMount() {
    console.log('new listener enabled');
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.setState({isVisible: false});
      return true;
    });
    NetworkConnection.addChangeListener(this.handleConnectivityChange);
  }

  componentWillUnmount() {
    console.log('new listener disabled');
    this.backHandler.remove();
    NetworkConnection.removeChangeListener(this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    this.setState({isVisible: !isConnected});
  };

  render() {
    return (
      <Modal
        style={styles.modalContent}
        isVisible={this.state.isVisible}
        onBackdropPress={() => {
          return true;
        }}>
        <View
          style={{
            height: 200,
            width: 300,
            backgroundColor: 'white',
            flex: 0,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}>
          <IconGroup
            name="network-strength-off"
            size={35}
            style={{marginBottom: 10}}
          />
          <AppText light size="XL" style={styles.noInternetText}>
            No internet found check your connection
          </AppText>
          <TouchableOpacity
            onPress={() => {
              this.setState({isVisible: false});
            }}>
            <AppText
              size="XXL"
              style={{color: '#41ae5d', textDecorationLine: 'underline'}}>
              Continue
            </AppText>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInternetText: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
});
