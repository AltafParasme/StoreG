import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Icon} from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import {LogFBEvent, Events} from '../../../../Events';
import {AppText} from '../../../../components/Texts';
import {Images} from '../../../../../assets/images';
import {Constants} from '../../../../styles';
import NavigationService from '../../../../utils/NavigationService';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';
import {getTimeRemainingInDay} from '../../utils';

class CLTaskStrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doneTaskLength: 0,
    };
  }
  onPress = () => {
    NavigationService.navigate('MyOrderBusinessCheckout', {
      actionId: 3,
    });
    LogFBEvent(Events.CL_TASKS_STRIP_CLICK, null);
  };

  componentDidMount() {
    const {t, TaskData} = this.props;
    const doneTask = (TaskData && TaskData.filter(tasks => tasks.isDone)) || [];
    this.setState({
      doneTaskLength: doneTask.length,
    });
  }

  render() {
    const {t, TaskData} = this.props;
    if (TaskData && TaskData.length) {
      const pendingTasksLength = TaskData.length - this.state.doneTaskLength;
      return (
        <TouchableOpacity onPress={this.onPress}>
          <View style={styles.container}>
            <View style={{flex: 0.1}}>
              <Image source={Images.coin} style={styles.imageStyle} />
            </View>
            <View
              style={{
                flexDirection: 'column',
                flex: 0.8,
                marginLeft: widthPercentageToDP(1),
              }}>
              <AppText bold black style={{elevation: 5}} size="XS">
                {t(`Complete 100% Tasks & Earn 2% Extra Bonus*`)}
              </AppText>
              <View style={{flexDirection: 'row'}}>
                <AppText bold secondaryColor size="XS">
                  {t(`#PENDINGTASKSLENGTH# Tasks Pending `, {
                    PENDINGTASKSLENGTH: pendingTasksLength,
                  })}
                </AppText>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: scaledSize(-8),
                    position: 'relative',
                  }}>
                  <CountDown
                    until={getTimeRemainingInDay()}
                    onFinish={() => {
                      console.log('Timer finished....');
                    }}
                    size={scaledSize(12)}
                    digitStyle={styles.timerDigit}
                    digitTxtStyle={styles.timerDigitTxt}
                    showSeparator
                    separatorStyle={{color: '#ec3d5a'}}
                    timeToShow={['H', 'M', 'S']}
                    timeLabels={{h: '', m: '', s: ''}}
                  />
                </View>
                <AppText style={{color: '#ec3d5a'}} bold size="XS">
                  {t(`Time Left`)}
                </AppText>
              </View>
            </View>
            <View
              style={{
                flex: 0.1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <Icon
                type="feather"
                name="chevron-right"
                color={Constants.black}
                size={widthPercentageToDP(6)}
                containerStyle={{
                  alignSelf: 'center',
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    height: scaledSize(60),
    width: widthPercentageToDP(96),
    backgroundColor: Constants.white,
    paddingLeft: scaledSize(5),
    borderColor: '#d6d6d6',
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  imageStyle: {
    height: scaledSize(32),
    width: scaledSize(32),
    marginRight: widthPercentageToDP(2),
  },
  timerDigit: {
    backgroundColor: Constants.white,
  },
  timerDigitTxt: {
    color: '#ec3d5a',
  },
});

export default withTranslation()(CLTaskStrip);
