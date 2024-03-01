import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {BlurView} from 'react-native-blur';
import globalStyles from '../../styles';
import {AppText} from '../Texts';
// import svg from '../../../assets/jsStringSvgs/outlook-small.js'
// const svgNode = SvgParser(svg,'')

const IosForegroundNotification = ({message, title, subText}) => (
  <View style={styles.outer}>
    <BlurView
      style={styles.blur}
      viewRef={null}
      blurType="light"
      blurAmount={10}
    />
    <View style={styles.header}>
      <View style={styles.logo} />
      <AppText size="S" medium style={styles.appTitle}>
        Sales Playbook
      </AppText>
      <AppText>.</AppText>
      <AppText size="XS" style={styles.subText}>
        {subText}
      </AppText>
    </View>
    <AppText size="S" dark style={styles.title}>
      {title}
    </AppText>
    <AppText size="S" dark>
      {message}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 10,
    borderWidth: 0,
  },
  logo: {
    height: 16,
    width: 16,
    backgroundColor: '#e22727',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  appTitle: {
    color: '#e22727',
    marginRight: 5,
    marginLeft: 5,
  },
  subText: {
    marginLeft: 5,
  },
  title: {
    marginBottom: 2,
  },
  outer: {
    width: '100%',
    backgroundColor: 'rgba(227,230,232,0.7)',
    borderRadius: 10,
    borderWidth: 0,
    padding: 10,
    height: 80,
  },
});

export default IosForegroundNotification;
