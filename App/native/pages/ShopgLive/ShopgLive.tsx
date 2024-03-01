import React, {Component} from 'react';
import {StyleSheet, View, BackHandler, Linking, Image} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import idx from 'idx';
import {Constants} from '../../../styles';
import FlashSales from '../../../components/LiveComponents/FlashSales';
import PrivateLabel from '../../../components/LiveComponents/PrivateLabel';
import CoinRewards from '../../../components/LiveComponents/CoinRewards';
import CoinSampleRelevance from '../../../components/LiveComponents/CoinSampleRelevance';
import Questionnaire from '../../../components/LiveComponents/Questionnaire';
import Relevance from '../../../components/LiveComponents/Relevance';
import BannerRelevance from '../../../components/LiveComponents/BannerRelevance';
import CustomerFeedBack from '../../../components/LiveComponents/CustomerFeedBack';
import VideoReviews from '../../../components/LiveComponents/VideoReviews';
import {heightPercentageToDP} from '../../../utils';
import {FlatList} from 'react-native-gesture-handler';
import ScratchRewards from '../../../components/LiveComponents/ScratchRewards';
import CLOnboard from '../../../components/LiveComponents/CLOnboard';
import SamplingRelevance from '../../../components/LiveComponents/SamplingRelevance';
import VideoRelevance from '../../../components/LiveComponents/VideoRelevance';
import DhamakaCashback from '../../../components/LiveComponents/DhamakaCashback';
import CommunityRelevance from '../../../components/LiveComponents/CommunityRelevance';
import {getWidgets} from '../Home/redux/action';

class ShopgLive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      querySnapshot: [],
    };
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {screenName, activeCategoryTab, categoryTab} = this.props;

    if(screenName == 'Home') {
      if(nextProps.activeCategoryTab == nextProps.categoryTab) {
        return true;
      }
      return false;
    }
    
    return true;
  }

  handleLoadMore() {
    const {t, activeCategoryTab, screenName, shopglive, userPreferences, groupCode} = this.props;
    const userId = userPreferences.uid;

    const page = idx(shopglive, _ => _.widgetList[activeCategoryTab].page);
    const limitReached = shopglive.widgetList && shopglive.widgetList[activeCategoryTab] && shopglive.widgetList[activeCategoryTab].limitReached;
    if(!limitReached && screenName == 'Home'){
      this.props.onGetWidgets(true, true, 'Home', userId, () => {}, activeCategoryTab, groupCode, page + 1, 3);
    }
  }

  render() {
    const {t, activeCategoryTab, index, screenName, liveComponentsData, isCLMode, handleScratchCardSwipe} = this.props;
    
    const {querySnapshot, widgetList, cartPageWidgets} = this.props.shopglive;
    
    //if (!querySnapshot || !querySnapshot.length) return null;
    let widgetData = [];
    let listItemIndex = index;
    let itemData = null, itemCategory;
    if(screenName == 'Home'){
      widgetData = (widgetList && widgetList[activeCategoryTab] && widgetList[activeCategoryTab].data);
    }
    else if(screenName == 'CartDetail') {
      widgetData = cartPageWidgets;
    }
    else {
      widgetData = querySnapshot;
    }

   
    
    return (
      <View>
        <FlatList
          data={widgetData}
          listKey={(item, index) => index.toString()}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => {
            const componentType = item.data ? item.data.widgetType : '';
            const isActive = item.data && item.data.isActive;
            if (!isActive) return null;
            
            const {page} = item.data;
            let productData =  item.data ? item.data.data : undefined;
            itemData = item.data ? item.data.widgetData : undefined;
            itemCategory = item.data ? item.data.category: [];
            const pageArray = idx(item, _ => _.data.page);
            let isComponentEnabled = pageArray.includes(screenName);
            if (isComponentEnabled) {
              switch (componentType) {
                case 'flashSale':
                  return (
                    <FlashSales
                      widgetId={item.id}
                      widgetType={componentType}
                      index={index}
                      listItemIndex={listItemIndex}
                      page={screenName}
                      category={activeCategoryTab}
                      itemData={itemData ? itemData : undefined}
                      t={t}
                    />
                  );
                case 'Questionnaire':
                  return (
                    <Questionnaire
                      itemData={itemData ? itemData : undefined}
                      t={t}
                      widgetId={item.id}
                      page={screenName}
                      index={index}
                      listItemIndex={listItemIndex}
                      category={activeCategoryTab}
                      widgetType={componentType}
                    />
                  );
                case 'relevance':
                  return (
                    <Relevance
                      itemData={itemData ? itemData : undefined}
                      widgetId={item.id}
                      page={screenName}
                      index={index}
                      listItemIndex={listItemIndex}
                      itemCategory={itemCategory}
                      category={activeCategoryTab}
                      widgetType={componentType}
                    />
                  );
                case 'bannerRelevance':
                  return (
                    <BannerRelevance
                      itemData={itemData}
                      t={t}
                      widgetId={item.id}
                      page={screenName}
                      index={index}
                      listItemIndex={listItemIndex}
                      category={activeCategoryTab}
                      widgetType={componentType}
                    />
                  );
                case 'customerFeedback':
                  return (
                    <CustomerFeedBack
                      userComponentData={item.data ? item.data.data: {}}
                      itemData={itemData ? itemData : undefined}
                      widgetId={item.id}
                      productData={productData}
                      wuserId={item.data.wuserId}
                      page={screenName}
                      index={index}
                      listItemIndex={listItemIndex}
                      category={activeCategoryTab}
                      widgetType={componentType}
                      t={t}
                    />
                  );
                case 'scratchCardRewards':
                  return (
                    <ScratchRewards
                      itemData={itemData ? itemData : undefined}
                      widgetId={item.id}
                      page={page}
                      userComponentData={item.data ? item.data.data: {}}
                      index={index}
                      listItemIndex={listItemIndex}
                      wuserId={item.data.wuserId}
                      handleScratchCardSwipe={handleScratchCardSwipe}
                      category={activeCategoryTab}
                      widgetType={componentType}
                      t={t}
                    />
                  );
                  case 'imageBanner':
                  return (
                    <CLOnboard
                        itemData={itemData ? itemData : undefined}
                        widgetId={item.id}
                        page={screenName}
                        userComponentData={item.data ? item.data.data: {}}
                        index={index}
                        isCLMode={isCLMode}
                        listItemIndex={listItemIndex}
                        category={activeCategoryTab}
                        widgetType={componentType}
                        t={t}
                      />
                  )
                  case 'samplingRelevance': 
                  return (
                    <SamplingRelevance
                        itemData={itemData ? itemData : undefined}
                        widgetId={item.id}
                        page={screenName}
                        userComponentData={item.data ? item.data.data: {}}
                        index={index}
                        listItemIndex={listItemIndex}
                        category={activeCategoryTab}
                        widgetType={componentType}
                        t={t}
                      />
                  )
                  case 'coinSampleRelevance': 
                  return (
                    <CoinSampleRelevance
                        itemData={itemData ? itemData : undefined}
                        widgetId={item.id}
                        page={screenName}
                        userComponentData={item.data ? item.data.data: {}}
                        index={index}
                        listItemIndex={listItemIndex}
                        category={activeCategoryTab}
                        widgetType={componentType}
                        t={t}
                      />
                  )
                  case 'videoRelevance': 
                  return (
                    <VideoRelevance
                        itemData={itemData ? itemData : undefined}
                        widgetId={item.id}
                        page={screenName}
                        userComponentData={item.data ? item.data.data: {}}
                        index={index}
                        listItemIndex={listItemIndex}
                        category={activeCategoryTab}
                        widgetType={componentType}
                        t={t}
                      />
                  )
                  case 'privateLabel':
                    return (
                      <PrivateLabel
                        widgetId={item.id}
                        widgetType={componentType}
                        index={index}
                        listItemIndex={listItemIndex}
                        page={screenName}
                        category={activeCategoryTab}
                        itemData={itemData ? itemData : undefined}
                        itemCategory={itemCategory}
                        t={t}
                      />
                    );
                  case 'coinRewards':
                    return (
                      <CoinRewards
                        widgetId={item.id}
                        widgetType={componentType}
                        index={index}
                        listItemIndex={listItemIndex}
                        page={screenName}
                        category={activeCategoryTab}
                        itemData={itemData ? itemData : undefined}
                        t={t}
                      />
                    );
                    case 'videoReviews':
                      return (
                        <VideoReviews
                          widgetId={item.id}
                          widgetType={componentType}
                          index={index}
                          listItemIndex={listItemIndex}
                          page={screenName}
                          category={activeCategoryTab}
                          itemData={itemData ? itemData : undefined}
                          t={t}
                        />
                      );
                      case 'dhamakaCashback':
                        return (
                          <DhamakaCashback
                            itemData={itemData ? itemData : undefined}
                            widgetId={item.id}
                            page={screenName}
                            index={index}
                            listItemIndex={listItemIndex}
                            category={activeCategoryTab}
                            widgetType={componentType}
                          />
                        );  
                        case 'communityRelevance':
                          return (
                            <CommunityRelevance
                              itemData={itemData ? itemData : undefined}
                              widgetId={item.id}
                              page={screenName}
                              index={index}
                              listItemIndex={listItemIndex}
                              category={activeCategoryTab}
                              widgetType={componentType}
                            />
                          );  
                default:
                  return <View />;
              }
            }
          }}
          onEndReachedThreshold={0.4}
          onEndReached={this.handleLoadMore}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.backgroundGrey,
  },
});

const mapStateToProps = state => ({
  shopglive: state.ShopgLive,
  activeCategoryTab: state.home.activeCategoryTab,
  userWidgetData: state.ShopgLive.userWidgetData,
  userPreferences: state.login.userPreferences,
});

const mapDispatchToProps = dispatch => ({
  onGetWidgets: (isPublic, isPrivate, page, userId, callback, category, communityName, pageNumber, size) => {
    dispatch(getWidgets(isPublic, isPrivate, page, userId, callback, category, communityName, pageNumber, size));
  }
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ShopgLive),
);
