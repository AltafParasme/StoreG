import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  View, 
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Header} from '../../../components/Header/Header';
import {
    scaledSize,
    AppWindow,
    heightPercentageToDP,
    widthPercentageToDP,
  } from '../../../utils';
import {Constants} from '../../../styles';
import {AppText} from '../../../components/Texts';
import Modal from 'react-native-modal';
import ScratchView from 'react-native-scratch'
import {getWidgets} from '../Home/redux/action';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import {liveAnalytics} from '../ShopgLive/redux/actions';
import {getRewards} from '../MyRewards/actions';
import {Images} from '../../../../assets/images';
import {changeField} from '../ShopgLive/redux/actions';
import {changeField as changeFieldRewards} from '../MyRewards/actions';
import moment from 'moment';

class ScratchCardList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showModal:false,
      scratchItem:{}
    };
  }

  componentDidMount() {
    const {userPref} = this.props;
    const userId = (userPref && userPref.uid) ? userPref.uid : '';
    SetScreenName(Events.LOAD_SCRATCH_CARD_SCREEN.eventName());
    let actionId = this.props.navigation.getParam('actionId')
    const actionCondition = (actionId && actionId=='claimCashBack');
    this.props.onGetWidgets(true, true, 'ScratchCardList' ,userId,
    callback = () => {
      if(actionCondition){
        setTimeout(() => {
          this.props.onGetRewards(false, false, true, false, null, null);
        }, 500);
      }
    });
    if(!actionCondition){
      this.props.onGetRewards(false, false, true, false, null, null);
    }
    LogFBEvent(Events.SCRATCH_CARD_PAGE_LOAD,{userId:userId});
  }

  onCardPress = (item) => {
    // show modal here
    this.setState({showModal:true})
    this.setState({scratchItem:item})
  }

  onScratchDone = ({ isScratchDone, id }) => {
    // Do something
    const {rewards,userPref,onAnalytics,scratchCards,onChangeField,scratchCardRewards,onChangeFieldRewards} = this.props;
    const {scratchItem} = this.state;

    const sid = (userPref && userPref.sid) ? userPref.sid : '';
    const userId = (userPref && userPref.uid) ? userPref.uid : '';

    let eventProps = {
      wuserId: scratchItem.wuserId,
      widgetId: scratchItem.widgetId
    }
    let userPrefData = {
      userId: userId,
      sid: sid,
    };

    onAnalytics('ShopGLive_ScratchCardComplete_OnSwipe',eventProps,userPrefData);
    this.setState({showModal:false})

    let tempAvailableCards = [...scratchCards];
    tempAvailableCards.splice(tempAvailableCards.indexOf(scratchItem),1);
  
    onChangeField('scratchCards', tempAvailableCards)

    let tempScratchCardRewards = {};
    Object.assign(tempScratchCardRewards, scratchCardRewards);
    let scratchAmount = (scratchItem && scratchItem.data && scratchItem.data.rewardAmount) ? scratchItem.data.rewardAmount : 0;
    scratchAmount = Math.round(scratchAmount);

    let totalAmount = Math.round((scratchCardRewards && scratchCardRewards.totalAmount) ? scratchCardRewards && scratchCardRewards.totalAmount : 0);
    tempScratchCardRewards['totalAmount'] = totalAmount + scratchAmount;
    tempScratchCardRewards['ScratchRewardDetails'] = scratchCardRewards && scratchCardRewards.ScratchRewardDetails && scratchCardRewards.ScratchRewardDetails.length ? [...scratchCardRewards.ScratchRewardDetails] : [];
    tempScratchCardRewards['ScratchRewardDetails'].push({
      paramDecimal1:scratchAmount,
      createdAt:moment().format('DD/MM/YYYY')
    });
    
    onChangeFieldRewards('scratchCardRewards', tempScratchCardRewards)

    let rewardbalance = (rewards && rewards.totalBalance && rewards.totalBalance.rewardsBalance) ? rewards.totalBalance.rewardsBalance : 0;
    let tempRewards = {};
    Object.assign(tempRewards, rewards);
    tempRewards['totalBalance'] = {rewardsBalance:(rewardbalance + scratchAmount),coinsBalance:rewards.totalBalance.coinsBalance};

    onChangeFieldRewards('rewards', tempRewards)

    LogFBEvent(Events.SCRATCH_CARD_DONE,{
      wuserId:scratchItem.wuserId,
      widgetId: scratchItem.widgetId,
      userId:userId,
      sid:sid
    });
  }

  cardRender = ({item, index}) => {
    const {t} = this.props;
    var expiry = moment(item.data.expiresAt);
    return (
        <TouchableOpacity onPress={()=>this.onCardPress(item)} style={styles.scratchCardBoxConainer}>
          <ImageBackground
            source={Images.purple_color_card} style={styles.scratchCardBox}>
            <View style={{flex:1}}/>
            <View style={{flex:1}}>
              <View style={{backgroundColor:'white'}}>
                <AppText bold black size="XS" style={{textAlign: 'center'}}>
                  {t('Scratch Card for #REWARDS#',{REWARDS:(item && item.data && item.data.scratchCardPurpose) ? item.data.scratchCardPurpose : 'rewards'})}
                </AppText>
                <AppText bold red size="XS" style={{textAlign: 'center'}}>
                  {t('Expires in #EXPIRY#',{EXPIRY:expiry.fromNow()})}
                </AppText>
              </View>
            </View>

          </ImageBackground>
        </TouchableOpacity>
    );
  };

  usedCardRender = ({item, index}) => {
    const {t} = this.props;
    let scratchText = (item && item.paramDecimal1) ? Math.round(item.paramDecimal1) : '0';
    let createdAt = moment(item.createdAt).format('DD/MM/YYYY');
    return (
        <View style={styles.scratchCardBoxConainer}>
          <View style={[styles.scratchCardBox,{backgroundColor:'white'}]}>
            <AppText black size="L" style={{textAlign:'center'}}>
              {t('#RS# #TEXT#',{TEXT:scratchText,RS:'\u20B9'})}
            </AppText>
            <AppText black size="S" style={{textAlign:'center'}}>
              {t('You got a cashback#NL#of #RS##TEXT#',{NL:'\n',TEXT:scratchText,RS:'\u20B9'})}
            </AppText>
            <AppText grey size="XXS" style={{textAlign:'center',marginTop:heightPercentageToDP(1)}}>
              {createdAt}
            </AppText>
          </View>
        </View>
    );
  };


  render() {
      const {t,scratchCards,fetchingData,scratchCardRewards,hideHeader} = this.props;
      const {showModal,scratchItem} = this.state;

      let scratchText = (scratchItem && scratchItem.data && scratchItem.data.rewardAmount) ? scratchItem.data.rewardAmount : '';

      let scratchCardsAmount = (scratchCardRewards && scratchCardRewards.totalAmount) ? scratchCardRewards.totalAmount : 0;
      scratchCardsAmount = Math.round(scratchCardsAmount);

      if(fetchingData){
        return (
          <View style={styles.activityIndicator}>
            <ActivityIndicator
              color="black"
              size="large"
            />
          </View>
        );
      }

      return (
        <ScrollView style={styles.container}>
          <View>
              {
                (hideHeader) ? null : <Header t={t} title={t('Scratch Card Details')} />
              }
              {
                (hideHeader) ? null
                :
                <View style={styles.numberContainer}>
                    <AppText white size="XXL">
                        {t('\u20B9 '+scratchCardsAmount)}
                    </AppText>
                    <AppText white size="XXL">
                        {t('Total Rewards')}
                    </AppText>
                </View>
              }

              {/* <AppText black size="XL" style={{marginVertical:heightPercentageToDP(1),paddingHorizontal:widthPercentageToDP(5)}}>
                  {t('Available Cards')}
              </AppText>
              <View style={styles.line}/> */}
              {
                (scratchCards && scratchCards.length)
                ?
                <View>
                  <FlatList
                      data={scratchCards ? scratchCards : []}
                      renderItem={this.cardRender}
                      //Setting the number of column
                      numColumns={2}
                      keyExtractor={(item, index) => index.toString()}
                      />
                </View>
                :
                <View style={styles.noView}>
                  <AppText black size="XL">
                    {t('No Available Cards')}
                  </AppText>
                </View>
              }


              {/* <View style={styles.line}/>  
              <AppText black size="XL" style={{marginVertical:heightPercentageToDP(1),paddingHorizontal:widthPercentageToDP(5)}}>
                  {t('Used Cards')}
              </AppText>
              <View style={styles.line}/> */}
              {
                (scratchCardRewards && scratchCardRewards.ScratchRewardDetails && scratchCardRewards.ScratchRewardDetails.length)
                ?
                <View>
                  <FlatList
                      data={(scratchCardRewards && scratchCardRewards.ScratchRewardDetails) ? scratchCardRewards.ScratchRewardDetails : []}
                      renderItem={this.usedCardRender}
                      //Setting the number of column
                      numColumns={2}
                      keyExtractor={(item, index) => index.toString()}
                      />
                </View>
                :
                <View style={styles.noView}>
                  <AppText black size="XL">
                    {t('No Used Cards')}
                  </AppText>
                </View>
              }



              <Modal
                onBackButtonPress={() => this.setState({showModal:false})}
                style={styles.modalContent}
                isVisible={showModal}>

                  <View>
                      <View style={styles.scratchCardBoxUpper}>
                        <AppText white bold size="M" style={{textAlign:'center'}}>
                          {t('YOU WON REWARD SCARTCH CARD!')}
                        </AppText>
                      </View>
                    <View style={[styles.scratchCardBoxConainer,{width:widthPercentageToDP(100)}]}>
                      {
                          (scratchText == 0)
                          ?
                          <AppText bold black size="L" style={{textAlign:'center'}}>
                            {t('Better Luck#NL#Next Time',{NL:'\n'})}
                          </AppText>
                          :
                          <View style={[styles.scratchCardBox,{backgroundColor:'white',height:heightPercentageToDP(18),width:widthPercentageToDP(50)}]}>
                            <View style={{flex:0.4,width:'100%',justifyContent:'center',alignItems:'center'}}>
                              <Image source={Images.reward_icon} style={styles.rewardImage}/>
                            </View>
                            <View style={{flex:0.6,width:'100%'}}>
                              <AppText black size="L" style={{textAlign:'center'}}>
                                {t('#RS# #TEXT#',{TEXT:scratchText,RS:'\u20B9'})}
                              </AppText>
                              <AppText black size="S" style={{textAlign:'center'}}>
                                {t('You got a cashback#NL#of #RS##TEXT#',{NL:'\n',TEXT:scratchText,RS:'\u20B9'})}
                              </AppText>
                              <AppText grey size="XXS" style={{textAlign:'center',marginTop:heightPercentageToDP(1)}}>
                                {moment().format('DD/MM/YYYY')}
                              </AppText>
                            </View>
                            
                          </View>
                        }

                      

                      <ScratchView
                          brushSize={60} // Default is 10% of the smallest dimension (width/height)
                          threshold={40} // Report full scratch after 70 percentage, change as you see fit. Default is 50
                          fadeOut={false} // Disable the fade out animation when scratch is done. Default is true
                          placeholderColor='#6B1A63'
                          //resourceName="swipe_card" // An image resource name (without the extension like '.png/jpg etc') in the native bundle of the app (drawble for Android, Images.xcassets in iOS) (Optional)
                          resizeMode="contain" // Resize the image to fit or fill the scratch view. Default is stretch
                          onScratchDone={this.onScratchDone} // Scratch is done event
                      />
                      </View>
                  </View>



              </Modal>
              {
                (hideHeader) ? <View style={styles.emptyView}/> : null
              }
          </View>
        </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Constants.screenbackground
  },
  rewardImage:{
    height:heightPercentageToDP(5),
    width:heightPercentageToDP(5)
  },
  numberContainer:{
     height:heightPercentageToDP(15),
     width:'100%',
     backgroundColor:Constants.meheroonText,
     justifyContent:'center',
     paddingHorizontal:widthPercentageToDP(5)
  },
  scratchCardBoxConainer:{
    height:widthPercentageToDP(40),
    width:widthPercentageToDP(50),
    justifyContent:'center',
    alignItems:'center'
  },
  scratchCardBox:{
    height:widthPercentageToDP(31),
    width:widthPercentageToDP(41),
    backgroundColor:Constants.screenbackground,
    borderRadius:widthPercentageToDP(2),
    paddingHorizontal:widthPercentageToDP(1),
    justifyContent:'center',
    alignItems:'center'
  },
  scratchCardBoxUpper:{
    height:widthPercentageToDP(20),
    width:widthPercentageToDP(100),
    justifyContent:'center',
    alignItems:'center',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#FFFFFF80'
  },
  line:{
    height:1,
    width:'100%',
    backgroundColor:Constants.black
  },
  noView:{
    height:heightPercentageToDP(20),
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  imageStyle: {
    height: heightPercentageToDP(5),
    width: heightPercentageToDP(5),
  },
  emptyView:{
    width:widthPercentageToDP(100),
    height:heightPercentageToDP(20)
  }
});

const mapStateToProps = state => ({
  userPref: state.login.userPreferences,
  scratchCards: state.ShopgLive.scratchCards,
  fetchingData:state.ShopgLive.fetchingData,
  scratchCardRewards: state.rewards.scratchCardRewards,
  rewards: state.rewards.rewards
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  onGetWidgets: (isPublic, isPrivate, page, userId,callback) => {
    dispatch(getWidgets(isPublic, isPrivate, page, userId,callback));
  },
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
  onGetRewards: (getCashback, getCoins, getScratchDetails ,history,page, size) => {
    dispatch(getRewards(getCashback, getCoins, getScratchDetails ,history,page, size));
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
  onChangeFieldRewards: (fieldName: string, value: any) => {
    dispatch(changeFieldRewards(fieldName, value))
  }
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ScratchCardList),
);