import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import Video from 'react-native-video';
import {LogFBEvent, Events, ErrEvents, SetScreenName} from '../../../../Events';
import {
  noop,
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
  AppWindow,
} from '../../../../utils/index';
import {AppText} from '../../../../components/Texts';
import ImageModal from '../../../../components/ImageModal/ImageModal';
import VideoModal from '../../../../components/VideoModal/VideoModal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Constants } from '../../../../styles';
import {Images} from '../../../../../assets/images';

export class feedPost extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openImageModal: false,
      isModalOpen: false,
    }
  }

  openModal = () => {
    this.setState(prevState => ({
      openImageModal: !prevState.openImageModal,
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  };

  renderImages = (item, index) => {
    return (    
    <View style={{marginVertical:widthPercentageToDP(1),borderRadius:widthPercentageToDP(3)}}>
      {this.renderAsset(item)}
    </View>);

  }

  renderVideo(video) {
    return (
      <TouchableWithoutFeedback onPress={this.toggle} style={{ flex: 1}}>
            {/* <TouchableOpacity onPress={()=>this.toggle} style={{flex:1}}> */}
            <View style={{ flex: 1, width: widthPercentageToDP(100)}}>
            <Image
                source={{uri: 'https://cdn.shopg.in/shopg_live/generic.webp'}}
                resizeMode = {'cover'}
                style={{
                  width: widthPercentageToDP(100), 
                  flex: 1,
                  resizeMode: 'cover',
                  borderWidth: 1,
                }}
            />
            <View style={styles.behind}>
                <Image source={Images.play_icon} style={styles.icon} />
            </View>
            </View>
        {/* </TouchableOpacity> */}
            {/* <Video
              source={{ uri: video.location, type: video.contentType }}
              style={{ flex: 1, width: widthPercentageToDP(100), resizeMode: 'contain' }}
              rate={1}
              volume={1}
              controls={true}
              muted={true}
              resizeMode={'cover'}
              onError={(e) => console.log(e)}
              onLoad={(load) => console.log(load)}
              repeat={true}
            /> */}
      </TouchableWithoutFeedback>
    );
  }

  renderImage(image) {
    return (
      <TouchableWithoutFeedback onPress={this.openModal} style={{ flex: 1}}>
       <View style={{flex :1}}> 
        <Image
          style={{ width: widthPercentageToDP(100), flex:1, resizeMode: 'contain' }}
          source={{uri:image.location}}
        />
      </View>
     </TouchableWithoutFeedback>
    );
  }

  renderAsset(image) {
    if (image.contentType && image.contentType.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }

  render() {
    const {isModalOpen, openImageModal} = this.state;
    const {t,item,index} = this.props;
    const widgetId = item && item.widgetId;
    const widgetType = item && item.widgetType;
    const widgetData = item && item.widgetData;
    const userPost = item && item.data && item.data.userPost; 
    const text = userPost && userPost.text;
    let color = (userPost && userPost.postBackgrounColour) ? userPost.postBackgrounColour :  '#123456';
    let media = item && item.data && item.data.media || [];
    let ifMediaExists = media && media.length > 0;
    let mediaPassValue = media.map((value) => value.location);
    return (
        <View style={{ flex: 1}}>
          <View style={styles.containerStyle}>
           {!ifMediaExists ?  
          <View style={[styles.subContainerStyle,{ flex: 1, backgroundColor : color}]}>
            <TouchableOpacity onPress={this.props.onPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <AppText bold white size='L'>{text}</AppText>
            </TouchableOpacity>
          </View> : 
            <View style={[styles.subContainerStyle,{ flex:0.1, backgroundColor : Constants.white}]}>
              <TouchableOpacity onPress={this.props.onPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <AppText black size='L'>{text}</AppText>
              </TouchableOpacity>
            </View>}
          <View style={ifMediaExists ? {flex: 0.9}: null}>
            <FlatList
              horizontal
              data={media}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => this.renderImages(item, index)}
            />
          </View>
          </View>
        {isModalOpen && (
        <VideoModal
          visible={isModalOpen}
          toggleModal={this.toggle}
          videoUri={{
            video : {
              url: mediaPassValue[0]
            }}
          }
          header={''}
          onClose={() => {
            this.toggle();
          }}
        />
      )}
      {openImageModal && (
        <ImageModal
          visible={openImageModal}
          toggleModal={this.openModal}
          images={mediaPassValue}
          index={0}
        />
      )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle:{
    //backgroundColor:'white',
    flex:1,
    height:heightPercentageToDP(36)
  },
  subContainerStyle:{
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:widthPercentageToDP(5)
  },
  behind: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height:'100%',
    borderRadius:scaledSize(5),
  },
  icon: {
    height: widthPercentageToDP(10),
    width: widthPercentageToDP(10),
    resizeMode: 'contain',
  }
});

const mapStateToProps = state => ({
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(feedPost)
);