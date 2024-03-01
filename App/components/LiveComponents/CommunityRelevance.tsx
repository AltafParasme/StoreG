import React, { Component } from 'react';
import { View , StyleSheet, TouchableOpacity, ImageBackground, Text, FlatList, TextInput, Image} from 'react-native';
import { heightPercentageToDP, widthPercentageToDP, scaledSize } from '../../utils';
import DataList from './DataList';
import {AppText} from '../Texts';
import CommunityModal from '../../native/pages/Community/Components/CommunityModal';
import {Icon} from 'react-native-elements';
import Modal from 'react-native-modal';
import {withTranslation} from 'react-i18next';
import moment from 'moment';
import {connect} from 'react-redux';
import NavigationService from '../../utils/NavigationService';
import { Constants } from '../../styles';
import CommentSection from '../../native/pages/Community/Components/CommentSection';
import CommunityAction from './CommunityAction';
import { Images } from '../../../assets/images';
import UsersDetails from '../../native/pages/Community/Components/UsersDetails';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import CommunityDataList from './CommunityRelevanceComponents/CommunityDataList';
import CommunityBanner from '../../native/pages/Community/Components/CommunityBanner';
import { LogFBEvent, Events } from '../../Events';
import { liveAnalytics } from '../../native/pages/ShopgLive/redux/actions';
import { changeField } from '../../native/pages/ShopgLive/redux/actions';
import { currentUser } from '../../native/pages/UserProfile/actions';
import idx from 'idx';

const commentedPeople = [
  {
      id: 1,
      name: 'Aritro Saha',
      emoticon: '😍',
      comment: 'Nice! Kaafi sahi raha is baar ka.'

  },
  {
      id: 2,
      name: 'Divye',
      emoticon: '😍',
      comment: 'Nice! '

  },
  {
      id: 2,
      name: 'Shiv',
      emoticon: '😍',
      comment: 'Wow predictions!'

  }
]

class CommunityRelevance extends Component {
  constructor() {
    super();
    this.commonShareFn = this.commonShareFn.bind(this);
  }
  state = {
    isReactionOpened: false,
    indexCarousel: 0,
    isCommunityActionPressed: false
  }



  componentDidMount() {
    const {comment, widgetId} = this.props;
    if (!this.props.userProfile.user)
      this.props.getCurrentUser();
      let widgetComment  = {
        [widgetId] : commentedPeople
      };
      comment.push(widgetComment)
      this.props.onChangeField('comment', comment);
  }

  onPressReaction = (reaction) => {
    this.props.onChangeField('communityRelevanceReaction', reaction);
    this.closeModal()
}


  closeModal = () => {
    this.setState({isReactionOpened: false});
  };

  closeCommunityActionModal = () => {
    this.setState({isCommunityActionPressed: false});
  };

  openCommunityModal = (index = 0) => {
    this.setState({isCommunityActionPressed: true, indexCarousel: index});
  }


  onChangeComment = (recentComment, id) => {
  //   const {comment, userProfile, communityRelevanceReaction} = this.props;
   
    

  // comment.map(val => {
  //   if (Object.keys(val).toString() === id) {
  //     val[id] = [{
  //       id: comment.length,
  //       name: userProfile.user.name,
  //       emoticon: communityRelevanceReaction,
  //       comment: recentComment
  //     }].concat(val[id])
  //   }
  // })
  //   this.props.onChangeField('comment', comment);
  }



  commonShareFn = (mssg) => {
    const {widgetId, page, position, category, widgetType, userPref } = this.props;
    const userMode = idx(this.props.userPref, _ => _.userMode);
    const clType = idx(this.props.clDetails, _ => _.clConfig.clType);
    let eventProps = {
      taskId: 20
    };

    let userPrefData = {
      userId: userPref && userPref.uid,
      sid: userPref && userPref.sid,
    };
    Share.isPackageInstalled('com.whatsapp').then(({isInstalled}: any) => {
      if (isInstalled) {
        const shareOptions = {
          title: 'Share via',
          message: mssg,
          social: Share.Social.WHATSAPP, // country code + phone number(currently only works on Android)
          filename: 'test', // only for base64 file in Android
        };
        try {
          LogFBEvent(Events.SHARE_OFFER_WHATSAPP_CLICK, eventProps)
          this.props.onAnalytics(Events.SHARE_WHATSAPP_CL_TASK_CLICK.eventName(), eventProps, userPrefData);
          Share.shareSingle(shareOptions);
        } catch (error) {
          LogFBEvent(Events.SHARE_FAILURE, null)
          this.props.onAnalytics(Events.SHARE_FAILURE.eventName(), eventProps, userPrefData);
          console.error(error);
        }
      }
    });
  }

  videoClick = (index, isVideo) => {
    const {dispatch, video, widgetId, widgetType, page, category, itemData} = this.props;
    let title=itemData ? itemData.title : '';
    let listToShow = [];
    if (isVideo) {
      listToShow = [isVideo]
    }
   
    dispatch({
      type: 'shopglive/SET_STATE',
      payload: {
        videoShowOfferList: listToShow,
        selectedVideoIndex: index
      },
    });

   let isVideoRelevance = isVideo ? true : false;
    NavigationService.navigate('VerticleVideoList', {
      selectedTagSlug:  itemData.tags && itemData.tags[0].slug,
      isVideoRelevance: isVideoRelevance,
      title:title,
      noCart: true,
      widgetId: widgetId,
      widgetType: widgetType,
      page: page,
      category: category
    });
  };
 

    onOverlayPress = () => {
        const {
          itemData,
          category,
          page,
          widgetId,
          widgetType,
          index,
        } = this.props;
    
        const title=itemData ? itemData.title : 'Flash Sales';
        const selectedTag=itemData ? itemData.tags[0] : '';
    
        const selectedSlug = (selectedTag && selectedTag.slug) ? selectedTag.slug : '';
    
        const diffCounter = moment.duration(moment((selectedTag.endTime && selectedTag.endTime!='') ? selectedTag.endTime : '06:00:00 PM','HH:mm:ss a').diff(moment((selectedTag.startTime && selectedTag.startTime!='') ? selectedTag.startTime : '03:00:00 PM','HH:mm:ss a'))).valueOf();
        const dealCounter = moment.duration(moment((selectedTag.endTime && selectedTag.endTime!='') ? selectedTag.endTime : '06:00:00 PM','HH:mm:ss a').diff(moment(new Date(),'HH:mm:ss a'))).valueOf();
    
        let flashSalesState = (dealCounter<0) ? 'past' : (dealCounter>diffCounter) ? 'future' : 'present'; 
        let screenName = (flashSalesState=='past' || flashSalesState=='future') ? 'InactiveFlashSales' : 'ActiveFlashSales';
    
        LogFBEvent(Events.SHOPG_LIVE_WIDGET_HEADER_CLICK, {
          slug: selectedSlug,
          category: category,
          widgetId: widgetId,
          position: index,
          widgetType: widgetType,
          page: page,
          component: 'CommunityRelevance'
        });
    
        NavigationService.navigate('TagsItems', {
          screen: screenName,
          title: title,
          selectedtagSlug: selectedSlug,
        });
      };

      render() {
    const {
      t, 
      itemData, 
      category, 
      page, 
      widgetId, 
      widgetType, 
      index, 
      listItemIndex,
      backgroundColor,
      language,
      userProfile,
      } = this.props;

    const tag = itemData.tags && itemData.tags[0];
    const shareMessage = itemData.shareMsg ? itemData.shareMsg : 'Hello Text';
    let participatedUsers = itemData && itemData.summary && itemData.summary.action && itemData.summary.action.share && itemData.summary.action.share.users ? itemData.summary.action.share.users : [];
    // const comment = itemData && itemData.data && itemData.data.comments ? itemData.data.comments : [];
    const comment = [{name:'Shop G'}];
    const summaryActions = itemData && itemData.summary && itemData.summary.action;
    const sharesCount = summaryActions && summaryActions.share && summaryActions.share.total ? summaryActions.share.total : 0;
    const reactionsCount = summaryActions && summaryActions.reaction && summaryActions.reaction.total ? summaryActions.reaction.total : 0;
    const commentsCount = summaryActions && summaryActions.comments && summaryActions.comments.total ? summaryActions.comments.total : 0;

    const { user } = userProfile;
    const correctAnswer = itemData.communityActionAnswer;
    const beforeText = itemData.beforeText;
    const beforeMediaJson = itemData.beforeMediaJson;
    const afterMediaJson = itemData.afterMediaJson;

    return (
      <View style={{flex: 1, paddingBottom: heightPercentageToDP(2)}}>
        <View style={{marginTop: heightPercentageToDP(2)}}>
          <View style={{paddingHorizontal: widthPercentageToDP(4)}}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              {itemData.title}
            </Text>
            <UsersDetails participatedUsers={participatedUsers} t={t} topText={itemData.topText} />
          </View>
          {tag ? (
            <View
              style={[styles.dataListView, {backgroundColor: itemData.backgroundColor}]}>
              <DataList
                heightDP={33}
                isHorizontal={false}
                selectedTag={tag}
                position={listItemIndex ? listItemIndex : 0}
                widgetType={widgetType}
                category={category}
                page={page}
                isCommmunityRelevance={true}
                widgetId={widgetId}
                screenName="relevance"
                endItemPress={() => this.onOverlayPress('communityRelevance')}
              />
            </View>
          ) :  itemData.CommunityActionList === 'itemDataList' ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <CommunityDataList 
              dataBackgroundColor={itemData.dataBackgroundColor}
              data={itemData.communityActionData} 
              onPressItems={this.openCommunityModal}/>
              </View>
          ) : 
          itemData.CommunityActionList === 'itemDataBanner' ? (
            <CommunityBanner 
            image={itemData.dataBackgroundImage}
             correctAnswer={correctAnswer} 
             comment={comment}
             widgetId={widgetId}
             widgetType={widgetType}
             category={category}
             beforeText={beforeText}
             beforeMediaJson={beforeMediaJson}
             afterMediaJson={afterMediaJson}
             language={language}
             videoClick={this.videoClick}
             />
          )
          :null}



          <View
            style={{
              alignItems: 'center',
              marginVertical: heightPercentageToDP(2),
            }}>
            {itemData.CommunityActionList !== 'itemDataBanner' ? (
            <TouchableOpacity
            onPress={() => {
              if (itemData.buttonAction === 'showCommunityActionData') {
                this.openCommunityModal()
              }
              }}
              style={styles.buttonStyle}>
              <AppText white>{t('Show My Horoscope')}</AppText>
              <View style={{flexDirection: 'row'}}>
                <AppText white>{t('Get')}</AppText>
                <Image source={Images.coin} style={styles.coinsImage} />
                <AppText white>{t(itemData.communityActionCoins)}</AppText>
              </View>
            </TouchableOpacity>) : null}

          <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity 
                  onPress={() => this.commonShareFn(shareMessage)}
                  style={styles.outerCircle}>
                    <View style={styles.innerCircle}>
                    <Icon
                  name={'whatsapp'}
                  type={'font-awesome'}
                  color={'white'}
                  size={16}
                  style={{marginTop: heightPercentageToDP(0.4)}}
                /> 
                    </View>
                 
                  </TouchableOpacity>
             
                    <View style={{marginLeft: widthPercentageToDP(2)}}>
                    <AppText size='XS' style={{marginBottom: heightPercentageToDP(0.4)}}>{t(`${sharesCount} shares`)}</AppText>
                    <View style={{flexDirection: 'row'}}>
                    <AppText size='XXS'>{t('Get')}</AppText>
                    <Image source={Images.coin} 
                    style={styles.sharesCoins} />
                    <AppText size='XXS'>{t(itemData.communityActionCoins)}</AppText>
                    </View>
                    
                    </View>
                </View>

                <TouchableOpacity 
                onPress={() => this.setState({
                  isReactionOpened: true
                })}
               
                style={{flexDirection: 'row', marginLeft: widthPercentageToDP(3)}}>
                  <View style={styles.reactionMainView}>
                 <AppText size='M' style={{marginTop: heightPercentageToDP(0.3), marginBottom: heightPercentageToDP(0.4)}}>{this.props.communityRelevanceReaction}</AppText>
                  </View>
             
                    <View style={{marginLeft: widthPercentageToDP(2)}}>
                    <AppText size='XS'>{t(`${reactionsCount} Reactions`)}</AppText>
                    <View style={{flexDirection: 'row'}}>
                    <AppText size='XXS'>{t('Get')}</AppText>
                    <Image source={Images.coin} style={styles.reactionsCoins} />
                    <AppText size='XXS'>{t(itemData.communityActionCoins)}</AppText>
                    </View>
                    
                    </View>
                </TouchableOpacity>

                <View style={{flexDirection: 'row', marginLeft: widthPercentageToDP(3)}}>
                  <View style={styles.commentsMainView}>
                 <Icon
                  name={'commenting'}
                  type={'font-awesome'}
                  color={'black'}
                  size={24}
                  style={{marginTop: heightPercentageToDP(0.5)}}
                /> 
                  </View>
                    <View style={{marginLeft: widthPercentageToDP(2)}}>
                    <AppText size='XS' style={{marginBottom: heightPercentageToDP(0.4)}}>{t(`${commentsCount} Comments`)}</AppText>
                    <View style={{flexDirection: 'row'}}>
                    <AppText size='XXS'>{t('Get')}</AppText>
                    <Image source={Images.coin} style={styles.commentsCoins} />
                    <AppText size='XXS'>{t(itemData.communityActionCoins)}</AppText>
                    </View>
                    </View>
                </View>
          </View>

          </View>
        </View>
        {/* <CommentSection 
        onChangeComment={this.onChangeComment} 
        user={user} 
        commentedPeople={comment}
        widgetId={widgetId}
        /> */}
        <Modal
            isVisible={this.state.isReactionOpened}
            onBackdropPress={this.closeModal}
            onRequestClose={() => {
              this.closeModal();
            }}>
        <CommunityModal onPressReaction={this.onPressReaction}/>
        
        </Modal>

        <Modal
        isVisible={this.state.isCommunityActionPressed}
        onBackButtonPress={this.closeCommunityActionModal}
        >
          <CommunityAction 
          indexCarousel={this.state.indexCarousel}
          closeCommunityActionModal={this.closeCommunityActionModal}
          communityActionData={itemData.communityActionData}
          communityActionCoins={itemData.communityActionCoins}
          commonShareFn={this.commonShareFn}
          shareMessage={shareMessage}
          />
        </Modal>
      </View>
    );
}
}

const styles = StyleSheet.create({
  sharesCoins: {
    height: scaledSize(12),
    width: scaledSize(12),
    top: heightPercentageToDP(0.2),
    marginHorizontal: widthPercentageToDP(1.5)
  },
  reactionMainView: {
    height: scaledSize(30),
    width: scaledSize(30),
    borderRadius: 60 / 2,
    backgroundColor: Constants.primaryColor,
    alignItems: 'center'
  },
  reactionsCoins: {
    height: scaledSize(12),
    width: scaledSize(12),
    top: heightPercentageToDP(0.2),
    marginHorizontal: widthPercentageToDP(1.5)
  },
  commentsMainView: {
    height: scaledSize(32),
    width: scaledSize(32),
    borderRadius: 64 / 2,
    backgroundColor: '#e4e4e4',
    alignItems: 'center'
  },
  dataListView: {
    justifyContent: 'center',
                paddingTop: heightPercentageToDP(2),
                height: heightPercentageToDP(35),
  },
  coinsImage: {
    height: scaledSize(12),
    width: scaledSize(12),
    top: heightPercentageToDP(0.5),
    marginHorizontal: widthPercentageToDP(3)
  },
  commentsCoins: {
    height: scaledSize(12),
    width: scaledSize(12),
    top: heightPercentageToDP(0.2),
    marginHorizontal: widthPercentageToDP(1.5)
  },
  outerCircle: {
    height: scaledSize(32),
    width: scaledSize(32),
    borderRadius: 64 / 2,
    backgroundColor: '#e4e4e4',
    alignItems: 'center'
  },
  innerCircle: {
    height: scaledSize(22),
    width: scaledSize(22),
    borderRadius: 44 / 2,
    backgroundColor: '#00dc0b',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: heightPercentageToDP(0.7)
  },
  buttonStyle: {
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: heightPercentageToDP(3),
    paddingVertical: heightPercentageToDP(1),
    width: widthPercentageToDP(80),
    backgroundColor: Constants.primaryColor,
  }
})

const mapStateToProps = state => ({
    liveLoading: state.ShopgLive.liveLoading,
    communityRelevanceReaction: state.ShopgLive.communityRelevanceReaction,
    comment: state.ShopgLive.comment,
    selectedTagName: state.ShopgLive.selectedTag,
    language: state.home.language,
    userProfile: state.userProfile,
    clDetails: state.login.clDetails,
    userPref: state.login.userPreferences,
  });

  const mapDipatchToProps = (dispatch: Dispatch) => ({
    dispatch,
    onAnalytics: (eventName, eventData, userPrefData) => {
      dispatch(liveAnalytics(eventName, eventData, userPrefData));
    },
    onChangeField: (fieldName: string, value: any) => {
      dispatch(changeField(fieldName, value));
    },
    getCurrentUser: () => {
      dispatch(currentUser());
    },
});
  
  
  export default withTranslation()(
    connect(mapStateToProps, mapDipatchToProps)(CommunityRelevance)
  );
 
// export default CommunityRelevance;