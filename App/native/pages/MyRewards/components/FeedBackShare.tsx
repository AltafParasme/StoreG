import * as React from 'react';
import { Component } from 'react';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';
import {AppText} from '../../../../components/Texts';
import { View, FlatList, TouchableOpacity, StyleSheet, Image, Linking, ActivityIndicator} from 'react-native';
import {getRequestFeedback, getShareFeedback, changeField} from '../../CLOnboarding/actions';
import {withTranslation} from 'react-i18next';
import { heightPercentageToDP, widthPercentageToDP, scaledSize } from '../../../../utils';
import { Constants } from '../../../../styles';
import {feedbackWidgetData} from '../../ShipmentDetails/Constants';
import CustomerFeedBack  from '../../../../components/LiveComponents/CustomerFeedBack';
import { buildLink, showToastr, removeDuplicates, isIncluded, buildDeepLink } from '../../utils';
import {processTextAndAppendElipsis} from '../../../../utils/misc';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {LogFBEvent, Events} from '../../../../Events';
import {Images} from '../../../../../assets/images';

class FeedBackShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
          activeId: null,
          productDetails: null,
          selectedOfferId: [],
          pressedIndex: null,
          requestFeedbackOrdersListCheck: null,
          sharedItems: [],
          isCompleted: false,
          isApiCalled: false
        };
      }

    componentDidMount() {
        const {CLTask,taskType, actionData} = this.props;
        
    }

    listEmptyComponent = () => {
        const {t, requestFeedbackOrdersCL, requestFeedbackOrders, CLTask} = this.props;
          return(
            <View style={{flex: 1, marginLeft: widthPercentageToDP(4), marginVertical: heightPercentageToDP(2)}}>
              <AppText size='L' bold>{t('Your Order List is Empty')}</AppText>
            </View>
          );
      }

    componentDidUpdate() {
    let requestFeedbackOrders = [];
    const {isApiCalled} = this.state;
    const {taskType, onCompleteTask, positiveFeedbacks,CLTask, userPreferences,isDone, widgetId, apiFetchedComplete, isExpanded, actionData} = this.props;
    if(taskType=='PositiveFeedback'){
        if(positiveFeedbacks && positiveFeedbacks.length && positiveFeedbacks.length>0)
        requestFeedbackOrders = [...positiveFeedbacks];
    } else {
      if(CLTask){
        if(this.props.requestFeedbackOrdersCL && this.props.requestFeedbackOrdersCL.length && this.props.requestFeedbackOrdersCL.length>0)
        requestFeedbackOrders = [...this.props.requestFeedbackOrdersCL];
      } else {
        if(this.props.requestFeedbackOrders && this.props.requestFeedbackOrders.length && this.props.requestFeedbackOrders.length>0)
        requestFeedbackOrders = [...this.props.requestFeedbackOrders];
      }

    }

    let userPrefData = {
      userId: userPreferences.uid,
      sid: userPreferences.sid,
    };

    if (isExpanded && !isApiCalled) {
      this.setState({
        sharedItems: actionData ? removeDuplicates(actionData) : [],
        isApiCalled: true
      })
      this.props.getRequestFeedback(CLTask ? 'CL':'USER', CLTask ? 'shipment':'order',1);
    }

    const {requestFeedbackOrdersListCheck, pressedIndex, selectedOfferId, isCompleted} = this.state;

        if (requestFeedbackOrders.length > 0 && !requestFeedbackOrdersListCheck) {
            this.setState({
                requestFeedbackOrdersListCheck: requestFeedbackOrders.map((y, index) => ({
                id: index + 1,
                data: y,
                isChecked: false
              }))
            })
          }

        if (pressedIndex !== null) {
            requestFeedbackOrdersListCheck[pressedIndex].isChecked = true;
            this.setState({
                pressedIndex: null
            })
        }

        if (this.props.requestFeedbackOrdersCL && this.props.requestFeedbackOrdersCL.length < 1 && !isCompleted && !isDone) {
          
          onCompleteTask({taskId: widgetId, actionId: null}, userPrefData, true)
          this.setState({
            isCompleted: true
          })
        }
    }

    onPressTask = (item, index) => {
      const {t, ChangeField,CLTask, onCompleteTask} = this.props;
      const {sharedItems} = this.state;
      if(CLTask){
          this.whatsappPress(item, index)
      } else {
        let {selectedOfferId} = this.state;
        const productDetails = {
                  "offerId": item.offerId,
                  "entityId": item.orderId,
                  "imageUrl": item.mediaJson.square,
                  "productName": {
                    text: item.mediaJson.title.text,
                    localizations: item.mediaJson.title.localizations
                  },
                  "price": item.price,
                  "offerPrice": item.offerPrice,
                  "description": {
                      text: item.mediaJson.description.text,
                      localizations: item.mediaJson.description.localizations
                  }
        }
        this.setState({
          productDetails: productDetails,
          pressedIndex: index
        })
        ChangeField('feedbackGiven', true);
      }
      
    }

    whatsappPress = async (item, index) => {
        const {t,groupSummary,userPreferences,taskType, CLTask, data, widgetId, requestFeedbackOrdersCL} = this.props;
        const {sharedItems} = this.state;
        const inviteToken = groupSummary.groupDetails.info.inviteToken;
        const url = await buildLink('FeedBackShare', 'CustomerFeedBack', inviteToken, item.shipmentId, userPreferences.uid, null,'ShipmentDetails');
        let name = item.name ? item.name : item.phoneNumber;
        let shareMsg = t(data.shareMessage, {
          NAME: name,
          DEEPLINKURL: url,
          NL: '\n'
        });

        let userPrefData = {
          userId: userPreferences.uid,
          sid: userPreferences.sid,
        };
        let eventPropsShareWhatsapp = {
          widgetId: widgetId,
          taskId: widgetId,
          component: 'FeedBackShare',
          sharedBy: userPreferences && userPreferences.userMode,
         };
        let eventProps = {taskId: widgetId, actionId: item.shipmentId}
        Linking.openURL(`whatsapp://send?phone=${`91${item.phoneNumber}`}&text=${encodeURIComponent(shareMsg)}`).then(() => {
          sharedItems.push(item.shipmentId);
          this.setState({
            pressedIndex: index,
            sharedItems: sharedItems
          })
          if (removeDuplicates(sharedItems).length === requestFeedbackOrdersCL.length) {
            this.props.onCompleteTask(eventProps, userPrefData, true)
          } else {
            this.props.onCompleteTask(eventProps, userPrefData)
          }
          LogFBEvent(Events.SHARE_OFFER_WHATSAPP_CLICK, eventPropsShareWhatsapp);
        });
      
      }

    renderItemList = (item, index) => {
        const {t, data, CLTask, taskType, pointsPerTask} = this.props;
        const {sharedItems} = this.state;
        let isSharedItem = sharedItems && item ? isIncluded(sharedItems, item.data.shipmentId) : false;
        
        return (
            <View style={{flexDirection:'row', padding: heightPercentageToDP(2), justifyContent: 'space-between'}}>
               <View>
                {CLTask ? (
                  <View >
                    <AppText>{`Delivered to `}<AppText bold>{item.data.name}</AppText></AppText>
                    <AppText size='XS'>{t(`Shipment-ID : #SHIPMENTID#`, {
                      SHIPMENTID : item.data.shipmentId
                    })}</AppText>
                  </View>
                ) : (
                <View style={{flexDirection: 'row', }}>
                <Image source={{uri: item.data.mediaJson.square}}
               style={{
                   height: scaledSize(43),
                   width: scaledSize(45),
                   resizeMode: 'contain',
               }}
          />
          <View style={{width: widthPercentageToDP(40), marginLeft: widthPercentageToDP(2), justifyContent: 'space-between'}}>
          <AppText bold  textProps={{numberOfLines: 1}} >{t(item.data.mediaJson.title.text)}</AppText> 
          <AppText size='XS' bold secondaryColor>{t(`Win #POINTSPERTASK# coins`, {POINTSPERTASK :pointsPerTask})}</AppText>
          <AppText size='XS'>{`Order-ID ${item.data.orderId}`}</AppText> 
          </View>
                </View>)}
                </View>
                <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={[styles.shareBtn, CLTask ? { backgroundColor: '#0dc143' } : { backgroundColor: Constants.primaryColor}]} onPress={() => {
                  if (!item.isChecked && !isSharedItem)
                    this.onPressTask(item.data, index)
                    }}>
                      {item.isChecked || isSharedItem ? (
                         <Icon
                         name="done"
                         type="material"
                         color={Constants.white}
                         size={widthPercentageToDP(4.5)}
                         containerStyle={{
                           alignSelf: 'center',
                         }}
                       />
                    ) :
                  CLTask ? <Image source={Images.whatsapp} style={styles.buttonImage} /> : null}
                  <AppText style={{marginLeft:widthPercentageToDP(1)}} white bold size='XS'>{CLTask ? t('Ask feedback'): t(data.button)}</AppText>
                </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() { 
        const {productDetails, requestFeedbackOrdersListCheck} = this.state;
        const {requestFeedbackOrders, t, feedbackGiven,CLTask, isRequestFeedbackLoading} = this.props;
        
        if (feedbackGiven && !CLTask) {
            return (
                <View style={{flex: 1}}>
            <CustomerFeedBack
                    userComponentData={productDetails}
                    itemData={feedbackWidgetData.data.widgetData}
                    widgetId={'lw-1'}
                    productData={productDetails}
                    wuserId={feedbackWidgetData.data.wuserId}
                    page={'CLTask'}
                    index={0}
                    isFeedBackShare
                    listItemIndex={0}
                    category={''}
                    widgetType={'customerFeedback'}
                    t={t}
                    />
                </View>
            );
        } else {
          if (isRequestFeedbackLoading) {
            return (
              <View style={{marginTop: heightPercentageToDP(2)}}>
              <ActivityIndicator color={Constants.black} size="large" style={{alignSelf: 'center', justifyContent: 'center'}}/>
              </View>
            )
          }
        return ( 
            <View style={{flex: 1}}>
                <FlatList
            data={requestFeedbackOrdersListCheck}
            extraData={this.state}
            renderItem={({item, index}) => this.renderItemList(item, index)}
            ListEmptyComponent={this.listEmptyComponent}
            />
            </View>
         );
        }
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: Constants.primaryColor,
        width: widthPercentageToDP(32),
        height: heightPercentageToDP(4.5),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    nameTextStyle: {
      width: widthPercentageToDP(18), 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginRight: widthPercentageToDP(2)
    },
    clButtonStyle: {
      backgroundColor: Constants.lightGreen,
      width: scaledSize(36),
      height: scaledSize(36),
      borderRadius: 36 / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shareBtn: {
      width: widthPercentageToDP(35),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: heightPercentageToDP(1),
      borderColor: '#0dc143',
      borderRadius: 4,
    },
    buttonImage: {
      height: scaledSize(15),
      width: 15,
      marginRight: 10,
      resizeMode: 'contain',
    },
})
 
const mapStateToProps = state => ({
    requestFeedbackOrders: state.clOnboarding.requestFeedbackOrders,
    requestFeedbackOrdersCL:state.clOnboarding.requestFeedbackOrdersCL,
    isRequestFeedbackLoading: state.clOnboarding.isRequestFeedbackLoading,
    positiveFeedbacks: state.clOnboarding.positiveFeedbacks,
    feedbackGiven: state.clOnboarding.feedbackGiven,
    groupSummary: state.groupSummary,
    userPreferences: state.login.userPreferences
  });
  
  const mapDispatchToProps = dispatch => ({
    dispatch,
    getRequestFeedback: (userType, mode, page) => {
      dispatch(getRequestFeedback(userType, mode, page));
    },
    getShareFeedback: (type,userType,page) => {
      dispatch(getShareFeedback(type,userType,page));
    },
    ChangeField: (key,value) => {
        dispatch(changeField(key,value));
      },
  });


export default withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(FeedBackShare)
  );
  