import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  AsyncStorage,
  Animated,
} from 'react-native';
import {AppText} from '../Texts';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  scaledSize,
} from '../../utils';
import {withTranslation} from 'react-i18next';
import {SearchBar, Icon} from 'react-native-elements';
import TagComponent from '../../native/pages/Home/component/TagComponent';
import CartStrip from '../../native/pages/Home/component/CartStrip';
import {showToastr} from '../../utils';
import {connect} from 'react-redux';
import {Constants} from '../../styles';
import NavigationService from '../../utils/NavigationService';
import {GetOfferList, SearchLog} from '../../native/pages/Search/redux/actions';
import {Cache} from 'react-native-cache';
import {SearchItem} from '../../native/pages/Search/component/SearchItem';
import {LogFBEvent, Events, SetScreenName} from '../../Events';

var cache = new Cache({
  namespace: 'shopg',
  policy: {
    maxEntries: 5,
  },
  backend: AsyncStorage,
});

const NAVBAR_HEIGHT = 47;
const TAB_HEIGHT = 50;
const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 0});

export class SearchComponent extends Component {
  constructor() {
    super();
    this.state = {search: ''};
    this.startTimeM = '';
    this.durationM = '';
  }

  componentWillMount() {
    this.startTimeM = new Date().getTime();
  }

  bookProduct = (item, index) => {
    NavigationService.navigate('Booking', {actionId: item.entityId});

    const {search} = this.state;
    cache.setItem(search, search, function(err) {
      // key 'hello' is 'world' in cache
    });

    const userId = this.props.login.userPreferences.uid;
    this.props.searchLog(this.state.search, userId, item.entityId, 'PDP');

    LogFBEvent(Events.SEARCH_SCREEN_ITEM_CLICK, {
      keyword: this.state.search,
      userId: userId,
      offerId: item.entityId,
      index: index,
    });
  };

  onAddTocart = (item, index) => {
    const userId = this.props.login.userPreferences.uid;
    this.props.searchLog(this.state.search, userId, item.entityId, 'AddToCart');
  };

  updateSearch = search => {
    this.setState({search});
    const {dispatch} = this.props;
    const userId = this.props.login.userPreferences.uid;
    if (search.length == 0) {
      dispatch({
        type: 'SEARCH_SET_OFFER_LIST',
        payload: {
          list: [],
        },
      });
      this.onClear();
    } else if (search.length > 2) {
      this.props.getOffers(search, userId);
    }
  };

  componentDidMount() {
    this.onClear();
    this.search.clear();
    this.search.focus();
    this.durationM = new Date().getTime() - this.startTimeM;
    SetScreenName(Events.LOAD_SEARCH_SCREEN.eventName());
    LogFBEvent(Events.LOAD_SEARCH_SCREEN, null);
  }

  onClear = () => {
    const {dispatch} = this.props;
    cache.getAll(function(err, entries) {
      let cacheList = Object.values(entries);

      const getTimestamp = dateString => new Date(dateString).getTime();

      const isOlder = (object1, object2) =>
        getTimestamp(object1.created) > getTimestamp(object2.created) ? -1 : 1;

      const sortedArr = cacheList.sort(isOlder);

      dispatch({
        type: 'SEARCH_SET_CACHE_LIST',
        payload: {
          list: sortedArr,
        },
      });
    });
    LogFBEvent(Events.SEARCH_SCREEN_SEARCH_CLEAR);
  };

  onPress = item => {
    this.updateSearch(item.value);
    this.search.focus();
  };

  onbarCodePress = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        fromSearch: true,
      },
    });

    NavigationService.navigate('QRContainer');
  };

  render() {
    const {
      t,
      list,
      categories,
      cacheList,
      noSearchResults,
      cart,
      hasCart,
      totalCartItems,
    } = this.props;
    const {search} = this.state;

    let tags = [];
    categories.forEach(element => {
      if (element.tags.length > 0) {
        element.tags.forEach(value => {
          tags.push({name: value, slug: element.slug});
        });
      }
    });

    const tagContent = valueItem => {
      return (
        <TagComponent
          screen={'search'}
          valueItem={valueItem}
          activeCategoryTab={valueItem.slug}
          t
        />
      );
    };

    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <SearchBar
            ref={search => (this.search = search)}
            containerStyle={styles.searchBar}
            inputContainerStyle={styles.searchBarInput}
            placeholder={t('Search brand, product')}
            onChangeText={this.updateSearch}
            value={search}
            cancelIcon={true}
            onClear={this.onClear}
            clearIcon={{color: 'black', size: scaledSize(25)}}
          />
        </View>
        <ScrollView
          contentContainerStyle={{backgroundColor: Constants.backgroundGrey}}>
          <FlatList
            data={list}
            renderItem={({item, index, separators}) => (
              <SearchItem
                onAddTocart={() => this.onAddTocart(item, index)}
                onPress={() => this.bookProduct(item, index)}
                showText={
                  (item &&
                    item.mediaJson &&
                    item.mediaJson.title &&
                    item.mediaJson.title.text) ||
                  ''
                }
                image={{
                  uri: (item && item.mediaJson && item.mediaJson.square) || '',
                }}
                t={t}
                item={item}
                type={'search'}
              />
            )}
          />
          {list.length > 0 ? <View style={styles.emptyContainer} /> : <View />}
          {noSearchResults ? (
            <View style={styles.noSearchContainer}>
              <AppText black bold size="M">
                {t('No Search Results')}
              </AppText>
            </View>
          ) : (
            <View />
          )}
          {list.length == 0 && cacheList.length > 0 ? (
            <View>
              <View style={styles.tagsContainer}>
                <AppText black bold size="M">
                  {t('Recent searches')}
                </AppText>

                <FlatList
                  style={styles.cacheList}
                  data={cacheList}
                  extraData={cacheList}
                  renderItem={({item, index, separators}) => (
                    <SearchItem
                      onPress={() => this.onPress(item)}
                      showText={item && item.value ? item.value : ''}
                      t={t}
                      type={'recent_search'}
                    />
                  )}
                />
              </View>
              <View style={styles.emptyContainer} />
            </View>
          ) : (
            <View />
          )}

          {list.length == 0 ? (
            <View style={styles.tagsContainer}>
              <AppText black bold size="M">
                {t('Browse Categories')}
              </AppText>

              <FlatList
                contentContainerStyle={{paddingBottom: heightPercentageToDP(2)}}
                numColumns={4}
                data={tags}
                renderItem={({item, index, separators}) => tagContent(item)}
              />
            </View>
          ) : null}

          <View style={styles.emptyContainer} />
          <View style={styles.emptyContainer} />
          <View style={styles.emptyContainer} />

          {hasCart ? <View style={styles.emptyView} /> : null}
        </ScrollView>

        {hasCart ? (
          <Animated.View style={styles.bottomTabView}>
            <CartStrip cart={cart} totalCartItems={totalCartItems} />
          </Animated.View>
        ) : null}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tagsContainer: {
    padding: scaledSize(5),
    backgroundColor: 'white',
  },
  cacheList: {
    marginTop: scaledSize(5),
  },
  emptyContainer: {
    height: scaledSize(20),
    backgroundColor: 'transparent',
  },
  noSearchContainer: {
    height: scaledSize(40),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    width: widthPercentageToDP(100),
    backgroundColor: Constants.primaryColor,
    borderWidth: 0, //no effect
    shadowColor: 'white', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInput: {
    backgroundColor: 'white',
  },
  bottomTabView: {
    height: NAVBAR_HEIGHT + scaledSize(70),
    paddingTop: STATUS_BAR_HEIGHT,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  emptyView: {
    height: NAVBAR_HEIGHT + scaledSize(70),
    width: 1,
  },
  barCodeWrapper: {
    backgroundColor: Constants.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightPercentageToDP(2.2),
    width: scaledSize(39),
    height: scaledSize(39),
    borderRadius: 42 / 2,
    paddingRight: widthPercentageToDP(1),
  },
});
