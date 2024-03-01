import React, {Component} from 'react';
import {StyleSheet, View, PanResponder, Animated} from 'react-native';

export default class Draggable extends Component {
  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
    };
  }

  componentWillMount() {
    // Add a listener for the delta value change
    this._val = {x: 0, y: 0};
    this.state.pan.addListener(value => (this._val = value)); // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      // onStartShouldSetPanResponder: (e, gesture) => true,
      // onPanResponderMove: Animated.event([
      //   null, { dx: this.state.pan.x, dy: this.state.pan.y }
      // ])
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.state.pan.setOffset(this.state.pan.__getValue());
        this.state.pan.setValue({x: 0, y: 0});
        Animated.spring(this.state.scale, {toValue: 1.1, friction: 3}).start();
      },
      onPanResponderMove: Animated.event([
        null,
        {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),
      onPanResponderRelease: (e, {vx, vy}) => {
        // Flatten the offset to avoid erratic behavior
        this.state.pan.flattenOffset();
        Animated.spring(this.state.scale, {toValue: 1, friction: 3}).start();
      },
    });

    // adjusting delta value
    // this.state.pan.setValue({ x:0, y:0})
  }

  render() {
    // Destructure the value of pan from the state
    let {pan, scale} = this.state;

    // Calculate the x and y transform from the pan value
    let [translateX, translateY] = [pan.x, pan.y];

    // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
    let imageStyle = {transform: [{translateX}, {translateY}, {scale}]};

    // const panStyle = {
    //   transform: this.state.pan.getTranslateTransform()
    // }
    return (
      <Animated.View {...this.panResponder.panHandlers} style={imageStyle}>
        {this.props.children}
      </Animated.View>
    );
  }
}
