import {StyleSheet, Text} from 'react-native';
import React, {Component} from 'react';
import Placeholder from 'rn-placeholder';
import globalStyles from '../../styles';
import {getFontSizeFromSizeProp, TextStyles} from '../../styles/text';
import {flattenToStyleSheetFormat} from '../../utils/misc';
import {convertTextToTitleCase} from '../../utils/textUtils';

const FlattenedTextStyles = StyleSheet.create(
  flattenToStyleSheetFormat(TextStyles)
);

export class AppText extends Component {
  static defaultProps = {
    textProps: {},
  };

  getStyles = () => {
    const {props} = this;
    const styles = [];
    const otherStyles = this.props.style;
    if (otherStyles) {
      styles.push(otherStyles);
    }
    if (props.bold) {
      styles.push(FlattenedTextStyles['fontFamily-bold']);
      styles.push({fontWeight: 'bold'});
    } else if (props.medium) {
      styles.push(FlattenedTextStyles['fontFamily-medium']);
    } else {
      styles.push(FlattenedTextStyles['fontFamily-regular']);
    }
    if (props.size) {
      styles.push(FlattenedTextStyles[`fontSize-${props.size}`]);
    }
    if (props.black) {
      styles.push(globalStyles.black);
    }
    if (props.dark) {
      styles.push(globalStyles.darkGrey);
    }
    if (props.grey) {
      styles.push(globalStyles.grey);
    }
    if (props.light) {
      styles.push(globalStyles.lightGrey);
    }
    if (props.veryLightGrey) {
      styles.push(globalStyles.veryLightGrey);
    }
    if (props.white) {
      styles.push(globalStyles.white);
    }
    if (props.secondaryColor) {
      styles.push(globalStyles.secondaryColor);
    }
    if (props.blue) {
      styles.push(globalStyles.blue);
    }
    if (props.greenishBlue) {
      styles.push(globalStyles.greenishBlue);
    }
    if (props.green) {
      styles.push(globalStyles.green);
    }
    if (props.red) {
      styles.push(globalStyles.red);
    }
    if (props.pink) {
      styles.push(globalStyles.pink);
    }
    if (props.error) {
      styles.push(globalStyles.errorRed);
    }
    if (props.warning) {
      styles.push(globalStyles.warningYellow);
    }
    if (props.break) {
      styles.push({
        flexWrap: 'wrap',
      });
    }
    if (props.verticalPadder) {
      styles.push({
        marginTop: 2,
        marginBottom: 2,
      });
    }
    return styles;
  };

  renderText = () => {
    let {children} = this.props;
    if (this.props.titleCase) {
      children = convertTextToTitleCase(children);
    }
    return (
      <Text style={this.getStyles()} {...this.props.textProps}>
        {children}
      </Text>
    );
  };

  render() {
    if (this.props.loading) {
      return (
        <Placeholder.Line
          width={this.props.loaderWidth || '100%'} // wrap your text component in a view which controls the length
          textSize={getFontSizeFromSizeProp(this.props.size)}
          onReady={!this.props.loading}>
          {this.renderText()}
        </Placeholder.Line>
      );
    }
    return this.renderText();
  }
}
