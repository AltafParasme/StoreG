import {
  StyleSheet,
  Text,
  Slider,
  View,
  ViewPropTypes,
  Dimensions,
} from 'react-native';
import React, {Component} from 'react';
import Placeholder from 'rn-placeholder';
import globalStyles from '../../../../styles';
import {getFontSizeFromSizeProp, TextStyles} from '../../../../styles/text';
import {flattenToStyleSheetFormat} from '../../../../utils/misc';
import {convertTextToTitleCase} from '../../../../utils/textUtils';
import {Constants} from '../../../../styles';
import Svg, {Line} from 'react-native-svg';
import {
  scaledSize,
  AppWindow,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';

const FlattenedTextStyles = StyleSheet.create(
  flattenToStyleSheetFormat(TextStyles)
);

export class TimeLineSlider extends Component {
  constructor() {
    super();
    this.state = {
      item: 0,
      sliderOptions: [],
    };
  }

  componentDidMount() {
    if (this.props.items) {
      this.setState({sliderOptions: this.props.items});
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // do things with nextProps.someProp and prevState.cachedSomeProp
    return {
      sliderOptions: nextProps.items,
      item: nextProps.defaultItem,
      // ... other derived state properties
    };
  }

  _labelView() {
    if (!this.state.sliderOptions || this.state.sliderOptions.size == 0) return;

    var itemStyle = [this.props.itemStyle];
    let labels = this.state.sliderOptions.map((i, j) => (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text key={i.value} ref={'t' + j} style={itemStyle}>
          {this.props.t(i.label)}
        </Text>

        <Text key={i.value} ref={'t' + j} style={itemStyle}>
          {this.props.t(i.date)}
        </Text>
      </View>
    ));
    return <View style={defaultStyles.labelsView}>{labels}</View>;
  }

  _dotView() {
    if (!this.state.sliderOptions || this.state.sliderOptions.size == 0) return;

    var itemStyle = [defaultStyles.item, {marginBottom: 5}];
    let labels = [];
    this.state.sliderOptions.map((i, j) => {
      let backgroundColor = 'black';
      if (this.state.item >= j) {
        backgroundColor = Constants.greenishBlue;
      }
      let backgroundColorRight = 'black';
      if (this.state.item > j) {
        backgroundColorRight = Constants.greenishBlue;
      }

      labels.push(
        <View style={itemStyle}>
          {j != 0 ? (
            <Svg height="3" width="100%" style={defaultStyles.leftLine}>
              <Line
                x1="0%"
                y1="0"
                x2="50%"
                y2="0"
                stroke={backgroundColor}
                strokeWidth="3"
              />
            </Svg>
          ) : (
            <Svg height="3" width="100%" style={defaultStyles.leftLine}>
              <Line
                x1="0"
                y1="0"
                x2="50%"
                y2="0"
                stroke="transparent"
                strokeWidth="3"
              />
            </Svg>
          )}

          <View
            style={[
              defaultStyles.middleDot,
              {backgroundColor: backgroundColor},
            ]}
          />

          {j != this.props.items.length - 1 ? (
            <Svg height="3" width="100%" style={defaultStyles.rightLine}>
              <Line
                x1="0"
                y1="0"
                x2="50%"
                y2="0"
                stroke={backgroundColorRight}
                strokeWidth="3"
              />
            </Svg>
          ) : (
            <Svg height="3" width="100%" style={defaultStyles.rightLine}>
              <Line
                x1="0"
                y1="0"
                x2="50%"
                y2="0"
                stroke="transparent"
                strokeWidth="3"
              />
            </Svg>
          )}
        </View>
      );
    });

    return (
      <View style={[defaultStyles.itemWrapper, this.props.itemWrapperStyle]}>
        {labels}
      </View>
    );
  }

  render() {
    return (
      <View
        onLayout={this._getSliderWidth}
        style={[defaultStyles.container, this.props.containerStyle]}>
        {this.props.labelPosition == 'top' ? this._labelView() : null}

        <View style={{justifyContent: 'center'}}>{this._dotView()}</View>

        {this.props.labelPosition === undefined ||
        this.props.labelPosition == 'bottom'
          ? this._labelView()
          : null}
      </View>
    );
  }
}

var defaultStyles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  itemWrapper: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  item: {
    marginTop: heightPercentageToDP(1),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  labelsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftLine: {zIndex: 1, position: 'absolute', left: 0},
  middleDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    borderColor: 'transparent',
    zIndex: 2,
    position: 'absolute',
    left: '50%',
  },
  rightLine: {zIndex: 1, position: 'absolute', left: '50%'},
});
