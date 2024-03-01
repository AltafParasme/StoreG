/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  View,
  BackHandler,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
  Picker,
  ActivityIndicator,
} from 'react-native';
import idx from 'idx';
import { Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade } from "rn-placeholder";

import {Icon, Header} from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {Images} from '../../../../assets/images';
import { AppText } from '../../../components/Texts'
import { connect, Dispatch } from 'react-redux';
import Button from '../../../components/Button/Button'
import { Constants } from '../../../styles';
import { getOrderHistory, cancelOrder, returnOrder, getOfferDetails, setOrderHistory, changeField, getOrderDetails } from './actions';
import Modal from "react-native-modal";
import { showToastr, startWhatsAppSupport } from '../utils';
import { LogFBEvent, Events, SetScreenName } from '../../../Events';
import NavigationService from '../../../utils/NavigationService';
import GroupOrderOverlay from '../OrderConfirmation/Component/GroupOrderOverlay';
import { withTranslation } from 'react-i18next';
import {scaledSize, AppWindow, heightPercentageToDP, widthPercentageToDP} from '../../../utils';
import { AppConstants } from '../../../Constants';
import {Fonts, Colors} from '../../../../assets/global';
import {getRewards} from '../UserProfile/actions';

const BUTTONS = ["View Offer", "Cancel Order"];
const BUTTON = ["View Offer"];
const DESTRUCTIVE_INDEX = 3;
const CANCEL_INDEX = 2;

class PastOrdersBase extends Component {
  constructor(private router: Router) {super();
    this.state = {
      isModalVisible: false, 
      id: null, 
      offerPrice : null, 
      isHandleLoadMore: false, 
      offers: [], 
      ordersToDisplay: [],
      isLimitReached: false, 
      showFriendsOrder: false,
      selectedValue: 0 
    } ;
    this.onEndReachedCalledDuringMomentum = true;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.enableFriendsOrder = this.enableFriendsOrder.bind(this);
}


  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
      this.props.onChangeField('page', 1);
      this.props.onChangeField('orders', null);
      this.props.onGetOrderHistory({ page: 1, group: this.state.showFriendsOrder});
    });
    SetScreenName(Events.LOAD_MY_ORDERS_SCREEN.eventName());
    LogFBEvent(Events.LOAD_MY_ORDERS_SCREEN, null);
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    this._unsubscribe.remove();
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  handleModalClick = () => {
   this.setState((state) => ({
    isModalVisible: !state.isModalVisible
    }));
   
   if (this.state.offerPrice === '0.00') {
      showToastr('The order is free , it cannot be cancelled!');
      
   } else {
      this.props.onCancelOrder({id : this.state.id, offerPrice: this.state.offerPrice});
   }
   
  };


  handleLoadMore = () => {
    let {orders, count, page} = this.props.pastOrders;
    if(!this.onEndReachedCalledDuringMomentum){
      this.onEndReachedCalledDuringMomentum = true;
      this.props.onChangeField('page', page + 1);
      if (count > orders.length) {
        this.setState({
          isHandleLoadMore: true,
        })
        this.props.onGetOrderHistory({ page: page + 1, group: this.state.showFriendsOrder});
      } else {
        this.setState({
          isLimitReached: !this.state.isLimitReached})
        return false;
      }
    }
  }

  handleBackButtonClick() {
    NavigationService.goBack();
    return true;
  }

  

  navigateTo() {
    NavigationService.navigate('Home');
  }

  onCancelOrder = (item) => {
    this.setState({ isModalVisible: true, id: item.id, offerPrice: item.transactionDetails.offerPrice })
  }

  onItemClick = (item) => {
    this.props.onGetOrderDetails({ id: item.orderid })

    let logEventsData = {
      orderId: item.id,
    };
    LogFBEvent(Events.MY_ORDERS_SCREEN_ORDER_CLICK, logEventsData);
  }

  callUs = () => {
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    const callNumber = userMode == 'CL' ? AppConstants.supportCLCallNumber : AppConstants.supportCallNumber;
    
    Linking.openURL(`tel:${callNumber}`)
  }

  enableFriendsOrder = async () => {
    const currentValue = this.state.showFriendsOrder;
    await this.props.onChangeField('page', 1);
    await this.props.onChangeField('orders', null);
    this.props.onGetOrderHistory({ page: 1, group: !currentValue});
    let selectedValue = currentValue ? 0 : this.state.selectedValue;
    this.setState(prevState => ({
      showFriendsOrder: !currentValue,
      selectedValue: selectedValue
    }))
  }

  setSelectedValue = (value: string)  => {
    // const { orders } = this.props;
    // const filteredOrders = orders.filter((o) => o.contactNumber === value);
    if (value !== 0) {
      this.setState({selectedValue: value});
    }
   
  }

  render() { 

    const {groupSummary,rewards} = this.props;
    const language = this.props.i18n.language;
    const userPreference = this.props.login.userPreference
    if(!this.props.pastOrders.initialApiCallCompleted) {
      return (
        <View>
        <Header containerStyle={styles.header}
        rightComponent = {
          <Image style={styles.imageContent}  source={Images.logo} />}
        />
        <View style={{ flex: 1, marginTop: 10, padding: 10}}>
        {[1,2,3,4,5].map((id) => {
          return(
          <Placeholder key={id}
          Animation={Fade}
          Left={PlaceholderMedia}
        >
          <PlaceholderLine width={80} />
          <PlaceholderLine />
          <PlaceholderLine width={30} />
        </Placeholder>
        )})}
        </View>
        </View>
      );
    }

    const renderFooter = () => (
      <View>
        {this.props.pastOrders.loading ? (
          <ActivityIndicator color="black" style={{margin: 10}} />
        ) : null}
      </View>
    );
    const {t} = this.props;      
    const { orders, friendsContactList } = this.props.pastOrders;
    const { selectedValue, showFriendsOrder } = this.state;
    
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    const len = idx(orders, _=>_.length);

    let ordersToDisplay = (len && showFriendsOrder && parseInt(selectedValue)) ? orders.filter((ou)=> ou.contactNumber === selectedValue) : orders;
    const friendsPickerList = friendsContactList.map((item) => {
      return (
        <Picker.Item label={item} value={item} />
      )
    });
    

    const renderData = ({item, index}) => {
      return (<GroupOrderOverlay
        item={item}
        index={index}
        isGroupUnlocked={true}
        withoutButton={true}
        isLast={false}
        showPriceTags={false}
        showName={this.state.showFriendsOrder}
        showRewards={false}
        showOrderStatus={true}
        showBottomMenu={false}
        showOrderId={true}
        withoutTag
        mediaJson={item.mediaJson}
        onGetOfferDetails={this.props.onGetOfferDetails}
        onCancelOrder={this.onCancelOrder}
        onItemClick={this.onItemClick}
        screen={this.props.navigation.state.routeName}
        showArrow
        rewards={rewards}
        groupSummary={groupSummary}
        language={language}
        userPreference={userPreference}
       />);
    }

    return (
      <View style={{flex: 1}}>
          <Header containerStyle={styles.header}
            leftComponent={
            <View style={styles.leftComponentStyle}>
              <TouchableOpacity
                onPress={this.handleBackButtonClick}>
                <Icons name={'arrow-back'} size={28} color='#fff' style={{marginLeft: '3%', paddingRight: '15%', top:"3%"}}/>
              </TouchableOpacity>
              <AppText
                white
                bold
                size="M">
                {t('My Orders')}
              </AppText>
              
            </View>}
          
          rightComponent={
            <TouchableOpacity onPress={this.navigateTo}><Image style={styles.imageContent}  source={Images.logo} /></TouchableOpacity>
          }
         />
          <View style={styles.subHeaderStyle}>
          
          <View style={{ flexDirection: 'column', height: heightPercentageToDP(7), width: widthPercentageToDP(90), justifyContent: 'space-between'}}> 
            <AppText size="M" black style={styles.listTitle}>{t(`Need help? Reach out to us on `)}</AppText>          
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button onPress={() => startWhatsAppSupport(userMode, 'PastOrders')} styleContainer={styles.supportBtn}><AppText white bold size="M"><Image source={Images.whatsapp} style={styles.whatsappImage}/>{t(' WhatsApp')}</AppText></Button>
              <Button onPress={this.callUs} styleContainer={[styles.supportBtn, { marginLeft: 10, backgroundColor: Constants.white }]}><AppText greenishBlue bold size="M">{t('Call us')}</AppText></Button>
            </View>
          </View>
          </View>
          <View style={styles.orderBox}>
              <View style={{ flexDirection: 'row' }}>
                {/* {this.state.showFriendsOrder ? null : null} */}
                {this.state.showFriendsOrder ? 
                  friendsContactList && friendsContactList.length > 0 ? 
                  <Picker
                    selectedValue={this.state.selectedValue}
                    style={{ justifyContent: 'center', height: heightPercentageToDP(10), width: widthPercentageToDP(45) }}
                    onValueChange={(itemValue, itemIndex) => this.setSelectedValue(itemValue)}>
                    <Picker.Item label='Friend`s mobile number' value='0' />  
                    {friendsPickerList}
                  </Picker> : null 
                    : null}
                {userMode === 'CL' ? <View style={styles.orderFilters}><Button onPress={this.enableFriendsOrder} styleContainer={[styles.filterBtn, this.state.showFriendsOrder ? { backgroundColor: Constants.primaryColor } : { backgroundColor : Constants.white}]}><AppText style={this.state.showFriendsOrder ? {color: Constants.white} : {color: Constants.primaryColor}} bold size="M">{this.state.showFriendsOrder ? t('Show My Orders') : t('Show Friends Order')}</AppText></Button></View> : null}
              </View>
              <View style={styles.orderStatus}>
                      <View style={styles.pastOrders}>
                       {len > 0 ? 
                          <Animated.FlatList
                              data={ordersToDisplay}
                              renderItem={renderData}
                              keyExtractor={item => item.orderid}
                              onEndReached={!this.state.isLimitReached ? this.handleLoadMore : null}
                              onEndReachedThreshold={0.1}
                              onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                              ListFooterComponent={renderFooter}
                            />
                       : len == 0 ? <View><AppText black bold size="L">{t('No Past Orders found')}</AppText></View> : null}
                       </View></View></View>

                              <Modal isVisible={this.state.isModalVisible} style={styles.modalStyle} onBackButtonPress={this.toggleModal}>
                              <Icon name="md-close" style={{
                                            fontSize: 20,
                                            left: "45%",
                                            right: 0,
                                            top: "-24%",
                                            bottom: 0
                                   }}
                                   onPress={this.toggleModal}
                                   />
                                  <AppText style={styles.modalText}>{t('Are you sure, you want to cancel the order')}?</AppText>
                                    <View style={styles.container}>
                                    <View  style={{flex: 0.3, width: 50, height: 50}}>                                      
                                        <TouchableOpacity  style={styles.yesButtonStyle}  onPress={this.handleModalClick}>
                                          <AppText style={{left: "30%", top: "10%", color: Constants.white}}>{t('Yes')}</AppText>
                                          </TouchableOpacity>
                                      </View>
                                      <View style={{flex: 0.3, width: 50, height: 50}}>
                                        <TouchableOpacity  style={styles.noButtonStyle}  onPress={this.toggleModal}>
                                        <AppText style={{left: "37%", top: "10%", color: Constants.white}}>{t('No')}</AppText>
                                        </TouchableOpacity>
                                      </View>
                                    </View>                                                       
                              </Modal>
      </View>
    );
  };
}

const styles = StyleSheet.create({
    contentBox: {
      width: "100%",
      height: "100%"
    },
    headerLeft: {
      backgroundColor: Constants.primaryColor  
    },
    container: {
      flex: 0.4,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: "center",      
    },

    subHeaderStyle : {
      // shadowOffset: {width: 4, height: 1.5},
      // shadowColor: Colors.darkBlack,
      // shadowOpacity: 45,
      // elevation: 100,
      alignItems: 'center',
      justifyContent: 'center',
      padding: widthPercentageToDP(4),
    },
    modalStyle : {
      flex: 0.3,
      top: "24%",
      backgroundColor: Constants.white,
      alignItems:'center',
      justifyContent: 'center',
      width: "90%"
    },

    yesButtonStyle : {
      backgroundColor: Constants.lightGreen,
      height: "55%",
      width:"74%",
      color: Constants.white   
    },

    noButtonStyle : {    
      backgroundColor: Constants.red,
      height: "55%",
      width:"74%",
      color: Constants.white
    },
     
    leftComponentStyle: {
    flexDirection:'row', 
    justifyContent: 'space-around',
    width: widthPercentageToDP(30),
    alignItems: 'center',
  },

    header: {
      backgroundColor: Constants.primaryColor,
      height: heightPercentageToDP(8),
      paddingBottom: heightPercentageToDP(3),
    },
    imageContent: {
      width: widthPercentageToDP(30),
      height: heightPercentageToDP(30),
      resizeMode: 'contain',
    },
    pastOrders : {
      maxHeight: heightPercentageToDP(92)
    },
    profileBox: {
      width: "100%",
      //alignItems: "center",
      backgroundColor: Constants.white,
    },
    productBox: {
        flex: 0.5,
        flexDirection: 'row',
        marginTop: 10
    },
    nameText: {
      // marginTop: 10,
      fontSize: 20,
      fontWeight: "bold",
      color: Constants.dodgerBlue
    },
    detailsText: {
      marginTop: 2,
      fontSize: 16,
      paddingRight: 10,
      color: Constants.black
    },
    detailsCancelledText: {
      marginTop: 2,
      fontSize: 16,
      paddingRight: 10,
      color: Constants.red
    },
    modalText: {
      marginTop: -2,
      fontSize: 16,
      color: Constants.black
    },
    mobileNumber: {
      marginTop: 10,
      fontSize: 24,
      color: Constants.white
    },
    center: {
      width: "100%",
      alignItems: "center"
    },
    editBtn: {
      marginTop: 10,
      height: 30,
      color: Constants.white,
      backgroundColor: Constants.primaryColor,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Constants.white 
    },
    titleContainer: {
      justifyContent: 'center',
      flex: 0.2
    },
    listTitle: {
      textAlign: 'center',
      fontWeight: "bold",
      fontSize: 20
    },
    footerIcon: {
      color: Constants.black
    },
    wpIcon: {
      color: Constants.green,
      marginLeft: 10
    },
    orderFilters: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      height: heightPercentageToDP(10)
    },
    orderStatus: {
      flex: 1,
    },
  orderBox: {
    flex: 1,
    paddingHorizontal: widthPercentageToDP(1),
  },
  shareEarnButtonView: {
    backgroundColor: '#fff', 
    marginLeft: scaledSize(240), 
    marginTop: scaledSize(4), 
    borderRadius: scaledSize(8), 
    width: '30%', 
    borderColor: '#FFCA9E', 
    borderWidth: scaledSize(2), 
    padding: scaledSize(3), 
    flexDirection: 'row'
  },
  iconStyle: {
    color: '#FF6900',
    fontSize: scaledSize(16),
    resizeMode: 'contain',
    //marginRight: 10,
  },
  filterBtn: {
    backgroundColor: Constants.primaryColor,
    height: 20,
    padding: 5,
    flex: 0.45,
    //color: Constants.primaryColor,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Constants.primaryColor
  },
   supportBtn: {
      backgroundColor: Constants.primaryColor,
      height: 40,
      padding: 5,
      flex: 0.45,
      color: Constants.primaryColor,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Constants.primaryColor
    },
    whatsappImage: {
      height: 20,
      width: 20,
      resizeMode: 'contain',
    },
});

const mapStateToProps = (state) => ({
    pastOrders: state.pastOrders,
    groupSummary: state.groupSummary,
    rewards: state.rewards.rewards,
    login: state.login,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  onGetOrderHistory: (obj: Object) => {
    dispatch(getOrderHistory(obj));
  },
  onGetOfferDetails: (obj: Object) => {
    dispatch(getOfferDetails(obj));
  },
  onGetOrderDetails: (obj: Object) => {
    dispatch(getOrderDetails(obj));
  },
  onCancelOrder: (obj: Object) => {
    dispatch(cancelOrder(obj));
  },
  onReturnOrder: (obj: Object) => {
    dispatch(returnOrder(obj));
  },
  onGetRewards: () => {
    dispatch(getRewards());
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
  // other callbacks go here...
});

const PastOrders = connect(
  mapStateToProps,
  mapDipatchToProps
)(PastOrdersBase);

export default withTranslation()(PastOrders);
