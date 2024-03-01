import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {Card} from 'react-native-elements';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import {withTranslation} from 'react-i18next';
import {AppText} from '../Texts';
import BackgroundSelector from './BackgroundSelector';
import {Constants} from '../../styles';
import DataList from './DataList';
import HeaderComponent from './HeaderComponent';
import ShareComponent from './ShareComponent';
import {LogFBEvent, Events} from '../../Events';
import {Colors} from '../../../assets/global';
import {connect} from 'react-redux';
import moment from 'moment';
import VideoComponent from './VideoComponent';
import NavigationService from '../../utils/NavigationService';

export class Relevance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasVideoPressed: false
    };
  }

  componentDidMount() {
    const {category,widgetId,index,listItemIndex,widgetType, page} = this.props;
    
    LogFBEvent(Events.SHOPG_LIVE_IMPRESSION,{
      category:category,
      widgetId: widgetId,
      position:listItemIndex,
      order:index,
      widgetType:widgetType,
      page: page
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {itemCategory, activeCategoryTab, page} = nextProps;
    if(page == 'Home' && !itemCategory.includes(activeCategoryTab))
    return false;
    return true;
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
      selectedTagSlug:  itemData.tags[0].slug,
      isVideoRelevance: isVideoRelevance,
      title:title,
      widgetId: widgetId,
      widgetType: widgetType,
      page: page,
      category: category
    });
  };

  onOverlayPress = (component) => {
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
      component:component
    });

    NavigationService.navigate('TagsItems', {
      screen: screenName,
      title: title,
      selectedtagSlug: selectedSlug,
    });
  };

  render() {
    let {t, itemData, index, widgetId, category, page, widgetType, liveLoading,selectedTagName, language, doNotShowTitle} = this.props;
    let description = itemData.description;
    let title = itemData.title;
    const imageBackground = itemData.backgroundImage;
    let timerReplaceText = itemData.rightComponentText;
    const backgroundColor = doNotShowTitle ? 'white' : itemData.backgroundColor;
    const titleStyle = itemData.titleStyle;
    let topPadding = itemData.topPadding;
    let isHorizontal = itemData.isHorizontal;
    let heightDP = isHorizontal ? 18 : 36;
    const descriptionStyle = itemData.descriptionStyle;
    const descriptionContainerStyle = itemData.descriptionContainerStyle ? itemData.descriptionContainerStyle : {backgroundColor: backgroundColor};
    let shareMsg = itemData.shareMsg;
    let shareKey = itemData.shareKey;
    const tag = itemData.tags[0];
    let imageHeight = itemData.imageHeight;
    let listItemIndex = this.props.listItemIndex ? this.props.listItemIndex : 0;
    let videoSample = '';
    itemData.bannerJson && Object.keys(itemData.bannerJson).length && itemData.bannerJson[language] && itemData.bannerJson[language].map(item => {
      videoSample = item
    })
    let isVideo = videoSample && videoSample.listImageBg ? true : false;
    let topTitle = itemData.topTitle ? itemData.topTitle : 'WATCH & BUY'
    return (
      <View>
      {
        isVideo ? (
        <View>
          <VideoComponent 
            video={videoSample}
            parentMainStyle={{
              height: widthPercentageToDP(55),
              width: widthPercentageToDP(100),
              alignSelf: 'center'
            }}
            iconStyle={{top: heightPercentageToDP(10), }}
            widgetId={widgetId}
            category={category}
            position={listItemIndex}
            page={page}
            widgetType={widgetType}
            videoClick={() => this.videoClick(0, videoSample)}
            language={language}
          />
         </View>
        )
        : null
      }
      <BackgroundSelector
        backgroundImage={typeof imageBackground === 'object' ? imageBackground && imageBackground[language] && imageBackground[language][0].url : imageBackground}
        imageBackgroundStyle={ [isHorizontal ? {height: heightPercentageToDP(32)} 
          : {},
          imageHeight ? {height: heightPercentageToDP(imageHeight)} : {},
        ]}
        backgroundColor={backgroundColor}
        style={styles.dealContainer}>
        {!isVideo && title && !doNotShowTitle ? (
          <HeaderComponent
            t={t}
            title={title}
            titleStyle={titleStyle}
            index={listItemIndex}
            category={category}
            page={page}
            widgetType={widgetType}
            widgetId={widgetId}
            selectedtagSlug={tag.slug}
            timerReplaceText={timerReplaceText}
            parentMainStyle={isHorizontal ? styles.horizontalParentMainStyle : styles.parentMainStyle}
            parentIconStyle={{marginLeft: widthPercentageToDP(30)}}
            onOverlayPress={() => this.onOverlayPress('header')}
          />
        ) 
        :
        doNotShowTitle ? null
        :
        <View />}
        <View style={styles.mainView}>
          {!isVideo && description ? (
            <View style={[styles.dataHeading,{backgroundColor:(backgroundColor && backgroundColor!='') ? backgroundColor : Colors.greenishBlue},descriptionContainerStyle]}>
                <AppText white bold size="XS">
                  {t(description)}
                </AppText>
            </View>

          ) : null}
            <View style={[styles.dataContainer, 
                {height: heightPercentageToDP(heightDP + 2)},
                  !isHorizontal ? { justifyContent: 'center', 
                  marginTop:topPadding ? heightPercentageToDP(topPadding) : heightPercentageToDP(0),
                  backgroundColor: 'white', } : {
                    marginTop: heightPercentageToDP(5.3)
                  }]}>
              {tag && (
                <View style={[styles.middleComponent, {
                  height: heightPercentageToDP(heightDP + 2)},
                  ]}>
                  <DataList
                    heightDP={heightDP}
                    isHorizontal={isHorizontal}
                    selectedTag={tag}
                    position={listItemIndex}
                    widgetType={this.props.widgetType}
                    category={this.props.category}
                    page={this.props.page}
                    widgetId={widgetId}
                    screenName="relevance"
                    endItemPress={() => this.onOverlayPress('dataList')}
                  />
                  
                  {
                    (liveLoading && (selectedTagName==tag.slug))
                    ?
                    <View style={[styles.behind,styles.activityIndicator, 
                    isHorizontal ? {
                      marginTop: heightPercentageToDP(2.7)
                    } : {
                      justifyContent: 'center',
                    }
                    ]}>
                      <ActivityIndicator
                        color="black"
                        size="large"
                      />
                    </View>
                    :null
                  }
      
                </View>
                
              )}
            </View>
        </View>
      </BackgroundSelector>
      {shareKey ? 
        <ShareComponent t={t} 
        shareKey={shareKey} shareMsg={shareMsg} widgetType={widgetType}
        viewStyle={{backgroundColor: Constants.white, width: widthPercentageToDP(100)}}
        category={category}
        page={page}
        widgetId={widgetId}/> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dealContainer: {
    flexDirection: 'column',
  },
  mainView: {
    flex: 1,
    width: widthPercentageToDP(98),
    alignSelf: 'center',
  },
  descriptionView: {
    marginHorizontal: heightPercentageToDP(3),
    padding: heightPercentageToDP(1),
    paddingHorizontal: heightPercentageToDP(2),
    borderRadius: 7,
    alignSelf: 'center',
  },
  parentMainStyle: {
    height: heightPercentageToDP(9.4),
    marginTop: heightPercentageToDP(0.6),
  },
  horizontalParentMainStyle: {
    height: heightPercentageToDP(6.4),
    marginTop: heightPercentageToDP(0.6),
  },
  recommendedCard: {
    width: widthPercentageToDP(95),
    backgroundColor: Constants.white,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: heightPercentageToDP(3),
  },
  dataContainer: {
    alignItems: 'center',
    borderRadius: scaledSize(3),
  },
  middleComponent:{
    width: '100%',
    //height:heightPercentageToDP(35),
   justifyContent: 'center',
    alignItems:'center',
  },
  activityIndicator:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#FFFFFF80'
  },
  behind: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: widthPercentageToDP(97),
    height:'100%',
    borderRadius:scaledSize(5),
  },
  dataHeading:{
    height:heightPercentageToDP(3),
    justifyContent: 'center',
    alignSelf:'center',
    alignItems:'center',
    width:widthPercentageToDP(80),
    borderTopLeftRadius:scaledSize(5),
    borderTopRightRadius:scaledSize(5),
  },
});

const mapStateToProps = state => ({
  liveLoading: state.ShopgLive.liveLoading,
  selectedTagName: state.ShopgLive.selectedTag,
  language: state.home.language,
  activeCategoryTab: state.home.activeCategoryTab,
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(Relevance)
);