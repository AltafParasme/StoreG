import React, {Component} from 'react';
import {
  Image,
  Easing,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';
import {connect} from 'react-redux';
import IconGroup from 'react-native-vector-icons/EvilIcons';
import SvgParser from '@target-corp/react-native-svg-parser';
import withStatics from '../../utils/withStatics';
import globalStyles, {Constants} from '../../styles';
import {AppText} from '../Texts';
import {userDetailsSelector} from '../../store/commonSelectors';
import {logout} from '../../utils/misc';
import svg from '../../../assets/jsStringSvgs/logout-icon.js';

const svgNode = SvgParser(svg, '');

const AnimationConfig = {
  duration: 200,
  easing: Easing.ease,
};

const HamburgerMenuWidth = 240;

class HamburgerMenu extends Component {
  constructor() {
    super();
    this.overlayOpacity = new Animated.Value(0);
    this.menuTranslate = new Animated.Value(0);
    this.menuTranslateAnimation = this.menuTranslate.interpolate({
      inputRange: [0, 1],
      outputRange: [-1 * HamburgerMenuWidth, 0],
    });
    this.overlayOpacityAnimation = this.overlayOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    });
    this.state = {visibility: false};
  }

  componentDidMount() {
    this.props.staticsEnabler.register('open', this.openHamburgerMenu);
  }

  componentWillUnmount() {
    this.props.staticsEnabler.deregister('open');
  }

  openHamburgerMenu = () => {
    Animated.timing(this.menuTranslate, {
      toValue: 1,
      ...AnimationConfig,
    }).start();
    this.setState(
      {visibility: true},
      Animated.timing(this.overlayOpacity, {
        toValue: 1,
        ...AnimationConfig,
      }).start()
    );
  };

  closeHamburgerMenu = () => {
    Animated.timing(this.menuTranslate, {
      toValue: 0,
      ...AnimationConfig,
    }).start();
    Animated.timing(this.overlayOpacity, {
      toValue: 0,
      ...AnimationConfig,
    }).start(() => this.setState({visibility: false}));
  };

  render() {
    return (
      <>
        {this.state.visibility ? (
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.wholeScreen, styles.overlayWrap]}
            onPress={this.closeHamburgerMenu}>
            <Animated.View
              style={[styles.overlay, {opacity: this.overlayOpacityAnimation}]}
            />
          </TouchableOpacity>
        ) : null}
        <Animated.View
          key="menu"
          style={[
            styles.wholeScreen,
            styles.menu,
            {transform: [{translateX: this.menuTranslateAnimation}]},
          ]}>
          <View>
            <View style={styles.header}>
              <AppText bold blue style={styles.playbook}>
                Playbook
              </AppText>
              <IconGroup.Button
                name="close"
                color="rgba(0,0,0,0.5)"
                size={20}
                style={styles.closeButton}
                onPress={this.closeHamburgerMenu}
              />
            </View>
            <View style={styles.user}>
              <View style={styles.avatar}>
                <AppText white bold style={styles.avatarText}>
                  {(this.props.user.firstName &&
                    this.props.user.firstName.substring(0, 1)) ||
                    'X'}
                </AppText>
              </View>
              <View style={styles.userInfo}>
                <AppText
                  size="L"
                  medium
                  dark>{`${this.props.user.firstName} ${this.props.user.lastName}`}</AppText>
                <AppText size="M" light>
                  {this.props.user.role || 'No role'}
                </AppText>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutWrap}>
            <View style={styles.logoutIcon}>{svgNode}</View>
            <AppText medium dark size="L" style={styles.logoutText}>
              Logout
            </AppText>
          </TouchableOpacity>
        </Animated.View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: 'white',
  },
  logoutText: {
    paddingLeft: Constants.stdSpacingValue,
  },
  logoutWrap: {
    ...globalStyles.row,
    paddingBottom: 15,
  },
  logoutIcon: {
    width: 30,
    height: 25,
  },
  avatarText: {
    fontSize: 32,
  },
  userInfo: {
    flex: 0,
    justifyContent: 'center',
    paddingLeft: Constants.stdSpacingValue,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'green',
    ...globalStyles.centerContent,
  },
  user: {
    marginTop: 20,
    ...globalStyles.row,
  },
  header: {
    ...globalStyles.row,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playbook: {
    fontSize: 32,
  },
  wholeScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  overlayWrap: {
    right: 0,
    left: 0,
  },
  overlay: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
  },
  menu: {
    width: HamburgerMenuWidth,
    backgroundColor: 'white',
    flex: 0,
    justifyContent: 'space-between',
    ...globalStyles.stdPadding,
  },
});

const mapStateToProps = state => ({
  loginDetails: state.login,
});

export default withStatics(connect(mapStateToProps, null)(HamburgerMenu));
