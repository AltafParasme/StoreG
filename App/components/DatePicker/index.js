import DatePicker from 'react-native-datepicker';
import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import IconGroup from 'react-native-vector-icons/MaterialIcons';

const MyDatePicker = ({
  showTimeIcon,
  showIcon,
  customStyles = {},
  ...restProps
}) =>
  showTimeIcon ? (
    <DatePicker
      customStyles={{
        ...customStyles,
        ...{
          dateIcon: {
            position: 'absolute',
            right: 0,
            top: 5,
          },
        },
      }}
      iconComponent={
        <View style={{position: 'absolute', right: 20}}>
          <IconGroup name="access-time" size={20} />
        </View>
      }
      showIcon
      {...restProps}
    />
  ) : (
    <DatePicker customStyles={customStyles} {...restProps} />
  );

export default MyDatePicker;
