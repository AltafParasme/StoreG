import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {AppText} from '../Texts';

const Button = ({
  children,
  style,
  disabled,
  activeOpacity,
  styleContainer,
  onPress,
  onLongPress,
  label,
  isLoading,
  ...props
}) => {
  if (isLoading) {
    return (
      <View style={[styles.container, styleContainer]}>
        <ActivityIndicator color="white" size="small" />
      </View>
    );
  }
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={activeOpacity}
      hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
      style={[styles.container, styleContainer]}
      onPress={onPress}
      {...props}>
      {label.length > 0 && (
        <AppText style={[styles.textColor, style]}>{label}</AppText>
      )}
      {children}
    </TouchableOpacity>
  );
};

Button.propTypes = {
  style: PropTypes.objectOf(PropTypes.any),
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  label: PropTypes.string,
};
Button.defaultProps = {
  style: {},
  onPress: () => {},
  onLongPress: () => {},
  label: '',
};

const styles = StyleSheet.create({
  textColor: {
    color: '#fff',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Button;
