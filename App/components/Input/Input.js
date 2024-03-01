import React from 'react';
import {StyleSheet, ActivityIndicator, View, TextInput} from 'react-native';
import {Fonts, Colors} from '../../../assets/global';
import {AppText} from '../Texts';

const CommonInput = ({
  name,
  value,
  keyboardType,
  placeholder,
  handleChange,
  autoFocus = false,
  onBlur,
  selectionColor,
  label,
  activePlaceHolderBorder,
  secure = false,
  errors,
  labelStyle,
  isPlaceHolderError,
  isRequired = false,
  disabled,
  loading,
  addressPincodeScreen,
  maxLength,
}) => {
  const errMsg = errors && errors[name];
  let isRequiredText = isPlaceHolderError ? placeholder : label;
  let isCurrentTextInput = activePlaceHolderBorder === value;
  return (
    <View style={styles.container}>
      <AppText
        style={[
          styles.label,
          labelStyle,
          errMsg && !errMsg.isError && styles.labelSuccess,
          addressPincodeScreen && styles.labelSuccess,
        ]}>
        {label}
      </AppText>
      <TextInput
        style={[
          styles.inputStyle,
          disabled ? {color: '#989A9F'} : {},
          isCurrentTextInput ? {borderColor: Colors.blue} : {},
        ]}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#B9BBBF"
        secureTextEntry={secure}
        onChangeText={text => handleChange(text, name)}
        editable={!disabled}
        onBlur={onBlur}
        maxLength={maxLength}
      />
      {loading && (
        <ActivityIndicator
          color="black"
          style={styles.activityIndicator}
          size="small"
        />
      )}
      {errMsg && errMsg.isError && !isRequired && (
        <AppText style={styles.errorText}>{errMsg.message}</AppText>
      )}
      {isRequired && (
        <AppText style={styles.errorText}>{isRequiredText} is Required</AppText>
      )}
      {errMsg && !errMsg.isError && (
        <AppText style={styles.successText}>{errMsg.message}</AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  title: {
    fontSize: 18,
    color: '#434343',
    marginBottom: 5,
    fontFamily: Fonts.roboto,
  },
  inputStyle: {
    borderColor: '#e3e3e3',
    borderBottomWidth: 1,
    height: 50,
    paddingTop: 8,
    paddingRight: 50,
  },
  label: {
    color: '#989A9F',
    paddingRight: 12,
  },
  labelSuccess: {
    color: '#00a9a6',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#DFE4E8',
    height: 50,
  },
  iconStyle: {width: 25, height: 25, marginHorizontal: 10},
  errorText: {
    color: 'red',
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: Fonts.roboto,
    // textTransform: 'capitalize',
  },
  successText: {
    color: '#00a9a6',
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: Fonts.roboto,
  },
  activityIndicator: {
    position: 'absolute',
    right: 10,
    top: '30%',
  },
});

export default CommonInput;
