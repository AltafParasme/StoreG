import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class RadioButton extends Component {
  state = {
    value: null,
  };

  render() {
    const {name, options, value} = this.props;

    return (
      <View>
        {options.map(res => {
          return (
            <View key={res.key} style={styles.container}>
              <TouchableOpacity
                style={styles.radioCircle}
                onPress={() => {
                  this.props.onChange(res.key, name);
                }}>
                {value === res.key && <View style={styles.selectedRb} />}
              </TouchableOpacity>
              <Text style={styles.radioText}>{res.text}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  radioText: {
    marginLeft: 15,
    fontSize: 14,
    color: '#000',
  },
  radioCircle: {
    height: 25,
    width: 25,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#00a9a6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: '#00a9a6',
  },
});
