import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import DataListItem from './DataListItem';
import DataListItemCoin from './DataListItemCoin';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../utils';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {LogFBEvent, Events} from '../../Events';
import {AppText} from '../Texts';
import NavigationService from '../../utils/NavigationService';
import {GetLiveOfferList} from '../../native/pages/ShopgLive/redux/actions';
import { Image } from 'react-native-elements';
import { showToastr } from '../../native/pages/utils';
import VideoComponent from './VideoComponent';

export class DataList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation: new Animated.Value(1),
      hasScrollingStarted: false
    };
  }

  componentDidMount() {
    const {
      selectedTag,
      category,
      widgetId,
      position,
      widgetType,
      page,
    } = this.props;
    LogFBEvent(Events.OFFER_LIST_IMPRESSION, {
      slug: selectedTag.slug,
      category: category,
      widgetId: widgetId,
      position: position,
      page: page,
      widgetType: widgetType,
    });
  }

  onLoadMore = () => {
    const {offerList} = this.props;
    let listToShow = [];
    if (offerList && offerList.length && offerList.length > 0) {
      offerList.map(offer => {
        if (offer.tag == this.props.selectedTag.slug) {
          listToShow = [...offer.data];
        }
      });
    }
    let pageSize = 5;
    if(listToShow.length>=pageSize){
    const page = Math.ceil(listToShow.length / 5) + 1;
    this.props.getOffers(this.props.selectedTag.slug, page);
    }
  };

  fadeOut = () => {
    if (!this.state.hasScrollingStarted) {
      this.setState({ 
        animation: this.state.animation,
        hasScrollingStarted: true
      });
    }
  }
        

  headerComponent = () => {
    let {
      offerList, 
      widgetType, 
      leftPadding, 
      video, 
      language,
      widgetId,
      category,
      position,
      page,
      screenName,
    } = this.props;
    const {hasScrollingStarted} = this.state;
    let listToShow = [];
    if (offerList && offerList.length && offerList.length > 0) {
      offerList.map(offer => {
        if (offer.tag == this.props.selectedTag.slug) {
          listToShow = [...offer.data];
        }
      });
    }
    if ((listToShow && listToShow.length && listToShow.length == 1) || 
    (widgetType === 'samplingRelevance'
     && (!hasScrollingStarted || (video && Object.keys(video).length)))) {
    
      if (video && Object.keys(video).length) {
        return (
         <VideoComponent 
         video={video} 
         parentMainStyle={{
          height: heightPercentageToDP(34)}}
         leftPadding={leftPadding}
         widgetId={widgetId}
         category={category}
         position={position}
         page={page}
         widgetType={widgetType}
         videoClick={() => this.videoClick(0, video)}
         language={language}
         />
        );
      } else if (screenName === 'samplingRelevance'){
        return (
          <View
            style={[styles.imageView, {width: widthPercentageToDP(leftPadding ? leftPadding: 54)}]}>
          </View>
         
        );
      } else {
        return null;
      }
     
    } else {
      return <View></View>;
    }
  };

  handleOtherItemClick = item => {
    const {
      dispatch,
      widgetId,
      position,
      page,
      category,
      widgetType,
    } = this.props;
    LogFBEvent(Events.OFFER_LIST_CLICK_PDP, {
      offerId: item.offerinvocations.offerId,
      widgetId: widgetId,
      position: position,
      page: page,
      category: category,
      widgetType: widgetType,
    });
    dispatch({
      type: 'booking/SET_STATE',
      payload: {
        refreshScreen: true,
        booking: item,
        quantity: 1,
      },
    });
    NavigationService.navigate('Booking');
  };

  videoClick = (index, isVideo) => {
    const {offerList, dispatch, video, widgetId, widgetType, page, category, title} = this.props;
    let listToShow = [];
    if (offerList && offerList.length && offerList.length > 0 && !isVideo) {
      offerList.map(offer => {
        if (offer.tag == this.props.selectedTag.slug) {
          listToShow = [...offer.data];
        }
      });
    } else {
      listToShow = [video]
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
      selectedTagSlug: this.props.selectedTag.slug,
      isVideoRelevance: isVideoRelevance,
      title:title,
      widgetId: widgetId,
      widgetType: widgetType,
      page: page,
      category: category
    });
  };

  render() {
    const {
      t,
      offerList,
      screenName,
      widgetId,
      widgetType,
      category,
      position,
      page,
      dispatch,
      viewStyle,
      language, 
      imageWidth, 
      endItemPress,
      isHorizontal,
      numberOfLinesEntity,
      video,
      isCommmunityRelevance,
      liveLoading,
      loadingTags,
      selectedTag
    } = this.props;

    let listToShow = [];
    if (offerList && offerList.length && offerList.length > 0) {
      offerList.map(offer => {
        if (offer.tag == selectedTag.slug) {
          listToShow = [...offer.data];
        }
      });
      
      if (listToShow && listToShow.length && listToShow[0].mediaJson) 
      dispatch({
        type: 'shopglive/SET_STATE',
        payload: {
          productName: listToShow[0].mediaJson.title.text,
        },
      });
    }
    let shouldShowList = (listToShow && listToShow.length && listToShow.length>0);
    let shouldShowLoading = (liveLoading && loadingTags.includes((selectedTag && selectedTag.slug) ? selectedTag.slug : ''));
    return (
      <View
      style={[styles.dataContainer, viewStyle, {height: this.props.heightDP ? heightPercentageToDP(this.props.heightDP) : 36}]}>
         {
           (shouldShowList)
           ?
           <View style={isHorizontal ? styles.listInnerHorizontal :  styles.listInner}>
            <FlatList
            horizontal={true}
            onEndReached={() => this.onLoadMore()}
            onEndReachedThreshold={0.01}
            data={listToShow}
            extraData={listToShow}
            onScroll={this.fadeOut}
            ListHeaderComponent={this.headerComponent}
            renderItem={({item, index}) => {
              return(
                <DataListItem
                  showViewAll={listToShow.length && (listToShow.length>1) && (listToShow.length == index + 1)}
                  imageWidth={imageWidth}
                  isHorizontal={isHorizontal}
                  heightDP={this.props.heightDP}
                  widgetId={widgetId}
                  category={category}
                  position={position}
                  page={page}
                  isCommmunityRelevance={isCommmunityRelevance}
                  widgetType={widgetType}
                  screenName={screenName}
                  item={item}
                  numberOfLinesEntity={numberOfLinesEntity}
                  onPress={() => this.handleOtherItemClick(item)}
                  index={index}
                  language={language}
                  videoClick={() => this.videoClick(index)}
                  endItemPress={endItemPress}
                />
                )
              }
            }
            keyExtractor={item => item.refId}
            showsHorizontalScrollIndicator={false}
          />
         </View>
        :
        (shouldShowLoading)
        ?
        <ActivityIndicator color="black" size="large" />
        :
        <AppText red bold size="M">{t('No Products Available')}</AppText>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
    dataContainer: {
      justifyContent: 'center',
      alignItems:'center',
      borderRadius:scaledSize(5),
    },
    dataListContainer:{
      height:heightPercentageToDP(26),
      width:widthPercentageToDP(39),
      alignSelf:'center',
      alignItems:'center',
      justifyContent:'center'
    },
    listInner:{
      width:widthPercentageToDP(97),
      paddingHorizontal:widthPercentageToDP(0.8)
    },
    listInnerHorizontal:{
      width:widthPercentageToDP(100),
      paddingHorizontal:widthPercentageToDP(2)
    },
    imageView: {
      marginRight: widthPercentageToDP(2),
      justifyContent: 'center',
    }
});

const mapStateToProps = state => ({
    liveLoading: state.ShopgLive.liveLoading,
    loadingTags: state.ShopgLive.loadingTags,
    offerList: state.ShopgLive.liveOfferList,
    language: state.home.language,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
    dispatch,
    getOffers: (tag,page) => {
      dispatch(GetLiveOfferList(tag,page));
    },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(DataList))
);
