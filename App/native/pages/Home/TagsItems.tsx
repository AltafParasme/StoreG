import React, {Component, PureComponent} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {
  StyleSheet,
  Animated,
  View,
  Image,
  Platform,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
} from '../../../utils/index';
import Listing from './component/Listing';
import {Header} from '../../../components/Header/Header';
import NavigationService from '../../../utils/NavigationService';
import {connect} from 'react-redux';
import {
  GetOfferData,
  GetCategoriesList,
} from './redux/action';
import {Fonts, Colors} from '../../../../assets/global';
import {GET_PAGE_OFFER_LIST} from './redux/type';
import {BOOK_PRODUCT} from '../Booking/redux/actions';
import {GetLiveOfferList} from '../ShopgLive/redux/actions';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Constants} from '../../../styles';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import {AppText} from '../../../components/Texts';
import CartStrip from './component/CartStrip';

const NAVBAR_HEIGHT = 0;
const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 0});

class TagsItemsBase extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      onEndReachedCalledDuringMomentum: true,
      userId: this.props.login.userPreferences.uid,
      catName: '',
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.startTimeM = '';
    this.durationM = '';
  }

  componentWillMount() {
    this.startTimeM = new Date().getTime();
  }

  handleBackButtonClick() {
    // if(this.props.navigation.state.params.screen && this.props.navigation.state.params.screen=="search"){
    //   NavigationService.goBack();
    // } else {
    //   NavigationService.navigate('Home',{
    //      actionId: this.props.navigation.state.params.activeCategoryTab,
    //   //isTag: true
    //    }); 
    // }
    NavigationService.goBack();
  }


  componentDidMount = () => {
    const screen = this.props.navigation.state.params.screen;
    if(screen!='InactiveFlashSales' && screen!='ActiveFlashSales'){
      const tags = this.props.navigation.state.params.tags;
      const actionId = this.props.navigation.state.params.activeCategoryTab;
      const userId = this.props.login.userPreferences.uid;
      this.props.getOffers(1, 10, actionId, userId, tags, true);
      this.props.categories.forEach(element => {
        if (element.slug === actionId) {
            this.setState({
              catName: element.name,
            })
        }
      });
    }

    if(this.props.navigation.state.params.withoutData) {
      let selectedtagSlug = this.props.navigation.state.params.selectedtagSlug;
      this.props.getLiveOffers(selectedtagSlug,1,20);
    }

    this.props.dispatch({type: 'home/SET_STATE', payload: { isTagsScreen: true }});
    this.durationM = new Date().getTime() - this.startTimeM;  
    SetScreenName(Events.LOAD_HOME_SUB_CATEGORY.eventName());
    LogFBEvent(Events.LOAD_HOME_SUB_CATEGORY, {timeTaken: this.durationM});
  };

  componentWillUnmount() {
    const screen = this.props.navigation.state.params.screen;
    const {dispatch, offerList} = this.props;
    if(screen!='InactiveFlashSales' && screen!='ActiveFlashSales'){
      this.props.dispatch({type: 'home/SET_STATE', 
      payload: {
        list: {
        ...offerList,
        tags: {
          currentPage: null,
          data: []
        },
        },
        tagsLimit: false,
        isTagsScreen: false
      }});
    }
    else {
      this.props.dispatch({type: 'home/SET_STATE', 
      payload: {
        isTagsScreen: false
      }});
    }
  }


  handleLoadMore = () => {
    if (!this.state.onEndReachedCalledDuringMomentum) {
      this.setState({onEndReachedCalledDuringMomentum: true}, () => {
        setTimeout(() => {
          const {offerListLive,liveLoading} = this.props;
          const screen = this.props.navigation.state.params.screen;
          if(screen && (screen=='InactiveFlashSales' || screen=='ActiveFlashSales')){
            if(!liveLoading){
              let selectedtagSlug = this.props.navigation.state.params.selectedtagSlug;
              let listToShow = [];
              if(offerListLive && offerListLive.length && offerListLive.length>0){
                offerListLive.map(offer => {
                  if(offer.tag==selectedtagSlug){
                    listToShow = [...offer.data];
                  }
                })
              }
              if(listToShow.length == 5){
                this.props.getLiveOffers(selectedtagSlug,1,20)
              }else if((listToShow.length) > 19) {
                const page = Math.ceil((listToShow.length)/ 20) + 1;
                this.props.getLiveOffers(selectedtagSlug,page,20)
              }           
            }
          } else {
            const {getPageOffers, isLoading, isLimitReached, offerList} = this.props;
            const tags = this.props.navigation.state.params.tags;
            const slug = this.props.navigation.state.params.activeCategoryTab;
            const userId = this.props.login.userPreferences.uid;
            let dataLength = offerList ? offerList['tags'].data.length : 0;
            if (!isLoading && (!isLimitReached) && !(dataLength < 9)) {
              getPageOffers(slug, userId, tags);
            }
          }
        }, 100);
      });
    }


  };

  bookProduct = (item, index) => {
    const screen = this.props.navigation.state.params.screen;
    if(screen!='InactiveFlashSales'){
      const {dispatch} = this.props;
      dispatch({
        type: 'booking/GET_BOOKING',
        payload: item,
        index: index,
      });
      NavigationService.navigate('Booking');
    }

  };

  renderItem = ({ item, index }) => {
    const coinRewards = this.props.navigation.state.params.coinRewards;
    if(item && item.mediaJson && item.mediaJson.title){
      return (
        <Listing
          coinRewards={coinRewards}
          key={index}
          screen='TagsItems'
          onBooking={this.bookProduct}
          item={item}
          index={index}
          withoutVideo={true}
          handleVideoClick={() => this.handleVideoClick(item)}
          withoutShopglive={true}
        />
      );
    } else {
      return (<View />);
    }
  }

  handleVideoClick = (item) => {
    const {dispatch} = this.props;
    let arrayToSend = [];
    arrayToSend.push(item);
    dispatch({
      type: 'shopglive/SET_STATE',
      payload: {videoShowOfferList : arrayToSend,selectedVideoIndex:0},
    });
    
    NavigationService.navigate('VerticleVideoList');
  }

  render() {
    const {loading, t, message, categories,offerListLive,liveLoading} = this.props;
    const tags = this.props.navigation.state.params.tags;
    const slug = this.props.navigation.state.params.activeCategoryTab;
    const screen = this.props.navigation.state.params.screen;
    let title = '';
    let selectedtagSlug = '';
    let listToShow = [];
    if(screen=='InactiveFlashSales' || screen=='ActiveFlashSales'){
      title = this.props.navigation.state.params.title;
      selectedtagSlug = this.props.navigation.state.params.selectedtagSlug;
      if(offerListLive && offerListLive.length && offerListLive.length>0){
        offerListLive.map(offer => {
          if(offer.tag==selectedtagSlug){
            listToShow = [...offer.data];
          }
        })
      }
    }
    
    const Separator = () => (
      <View style={styles.orMainView}>
      </View>
    );

    const renderFooter = () => (
      <View style={{height: heightPercentageToDP(5)}}>
        {this.props.isLoading ? (
          <ActivityIndicator color="black" size='small' />
        ) : <View />}
      </View>
    );

    return (
      <SafeAreaView style={{flex: 1, paddingBottom: 2}}>
        <StatusBar backgroundColor="#00a9a6" barStyle="light-content" />
        <React.Fragment>
          <Animated.View style={{flex: 1}}>
            {!loading && (
              <Animated.FlatList
                // key={activeCategoryTab ? activeCategoryTab : 'roo_' + loading
                // getItemLayout={(data, index) => ({
                //   length: 50,
                //   offset: 50 * index,
                //   index,
                // })}
                contentContainerStyle={{
                  marginTop: scaledSize(70),
                  paddingBottom:heightPercentageToDP(8),
              
                }}
                data={
                  (screen=='InactiveFlashSales' || screen=='ActiveFlashSales')
                  ?
                  listToShow
                  :
                  this.props.offerList.tags
                    ?   this.props.offerList.tags.data
                    : []
                }
                renderItem={this.renderItem}
                onMomentumScrollBegin={() =>
                  this.setState({onEndReachedCalledDuringMomentum: false})
                }
                keyExtractor={item => item.refId}
                onEndReached={this.handleLoadMore}
                onEndReachedThreshold={1}
                removeClippedSubviews={true}
                ItemSeparatorComponent={() => <Separator or="false" />}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={() => {
                  return this.props.offerList.tags &&
                    this.props.offerList.tags.data ? (
                    <AppText size='XXL' style={{marginLeft: scaledSize(5), marginTop: scaledSize(250), textAlign: 'center'}}>
                      {t(
                        'No offer available'
                      )}
                    </AppText>
                  ) : null;
                }}
                
              />
            )}
            {(loading || liveLoading) && (
              <View style={styles.activityView}>
                <ActivityIndicator
                  color="black"
                  style={{margin: 15}}
                  size="large"
                />
              </View>
            )}
          </Animated.View>
        </React.Fragment>

        <Animated.View
          style={[
            styles.headerView,
          ]}>
          <Header 
          title={(screen=='InactiveFlashSales' || screen=='ActiveFlashSales') ? `${t(title)}` : `${t(this.state.catName)} > ${t(this.props.navigation.state.params.tags)}`} rightComponent={null}/>
        </Animated.View>

            {this.props.hasCart ? (
              <Animated.View>
                <CartStrip isSubCategory cart={this.props.cart} totalCartItems={this.props.totalCartItems}/>
              </Animated.View>
            ) : null}

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  orMainView: {
    borderWidth: 0.7,
    position: 'relative',
    borderColor: Colors.mutedBorder,
  },
  activityView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMoreText: {
    margin: 15,
    textAlign: 'center',
    fontSize: scaledSize(14),
  },
  imageContent: {
    width: 85,
    height: 70,
    left: 15,
    resizeMode: 'contain',
  },
  headerView: {
    height: scaledSize(58),
    paddingTop: STATUS_BAR_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  bottomTabView: {
    height: NAVBAR_HEIGHT + scaledSize(60),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
});

const mapStateToProps = state => {
  return {
    loading: state.home.loading,
    isLoading: state.home.isLoading,
    offerList: state.home.list,
    categories: state.home.categories,
    tags: state.home.tagLists,
    isLimitReached: state.home.tagsLimit,
    language: state.home.language,
    message: state.home.message,
    login: state.login,
    totalCartItems: state.home.totalCartItems,
    cart:state.home.cart,
    hasCart:state.home.hasCart,
    offerListLive:state.ShopgLive.liveOfferList,
    liveLoading: state.ShopgLive.liveLoading
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  getOffers: (page, size, slug, userId, tags) => {
    dispatch(GetOfferData(page, size, slug, userId, tags));
  },
  getPageOffers: (slug, userId, tags) => {
    dispatch({type: GET_PAGE_OFFER_LIST, payload: {slug, userId, tags}});
  },
  getLiveOffers: (tag,page, size) => {
    dispatch(GetLiveOfferList(tag,page, size));
  },
  // setActiveTabs: tab => {
  //   dispatch(SetActiveTab(tab));
  // },
  addBookProduct: product => dispatch(BOOK_PRODUCT(product)),
});

const TagsItems = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TagsItemsBase);

export default withTranslation()(TagsItems);
