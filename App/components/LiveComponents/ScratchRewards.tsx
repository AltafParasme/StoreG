import React, {Component} from 'react';
import ScratchView from 'react-native-scratch';
import {AppText} from '../Texts';
import {View, StyleSheet, ImageBackground, Image, TouchableOpacity, PanResponder, Animated, TouchableHighlight} from 'react-native';
import BackgroundSelector from './BackgroundSelector';
import HeaderComponent from './HeaderComponent';
import {withTranslation} from 'react-i18next';
import {heightPercentageToDP, widthPercentageToDP, scaledSize} from '../../utils';
import {Constants} from '../../styles';
import {liveAnalytics} from '../../../App/native/pages/ShopgLive/redux/actions';
import moment from 'moment';
import {Images} from '../../../assets/images';
import {LogFBEvent, Events} from '../../Events';
import {connect} from 'react-redux';

class ScratchRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isScratchDone: false,
    };
  }

  componentDidMount() {
    const {category,widgetId,index,listItemIndex,widgetType} = this.props;
    LogFBEvent(Events.SHOPG_LIVE_IMPRESSION,{
      category:category,
      widgetId: widgetId,
      position:listItemIndex,
      order:index,
      widgetType:widgetType
    });
  }

  onScratchDone = () => {
    const {wuserId,widgetId, handleScratchCardSwipe} = this.props;
    const {sid, uid} =this.props.userPreferences;
    handleScratchCardSwipe && handleScratchCardSwipe(true);

    let eventProps = {
      wuserId: wuserId,
      widgetId: widgetId
    };

    let userPrefData = {
      userId: uid,
      sid: sid,
    };

    this.setState({
      isScratchDone: true,
    })
    LogFBEvent(Events.SHOPG_LIVE_SCRATCH_COMPLETE, {
      sid: sid,
      userId: uid,
    }
    );

    this.props.onAnalytics(Events.SHOPG_LIVE_SCRATCH_COMPLETE.eventName(), eventProps, userPrefData);

  };

  onViewClick = () => {
    if (!this.state.isScratchDone) {
      this.props.handleScratchCardSwipe && this.props.handleScratchCardSwipe(false);
    }
  }
 


  render() {
    const {t, itemData, userComponentData } = this.props;
    let description = itemData.description;
    let title = itemData.title;
    const imageBackground = itemData.backgroundImage;
    const backgroundColor = itemData.backgroundColor;
    const rewardsValue = userComponentData.rewardAmount;
    const lastDateTime = userComponentData.expiresAt;
    const now = new Date();
    let nowTime = moment.utc(now, 'YYYY-MM-DD HH  hh:mm a');
    let nowlocal = nowTime.local().format('YYYY-MM-DD  hh:mm a');
    let lastDate = moment.unix(lastDateTime/1000).format('YYYY-MM-DD  hh:mm a');

    let diff = moment(lastDate).diff(moment(nowlocal));
    let days = moment.duration(diff).days();
    let hours = moment.duration(diff).hours();

    
    return (
      <BackgroundSelector
        backgroundImage={imageBackground}
        backgroundColor={backgroundColor}
        style={styles.dealContainer}>
        <View
          style={styles.headerStyle}>
          <Image
            source={Images.rewardsRupee}
            style={styles.imageRewards}
          />
          {title ? (
            <HeaderComponent
              t={t}
              title={title}
              isNotTimer
              parentMainStyle={styles.headerComponentParentView}
              index={this.props.index}
            />
          ) : null}
        </View>
        <View
          style={{
            flex: 1,
            width: widthPercentageToDP(98),
            marginBottom: heightPercentageToDP(4),
          }}>
          {description ? (
            <View
              style={[
                styles.descriptionView,
                {backgroundColor: backgroundColor},
              ]}>
              <AppText white bold style={{textAlign: 'center'}}>
                {t(description)}
              </AppText>
            </View>
          ) : null}
          <View
            style={{
              width: widthPercentageToDP(85),
              alignSelf: 'center',
            }}
            >
            <ImageBackground
              source={Images.afterScratch}
              style={styles.imageBackgroundStyle}
              imageStyle={{
                resizeMode: 'cover',
              }}>
              { rewardsValue ? (
              <View>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: heightPercentageToDP(2),
                }}>
                <AppText
                  size="M"
                  style={{
                    color: Constants.orange,
                    fontFamily: 'monospace',
                  }}>
                  {t('Congratulations !')}
                </AppText>
                <AppText
                  size="M"
                  bold
                  style={{fontFamily: 'PingFangSC-Semibold'}}>
                  {t(`You won ₹${rewardsValue} cashback !!`)}
                </AppText>
              </View>
              { !(days > 0 && hours > 0) ?
              <View
                style={{
                  alignItems: 'center',
                  marginTop: heightPercentageToDP(1),
                }}>
                <AppText size="XS">{t(`Hurry up, you have #DAY##DAYTEXT##HOUR##HOURTEXT#`,
                {
                  DAY: days > 0 ?  days : null,
                  DAYTEXT: days > 1 ? ' days ' : days === 1 ?  ' day ' : null,
                  HOUR: hours,
                  HOURTEXT: hours > 1 ? ' hrs' : ' hr',
                }
                
                )}</AppText>
              </View> : null}
              </View>) : (
                <View style={{
                  alignItems: 'center',
                  marginTop: heightPercentageToDP(3),
                }}>
                  <AppText size="M"> {t('Better Luck Next Time !')}</AppText>
                </View>
              )}
            </ImageBackground>

            <ScratchView
              brushSize={15}
              threshold={45}
              fadeOut={true}
              placeholderColor="#f5a571"
              //resourceName="before_scratch"
              resizeMode="cover"
              onScratchDone={this.onScratchDone}
              onStartShouldSetResponder={this.onViewClick}
            />
          </View>
        </View>
      </BackgroundSelector>
    );
  }
}

const styles = StyleSheet.create({
  dealContainer: {
    flexDirection: 'column',
    //margin: heightPercentageToDP(4),
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: heightPercentageToDP(1),
  },
  descriptionView: {
    top: heightPercentageToDP(1),
    marginHorizontal: heightPercentageToDP(3),
    padding: heightPercentageToDP(1),
    paddingHorizontal: heightPercentageToDP(2),
    borderRadius: 7,
    alignSelf: 'center',
  },
  imageBackgroundStyle: {
    width: widthPercentageToDP(84),
    height: heightPercentageToDP(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageRewards: {
    height: heightPercentageToDP(7),
    width: widthPercentageToDP(10),
    marginLeft: widthPercentageToDP(2),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  headerComponentParentView: {
    flex: 0.97,
    height: heightPercentageToDP(4.3),
    marginTop: heightPercentageToDP(1),
  }
});

const mapStateToProps = state => ({
  userPreferences: state.login.userPreferences,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ScratchRewards),
);
