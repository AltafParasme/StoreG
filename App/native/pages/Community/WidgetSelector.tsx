import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {LogFBEvent, Events, ErrEvents, SetScreenName} from '../../../Events';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../utils/index';
import CommentSection from './Components/CommentSection';
import WidgetHeader from './Components/WidgetHeader';
import ReactionView from './Components/ReactionView';
import {CreateComment,GetComment} from './redux/actions';
import Share from 'react-native-share';
import NavigationService from '../../../utils/NavigationService';
import { buildLink } from '../utils';
import RNFetchBlob from 'rn-fetch-blob';
import {changeField} from '../Login/actions';

export class WidgetSelector extends Component {

  onPostComment = (postComment:String) => {
    const {item,addAComment,index,userProfile,dispatch} = this.props;
    const { user } = userProfile;
    let name = user && user.name || '';
    let postId = item.postId;
    dispatch({
      type: 'comunity/SET_STATE',
      payload: {
        addCommentLoading:true
      },
    });
    addAComment(postId,index,name,undefined,{
      comment:postComment
    },callback = () => {
      LogFBEvent(Events.ADD_COMMENT, {
        postId:item.postId,
        postComment:postComment
      });
      let lastComment = {postId:postId,comment:postComment};
      dispatch({
        type: 'comunity/SET_STATE',
        payload: {
          lastComment:lastComment,
          addCommentLoading:false
        },
      });
    });
  }

  onLoadMore = () => {
    const {item,index,getComment} = this.props;
    const comments = item && item.data && item.data.comments;
    const page = Math.ceil((comments.length)/ 5) + 1;
    LogFBEvent(Events.COMMENT_NEXT_PAGE, {
      postId:item.postId,
      page:page,
    });
    getComment(item.postId,index,page,5);
  }

  commonShareFn = () => {
    const {isLoggedIn} = this.props;
    if(!isLoggedIn) {
      this.props.onChangeField('loginInitiatedFrom', 'Community');
      NavigationService.navigate('Login', {callback: () => {}});
    }
    else {
      this.commonShareFnCallback();
    }  
  }
  
  commonShareFnCallback = async () => {

    const {language,offerList,item,addAComment,index,userProfile,dispatch,groupSummary,userPreferences} = this.props;
    
    const widgetData = item && item.widgetData;
    let shareMessage = widgetData.shareMsg ? widgetData.shareMsg : 'Check this community';
    const { user } = userProfile;
    let name = user && user.name || '';
    dispatch({
      type: 'comunity/SET_STATE',
      payload: {
        shareLoading:true
      },
    });

    const inviteToken = groupSummary.groupDetails.info.inviteToken;
    const url = await buildLink('CommunityPostShare', item.postId, inviteToken, item.postId, userPreferences.uid, null,'PostDetails');
    
    addAComment(item.postId,index,name,'SHARE',{},callback = () => {
      dispatch({
        type: 'comunity/SET_STATE',
        payload: {
          shareLoading:false
        },
      });

      let imageUrl = widgetData.shareImage ? widgetData.shareImage : '';
      let widgetType = item.widgetType ? item.widgetType : '';
      if(widgetType=='relevance') {
        if (offerList && offerList.length && offerList.length > 0) {
          let gotFirstOffer = false;
          offerList.map(offer => {
            if (!gotFirstOffer && item && item.widgetData && item.widgetData.tags && item.widgetData.tags.length && offer.tag == item.widgetData.tags[0].slug) {
              imageUrl = offer.data[0].mediaJson.mainImage.url;
              gotFirstOffer = true;
            }
          });
        }
      } else if (widgetType=='TypeImageRiddle'){
        const beforeMediaJson = item && item.widgetData && item.widgetData.beforeMediaJson;
        imageUrl = beforeMediaJson[language][0].thumbnail;
      } else if (widgetType=='TypeImageOnly'){
        const mediaJson = item && item.widgetData && item.widgetData.mediaJson;
        imageUrl = mediaJson[language][0].thumbnail;
      } else if (widgetType=='feedPost'){
        const userPost = item && item.data && item.data.userPost; 
        const name = (userPost && userPost.name) ? userPost.name : 'ShopG user';
        const text = userPost && userPost.text;
        shareMessage = shareMessage + '\n\n' + name + ' posted' + '\n' + '*'+text+'*'; 
      }
      shareMessage = shareMessage + '\n\n' + url;
      LogFBEvent(Events.SHARE_WIDGET_CLICK, {
        postId:item.postId,
        shareMessage:shareMessage,
        imageUrl:imageUrl
      });
      if(!imageUrl || imageUrl ==''){
        Share.isPackageInstalled('com.whatsapp').then(({isInstalled}: any) => {
          if (isInstalled) {
            const shareOptions = {
              title: 'Share via',
              message: shareMessage,
              social: Share.Social.WHATSAPP, // country code + phone number(currently only works on Android)
              filename: 'test', // only for base64 file in Android
            }
            try {
              Share.shareSingle(shareOptions);
            } catch (error) {
              console.error(error);
            }
          }
        });
      } else {
        RNFetchBlob.config({
          fileCache: true,
        })
          .fetch('GET', imageUrl)
          .then(resp => {
            return resp.readFile('base64');
          })
          .then(base64Data => {
            Share.isPackageInstalled('com.whatsapp').then(({isInstalled}: any) => {
              if (isInstalled) {
                const shareOptions = {
                  title: 'Share via',
                  message: shareMessage,
                  url: `data:image/png;base64,${base64Data}`,
                  social: Share.Social.WHATSAPP, // country code + phone number(currently only works on Android)
                  filename: 'test', // only for base64 file in Android
                }
                try {
                  Share.shareSingle(shareOptions);
                } catch (error) {
                  console.error(error);
                }
              }
            });
          });
      }
    });
  }

  onPostClick = () => {
    const {item,index,dispatch,clickable} = this.props;
    if(clickable){
      dispatch({
        type: 'comunity/SET_STATE',
        payload: {
          selectedPost:item,
          selectedPostIndex:index
        },
      });
      NavigationService.navigate('PostDetails')
    }
  }

  emptyView = () => {
    return (
      <View style={styles.emptyView}/>
    );
  }

  render() {
    const {t,_startRecognizing,currentComunityWidgetList,item,userProfile,index,shareLoading,reactionLoading,addCommentLoading,clickable,detail,slectedPostId,completeComponentData,openReactModel,onbackpress,onEditPress,isLoggedIn} = this.props;

    const widgetData = completeComponentData.widgetData;
    const widgetType = completeComponentData.widgetType;
    const name = completeComponentData.name.length>10 ? completeComponentData.name.slice(0,10)+'...' : completeComponentData.name;
    const title = completeComponentData.title;
    const SelectedWidget = completeComponentData.SelectedWidget;

    const { user } = userProfile;
    return (
      <View 
        style={styles.containerStyle}>
        <View style={styles.emptyView}/>
        <TouchableOpacity 
          activeOpacity={clickable ? 0.2 : 1}
          onPress={this.onPostClick}>
            <WidgetHeader 
              showEditable = {isLoggedIn && (widgetType == 'feedPost')}
              t={t} 
              title={(widgetType == 'feedPost') ? name+' posted' : title}
              currentComunityWidgetList={currentComunityWidgetList}
              postId={item.postId}
              detail={detail}
              onbackpress={onbackpress}
              onEditPress={onEditPress}
            />
          </TouchableOpacity>
          <SelectedWidget
            t={t} 
            item={item} 
            style={styles.emptyView}
            onPress={this.onPostClick}
            doNotShowTitle={true}
            itemData={widgetData}
            widgetId={item.widgetId}
            page={'Community'}
            index={index}
            listItemIndex={index}
            itemCategory={''}
            category={''}
            widgetType={widgetType}/>
          <View style={styles.emptyView}/>
        <ReactionView 
          t={t}
          onSharePress={this.commonShareFn}
          onReactionPress={openReactModel}
          onCommentPress={() => {}}
          item={item}
          shareLoader={shareLoading && (slectedPostId==item.postId)}
          reactionLoader={reactionLoading && (slectedPostId==item.postId)}
          commentLoader={addCommentLoading && (slectedPostId==item.postId)}
          />
        <View style={styles.emptyView}/>
        <CommentSection  
            _startRecognizing={_startRecognizing}
            user={user}
            showEditable={isLoggedIn}
            item={item}
            onPostComment={this.onPostComment}
            onLoadMore={this.onLoadMore}
            postId={item.postId}
            detail={detail}
            onEditPress={onEditPress}
            height={detail ? heightPercentageToDP(60) : undefined}/>
        <View style={styles.emptyView}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle:{
    width:widthPercentageToDP(100),
    backgroundColor:'white',
  },
  emptyView:{
    height:heightPercentageToDP(1),
    width:widthPercentageToDP(100)
  }
});

const mapStateToProps = state => ({
  currentComunityWidgetList:state.community.currentComunityWidgetList,
  comunityWidgetLoading:state.community.comunityWidgetLoading,
  userProfile: state.userProfile,
  selectedCommunityId:state.community.selectedCommunityId,
  addCommentLoading:state.community.addCommentLoading,
  reactionLoading:state.community.reactionLoading,
  shareLoading:state.community.shareLoading,
  groupSummary: state.groupSummary,
  userPreferences: state.login.userPreferences,
  offerList: state.ShopgLive.liveOfferList,
  language: state.home.language,
  slectedPostId:state.community.slectedPostId,
  isLoggedIn: state.login.isLoggedIn
});

const mapDipatchToProps = dispatch => ({
  dispatch,
  addAComment: (postId,index,name,type,data,callback) => {
    dispatch(CreateComment(postId,index,name,type,data,callback));
  },
  getComment: (postId,index,page,size) => {
    dispatch(GetComment(postId,index,page,size,false));
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  }
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(WidgetSelector)
);