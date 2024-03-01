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
import idx from 'idx';
import {Constants} from '../../../../styles';
import {
  GetShippingDetails,
  GetShippingListGroup,
  GetGroupShippingData,
  GetUserBankDetails,
  GetClEarning,
} from '../redux/actions';
import ShippingListItem from './ShippingListItem';
import {ClShippingDetail} from './ClShippingDetail';
import {FriendListComponent} from './FriendListComponent';
import DropdownWithSearch from '../../../../components/DropdownWithSearch';
import NavigationService from '../../../../utils/NavigationService';
import {getRewards} from '../../MyRewards/actions';
import {currentUser} from '../../UserProfile/actions';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {setStartDate, getRouteTab} from '../../CLOnboarding/components/CLUtils';
import moment from 'moment';
import {AppText} from '../../../../components/Texts';
import CLWeeklyTarget from '../../CLOnboarding/components/CLWeeklyTarget';
import CLCommissionDetails from '../../CLOnboarding/components/CLCommissionDetails';
import {FlatList} from 'react-native-gesture-handler';
import Accordian from '../../../../components/Accordion/Accordion.js';
import {
  Placeholder,
  PlaceholderLine,
  Fade,
  PlaceholderMedia,
  ShineOverlay,
} from 'rn-placeholder';
import ShipmentEarnings from '../../ShipmentDetails/ShipmentEarnings';

class CLEarnings extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
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
      clEaringLoaded:false
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
    this.props.getUserBankDetails();
    if (!this.props.rewards || !Object.keys(this.props.rewards)) {
      //this.props.getRewards({getCoins: true});
    }
    if (!this.props.userProfile)
      this.props.onCurrentUser();
   
    this.props.getClEaring(null,null,
    callback=()=>{
      this.setState({clEaringLoaded:true})
    })
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

    this.setState({clEaringLoaded:false})
    this.props.getClEaring(item,'MONTHLY',
    callback=()=>{
      this.setState({clEaringLoaded:true})
    })
  };

 
  renderFlatlistItems = ({item, index}) => {
    const {
      t,
      groupShippingData,
      activeBankAccount,
      userBankDetails,
      isBankAccountPresent,
      dateArray,
      clWeeklyLoading,
      clEarningDetail,
      clDetails
    } = this.props;

    const {search, status, cancelCalled,clEaringLoaded} = this.state;
    let accountScreenTitle = isBankAccountPresent
      ? 'Edit Bank Account'
      : 'Add Bank Account';

    let verifiedAcc = activeBankAccount && activeBankAccount.isVerified 
      ? 'Account is verified'
      : 'ShopG will verify account';

    let totalEarning = clEarningDetail && clEarningDetail.totalEarnings;
    let eligibleValue = (clEarningDetail && clEarningDetail.earningDetails && clEarningDetail.earningDetails.bonus && clEarningDetail.earningDetails.bonus.bonusElegiblValue) ? clEarningDetail.earningDetails.bonus.bonusElegiblValue : '';

    const effectiveDate = idx(clEarningDetail, _ => _.effectiveDate);
    const formattedEffectiveDate = effectiveDate ? moment(effectiveDate).format("dddd, MMMM Do YYYY"): '';
    const FULFILLMENT_CL =
    clDetails &&
    clDetails.clConfig &&
    clDetails.clConfig.clType &&
    (clDetails.clConfig.clType == 'FULFILLMENT' ||
      clDetails.clConfig.clType == 'SHOPG_FULFILLMENT')
      ? true
      : false;

    if (item.id === 1) {
      return (
        <View style={{flex: 1}}>
          {1 &&
          dateArray ? (
            <View style={{flex: 0.4}}>
              <CLWeeklyTarget
                t={t}
                selectedMonth={this.state.selectedMonth}
                routeTab={this.props.dateArray}
                onSelectMonthName={this.onSelectMonthName}
              />

            <View style={{width:widthPercentageToDP(100)}}>
              
                <Accordian
                  t={t}
                  showArrow
                  iconColor={Constants.primaryColor}
                  title={'Commission Breakup'}
                  type={'childComponent'}
                  childComponent={<CLCommissionDetails />}
                  titleStyle={{alignSelf: 'center',color: Constants.primaryColor, fontSize: 12}}
                />
              
            </View>


              <View style={styles.bankAccountBox}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <View>
                      <AppText bold>{t('Get your earning in account')}</AppText>
                    </View>
                    <View>
                      {isBankAccountPresent ? (
                        <AppText
                          style={
                            activeBankAccount.isVerified
                              ? {color: Constants.greenishBlue}
                              : {color: Constants.red}
                          }>
                          {verifiedAcc}
                        </AppText>
                      ) : null}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                    }}
                    onPress={() => {
                      this.props.dispatch({
                        type: 'shippingList/SET_STATE',
                        payload: {
                          shouldNotFocus: true,
                        },
                      });
                      NavigationService.navigate('CLAccount');
                    }}>
                    <AppText greenishBlue bold>
                      {accountScreenTitle}
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>

              {
                (clEaringLoaded && clEarningDetail)
                ?
                <View style={styles.centerView}>

                  <View style={styles.line} />
                    <AppText grey size='S' style={styles.earningCalculateText}>
                        {t('Earnings calculated on delivered orders ')}
                        <AppText size='S' bold greenishBlue>
                          {t((clEarningDetail && clEarningDetail.totalDeliveredValue) ? ('₹'+clEarningDetail.totalDeliveredValue) : '')}
                        </AppText>
                    </AppText>
                    <AppText black bold size='M' style={styles.earningMiddleText}>
                        {t('Earnings  ')}
                        <AppText size='M' bold greenishBlue>
                          {t('₹'+totalEarning)}
                        </AppText>
                    </AppText>
                    <AppText grey size='S' style={styles.earingBottomText}>
                        {t('Base + Bonus commission')}
                    </AppText>
                    <AppText size='S' bold style={[styles.earingPaymentText, clEarningDetail.paymentBankDetails && clEarningDetail.paymentBankDetails.paymentSuccess ? { color: Constants.primaryColor }: { color: Constants.red }]}>
                        {clEarningDetail.paymentBankDetails ? clEarningDetail.paymentBankDetails.paymentSuccess ? t(`₹#AMOUNT# credited successfully in account #ACCOUNTNUMBER#,#BRANCH#`,{AMOUNT: clEarningDetail.paidAmount,ACCOUNTNUMBER: clEarningDetail.paymentBankDetails.accountNumber, IFSC: clEarningDetail.paymentBankDetails.ifscCode, BRANCH: clEarningDetail.paymentBankDetails.branch}) : t(`Bank transfer failed due to #ERROR#`, { AMOUNT: clEarningDetail.paidAmount, ERROR: clEarningDetail.paymentBankDetails.failureReason}): t(``)}
                    </AppText>
                  <View style={styles.line} />

                </View> : null
              }
              {
                (clEaringLoaded && clEarningDetail)
                ?
                <View style={styles.centerView}>
                  <AppText bold size='S' style={styles.baseCommisionText}>
                      {t('BASE COMMISSION')}
                      <AppText size='S' bold black>
                        {t(' • ')}
                      </AppText>
                      <AppText size='S' bold black>
                        {t(clEarningDetail && clEarningDetail.baseEarnings) ? ('₹'+clEarningDetail.baseEarnings) : ''}
                      </AppText>
                  </AppText>
                  <AppText grey size='XS' style={styles.weektextStyle}>
                      {t('This week#APPOSTROPHIE# base, updated on #DATE#',{APPOSTROPHIE:'\'s',DATE: formattedEffectiveDate})}
                  </AppText>

                  {
                    (eligibleValue)
                    ?
                    <View style={{height:heightPercentageToDP(32),width:widthPercentageToDP(100)}}>
                      <ShipmentEarnings 
                        earningList={clEarningDetail.earningDetails.earningCategories} 
                        data={null} t={t} 
                      />
                    </View> 
                    : null
                  }

                   {/* <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={eligibleValue ? clEarningDetail.earningDetails.earningCategories : []}
                    listKey={(item, index) => index.toString()}
                    renderItem={({item, index}) =>  
                    {
                      let commissionPercent = item.earningCategory === 'delivery' ? item.delivery : item.demand;
                    return (
                      <View style={styles.listTop}>
                        <View style={[styles.listSecond,{backgroundColor:'#3da78b'},styles.centerView]}>
                          <View style={[{flex:1},styles.centerView]}>
                            <AppText white bold size='S'>
                                {t('₹'+item.demandCommision)}
                            </AppText>
                          </View>
                          <View style={[{flex:1},styles.centerView]}>
                            <AppText white bold size='S'>
                                {t(item.name)}
                            </AppText>
                          </View>
                        </View>
                        <View style={styles.thirdListItem}>
                          <View style={{flex:1,flexDirection:'row'}}>
                            <View style={[{flex:1},styles.centerView]}>
                                <AppText black bold size='XS'>
                                    {t(item.items)}
                                </AppText>
                                <AppText grey size='XS' style={{textAlign:'center'}}>
                                    {t('Orders#NL#Delivered',{NL:'\n'})}
                                </AppText>
                            </View>
                            <View style={[{flex:1},styles.centerView]}>
                                <AppText black bold size='XS'>
                                    {t('₹'+item.totalPrice)}
                                </AppText>
                                <AppText grey size='XS' style={{textAlign:'center'}}>
                                    {t('Total Order#NL#Value',{NL:'\n'})}
                                </AppText>
                            </View>

                          </View>
                          <View style={{flex:1,flexDirection:'row'}}>
                            <View style={[{flex:1},styles.centerView]}>
                                <AppText black bold size='XS'>
                                {commissionPercent ? t(commissionPercent+'%'): ''}
                                </AppText>
                                <AppText grey size='XS' style={{textAlign:'center'}}>
                                    {t('Base#NL#Commission',{NL:'\n'})}
                                </AppText>
                            </View>
                            <View style={[{flex:1},styles.centerView]}>
                                <AppText black bold size='XS'>
                                    {t('₹'+item.demandCommision)}
                                </AppText>
                                <AppText grey size='XS' style={{textAlign:'center'}}>
                                    {t('Calculated#NL#Earnings',{NL:'\n'})}
                                </AppText>
                            </View>

                          </View>
                        </View>
                      </View>  
                    )
                  }
                }
                  />  */}

                <View style={styles.demandBox}>
                    <View style={styles.dot}/>
                    <AppText black bold size='XS'>
                        {t(`DEMAND:   `)}
                    </AppText>
                    <AppText black size='XS'>
                        {t(`Category wise % commissions on`)}
                    </AppText>
                    <AppText bold size='XS' style={{color:Constants.pinkTextColor}}>
                        {t(` orders you get.`)}
                    </AppText>
                </View>

                {FULFILLMENT_CL ?  
                <View style={styles.deliveryBox}>
                    <View style={styles.dot}/>
                    <AppText black bold size='XS'>
                        {t(`DELIVERY:   `)}
                    </AppText>
                    <AppText black size='XS'>
                        {t(`Flat % commissions on`)}
                    </AppText>
                    <AppText bold size='XS' style={{color:Constants.pinkTextColor}}>
                        {t(` orders you deliver.`)}
                    </AppText>
                </View>: null}
                  
                  <View style={styles.line} />
                  {clEarningDetail.earningDetails ?    
                  <AppText bold size='S' style={styles.bonusBox}>
                      {t('BONUS COMMISSION')}
                      <AppText size='S' bold black>
                        {t(' • ')}
                      </AppText>
                      <AppText size='S' bold black>
                      {(clEarningDetail && clEarningDetail.earningDetails && clEarningDetail.earningDetails.bonus)? parseInt(clEarningDetail.earningDetails.bonus.earnings).toFixed(2) : ''}
                      </AppText>
                  </AppText> : null}
                  {clEarningDetail.earningDetails ?
                  <AppText grey size='XS' style={styles.weektextStyle}>
                      {t('This week#APPOSTROPHIE# base, updated on #DATE#',{APPOSTROPHIE:'\'s',DATE:formattedEffectiveDate})}
                  </AppText>:null}
                  {clEarningDetail.earningDetails ?  
                  <View style={styles.eligibleBonusUpper}>
                      <View style={[styles.eligibleBonusMiddle,styles.centerView]}>
                            <AppText white bold size='S'>
                                {t('₹'+eligibleValue)}
                            </AppText>
                            <AppText white bold size='XS'>
                                {t('ELIGIBLE ON BONUS SLAB #SLAB#',{SLAB:eligibleValue<5000 ? '₹0 - ₹4,999' : (eligibleValue>5000 && eligibleValue<10000) ? '₹5,000 - ₹9,999' : eligibleValue>10000 ? '₹10,000+' : ''})}
                            </AppText>
                      </View>
                      <View style={styles.eligibleBonusLower}>
                          <View style={[styles.centerView,{width:widthPercentageToDP(20)}]}>
                              <AppText black bold size='XS'>
                              {(clEarningDetail && clEarningDetail.earningDetails && clEarningDetail.earningDetails.bonus)? clEarningDetail.earningDetails.bonus.bonusScheme.bonus : ''}
                              </AppText>
                              <AppText black size='XS' style={{textAlign:'center'}}>
                                  {t(`Bonus Commission`)}
                              </AppText>
                          </View>
                          <View style={[styles.centerView,{width:widthPercentageToDP(20)}]}>
                              <AppText black bold size='XS'>
                              {(clEarningDetail && clEarningDetail.earningDetails && clEarningDetail.earningDetails.bonus)? parseInt(clEarningDetail.earningDetails.bonus.earnings).toFixed(2) : ''}
                              </AppText>
                              <AppText black size='XS' style={{textAlign:'center'}}>
                                  {t(`Calculated Earnings`)}
                              </AppText>
                          </View>
                      </View>
                  </View>: null}

              </View>
              :
              (!clEarningDetail)
              ?
              <View style={styles.centerView}>
                  <AppText black size='XS' style={{textAlign:'center'}}>
                      {t('Earning not found')}
                  </AppText>
              </View>
              :
              <View style={{flex: 1, marginTop: heightPercentageToDP(3)}}>
                  <PlaceholderLine
                  width={25}
                  style={styles.placeHolderLineStyle}
                  />
                  <Placeholder
                  Animation={ShineOverlay}
                  style={{
                      marginVertical: heightPercentageToDP(2),
                  }}
                  >
                  <PlaceholderMedia
                      style={styles.placeHolderMediaStyle}
                      />
                  </Placeholder>
                  <Placeholder
                  Animation={ShineOverlay}
                  style={{
                      marginVertical: heightPercentageToDP(2),
                  }}
                  >
                  <PlaceholderMedia
                      style={styles.placeHolderMediaStyle}
                      />
                  </Placeholder>
                  <Placeholder
                  Animation={ShineOverlay}
                  style={{
                      marginVertical: heightPercentageToDP(2),
                  }}
                  >
                  <PlaceholderMedia
                      style={styles.placeHolderMediaStyle}
                      />
                  </Placeholder>
              </View>
              }




              <View style={{flex: 0.4}}>
                <ClShippingDetail
                  t={t}
                  selectedMonth={this.state.selectedMonth}
                  groupShippingData={groupShippingData}
                  rewards={this.props.userProfile.rewards}
                  clWeeklyLoading={clWeeklyLoading}
                />
              </View>
            </View>
          ) : (
            <View
              style={{
                height: heightPercentageToDP(14),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator animating size="large" />
            </View>
          )}
        </View>
      );
    }
  };

	
  render_FlatList_footer = () => {
 
    var footer_View = (
 
    <View style={{height:heightPercentageToDP(20),width:widthPercentageToDP(100)}} />
 
    );
 
    return footer_View;
 
  };

  render() {
    const {loading} = this.props;

    let dataForFlatlist = [{id: 1}];

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
          ListFooterComponent={this.render_FlatList_footer}
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
  bankAccountBox: {
    borderWidth: 1,
    margin: widthPercentageToDP(3),
    padding: widthPercentageToDP(2.5),
    borderRadius: 5,
    borderColor: '#d6d6d6',
    backgroundColor: Constants.white,
    flex: 0.2,
  },
  line:{
    height:heightPercentageToDP(0.1),
    width:widthPercentageToDP(100),
    backgroundColor:'#d6d6d6'
  },
  centerView:{
    justifyContent:'center',
    alignItems:'center'
  },
  dot:{
    backgroundColor:'black',
    height:heightPercentageToDP(1),
    width:heightPercentageToDP(1),
    borderRadius:heightPercentageToDP(1),
    justifyContent:'center',
    alignItems:'center',
    marginRight:widthPercentageToDP(2)
  },
  placeHolderMainView: {
    marginVertical: 6,
    marginHorizontal: 15,
    borderRadius: 4,
  },
  placeHolderMediaStyle: {
      width: widthPercentageToDP(100),
      height: heightPercentageToDP(9),
      marginRight: widthPercentageToDP(5),
  },
  placeHolderLineStyle: {
      paddingBottom: heightPercentageToDP(2),
      marginTop: heightPercentageToDP(3),
      marginBottom: heightPercentageToDP(2),
      marginLeft: widthPercentageToDP(4),
  },
  earningCalculateText: {
    marginTop:heightPercentageToDP(1)
  },
  earningMiddleText: {
    marginVertical:heightPercentageToDP(1)
  },
  earingBottomText:{
    marginBottom:heightPercentageToDP(0.5)
  },
  earingPaymentText: {
    textAlign: 'center',
    marginBottom:heightPercentageToDP(1)
  },
  baseCommisionText:{
    color:'#fa6400',
    marginVertical:heightPercentageToDP(1)
  },
  weektextStyle:{
    marginBottom:heightPercentageToDP(1)
  },
  listTop: { 
    height:heightPercentageToDP(25),
    width:widthPercentageToDP(50),
    marginHorizontal:widthPercentageToDP(5)
  },
  listSecond:{
    flex:1,
    borderTopWidth:widthPercentageToDP(0.2),
    borderLeftWidth:widthPercentageToDP(0.2),
    borderRightWidth:widthPercentageToDP(0.2),
    borderTopLeftRadius:widthPercentageToDP(2),
    borderTopRightRadius:widthPercentageToDP(2)
  },
  thirdListItem:{
    flex:2,
    borderBottomRightRadius:widthPercentageToDP(2),
    borderBottomLeftRadius:widthPercentageToDP(2),
    borderBottomWidth:widthPercentageToDP(0.2),
    borderLeftWidth:widthPercentageToDP(0.2),
    borderRightWidth:widthPercentageToDP(0.2)
  },
  demandBox:{
    alignItems:'center',
    width:widthPercentageToDP(100),
    marginTop:heightPercentageToDP(1),
    flexDirection:'row',
    paddingHorizontal:heightPercentageToDP(1)
  },
  deliveryBox:{
    alignItems:'center',
    width:widthPercentageToDP(100),
    marginVertical:heightPercentageToDP(1),
    flexDirection:'row',
    paddingHorizontal:heightPercentageToDP(1)
  },
  bonusBox:{
    color:'#fa6400',
    marginVertical:heightPercentageToDP(1)
  },
  eligibleBonusUpper:{
    height:heightPercentageToDP(20),
    width:widthPercentageToDP(90)
  },
  eligibleBonusMiddle:{
    flex:1,
    borderTopWidth:widthPercentageToDP(0.2),
    borderLeftWidth:widthPercentageToDP(0.2),
    borderRightWidth:widthPercentageToDP(0.2),
    borderTopLeftRadius:widthPercentageToDP(2),
    borderTopRightRadius:widthPercentageToDP(2),
    backgroundColor:Constants.primaryColor
  },
  eligibleBonusLower:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    borderBottomWidth:widthPercentageToDP(0.2),
    borderLeftWidth:widthPercentageToDP(0.2),
    borderRightWidth:widthPercentageToDP(0.2),
    borderBottomLeftRadius:widthPercentageToDP(2),
    borderBottomRightRadius:widthPercentageToDP(2),
    paddingHorizontal:widthPercentageToDP(4)
  }
});

const mapStateToProps = state => ({
  loading: state.ShippingList.loading,
  clEarningDetail:state.ShippingList.clEarningDetail,
  clConfig: state.clOnboarding.clConfig,
  groupShippingData: state.ShippingList.groupShippingData,
  userBankDetails: state.ShippingList.userBankDetails,
  activeBankAccount: state.ShippingList.activeBankAccount,
  firstDate: state.ShippingList.firstDate,
  lastDate: state.ShippingList.lastDate,
  dateArray: state.ShippingList.dateArray,
  isBankAccountPresent: state.ShippingList.isBankAccountPresent,
  clWeeklyLoading: state.ShippingList.clWeeklyLoading,
  userPref: state.login.userPreferences,
  userProfile: state.userProfile,
  rewards: state.rewards.rewards,
  clDetails: state.login.clDetails,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getGroupShippingData: (startDate, endDate) => {
    dispatch(GetGroupShippingData(startDate, endDate));
  },
  getUserBankDetails: () => {
    dispatch(GetUserBankDetails());
  },
  onGetRewards: (getCashback, getCoins, getScratchDetails ,history,page, size) => {
    dispatch(getRewards(getCashback, getCoins, getScratchDetails ,history,page, size));
  },
  onCurrentUser: () => {
    dispatch(currentUser());
  },
  getClEaring: (startDate,frequency,callback) => {
    dispatch(GetClEarning(startDate,frequency,callback));
  },
});

export default withNavigationFocus(
  withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(CLEarnings),
  ),
);
