import React, {Component} from 'react';
import {View, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import styles, {Constants} from '../../styles';
import {AppText} from '../Texts';
import {Input} from '../Input';

/*
!
!
broken
!
don't use
!
!
!
!
!
*/

const DropDownWrapperStyles = {
  position: 'relative',
};

const scrollStyle = {
  zIndex: 1000,
  left: 0,
  position: 'absolute',
  backgroundColor: 'white',
  ...styles.stdSideMargin,
  borderWidth: 1,
  height: 150,
  width: 150,
  borderColor: '#d8d8d8',
  borderRadius: 4,
  shadowColor: '#d8d8d8',
  shadowOpacity: 0.8,
  shadowRadius: 1,
  shadowOffset: {
    height: 1,
    width: 0,
  },
  paddingBottom: 10,
};

const listItemStyle = {
  ...styles.stdSidePadding,
  paddingTop: 10,
};

class DropDown extends Component {
  constructor(props) {
    super(props);
    this.height = 100;
    this.inputHeight = 50;
    this.state = {
      dropdownView: true,
      value: '',
    };
  }

  onItemSelect = item => {
    console.log('!', item.value);
  };

  populateList = () => {
    const {onItemSelect} = this;
    return (
      <ScrollView
        style={[scrollStyle, {top: -1 * (this.height + this.inputHeight)}]}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag">
        {this.props.data.length ? (
          this.props.data.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={listItemStyle}
              onPress={() => {
                this.setState({value: item.value, dropdownView: false});
                this.props.onItemSelect(item);
              }}>
              <AppText dark size="L">
                {item.label}
              </AppText>
            </TouchableOpacity>
          ))
        ) : (
          <AppText light size="M">
            No results found
          </AppText>
        )}
      </ScrollView>
    );
  };

  onChangeText = val => {
    this.setState({value: val});
    if (!this.state.dropdownView) {
      this.setState({
        dropdownView: true,
      });
    }
    this.props.onChangeText(val);
  };

  onFocus = () => {
    if (!this.state.dropdownView) {
      this.setState({dropdownView: true});
    }
  };

  render() {
    console.log('render', this.state.dropdownView, this.state.value);
    return (
      <View style={DropDownWrapperStyles}>
        <TextInput
          ref={el => (this.input = el)}
          label={this.props.label || ''}
          placeholder={this.props.placeholder || ''}
          onChangeText={this.onChangeText}
          value={this.state.value}
          onFocus={this.onFocus}
          onBlur={() => this.setState({dropdownView: false})}
          onSubmitEditing={() => this.input.blur()}
          {...this.props.inputProps}
          onLayout={event => {
            const {x, y, width, height} = event.nativeEvent.layout;
            console.log('height', height);
            this.inputHeight = height;
          }}
        />
        {this.state.dropdownView && this.populateList()}
      </View>
    );
  }
}

export default DropDown;
