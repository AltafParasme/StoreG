import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import { Button } from 'react-native-elements';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../utils/index';
import {AppText} from '../../../components/Texts';
import WidgetSelector from './WidgetSelector';
import { Constants } from '../../../styles';
import {CreateComment,GetCurrentCommunityData, joinCommunity, EditDelete} from './redux/actions';
import {changeField} from '../Login/actions';
import {LogFBEvent, Events} from '../../../Events';
import TypeSlider from './CommunityWidgets/TypeSlider';
import TypeImageRiddle from './CommunityWidgets/TypeImageRiddle';
import TypeImageOnly from './CommunityWidgets/TypeImageOnly';
import feedPost from './CommunityWidgets/feedPost';
import ActionMenu from './Components/ActionMenu';
import Relevance from '../../../components/LiveComponents/Relevance';
import Modal from 'react-native-modal';
import CommunityModal from './Components/CommunityModal';
import NavigationService from '../../../utils/NavigationService';
import RBSheet from 'react-native-raw-bottom-sheet';
import CreatePost from './CommunityWidgets/CreatePost';
import RadioButton from '../../../components/RadioButton/RadioButton';
import { showToastr } from '../utils';

export class CommunityWidgetContainer extends Component {

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
      loadFooter: false,
      scrollStarted:false,
      isReactionOpened:false,
      item:undefined,
      index:0,
      canEdit:false,
      canDelete: false,
      showCreatePost:false,
      showReturnModal:false,
      returnReason:null,
      deletePostLoading:false,
      editDeleteType:'',
      commentItem:null
    };
    this.onPressJoinCommunity = this.onPressJoinCommunity.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.toggleReturnModal = this.toggleReturnModal.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
    this.RBSheet = null;
  }

  toggleReturnModal = () => {
    this.setState({showReturnModal: !this.state.showReturnModal});
  };

  onPressConfirm = () => {
    this.toggleReturnModal();
    const {t,EditDelete,selectedCommunityId} = this.props;
    const {returnReason,item, editDeleteType,commentItem} = this.state;
    let entityId = (editDeleteType == 'POST') ? parseInt(item.postId) : parseInt(commentItem.postActionId);
    const userPost = item && item.data && item.data.userPost; 
    const text = userPost && userPost.text;
    let reportData;
    if (editDeleteType == 'POST') {
      reportData = {
        communityId:selectedCommunityId,
        entityData:text,
        action:'REPORT',
        type:editDeleteType,
        entityId:entityId,
        reason:returnReason
      }
    } else {
      reportData = {
        postId:parseInt(item.postId),
        communityId:selectedCommunityId,
        entityData:commentItem.comment,
        action:'REPORT',
        type:editDeleteType,
        entityId:entityId,
        reason:returnReason
      }
    }
    

    EditDelete(reportData,callback = (success) => {
      showToastr(success ? (editDeleteType == 'POST') ? t('Reported post success!') : t('Reported comment success!') : t('Something went wrong please try again later'))
    });
  };
  
  renderSeparator = () => {
    return (
      <View style={styles.emptyView}/>
    );
  }

  emptyView = () => {
    return (
      <View style={styles.emptyView}/>
    );
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

  handleCloseBottomSheet = () => {
    this.RBSheet && this.RBSheet.close();
  };

  openReactModel = (item,index) => {
    const {isLoggedIn} = this.props;
    if(!isLoggedIn) {
      this.props.onChangeField('loginInitiatedFrom', 'Community');
      NavigationService.navigate('Login', {callback: () => {
        this.setState({isReactionOpened: true,item:item,index:index});
      } });
    }
    else {
      this.setState({isReactionOpened: true,item:item,index:index});
    }
  }
  
  closeModal = () => {
    this.setState({isReactionOpened: false});
  }

  renderItems = (item, index) => {
    const {t,_startRecognizing} = this.props;
    const {components} = this.state;
    let widgetType = item.widgetType ? item.widgetType : '';
    const widgetData = item && item.widgetData;
    if(widgetType=='relevance') widgetType =  "Relevance";
    const SelectedWidget = (widgetType && components.hasOwnProperty(widgetType)) ? components[widgetType] : this.emptyView;
    const title = widgetData && widgetData.title;

    const userPost = item && item.data && item.data.userPost; 
    const name = (userPost && userPost.name) ? userPost.name : 'Glowfit user';
    const completeComponentData = {
      widgetData,
      widgetType,
      SelectedWidget,
      title,
      name
    };
    
    return (
      <WidgetSelector 
        t={t} 
        item={item} 
        index={index}
        clickable={true}
        completeComponentData={completeComponentData}
        openReactModel={() => this.openReactModel(item,index)}
        _startRecognizing={_startRecognizing}
        onEditPress={this.onEditPress}
      />
    );
  }

  handleLoadMore = () => {
    const {scrollStarted} = this.state;
    if(scrollStarted){
      this.setState({scrollStarted:false})
      const {selectedCommunityId,getCurentComunityData,currentComunityWidgetList,selectedCommunityPage} = this.props;
      if(currentComunityWidgetList.length && currentComunityWidgetList.length>10 && selectedCommunityPage!=-1){
        this.setState({loadFooter:true})
        LogFBEvent(Events.COMMUNITY_NEXT_PAGE, {
          selectedCommunityId:selectedCommunityId,
          page:selectedCommunityPage,
        });
        getCurentComunityData(selectedCommunityId,0,10,callback = () => {
          this.setState({loadFooter:false})
        });
      }
    }

  };

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

  onPressJoinCommunity = () => {
    const {selectedCommunityId, isLoggedIn} = this.props;
    if(!isLoggedIn) {
      this.props.onChangeField('loginInitiatedFrom', 'Community');
      NavigationService.navigate('Login', {callback: () => {
        //this.props.joinCommunity(selectedCommunityId);
      } });
    }
    else {
      LogFBEvent(Events.JOIN_COMMUNITY_CLICK, {
        communityId:selectedCommunityId
      });
      this.props.joinCommunity(selectedCommunityId);
    }
  }

  renderHeader = () => {
    const {isLoggedIn, route} = this.props;
    const isVisible = !isLoggedIn || !route.isMember;
    return (
      isVisible ? <View style={{ flex: 0.15, justifyContent: 'flex-end', alignItems: 'flex-end', padding: heightPercentageToDP(1)}}>
      <Button
          title="Join Community"
          type="outline"
          onPress={this.onPressJoinCommunity}
          buttonStyle={{ borderColor: Constants.secondaryColor, borderWidth: 2 }}
          titleStyle={{ color: Constants.primaryColor}}
        />
    </View>
    : null
    );
  }

  onPressReport = () => {
    this.handleCloseBottomSheet();
    this.setState({showReturnModal:true})
  }

  closeReturnModal = () => {
    this.setState({showReturnModal:false})
  }

  onPressDelete = () => {
    const {t,EditDelete,selectedCommunityId,currentComunityWidgetList,dispatch} = this.props;
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
      if(success){
        const array = [...currentComunityWidgetList];
        const index = array.indexOf(item);
        if(editDeleteType == 'POST'){
          if (index > -1) {
            array.splice(index, 1);
          }
        } else {
          const commentIndex = array[index]['data']['comments'].indexOf(commentItem);
          if (commentIndex > -1) {
            array[index]['data']['comments'].splice(commentIndex,1);
            array[index]['summary']['action'] = array[index].summary.action-1;
          }
        }
        dispatch({
          type: 'comunity/SET_STATE',
          payload: {
            currentComunityWidgetList:array
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

  closeCreatePost = () => {
    this.setState({showCreatePost:false})
  }

  onHandler = value => {
    this.setState({
      returnReason: value,
    });
  };

  render() {
    const {t,currentComunityWidgetList,comunityWidgetLoading,selectedCommunityId, isLoggedIn} = this.props;
    const {loadFooter,isReactionOpened,canEdit, canDelete,showCreatePost,item,showReturnModal, returnReason, deletePostLoading, editDeleteType, commentItem} = this.state;
    const reportReasons = [{key: 'Hate speech', text: 'Hate speech'},{key: 'Racist language or activity', text: 'Racist language or activity'},{key: 'Nudity or sexual activity', text: 'Nudity or sexual activity'},{key: 'Sale of illegal or controlled goods', text: 'Sale of illegal or controlled goods'}]
    if(comunityWidgetLoading){
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <AppText size="L" bold black>
            {t('Processing Community Data ... ')}
          </AppText>
          <View style={styles.emptyView}/>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    if(deletePostLoading){
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <AppText size="L" bold black>
            {t('Deleting the post ... ')}
          </AppText>
          <View style={styles.emptyView}/>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    return (
        <Animated.View style={styles.containerView}>
          {
            (currentComunityWidgetList && currentComunityWidgetList.length)
            ?
            <Animated.View>
              <Animated.View style={{flex:loadFooter ? 0.95 : 1}}>
                <Animated.FlatList
                  getItemLayout={(data, index) => ({
                    length: 50,
                    offset: 50 * index,
                    index,
                  })}
                  key={selectedCommunityId}
                  keyExtractor={item => item.postId}
                  keyboardShouldPersistTaps={'handled'}
                  initialNumToRender={currentComunityWidgetList.length}
                  data={currentComunityWidgetList}
                  extraData={currentComunityWidgetList}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={this.renderHeader}
                  ItemSeparatorComponent={this.renderSeparator}
                  renderItem={({item, index}) => this.renderItems(item, index)}
                  onEndReached={this.handleLoadMore}
                  onMomentumScrollBegin={() => this.setState({scrollStarted:true})}
                  onEndReachedThreshold={1}
                />
              </Animated.View>
              {
                (loadFooter) ?  
                <View style={{flex:0.05,justifyContent:'center',alignItems:'center'}}> 
                  <ActivityIndicator color="black" size='small' />             
                </View> : null
              }
            </Animated.View>
            :
            <AppText size="L" bold black>
              {t('No post found in community')}
            </AppText>
          }
        <Modal
            isVisible={isReactionOpened}
            onBackdropPress={this.closeModal}
            onRequestClose={this.closeModal}>
          <CommunityModal onPressReaction={this.onPressReaction}/>
        </Modal>
        <Modal
          isVisible={showCreatePost}
          onBackButtonPress={this.closeCreatePost}>
            <CreatePost 
              t={t} 
              isEditComment={(editDeleteType == 'COMMENT')}
              onClosePress = {this.closeCreatePost}
              editable={true}
              item={item}
              commentItem={commentItem}
              onPostCreated={() => this.setState({showCreatePost:false})}/>
        </Modal>

        <Modal
          isVisible={showReturnModal}
          onBackButtonPress={this.closeReturnModal}>
            <View style={styles.returnBoxContainer}>
              <AppText size="L" style={{textAlign: 'center'}}>
                {t(
                  `We would like to know reason for reporting this post`
                )}{' '}
              </AppText>
              <View style={{marginTop: heightPercentageToDP(1)}}>
              <RadioButton
                options={reportReasons}
                value={returnReason}
                onChange={this.onHandler}
              />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Button
                  containerStyle={{marginHorizontal: 5, flex: 0.5}}
                  buttonStyle={{backgroundColor: Constants.greenishBlue}}
                  title="Confirm"
                  onPress={this.onPressConfirm}></Button>
                <Button
                  containerStyle={{marginHorizontal: 5, flex: 0.5}}
                  buttonStyle={{backgroundColor: Constants.greenishBlue}}
                  title="Cancel"
                  onPress={this.toggleReturnModal}></Button>
              </View>
            </View>
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
        </Animated.View>
      );
  }
}

const styles = StyleSheet.create({
  emptyView:{
    height:heightPercentageToDP(1),
    width:widthPercentageToDP(100)
  },
  containerView:{
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor:Constants.veryLightGrey
  },
  returnBoxContainer: {
    height:heightPercentageToDP(50),
    justifyContent:'center',
    alignItems:'center',
    borderRadius:heightPercentageToDP(2),
    backgroundColor: Constants.white,
    padding: widthPercentageToDP(2),
  },
});

const mapStateToProps = state => ({
  currentComunityWidgetList:state.community.currentComunityWidgetList,
  comunityWidgetLoading:state.community.comunityWidgetLoading,
  selectedCommunityId:state.community.selectedCommunityId,
  selectedCommunityPage:state.community.selectedCommunityPage,
  loadFooter:state.community.loadFooter,
  userProfile: state.userProfile,
  isLoggedIn: state.login.isLoggedIn
});

const mapDipatchToProps = dispatch => ({
  dispatch,
  addAComment: (postId,index,name,type,data,callback) => {
    dispatch(CreateComment(postId,index,name,type,data,callback));
  },
  getCurentComunityData: (id,page, size,callback) => {
    dispatch(GetCurrentCommunityData(id,page, size,callback));
  },
  joinCommunity: (communityId) => {
    dispatch(joinCommunity(communityId));
  },
  EditDelete: (postData,callback) => {
    dispatch(EditDelete(postData,callback));
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  }
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(CommunityWidgetContainer)
);