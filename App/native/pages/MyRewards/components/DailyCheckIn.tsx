import React, {PureComponent, Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
  ImageBackground,
} from 'react-native';
import {Card, Button, Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import {withTranslation} from 'react-i18next';
import {connect, Dispatch} from 'react-redux';
import moment from 'moment';
import idx from 'idx';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {getRewards} from '../actions';
import {liveAnalytics} from '../../ShopgLive/redux/actions';
//import Button from '../../../../components/Button/Button';
import {Constants} from '../../../../styles';
import {AppText} from '../../../../components/Texts';
import {Images} from '../../../../../assets/images/index';
import {Events} from '../../../../Events';

class DailyCheckInBase extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        checkInArr: []
    }
    this.handleCheckIn = this.handleCheckIn.bind(this);
  }

  handleCheckIn = () => {
    const d = new Date();
    const dayOfTheWeek = d.getDay();
    const {data, userPref} = this.props;
    let eventProps = {
      taskId: data.id,
      actionId: dayOfTheWeek
    };
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };
    let arr = [dayOfTheWeek];
    this.setState({
        checkInArr: arr
    })

    this.props.onAnalytics(
      Events.USER_DAILY_CHECKIN_COINS.eventName(),
      eventProps,
      userPrefData
    );
    setTimeout(() => {
        this.props.onGetRewards(false, true, false, false, null, null);
    }, 100)
    
  }

  render() {
    let isCheckedIn = false;
    const {t, data} = this.props;
    const {checkInArr} = this.state;
    const actionData = idx(data, _ => _.actionData) || [];
    if(actionData.length > 0 || checkInArr.length > 0)
        isCheckedIn = true;
    return (
      <View style={{flex: 1}}>
        <View style={styles.cardStyle}>
               <View style={{ alignItems: 'center', marginTop: heightPercentageToDP(1.5)}}>
                <AppText size="M" black bold>{t(`Check-in 7 days To Win`)}<AppText secondaryColor>{t(` #MAXPOINTSPERDAY# coins`, { MAXPOINTSPERDAY : data.maxPointsPerDay })}</AppText></AppText>
              </View>
              <View style={{ flexDirection: 'row', marginTop: heightPercentageToDP(1.5) }}>
                  {[0,1,2,3,4,5,6].map((item) => {
                      let activeCoinValueImage, activeCoinValueColor;
                      if(actionData && actionData.includes(item) || checkInArr.includes(item)){
                        activeCoinValueImage = Images.coin_empty_inactive;
                        activeCoinValueColor = '#8c8c8c';
                      }
                      else {
                        activeCoinValueImage = Images.coin_empty; 
                        activeCoinValueColor = '#C17700'
                      }
                      
                      return (
                      <View style={{ marginLeft: widthPercentageToDP(1) }}>    
                        <ImageBackground source={activeCoinValueImage} style={{ width: widthPercentageToDP(11), height: widthPercentageToDP(11)}}>
                        <View style={styles.coinAmount}>
                                <AppText style={{ color: activeCoinValueColor }}>{data.pointsPerTask}</AppText>
                        </View>
                        </ImageBackground>
                        <AppText style={{color: '#292f3a', opacity: 0.5 }}>{t(`Day #NO#`, { NO : item + 1 })}</AppText>
                      </View>
                    )
                  })}
              </View>
              <View style={{ flex: 0.2, marginTop: heightPercentageToDP(1) }}>
              {isCheckedIn ?
                <View style={{ marginTop: heightPercentageToDP(1), flexDirection: 'row'}}> 
                    <AppText bold>
                    <Icon
                        name={'check'}
                        size={22}
                        color="#00a9a6"
                        />
                    </AppText>    
                    <AppText size="L" greenishBlue>{t(`Checked In`)}</AppText>
                </View> :
                <Button
                    title={t('CHECK IN')}
                    titleStyle={{ color: Constants.white }} 
                    buttonStyle={{ backgroundColor: Constants.secondaryColor}}
                    containerStyle={{height: heightPercentageToDP(6), width: widthPercentageToDP(83)}} 
                    onPress={this.handleCheckIn}
                    >
                </Button>}
              </View>
            </View>
       </View>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    flex: 1, 
    alignItems: 'center',
    backgroundColor: Constants.white,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: heightPercentageToDP(25), 
    width: widthPercentageToDP(92),
    marginHorizontal: widthPercentageToDP(4.5),
    marginVertical: heightPercentageToDP(2)
  },
  coinAmount: {
      position: 'absolute',
      top: 14,
      left: 14,
      right: 0,
      bottom: 0
  }
});

const mapStateToProps = state => ({
  rewards: state.rewards,
  userPref: state.login.userPreferences,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
    onAnalytics: (eventName, eventData, userPrefData) => {
        dispatch(liveAnalytics(eventName, eventData, userPrefData));
    },
    onGetRewards: (getCashback, getCoins, getScratchDetails ,history,page, size) => {
        dispatch(getRewards(getCashback, getCoins, getScratchDetails ,history,page, size));
    },
});

const DailyCheckIn = withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(DailyCheckInBase)
);

export default DailyCheckIn;
