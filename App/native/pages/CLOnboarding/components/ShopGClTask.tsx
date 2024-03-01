/*Example of Expandable ListView in React Native*/
import React, { Component } from 'react';
//import react in our project
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import idx from 'idx';
import { widthPercentageToDP } from '../../../../utils';
import {AppText} from '../../../../components/Texts';
import {withTranslation} from 'react-i18next';
import TaskShare from './taskComponents/TaskShare'
import ShareTask from './taskComponents/ShareTask';
import TaskMarkDelivery from './taskComponents/TaskMarkDelivery';
import TaskAddContactsToCL from './taskComponents/TaskAddContactsToCL';
import SharePositiveFeedback from './taskComponents/SharePositiveFeedback';
import FeedBackShare from '../../MyRewards/components/FeedBackShare';
import RelevanceTaskShare from './taskComponents/RelevanceTaskShare';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import TaskWhatsappLink from './taskComponents/TaskWhatsappLink';
import GenericTask from './taskComponents/GenericTask';
import {Colors} from '../../../../../assets/global';
import {LogFBEvent, Events} from '../../../../Events';
import {liveAnalytics} from '../../ShopgLive/redux/actions';
import {changeField, endLoading} from '../actions';
import {Images} from '../../../../../assets/images';
import VideoModal from '../../../../components/VideoModal/VideoModal';
import {Constants} from '../../../../styles';
import {getWidgets} from '../../Home/redux/action';
import { removeDuplicates } from '../../utils';
 
class ShopGClTask extends Component {
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
      components :{
        TaskShare,
        TaskMarkDelivery,
        FeedBackShare,
        SharePositiveFeedback,
        RelevanceTaskShare,
        TaskWhatsappLink,
        GenericTask,
        ShareTask,
        TaskAddContactsToCL
      },
      isModalOpen:false,
      startVideoTime:new Date(),
    };
    this.onCompleteTask = this.onCompleteTask.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if ((this.state.layoutHeight !== nextState.layoutHeight) || (this.state.isModalOpen !== nextState.isModalOpen)) {
      return true;
    }
    return false;
  }

  toggle = () => {
    const {isModalOpen} = this.props;
    !isModalOpen ? this.setState({startVideoTime:(new Date())})  : null;
    this.setState({isModalOpen:!this.state.isModalOpen})
  };

  onPressLearnVideo = () => {
    const  {item} = this.props;
    this.setState({isModalOpen:true})
    LogFBEvent(Events.CL_TASK_VIDEO_OPEN,{taskID:item.id});
  }

  onCompleteTask(eventProps, userProps, isDone) {
    const {TaskData,item,changeField, actionData,userPref} = this.props;
    
    
    if((item.task.widgetType == 'TaskShare' ) || (item.task.widgetType == 'ShareTask') || (item.task.widgetType == 'RelevanceTaskShare') || (item.task.widgetType == 'SharePositiveFeedback') || (item.task.widgetType == 'FeedBackShare')) {
      this.props.endLoading();
      let newActionData = actionData && Object.keys(actionData) ? actionData[item.task.taskType] ? actionData[item.task.taskType] : [] : [];
      newActionData.indexOf(eventProps.actionId) === -1 ? newActionData.push(eventProps.actionId) : console.log("This item already exists");
     
      changeField('actionData', {
        ...actionData,
        [item.task.taskType]: removeDuplicates(newActionData)
      });

      
      
      if (!((item.task.widgetType == 'RelevanceTaskShare' || item.task.widgetType == 'FeedBackShare' || item.task.widgetType == 'SharePositiveFeedback')&& isDone)) {
        
        this.props.onAnalytics(Events.SHARE_WHATSAPP_CL_TASK_CLICK.eventName(), eventProps, userProps);  
      }
      
      if(isDone) {
        const userMode = idx(this.props.userPref, _ => _.userMode);
        const clType = idx(this.props.clDetails, _ => _.clConfig.clType);

        let userEventData = {...eventProps, ...{userMode: userMode, userSegment: clType}};
        this.props.onAnalytics(Events.CL_TASK_COMPLETE_CLICK.eventName(), userEventData, userProps);  
        let tempTaskData = [...TaskData];
        let tempItem = item;
        // delete tempTaskData[tempTaskData.indexOf(item)];
        tempItem['isDone'] = true;
        tempItem['isExpanded'] = false;
        tempTaskData[tempTaskData.indexOf(tempItem)] = tempItem;
        // tempTaskData.push(item);
        
        let PendingTaskData = [];
        let CompletedTaskData = [];
        tempTaskData.map((item, index) => {
          if(item.isDone){
            CompletedTaskData.push(item);
          } else {
            PendingTaskData.push(item);
          }
        });
        let _TaskData = PendingTaskData.concat(CompletedTaskData);

        _TaskData[0]['isExpanded'] = true;
        changeField('TaskData', _TaskData);

        const isDoneTasks = _TaskData && _TaskData.filter(item => item.isDone);
        const lenDoneTasks = isDoneTasks ? isDoneTasks.length : 0;
        changeField('lenDoneTasks', lenDoneTasks);
        let isTaskComplete = ((TaskData && TaskData.length && (TaskData.length - lenDoneTasks)) == 0) ? true : false;
        if(isTaskComplete){
          changeField('isTaskComplete', true);
        }
      }
    }
    else {
      // code to change item locally
      let tempTaskData = [...TaskData];
      let tempItem = item;
      // delete tempTaskData[tempTaskData.indexOf(item)];
      tempItem['isDone'] = true;
      tempItem['isExpanded'] = false;
      tempTaskData[tempTaskData.indexOf(tempItem)] = tempItem;
      // tempTaskData.push(item);
      let PendingTaskData = [];
      let CompletedTaskData = [];
      tempTaskData.map((item, index) => {
        if(item.isDone){
          CompletedTaskData.push(item);
        } else {
          PendingTaskData.push(item);
        }
      });
      let _TaskData = PendingTaskData.concat(CompletedTaskData);

      _TaskData[0]['isExpanded'] = true;
      changeField('TaskData', _TaskData);
      
      this.props.onAnalytics(Events.CL_TASK_COMPLETE_CLICK.eventName(), eventProps, userProps);

      const isDoneTasks = _TaskData && _TaskData.filter(item => item.isDone);
      const lenDoneTasks = isDoneTasks ? isDoneTasks.length : 0;
      changeField('lenDoneTasks', lenDoneTasks);
      let isTaskComplete = ((TaskData && TaskData.length && (TaskData.length - lenDoneTasks)) == 0) ? true : false;
      if(isTaskComplete){
        changeField('isTaskComplete', true);
      }
    }
  }

 
  render() {
    const {t,widgetType,taskType, item,onClickFunction} = this.props;
    const {layoutHeight,components,isModalOpen} = this.state;
    const TaskInnerComponent = (widgetType && components.hasOwnProperty(widgetType)) ? components[widgetType] : View;
    const arrowDirection = (layoutHeight==0) ? 'angle-down' : 'angle-up';
    const hasVideo = item && item.task && item.task.videoUrl;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClickFunction}
          style={styles.header}>
            <View style={{flex:8}}>
              
            <View style={{flexDirection: 'row'}}>
            {
              (item.isDone)
              ?
              <View style={styles.completedStyleWraper}>
                <AppText bold size="XXS" style={styles.completedStyle}>
                  {t('COMPLETED')}
                </AppText>
              </View>
              :
              <View style={styles.pendingStyleWraper}>
                <AppText bold size="XXS" style={styles.pendigStyle}>
                  {t('PENDING')}
                </AppText>
              </View>
            }
            {
                (hasVideo)
                ?
                <TouchableWithoutFeedback>
                  <TouchableOpacity 
                      onPress={this.onPressLearnVideo}
                      style={[{flex:1, flexDirection: 'row'},styles.doCenter]}>
                      <AppText bold black size="XS">{t(`How to do task`)}</AppText>
                    <Image source={Images.play_icon} style={styles.icon} />
                  </TouchableOpacity>
                </TouchableWithoutFeedback>
                : null
              }
            </View>

              <AppText black bold size="M">
                {item.description}
              </AppText>
            </View>

            <View style={[{flex:1},styles.doCenter]}>
              <Icon
                  name={arrowDirection}
                  type={'font-awesome'}
                  color={Colors.black}
                  size={widthPercentageToDP(5)}
                />
            </View>
            
          
        </TouchableOpacity>
        <View
          style={{
            height: layoutHeight,
            overflow: 'hidden',
          }}>
            <View style={styles.baseLine} />
            <TaskInnerComponent 
              isExpanded={item.isExpanded}
              data={item.task}
              CLTask={true}
              actionData={item.actionData}
              screen={'MyOrderBusinessCheckout'}
              isDone={item.isDone}
              taskItem={item}
              widgetId={item.id}
              taskType={taskType}
              onCompleteTask={this.onCompleteTask}
            />
            
        </View>

        {isModalOpen && (
            <VideoModal
                visible={isModalOpen}
                toggleModal={this.toggle}
                videoCompleteUrl={hasVideo ? item.task.videoUrl : ''}
                header={item.description}
                onClose={() => {
                    this.toggle();
                    let timeTaken = new Date() - this.state.startVideoTime;
                    LogFBEvent(Events.CL_TASK_VIDEO_CLOSE,{taskID:item.id,timeTaken:timeTaken});
                }}
            />
        )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
      backgroundColor: 'white',
      padding: widthPercentageToDP(3.5),
      paddingHorizontal: widthPercentageToDP(5),
      marginVertical:widthPercentageToDP(1.5),
    },
    header: {
      flexDirection:'row'
    },
    doCenter:{
      justifyContent:'center',
      alignItems:'center'
    },
    separator: {
      height: 0.5,
      backgroundColor: '#808080',
      width: '95%',
      marginLeft: 16,
      marginRight: 16,
    },
    text: {
      fontSize: 16,
      color: '#606070',
      padding: 10,
    },
    content: {
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: '#fff',
    },
    completedStyle:{
      color:Colors.greenishBlue,
      fontFamily:'sans-serif-black',
      letterSpacing:widthPercentageToDP(0.5)
    },
    pendigStyle:{
      color:Colors.white,
      fontFamily:'sans-serif-black',
      letterSpacing:widthPercentageToDP(0.5)
    },
    completedStyleWraper:{
      alignSelf:'baseline',
      borderColor:Colors.greenishBlue,
      borderRadius:widthPercentageToDP(0.5),
      borderWidth:widthPercentageToDP(0.5),
      padding:widthPercentageToDP(0.5),
    },
    pendingStyleWraper:{
      alignSelf:'baseline',
      borderColor:Colors.tomato,
      backgroundColor:Colors.tomato,
      borderRadius:widthPercentageToDP(0.5),
      borderWidth:widthPercentageToDP(0.5),
      padding:widthPercentageToDP(0.5),
    },    
    icon: {
      height: widthPercentageToDP(6),
      width: widthPercentageToDP(6),
      resizeMode: 'contain',
      marginLeft: widthPercentageToDP(0.5)
    },
    baseLine: {
      height:widthPercentageToDP(0.3),
      width:widthPercentageToDP(100),
      marginHorizontal:widthPercentageToDP(0.5),
      backgroundColor:Constants.taskListBackground,
      marginBottom:widthPercentageToDP(0.5)
    }
});

const mapStateToProps = state => ({
  TaskData: state.clOnboarding.TaskData,
  actionData: state.clOnboarding.actionData,
  loading: state.clOnboarding.loading,
  userPref: state.login.userPreferences,
  clDetails: state.login.clDetails,
  isTaskComplete: state.clOnboarding.isTaskComplete,
});

//export default ShopGClTask;
const mapDispatchToProps = dispatch => ({
  dispatch,
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
  changeField: (key,value) => {
    dispatch(changeField(key,value));
  },
  endLoading: () => {
    dispatch(endLoading())
  },
  onGetWidgets: (isPublic, isPrivate, page, userId) => {
    dispatch(getWidgets(isPublic, isPrivate, page, userId));
  },
});

export default withTranslation()(
connect(mapStateToProps, mapDispatchToProps)(ShopGClTask),
);