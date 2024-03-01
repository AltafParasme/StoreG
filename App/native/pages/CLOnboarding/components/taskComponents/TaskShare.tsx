import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../../components/Texts';
import {shareToWhatsAppCLTasks, buildDeepLink} from '../../../utils';
import {liveAnalytics} from '../../../ShopgLive/redux/actions';
import {getUserSegments, startLoading, endLoading} from '../../actions';
import {LogFBEvent, Events} from '../../../../../Events';
import {connect} from 'react-redux';
import { Constants } from '../../../../../styles';
import NavigationService from '../../../../../utils/NavigationService';
import TaskImagesRender from './TaskImagesRender';
import AvatarList from '../taskComponents/AvatarList';
import TaskShareWhatsapp from './TaskShareWhatsapp';
import { widthPercentageToDP, scaledSize, heightPercentageToDP } from '../../../../../utils';

class TaskShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new Array(props.data.imageQuantity).fill({}),
            activeAvatar: 0
        };
        this.shareWhatsapp = this.shareWhatsapp.bind(this);
        this.takeToImageViewer = this.takeToImageViewer.bind(this);
        }

  shareWhatsapp = async (message, index) => {
    const {t, userPref, data, widgetId, userSegmentData, actionData, clDetails, clBigLogoImage} = this.props;
    const usersToShare = userSegmentData && Object.keys(userSegmentData) && userSegmentData[this.props.data.taskType];
    
    const userNumber = usersToShare[index].phoneNumber;

    const actionId = usersToShare[index].id;
    let avatarData;
    if(actionData) {
      avatarData = actionData[data.taskType];
    } 

    let imageUrlArr = [];
    let currentDate = moment.utc(new Date());
    let currentDateLocal = currentDate.local().format('DD-MMM-YYYY');
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
              imageUrlArr.push(`${data.imageUrl}/${currentDateLocal}-${index + 1}.png`)
          }) 
          this.props.startLoading('Sharing');
          if(actionId == 0 || actionId == 1) {
            shareToWhatsAppCLTasks(
              clBigLogoImage,
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
          let mssg, imageMessage = '';
          imageUrlArr.forEach((item) => {
            imageMessage += `${item}#NL#`
          })  

          if(whatsAppLink){
            mssg = t(`#MESSAGE##NL##NL##IMAGESMESSAGE##NL#Get upto 70% discounts on new and exciting products on your WhatsApp#NL##NL#*Join My Glowfit Mart WhatsApp Group* - #WHATSAPPLINK#`, {
            IMAGESMESSAGE: imageMessage,
            MESSAGE: message,
            WHATSAPPLINK: whatsAppLink,
            NL: '\n'})
          } else {
            mssg = t(`#MESSAGE##NL##IMAGESMESSAGE#`, {
              IMAGESMESSAGE: imageMessage,
              MESSAGE: message,
              NL: '\n'});
          }  

          shareToWhatsAppCLTasks(
            clBigLogoImage,
            eventProps,
            t,
            mssg,
            null,
            'CL_TASK',
            [],
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
      `#SHAREMESSAGE##NL##NL##DEEPLINKURL##NL##NL#Limited stocks only`,
      {
        SHAREMESSAGE: data.shareMessage,
        DEEPLINKURL: deepLinkUrl,
        NL: '\n',
      },
    );
    this.shareWhatsapp(mssg, index);
  }

  takeToImageViewer = (index) => {
    const {data} = this.props;
    
    let currentDate = moment.utc(new Date());
    let currentDateLocal = currentDate.local().format('DD-MMM-YYYY');
    let imageUrlArr = [];
    this.state.data.map((item, index) => {
      imageUrlArr.push({ url: `${data.imageUrl}/${currentDateLocal}-${index + 1}.png`})
    }) 
    if(imageUrlArr && imageUrlArr.length > 0 && imageUrlArr[index]) {
      NavigationService.navigate('ImageView', {
        url: imageUrlArr[index].url,
        index: index,
        restData: imageUrlArr,
      });
    }
  }

  render() {
    const {t, actionData, data, userSegmentData, loading} = this.props;
    const usersToShare = userSegmentData && Object.keys(userSegmentData) && userSegmentData[this.props.data.taskType];
    let avatarData;
    if(actionData) {
      avatarData = actionData[this.props.data.taskType];
    }
    
    return (
      <View
        style={{
          //width: widthPercentageToDP(96),
          marginTop: heightPercentageToDP(2),
        }}>
        <FlatList
          data={this.state.data}
          horizontal
          renderItem={({item, index}) =>
            <TaskImagesRender  data={item} index={index + 1} imageUrl={data.imageUrl} onPress={this.takeToImageViewer}/>
          }
        />

        {loading && (
          <View style={styles.activityView}>
            <ActivityIndicator
              color="black"
              style={{margin: 15}}
              size="small"
            />
          </View>
        )}
        {!loading && usersToShare ? <View style={{ height: heightPercentageToDP(12) }}><AvatarList actionData={avatarData} data={usersToShare} activeIndex={this.state.activeAvatar} onPress={this.onPressAvatar}/></View> : null}
        {/* { data.shareKey ? (
        <TouchableOpacity onPress={() => {
            this.shareWhatsapp(data.shareMessage);
        }}
        style={{}}
        >
          <TaskShareWhatsapp shareKey={data.shareKey} t={t} />
        </TouchableOpacity>) : null} */}
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
  activityView: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => ({
    userPref: state.login.userPreferences,
    userSegmentData: state.clOnboarding.userSegmentData,
    actionData: state.clOnboarding.actionData,
    clBigLogoImage: state.clOnboarding.clBigLogoImage,
    clDetails: state.login.clDetails,
    loading: state.clOnboarding.loading,
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
    startLoading: (text) => {
      dispatch(startLoading(text))
    },
    endLoading: () => {
      dispatch(endLoading())
    }
  });

export default withTranslation()(
connect(mapStateToProps, mapDispatchToProps)(TaskShare),
);
