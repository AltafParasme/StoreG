import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ScrollView,
  AsyncStorage,
  Animated,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {showToastr} from '../utils';
import {connect} from 'react-redux';
import {SearchBar} from 'react-native-elements';
import {Constants} from '../../../styles';
import {GetOfferList, SearchLog} from './redux/actions';
import ListComponent from '../Home/component/ListComponent';
import TagComponent from '../Home/component/TagComponent';
import CartStrip from '../Home/component/CartStrip';
import NavigationService from '../../../utils/NavigationService';
import {AppText} from '../../../components/Texts';
import {SearchComponent} from '../../../components/Search/SearchComponent';
import {
  scaledSize,
  AppWindow,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../utils';

class Search extends Component {
  componentWillMount = () => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  };

  handleBackButtonClick() {
    NavigationService.goBack();
    return true;
  }

  render() {
    const {
      t,
      list,
      categories,
      cacheList,
      noSearchResults,
      login,
      cart,
      hasCart,
      totalCartItems,
      dispatch,
      getOffers,
      searchLog,
    } = this.props;
    return (
      <SearchComponent
        t={t}
        list={list}
        categories={categories}
        cacheList={cacheList}
        noSearchResults={noSearchResults}
        cart={cart}
        hasCart={hasCart}
        totalCartItems={totalCartItems}
        login={login}
        dispatch={dispatch}
        getOffers={getOffers}
        searchLog={searchLog}
      />
    );
  }
}

var styles = StyleSheet.create({});

const mapStateToProps = state => ({
  list: state.Search.list,
  categories: state.home.categories,
  cacheList: state.Search.cacheList,
  login: state.login,
  noSearchResults: state.Search.noSearchResults,
  cart: state.home.cart,
  hasCart: state.home.hasCart,
  totalCartItems: state.home.totalCartItems,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getOffers: (key, userId) => {
    dispatch(GetOfferList(key, userId));
  },
  searchLog: (key, userId, offerId, selectionType) => {
    dispatch(SearchLog(key, userId, offerId, selectionType));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Search)
);
