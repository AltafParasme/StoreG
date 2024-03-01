import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import styles, {Constants} from '../../styles';
import {AppText} from '../Texts';

const buttonStyles = StyleSheet.create({
  primary: {
    ...styles.centerContent,
    borderRadius: 8,
    height: 48,
  },
  primaryEnabled: {
    ...styles.bgBlue,
  },
  primaryDisabled: {
    backgroundColor: '#c6c6c9',
  },
  submit: {
    ...styles.stdSideMargin,
  },
  secondary: {
    ...styles.centerContent,
  },
  tertiary: {
    ...styles.centerContent,
    borderRadius: 4,
    height: 48,
    backgroundColor: '#eaeffa',
    ...styles.stdSideMargin,
  },
});

const PrimaryButton = ({
  onPress,
  title,
  style = {},
  textStyle = {},
  loading,
  disabled,
}) => (
  <TouchableOpacity
    style={[
      buttonStyles.primary,
      disabled ? buttonStyles.primaryDisabled : buttonStyles.primaryEnabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled}>
    {loading ? (
      <ActivityIndicator size="small" color={Constants.white} />
    ) : (
      <Text medium white size="XXL" style={textStyle}>
        {title}
      </Text>
    )}
  </TouchableOpacity>
);

const SubmitButton = ({onPress, title, loading, disabled, style = {}}) => (
  <PrimaryButton
    onPress={onPress}
    title={title}
    style={[style, buttonStyles.submit]}
    loading={loading}
    disabled={disabled}
  />
);

const SecondaryButton = ({
  onPress,
  title,
  style = {},
  textStyle = {},
  loading,
  disabled,
}) => (
  <TouchableOpacity style={[buttonStyles.secondary, style]} onPress={onPress}>
    {
      <Text blue medium size="XXL" style={textStyle}>
        {title}
      </Text>
    }
  </TouchableOpacity>
);

const TertiaryButton = ({
  onPress,
  title,
  style = {},
  textStyle = {},
  loading,
  disabled,
}) => (
  <TouchableOpacity style={[buttonStyles.tertiary, style]} onPress={onPress}>
    {
      <Text blue medium size="XXL" style={textStyle}>
        {title}
      </Text>
    }
  </TouchableOpacity>
);

export {SubmitButton, PrimaryButton, SecondaryButton, TertiaryButton};
