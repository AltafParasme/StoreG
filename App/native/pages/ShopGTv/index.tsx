import React, {PureComponent} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {
  StyleSheet,
  Animated,
  View,
  Image,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
} from '../../../utils/index';
import ListComponent from '../Home/component/ListComponent';
import NavigationService from '../../../utils/NavigationService';
import {connect} from 'react-redux';
import {
  GetCategoriesList,
} from '../Home/redux/action';
import {Fonts, Colors} from '../../../../assets/global';
import {Images} from '../../../../assets/images/index';
import {GET_PAGE_OFFER_LIST} from '../Home/redux/type';
import {BOOK_PRODUCT} from '../Booking/redux/actions';
import {Header} from 'react-native-elements';
import {Constants} from '../../../styles';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import {AppText} from '../../../components/Texts';


const NAVBAR_HEIGHT = 0;
const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 0});

class ShopGTvBase extends PureComponent {
  static navigationOptions = {
    title: 'SHOP-G',
    /* No more header config here! */
  };
  constructor(props) {
    super(props);

    this.state = {
      index: null,
      lastPage: 1,
      count: 0,
      userId: this.props.login.userPreferences.uid,
    };
    this.filter = this.filter.bind(this);
  }

  // UNSAFE_componentWillReceiveProps = nextProps => {
  //   const oldActionId = nextProps.navigation.getParam('actionId');
  //   if (oldActionId && oldActionId !== null) {
  //     this.setActiveTabs({slug: oldActionId});
  //     this.props.navigation.setParams({actionId: null});
  //   }
  // };

  componentDidMount = () => {
    const actionId = 'shopg-tv';
    const userId = this.state.userId;
    this.props.getCategoriesList(1, 10, actionId, userId);
    SetScreenName(Events.LOAD_SHOPGTV_SCREEN.eventName());
    LogFBEvent(Events.LOAD_SHOPGTV_SCREEN, null);
  };

  handleLoadMore = async () => {
    const {getPageOffers, isLoading, isLimitReached, offerList} = this.props;
    const userId = this.state.userId;
    this.onEndReachedCalledDuringMomentum = true;
    let dataLength = offerList ? offerList['shopg-tv'].data.length : 0;
    if (!isLoading && !isLimitReached && !(dataLength < 9)) {
      getPageOffers('shopg-tv', userId);
    }
  };

  bookProduct = (item, index, scroll) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'booking/GET_BOOKING',
      payload: item,
      index: index,
    });
    if (scroll === 'scroll') {
      NavigationService.navigate('Booking', {isScroll: true});
      return false;
    } else {
      NavigationService.navigate('Booking');
    }
  };

  filter() {
    let b = [];
    let userPreferredLang = this.props.i18n.language === 'kannada' ? 'Kannada' : 'English';
    if (this.props.offerList['shopg-tv']) {
      b = this.props.offerList['shopg-tv'].data.filter(off => {
      let localisedVideoArr = off.mediaJson.localisedVideo || [];
        let isPreferedLangVideoPresent = false;
        localisedVideoArr.forEach(element => {
          if (element.language === userPreferredLang)
            isPreferedLangVideoPresent = true;
        });
        // off.mediaJson.localisedVideo.map(localVideo => {
        return isPreferedLangVideoPresent;
      });
    }
    return b;
  }

  render() {
    const {loading, t, activeCategoryTab, message} = this.props;

    const dataToDisplay = this.filter();
    // const isGroupUnlocked =
    //   !!groupSummary &&
    //   !!groupSummary.groupDetails &&
    //   !!groupSummary.groupDetails.info
    //     ? groupSummary.groupDetails.info.groupOrderAmount >=
    //       groupSummary.groupDetails.info.bucketLimitEnd
    //     : false;

    const list = ({item, index}) => {
      return (
        <ListComponent
          activeCategoryTab={activeCategoryTab}
          onBooking={this.bookProduct}
          withoutVideo={false}
          item={item}
          index={index}
          //groupCode={this.props.groupSummary.groupDetails.info.groupCode}
          //isGroupUnlocked={isGroupUnlocked}
          isShopGTv
          isTwoItemRow
          containerShopGTV={styles.containerShopGTV}
          shopGTvImage={styles.shopGTvImage}
          eventTitle={Events.SHOPGTV_TITLE_CLICK}
          eventImage={Events.SHOPGTV_IMAGE_CLICK}
          eventVideo={Events.SHOPGTV_VIDEO_CLICK}
        />
      );
    };

    const renderFooter = () => (
      <View style={styles.footer}>
        {this.props.isLoading ? (
          <ActivityIndicator color="black" style={{margin: 15}} />
        ) : (
          ((this.props.offerList &&
            this.props.offerList &&
            this.props.offerList.length > 0) ||
            this.props.isLimitReached) && (
            <AppText style={styles.noMoreText}>{message}</AppText>
          )
        )}
      </View>
    );

    return (
      <SafeAreaView style={{flex: 1, paddingBottom: 15}}>
        <StatusBar backgroundColor="#00a9a6" barStyle="light-content" />
        <React.Fragment>
          <Animated.View style={{flex: 1}}>
            {!loading && (
              <Animated.FlatList
                // key={activeCategoryTab ? activeCategoryTab : 'roo_' + loading}
                numColumns={2}
                contentContainerStyle={{
                  marginTop: scaledSize(70),
                  paddingBottom: scaledSize(60),
                }}
                data={dataToDisplay}
                renderItem={list}
                keyExtractor={item => item.refId}
                onEndReached={this.handleLoadMore}
                onEndReachedThreshold={1}
                //ItemSeparatorComponent={() => <Separator or="false" />}
                ListFooterComponent={renderFooter}
                onMomentumScrollBegin={() => {
                  this.onEndReachedCalledDuringMomentum = false;
                }}
              />
            )}
            {loading && (
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
            // {transform: [{translateY: navbarTranslate}]},
          ]}>
          <Header containerStyle={[styles.header]}
          leftComponent={ <View style={{flexDirection: 'row', paddingLeft: 100}}>
          <Image
            source={Images.shopGTvNavBar}
            style={{width: 25, height: 25, top: 20, resizeMode: 'contain'}}
          />
          <AppText white bold size='XL' style={{top: scaledSize(17), left: '12%'}}>
            ShopGTV
          </AppText>
        </View>}
          />
            {/* <StatusBar backgroundColor="#00a9a6" barStyle="light-content" /> */}
           
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Constants.primaryColor,
    height: heightPercentageToDP(8),
    paddingBottom: heightPercentageToDP(3),
  },
  containerShopGTV: {
    flex: 0.5,
    width: widthPercentageToDP(45),
    height: heightPercentageToDP(45),
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
    borderRadius: 1.5,
    margin: widthPercentageToDP(1),
    shadowColor: '#000000',
    shadowOpacity: 0.9,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  shopGTvImage: {
    height: heightPercentageToDP(30),
    width: widthPercentageToDP(40),
    resizeMode: 'contain',
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
});

const mapStateToProps = state => {
  return {
    loading: state.home.loading,
    isLoading: state.home.isLoading,
    offerList: state.home.list,
    categories: state.home.categories,
    isLimitReached: state.home.limit,
    language: state.home.language,
    message: state.home.message,
    login: state.login,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  getPageOffers: (slug, userId) => {
    dispatch({type: GET_PAGE_OFFER_LIST, payload: {slug, userId}});
  },
  addBookProduct: product => dispatch(BOOK_PRODUCT(product)),
  getCategoriesList: (page, size, actionId, userId) => {
    dispatch(GetCategoriesList(page, size, actionId, userId));
  },
});

const ShopGTv = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShopGTvBase);

export default withTranslation()(ShopGTv);
