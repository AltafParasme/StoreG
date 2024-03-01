import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {Constants} from '../../../../styles';
import {GetShippingList} from '../redux/actions';
import ShippingListItem from './ShippingListItem';
import NavigationService from '../../../../utils/NavigationService';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {AppText} from '../../../../components/Texts';
import {StatusListItem} from './StatusListItem';
import {Icon} from 'react-native-elements';

class MyShippingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      search: '',
      selectedSizeIndex: 0,
      cancelCalled: false,
    };
    this.getEmptyListComponent = this.getEmptyListComponent.bind(this);
  }

  componentDidMount() {
    this.props.getShippingList(1);
  }

  onStatusSelected = (index, item) => {
    this.setState({selectedSizeIndex: index});
    this.setState({status: item});
    this.setState({awb: 0});
    this.props.getShippingList(1, item, 0, 0, true);
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        shouldNotFocus: true,
      },
    });
  };

  onLoadMore = () => {
    const {status, search} = this.state;
    const {totalListCount, list} = this.props;
    if (totalListCount > list.length) {
      const page = Math.ceil(list.length / 10) + 1;
      // this.props.getShippingList(page);
      this.props.getShippingList(page, status, 0, 0, false);
    }
  };

  onListItemClick = (item, index) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        selectedShipping: item,
        groupShippingDetail: false,
      },
    });
    NavigationService.navigate('ShipmentDetails');
  };

  onClear = () => {
    this.props.getShippingList(1, undefined, undefined, undefined, false);
  };

  updateSearch = search => {
    this.setState({search});
    if (search.length == 0) {
      this.setState({cancelCalled: true});
      this.onClear();
    } else {
      const {status} = this.state;
      if (search.length > 2) {
        this.props.getShippingList(1, status, search, 0, false);
      }
    }
  };

  onbarCodePress = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        fromShippingList: true,
        toBarcodeFromGroup: false,
      },
    });

    NavigationService.navigate('QRContainer');
  };

  getEmptyListComponent() {
    const {t} = this.props;
    return (
      <TouchableOpacity
        style={{
          marginTop: heightPercentageToDP(10),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => NavigationService.navigate('Home')}>
        <AppText size="XXL" bold black>
          {t('Your shipping list is empty.')}
        </AppText>
        <AppText style={styles.clickHere} size="L" bold greenishBlue>
          {t('Shop more')}
        </AppText>
      </TouchableOpacity>
    );
  }

  render() {
    const {t, list, loading, customerStatusList} = this.props;
    const {search, status, cancelCalled} = this.state;

    if (loading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    if (
      search == '' &&
      status == '' &&
      (!list || list.length == 0) &&
      !cancelCalled
    ) {
      return this.getEmptyListComponent();
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.searchWrapper}>
            <View
              style={{
                flex: 9,
                flexDirection: 'row',
                backgroundColor: 'white',
                alignItems: 'center',
                marginVertical: heightPercentageToDP(0.3),
              }}>
              <View style={{marginHorizontal: heightPercentageToDP(1)}}>
                <Icon
                  name={'search'}
                  type={'font-awesome'}
                  color={Constants.lightGrey}
                  size={widthPercentageToDP(5)}
                />
              </View>

              <TextInput
                underlineColorAndroid="transparent"
                ref={search => (this.search = search)}
                keyboardType="numeric"
                style={styles.searchBar}
                inputContainerStyle={styles.searchBarInput}
                placeholder={t('Search by Shipment Id')}
                onChangeText={this.updateSearch}
                value={search}
                cancelIcon={true}
                onClear={this.onClear}
                clearIcon={{color: 'black', size: scaledSize(25)}}
              />
            </View>
            <TouchableOpacity
              onPress={this.onbarCodePress}
              style={styles.barCodeWrapper}>
              <Icon
                name={'qrcode'}
                type={'font-awesome'}
                color={Constants.black}
                size={widthPercentageToDP(7)}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={list}
            onEndReachedThreshold={0.2}
            onEndReached={this.onLoadMore}
            contentContainerStyle={{paddingBottom: heightPercentageToDP(10)}}
            ListHeaderComponent={() => (
              <View style={styles.listWrapper}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={customerStatusList}
                  numColumns={3}
                  extraData={this.state.selectedSizeIndex}
                  renderItem={({item, index}) => (
                    <StatusListItem
                      index={index}
                      item={item}
                      t={t}
                      selectedIndex={this.state.selectedSizeIndex}
                      onPress={index => this.onStatusSelected(index, item)}
                    />
                  )}
                  keyExtractor={item => item.refId}
                />
              </View>
            )}
            ListEmptyComponent={this.getEmptyListComponent}
            renderItem={({item, index, separators}) => (
              <ShippingListItem
                t={t}
                item={item}
                onItemPress={() => this.onListItemClick(item, index)}
                showRightArrow={true}
                type="MyShippingList"
              />
            )}
          />
        </View>
      );
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.backgroundGrey,
  },
  clickHere: {
    paddingHorizontal: widthPercentageToDP(1),
    height: heightPercentageToDP(5),
    lineHeight: heightPercentageToDP(5),
    textAlign: 'center',
    alignSelf: 'center',
    borderRadius: scaledSize(6),
    borderWidth: scaledSize(1),
    borderColor: Constants.greenishBlue,
  },
  listWrapper: {
    flexDirection: 'column',
    padding: scaledSize(5),
    marginHorizontal: scaledSize(5),
    marginTop: scaledSize(5),
    backgroundColor: 'white',
  },
  searchBar: {
    flex: 1,
    height: heightPercentageToDP(8),
    backgroundColor: 'transparent',
  },
  searchBarInput: {
    backgroundColor: 'white',
  },
  barCodeWrapper: {
    paddingHorizontal: widthPercentageToDP(1),
    paddingVertical: heightPercentageToDP(2),
    marginLeft: scaledSize(5),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  searchWrapper: {
    flexDirection: 'row',
    marginHorizontal: scaledSize(5),
    marginTop: scaledSize(5),
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  list: state.ShippingList.list,
  loading: state.ShippingList.loading,
  totalListCount: state.ShippingList.totalListCount,
  customerStatusList: state.ShippingList.customerStatusList,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getShippingList: (page, status, shipmentId, awb, shouldShowLoading) => {
    dispatch(GetShippingList(page, status, shipmentId, awb, shouldShowLoading));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(MyShippingList)
);
