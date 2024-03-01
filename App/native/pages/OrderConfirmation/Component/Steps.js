import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import StepTag from './StepTag';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
  },
});

const Steps = ({selected, data, targetReached}) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <StepTag
            key={index}
            index={index}
            targetReached={targetReached}
            active={selected}
            text={item}
          />
        );
      })}
    </View>
  );
};

export default Steps;
