import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal/src/index';
import {AppText} from '../Texts';
import {PrimaryButton} from '../Buttons';

export default class ConfirmationModal extends Component {
  componentDidMount() {
    // this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //   this.props.onBackDropPress();
    //   return true;
    // });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.isVisible !== nextProps.isVisible;
  }

  componentWillUnmount() {
    // this.backHandler.remove();
  }

  render() {
    return (
      <Modal
        style={styles.modalContent}
        isVisible={this.props.isVisible}
        onBackdropPress={() => this.props.onBackDropPress()}>
        <View
          style={{
            height: 225,
            width: 350,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '25%',
              backgroundColor: '#dfdfe4',
            }}>
            <AppText dark size="XXL">
              {' '}
              {this.props.title}
            </AppText>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0,
              padding: 20,
            }}>
            <AppText size="XL">{this.props.content}</AppText>
            <View style={{height: '15%'}} />
            {this.props.preConfirmButton ? (
              <View style={{flexDirection: 'row'}}>
                <PrimaryButton
                  onPress={() => {
                    if (this.props.preConfirmButtonPress) {
                      this.props.preConfirmButtonPress();
                    }
                    // this.props.onBackDropPress();
                  }}
                  title={
                    <AppText style={{color: '#27ae60'}} size="L">
                      {this.props.preConfirmButtonText}
                    </AppText>
                  }
                  style={{
                    backgroundColor: 'white',
                    height: 35,
                    width: 150,
                    borderWidth: 2,
                    borderColor: '#27ae60',
                  }}
                  disabled={this.props.disabled || false}
                />
                <PrimaryButton
                  onPress={() => {
                    if (this.props.confirmButtonPress) {
                      this.props.confirmButtonPress();
                    }
                    this.props.onBackDropPress();
                  }}
                  title={
                    <AppText size="L">{this.props.confirmButtonText}</AppText>
                  }
                  style={{
                    backgroundColor: '#27ae60',
                    height: 35,
                    width: 110,
                    marginLeft: 15,
                  }}
                  disabled={this.props.disabled || false}
                />
              </View>
            ) : (
              <PrimaryButton
                onPress={() => {
                  if (this.props.confirmButtonPress) {
                    this.props.confirmButtonPress();
                  }
                  this.props.onBackDropPress();
                }}
                title={
                  <AppText size="L">{this.props.confirmButtonText}</AppText>
                }
                style={{backgroundColor: '#27ae60', height: 40, width: 150}}
                disabled={this.props.disabled || false}
              />
            )}
          </View>
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
});
