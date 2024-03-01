import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator, Image} from 'react-native';
import {connect} from 'react-redux';
import {AppText} from '../Texts';
import ShareComponent from './ShareComponent';
import NavigationService from '../../utils/NavigationService';
import HeaderComponent from './HeaderComponent';
import {LogFBEvent, Events} from '../../Events';
import DataList from './DataList';
import DataListItem from './DataListItem';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import BackgroundSelector from './BackgroundSelector';
import {withTranslation} from 'react-i18next';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import ProductDetails from './ProductDetails';

class VideoRelevance extends Component {
    onOverlayPress = (component) => {
        const {
          itemData,
          category,
          widgetId,
          listItemIndex,
          page,
          widgetType, 
          selectedTagName,
          language,
        } = this.props;

        let languageItemData = (itemData && itemData[language]) ? itemData[language] : itemData;
        
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
          title: (languageItemData && languageItemData.title) ? languageItemData.title : '',
          selectedtagSlug: selectedTagName,
        });
      };

      handleOtherItemClick = item => {
        const {
          dispatch,
          widgetId,
          listItemIndex,
          page,
          category,
          widgetType,
        } = this.props;
        LogFBEvent(Events.OFFER_LIST_CLICK_PDP, {
          offerId: item.offerinvocations.offerId,
          widgetId: widgetId,
          position: listItemIndex,
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
      language
    } = this.props;

    if(!itemData) return(<View />);

    let languageItemData = (itemData && itemData[language]) ? itemData[language] : itemData;

    let title = languageItemData.title;
    const imageBackground = languageItemData.backgroundImage;
    let leftPadding = languageItemData.leftPadding;
    const backgroundColor = languageItemData.backgroundColor;
    let timerReplaceText = languageItemData.rightComponentText;
    let message = t(languageItemData.shareMessage, {NL : '\n'});
    let shareMsg = languageItemData.shareMsg;
    let shareKey = languageItemData.shareKey;
    let productDetails = languageItemData.productDetials;
    const titleStyle = languageItemData.titleStyle;

    return (
      <BackgroundSelector
        backgroundImage={imageBackground}
        backgroundColor={backgroundColor}
        imageBackgroundStyle={{height: heightPercentageToDP(36),  marginBottom: heightPercentageToDP(2)}}
        style={styles.dealContainer}>
        <View style={styles.mainContainer}>
               {title ? (
        <HeaderComponent
            t={t}
            title={title}
            titleStyle={titleStyle}
            index={listItemIndex}
            category={category}
            page={page}
            isNotTimer
            widgetType={widgetType}
            widgetId={widgetId}
            selectedtagSlug={tag.slug}
            timerReplaceText={timerReplaceText}
            parentMainStyle={{
              height: heightPercentageToDP(9.4),
              marginTop: heightPercentageToDP(0.6),
            }}
            parentIconStyle={{marginLeft: widthPercentageToDP(30)}}
            onOverlayPress={() => this.onOverlayPress('header')}
          />
        ) : <View style={{width:'100%',height:heightPercentageToDP(5.5)}}/>}
        </View>
        <View style={[styles.dataContainer, {marginLeft: widthPercentageToDP(leftPadding)}]}>
            {productDetails && (
                <View style={[styles.middleComponent]}>
                 <ProductDetails
                       widgetId={widgetId}
                       category={category}
                       position={listItemIndex}
                       page={page}
                       shareMessage={message}
                       widgetType={widgetType}
                       screenName={'SendVideoRelevance'}
                       item={productDetails}
                       onPress={() => this.handleOtherItemClick(productDetails)}
                       index={listItemIndex}
                       language={language}
                    />
                </View>)
            }
            </View>
        {shareKey ? (
          <ShareComponent
            t={t}
            shareKey={shareKey}
            shareMsg={shareMsg}
            widgetType={widgetType}
            category={category}
            page={page}
            widgetId={widgetId}
          />
        ) : null}
      </BackgroundSelector>
    );
  }
}

const styles = StyleSheet.create({
  dealContainer: {
    flexDirection: 'column',
    margin: heightPercentageToDP(1),
  },
  mainContainer: {},
  dataContainer: {
    alignItems: 'center',
    alignSelf: 'center',
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
  imageStyle: {
    height: heightPercentageToDP(22),
    resizeMode: 'contain',
    width: widthPercentageToDP(96),
    borderRadius: 5,
  },
  titleButtonStyle: {
    marginVertical: heightPercentageToDP(2),
    marginLeft: widthPercentageToDP(2),
    padding: heightPercentageToDP(0.6),
    width: widthPercentageToDP(50),
    alignItems: 'center',
    borderRadius: 5,
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
    height: heightPercentageToDP(18),
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
    width: widthPercentageToDP(97),
    height: '100%',
    borderRadius: scaledSize(5),
  },
});

const mapStateToProps = state => ({
  userPref: state.login.userPreferences,
  liveLoading: state.ShopgLive.liveLoading,
  selectedTagName: state.ShopgLive.selectedTag,
  language: state.home.language,
});

export default withTranslation()(connect(mapStateToProps)(VideoRelevance));
