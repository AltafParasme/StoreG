import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator, Image} from 'react-native';
import {Card} from 'react-native-elements';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import {withTranslation} from 'react-i18next';
import {AppText} from '../Texts';
import {Images} from '../../../assets/images';
import {Constants} from '../../styles';
import DataListVideoReview from './DataListVideoReview';
import HeaderComponent from './HeaderComponent';
import ShareComponent from './ShareComponent';
import {LogFBEvent, Events} from '../../Events';
import {Colors} from '../../../assets/global';
import {connect} from 'react-redux';
import moment from 'moment';
import BackgroundSelector from './BackgroundSelector';
import NavigationService from '../../utils/NavigationService';

export class VideoReviews extends Component {

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

  onOverlayPress = (component) => {
    const {
      itemData,
      category,
      page,
      widgetId,
      widgetType,
      index,
      language,
    } = this.props;

    let languageItemData = (itemData && itemData[language]) ? itemData[language] : itemData;

    const title=languageItemData ? languageItemData.title : 'Flash Sales';
    const selectedTag=languageItemData ? languageItemData.tags[0] : '';

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
    let {t, itemData, index, widgetId, category, page, widgetType, liveLoading,selectedTagName,language} = this.props;
    if(!itemData) return(<View />);

    let languageItemData = (itemData && itemData[language]) ? itemData[language] : itemData;
    
    let description = languageItemData.description;
    let title = languageItemData.title ? languageItemData.title : undefined;

    let promoHeader = languageItemData.promoHeader ? languageItemData.promoHeader : undefined;
    let promoHeaderColor = languageItemData.promoHeaderColor ? languageItemData.promoHeaderColor : '';
    let promoSubHeader = languageItemData.promoSubHeader ? languageItemData.promoSubHeader : undefined;
    let promoSubHeaderColor = languageItemData.promoSubHeaderColor ? languageItemData.promoSubHeaderColor : undefined;

    let widgetHeader = languageItemData.widgetHeader ? languageItemData.widgetHeader : undefined;
    const imageBackground = languageItemData.backgroundImage ? languageItemData.backgroundImage : undefined;
    let promoImage = languageItemData.promoImage ? languageItemData.promoImage : undefined;
    let timerReplaceText = languageItemData.rightComponentText;

    let middleComponentBGColor = languageItemData.middleComponentBGColor ? languageItemData.middleComponentBGColor : Constants.white;
    let middleComponentTextColor = languageItemData.middleComponentTextColor ? languageItemData.middleComponentTextColor : Constants.white;
    
    let showSocialIcon = languageItemData.showSocialIcon ? languageItemData.showSocialIcon :  false;
    let iconColor = languageItemData.iconColor ? languageItemData.iconColor :  Constants.white;
    const backgroundColor = languageItemData.backgroundColor ? languageItemData.backgroundColor : Constants.greyishBlack;
    const titleStyle = languageItemData.titleStyle;
    let isHorizontal = languageItemData.isHorizontal;
    let heightDP = isHorizontal ? 18 : 36;
    const descriptionStyle = languageItemData.descriptionStyle;
    const descriptionContainerStyle = languageItemData.descriptionContainerStyle ? languageItemData.descriptionContainerStyle : {backgroundColor: backgroundColor};
    let shareMsg = languageItemData.shareMsg;
    let shareKey = languageItemData.shareKey;
    const tag = languageItemData.tags[0];
    let listItemIndex = this.props.listItemIndex ? this.props.listItemIndex : 0;
    const isCustomerReview = languageItemData.isCustomerReview;

    return ( 
      <View>
      {
        (widgetHeader)
        ?
        <View style={{alignItems:'center', paddingVertical: heightPercentageToDP(1.6),backgroundColor:'white'}}>
          <AppText bold style={{fontFamily: 'Oswald-SemiBold'}}>{t(widgetHeader)}</AppText>
        </View> : null
      }

      <BackgroundSelector
        backgroundImage={imageBackground}
        backgroundColor={backgroundColor}
        backgroundEndColor={backgroundColor}
        style={[styles.dealContainer]}>

        {
          (promoImage)
          ?
          <View style={{margin:widthPercentageToDP(2)}}>
              <Image source={{uri:promoImage}} style={{height:heightPercentageToDP(6),width:'100%', resizeMode: 'contain'}}/>
          </View> : null
        }

        {title ? (
          <View style={{flex:1,height:heightPercentageToDP(7),alignItems:'center',flexDirection:'row',paddingHorizontal:heightPercentageToDP(2)}}>
            <Image source={Images.ratings_icon} style={{height:heightPercentageToDP(5),width:heightPercentageToDP(5)}} />
            <View style={{height:heightPercentageToDP(1),width:heightPercentageToDP(1)}}/>
            <AppText white bold size="S">
              {t(title)}
            </AppText>
          </View>
        ) : <View />}

        {
          (promoHeader)
          ?
          <View style={{alignItems:'center', paddingVertical: heightPercentageToDP(1.6)}}>
            <AppText bold size="XL" style={{fontFamily: 'Oswald-SemiBold',color:promoHeaderColor}}>
              {t(promoHeader)}
            </AppText>
            <AppText size="L" style={{fontFamily: 'Oswald-SemiBold',color:promoSubHeaderColor}}>
              {t(promoSubHeader)}
            </AppText>
          </View> : null
        }
        {tag && (
          <View style={styles.middleComponent}>
            <DataListVideoReview
              heightDP={heightDP}
              isHorizontal={isHorizontal}
              selectedTag={tag}
              position={listItemIndex}
              widgetType={this.props.widgetType}
              category={this.props.category}
              page={this.props.page}
              widgetId={widgetId}
              viewStyle={{backgroundColor:middleComponentBGColor}}
              screenName="VideoReviews"
              endItemPress={() => this.onOverlayPress('dataList')}
              middleComponentBGColor={middleComponentBGColor}
              middleComponentTextColor={middleComponentTextColor}
              showSocialIcon={showSocialIcon}
              iconColor={iconColor}
              isCustomerReview={isCustomerReview}
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
      <View style={styles.emptyView}/>
      {shareKey ? 
        <ShareComponent t={t} 
        shareKey={shareKey} shareMsg={shareMsg} widgetType={widgetType}
        viewStyle={{backgroundColor: Constants.white, width: widthPercentageToDP(100)}}
        category={category}
        page={page}
        widgetId={widgetId}/> : null}
      </BackgroundSelector>
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
    height:heightPercentageToDP(35),
  },
  middleComponent:{
    width: '100%',
    height:heightPercentageToDP(28),
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
  emptyView:{
    height:heightPercentageToDP(0.3),
    width:widthPercentageToDP(100)
  }
});

const mapStateToProps = state => ({
  liveLoading: state.ShopgLive.liveLoading,
  selectedTagName: state.ShopgLive.selectedTag,
  language: state.home.language
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(VideoReviews)
);