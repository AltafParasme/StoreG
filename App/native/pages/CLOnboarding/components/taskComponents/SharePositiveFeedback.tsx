import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {Icon, AirbnbRating} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../../components/Texts';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  ActivityIndicator
} from 'react-native';
import {
  getRequestFeedback,
  getShareFeedback,
  changeField,
  getDhamakaCashback
} from '../../../CLOnboarding/actions';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  scaledSize,
} from '../../../../../utils';
import idx from 'idx';
import {Images} from '../../../../../../assets/images';
import {Constants} from '../../../../../styles';
import {buildLink, showToastr, shareToWhatsAppCLTasks, buildDeepLink, 
  shareDhamakaSalesinGroup,removeDuplicates, isIncluded } from '../../../utils';
import {processTextAndAppendElipsis} from '../../../../../utils/misc';
import {LogFBEvent, Events} from '../../../../../Events';
import LinearGradientButton from '../../../../../components/Button/LinearGradientButton';

class SharePositiveFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeId: null,
      productDetails: null,
      selectedOfferId: [],
      pressedIndex: null,
      requestFeedbackOrdersListCheck: null,
      isTaskMarkedComplete: false,
      isApiCalled: false
    };
    this.onShare = this.onShare.bind(this);
    this.shareWhatsapp = this.shareWhatsapp.bind(this);
  }

  

  componentDidUpdate = () => {
    const {userPref, widgetId, dhamakaCashbackDetails, actionData, isDone, data, taskType, isExpanded, getDhamakaCashback} = this.props;
    const {isTaskMarkedComplete, isApiCalled} = this.state;
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };
   
    if (isExpanded && !isApiCalled) {
      this.props.getShareFeedback('order', 'CL', 1);
    
      if (taskType === 'dhamakaCashback') {
        getDhamakaCashback(false, true);
      }
      this.setState({
        isApiCalled: true
      })
    }
    if (!isTaskMarkedComplete) {
      if (taskType === 'dhamakaCashback' && !isDone && actionData && actionData[taskType] && dhamakaCashbackDetails && ((removeDuplicates(actionData[taskType]).length) === (dhamakaCashbackDetails.cashbackUsers.length))) {
        let eventProps = {
          taskId: widgetId,
          widgetType: data.widgetType,
          actionId : null
        }
        let userPrefData = {
          userId: userPref.uid,
          sid: userPref.sid,
        };
        
        this.props.onCompleteTask(eventProps, userPrefData, true)
      } else  if (taskType !== 'dhamakaCashback' &&  !isDone && this.props.positiveFeedbacks && this.props.positiveFeedbacks.length < 1 && !isTaskMarkedComplete){
        this.props.onCompleteTask({taskId: widgetId, actionId: null}, userPrefData, true)
        this.setState({
          isTaskMarkedComplete: true
        })
      }
    }
   
  }

  listEmptyComponent = () => {
    const {t, dhamakaCashbackDetails, positiveFeedbacks, taskType} = this.props;
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: heightPercentageToDP(2),
          }}>
          <AppText size="L" bold>
            {t('Your Order List is Empty')}
          </AppText>
        </View>
      );
   
  };

  onShare = async (item, index) => {
    const {t, data, taskType, userPref, groupSummary, widgetId} = this.props
    const inviteToken = groupSummary.groupDetails.info.inviteToken;
    const deepLinkUrl = await buildDeepLink('CLTasks', 'Share', inviteToken, userPref.uid, widgetId);
    
    let stars = []
    for(let i= 0 ; i < item.rating; i++) {
      stars.push('⭐')
    }
    let mssg = t(
      data.shareMessage,
      {
        USERNAME: item.name,
        PRODUCTNAME: item.mediaJson && item.mediaJson.title.text,
        RATING: item.rating,
        STARS: stars.join(''),
        DEEPLINKURL: deepLinkUrl,
        NL: '\n',
      },
    );
    
    if(taskType == 'dhamakaCashback') {
      item.userid ? this.shareWhatsapp(mssg, item, index, deepLinkUrl) : this.onShareGroup(item);
    }
    else {
      this.shareWhatsapp(mssg, item, index, deepLinkUrl);
    }
  }

  onShareGroup = (item) => {
    const {t, dhamakaCashbackDetails, groupSummary, userPref, widgetId, data, } = this.props;
   
    let eventProps = {
      taskId: widgetId,
      widgetType: data.widgetType,
      actionId : item.userid
    }
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };

    shareDhamakaSalesinGroup(
      'MyOrderBusinessCheckout', 
      'SharePositiveFeedback',
      t,
      item,
      groupSummary,
      dhamakaCashbackDetails,
      userPref,
      eventProps,
      userPrefData,
      this.props.onCompleteTask,
      this.isTaskMarkedComplete
      );
};

isTaskMarkedComplete() {
  this.setState({
    isTaskMarkedComplete: true
  })
}

  shareWhatsapp = async (message, item, index, deepLinkUrl) => {
    let {t, 
      userPref, 
      data, 
      widgetId, 
      positiveFeedbacks, 
      actionData, 
      taskType, 
      dhamakaCashbackDetails,
      taskItem,
      clMediumLogoImage
    } = this.props;
    let sharedItems = [];
   
    let usersToShare = positiveFeedbacks;
    const actionId = taskType !== 'dhamakaCashback' ? positiveFeedbacks && positiveFeedbacks[index].orderId : item.userid;

    let avatarData;
    if(actionData) {
      avatarData = actionData[data.taskType];
    } 

    let imageUrlArr = [];
    
    let eventProps = {
        taskId: widgetId,
        widgetType: data.widgetType,
        actionId : actionId
      }
      let userPrefData = {
        userId: userPref.uid,
        sid: userPref.sid,
      };
   
    
    if (taskType !== 'dhamakaCashback')  {
   
      try {
        LogFBEvent(Events.SHARE_WHATSAPP_CL_TASK_CLICK, eventProps)
        shareToWhatsAppCLTasks(
          clMediumLogoImage,
          eventProps,
          t,
          message,
          null,
          'CL_TASK',
          imageUrlArr,
          this.props.onCompleteTask,
          userPrefData,
          '',
          data.taskType,
          usersToShare,
          avatarData,
          actionId
        );
      } catch (err) {
        console.warn(err);
      }
     } else {

      let eventPropsShareWhatsapp = {
        widgetId: widgetId,
        taskId: widgetId,
        component: 'SharePositiveFeedback',
        sharedBy: userPref && userPref.userMode,
       };
      let moreValue = dhamakaCashbackDetails.userDetails.offerDetails.OFFER_TOTAL_ORDER_LIMIT - item.orderValue;
      let message = t(data.shareMessage, {
        USERNAME: item.name,
        PRICE: item.orderValue,
        MORE: moreValue > 0 ? moreValue : 0,
        CASHBACK: dhamakaCashbackDetails.userDetails.offerDetails.OFFER_CASHBACK_MAX,
        DEEPLINKURL: deepLinkUrl,
        NL: '\n'
      })
     
      Linking.openURL(`whatsapp://send?phone=${`91${item.phoneNumber}`}&text=${encodeURIComponent(message)}`).then(() => {
        sharedItems.push(item.userid);
        sharedItems = avatarData ? sharedItems.concat(avatarData) : sharedItems;
       
        if (removeDuplicates(sharedItems).length === dhamakaCashbackDetails.cashbackUsers.length) {
          this.props.onCompleteTask(eventProps, userPrefData, true)
          this.isTaskMarkedComplete()
        } else {
          this.props.onCompleteTask(eventProps, userPrefData)
        }
        LogFBEvent(Events.SHARE_WHATSAPP_CL_TASK_CLICK, eventPropsShareWhatsapp);
      });
     }
   
  }

 

  renderItemList = (item, index) => {
    const {t, data, positiveFeedbacks, taskType, dhamakaCashbackDetails, actionData} = this.props;
   
    let isSharedItem = false;
    
    if(taskType === 'dhamakaCashback') {
      isSharedItem = actionData && actionData[taskType] && item ? isIncluded(actionData[taskType], item.userid) : false;
    }
    else {
      isSharedItem = actionData && actionData[taskType] && item ? isIncluded(actionData[taskType], positiveFeedbacks[index].orderId) : false;
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: heightPercentageToDP(1)
        }}> 
        { taskType !== 'dhamakaCashback' ? (
        <View style={{flex: 0.75}}>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: widthPercentageToDP(2),
            }}>
            <AppText textProps={{numberOfLines: 2}}>
              <AppText bold>{item.name}</AppText>
              {` rated   `}
            </AppText>
            <Image
              source={{uri: item.mediaJson.square}}
              style={{
                height: widthPercentageToDP(7),
                width: widthPercentageToDP(7),
                resizeMode: 'contain',
              }}
            />
            <AppText textProps={{numberOfLines: 2}}>
                {`  ${processTextAndAppendElipsis(item.mediaJson.title.text, 15)}`}
            </AppText>
          </View>
          <View style={{ alignItems:'flex-start', marginLeft: widthPercentageToDP(32)}}>
          <AirbnbRating
            count={item.rating}
            defaultRating={5}
            size={15}
            showRating={false}
            />
           </View> 
        </View>) : item.userid ? (
          <View style={{flex: 0.93}}>
            <AppText>{t(`${item.name}, `)}<AppText bold>{t(`bought worth ₹#TOTALORDER# `, {
              TOTALORDER: item.orderValue
            })}</AppText>
            <AppText bold>{t(`Get him to buy for ₹#MORE# more `, {
              MORE: (dhamakaCashbackDetails.userDetails.offerDetails.OFFER_TOTAL_ORDER_LIMIT - item.orderValue > 0) ? (dhamakaCashbackDetails.userDetails.offerDetails.OFFER_TOTAL_ORDER_LIMIT - item.orderValue) : 0
            })}</AppText><AppText> {t(`for ₹#CASHBACK# cashback`, {
              CASHBACK: dhamakaCashbackDetails.userDetails.offerDetails.OFFER_CASHBACK_MAX
            })}</AppText></AppText>
          </View>
        ) : (
          <View>
            <AppText>{t('Share Dhamaka Cashback offer#NL# in your whatsapp group', {
              NL:'\n'
            })}</AppText>
            </View>
        )
        }
        <TouchableOpacity style={styles.shareBtn} onPress={() => this.onShare(item, index)}>
          
          <View style={{flexDirection: 'row',  alignItems: 'center',}}>
            {
             isSharedItem ? (  <Icon
                name="done"
                type="material"
                color={Constants.white}
                size={widthPercentageToDP(4.5)}
                containerStyle={{
                  alignSelf: 'center',
                  marginRight: widthPercentageToDP(2)
                }}
              />) : (
                <Image source={Images.whatsapp} style={styles.buttonImage} />
              )
            }
        
          <AppText white bold size='XXS' style={{lineHeight:10, letterSpacing: 0.5}}>{t(`SHARE`)}</AppText>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    let {positiveFeedbacks, t, feedbackGiven, CLTask, taskType, actionData,dhamakaCashbackDetails, isTaskDhamakaLoading, isShareFeedbackLoading} = this.props; 
    
    if (isTaskDhamakaLoading || isShareFeedbackLoading) {
      return (
        <View style={{marginTop: heightPercentageToDP(2)}}>
        <ActivityIndicator color={Constants.black} size="large" style={{alignSelf: 'center', justifyContent: 'center'}}/>
        </View>
      )
    }

    return (
      <View style={{flex: 1, marginTop: heightPercentageToDP(1)}}>
        <FlatList
          data={taskType === 'dhamakaCashback' ? dhamakaCashbackDetails && dhamakaCashbackDetails.cashbackUsers : positiveFeedbacks}
          renderItem={({item, index}) => this.renderItemList(item, index)}
          extraData={this.props.actionData}
          ListEmptyComponent={this.listEmptyComponent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  whatsappCircleGroupDeal: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(34),
    height: scaledSize(34),
    borderRadius: 34 / 2,
    elevation: 6,
  },
  buttonImage: {
    height: scaledSize(17),
    width: scaledSize(17),
    marginRight: 10,
    resizeMode: 'contain',
  },
  shareBtn: {
    backgroundColor: '#1ad741', 
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center',
    height: heightPercentageToDP(3.75),
    paddingHorizontal: widthPercentageToDP(2),
    borderColor: '#0dc143',
    borderRadius: 4,
  }
});

const mapStateToProps = state => ({
  positiveFeedbacks: state.clOnboarding.positiveFeedbacks,
  dhamakaCashbackDetails: state.clOnboarding.dhamakaCashbackDetails,
  actionData: state.clOnboarding.actionData,
  clMediumLogoImage: state.clOnboarding.clMediumLogoImage,
  clBigLogoImage: state.clOnboarding.clBigLogoImage,
  groupSummary: state.groupSummary,
  login: state.login,
  isTaskDhamakaLoading: state.clOnboarding.isTaskDhamakaLoading,
  isShareFeedbackLoading: state.clOnboarding.isShareFeedbackLoading,
  userPref: state.login.userPreferences,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getRequestFeedback: userType => {
    dispatch(getRequestFeedback(userType));
  },
  getShareFeedback: (type, userType, page) => {
    dispatch(getShareFeedback(type, userType, page));
  },
  getDhamakaCashback: (tnc, clUsers) => {
    dispatch(getDhamakaCashback(tnc, clUsers));
  },
  ChangeField: (key, value) => {
    dispatch(changeField(key, value));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(SharePositiveFeedback)
);
