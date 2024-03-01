import {
  StyleSheet,
  Text,
  Slider,
  View,
  ViewPropTypes,
  Dimensions,
  TouchableOpacity,
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
import {Colors, Fonts} from '../../../../../assets/global';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Tag from '../../../../components/Tag/Tag';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import {AppConstants} from '../../../../Constants';
import {removeData, setData, getData} from '../../utils';

const now = new Date();
const urgencySeconds = 3600;
export class Sticker extends Component {
  constructor() {
    super();
    this.state = {
      until: 0,
      dateStored: {
        date: '0',
        hour: '0',
        minutes: '0',
      },
      componentVisible: false,
      cutOffTime: new Date(),
    };
  }

  componentWillMount = () => {
    const {userRegistered} = this.props;
    getData(AppConstants.timerRemoved).then(value => {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value == 'yes'
      ) {
        this.props.OnPressCloseSticker();
      } else {
        getData(AppConstants.timerData).then(value => {
          let seconds = 0;
          if (value !== undefined && value !== null && value !== '') {
            this.setState({dateStored: JSON.parse(value)});

            let cutOffTime = new Date();
            cutOffTime.setDate(parseInt(this.state.dateStored.date));
            cutOffTime.setHours(parseInt(this.state.dateStored.hour));
            cutOffTime.setMinutes(parseInt(this.state.dateStored.minutes));
            cutOffTime.setMilliseconds(0);

            this.setState({cutOffTime: cutOffTime});

            let timeRemaining =
              moment
                .duration(moment(cutOffTime).diff(moment(new Date())))
                .valueOf() / 1000;

            seconds = timeRemaining;
          } else if (!userRegistered) {
            seconds = urgencySeconds;
            let dateData = {
              date: now.getDate() + '',
              hour: now.getHours() + '',
              minutes: now.getMinutes() + urgencySeconds / 60 + '',
            };
            setData(AppConstants.timerData, JSON.stringify(dateData));
            this.setState({dateStored: dateData});

            let cutOffTime = new Date();
            cutOffTime.setDate(now.getDate());
            cutOffTime.setHours(now.getHours());
            cutOffTime.setMinutes(now.getMinutes() + urgencySeconds / 60);
            cutOffTime.setMilliseconds(0);

            this.setState({cutOffTime: cutOffTime});
          }

          if (seconds <= 0) {
            this.props.OnPressCloseSticker();
            removeData(AppConstants.timerData);
            setData(AppConstants.timerRemoved, 'yes');
          } else {
            this.setState({until: seconds});
            setTimeout(() => {
              this.setState({componentVisible: true});
            }, 500);
          }
        });
      }
    });
  };

  getTimeLeft = () => {
    getData(AppConstants.timerRemoved).then(value => {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value == 'yes'
      ) {
        this.props.OnPressCloseSticker();
      } else {
        let timeRemaining =
          moment
            .duration(moment(this.state.cutOffTime).diff(moment(new Date())))
            .valueOf() / 1000;
        if (timeRemaining <= 0) {
          this.props.OnPressCloseSticker();
          removeData(AppConstants.timerData);
          setData(AppConstants.timerRemoved, 'yes');
        }
      }
    });
  };

  render() {
    const {t, balance, OnPressCloseSticker} = this.props;
    if (!this.state.componentVisible) return null;
    return (
      <View>
        <LinearGradient
          colors={[Colors.slightOrange, Colors.darkOrange]}
          style={styles.container}>
          <View style={styles.rewardsView}>
            <Tag
              title={''}
              strikeThru={false}
              price={parseInt(balance)}
              textColor={Colors.white}
              titleStyle={{fontWeight: 'bold', textAlign: 'center'}}
              priceStyle={{fontWeight: 'bold'}}
              size="XXL"
              t={t}
            />
          </View>

          <View style={styles.timerView}>
            <CountDown
              until={this.state.until}
              onFinish={() => {
                console.log('Timer finished....');
              }}
              onChange={time => {
                this.setState({time: this.getTimeLeft()});
              }}
              size={scaledSize(8)}
              digitStyle={styles.timerDigit}
              digitTxtStyle={styles.timerDigitTxt}
              showSeparator
              separatorStyle={{color: Colors.white}}
              timeToShow={['H', 'M', 'S']}
              timeLabels={{h: '', m: '', s: ''}}
            />
          </View>
        </LinearGradient>
        <View style={styles.crossIconContainer}>
          <View style={styles.crossContainerParent}>
            <View style={styles.crossContainerMain}>
              <TouchableOpacity onPress={() => OnPressCloseSticker()}>
                <Icons
                  name={'close'}
                  size={15}
                  color="#fff"
                  style={styles.crossContainerIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flex: 6}} />
        </View>
      </View>
    );
  }
}

let CIRCLE_RADIUS = 24;

var styles = StyleSheet.create({
  container: {
    width: scaledSize(61),
    height: scaledSize(53),
    margin: scaledSize(10),
    borderRadius: CIRCLE_RADIUS / 4,
  },
  crossIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  rewardsView: {
    flex: 7,
    borderTopLeftRadius: CIRCLE_RADIUS / 4,
    borderTopRightRadius: CIRCLE_RADIUS / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerView: {
    flex: 3,
    backgroundColor: Colors.partialBlack,
    borderBottomLeftRadius: CIRCLE_RADIUS / 4,
    borderBottomRightRadius: CIRCLE_RADIUS / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerDigit: {
    backgroundColor: 'transparent',
    height: heightPercentageToDP(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  timerDigitTxt: {
    color: Colors.white,
  },
  crossContainerMain: {
    flex: 1,
    marginRight: 5,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  crossContainerParent: {
    flex: 2,
    flexDirection: 'row',
  },
  crossContainerIcon: {
    height: scaledSize(15),
    width: scaledSize(15),
    backgroundColor: Colors.darkBlack,
    borderRadius: scaledSize(10),
  },
});
