import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  BackHandler
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import WidgetSelector from './WidgetSelector';
import {CreateComment,GetComment,EditDelete} from './redux/actions';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../utils/index';
import TypeSlider from './CommunityWidgets/TypeSlider';
import TypeImageRiddle from './CommunityWidgets/TypeImageRiddle';
import TypeImageOnly from './CommunityWidgets/TypeImageOnly';
import feedPost from './CommunityWidgets/feedPost';
import Relevance from '../../../components/LiveComponents/Relevance';
import NavigationService from '../../../utils/NavigationService';
import Modal from 'react-native-modal';
import CommunityModal from './Components/CommunityModal';
import RBSheet from 'react-native-raw-bottom-sheet';
import ActionMenu from './Components/ActionMenu';
import { showToastr } from '../utils';

export class PostDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      components :{
        TypeSlider,
        TypeImageRiddle,
        Relevance,
        TypeImageOnly,
        feedPost
      },
      editDeleteType:'POST',
      commentItem:null,
      isReactionOpened:false,
      item:undefined,
      canEdit: false,
      canDelete: false,
      index:0
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.RBSheet = null;
  }

  handleCloseBottomSheet = () => {
    this.RBSheet && this.RBSheet.close();
  };

  onPressReport = () => {
    this.handleCloseBottomSheet();
    this.setState({showReturnModal:true})
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    NavigationService.navigate('Community',null);
    return true;
  }

  componentDidMount = () => {
    const {selectedPost,getComment,navigation} = this.props;
    let postId,fromDeeplik;
    if(!selectedPost){
      postId = navigation.getParam('actionId');
      fromDeeplik = true;
      getComment(postId,0,1,5,true);
    } else {
      postId = selectedPost.postId;
      fromDeeplik = false;
    }
    SetScreenName(Events.COMMUNITY_DETAIL_PAGE.eventName());
    LogFBEvent(Events.COMMUNITY_DETAIL_PAGE, {
      postId:postId,
      fromDeeplik:fromDeeplik
    });
  }

  emptyView = () => {
    return (
      <View style={styles.emptyView}/>
    );
  }

  openReactModel = () => {
    const {selectedPost,selectedPostIndex} = this.props;
    this.setState({isReactionOpened: true,item:selectedPost,index:selectedPostIndex});
  }
  
  closeModal = () => {
    this.setState({isReactionOpened: false});
  }

  onPressReaction = (reaction) => {
    this.closeModal()
    const {addAComment,userProfile,dispatch} = this.props;
    const {item,index} = this.state;
    const { user } = userProfile;
    let name = user && user.name || '';
    dispatch({
      type: 'comunity/SET_STATE',
      payload: {
        reactionLoading:true
      },
    });
    addAComment(item.postId,index,name,undefined,{
      reaction:reaction
    },callback = () => {
      LogFBEvent(Events.ADD_REACTION, {
        postId:item.postId
      });
      dispatch({
        type: 'comunity/SET_STATE',
        payload: {
          reactionLoading:false
        },
      });
    });
  }

  onEditPress = (item,itemUserId,commentItem,type) => {
    if(type=="POST"){
      this.setState({editDeleteType:'POST'})
    } else {
      this.setState({editDeleteType:'COMMENT',commentItem:commentItem})
    }
    const {userProfile} = this.props;
    const { user } = userProfile;
    let viewPostUserid = user.id;
    // can edit and delete
    let canDelete = item.isModerator || item.isPublisher;
    this.setState({canDelete:(canDelete)})
    this.setState({canEdit:(item.isPublisher)}) 
    this.setState({item:item});
    this.RBSheet && this.RBSheet.open();
  }

  onPressDelete = () => {
    const {t,selectedPost,EditDelete,selectedCommunityId,dispatch} = this.props;
    const {item,editDeleteType,commentItem} = this.state;
    let entityId = (editDeleteType == 'POST') ? parseInt(item.postId) : parseInt(commentItem.postActionId); 
    let deleteData = {
      communityId:selectedCommunityId,
      postId:parseInt(item.postId),
      action:'DELETE',
      type:editDeleteType,
      entityId:entityId
    }
    this.handleCloseBottomSheet();
    this.setState({deletePostLoading:true})
    EditDelete(deleteData,callback = (success) => {
      this.setState({deletePostLoading:false})
      showToastr(success ? (editDeleteType == 'POST') ? t('Post deleted successfully') : t('Comment deleted successfully')  : t('Something went wrong please try again later'))
      let p2 = Object.assign({}, selectedPost);
      if(success){
        if(editDeleteType == 'POST'){
          this.handleBackButtonClick();
        } else {
          const commentIndex = p2['data']['comments'].indexOf(commentItem);
          if (commentIndex > -1) {
            p2['data']['comments'].splice(commentIndex,1);
            p2['summary']['action'] = p2.summary.action-1;
          }
        }
        dispatch({
          type: 'comunity/SET_STATE',
          payload: {
            selectedPost:p2
          },
        });
      }
    });
  }

  onPressEdit = () => {
    this.handleCloseBottomSheet();
    const {editDeleteType,commentItem} = this.state;
    if (editDeleteType == 'POST'){
      this.setState({showCreatePost:true})
    } else {
      if (commentItem.comment && commentItem.comment!='null' && commentItem.comment!=''){
        this.setState({showCreatePost:true})
      } else {
        this.setState({isReactionOpened:true})
      }
    }
    
  }

  render() {
    const {t,selectedPost,selectedPostIndex} = this.props;
    const {components,isReactionOpened,canEdit, canDelete} = this.state;
    if(selectedPost){
      let widgetType = selectedPost.widgetType ? selectedPost.widgetType : '';
      const widgetData = selectedPost && selectedPost.widgetData;
      if(widgetType=='relevance') widgetType =  "Relevance";
      const SelectedWidget = (widgetType && components.hasOwnProperty(widgetType)) ? components[widgetType] : this.emptyView;
      const title = widgetData && widgetData.title;
      const userPost = selectedPost && selectedPost.data && selectedPost.data.userPost; 
      const name = (userPost && userPost.name) ? userPost.name : 'ShopG user';
      const completeComponentData = {
        widgetData,
        widgetType,
        SelectedWidget,
        title,
        name
      };
      return (
        <View style={styles.container}>
          <ScrollView>
            <WidgetSelector 
                t={t} 
                item={selectedPost}
                index={selectedPostIndex}
                clickable={false}
                detail={true}
                completeComponentData={completeComponentData}
                openReactModel={this.openReactModel}
                onbackpress={this.handleBackButtonClick}
                onEditPress={this.onEditPress}
              />
          </ScrollView>
          <Modal
            isVisible={isReactionOpened}
            onBackdropPress={this.closeModal}
            onRequestClose={this.closeModal}>
          <CommunityModal onPressReaction={this.onPressReaction}/>
        </Modal>
        <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={heightPercentageToDP(26)}
            duration={80}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderRadius: 10
              },
            }}>
            <ActionMenu 
              onPressReport={this.onPressReport}
              onPressDelete={this.onPressDelete}
              onPressEdit={this.onPressEdit}
              canEdit={canEdit}
              canDelete={canDelete}
              t={t}/>
          </RBSheet>
        </View>
      );
    }

    return this.emptyView;

  }
}

const styles = StyleSheet.create({
  emptyView:{
    height:heightPercentageToDP(1),
    width:widthPercentageToDP(100)
  },
  container:{
    flex:1,
  }
});

const mapStateToProps = state => ({
    selectedPost:state.community.selectedPost,
    selectedCommunityId:state.community.selectedCommunityId,
    selectedPostIndex:state.community.selectedPostIndex,
    userProfile: state.userProfile,
});

const mapDipatchToProps = dispatch => ({
  dispatch,
  addAComment: (postId,index,name,type,data,callback) => {
    dispatch(CreateComment(postId,index,name,type,data,callback));
  },
  getComment: (postId,index,page,size,isPost) => {
    dispatch(GetComment(postId,index,page,size,isPost));
  },
  EditDelete: (postData,callback) => {
    dispatch(EditDelete(postData,callback));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(PostDetails)
);