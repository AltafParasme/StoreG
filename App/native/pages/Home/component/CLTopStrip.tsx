import * as React from 'react';
import { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground
  } from 'react-native';
  import CountDown from 'react-native-countdown-component';
  import LinearGradient from 'react-native-linear-gradient';
  import moment from 'moment';
import {Images} from '../../../../../assets/images';
import {AppText} from '../../../../components/Texts';
import {withTranslation} from 'react-i18next';
import { heightPercentageToDP, widthPercentageToDP, scaledSize } from '../../../../utils';
import {getTimeRemainingInDay} from '../../utils';
import {LogFBEvent, Events} from '../../../../Events';
import { Constants } from '../../../../styles';
import NavigationService from '../../../../utils/NavigationService';


class CLTopStrip extends Component {
    constructor(props) {
        super(props);
        this.state = {
          doneTaskLength: 0,
        };
      }

      onPressStrip = () => {
        NavigationService.navigate('MyOrderBusinessCheckout', {
          actionId: 3,
        });
        LogFBEvent(Events.CL_TOP_STRIP_CLICK, null);
      }

      componentDidMount() {
        const {t, TaskData} = this.props;
        const doneTask = (TaskData && TaskData.filter(tasks => tasks.isDone)) || [];
        this.setState({
          doneTaskLength: doneTask.length,
        });
      }

    render() { 
        const {t, TaskData,onCardPress,lenDoneTasks} = this.props;
        if (TaskData && TaskData.length) {
        let pendingTasksLength = TaskData && TaskData.length - this.state.doneTaskLength;
        let month = moment(new Date()).format("MMM")
        return ( 
          <TouchableOpacity
          onPress={onCardPress ? onCardPress : this.onPressStrip}
          >
           <ImageBackground
           source={Images.topStrip}
           style={styles.topImage}
           >
            <View style={styles.firstContent}
            >
            <Image source={Images.rewardsIcon} style={styles.imagesStyle}/>
            <AppText size='M' bold style={{color: '#feda02', paddingTop: heightPercentageToDP(0.55)}}>{t('GET A GIFT! GUARANTEED!')}</AppText>
            <Image source={Images.rewardsIcon} style={styles.imagesStyle}/>
            </View>
                <View style={{
                     flexDirection: 'row',
                     marginBottom: heightPercentageToDP(2)
                }}>
                <View style={{
                     flexDirection: 'row',
                     marginLeft: widthPercentageToDP(3.5),
                     marginHorizontal: widthPercentageToDP(2)}}>
                    <View style={styles.rightSubView}>
                        <AppText size='XXS' style={styles.contentTextLeftStyle}>{t('Complete Your Daily Task for a month')}</AppText>
                    </View>
                    <Image source={{uri: `http://cdn.shopg.in/cl-banner/LeaderBoard/${month}/icon-1.jpg`}} 
                    style={styles.iconFirst}
                    />
                </View>

                <LinearGradient colors={['#80003e', '#ffffff', '#80003e']}  style={styles.dividerStyle}/>
                <View style={{
                     flexDirection: 'row',
                     marginHorizontal: widthPercentageToDP(2)}}>
                   
                    <Image source={{uri: `http://cdn.shopg.in/cl-banner/LeaderBoard/${month}/icon-2.jpg`}} 
                    style={styles.iconSecondStyle}
                    />
                     <View style={styles.rightSubView}>
                        <AppText size='XXS'style={styles.contentTextStyle}>{t('Only 1 Lucky Winner')}</AppText>
                    </View>
                </View>

                </View>
                <View style={styles.middleView}>
                <View style={{marginHorizontal: widthPercentageToDP(2), 
                    paddingTop: heightPercentageToDP(1.2)
                }}>
                <AppText bold size="L" style={{textAlign: 'center', color: '#ec3d5a'}}>
                  {t(`#PENDINGTASKSLENGTH# / #TOTALTASKS#`, {
                    PENDINGTASKSLENGTH: lenDoneTasks ? (TaskData.length - lenDoneTasks) : pendingTasksLength,
                    TOTALTASKS: TaskData && TaskData.length || 8
                  })}
                </AppText>
                <AppText size="XXS" bold style={{textAlign: 'center'}}>{t('Today’s pending tasks')}</AppText>
                </View>
                <View style={{
                      marginHorizontal: widthPercentageToDP(2),
                      paddingTop: heightPercentageToDP(1.45)}}>
                  <CountDown
                    until={getTimeRemainingInDay()}
                    onFinish={() => {
                      console.log('Timer finished....');
                    }}
                    size={scaledSize(15)}
                    digitStyle={styles.timerDigit}
                    digitTxtStyle={styles.timerDigitTxt}
                    showSeparator
                    separatorStyle={{color: '#ec3d5a', fontSize: 14}}
                    timeToShow={['H', 'M', 'S']}
                    timeLabels={{h: '', m: '', s: ''}}
                  />
                   <AppText size="XXS" bold style={{textAlign: 'center', paddingTop: heightPercentageToDP(0.35)}}>{t('Time left for today’s tasks')}</AppText>
                </View>
                </View>
                <AppText size='XXS' white style={styles.lastTextStyle}>{t('Gift will be given at the end of the month')}</AppText>
           </ImageBackground>
           </TouchableOpacity>
         );
                } 
        return null;
    }
}
 
const styles = StyleSheet.create({
    topImage: {
        height: heightPercentageToDP(28),
        width: widthPercentageToDP(95),
        marginBottom: heightPercentageToDP(2),
        alignSelf: 'center'
    },
    imagesStyle: {
        height: heightPercentageToDP(5.4),
        width: widthPercentageToDP(11)
    },
    firstContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: heightPercentageToDP(2),
        marginHorizontal: widthPercentageToDP(2)
    },
    rightSubView: {
        height: heightPercentageToDP(4.3),
        width: widthPercentageToDP(19),
        marginLeft: widthPercentageToDP(2),
    },
    middleView: {
        flexDirection: 'row', 
        marginHorizontal: widthPercentageToDP(8),
        justifyContent: 'space-between'
    },
    timerDigit: {
        backgroundColor: Constants.white,
        height: heightPercentageToDP(2.8),
      },
      timerDigitTxt: {
        color: '#ec3d5a',
      },
      contentTextStyle: {
        lineHeight: 16,
        paddingTop: heightPercentageToDP(1.4),
        color: '#feda02', 
        textAlign: 'right'
      },
      contentTextLeftStyle: {
        lineHeight: 16,
        paddingTop: heightPercentageToDP(1.4),
        color: '#feda02', 
        textAlign: 'left'
      },
      iconSecondStyle: {
        height: heightPercentageToDP(6.4),
        width: widthPercentageToDP(13),
        borderRadius: 26,
      },
    dividerStyle: {
        height: heightPercentageToDP(6.4),
        width: widthPercentageToDP(0.16),
        marginLeft: widthPercentageToDP(4),
        marginRight: widthPercentageToDP(5.5)
    },
    lastTextStyle: {
        lineHeight: 12, 
        textAlign: 'center', 
        paddingTop: heightPercentageToDP(2)
    },
    iconFirst: {
        height: heightPercentageToDP(6.4),
        width: widthPercentageToDP(13),
        borderRadius: 26,
        marginLeft: widthPercentageToDP(4)
    }
})


export default withTranslation()(CLTopStrip);