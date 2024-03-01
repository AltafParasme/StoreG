import {Constants} from '../../Constants';
import {Alert, ToastAndroid, Linking} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '@react-native-firebase/app';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import moment from 'moment';
import idx from 'idx';
// import ImagesMerge from 'react-native-images-merge';
import {orderStatusMap, trustMarkerLogoMap, profileMarkerLogoMap} from '../../Constants';
import Share from 'react-native-share';
import {processTextAndAppendElipsis} from '../../utils/misc';
import {liveAnalytics} from './ShopgLive/redux/actions';
import RNFetchBlob from 'rn-fetch-blob';
import {LogFBEvent, Events, ErrEvents, readUTMTags} from '../../Events';
import {AppConstants} from '../../Constants';

export const maxCharacters = 150;
export const maxCharactersCommets = 100;

export const minCharacters = 20;

export const showToastr = (
  mssg: string,
  duration?: number,
  position?: any,
  type?: any,
) => {
  ToastAndroid.show(
    mssg,
    duration ? duration : ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};

export const invokeDialler = (phoneNumber, eventProps)  => {
  Linking.openURL(`tel:${phoneNumber}`);
  LogFBEvent(Events.CL_MEMBER_PHONE_DIALING_CONTACT_CLICK, eventProps);
};

export const participators = summary => {
  let participatedUser = false;
  if (summary) {
    for (let element of summary) {
      if (element.isSelf) {
        participatedUser = true;
        break;
      }
    }
  }

  return participatedUser;
};

export const errResponse = (apiUrl, res, showLongToastr) => {
  LogFBEvent(ErrEvents.API_VALIDATION_ERROR, {
    api: apiUrl,
    errMsg: res.errMsg,
    isError: true,
    httpCode: 200,
  });
  let errorMsg = res && res.errMsg ? res.errMsg : 'Something went wrong!';
  if(Object.keys(res.errMsg).length === 0 && res.errMsg.constructor === Object){
    errorMsg = 'Something went wrong!';
  }
  showLongToastr
    ? showToastr(errorMsg, ToastAndroid.LONG)
    : showToastr(errorMsg);
};

export const startWhatsAppSupport = (userMode, fragment) => {
  const supportNumber = userMode == 'CL' ? AppConstants.supportCLWhatsAppNumber : AppConstants.supportWhatsAppNumber;

  Linking.openURL(
    `whatsapp://send?phone=${supportNumber}&text=https://sociofy.tech Welcome to Nyota support. Please call or write us on this number for any queries.`,
  );
  if (fragment) {
    if (fragment == 'shippingListHeader') {
      LogFBEvent(Events.SHIPPING_HEADER_WHATSAPP_SUPPORT_BUTTON_CLICK, null);
    } else if (fragment == 'shippingList') {
      LogFBEvent(Events.SHIPPING_WHATSAPP_SUPPORT_BUTTON_CLICK, null);
    } else if (fragment == 'UserProfile') {
      LogFBEvent(Events.USER_PROFILE_WHATSAPP_SUPPORT_BUTTON_CLICK, null);
    }
  }
};

export const memberContactWhatsapp = (clNumber, eventProps) => {
  Linking.openURL(`whatsapp://send?phone=${clNumber}`);
  LogFBEvent(Events.CL_MEMBER_WHATSAPP_CONTACT_CLICK, eventProps);
};

export const showAlert = (msg: string) => {
  Alert.alert(
    'Shop G',
    msg,
    [
      {
        text: 'OK',
        style: 'cancel',
      },
    ],
    {cancelable: false},
  );
};

export const shopGContact = {
  company: 'Nyota',
  emailAddresses: [
    {
      label: 'work',
      email: 'info@shopg.in',
    },
  ],
  familyName: 'Support',
  givenName: 'Nyota',
  jobTitle: 'Support',
  note: 'Nyota Support',
  urlAddresses: [
    {
      label: 'home',
      url: 'https://sociofy.tech',
    },
  ],

  phoneNumbers: [
    {
      label: 'mobile',
      number: '6366364447',
    },
  ],
  hasThumbnail: true,
  thumbnailPath: './android/app/src/main/res/mipmap-hdpi/ic_launcher.png',
};

export async function setData(key, value) {
  try {
    await AsyncStorage.setItem(key, value.toString());
  } catch (e) {
    // saving error
    console.log(e);
  }
}

export async function getData(key) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    // error reading value
    console.log(e);
  }
}

export async function removeData(key) {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (e) {
    // error reading value
    console.log(e);
  }
}

export async function shareToWhatsApp(
  source,
  medium,
  value = null,
  t,
  rewards,
  language,
  groupSummary,
  userPreference,
  fragment,
) {
  const {groupDetails} = groupSummary;
  const items = groupDetails.summary || [];
  const selfItem = items.filter(item => item.isSelf)[0] || {};
  const joiningBonus =
    rewards && rewards.rewardsInfo && rewards.rewardsInfo.joiningBonus;
  const offerEndDate = groupSummary.groupDetails.info.offerEndDate / 1000;
  const formattedDate = moment.unix(offerEndDate).format('LL');
  const userId = idx(userPreference, _ => _.uid);

  const inviteToken = groupSummary.groupDetails.info.inviteToken;
  const deepLinkUrl = await buildDeepLink(source, medium, inviteToken, userId, null);
  
  let shareMsg = '';
  let youtubeLink = '';

  //youtubeLink = encodeURI('https://youtu.be/IiArPcpiAoM')
  if (language === 'kannada') {
    youtubeLink = 'https://youtu.be/SXoDWCXXBLg';
  } else {
    youtubeLink = 'https://youtu.be/-Zq0e3dqCoM';
  }

  shareMsg = t(
    'Hi Friends,#NL##NL#Nyota is the best place to shop for great quality *branded & natural products* in skin care, haircare, makeup, wellness & much more at *prices you love*.#NL##NL#100% goodness, 100% natural#NL##NL#Products are reviewed by 1000+ Youtube and Instagram influencers of Beauty and Health#NL##NL#I have used some of the products and they are super amazing with visible benefits#NL##NL#Join Nyota and get *₹#JOININGBONUS# cashback on your first order.#NL##NL#*Limited Stock Only*#NL#*Hurry up and order now* #NL# #DEEPLINKURL# #NL# Offer expires on *#DATE#*',
    {
      YOUTUBELINK: youtubeLink,
      JOININGBONUS: joiningBonus,
      SAVEDAMOUNT: selfItem.saving || 100,
      DATE: formattedDate,
      DEEPLINKURL: deepLinkUrl,
      NL: '\n',
      interpolation: {escapeValue: false},
    },
  );

  // Code to share image
  Share.isPackageInstalled('com.whatsapp').then(({isInstalled}: any) => {
    if (isInstalled) {
      const shareOptions = {
        title: 'Share via',
        message: shareMsg,
        social: Share.Social.WHATSAPP, // country code + phone number(currently only works on Android)
        filename: 'test', // only for base64 file in Android
      };
      
      try {
        Share.shareSingle(shareOptions);
      } catch (error) {
        LogFBEvent(Events.SHARE_FAILURE, { component: fragment })
        console.error(error);
      }
    }
  });

  LogFBEvent(Events.SHARE_WHATSAPP_CLICK, value);
}

export async function martShareToWhatsApp(
  source,
  medium,
  eventProps,
  t,
  mallInfo,
  groupSummary,
  userPreference,
  rewards,
) {
  const youtubeLink = 'https://youtu.be/-Zq0e3dqCoM';
  const {groupDetails} = groupSummary;
  const items = groupDetails.summary || [];
  const selfItem = items.filter(item => item.isSelf)[0] || {};
  const userPrefDelivery = idx(userPreference, _ => _.slottedDelivery);
  const userId = idx(userPreference, _=>_.uid);
  const joiningBonus =
    rewards && rewards.rewardsInfo && rewards.rewardsInfo.joiningBonus;
  let orderBeforeDateMS = idx(userPrefDelivery, _ => _.orderBeforeDateMS);
  const groupTarget = groupDetails.info.bucketLimitEnd;
  const groupVal = groupDetails.info.groupOrderAmount;
  const martName = mallInfo || 'Nyota Savings' + ' Mart';
  const formattedDate = moment.unix(orderBeforeDateMS / 1000).format('LL');
  const inviteToken = groupSummary.groupDetails.info.inviteToken;
  const deepLinkUrl = await buildDeepLink(source, medium, inviteToken, userId, null);
  let shareMsg = '';
  shareMsg = t(
    "#YOUTUBELINK# #NL##NL#Hi Friends, Nyota is the best place for great quality products at prices you love. I have already saved *₹#SAVEDAMOUNT#* #NL##NL#Join my *Savings group* and get *₹#JOININGBONUS# joining bonus, expires in 24 hours*.#NL##NL#Join *#MARTNAME#* and get products delivered from *Nyota*.#NL##NL#*Limited Stock Only*#NL#*Hurry up and order now* #NL# #DEEPLINKURL# #NL# Offer expires on *#DATE#*",
    {
      YOUTUBELINK: youtubeLink,
      JOININGBONUS: joiningBonus,
      SAVEDAMOUNT: selfItem.saving || 100,
      GROUPVAL: groupVal || 100,
      GROUPTARGET: groupTarget || 3000,
      MARTNAME: martName || 'Nyota Savings Mart',
      DATEWITHOUTYEAR: formattedDate,
      DATE: formattedDate,
      DEEPLINKURL: deepLinkUrl,
      NL: '\n',
      interpolation: {escapeValue: false},
    },
  );

  // Code to share image
  Share.isPackageInstalled('com.whatsapp').then(({isInstalled}: any) => {
    if (isInstalled) {
      const shareOptions = {
        title: 'Share via',
        message: shareMsg,
        social: Share.Social.WHATSAPP, // country code + phone number(currently only works on Android)
        filename: 'test', // only for base64 file in Android
      };
      try {
        Share.shareSingle(shareOptions);
      } catch (error) {
        LogFBEvent(Events.SHARE_FAILURE, null)
        console.error(error);
      }
    }
  });
  LogFBEvent(Events.SHARE_WHATSAPP_CLICK, eventProps);
}

// whatsapp share for CL tasks
export async function shareToWhatsAppCLTasks(
  clBigLogoImage,
  value,
  t,
  shareMsg,
  youtubeLink,
  type,
  imgUrl,
  completeTaskEvent,
  userProps,
  userNumber,
  taskType,
  usersToShare,
  avatarData,
  actionId,
) {
  let mssg = t(`#TEXT# #NL# #NL# #LINK#`, {
    TEXT: shareMsg,
    NL: '\n',
    LINK: youtubeLink,
  });
  let shareOptions = {};
  if(type === 'CL_TASK' || type === 'CL_BANNER_TASK') {
    LogFBEvent(Events.SHARE_WHATSAPP_CL_TASK_CLICK, value);
  } else {
    LogFBEvent(Events.SHARE_WHATSAPP_CLICK, value);
  }
  if (userNumber) { 
    shareOptions['whatsAppNumber'] = userNumber; 
  }
  const fs = RNFetchBlob.fs;
  let imagePath = [];
  let output = [];
  imagePath = imgUrl ? imagePath.concat(imgUrl) : null;
  if (imagePath && imagePath.length) {
    let Pictures = imagePath.map((item, index) =>
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', item)
        .then(resp => {
          let base64s = RNFetchBlob.fs
            .readFile(resp.data, 'base64')
            .then(async data => {
              if(clBigLogoImage) {
                ImagesMerge.mergeImages([{
                  uri:`data:image/jpeg;base64,${data}`,
                }, { uri: `data:image/jpeg;base64,${clBigLogoImage}` }], (result) => { 
                   
                  if(index == (imagePath.length - 1)) {
                    output[index] = `data:image/jpeg;base64,${result}`;
                    let shareOptions = {
                      ...shareOptions,
                      title: 'Share via',
                      urls: output,
                      message: mssg,
                      social: Share.Social.WHATSAPP,
                    };
                    Share.shareSingle(shareOptions).then((res) => {
                      if (type === 'CL_TASK') {
                        //usersToShare.every(userid => avatarData.includes(userid)); //check for all userIds
                        let data = avatarData ? avatarData : [];
                        data.push(actionId);
                        if(usersToShare.length >=1){
                          let found = 0;
                          for (var i = 0; i < usersToShare.length; i++) {
                            if (data.indexOf(usersToShare[i].id) > -1) {
                                found++;
                            }
                          }
                          if(found >= (usersToShare.length - 1))
                            completeTaskEvent(value, userProps, true);
                          else 
                            completeTaskEvent(value, userProps);  
                        }
                        else {
                        completeTaskEvent(value, userProps);
                        }
                      }
                      if(type === 'EARN_COINS') {
                        completeTaskEvent(value, userProps)
                      }
                    });
                  }else {
                    output[index] = `data:image/jpeg;base64,${result}`;
                  }
                });
              }
              else {
                return `data:image/jpeg;base64,${data}`;
              }
            });
              
            return base64s;
        }),
    );

    Promise.all(Pictures).then(completed => {
      shareOptions = {
        ...shareOptions,
        title: 'Share via',
        urls: completed,
        message: mssg,
        social: Share.Social.WHATSAPP,
      };
      

      Share.shareSingle(shareOptions).then((res) => {
        if (type === 'CL_TASK') {
          //usersToShare.every(userid => avatarData.includes(userid)); //check for all userIds
          let data = avatarData ? avatarData : [];
          data.push(actionId);
          if(usersToShare.length >=1){
            let found = 0;
            for (var i = 0; i < usersToShare.length; i++) {
              if (data.indexOf(usersToShare[i].id) > -1) {
                  found++;
              }
            }
            if(found >= (usersToShare.length - 1))
              completeTaskEvent(value, userProps, true);
            else 
              completeTaskEvent(value, userProps);  
          }
          else {
          completeTaskEvent(value, userProps);
          }
        }
        if(type === 'EARN_COINS') {
          completeTaskEvent(value, userProps)
        }
       });
    });
    return fs.unlink(Pictures);
  }
  Share.isPackageInstalled('com.whatsapp').then(({isInstalled}: any) => {
    if (isInstalled) {
      shareOptions = {
        ...shareOptions,
        title: 'Share via',
        message: mssg,
        social: Share.Social.WHATSAPP, // country code + phone number(currently only works on Android)
        filename: 'test', // only for base64 file in Android
      };
      try {
        Share.shareSingle(shareOptions).then((res) => { 
          if (type === 'CL_TASK') {
            //usersToShare.every(userid => avatarData.includes(userid)); //check for all userIds
            let data = avatarData ? avatarData : [];
            data.push(actionId);
            if(usersToShare.length >=1){
              let found = 0;
              for (var i = 0; i < usersToShare.length; i++) {
                if (data.indexOf(usersToShare[i].id) > -1) {
                    found++;
                }
              }
              if(found >= (usersToShare.length - 1))
                completeTaskEvent(value, userProps, true);
              else 
                completeTaskEvent(value, userProps);  
            }
            else {
            completeTaskEvent(value, userProps);
            }
          }
          if(type === 'EARN_COINS') {
            completeTaskEvent(value, userProps)
          }
         });
      } catch (error) {
        LogFBEvent(Events.SHARE_FAILURE, null)
        console.error(error);
      }
    }
  });
 
}

export function removeDuplicates(data) {
  return data.filter((value, index) => data.indexOf(value) === index);
}


export async function shareDhamakaSalesinGroup (
  source,
  medium,
  t,
  item,
  groupSummary,
  dhamakaCashbackDetails,
  userPref,
  eventProps,
  userPrefData,
  onCompleteTask,
  isTaskMarkedComplete
) {
  const offerTotalOrderLimit = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_TOTAL_ORDER_LIMIT);
  const offerCashbackMax = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_CASHBACK_MAX);
  const offerCashbackPercent = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_CASHBACK_PERCENT);
  const offerEndDate = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_END_DATE);
  const formattedEndDate = moment(offerEndDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('Do');
  const formattedEnDateMonth = moment(offerEndDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('MMM');

  const uid = userPref.uid;
  const inviteToken = groupSummary.groupDetails.info.inviteToken;
  const deepLinkUrl = await buildDeepLink(source, medium, inviteToken, uid, null);
  
  const fs = RNFetchBlob.fs;
  let sharedItems = [];
  let shareMsg = t(
      'Dhamaka Cashback offer is running in Nyota - *Flat #OFFERCASHBACKPERCENT#% cashback*.#NL##NL#Buy any products of worth ₹#OFFERTOTALORDERLIMIT# in this month to get *₹#OFFERCASHBACKMAX# cashback*. You can place multiple orders in the month till *#FORMATTEDENDDATE# #FORMATTEDENDDATEMONTH#* to reach *₹#OFFERTOTALORDERLIMIT#*.#NL##NL##DEEPLINKURL##NL##NL#Limited time offer, Buy now to get ₹#OFFERCASHBACKMAX# cashback.',
      {
        OFFERTOTALORDERLIMIT: offerTotalOrderLimit,
        OFFERCASHBACKMAX: offerCashbackMax,
        OFFERCASHBACKPERCENT: offerCashbackPercent,
        DEEPLINKURL: deepLinkUrl,
        FORMATTEDENDDATE: formattedEndDate,
        FORMATTEDENDDATEMONTH: formattedEnDateMonth,
        NL: '\n',
      },
    );

  let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', `http://cdn.shopg.in/shopg_live/${formattedEnDateMonth}/flat-30-cb.png`)
      .then(resp => {
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(base64Data => {
        Share.isPackageInstalled('com.whatsapp').then(
          ({isInstalled}: any) => {
            if (isInstalled) {
              const shareOptions = {
                title: 'Share via',
                message: shareMsg,
                url: `data:image/png;base64,${base64Data}`,
                social: Share.Social.WHATSAPP,
                filename: 'test',
              };
              try {
                Share.shareSingle(shareOptions);
               
                if (medium === 'SharePositiveFeedback' && item) {
                  sharedItems.push(item.userid);
                if (removeDuplicates(sharedItems).length === dhamakaCashbackDetails.cashbackUsers.length) {
                  onCompleteTask(eventProps, userPrefData, true)
                  isTaskMarkedComplete()
                } else {
                  onCompleteTask(eventProps, userPrefData)
                }
              }
              } catch (error) {
                LogFBEvent(Events.SHARE_FAILURE, null);
                console.error(error);
              }
            }
          }
        );
        return fs.unlink(imagePath);
      });
 LogFBEvent(Events.SHARE_WHATSAPP_DHAMAKA_CLICK, null);
}

export const getPaymentMode = (paymentMode) => {
  let visibleMode;
  switch(paymentMode) {
      case 'COD':
        visibleMode = 'Pay on Delivery'
        break;
      case 'ONLINE':
        // code block
        visibleMode = 'Online'
        break;
      default:
        // code block
  }
  return visibleMode;
}

export async function shareOfferOnWhatsApp (
  clMediumLogoImage,
  source,
  medium,
  t,
  groupSummary,
  item,
  eventProps,
  type,
  coins,
  userPrefData,
  callback
) {
  let description = null;
  let name = null;
  let offerId, price, youtubeLink, offerPrice, saving = null
  const inviteToken = groupSummary.groupDetails.info.inviteToken;
  let shareMsg = '';
  if (type === 'GroupOrderOverlay') {
      description = item.mediaJson.description.text;
      name = item.mediaJson.title.text;
      offerId = item.offerId;
      price = item.mrpamount;
      offerPrice = item.offerprice;
      saving = item.saving;
      youtubeLink = item.mediaJson.youTubeVideo && item.mediaJson.youTubeVideo[0].url;
  } else {
    description = item.description;
    name = item.name;
    offerId = item.offerinvocations.offerId;
    price = item.offerinvocations.price;
    offerPrice = item.offerinvocations.offerPrice;
    saving = price - offerPrice;
    youtubeLink = item.mediaJson.youTubeVideo && item.mediaJson.youTubeVideo[0].url;
  }
 
  const descToShare = processTextAndAppendElipsis(description, 50);
  
  const url = await buildLink(source, medium, inviteToken, offerId, userPrefData.userId, eventProps.taskId, 'Booking');
  
  let mssg = youtubeLink ? '#YOUTUBELINK##NL##NL#Hi Friends,#NL#I found this awesome product with a great offer.#NL##NL#*#NAME#*#NL##NL##DESCRIPTION##NL#MRP ~₹#PRICE#~ ₹#OFFERPRICE#, *Saving ₹#SAVING#*#NL##NL##URL##NL##NL#*Hurry up and order now*☝️☝️#NL#*Limited stock only*' : 'Hi Friends,#NL#I found this awesome product with a great offer.#NL##NL#*#NAME#*#NL##NL##DESCRIPTION##NL#MRP ~₹#PRICE#~ ₹#OFFERPRICE#, *Saving ₹#SAVING#*#NL##NL##URL##NL##NL#*Hurry up and order now*☝️☝️#NL#*Limited stock only*'
  shareMsg = t(
    mssg,
    {
      YOUTUBELINK: youtubeLink,
      URL: url,
      NAME: name,
      PRICE: price,
      OFFERPRICE: offerPrice,
      SAVING: saving,
      DESCRIPTION: descToShare,
      NL: '\n',
    },
  );

  // Code to share image
  const fs = RNFetchBlob.fs;
  let imagePath = item.mediaJson.square;

  if (imagePath) {
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', imagePath)
      .then(resp => {
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(base64Data => {
        if(clMediumLogoImage) {
          ImagesMerge.mergeImages([{
            uri: `data:image/jpeg;base64,${base64Data}`,
          }, { uri: `data:image/jpeg;base64,${clMediumLogoImage}` }],
          (result) => {
            Share.isPackageInstalled('com.whatsapp').then(
              ({isInstalled}: any) => {
                if (isInstalled) {
                  const shareOptions = {
                    title: 'Share via',
                    message: shareMsg,
                    url: `data:image/png;base64,${result}`,
                    social: Share.Social.WHATSAPP,
                    filename: 'test',
                  };
                  try {
                    Share.shareSingle(shareOptions).then(() => {
                      callback();
                      if(coins) {
                        setTimeout(() => {
                          showToastr(t('Coins credited when link opened'));
                        }, 200)
                      }  
                    });
                  } catch (error) {
                    callback();
                    LogFBEvent(Events.SHARE_FAILURE, null);
                    console.error(error);
                  }
                }
              },
            );    
          })
        }
        else {
          Share.isPackageInstalled('com.whatsapp').then(
            ({isInstalled}: any) => {
              if (isInstalled) {
                const shareOptions = {
                  title: 'Share via',
                  message: shareMsg,
                  url: `data:image/png;base64,${base64Data}`,
                  social: Share.Social.WHATSAPP,
                  filename: 'test',
                };
                try {
                  Share.shareSingle(shareOptions).then(() => {
                    callback();
                    if(coins) {
                      setTimeout(() => {
                        showToastr(t('Coins credited when link opened'));
                      }, 200)
                    }  
                  });
                } catch (error) {
                  callback();
                  LogFBEvent(Events.SHARE_FAILURE, null);
                  console.error(error);
                }
              }
            },
          );
        }
        
        return fs.unlink(imagePath);
      });
  }
  LogFBEvent(Events.SHARE_OFFER_WHATSAPP_CLICK, eventProps);
};

export function getOrderStatus(backendOrderStatus) {
  if (orderStatusMap.hasOwnProperty(backendOrderStatus)) {
    return orderStatusMap[backendOrderStatus].label;
  } else {
    return backendOrderStatus;
  }
}

export function getOrderStatusColor(backendOrderStatus) {
  if (orderStatusMap.hasOwnProperty(backendOrderStatus)) {
    return orderStatusMap[backendOrderStatus].color;
  } else {
    return 'transparent';
  }
}

export function isIncluded(array, element) {
  return array.includes(element)
}

export function getTrustMarkerLabel(trustMarker) {
  if (trustMarkerLogoMap.hasOwnProperty(trustMarker)) {
    return trustMarkerLogoMap[trustMarker].label;
  } else {
    return null;
  }
}

export function getProfileMarkerLabel(profileMarker) {
  if (profileMarkerLogoMap.hasOwnProperty(profileMarker)) {
    return profileMarkerLogoMap[profileMarker].label;
  } else {
    return null;
  }
}

export function getCategoryIndex(list, category, fallbackCategory) {
  if (!list || !list.length || !category) return null;

  let index = list.findIndex(element => {
    if (element.slug == category) return true;
  });

  if (index >= 0) return index;

  let fallbackIndex = list.findIndex(element => {
    if (element.slug == fallbackCategory) return true;
  });

  if (fallbackIndex >= 0) return fallbackIndex;
  return 0;
}

export function getListofCategories(list) {
  if(!list) return null;

  let result = '';
  list.forEach((element) => {
    element.mediaJson.categories.forEach(item => {
      result += `${(item.name)} `
    })
    
  });
  return result;
}

export const listOfCustomerIncensitiveOrderStatus = [
  'Order Delivered',
  'Order Returned',
  'Order RTO',
  'Order Cancelled',
  'Order Refund',
  'Customer not reachable : Order Cancelled',
  'Offer Expired',
];

export const listOfStepsCL = [
  'Buy a starter-kit & become a community leader',
  'Get your super-market with your name',
  'Start sharing app with your friends',
  'Get them to order on app with lowest prices, lot of free gifts on every order',
  'Nyota delivers at one common place',
  'Co-ordinate with friends & collect payment',
  'Get your commission on your total orders',
];

export const listOfValidRoutes = route => {
  const list = [
    'Home',
    'Search',
    'MyRewards',
    'MyOrderBusinessCheckout',
    'UserProfile',
    'TagsItems',
    'Booking',
    'ConfirmBooking',
    'OrderConfirmation',
    'PastOrders',
    'Rewards',
    'ReturnPolicy',
    'ForceUpdate',
    'AddressPincode',
    'OrderDetail',
    'FreeGift',
    'CartDetail',
    'CLBusiness',
    'ShippingList',
    'ShipmentDetails',
    'CLOnboarding',
    'QRContainer',
    'ViewQrCode',
    'ImageView',
    'CLAccount',
    'VerticleVideoList',
    'ScratchCardList',
    'Community',
    'PostDetails'
  ];
  if (list.indexOf(route) > -1) return true;
  return false;
};

/*Use below fn to build page specific deeplink*/
export const buildLink = async (source, medium, inviteToken, offerId, userId, taskId,action) => {
  if(!offerId && !inviteToken)
    return null;

  let derivedAction = action ? action: 'Booking';
  let dl = `https://shopg.in/dl?utm_source=${source}&utm_medium=${medium}&inviteToken=${inviteToken}&action=${derivedAction}&actionId=${offerId}&userId=${userId}`;
  if(taskId) {
    dl += `&taskId=${taskId}`
  }
  const link = await dynamicLinks().buildShortLink({
    link: dl,
    domainUriPrefix: 'https://shopg.page.link',
    android: {
      packageName: 'com.sociofy.tech.nyota',
      minimumVersion: '19',
    }
  },
    firebase.dynamicLinks.ShortLinkType.UNGUESSABLE,
  );

  return link;
}

/*Use below fn to build generic deeplink*/
export const buildDeepLink = async(source, medium, inviteToken, userId, taskId) => {
  let dl = `https://shopg.in/dl?utm_source=${source}&utm_medium=${medium}&inviteToken=${inviteToken}&userId=${userId}`;
  if(taskId) {
    dl += `&taskId=${taskId}`
  }
  
  const link = await dynamicLinks().buildShortLink({
    link: dl,
    domainUriPrefix: 'https://shopg.page.link',
    android: {
      packageName: 'com.sociofy.tech.nyota',
      minimumVersion: '19',
    }
  },
    firebase.dynamicLinks.ShortLinkType.UNGUESSABLE,
  );

  return link;
}

export const getTimeRemainingInDay = () => {
  let now = moment();
  let cutOffTime = now.endOf('day').toString();

  let timeRemaining =
    moment
      .duration(moment(cutOffTime).diff(moment(new Date())))
      .valueOf() / 1000;

  return timeRemaining;
}


export const getRandomArbitrary = (min: number, max: number) => {
  let result =  Math.random() * (max - min) + min;
  return result.toFixed(1);
}

export const dummyRating = [3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5,4.6,4.7];
export const getLastDigit = (data) => {
  let lastone = +data.toString().split('').pop();
  return lastone;
}

