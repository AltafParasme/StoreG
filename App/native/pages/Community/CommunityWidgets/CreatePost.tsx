import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {LogFBEvent, Events, ErrEvents, SetScreenName} from '../../../../Events';
import {
  noop,
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
  AppWindow,
} from '../../../../utils/index';
import InitialLetter from '../Components/InitialLetter'
import {AppText} from '../../../../components/Texts';
import {Icon,Card} from 'react-native-elements';
import { Constants } from '../../../../styles';
import {CreatePost as CreatePostData,EditDelete, uploadImage} from '../redux/actions';
import { showToastr,maxCharacters,minCharacters } from '../../utils';
import ImagePicker from 'react-native-image-crop-picker';

const postColors = ['#123456', '#654321', '#8B008B', '#fdc001'];

export class CreatePost extends Component {

  constructor() {
    super();
    this.state = {
      value:'',
      selectedColor:postColors[0],
      placeHolder:'type here',
      createPostLoading:false,
      images:[]
    };
  }

  componentDidMount = () => {
    const {editable,item,isEditComment,commentItem} = this.props;
    if(isEditComment){
      let commentLine = (commentItem.comment && commentItem.comment!='null' && commentItem.comment!='') ? commentItem.comment : '';
      this.setState({value:commentLine})
    } else {
      let color='';
      if(editable) {
        const userPost = item && item.data && item.data.userPost; 
        color = (userPost && userPost.postBackgrounColour) ? userPost.postBackgrounColour :  '#123456';
        this.setState({value:(userPost && userPost.text),selectedColor:color})
      }
    }

  }

  onColorClick = (item) => {
    this.setState({selectedColor:item})
  }

  renderColorItems = (item, index) => {
    return (
      <TouchableOpacity 
        onPress={() => this.onColorClick(item)}
        style={{justifyContent:'center',alignItems:'center',height:heightPercentageToDP(6)}}>
        <View 
          style={{
            height:heightPercentageToDP(4),
            width:heightPercentageToDP(4),
            backgroundColor:item,
            marginHorizontal:heightPercentageToDP(1),
            borderRadius:heightPercentageToDP(4)}} 
          />
      </TouchableOpacity>

    )
  }

  renderImages = (item, index) => {
    return (    
    <View style={{margin:widthPercentageToDP(2),borderRadius:widthPercentageToDP(3)}}>
      {this.renderAsset(item)}
    </View>);

  }

  renderVideo(video) {
    return (
      <View style={{ height: widthPercentageToDP(35), width: widthPercentageToDP(35) }}>
        <Video
          source={{ uri: video.uri, type: video.mime }}
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
          rate={1}
          volume={1}
          muted={false}
          resizeMode={'cover'}
          onError={(e) => console.log(e)}
          onLoad={(load) => console.log(load)}
          repeat={true}
        />
      </View>
    );
  }

  renderImage(image) {
    return (
      <Image
        style={{ width: widthPercentageToDP(35), height: widthPercentageToDP(35), resizeMode: 'contain' }}
        source={image}
      />
    );
  }

  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }

  onPostClick = () => {
    const {value,selectedColor, images} = this.state;
    const {t,commentItem,selectedCommunityId,CreatePostData,editable,item,EditDelete,onPostCreated,currentComunityWidgetList,isEditComment,dispatch, uploadImage} = this.props;

    if(value != ''){
      if(value.length<minCharacters){
        showToastr(t('Please add post more than #MIN# letters!',{MIN:minCharacters}))  
      } else {
        this.setState({createPostLoading:true})
        if(isEditComment){
          let editData = {
            communityId:selectedCommunityId,
            postId:parseInt(item.postId),
            action:'EDIT',
            type:'COMMENT',
            entityId:parseInt(commentItem.postActionId),
            editdata:value
          }
          EditDelete(editData,callback = (success) => {
            this.setState({createPostLoading:false})
            onPostCreated()
            if(success){
              const array = [...currentComunityWidgetList];
              const index = array.indexOf(item);
              
              const commentIndex = array[index]['data']['comments'].indexOf(commentItem);
              if (commentIndex > -1) {
                array[index]['data']['comments'][commentIndex]['comment'] = value;
              }

              dispatch({
                type: 'comunity/SET_STATE',
                payload: {
                  currentComunityWidgetList:array
                },
              });
            }
          });
        } else {
          if(editable){
            let editData = {
              communityId:selectedCommunityId,
              postId:parseInt(item.postId),
              action:'EDIT',
              type:'POST',
              entityId:parseInt(item.postId),
              editdata:value
            }
            EditDelete(editData,callback = (success) => {
              this.setState({createPostLoading:false})
              onPostCreated()
              if(success){
                const array = [...currentComunityWidgetList];
                const index = array.indexOf(item);
                array[index]['data']['userPost']['text'] = value;
                dispatch({
                  type: 'comunity/SET_STATE',
                  payload: {
                    currentComunityWidgetList:array
                  },
                });
              }
            });
          } else {
            if(images && images.length){
              const postImages = new FormData();
              images.map((i) => {
                postImages.append('file',
                {
                   uri:i.uri,
                   name: new Date().getUTCMilliseconds()+"_media",
                   type:i.mime
                });
              })
    
              uploadImage(postImages,callback = (data) => {
                if(data){
                  this.createPostWithMedia(data);
                }
              });
            } else {
              this.createPostWithMedia(undefined);
            }
          }
        }
        

      }
    } else {
      showToastr(t('Please add some comments in the post!'))
    }
  }

  createPostWithMedia = (uploadedMedia) => {
    const {value,selectedColor} = this.state;
    const {t,selectedCommunityId,CreatePostData, onPostCreated} = this.props;
    const postData = {
      communityId : selectedCommunityId,
      comment : value,
      backgroundColour:selectedColor,
      type:"POST",
      media: uploadedMedia
    };
    CreatePostData(postData,callback = (success) => {
      this.setState({createPostLoading:false})
      onPostCreated()
    });
    LogFBEvent(Events.ADD_POST, {
      communityId : selectedCommunityId,
      comment : value,
      backgroundColour:selectedColor,
    });
  }

  onChangeText = val => {
    if(val.length<maxCharacters)
    this.setState({value: val});
  };

  onAdd = () => {
    ImagePicker.openPicker({
      waitAnimationEnd: false,
      sortOrder: 'desc',
      includeExif: true,
      forceJpg: true
    })
      .then((i) => {
        let obj = {
          uri: i.path,
          width: i.width,
          height: i.height,
          mime: i.mime,
        };
        let arr = [obj]
        this.setState({
          images: arr
        });
      })
      .catch((e) => alert(e));
  }

  render() {
    const {t,userProfile,onClosePress,isEditComment} = this.props;
    const {value,selectedColor,placeHolder,createPostLoading,images} = this.state;
    const { user } = userProfile;
    let name = user && user.name || '';
    return (
      <View style={styles.contaierStyle}>
        <View style={styles.headerStyle}>
          <View style={styles.headerNameStyle}>
            <View style={styles.abbrivation}>
                <InitialLetter name={name}/>
            </View>
            <View style={styles.nameBox}>
              <AppText
                black
                bold
                size="M">
                {name}
              </AppText>
            </View>
          </View>
          <View style={styles.abbrivation}>
              <Icon
                name={'x'}
                type={'feather'}
                onPress={onClosePress}
              />
          </View>
        </View>
        <View style={styles.addPostStyle}>
            <Card
              containerStyle={[styles.cardStyle,{backgroundColor:selectedColor}]}>
              <TextInput
                style={{height:heightPercentageToDP(24),textAlign:'center',color:'white',fontWeight:'bold',fontSize:heightPercentageToDP(3),textAlignVertical:'center'}}
                multiline={true}
                placeholderTextColor="white" 
                placeholder={placeHolder}
                onChangeText={this.onChangeText}
                value={value}
                onFocus={() => this.setState({placeHolder:''})}
              />
          </Card>
          <AppText
            black
            bold
            size="M">
            {value.length+'/'+maxCharacters}
          </AppText>
        </View>
        {
          (isEditComment) ? null : 
          <View style={{justifyContent:'center',alignItems:'center',height:heightPercentageToDP(8)}}>
            <FlatList
              contentContainerStyle={{justifyContent:'center',alignItems:'center',height:heightPercentageToDP(8)}}
              horizontal
              data={postColors}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => this.renderColorItems(item, index)}
            />
          </View>
        }

        <View style={{justifyContent:'center',alignItems:'center',height:heightPercentageToDP(8)}}>
          <FlatList
            contentContainerStyle={{justifyContent:'center',alignItems:'center',height:heightPercentageToDP(8)}}
            horizontal
            data={postColors}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => this.renderColorItems(item, index)}
          />
        </View>
        <View style={{alignItems:'center',flexDirection:'row',marginHorizontal:widthPercentageToDP(5),marginBottom:heightPercentageToDP(1)}}>
          <TouchableOpacity onPress={this.onAdd} style={styles.addImage}>
              <AppText bold white size={"M"}>+</AppText>
          </TouchableOpacity>
          <AppText bold black size={"M"}>{t('Add Photos/Videos')}</AppText>
        </View>

        <View style={{justifyContent:'center',alignItems:'center'}}>
          <FlatList
            horizontal
            data={images}
            extraData={images}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => this.renderImages(item, index)}
          />
        </View>
        <View style={styles.postButton}>
          {
            (createPostLoading)
            ?
            <ActivityIndicator animating size="large" />
            :
            <TouchableOpacity onPress={this.onPostClick}>
              <View style={styles.postButtonStyle}>
                  <AppText white bold size="M">
                      {t(isEditComment ? 'Submit' : 'Post')}
                  </AppText>
              </View>
            </TouchableOpacity>
          }

        </View>
      </View>
    
    );
  }
}

const styles = StyleSheet.create({
  contaierStyle:{
    backgroundColor:'white',
    borderRadius:widthPercentageToDP(3),
    width:widthPercentageToDP(90)
  },
  headerStyle:{
    borderTopRightRadius:widthPercentageToDP(3),
    height:heightPercentageToDP(10),
    width:widthPercentageToDP(90),
    flexDirection:'row',
    justifyContent:'space-between'
  },
  headerNameStyle:{
    height:heightPercentageToDP(10),
    flexDirection:'row',
  },
  addPostStyle:{
    width:widthPercentageToDP(90),
    paddingHorizontal:heightPercentageToDP(1),
  },
  postButton:{
    borderBottomLeftRadius:widthPercentageToDP(3),
    borderBottomRightRadius:widthPercentageToDP(3),
    paddingBottom:heightPercentageToDP(2),
    width:widthPercentageToDP(90),
    justifyContent:'center',
    alignItems:'center'
  },
  abbrivation:{
    borderTopLeftRadius:widthPercentageToDP(3),
    padding:heightPercentageToDP(1),
    height:heightPercentageToDP(10),
    width:heightPercentageToDP(10),
    justifyContent:'center',
    alignItems:'center',
  },
  nameBox:{
    height:heightPercentageToDP(10),
    width:widthPercentageToDP(30),
    justifyContent:'center',
  },
  cardStyle: {
    borderRadius: widthPercentageToDP(2),
    elevation: 5,
    margin:0,
  },
  postButtonStyle:{
    width:widthPercentageToDP(85),
    height:heightPercentageToDP(6),
    backgroundColor:Constants.postBlue,
    borderRadius:widthPercentageToDP(1),
    justifyContent:'center',
    alignItems:'center'
  },
  emptyView:{
    height:heightPercentageToDP(1),
    width:widthPercentageToDP(100)
  },
  addImage: {
    height: scaledSize(36),
    width: scaledSize(36),
    borderRadius: scaledSize(36),
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: Constants.primaryColor,
    marginRight:widthPercentageToDP(5)
  }
});

const mapStateToProps = state => ({
  userProfile: state.userProfile,
  selectedCommunityId:state.community.selectedCommunityId,
  createPostLoading:state.community.createPostLoading,
  currentComunityWidgetList:state.community.currentComunityWidgetList,
});

const mapDipatchToProps = dispatch => ({
  dispatch,
  CreatePostData: (postData,callback) => {
    dispatch(CreatePostData(postData,callback));
  },
  EditDelete: (postData,callback) => {
    dispatch(EditDelete(postData,callback));
  },
  uploadImage: (postData,callback) => {
    dispatch(uploadImage(postData,callback));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(CreatePost)
);