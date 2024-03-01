import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {AppText} from '../Texts';
import ShareComponent from './ShareComponent';
import NavigationService from '../../utils/NavigationService';
import {LogFBEvent, Events} from '../../Events';
import DataList from './DataList';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import HeaderComponent from './HeaderComponent';
import BackgroundSelector from './BackgroundSelector';
import {withTranslation} from 'react-i18next';
import { Constants } from '../../styles';

class SamplingRelevance extends Component {
    onOverlayPress = (component) => {
      const {
        itemData,
        category,
        widgetId,
        listItemIndex,
        page,
        widgetType, 
      } = this.props;
      let selectedTagName = itemData.tags[0].slug;
      
      LogFBEvent(Events.SHOPG_LIVE_WIDGET_HEADER_CLICK, {
        slug: selectedTagName,
        category: category,
        widgetId: widgetId,
        position: listItemIndex,
        page: page,
        widgetType: widgetType,
        component:component
      });

      NavigationService.navigate('TagsItems', {
        screen: 'ActiveFlashSales',
        title: itemData.title,
        selectedtagSlug: selectedTagName,
      });
  };

  render() {
    const {
      t,
      itemData,
      widgetId,
      page,
      category,
      widgetType,
      index,
      liveLoading,
      selectedTagName,
      userComponentData,
      listItemIndex,
      language,
      productName
    } = this.props;

    let title = (itemData && itemData.title) ? itemData.title : '';
    const imageBackground = (itemData && itemData.backgroundImage) ? itemData.backgroundImage : '';
    let leftPadding = (itemData && itemData.leftPadding) ? itemData.leftPadding : 0;
    const backgroundColor = (itemData && itemData.backgroundColor) ? itemData.backgroundColor : 'black';
    let timerReplaceText = itemData.rightComponentText;
    let shareMsg = (itemData && itemData.shareMsg) ? itemData.shareMsg : '';
    let shareKey = (itemData && itemData.shareKey) ? itemData.shareKey : '';
    const titleStyle = itemData.titleStyle;
    const tag = itemData.tags && itemData.tags[0];
    const descriptionStyle = itemData.descriptionStyle;
    let url = '';
    let videoSample = '';
    itemData.bannerJson[language] && itemData.bannerJson[language].map(item => {
      videoSample = item
    })
    let isVideo = videoSample && videoSample.listImageBg ? true : false;

    return (
      <View style={{borderBottomColor: '#dcdcdc', borderBottomWidth: 1}}>
      <BackgroundSelector
        t={t}
        backgroundImage={imageBackground}
        backgroundColor={backgroundColor}
        imageBackgroundStyle={{height: heightPercentageToDP(36)}}
        style={styles.dealContainer}>
         

        {
          (!imageBackground && productName && !videoSample)
          ?
          <View style={styles.textOnLeft}>
            <AppText white bold size="M">
              {t(productName)}
            </AppText>
          </View>
          : null
        }




        {tag && (
          <View style={[styles.middleComponent,styles.behind, !isVideo ? {marginLeft: widthPercentageToDP(8)} : {}]}>
              {title ? (
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
            parentMainStyle={styles.parentMainStyle}
            parentIconStyle={{marginLeft: widthPercentageToDP(30)}}
            onOverlayPress={() => this.onOverlayPress('header')}
          />
        ) : isVideo ? (<View style={{width:'100%',height:heightPercentageToDP(5.5)}}/>) : null}
            <DataList
              heightDP={36}
              title={title}
              selectedTag={tag}
              position={this.props.listItemIndex}
              widgetType={this.props.widgetType}
              category={this.props.category}
              page={this.props.page}
              widgetId={widgetId}
              viewStyle={{backgroundColor: 'transparent'}}
              leftPadding={leftPadding}
              video={isVideo ? videoSample : null}
              samplingUrl={url}
              screenName="samplingRelevance"
              endItemPress={() => this.onOverlayPress('dataList')}
            />
            
            {
              (liveLoading && tag.slug && (selectedTagName==tag.slug))
              ?
              <View style={[styles.behind,styles.activityIndicator]}>
                <ActivityIndicator
                  color="black"
                  size="large"
                />
              </View>
              :null
            }

          </View>
        )}
      </BackgroundSelector>
      {shareKey ? (
          <ShareComponent
            t={t}
            shareKey={shareKey}
            viewStyle={{
              backgroundColor: Constants.white, 
              width: widthPercentageToDP(100),
            }}
            shareMsg={shareMsg}
            widgetType={widgetType}
            category={category}
            page={page}
            widgetId={widgetId}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textOnLeft:{
    flex:1,
    justifyContent:'center',
    width:widthPercentageToDP(40)
  },
  dealContainer: {
    flexDirection: 'row',
    height: heightPercentageToDP(46),
    justifyContent:'center',
    alignItems:'center'
  },
  mainContainer: {},
  dataContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    marginTop: heightPercentageToDP(2),
    padding: heightPercentageToDP(1),
    borderRadius: 3,
  },
  mainView: {
    height: heightPercentageToDP(21),
    justifyContent: 'flex-end',
    width: widthPercentageToDP(100),
    resizeMode: 'contain',
    alignItems: 'center',
  },
  titleButtonStyle: {
    marginVertical: heightPercentageToDP(2),
    marginLeft: widthPercentageToDP(2),
    padding: heightPercentageToDP(0.6),
    width: widthPercentageToDP(50),
    alignItems: 'center',
    borderRadius: 5,
  },
   parentMainStyle: {
    height: heightPercentageToDP(9.4),
    marginTop: heightPercentageToDP(0.6),
  },
  descriptionView: {
    marginHorizontal: heightPercentageToDP(3),
    padding: heightPercentageToDP(1),
    paddingHorizontal: heightPercentageToDP(2),
    borderRadius: 7,
    alignSelf: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
  },
  playIconStyle: {
    zIndex: 1,
    position: 'absolute',
    top: heightPercentageToDP(7),
    bottom: 0,
    left: widthPercentageToDP(39),
    right: 0,
  },
  iconCLImage: {
    width: widthPercentageToDP(15),
    height: heightPercentageToDP(6.5),
    resizeMode: 'contain',
  },
  middleComponent: {
    width: '100%',
    height: heightPercentageToDP(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF80',
  },
  behind: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    borderRadius: scaledSize(5),
  },
});

const mapStateToProps = state => ({
  userPref: state.login.userPreferences,
  liveLoading: state.ShopgLive.liveLoading,
  productName: state.ShopgLive.productName,
  selectedTagName: state.ShopgLive.selectedTag,
  language: state.home.language,
});

export default withTranslation()(connect(mapStateToProps)(SamplingRelevance));
