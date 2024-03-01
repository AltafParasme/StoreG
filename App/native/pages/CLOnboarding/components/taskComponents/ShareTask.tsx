import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
import {shareToWhatsAppCLTasks, buildDeepLink} from '../../../utils';
import {liveAnalytics} from '../../../ShopgLive/redux/actions';
import {getUserSegments} from '../../actions';
import {LogFBEvent, Events} from '../../../../../Events';
import {connect} from 'react-redux';
import { Constants } from '../../../../../styles';
import AvatarList from './AvatarList';
import { widthPercentageToDP, scaledSize, heightPercentageToDP } from '../../../../../utils';

class ShareTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeAvatar: 0,
            data: new Array(props.data.imageQuantity).fill({}),
        };
        this.shareWhatsapp = this.shareWhatsapp.bind(this);
        }

  shareWhatsapp = async (message, index) => {
    const {t, userPref, data, widgetId, userSegmentData, actionData, clDetails} = this.props;
    const usersToShare = userSegmentData && Object.keys(userSegmentData) && userSegmentData[this.props.data.taskType];
    
    const userNumber = usersToShare[index].phoneNumber;
    const actionId = usersToShare[index].id;
    
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
      
    try {
        /** to ensure the permission being granted, if granted then sharing images/ texts are confirmed */
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'ShopG wants to store images, media contents and files',
            message: 'ShopG wants to store images, media contents and files',
            buttonNegative: 'Deny',
            buttonPositive: 'Allow',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.state.data.map((item, index) => {
            imageUrlArr.push(`${data.imageUrl}-${index + 1}.png`)
          })
          if(actionId == 0 || actionId == 1) {
            shareToWhatsAppCLTasks(
              '',
              eventProps,
              t,
              message,
              null,
              'CL_TASK',
              imageUrlArr,
              this.props.onCompleteTask,
              userPrefData,
              userNumber,
              data.taskType,
              usersToShare,
              avatarData,
              actionId
            );
          }else {
            LogFBEvent(Events.SHARE_WHATSAPP_CL_TASK_CLICK, eventProps)
            const whatsAppLink = clDetails && clDetails.clConfig && clDetails.clConfig.whatsAppLink;
            let mssg;
            if(whatsAppLink){
              mssg = t(`#MESSAGE##NL##NL##NL#Get upto 70% discounts on new and exciting products on your WhatsApp#NL##NL#*Join My Nyota Mart WhatsApp Group* - #WHATSAPPLINK#`, {
              MESSAGE: message,
              WHATSAPPLINK: whatsAppLink,
              NL: '\n'})
            } else {
              mssg = message;
            }
            shareToWhatsAppCLTasks(
              clMediumLogoImage,
              eventProps,
              t,
              mssg,
              null,
              'CL_TASK',
              imageUrlArr,
              this.props.onCompleteTask,
              userPrefData,
              userNumber,
              data.taskType,
              usersToShare,
              avatarData,
              actionId
            );  
          }
        } else {
          console.log('permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
  }

  componentDidUpdate = () => {
    const {isExpanded, widgetId, data, userSegmentData} = this.props;
    const obj = {
      taskId: widgetId,
      taskType: data.taskType
    };
    const isDataAlreadyFetched = userSegmentData && Object.keys(userSegmentData) && userSegmentData.hasOwnProperty(this.props.data.taskType);
    if(isExpanded && !isDataAlreadyFetched )
    this.props.getUserSegments(obj);
  }

  onPressAvatar = async (index) => {
    const {t, data, widgetId, userPref, groupSummary} = this.props
    this.setState({
      activeAvatar: index
    })

    const inviteToken = groupSummary.groupDetails.info.inviteToken;
    
    const deepLinkUrl = await buildDeepLink('CLTasks', 'Share', inviteToken, userPref.uid, widgetId);
    
    let mssg = t(
      `${data.shareMessage}#NL##NL##DEEPLINKURL##NL##NL#Limited stocks only`,
      {
        DEEPLINKURL: deepLinkUrl,
        NL: '\n',
      },
    );
    this.shareWhatsapp(mssg, index);
  }

  render() {
    const {t, actionData, data, userSegmentData} = this.props;
    const usersToShare = userSegmentData && Object.keys(userSegmentData) && userSegmentData[this.props.data.taskType];
    let avatarData;
    if(actionData) {
      avatarData = actionData[this.props.data.taskType];
    }
    
    return (
      <View
        style={{
          marginTop: heightPercentageToDP(2),
        }}>
        {usersToShare ? <View style={{ height: heightPercentageToDP(12) }}><AvatarList actionData={avatarData} data={usersToShare} activeIndex={this.state.activeAvatar} onPress={this.onPressAvatar}/></View> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  whatsappCircle: {
    marginHorizontal: widthPercentageToDP(3),
    backgroundColor: Constants.green,
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(35),
    height: scaledSize(35),
    borderRadius: 35 / 2,
  },
  taskSubstepsStyle: {
    color: Constants.greyishBlack,
    lineHeight: 21,
    paddingBottom: heightPercentageToDP(1),
    paddingRight: widthPercentageToDP(4),
  },
  horizontalLine: {
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
    paddingTop: widthPercentageToDP(2.2),
    width: widthPercentageToDP(90),
  },
  shareData: {
    flexDirection: 'row',
    height: heightPercentageToDP(8),
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(80),
  },
});

const mapStateToProps = state => ({
    userPref: state.login.userPreferences,
    userSegmentData: state.clOnboarding.userSegmentData,
    clMediumLogoImage: state.clOnboarding.clMediumLogoImage,
    actionData: state.clOnboarding.actionData,
    clDetails: state.login.clDetails,
    groupSummary: state.groupSummary
  });
  
  const mapDispatchToProps = dispatch => ({
    dispatch,
    getUserSegments: (obj) => {
      dispatch(getUserSegments(obj));
    },
    onAnalytics: (eventName, eventData, userPrefData) => {
      dispatch(liveAnalytics(eventName, eventData, userPrefData));
    },
  });

export default withTranslation()(
connect(mapStateToProps, mapDispatchToProps)(ShareTask),
);
