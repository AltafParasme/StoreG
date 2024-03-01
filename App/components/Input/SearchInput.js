import {Input} from 'react-native-elements';
import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import IconGroup from 'react-native-vector-icons/EvilIcons';

export default class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  onClosePress = () => {
    this.setState({text: ''});
    this.props.onChange('');
  };

  onChange = text => {
    this.setState({text});
    this.props.onChange(text);
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <IconGroup
          color="#999999"
          name="search"
          style={styles.searchIcon}
          size={25}
        />
        <TextInput
          style={[styles.input, this.props.inputStyles]}
          onChangeText={this.onChange}
          value={this.state.text}
          placeholder={this.props.placeholder || 'Search'}
          underlineColorAndroid="transparent"
        />
        <View style={styles.rightIcon}>
          {this.props.loading ? (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              style={styles.loader}
            />
          ) : (
            <TouchableOpacity style={styles.closeBtn}>
              <IconGroup
                name="close"
                color="#999999"
                size={25}
                onPress={this.onClosePress}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rightIcon: {
    marginRight: 10,
  },
  closeBtn: {},
  loader: {},
  input: {
    flex: 1,
  },
  container: {
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 5,
  },
});
