import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {getStarterKit,getTaskData,changeField} from './actions';
import {
  View, 
  StyleSheet, 
  ScrollView,
  LayoutAnimation,
  UIManager,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Image,
  ActivityIndicator
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import RNFetchBlob from 'rn-fetch-blob';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../components/Texts';
import ShopGClTask from './components/ShopGClTask';
import {Images} from '../../../../assets/images'
import {Constants} from '../../../styles';
import TaskStrip from './components/TaskStrip';
import {
  heightPercentageToDP,
  scaledSize,
  widthPercentageToDP,
} from '../../../utils';
import {setStartDate, getRouteTab} from './components/CLUtils';
import moment from 'moment';
import { getTimeRemainingInDay } from '../utils';
import NavigationService from '../../../utils/NavigationService';
import {getWidgets} from '../Home/redux/action';
import CLTopStrip from '../Home/component/CLTopStrip';
import idx from 'idx';


class CLTasks extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedMonth: moment.utc(new Date()).format('DD-MMM-YYYY'),
      listDataSource: [],
      oldItem:{},
      doneTaskLength: null,
      isTaskDataLoaded: false,
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    let weekDates = setStartDate(this.state.selectedMonth);
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        firstDate: weekDates.firstDate,
        lastDate: weekDates.lastDate,
      },
    });

    let routeTab = getRouteTab(weekDates.firstDate, weekDates.lastDate);
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        dateArray: routeTab.dateArray,
        tab: routeTab.tab,
      },
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if(!this.state.isTaskDataLoaded && this.props.clDetails && this.props.groupSummary.groupDetails) {
      this.props.GetTaskData();
      this.setState({
        isTaskDataLoaded: true
      })

      const uuid = idx(this.props.clDetails, _ => _.user.uuid);
      const clMediumLogoImage = `https://cdn.shopg.in/user/clinfo/${uuid}-256x100.png`;
      const clBigLogoImage = `https://cdn.shopg.in/user/clinfo/${uuid}-747x100.png`;
      
      
      // Purposefully downloading CL logo after 500 ms
      setTimeout(() => {
      
        fetch(clMediumLogoImage)
          .then(res => {
            if(res.ok){
              RNFetchBlob.config({
                fileCache: true
              })
                .fetch("GET", clMediumLogoImage)
                .then(res => {
                  return res.readFile('base64');
                })
                .then((base64data) => {
                  this.props.ChangeFeild('clMediumLogoImage',base64data)
                })      
            }else{
              console.log('not found')
          }
        })

        fetch(clBigLogoImage)
          .then(res => {
            if(res.ok){
              RNFetchBlob.config({
                fileCache: true
              })
                .fetch("GET", clBigLogoImage)
                .then(res => {
                  return res.readFile('base64');
                })
                .then((base64data) => {
                  this.props.ChangeFeild('clBigLogoImage',base64data)
                })      
            }else{
              console.log('not found')
          }
        })
        
      }, 500)
    }  
  }

 
  updateLayout = item => {
    const {TaskData} = this.props;
    const {oldItem} = this.state;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...TaskData];
    
    let index = array.indexOf(item);
    let oldIndex = Object.keys(oldItem).length === 0 ? 0 : array.indexOf(oldItem);
    array[index]['isExpanded'] = !array[index]['isExpanded'];
    if(index != oldIndex){
      array[oldIndex]['isExpanded'] = false;
    }
    this.props.ChangeFeild('TaskData',array)
    this.setState({oldItem:item})
  };

  onPressCard = () => {
    const {isTaskComplete} = this.props;
    if(isTaskComplete){
      NavigationService.navigate('MyRewards', {
        actionId: 'claimCashBack',
      });
    }
  }

  render() {
    const {clConfig, t, groupShippingData, TaskData,isTaskLoading,isTaskComplete,lenDoneTasks, clEarningTask} = this.props;
    
    if(isTaskLoading){
        return (
          <View style={styles.indicator}>
            <ActivityIndicator animating size="large" />
          </View>
        );
    }

      return (
        <View style={styles.container}>
          <ScrollView>
            <View style={{flex:1,backgroundColor:'#f2f2f2', paddingBottom: heightPercentageToDP(3)}}>
            <View style={{flexDirection:'row',padding:widthPercentageToDP(2),backgroundColor:'#fff3eb',alignItems:'center'}}>
              <Image source={Images.clProfilePics} style={{height:heightPercentageToDP(5),width:widthPercentageToDP(20)}}/>
              <View style={styles.emptyView}/>
              <View>
                <AppText bold style={{color:'#6b1a63'}} size='XS'>{t('TASK MADI, EARN MADI')}</AppText>
                <AppText size='XXS' black>{t('Community leaders earned upto ')}
                  <AppText bold size='XXS' black>{t('₹15,000/month')}
                  </AppText>
                </AppText>
              </View>
            </View>
          {clEarningTask ? (
            <View style={{alignItems: 'center', paddingVertical: heightPercentageToDP(1.6), backgroundColor: 'white'}}>
              <AppText bold style={{fontSize: 20, lineHeight: 19}}>₹{clEarningTask.totalEarnings}</AppText>
              <AppText style={{lineHeight: 19}}>{t('Your Earning (This Week)')}</AppText>
          </View>) : null}
            <View style={styles.emptyView}/>
            {/* <CLTopStrip
              TaskData={TaskData}
              onCardPress={this.onPressCard}
              lenDoneTasks={lenDoneTasks}/> */}
              <TouchableOpacity 
                activeOpacity={1} 
                onPress={this.onPressCard}>
                <ImageBackground
                  source={Images.scratch_task}
                  style={styles.poster}>

                  <View style={styles.oneBcg}>
                    <Image 
                      source={Images.coins} 
                      style={styles.coins} />
                  </View>


                  <View style={styles.oneTwo}>
                    {isTaskComplete ? <AppText white size="S" style={{ textAlign: 'center'}}>
                      {t(`You `)}<AppText bold>{t(`WON REWARDS `)}</AppText><AppText>{t(`for completing 100% tasks`)}</AppText>
                    </AppText> :
                    <AppText white size="S" style={{ textAlign: 'center'}}>
                      {t(`Get `)}<AppText bold>{t(`2% EXTRA BONUS `)}</AppText><AppText>{t(`& `)}</AppText><AppText bold>{t(`WIN REWARDS `)}</AppText><AppText>{t(`by completing 100% tasks`)}</AppText>
                    </AppText>
                    }
                  </View>

                  {
                      (isTaskComplete)
                      ?
                      <View style={[styles.oneTwo,{flex:0.5,width:'100%',justifyContent:'center',alignItems:'center'}]}>
                        <View style={{width:'100%',backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                          <AppText size="M" bold style={{color:Constants.meheroonText}}>
                            {t('TAP TO SCRATCH')}
                          </AppText>
                        </View>

                      </View> : null
                    }

                  <View style={styles.oneThree}>
                    {TaskData && (
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                      <AppText size="S" style={{color:Constants.golderLetter}}>
                          {t(`#PENDINGTASKS#`, { PENDINGTASKS: TaskData.length - lenDoneTasks })}
                      </AppText>
                      
                    </View>)}

                    <View style={{flex:0.2,justifyContent:'center',alignItems:'center'}}>
                      <View style={styles.dot} />
                    </View>
                    
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                    <CountDown
                        until={getTimeRemainingInDay()}
                        onFinish={() => {
                          console.log('Timer finished....');
                        }}
                        size={scaledSize(12)}
                        digitStyle={styles.timerDigit}
                        digitTxtStyle={styles.timerDigitTxt}
                        showSeparator
                        separatorStyle={{color: Constants.golderLetter}}
                        timeToShow={['H', 'M', 'S']}
                        timeLabels={{h: '', m: '', s: ''}}
                      />
                    </View>

                  </View>

                  <View style={styles.oneThree}>

                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                      <AppText size="S" style={{color:Constants.golderLetter,textAlign: 'center'}}>
                          {t('Pending#NL#tasks', { NL: '\n'})}
                      </AppText>
                    </View>

                    <View style={{flex:0.2,justifyContent:'center',alignItems:'center'}}>
                      <View style={[styles.dot,{backgroundColor:'transparent'}]} />
                    </View>
                    
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                      <AppText size="S" style={{color:Constants.golderLetter,textAlign: 'center'}}>
                          {t('Time left for#NL#today\'s tasks', { NL: '\n'})}
                      </AppText>
                    </View>
                  </View>


                </ImageBackground>
              </TouchableOpacity>
              <View style={{flex:1,backgroundColor:Constants.taskListBackground}}>
                {
                  (TaskData && TaskData.length)
                  ?
                  TaskData.map((item, key) => (
                    <ShopGClTask
                      key={item.description}
                      navigation={this.props.navigation}
                      onClickFunction={this.updateLayout.bind(this, item)}
                      item={item}
                      taskType={(item && item.task && item.task.taskType) ? item.task.taskType : null}
                      widgetType={(item && item.task && item.task.widgetType) ? item.task.widgetType : null}
                      t={t}
                    />
                  ))
                  :null
                }
                
              </View>

              <View style={styles.footer} />

            </View>

          </ScrollView>
          {clConfig ? (
            <View style={{marginBottom: heightPercentageToDP(6)}}>
              <TaskStrip clConfig={clConfig} t={t}/>
            </View>
          ) : null
          }
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: heightPercentageToDP(2)
  },
  indicator:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  poster:{
    height:heightPercentageToDP(30),
    marginHorizontal:widthPercentageToDP(4),
    marginVertical:heightPercentageToDP(2),
    paddingVertical: heightPercentageToDP(2)
  },
  coins: { 
    height:heightPercentageToDP(6),
    width:widthPercentageToDP(32),
    resizeMode: 'contain'
  },
  oneBcg:{
    flex:1.5,
    alignItems:'center',
    justifyContent:'center'
  },
  oneTwo:{
    flex:1.4,
    alignItems:'center',
    justifyContent:'center'
  },
  oneThree:{
    flex:0.7,
    alignItems:'center',
    flexDirection:'row'
  },
  dot:{
    height:widthPercentageToDP(1),
    width:widthPercentageToDP(1),
    backgroundColor:'white',
    borderRadius:widthPercentageToDP(2)
  },
  footer:{
    height:heightPercentageToDP(1),
    width:widthPercentageToDP(100),
    backgroundColor:Constants.taskListBackground
  },

  timerDigit: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerDigitTxt: {
    color: Constants.golderLetter,
    //paddingTop: scaledSize(16),
  },
  emptyView:{
    height:heightPercentageToDP(1),
    width:widthPercentageToDP(2)
  }
});

const mapStateToProps = state => ({
  clConfig: state.clOnboarding.clConfig,
  TaskData: state.clOnboarding.TaskData,
  isTaskLoading:state.clOnboarding.isTaskLoading,
  rewards: state.rewards.rewards,
  clEarningTask:state.ShippingList.clEarningTask,
  language: state.home.language,
  groupShippingData: state.ShippingList.groupShippingData,
  groupSummary: state.groupSummary,
  clDetails: state.login.clDetails,
  userPref: state.login.userPreferences,
  firstDate: state.ShippingList.firstDate,
  lastDate: state.ShippingList.lastDate,
  dateArray: state.ShippingList.dateArray,
  isTaskComplete: state.clOnboarding.isTaskComplete,
  lenDoneTasks:state.clOnboarding.lenDoneTasks,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  onGetCLOnboarding: () => {
    dispatch(getStarterKit());
  },
  GetTaskData: () => {
    dispatch(getTaskData());
  },
  ChangeFeild: (key,value) => {
    dispatch(changeField(key,value));
  },
  onGetWidgets: (isPublic, isPrivate, page, userId) => {
    dispatch(getWidgets(isPublic, isPrivate, page, userId));
  }
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CLTasks),
);