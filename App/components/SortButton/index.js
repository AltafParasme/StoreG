import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import IconGroup from 'react-native-vector-icons/MaterialIcons';
import {AppText} from '../Texts';

// This components deals with sort with 2 options [new,old] . Will keep on toggling them on each click

class SortButton extends Component {
  onPress = () => {
    const toggledOption = this.props.options.filter(
      option => option.key != this.props.value.key
    );
    this.props.handleOptionChange(toggledOption[0]);
  };

  render() {
    return (
      <View style={this.props.wrapperStyle}>
        <TouchableOpacity onPress={this.onPress} style={styles.button}>
          <AppText>{this.props.value.displayValue}</AppText>
          <IconGroup name="swap-vert" size={20} />
        </TouchableOpacity>
      </View>
    );
  }
}

SortButton.propTypes = {
  options: PropTypes.array.isRequired,
  defaultValue: PropTypes.string,
  wrapperStyle: PropTypes.object,
};

SortButton.defaultProps = {
  handleOptionChange: () => {},
  wrapperStyle: {},
};

const styles = StyleSheet.create({
  button: {
    borderColor: '#979797',
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'solid',
    height: 35,
    width: 130,
    backgroundColor: '#ededed',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
});

export default SortButton;
