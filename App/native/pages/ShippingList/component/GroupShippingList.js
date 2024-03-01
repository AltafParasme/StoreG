import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {withNavigationFocus} from 'react-navigation';
import {connect} from 'react-redux';
import {Constants} from '../../../../styles';
import {getRewards, currentUser} from '../../UserProfile/actions';
import {
  GetShippingDetails,
  GetShippingListGroup,
  GetGroupShippingData,
  GetUserBankDetails,
} from '../redux/actions';
import ShippingListItem from './ShippingListItem';
import {ClShippingDetail} from './ClShippingDetail';
import {FriendListComponent} from './FriendListComponent';
import DropdownWithSearch from '../../../../components/DropdownWithSearch';
import NavigationService from '../../../../utils/NavigationService';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {setStartDate, getRouteTab} from '../../CLOnboarding/components/CLUtils';
import moment from 'moment';
import {AppText} from '../../../../components/Texts';
import {StatusListItem} from './StatusListItem';
import {Icon, SearchBar} from 'react-native-elements';
import {showToastr} from '../../utils';
import CLWeeklyTarget from '../../CLOnboarding/components/CLWeeklyTarget';
import {TextInput, FlatList} from 'react-native-gesture-handler';

class GroupShippingList extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.getEmptyListComponent = this.getEmptyListComponent.bind(this);
  }

  get initialState() {
    return {
      cancelCalled: false,
      status: '',
      search: '',
      selectedSizeIndex: 0,
      selectedFriend: {userName: 'All Friends', phoneNumber: null},
      selectedMonth: moment.utc(new Date()).format('DD-MMM-YYYY  HH:mm'),
      friendsArray: [],
      oldFriends: [],
    };
  }

  componentDidMount() {
    let weekDates = setStartDate(this.state.selectedMonth);
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        firstDate: weekDates.firstDate,
        lastDate: weekDates.lastDate,
      },
    });

    let routeTab = getRouteTab(weekDates.firstDate, weekDates.lastDate);
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        dateArray: routeTab.dateArray,
        tab: routeTab.tab,
      },
    });
    if (this.props.rewards && !Object.keys(this.props.rewards)) {
      //this.props.getRewards({});
    }
    if (!this.props.userProfile) this.props.onCurrentUser();

    this.props.getShippingListGroup(
      1,
      true,
      undefined,
      'All',
      undefined,
      undefined,
      undefined,
      false
    );
    this.props.getUserBankDetails();

    const {groupSummary, userProfile} = this.props;
    let friendsArray = [];
    if (
      groupSummary &&
      groupSummary.groupDetails &&
      groupSummary.groupDetails.summary
    ) {
      friendsArray.push({userName: 'ALL'});
      groupSummary.groupDetails.summary.map(el => {
        if (userProfile.user && userProfile.user.phoneNumber != el.phoneNumber)
          friendsArray.push(el);
      });

      if (friendsArray && friendsArray.length > 0) {
        this.setState({friendsArray: friendsArray});
        this.setState({oldFriends: friendsArray});
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.props.dispatch({
        type: 'shippingList/SET_STATE',
        payload: {
          refreshChildComponent: true,
        },
      });
    }

    if (prevProps.isFocused !== this.props.isFocused && prevProps.isFocused) {
      this.setState({
        selectedMonth: moment(new Date()).format('DD-MMM-YYYY'),
      });
    }
  }

  onListItemClick = (item, index) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        selectedShipping: item,
        groupShippingDetail: true,
      },
    });
    NavigationService.navigate('ShipmentDetails');
  };

  onLoadMore = () => {
    const {status} = this.state;
    const {totalGroupListCount, groupList} = this.props;
    if (totalGroupListCount > groupList.length) {
      const page = Math.ceil(groupList.length / 10) + 1;
      if (this.state.selectedFriend.userName == 'All Friends') {
        this.props.getShippingListGroup(
          page,
          true,
          undefined,
          status,
          0,
          0,
          false,
          false
        );
      } else {
        this.props.getShippingListGroup(
          page,
          true,
          this.state.selectedFriend.phoneNumber,
          status,
          0,
          0,
          false,
          false
        );
      }
    }
  };

  onSelectMonthName = (index, item, onClick) => {
    onClick();
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        tab: 0,
      },
    });
    item = `01-${item}`;
    this.setState({
      selectedMonth: item,
    });
    let weekDates = setStartDate(item);
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        firstDate: weekDates.firstDate,
        lastDate: weekDates.lastDate,
      },
    });

    let routeTab = getRouteTab(weekDates.firstDate, weekDates.lastDate);
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        dateArray: routeTab.dateArray,
        tab: routeTab.tab,
      },
    });
  };

  onSelectFriendName = (index, item, onClick) => {
    onClick();
    const {status} = this.state;
    if (item.userName == 'All Friends') {
      this.props.getShippingListGroup(1, true, undefined, status, 0, 0, true);
    } else {
      this.props.getShippingListGroup(
        1,
        true,
        item.phoneNumber,
        status,
        0,
        0,
        true,
        false
      );
    }
    this.setState({selectedFriend: item});
    this.setState({friendsArray: this.state.oldFriends});
  };

  onClear = () => {
    const {selectedFriend, status} = this.state;
    this.props.getShippingListGroup(
      1,
      true,
      selectedFriend.phoneNumber,
      status,
      0,
      0,
      false,
      false
    );
  };

  updateSearch = search => {
    this.setState({search});
    if (search.length == 0) {
      this.setState({cancelCalled: true});
      this.onClear();
    } else {
      const {selectedFriend, status} = this.state;
      if (search.length > 2) {
        this.props.getShippingListGroup(
          1,
          true,
          selectedFriend.phoneNumber,
          status,
          0,
          search,
          false,
          false
        );
      }
    }
  };

  onSearch = val => {
    if (val && val != '') {
      let friendsArray = [];
      if (this.state.friendsArray && this.state.friendsArray.length > 0) {
        this.state.friendsArray.map(el => {
          if (el.userName.includes(val)) {
            friendsArray.push(el);
          }
        });

        if (friendsArray && friendsArray.length > 0) {
          this.setState({friendsArray: friendsArray});
        }
      }
    } else {
      this.setState({friendsArray: this.state.oldFriends});
    }
  };

  onStatusSelected = (index, item) => {
    const {selectedFriend} = this.state;
    this.setState({selectedSizeIndex: index});
    this.setState({status: item});
    this.setState({awb: 0});
    this.props.getShippingListGroup(
      1,
      true,
      selectedFriend.phoneNumber,
      item,
      0,
      0,
      true,
      false
    );
  };

  getEmptyListComponent() {
    const {t} = this.props;
    const {search} = this.state;
    return (
      <View style={{backgroundColor: 'white'}}>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginVertical: heightPercentageToDP(2),
          }}
          onPress={() => NavigationService.navigate('Home')}>
          <AppText size="XXL" bold black>
            {search && search != ''
              ? t('No shipment found')
              : t('Your shipping list is empty')}
          </AppText>
          <AppText style={styles.clickHere} size="L" bold greenishBlue>
            {t('Shop more')}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }

  onbarCodePress = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        fromShippingList: true,
        toBarcodeFromGroup: true,
      },
    });

    NavigationService.navigate('QRContainer');
  };

  renderFlatlistItems = ({item, index}) => {
    const {
      t,
      groupList,
      groupShippingData,
      statusList,
      userBankDetails,
      isBankAccountPresent,
      dateArray,
      userPref,
      clWeeklyLoading,
    } = this.props;
    const {search, status, cancelCalled} = this.state;
    let accountScreenTitle = isBankAccountPresent
      ? 'Edit Bank Account'
      : 'Add Bank Account';

    let verifiedAcc = userBankDetails.bankAccountIsVerified
      ? 'Account is verified'
      : 'ShopG will verify account';

    let isShippingListEmpty =
      search === '' &&
      status === '' &&
      (!groupList || groupList.length === 0) &&
      !cancelCalled;

    const {friendsArray} = this.state;
    if (item.id === 1) {
      return (
        <View style={{flex: 1}}>
          {isShippingListEmpty ? (
            <View
              style={{
                backgroundColor: 'white',
                marginTop: heightPercentageToDP(3),
                paddingTop: heightPercentageToDP(2),
              }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  marginVertical: heightPercentageToDP(2),
                }}
                onPress={() => NavigationService.navigate('Home')}>
                <AppText size="XXL" bold black>
                  {t('Your shipping list is empty.')}
                </AppText>
                <AppText style={styles.clickHere} size="L" bold greenishBlue>
                  {t('Shop more')}
                </AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                {marginTop: heightPercentageToDP(3)},
                groupShippingData ? {flex: 0.6} : {flex: 1},
              ]}>
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
              <View style={{flex: 0.8}}>
                <FlatList
                  data={groupList}
                  listKey={(item, index) => index.toString()}
                  onEndReachedThreshold={0.4}
                  onEndReached={this.onLoadMore}
                  contentContainerStyle={{
                    paddingBottom: heightPercentageToDP(1),
                  }}
                  ListEmptyComponent={this.getEmptyListComponent}
                  renderItem={({item, index, separators}) => (
                    <ShippingListItem
                      t={t}
                      item={item}
                      onItemPress={() => this.onListItemClick(item, index)}
                      showRightArrow={true}
                      type="GroupShippingList"
                    />
                  )}
                  ListHeaderComponent={() => (
                    <View>
                      <View style={styles.listWrapper}>
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          data={statusList}
                          listKey={(item, index) => index.toString()}
                          numColumns={3}
                          extraData={this.state.selectedSizeIndex}
                          renderItem={({item, index}) => (
                            <StatusListItem
                              index={index}
                              item={item}
                              t={t}
                              selectedIndex={this.state.selectedSizeIndex}
                              onPress={index =>
                                this.onStatusSelected(index, item)
                              }
                            />
                          )}
                        />
                      </View>

                      {friendsArray && friendsArray.length > 0 ? (
                        <View style={styles.listWrapper}>
                          <DropdownWithSearch
                            label={"Friend's Shipping List"}
                            labelStyle={styles.labelStyle}
                            data={friendsArray}
                            onSearch={this.onSearch}
                            showArrow={true}
                            value={this.state.selectedFriend.userName}
                            listComponent={({key, data, onClick}) => (
                              <View style={{marginTop: 10}}>
                                <FriendListComponent
                                  index={key}
                                  showText={data.userName}
                                  t={t}
                                  onPress={() =>
                                    this.onSelectFriendName(key, data, onClick)
                                  }
                                />
                              </View>
                            )}
                            keyExtractor={item => item.refId}
                          />
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>
                  )}
                />
              </View>
            </View>
          )}
        </View>
      );
    }
  };

  render() {
    const {loading} = this.props;

    let dataForFlatlist = [{id: 1}, {id: 2}];

    if (loading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={dataForFlatlist}
          extraData={this.state}
          listKey={(item, index) => index.toString()}
          renderItem={this.renderFlatlistItems}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.backgroundGrey,
    maxHeight: heightPercentageToDP(62),
  },
  listWrapper: {
    flexDirection: 'column',
    padding: scaledSize(5),
    marginHorizontal: scaledSize(5),
    marginTop: scaledSize(5),
    backgroundColor: 'white',
  },
  searchWrapper: {
    flexDirection: 'row',
    flex: 0.2,
    marginHorizontal: scaledSize(5),
    marginTop: scaledSize(5),
    alignItems: 'center',
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
  searchBar: {
    flex: 1,
    // height: heightPercentageToDP(8),
    backgroundColor: 'transparent',
  },
  searchBarInput: {
    backgroundColor: 'white',
  },
  barCodeWrapper: {
    paddingHorizontal: widthPercentageToDP(1),
    paddingVertical: heightPercentageToDP(1),
    marginLeft: scaledSize(5),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  labelStyle: {
    fontWeight: 'bold',
    color: Constants.primaryColor,
  },
  bankAccountBox: {
    borderWidth: 1,
    margin: widthPercentageToDP(3),
    padding: widthPercentageToDP(2.5),
    borderRadius: 5,
    borderColor: '#d6d6d6',
    backgroundColor: Constants.white,
    flex: 0.2,
  },
});

const mapStateToProps = state => ({
  groupList: state.ShippingList.groupList,
  statusList: state.ShippingList.statusList,
  totalGroupListCount: state.ShippingList.totalGroupListCount,
  loading: state.ShippingList.loading,
  groupShippingData: state.ShippingList.groupShippingData,
  userBankDetails: state.ShippingList.userBankDetails,
  firstDate: state.ShippingList.firstDate,
  lastDate: state.ShippingList.lastDate,
  dateArray: state.ShippingList.dateArray,
  isBankAccountPresent: state.ShippingList.isBankAccountPresent,
  groupSummary: state.groupSummary,
  clWeeklyLoading: state.ShippingList.clWeeklyLoading,
  userPref: state.login.userPreferences,
  userProfile: state.userProfile,
  rewards: state.rewards.rewards,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getShippingListGroup: (
    page,
    group,
    phone,
    status,
    awb,
    shipmentId,
    shouldShowLoading,
    isFromCLTask
  ) => {
    dispatch(
      GetShippingListGroup(
        page,
        group,
        phone,
        status,
        awb,
        shipmentId,
        shouldShowLoading,
        isFromCLTask
      )
    );
  },
  getShippingDetails: item => {
    dispatch(GetShippingDetails(item));
  },
  onGetRewards: (
    getCashback,
    getCoins,
    getScratchDetails,
    history,
    page,
    size
  ) => {
    dispatch(
      getRewards(getCashback, getCoins, getScratchDetails, history, page, size)
    );
  },
  getGroupShippingData: (startDate, endDate) => {
    dispatch(GetGroupShippingData(startDate, endDate));
  },
  getUserBankDetails: () => {
    dispatch(GetUserBankDetails());
  },
  onCurrentUser: () => {
    dispatch(currentUser());
  },
});

export default withNavigationFocus(
  withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(GroupShippingList)
  )
);
