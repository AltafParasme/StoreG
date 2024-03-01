import React, {memo, Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Rating } from 'react-native-elements';
import {Icon, Header, ButtonGroup} from 'react-native-elements';
import {Fonts, Colors} from '../../../../../assets/global';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../../../utils';
import {getProfileMarkerLabel} from '../../../pages/utils';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {AppText} from '../../../../components/Texts';
import {ListImageBG} from '../../../../components/ListImageBG/ListImageBG';
import {Constants } from '../../../../styles';
import idx from 'idx';
import DataEndListItem from '../../../../components/LiveComponents/DataEndListItem';
import VideoModal from '../../../../components/VideoModal/VideoModal';
import {Images} from '../../../../../assets/images';

class VideoReviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      videoUri: ''
    }

  }

  videoClick = (index) => {

    const {item} = this.props;
    this.setState({isModalOpen:true, videoUri: item.url})
  }

  toggle = () => {
    const {isModalOpen} = this.state;
    this.setState({isModalOpen:!this.state.isModalOpen})
  };



  render() {
    const {
    item,
    t,
    onPress,
    index,
    entityType,
    numberOfLinesEntity,
    screenName,
    widgetId,
    category,
    position,
    page,
    widgetType,
    language,
    imageWidth,
    videoClick,
    showViewAll,
    endItemPress,
    isHorizontal,
    reviewVideoThumbnail,
    reviewName,
    rating,
    backgroundStyle,
    textStyle,
    iconColor,
    showSocialIcon,
    socialMedia,
    followerCount
    } = this.props;
    const {isModalOpen, videoUri} = this.state;
    let profileMarker;
    let profileColor = '#fa6400';
    let marker = false;

  if (item.marker && Object.keys(item.marker).length) {
    marker = true;
    profileMarker =
      item.marker.ProfileMarker &&
      getProfileMarkerLabel(item.marker.ProfileMarker[0].name);
    if (profileMarker === 'New Arrival') {
      profileColor = '#dda50b';
    } else if (profileMarker === 'Top Selling') {
      profileColor = '#ec3d5a';
    } else if (profileMarker === 'Trending') {
      profileColor = '#fa6400';
    }
  }

  const thumbnail = item.thumbnail && item.thumbnail.url || item.thumbnail;
  const name = item.name && item.name.split("_")[0];
  return (
    <View style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={() => this.videoClick(index)}>
      <View style={[isHorizontal ? styles.horizontalDatalistContainer : [styles.datalistContainer,backgroundStyle]]}>
        
            <View style={[ isHorizontal ? styles.listHorizontalImageBgStyle : [styles.listImageBgStyle,backgroundStyle]]}>
                
                {/* <ListImageBG
                  language={language}
                  widgetId={widgetId}
                  position={position}
                  page={page}
                  widgetType={widgetType}
                  category={category}
                  screen="videoReviews"
                  noVideoClick={onPress}
                  imageStyle={{borderTopLeftRadius:5,borderTopRightRadius:5}}
                  style={{height:'100%',width:'100%'}}
                  item={item}
                  videoClick={videoClick}
                  strictlyVideo={reviewVideoThumbnail ? true : false}
                  reviewVideoThumbnail={reviewVideoThumbnail}
                /> */}
                <Image source={{ uri: thumbnail}} style={{resizeMode:'contain', height: '100%', width: '100%'}}/>
                <View style={styles.playIcon}>
                    <Image source={Images.play_icon} style={styles.icon} />
                </View> 
              <View style={styles.behind}>
              
                {
                  (item && item.offerinvocations && (item.offerinvocations.offerPrice === 0))
                  ?
                  <AppText style={[styles.markerWraper,{borderTopColor: '#fa6400'}]}
                      white
                      bold
                      size="XXS">
                      {t('Free Gift')}
                  </AppText>
                  :                  
                  (marker && profileMarker)
                  ?
                  <AppText style={[styles.markerWraper,{borderTopColor:profileColor}]}
                      white
                      bold
                      size="XXS">
                      {t(profileMarker)}
                  </AppText>
                  : null
                }
              </View>

            </View>
        <View style={isHorizontal ? {marginVertical: heightPercentageToDP(2), justifyContent: 'space-between'} : {}}>
          <View style={[[styles.container,backgroundStyle], isHorizontal ? {marginLeft: widthPercentageToDP(2)} : {}]}>
            <AppText size="XS" style={textStyle ? textStyle : {}}>
                {t(name)}
            </AppText>
            
            <Rating
              startingValue={rating}
              showRating={false}
              imageSize={widthPercentageToDP(4)}
              readonly
              tintColor={(backgroundStyle && backgroundStyle.backgroundColor) ? backgroundStyle.backgroundColor : Constants.greyishBlack}
              style={styles.rating}
            />
            
            {
              (showSocialIcon && followerCount)
              ?
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Icon
                  type="font-awesome"
                  name={socialMedia.toLowerCase()}
                  color={(iconColor) ? iconColor : Constants.greyishBlack}
                  size={widthPercentageToDP(4)}
                  containerStyle={{
                    alignSelf: 'center',
                  }}
                />
                <View style={{height:widthPercentageToDP(1),width:widthPercentageToDP(1)}}/>
                <AppText size="XS" style={textStyle ? textStyle : {}}>
                  {t('#COUNT# followers',{COUNT:followerCount})}
                </AppText>
              </View> : null
            }

          </View>
        </View>
      </View>

      {
        (showViewAll)
        ?
        <DataEndListItem t={t} endItemPress={endItemPress} datalistContainerProps={{height:heightPercentageToDP(26)}}/>
        :
        null
      }
      
      </TouchableOpacity>

      {isModalOpen && (
            <VideoModal
                visible={isModalOpen}
                toggleModal={this.toggle}
                videoUri={videoUri ? { video: {url: videoUri}} : ''}
                header={name}
                onClose={() => {
                    this.toggle();
                }}
            />
        )}
    </View>
  );
  }
};

const styles = StyleSheet.create({
  datalistContainer: {
    justifyContent:'center',
    height:heightPercentageToDP(27.5),
    width:heightPercentageToDP(20), 
    backgroundColor: Constants.greyishBlack,
    borderRadius: 5,
    marginHorizontal:widthPercentageToDP(0.8)
  },
  horizontalDatalistContainer: {
    justifyContent: 'space-between',
    height:heightPercentageToDP(17),
    width:heightPercentageToDP(34), 
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingHorizontal: heightPercentageToDP(1),
    marginHorizontal:widthPercentageToDP(0.8)
  },
  container: {
    height:heightPercentageToDP(8),
    width:heightPercentageToDP(18),
    paddingHorizontal:widthPercentageToDP(1),
    flexDirection: 'column',
    backgroundColor: Constants.greyishBlack,
    borderColor: Constants.liveItemBorder,
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
    borderLeftWidth:0.5,
    borderRightWidth:0.5,
    borderBottomWidth:0.5,
    justifyContent:'center',
  },
  listImageBgStyle:{
    height:heightPercentageToDP(18),
    width:heightPercentageToDP(18),
    justifyContent: 'center', 
    alignItems: 'center',
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    borderColor: Constants.liveItemBorder,
    borderWidth:0.5
  },
  listHorizontalImageBgStyle:{
    height:heightPercentageToDP(13),
    width:heightPercentageToDP(13),
    marginTop: heightPercentageToDP(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    borderColor: Constants.liveItemBorder,
    borderWidth:0.5
  },
  image: {
    height: scaledSize(150),
    width: scaledSize(150),
    resizeMode: 'contain',
  },
  textStyle: {
    flexWrap: 'wrap',
    fontFamily: Fonts.roboto,
    textAlign: 'left',
  },
  playIcon: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 30,
    width: '100%',
    height:'100%',
    borderRadius:scaledSize(5),
  },
  icon: {
    height: widthPercentageToDP(10),
    width: widthPercentageToDP(10),
    resizeMode: 'contain',
  },
  behind: {
    alignItems: 'flex-end',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height:'100%',
    borderRadius:scaledSize(5),
  },
  markerWraper:{
    position: 'absolute',
    bottom: heightPercentageToDP(1),
    top:0,
    right: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: widthPercentageToDP(6),
    borderTopWidth: widthPercentageToDP(6),
    paddingRight:widthPercentageToDP(1),
    borderTopRightRadius:5,
    borderLeftColor: 'transparent',
    textAlign:'right',
    textAlignVertical:'center'
    // borderTopColor: 'red',
  },
  rating:{
    width:widthPercentageToDP(20)
  }
});

const mapStateToProps = state => ({
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(VideoReviews))
);