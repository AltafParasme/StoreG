import React, {Component} from 'react';
import idx from 'idx';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
} from '../../../../utils';
import NavigationService from '../../../../utils/NavigationService';
import {Fonts, Colors} from '../../../../../assets/global';
import {AppText} from '../../../../components/Texts';
import {LogFBEvent, Events} from '../../../../Events';
import SlottedDeliveryTimeStrip from './SlottedDeliveryTimeStrip';
import CLPeersFeed from './CLPeersFeed';
import CLTaskStrip from './CLTaskStrip';
import CLLeaderBoardStrip from './CLLeaderBoardStrip';
import ClProfileShow from './ClProfileShow';
import TagComponent from './TagComponent';
import ListComponent from './ListComponent';
import {API_URL, specialCaseWidgets} from '../../../../Constants';
import CarouselBanner from '../../../../components/CarouselBanner/CarouselBanner';
import {getWidgets, getLiveOfferListInBulk} from '../redux/action';
import {GET_PAGE_OFFER_LIST} from '../redux/type';
import FgDealCouponSummary from '../../../pages/FreeGift/FgDealCouponSummary';
import ShopgLive from '../../ShopgLive';
import { Images } from '../../../../../assets/images';

const NAVBAR_HEIGHT = 47;
const TAB_HEIGHT = 50;
const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 0});

const Separator = props => (
  <View style={styles.orMainView}>
    {props.or === 'true' ? (
      <View style={styles.orView}>
        <View style={styles.orInnerView}>
          <AppText numberOfLines={1} style={styles.orTextStyle}>
            {props.t('or')}
          </AppText>
        </View>
      </View>
    ) : null}
  </View>
);

class OfferFeed extends Component {
  constructor(props) {
    super(props);
    const scrollAnim = new Animated.Value(0);
    this.state = {
      scrollAnim,
      isScrollEnabled: true,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          0
        ),
        0,
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT
      ),
      isLiveComponentsFetched: false,
      relevantLiveComponents: []
    };
    this.tagContent = this.tagContent.bind(this);
    this.listItem = this.listItem.bind(this);
    this.renderFooter = this.renderFooter.bind(this);

  }

  componentDidMount = () => {
    const {login, activeCategoryTab, groupSummary} = this.props;
    const userId = login.userPreferences.uid;
    const groupCode = groupSummary && groupSummary.groupDetails && groupSummary.groupDetails.info.groupCode;
    this.props.onGetWidgets(true, true, 'Home', userId, () => {}, activeCategoryTab, groupCode, 1, 3);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { widgetList : widgetListLatest } = nextProps.shopglive;
    const {pageUpdating, widgetList: widgetList} = this.props.shopglive;
    const {activeCategoryTab} = this.props;

    if (
      nextProps.activeIndex !== this.props.activeIndex &&
      nextProps.activeIndex !== this.props.route.key
    )
      return false;
    if (
      nextProps.activeIndex === this.props.activeIndex &&
      nextProps.activeIndex !== this.props.route.key
    )
      return false;

    if(nextProps.isTagsScreen || this.props.isTagsScreen) return false;  

    if((widgetListLatest && widgetListLatest[activeCategoryTab] && widgetListLatest[activeCategoryTab].data.length) != (widgetList && widgetList[activeCategoryTab] && widgetList[activeCategoryTab].data.length)) 
    return false;

    return true;
  }

  handleLoadMore = async () => {
    const {
      getPageOffers,
      isLoading,
      isLimitReached,
      activeCategoryTab,
      offerList,
    } = this.props;
    const userId = this.props.login.userPreferences.uid;
    this.onEndReachedCalledDuringMomentum = true;
    let dataLength = offerList ? offerList[activeCategoryTab].data.length : 0;
    if (!isLoading && !isLimitReached && !(dataLength < 9)) {
      getPageOffers(activeCategoryTab, userId);
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

  handleVideoClick = item => {
    const {dispatch} = this.props;
    let arrayToSend = [];
    arrayToSend.push(item);
    dispatch({
      type: 'shopglive/SET_STATE',
      payload: {videoShowOfferList: arrayToSend, selectedVideoIndex: 0},
    });

    NavigationService.navigate('VerticleVideoList');
  };

  tagContent = valueItem => {
    return (
      <TagComponent
        valueItem={valueItem}
        activeCategoryTab={this.props.activeCategoryTab}
        t
      />
    );
  };

  handleScratchCardSwipe = (stateVal) => {
    this.setState({
      isScrollEnabled: stateVal,
    });
  };

  listItem = ({item, index, separators}) => {
    const {login, groupSummary, route} = this.props;
    const userMode = idx(login, _ => _.userPreferences.userMode);
    const isCLMode = userMode === 'CL' ? true : false;
    if(index == 0) {
      return (
        <View key={item.refId}>
        <ShopgLive
              isCLMode={isCLMode}
              screenName={'Home'}
              categoryTab={route.slug}
              handleScratchCardSwipe={this.handleScratchCardSwipe}
              liveComponentsData={this.state.relevantLiveComponents}
              groupCode={
                groupSummary &&
                groupSummary.groupDetails &&
                groupSummary.groupDetails.info &&
                groupSummary.groupDetails.info.groupCode
              }
          />
           <ListComponent
              uniqueKey={item.refId}
              categoryTab={route.slug}
              onBooking={this.bookProduct}
              item={item}
              handleScratchCardSwipe={this.handleScratchCardSwipe}
              screen={'Home'}
              index={index}
              groupCode={
                groupSummary &&
                groupSummary.groupDetails &&
                groupSummary.groupDetails.info &&
                groupSummary.groupDetails.info.groupCode
              }
              withoutShopglive={true}
              withoutVideo={true}
              handleVideoClick={() => this.handleVideoClick(item)}
            />
        </View>
      )
    } else {
      return (
        <ListComponent
          key={item.refId}
          uniqueKey={item.refId}
          categoryTab={route.slug}
          onBooking={this.bookProduct}
          item={item}
          handleScratchCardSwipe={this.handleScratchCardSwipe}
          screen={'Home'}
          index={index}
          groupCode={
            groupSummary &&
            groupSummary.groupDetails &&
            groupSummary.groupDetails.info &&
            groupSummary.groupDetails.info.groupCode
          }
          withoutShopglive={true}
          withoutVideo={true}
          handleVideoClick={() => this.handleVideoClick(item)}
        />
      );
    };
  }

  renderFooter = () => (
    <View style={styles.footer}>
      {this.props.isLoading ? (
        <ActivityIndicator color="black" style={{margin: 15}} />
      ) : (
        ((this.props.offerList && this.props.offerList && this.props.offerList.length > 0) ||
          this.props.isLimitReached) && (
          <AppText style={styles.noMoreText}>{this.props.message}</AppText>
        )
      )}
    </View>
  );

  render() {
    const {
      t,
      login,
      groupSummary,
      userPref,
      categories,
      activeCategoryTab,
      loading,
      TaskData,
      shopglive,
      userProfile,
      rewards,
      communityList
    } = this.props;
    const mallInfoType = idx(login, _ => _.clDetails.mallInfo.type);
    const userPrefDelivery = idx(
      this.props.login,
      _ => _.userPreferences.slottedDelivery
    );
    const userMode = idx(login, _ => _.userPreferences.userMode);
    const clType = idx(login, _ => _.clDetails.mallInfo.clDetails.clType);
    let tags = [];
    categories.forEach(element => {
      if (element.slug === activeCategoryTab) {
        tags = element.tags;
      }
    });

    const {groupDetails} = groupSummary;
    const offerEndDate = (groupDetails && groupDetails.info.offerEndDate) || '';
    const now = Date.now();
    const dealEndsDate = offerEndDate - now;

    const refferalUserDetails =
      (groupDetails &&
        groupDetails.referralUserDetails &&
        groupDetails.referralUserDetails.userInfo) ||
      [];
    const items = (groupDetails && groupDetails.summary) || [];
    const selfItem = items.filter(item => item.isSelf)[0] || {};
    const referralBonus =
      rewards && rewards.rewardsInfo && rewards.rewardsInfo.refferalBonus;

    const RefereeCurrentCycleAll = refferalUserDetails.filter(
      data => data.isCurrentCycleUser
    );

    let RefereeCurrentCycle = [];
    RefereeCurrentCycleAll.forEach(element => {
      groupDetails.summary.forEach(sum => {
        if (element.userid === sum.userId)
          RefereeCurrentCycle = RefereeCurrentCycle.concat(element);
      });
    });
    const userName = (userProfile && userProfile.name) || '--';

    let referralUsers =
      refferalUserDetails.filter(
        data => data.isMyReferral && data.isCurrentCycleUser
      ) || [];
    const currentCycleUsers = referralUsers.filter(
      data => data.userId !== groupDetails.info.userId
    );
    const freeGiftClaimed = currentCycleUsers.length >= 4 ? true : false;
    const language = this.props.i18n.language;
    const communityName = communityList && communityList.length > 0 ? communityList[0].CommunityName : '';
    return (
      <Animated.View style={[{flex: 1}]}>
        {!loading && (
          <Animated.FlatList
            getItemLayout={(data, index) => ({
              length: 50,
              offset: 50 * index,
              index,
            })}
            scrollEnabled={this.state.isScrollEnabled}
            key={activeCategoryTab ? activeCategoryTab : 'roo_' + loading}
            contentContainerStyle={[
              //this.props.isBottomStripVisible ? { paddingBottom: NAVBAR_HEIGHT + scaledSize(70) + heightPercentageToDP(9) } : { paddingBottom: heightPercentageToDP(9) }
              { paddingBottom: NAVBAR_HEIGHT + heightPercentageToDP(9)}
              // tags && tags.length > 0
              //   ? {marginTop: NAVBAR_HEIGHT - heightPercentageToDP(3)}
              //   : {marginTop: NAVBAR_HEIGHT},
            ]}
            initialNumToRender={
              this.props.offerList[activeCategoryTab] &&
              Object.keys(this.props.offerList[activeCategoryTab]).length &&
              this.props.offerList[activeCategoryTab].data.length
            }
            extraData={this.state.offerList}
            data={
              this.props.offerList[activeCategoryTab]
                ? Object.keys(this.props.offerList[activeCategoryTab]).length
                  ? this.props.offerList[activeCategoryTab].data
                  : []
                : []
            }
            renderItem={this.listItem}
            ListHeaderComponent={() =>
              tags && tags.length > 0 ? (
                <View
                  style={[
                    {
                      //marginTop: heightPercentageToDP(10),
                      marginHorizontal: widthPercentageToDP(0.5),
                      marginBottom: heightPercentageToDP(1),
                    },
                  ]}>
                  <FlatList
                    contentContainerStyle={styles.grid}
                    numColumns={4}
                    data={tags}
                    renderItem={value => this.tagContent(value)}
                  />
                </View>
              ) : (
                <View
                  style={[
                    userPrefDelivery
                      ? null
                      : {marginTop: heightPercentageToDP(2.8)},
                  ]}>
                  <CarouselBanner
                    categories={categories}
                    findItemEnabled={true}
                    activeCategoryTab={activeCategoryTab}
                    language={this.props.language}
                    dispatch={this.props.dispatch}
                    setActiveTabs={this.setActiveTabs}
                    groupSummary={this.props.groupSummary}
                  />
                  {(this.props.activeCategoryTab === 'hot-deals' || this.props.activeCategoryTab === 'super-deals') && (
                    <View>
                      <TouchableOpacity
                        style={
                          this.props.userPref &&
                          this.props.userPref.userMode === 'CL'
                            ? {
                                height: heightPercentageToDP(7),
                              }
                            : {height: heightPercentageToDP(6)}
                        }
                        onPress={() => {
                          if (mallInfoType === 'CL') {
                            //this.props.openRbSheet();
                          }
                        }}>
                        <SlottedDeliveryTimeStrip
                          userMode={this.props.userPref.userMode}
                          userPrefDelivery={userPrefDelivery}
                          groupSummary={groupSummary}
                          mallInfoType={mallInfoType}
                          t={t}
                        />
                      </TouchableOpacity>
                      {userMode === 'CL' && (
                        <View>
                          {/* <CLTaskStrip TaskData={TaskData} /> */}
                          {/* <CLPeersFeed data={this.props.clConfig} /> */}
                          <CLLeaderBoardStrip
                            TaskData={TaskData}
                            clType={clType}
                            navigation={this.props.navigation}
                          />
                        </View>
                      )}
                      {(mallInfoType === 'CL' || communityName) ? <ClProfileShow communityName={communityName}/>: null}
                    </View>
                  )}

                  {this.props.activeCategoryTab === 'free-gift' && (
                      <View style={styles.freegiftsummaryBox}>
                        <FgDealCouponSummary
                          screen={'ShippingList'}
                          items={items}
                          selfItem={selfItem}
                          dealEndsDate={dealEndsDate}
                          referralBonus={referralBonus}
                          t={t}
                          freeGiftClaimed={freeGiftClaimed}
                          currentCycleUsers={currentCycleUsers}
                          userName={userName}
                          rewards={rewards}
                          groupSummary={groupSummary}
                          language={language}
                          userPreference={userPref}
                        />
                      </View>
                  )}

                </View>
              )
            }
            keyExtractor={item => item.refId}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={1}
            ItemSeparatorComponent={() =>
              activeCategoryTab === 'free-gift' ? (
                <Separator or="true" t={t}/>
              ) : (
                <Separator or="false" t={t}/>
              )
            }
            ListFooterComponent={this.renderFooter}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            ListEmptyComponent={() => {
              return this.props.offerList[activeCategoryTab] &&
                Object.keys(this.props.offerList[activeCategoryTab]).length &&
                this.props.offerList[activeCategoryTab].data ? (
                <AppText style={{padding: 15}}>
                  {t(
                    'No offer available in this category, Please try other category'
                  )}
                </AppText>
              ) : null;
            }}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {y: this.state.scrollAnim},
                  },
                },
              ],
              {useNativeDriver: true}
            )}
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: scaledSize(60),
    backgroundColor: Colors.darkishBlue,
    paddingHorizontal: scaledSize(10),
  },
  cartImageStyle: {
    width: scaledSize(29),
    height: scaledSize(25),
  },
  leftView: {
    flex: 1,
    flexDirection: 'column',
    height: scaledSize(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerView: {
    flex: 6,
    height: scaledSize(60),
    justifyContent: 'center',
    paddingHorizontal: scaledSize(10),
  },
  centerViewSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightInnerView: {
    backgroundColor: Colors.fullOrange,
    paddingVertical: scaledSize(10),
    paddingHorizontal: scaledSize(6),
    borderRadius: scaledSize(2),
  },
  rightView: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphaTextStyle: {
    color: Colors.white,
  },
  beetaTextStyle: {
    color: Colors.blue,
  },
  gamaTextStyle: {
    color: Colors.slightGrey,
  },
  roundView: {
    width: scaledSize(3),
    height: scaledSize(3),
    borderRadius: scaledSize(3),
    backgroundColor: Colors.white,
    marginHorizontal: scaledSize(5),
  },
  orMainView: {
    borderWidth: 0.7,
    position: 'relative',
    borderColor: Colors.mutedBorder,
  },
  orView: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 45,
    width: 55,
    left: widthPercentageToDP(50) - 50 / 2,
    top: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orInnerView: {
    backgroundColor: '#DDDEDF',
    borderRadius: 30,
    height: heightPercentageToDP(6),
    width: widthPercentageToDP(12.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  orTextStyle: {
    fontSize: scaledSize(14),
    color: '#292f3a',
    fontFamily: Fonts.roboto,
  },
  freegiftsummaryBox: {
    marginVertical: heightPercentageToDP(1),
    alignItems: 'center',
    marginHorizontal: widthPercentageToDP(4.5),
    width: widthPercentageToDP(91),
    height: heightPercentageToDP(20),
  },
  clDetailsBox:{
    marginBottom: heightPercentageToDP(1),
    alignItems: 'center',
    marginHorizontal: widthPercentageToDP(4.5),
    width: widthPercentageToDP(91),
    height: heightPercentageToDP(30),
  },
});

const mapStateToProps = state => {
  return {
    loading: state.home.loading,
    isLoading: state.home.isLoading,
    offerList: state.home.list,
    categories: state.home.categories,
    categoryObj: state.home.categoryObj,
    activeCategoryTab: state.home.activeCategoryTab,
    isLimitReached: state.home.limit,
    order: state.orderDetail,
    language: state.home.language,
    message: state.home.message,
    isTagsScreen: state.home.isTagsScreen,
    groupSummary: state.groupSummary,
    login: state.login,
    rewards: state.rewards.rewards,
    userPref: state.login.userPreferences,
    TaskData: state.clOnboarding.TaskData,
    clConfig: state.clOnboarding.clConfig,
    shopglive: state.ShopgLive,
    userProfile: state.userProfile,
    communityList:state.community.communityList,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  getPageOffers: (slug, userId) => {
    dispatch({type: GET_PAGE_OFFER_LIST, payload: {slug, userId}});
  },
  getOffersListInBulk: (tags,page,size) => {
    dispatch(getLiveOfferListInBulk(tags,page,size));
  },
  onGetWidgets: (isPublic, isPrivate, page, userId, callback, category, communityName, pageNumber, size) => {
    dispatch(getWidgets(isPublic, isPrivate, page, userId, callback, category, communityName, pageNumber, size));
  },
  // getOffers: (page, size, slug, userId) => {
  //   dispatch(GetOfferData(page, size, slug, userId));
  // },
  // setActiveTabs: tab => {
  //   dispatch(SetActiveTab(tab));
  // },
});

//const ConnectOfferFeed = connect(mapStateToProps, mapDispatchToProps)(OfferFeed);

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(OfferFeed)
);
