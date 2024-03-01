import React, { Component } from 'react';
import { View , 
    StyleSheet, 
    TouchableOpacity, 
    ImageBackground, 
    Text, 
    FlatList, 
    TextInput, 
    ActivityIndicator,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import { heightPercentageToDP, widthPercentageToDP, scaledSize } from '../../../../utils';
import {AppText} from '../../../../components/Texts';
import { Constants } from '../../../../styles';
import {withTranslation} from 'react-i18next';
import {Icon} from 'react-native-elements';
import InitialLetter from '../Components/InitialLetter'
import NavigationService from '../../../../utils/NavigationService';
import {changeField} from '../../Login/actions';
import { maxCharactersCommets } from '../../utils';

class CommentSection extends React.Component {
  constructor(prop) {
      super(prop);
      this.state = {
        postComment: '',
        scrollStarted:false
      };
  }


  renderCommentItems = (item, index) => {
    const {t,onEditPress,showEditable} = this.props;
    let name = item.name && item.name.length>10 ? item.name.slice(0,10)+'...':item.name;
    let colors = ['#123456', '#654321', '#8B008B', '#091827'];
    let commentLine = (item.comment && item.comment!='null' && item.comment!='') ? item.comment : (item.reaction && item.reaction!='null' && item.reaction!='') ? 'reacted '+item.reaction:'';

    let commentUserId = item.userId || '';

    return (
      <View
        style={styles.renderComment}>
        <InitialLetter name={name} backgroundColor={colors[index % colors.length]}/>

        <View
          style={styles.subView}>
              {showEditable ? <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                <AppText size="XS" bold>
                  {t(name)}
                </AppText>
                <TouchableOpacity onPress={() => onEditPress(this.props.item,commentUserId,item,"COMMENT")} style={{marginHorizontal:widthPercentageToDP(3)}}>
                    <Icon
                    name={'align-right'}
                    type={'font-awesome'}
                    size={widthPercentageToDP(3)}/>
                </TouchableOpacity>
              </View>: null}

              <AppText 
                textProps={{numberOfLines: 1}}
                style={{marginTop: heightPercentageToDP(1)}}>
                  {commentLine}
              </AppText>
        </View>
      </View>
    );
  };

  onPostComment = () => {
    const {onPostComment, isLoggedIn} = this.props;
    const {postComment} = this.state;
    if(postComment && postComment!=''){
      if(!isLoggedIn) {
        this.props.onChangeField('loginInitiatedFrom', 'Community');
        NavigationService.navigate('Login', {callback: () => {
          onPostComment(postComment);
          this.setState({
            postComment: ''
          })
        }})  
      }
      else {
          onPostComment(postComment);
          this.setState({
            postComment: ''
          })
      }  
    }
  }

  handleLoadMore = () => {
    const {scrollStarted} = this.state;
    const {onLoadMore} = this.props;
    if(scrollStarted){
      this.setState({scrollStarted:false})
      onLoadMore();
    }
  }

  render() {
    const {_startRecognizing,user, postId, height, slectedPostId,item, currentComunityWidgetList,addCommentLoading,detail} = this.props;
    const {postComment} = this.state;
    let comments = item && item.data && item.data.comments;
    let name = user && user.name || '';
    

    return (
      <View style={[{marginRight: widthPercentageToDP(3)},(height && comments.length>0) ? {height:height} : {}]}>
        <FlatList
          nestedScrollEnabled
          style={detail ? {marginTop:heightPercentageToDP(8)} : {}}
          horizontal={detail ? false : true}
          data={comments}
          extraData={currentComunityWidgetList}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => this.renderCommentItems(item, index)}
          onMomentumScrollBegin={() => this.setState({scrollStarted:true})}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.1}
        />

        {
          (addCommentLoading && (postId==slectedPostId))
          ?
          <View
            style={[styles.commentPostView,detail ? 
            {
              position:'absolute',
              top:0,
              justifyContent:'center',
              alignItems:'center'
            } : {}]}>
            <ActivityIndicator animating size="large" />
          </View>
          :
          <View
            style={[styles.commentPostView,detail ? 
            {
              position:'absolute',
              top:0,
              justifyContent:'center',
              alignItems:'center'
            } : {}]}>
            <View style={styles.abbrivation}>
              <InitialLetter name={name}/>
            </View>
            <View style={styles.restCommentSpace}>
                <TextInput
                  onChangeText={comments =>{if(comments.length<maxCharactersCommets) this.setState({postComment: comments})}
                  }
                  placeholder={'Write a comment...'}
                  placeholderTextColor={''}
                  value={postComment}
                  editable={true}
                  style={{width:widthPercentageToDP(57)}}
                  maxLength={500} 
                />
                <View style={{flexDirection:'row',width:widthPercentageToDP(20)}}>
                  
                    
                    <TouchableOpacity
                      onPress={_startRecognizing}
                      style={{
                        width:widthPercentageToDP(10),
                        justifyContent:'center',
                        alignItems:'flex-end'
                      }}>
                      <Icon
                        name={'mic'}
                        type={'ionicons'}
                        size={22}/>
                    </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={this.onPostComment}
                    style={{
                      width:widthPercentageToDP(10),
                      justifyContent:'center',
                      alignItems:'flex-end'
                    }}>
                    <Icon
                      name={'send'}
                      type={'ionicons'}
                      size={22}/>
                  </TouchableOpacity>
                </View>

            </View>
          </View>
        }


      </View>
    );
  }
}

const styles = StyleSheet.create({
  renderComment: {
    marginLeft: widthPercentageToDP(3),
    marginTop: heightPercentageToDP(0.7),
    marginVertical: heightPercentageToDP(1),
    flexDirection: 'row',
  },
  renderCommentOuterCircle: {
    height: scaledSize(22),
    width: scaledSize(22),
    borderRadius: 44 / 2,
    marginRight: widthPercentageToDP(3),
    
  },
  subView: {
    padding: scaledSize(8),
    marginLeft: scaledSize(4),
    borderRadius: 5,
    backgroundColor: '#e4e4e4',
  },
  commentPostView: {
    height:heightPercentageToDP(8),
    width:widthPercentageToDP(100),
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  initialView: {
    height: scaledSize(36),
    width: scaledSize(36),
    borderRadius: 72 / 2,
    marginTop: heightPercentageToDP(2.3),
    marginRight: widthPercentageToDP(2),
    backgroundColor: Constants.primaryColor,
  },
  abbrivation:{
    width:widthPercentageToDP(12),
    height:heightPercentageToDP(8),
    justifyContent:'center',
    alignItems:'center',
  },
  restCommentSpace:{
    width:widthPercentageToDP(83),
    marginRight:widthPercentageToDP(5),
    height:heightPercentageToDP(6),
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    borderColor:Constants.borderGrey,
    backgroundColor:'white',
    paddingHorizontal:widthPercentageToDP(5),
    borderRadius:widthPercentageToDP(10),
    borderWidth:widthPercentageToDP(0.1),
    elevation: 5
  },
  cardStyle: {
    borderRadius: widthPercentageToDP(10),
    flex:1,
    elevation: 5
  },
  placeHolderLineStyle: {
    paddingBottom: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(3),
    marginLeft: widthPercentageToDP(4),
    width:widthPercentageToDP(90)
  },
  placeHolderLineStyleSecond: {
    paddingBottom: heightPercentageToDP(2),
    marginBottom: heightPercentageToDP(2),
    marginLeft: widthPercentageToDP(4),
    width:widthPercentageToDP(70)
  },
})

const mapStateToProps = state => ({
  currentComunityWidgetList:state.community.currentComunityWidgetList,
  addCommentLoading:state.community.addCommentLoading,
  slectedPostId:state.community.slectedPostId,
  isLoggedIn: state.login.isLoggedIn,
  userProfile: state.userProfile,
});

const mapDipatchToProps = dispatch => ({
  dispatch,
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(CommentSection)
);