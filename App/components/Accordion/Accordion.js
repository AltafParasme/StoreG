import React, {PureComponent} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {heightPercentageToDP, widthPercentageToDP} from '../../utils';
import Markdown from 'react-native-simple-markdown';
import {Images} from '../../../assets/images';
import {Constants} from '../../styles';
import CLBonusDetails from '../../native/pages/CLOnboarding/components/CLBonusDetails';
import {LogFBEvent, Events} from '../../Events';
import {withTranslation} from 'react-i18next';
import {AppText} from '../Texts';

class Accordian extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      expanded: false,
      indexT: true,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  renderChildView = () => {
    const {index, type, t} = this.props;
    switch (type) {
      case 'dataMap':
        return (
          <View style={styles.child}>
            {Array.isArray(this.props.data) ? (
              this.props.data.map((value, index) => {
                return (
                  <View style={{justifyContent: 'center'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: heightPercentageToDP(1),
                      }}>
                      <View style={styles.circle} />
                      <Markdown style={styles.childT}>{t(value.text)}</Markdown>
                    </View>
                    {value.mediaLink ? (
                      <Image
                        source={{uri: value.mediaLink}}
                        style={styles.iconImage}
                      />
                    ) : null}
                  </View>
                );
              })
            ) : (
              <Markdown>{this.props.data}</Markdown>
            )}
          </View>
        );

      case 'childComponent':
        return <View>{this.props.childComponent}</View>;
    }
  };

  render() {
    const {isCLSteps, isCLTask, index, t} = this.props;
    return (
      <View
        style={
          this.state.expanded || (index === 1 && this.state.indexT)
            ? {marginBottom: heightPercentageToDP(2)}
            : {}
        }>
        <TouchableOpacity
          ref={this.accordian}
          style={[
            styles.row,
            isCLSteps
              ? {
                  marginLeft: heightPercentageToDP(4),
                }
              : {},
          ]}
          onPress={this.toggleExpand}>
          <Text
            style={[
              styles.title,
              styles.font,
              this.props.titleStyle,
              isCLTask ? {color: Constants.primaryColor, fontSize: 12} : {},
            ]}>
            {t(this.props.title)}
          </Text>
          {this.props.data || this.props.showArrow ? (
            <Icon
              name={
                this.state.expanded || (index === 1 && this.state.indexT)
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              size={isCLTask ? 24 : 20}
              color={this.props.iconColor}
              style={isCLSteps ? {paddingLeft: widthPercentageToDP(1)} : {}}
            />
          ) : null}
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {(this.state.expanded || (index === 1 && this.state.indexT)) &&
          this.renderChildView()}
      </View>
    );
  }

  toggleExpand = () => {
    let {isCLSteps, index} = this.props;
    if (this.props.data) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (index === 1) {
        this.setState({
          indexT: false,
        });
      }
      this.setState({expanded: !this.state.expanded});
      if (isCLSteps && !this.state.expanded) {
        LogFBEvent(Events.CL_TRAINING_SUBSTEPS_CLICK, null);
      }
    } else if (this.props.childComponent) {
      this.setState({expanded: !this.state.expanded});
    }
  };
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  iconImage: {
    width: widthPercentageToDP(88),
    height: heightPercentageToDP(20),
    resizeMode: 'contain',
    borderRadius: 8,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    marginTop: heightPercentageToDP(1),
    backgroundColor: Constants.black,
    marginRight: widthPercentageToDP(2),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 20,
    paddingRight: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  parentHr: {
    height: 1,
    color: '#ffffff',
    width: '100%',
  },
  child: {
    backgroundColor: '#fff',
    paddingHorizontal: widthPercentageToDP(4),
    padding: 2,
  },
  childT: {
    color: '#242323',
    paddingHorizontal: widthPercentageToDP(3),
  },
});

export default withTranslation()(Accordian);
