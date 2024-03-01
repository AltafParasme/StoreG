import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import globalStyles from '../../styles';
import withStatics from '../../utils/withStatics';

class Toast extends Component {
  state = {
    visibility: false,
    Component: null,
    componentProps: null,
    onPress: () => {},
  };

  componentDidMount() {
    this.props.staticsEnabler.register('open', this.openToast);
    this.props.staticsEnabler.register('close', this.closeToast);
  }

  componentWillUnmount() {
    this.props.staticsEnabler.deregister('open');
    this.props.staticsEnabler.deregister('close');
  }

  openToast = ({Component, componentProps, onPress}) => {
    this.setState({
      visibility: true,
      Component,
      componentProps,
      onPress,
    });
  };

  closeToast = () => {
    this.setState({visibility: false});
  };

  render() {
    const {Component, componentProps, visibility} = this.state;
    if (!visibility) return null;

    return (
      <TouchableOpacity
        key="wrap"
        onPress={this.state.onPress}
        style={styles.wrapStyles}>
        <Component {...componentProps} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapStyles: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: 10,
    paddingTop: 30,
  },
});

export default withStatics(Toast);
