import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
  } from 'react-native';
import {Icon} from 'react-native-elements';
import {Constants} from '../../styles';
import VideoModal from '../VideoModal/VideoModal';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../utils';
import {LogFBEvent, Events} from '../../Events';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {Images} from '../../../assets/images';

export class ListImageBG extends Component {

  constructor() {
    super();
    this.state = {
        isModalOpen: false,
        startVideoTime:new Date(),
        videoObject:undefined,
        isVideo:false
    };
  }

  componentDidMount() {
    const {language,item,strictlyVideo, videoComponent} = this.props;
    
    if(strictlyVideo){
      this.setState({isVideo:true})
    } else {
      const mediaJson = item && item.mediaJson;
     
      let isVideo = (mediaJson && mediaJson.localisedVideo && mediaJson.localisedVideo.length) 
    ? true 
    : videoComponent  && videoComponent.video
      ? true :false;
      
      if(isVideo){
        if(mediaJson && mediaJson.localisedVideo[0].video){
          this.setState({videoObject:mediaJson.localisedVideo[0]})
          this.setState({isVideo:true})
        }  else if (videoComponent) {
          this.setState({videoObject: videoComponent})
          this.setState({isVideo:true})
        }
      }
    }

  }

 

  onClick = (isVideo, dataForLog, shopgLivedataForLog, videoComponent) => {
    const {noVideoClick, screen, videoClick} = this.props;
  
    if(isVideo){
        videoClick ? videoClick()  : this.setState({isModalOpen:true})
    } else {
      noVideoClick ? noVideoClick() : null;
    }
  }

  toggle = () => {
    const {isModalOpen} = this.props;
    !isModalOpen ? this.setState({startVideoTime:(new Date())})  : null;
    this.setState({isModalOpen:!this.state.isModalOpen})
  };

  render() {
    const {reviewVideoThumbnail,style,item,screen,noVideoClick,widgetId,imageStyle, position, page, widgetType, category,mainImage, videoComponent} = this.props;
    const {isVideo,videoObject,isModalOpen} = this.state;
    const mediaJson = item && item.mediaJson;
    let imageURL = reviewVideoThumbnail ? reviewVideoThumbnail.url : (mainImage && mainImage!='') ? mainImage : (videoComponent && videoComponent.thumbnail) ? videoComponent.thumbnail : mediaJson ? mediaJson.square : '';
    // let imageURL = "https://i.pinimg.com/originals/0e/a6/dd/0ea6dd46cf15e45781915da0980402b2.jpg";
   
    const dataForLog = Object.assign(
      {
        offerId: item && item.id,
        offerName: (item && item.mediaJson && item.mediaJson.title) ? item.mediaJson.title.text : '',
        offerPrice: item && item.offerinvocations ? item.offerinvocations.offerPrice : 0
      }
      );
  
     const shopgLivedataForLog = Object.assign(
      {
        widgetId: widgetId,
        position: position,
        page: page,
        widgetType: widgetType,
        category: category,
      }
      );
    return (
        <View style={style}>
        <TouchableOpacity onPress={()=>this.onClick(isVideo, dataForLog, shopgLivedataForLog)} style={{flex:1}}>
            <Image
                //resizeMethod = {'resize'}
                resizeMode = {'cover'}
                style={[{width: '100%', 
                height: '100%', 
                resizeMode: 'cover',
                borderWidth: 1,
                },
                imageStyle,
                !videoComponent ? {borderRadius: scaledSize(4)} : {}
              ]}
                source={{uri: (videoObject && videoObject.isThumbnailVideo) ? videoObject.thumbnail :  imageURL}}
            />
            {
                (isVideo && !(videoComponent && videoComponent.isThumbnailVideo) )
                ?
                <View style={styles.behind}>
                    <Image source={Images.play_icon} style={styles.icon} />
                </View>
                : null
            }
        </TouchableOpacity>

        {isModalOpen && (
            <VideoModal
                visible={isModalOpen}
                toggleModal={this.toggle}
                videoUri={mediaJson ? mediaJson.localisedVideo[0] : videoComponent.url}
                header={mediaJson ? mediaJson.title.text : 'Video Component'}
                onClose={() => {
                    this.toggle();
                    let timeTaken = new Date() - this.state.startVideoTime;
                    if(screen=="home"){
                      noVideoClick()
                      LogFBEvent(Events.HOME_OFFER_VIDEO_CLOSE, Object.assign(dataForLog,{timeTaken: timeTaken}));
                    } else if(screen=="shopgLive"){
                      LogFBEvent(Events.SHOPG_LIVE_OFFER_VIDEO_CLOSE, Object.assign(dataForLog,
                        shopgLivedataForLog));
                    }
                    
                }}
            />
        )}
        </View>

    );
    
  }
}

const styles = StyleSheet.create({
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
    videoStyle: {
      width: '100%', 
      height: '100%', 
      borderWidth: 0.5, 
      borderRadius: scaledSize(8)
    },
    icon: {
      height: widthPercentageToDP(10),
      width: widthPercentageToDP(10),
      resizeMode: 'contain',
    },
  });