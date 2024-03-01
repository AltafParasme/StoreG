import {
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';
import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Constants} from '../../styles';

const styles = StyleSheet.create({
  inputCommon: {
    fontSize: 16,
    borderBottomWidth: Platform.OS === 'ios' ? 0 : 2,
  },
  inputNoError: {
    borderBottomColor: Constants.borderGrey,
  },
  inputError: {
    borderBottomColor: Constants.errorRed,
  },
  inputWrapper: {
    width: '100%',
  },
  inputContainer: {
    marginLeft: 0,
    marginRight: 0,
  },
  label: {
    marginLeft: 0,
  },
  errorLabel: {
    marginLeft: 0,
  },
  errorContainer: {},
});

const emptyObj = {};

const Input = ({
  label,
  labelProps = emptyObj,
  errorProps = emptyObj,
  errorMessage,
  inputWrapperStyle = emptyObj,
  inputStyle = emptyObj,
  labelStyle = emptyObj,
  errorContainerStyle = emptyObj,
  errorLabelStyle = emptyObj,
  inputContainerStyle = emptyObj,
  ...otherProps
}) => (
  <View style={[styles.inputWrapper, inputWrapperStyle]}>
    {label ? (
      <FormLabel {...labelProps} labelStyle={[styles.label, labelStyle]}>
        {label}
      </FormLabel>
    ) : null}
    <FormInput
      {...otherProps}
      containerStyle={[styles.inputContainer, inputContainerStyle]}
      inputStyle={[
        styles.inputCommon,
        !errorMessage ? styles.inputNoError : styles.inputError,
        inputStyle,
      ]}
    />
    <FormValidationMessage
      {...errorProps}
      containerStyle={[styles.errorContainer, errorContainerStyle]}
      labelStyle={[styles.errorLabel, errorLabelStyle]}>
      {errorMessage || ''}
    </FormValidationMessage>
  </View>
);

export {Input};
