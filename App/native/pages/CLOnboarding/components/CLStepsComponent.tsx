import React, {PureComponent} from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {Images} from '../../../../../assets/images';
import {AppText} from '../../../../components/Texts';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CarouselBanner from '../../../../components/CarouselBanner/CarouselBanner';
import {withTranslation} from 'react-i18next';
import Accordian from '../../../../components/Accordion/Accordion.js';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  scaledSize,
} from '../../../../utils';

class CLStepsComponent extends PureComponent {
  render() {
    const {
      training,
      index,
      rewards,
      t,
      groupSummary,
      language,
      userPref,
    } = this.props;
    if (!training) return null;
    return (
      <View
        style={{
          margin: heightPercentageToDP(1),
          borderBottomWidth: 1,
          borderColor: '#d6d7da',
        }}>
        {training ? (
          <View style={{justifyContent: 'space-between'}}>
            {training.bannerJson ? (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <CarouselBanner
                  categories={training}
                  language={this.props.language}
                  dispatch={this.props.dispatch}
                  eventName={'CL_BANNER_TRAINING'}
                  valId={training.step}
                  screen={this.props.screen}
                  carouselImageStyle={{borderRadius: 4.5}}
                  innerTextStyle={styles.clStepsText}
                  videoIconImage={styles.iconCLImage}
                  markDownTextEnabled
                  mainViewStyle={{height: heightPercentageToDP(20)}}
                />
              </View>
            ) : null}
            <Accordian
              index={index}
              t={t}
              type={'dataMap'}
              isCLSteps
              data={training.substeps}
              title={training.title}
            />
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#7e3a77', '#ec3d5a']}
              style={[
                styles.circleUserView,
                training.bannerJson
                  ? {top: heightPercentageToDP(22)}
                  : {bottom: heightPercentageToDP(3)},
              ]}>
              <AppText
                bold
                white
                size="S"
                style={{
                  paddingLeft: widthPercentageToDP(3),
                  paddingTop: heightPercentageToDP(0.5),
                }}>
                {index}
              </AppText>
            </LinearGradient>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circleUserView: {
    width: scaledSize(30),
    height: scaledSize(30),
    borderRadius: 28 / 2,
    position: 'absolute',
    marginLeft: widthPercentageToDP(2),
  },
  whatsappIconView: {
    paddingLeft: widthPercentageToDP(16),
    paddingTop: heightPercentageToDP(1),
    flex: 0.15,
  },
  shopGLogoView: {
    width: widthPercentageToDP(30),
    height: heightPercentageToDP(3.5),
    position: 'absolute',
    top: heightPercentageToDP(2),
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.8,
    position: 'absolute',
    bottom: heightPercentageToDP(1),
    width: widthPercentageToDP(100),
    paddingHorizontal: widthPercentageToDP(3.4),
  },
  whatsappCircleGroupDeal: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
    elevation: 6,
  },
  iconCLImage: {
    width: widthPercentageToDP(18),
    height: heightPercentageToDP(6),
    top: heightPercentageToDP(5),
    resizeMode: 'contain',
  },
  clStepsText: {
    zIndex: 1,
    position: 'absolute',
    top: heightPercentageToDP(3),
    left: widthPercentageToDP(6),
    marginRight: widthPercentageToDP(18),
  },
});

const mapStateToProps = state => ({
  language: state.home.language,
  rewards: state.rewards.rewards,
  groupSummary: state.groupSummary,
  userPref: state.login.userPreferences,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CLStepsComponent),
);
