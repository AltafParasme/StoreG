import React, {Component} from 'react';
import {
  View,
  Picker,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import IconGroup from 'react-native-vector-icons/MaterialIcons';
import globalStyles, {Constants} from '../../styles';
import {AppText} from '../Texts';

class NativeDropDown extends Component {
  ddRef = el => {
    if (el) this.dd = el;
  };

  render() {
    const data =
      this.props.options && this.props.options.length
        ? this.props.options.map(e => e.label)
        : [];
    const {defaultValue} = this.props;
    return (
      <View style={{position: 'relative', flex: 1}}>
        <ModalDropdown
          ref={this.ddRef}
          style={{...styles.container, ...(this.props.style || {})}}
          options={data}
          onSelect={val => {
            if (this.props.onValueChange) {
              this.props.onValueChange(this.props.options[val]);
            }
          }}
          defaultValue={defaultValue}
          dropdownStyle={{
            ...styles.dropdown,
            ...(this.props.dropdownStyle || {}),
          }}
          textStyle={{
            ...{fontSize: 15, paddingTop: 5, paddingLeft: 10},
            ...this.props.textStyle,
          }}
          dropdownTextStyle={{
            ...{
              fontSize: 15,
              paddingTop: 17,
              paddingLeft: 10,
              paddingBottom: 17,
            },
            ...this.props.textStyle,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 10,
              paddingRight: 10,
              height: 30,
            }}>
            <AppText size={'L'}>{defaultValue}</AppText>
            <IconGroup name={'arrow-drop-down'} size={30} />
          </View>
        </ModalDropdown>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    ...globalStyles.bottomGreyBorder,
  },
  dropdown: {
    width: '100%',
  },
});

export default NativeDropDown;
