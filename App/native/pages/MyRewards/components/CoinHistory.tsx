import React, {PureComponent, Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import {Icon, Header} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
import {connect, Dispatch} from 'react-redux';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icons from 'react-native-vector-icons/FontAwesome';
import idx from 'idx';
import {getRewards} from '../actions';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import Button from '../../../../components/Button/Button';
import {Constants} from '../../../../styles';
import {AppText} from '../../../../components/Texts';
import {Images} from '../../../../../assets/images/index';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';

class CoinHistoryBase extends PureComponent {
  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleBottomAction = this.handleBottomAction.bind(this);
    this.handleCloseBottomSheet = this.handleCloseBottomSheet.bind(this);
    this.onEndReachedCalledDuringMomentum = false;
  }

  componentDidMount() {
    this.props.onGetRewards(false, true, false, true, 1, 20);
  }

  handleLoadMore = () => {
    const {rewards, rewardsApiLoading, coinsHistory} = this.props.rewards;
    if (!rewards || !coinsHistory) return null;
    let dataLength = coinsHistory.coinDetails ? coinsHistory.coinDetails.length : 0;
    if (!rewardsApiLoading && !this.onEndReachedCalledDuringMomentum && !(dataLength < 20)) {
      this.onEndReachedCalledDuringMomentum = true;
      let page = coinsHistory.currentPage + 1;
      this.props.onGetRewards(false, true, false, true, page, 20);
    }
  }

  handleBottomAction = () => {
    this.RBSheet && this.RBSheet.open();
  };

  handleCloseBottomSheet = () => {
    this.RBSheet && this.RBSheet.close();
  };

  render() {
    const {t} = this.props;
    const {rewards, groupSummary, coinsHistory} = this.props.rewards;
    if (!rewards || !coinsHistory || !(Object.keys(coinsHistory).length > 0)) return null;

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 0.4, backgroundColor: '#ffffff'}}>
          <View
            elevation={5}
            style={{
              backgroundColor: '#ff8648',
              flex: 1,
            }}>
            <View style={styles.rewardsCountView}>
              <View style={[styles.cardItem, {width: widthPercentageToDP(85)}]}>
                <View style={{flexDirection: 'row', top: '14%'}}>
                  <Image
                    source={Images.coin}
                    style={{right: '10%', height: 22, width: 22}}
                  />
                  <AppText secondaryColor size="L" style={styles.rewardValue}>
                    {coinsHistory && coinsHistory.data.totalBalance}
                  </AppText>
                </View>
                <AppText
                  secondaryColor
                  size="M"
                  style={{marginTop: scaledSize(40)}}>
                  {' '}
                  {t('Your balance')}
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 0.5,
                  backgroundColor: Constants.white,
                }}>
                <View style={[styles.cardItem, {borderBottomColor: '#FFFFFF'}]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: heightPercentageToDP(2),
                    }}>
                    <Image
                      source={Images.earnedIcon}
                      style={{
                        right: '11%',
                        top: heightPercentageToDP(1),
                        height: 18,
                        width: 18,
                      }}
                    />
                    <AppText
                      greenishBlue
                      size="M"
                      style={[styles.rewardValue, {top: '5%'}]}>
                      {coinsHistory && coinsHistory.data.totalEarnedCoins}
                    </AppText>
                  </View>
                  <AppText
                    style={[
                      styles.rewardText,
                      {color: Constants.primaryColor},
                    ]}>
                    {t('Coins earned')}
                  </AppText>
                </View>

                <View style={styles.cardItem}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: heightPercentageToDP(2),
                    }}>
                    <Image
                      source={Images.spentIcon}
                      style={{
                        right: '21%',
                        top: heightPercentageToDP(1),
                        height: 18,
                        width: 18,
                      }}
                    />
                    <AppText
                      red
                      size="M"
                      style={[styles.rewardValue, {top: '5%'}]}>
                      {coinsHistory && coinsHistory.data.totalSpentCoins}
                    </AppText>
                  </View>
                  <AppText style={[styles.rewardText, {color: Constants.red}]}>
                    {t('Coins spent')}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </View>
        <SafeAreaView style={[{flex: 0.6}]}>
          <ScrollView
            ref={node => (this.scroll = node)}
            scrollEnabled={true}
            style={styles.scrollViewStyle}
            showsHorizontalScrollIndicator={false}>
            {coinsHistory.coinDetails.length == 0 ? (
              <AppText style={styles.rewardFooterText}>
                {t(
                  'You have not earned any rewards, Share offers to earn rewards'
                )}
              </AppText>
            ) : (
              <FlatList
                data={coinsHistory.coinDetails}
                renderItem={({item}) => {
                  //date = new Date(item.createdAt);
                  date = moment(item.createdAt).format('MMMM Do YYYY, h:mm a');
                  if (item.action == 'act_cl_pickup_cashback') {
                    return (
                      <View style={styles.viewBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginRight: '16%',
                          }}>
                          <AppText style={styles.rewardViewText}>
                            {t(
                              "Received, reward of ₹ #AMOUNT# for pickup from your friend's address",
                              {
                                AMOUNT: Math.abs(item.paramDecimal1),
                              }
                            )}
                          </AppText>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: '12%',
                            }}>
                            <Image
                              source={Images.earnedIcon}
                              style={{height: 18, width: 18}}
                            />
                            <AppText
                              style={[
                                styles.amountTextStyle,
                                {color: '#00a9a6'},
                              ]}>
                              {'  '}₹{Math.abs(item.paramDecimal1)}
                            </AppText>
                          </View>
                        </View>
                        <View style={styles.dateView}>
                          <AppText style={styles.dateText}>{date}</AppText>
                        </View>
                      </View>
                    );
                  } else if (item.action == 'act_manual_coin_credit') {
                    return (
                      <View style={styles.viewBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginRight: '16%',
                          }}>
                          <AppText style={styles.rewardViewText}>
                            {t(
                              'Coins of ₹ #AMOUNT# awarded by ShopG, keep shopping',
                              {
                                AMOUNT: Math.abs(item.paramDecimal1),
                              }
                            )}
                          </AppText>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: '12%',
                            }}>
                            <Image
                              source={Images.earnedIcon}
                              style={{height: 18, width: 18}}
                            />
                            <AppText
                              style={[
                                styles.amountTextStyle,
                                {color: '#00a9a6'},
                              ]}>
                              {'  '}₹{Math.abs(item.paramDecimal1)}
                            </AppText>
                          </View>
                        </View>
                        <View style={styles.dateView}>
                          <AppText style={styles.dateText}>{date}</AppText>
                        </View>
                      </View>
                    );
                  } else if (item.action == 'act_manual_coin_debit') {
                    return (
                      <View style={styles.viewBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginRight: '16%',
                          }}>
                          <AppText style={styles.rewardViewText}>
                            {t(
                              'Reward of ₹ #AMOUNT# debited by ShopG, keep shopping',
                              {
                                AMOUNT: Math.abs(item.paramDecimal1),
                              }
                            )}
                          </AppText>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: '12%',
                            }}>
                            <Image
                              source={Images.spentIcon}
                              style={{height: 18, width: 18}}
                            />
                            <AppText
                              style={[
                                styles.amountTextStyle,
                                {color: '#00a9a6'},
                              ]}>
                              {'  '}₹{Math.abs(item.paramDecimal1)}
                            </AppText>
                          </View>
                        </View>
                        <View style={styles.dateView}>
                          <AppText style={styles.dateText}>{date}</AppText>
                        </View>
                      </View>
                    );
                  } else if (item.action == 'act_manual_coin_cl_credit') {
                    return (
                      <View style={styles.viewBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginRight: '16%',
                          }}>
                          <AppText style={styles.rewardViewText}>
                            {t(
                              'Coin of ₹ #AMOUNT# awarded by ShopG, keep shopping',
                              {
                                AMOUNT: Math.abs(item.paramDecimal1),
                              }
                            )}
                          </AppText>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: '12%',
                            }}>
                            <Image
                              source={Images.earnedIcon}
                              style={{height: 18, width: 18}}
                            />
                            <AppText
                              style={[
                                styles.amountTextStyle,
                                {color: '#00a9a6'},
                              ]}>
                              {'  '}₹{Math.abs(item.paramDecimal1)}
                            </AppText>
                          </View>
                        </View>
                        <View style={styles.dateView}>
                          <AppText style={styles.dateText}>{date}</AppText>
                        </View>
                      </View>
                    );
                  } else if (item.action == 'act_manual_coin_cl_debit') {
                    return (
                      <View style={styles.viewBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginRight: '16%',
                          }}>
                          <AppText style={styles.rewardViewText}>
                            {t(
                              'Coin of ₹ #AMOUNT# debited by ShopG, keep shopping',
                              {
                                AMOUNT: Math.abs(item.paramDecimal1),
                              }
                            )}
                          </AppText>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: '12%',
                            }}>
                            <Image
                              source={Images.spentIcon}
                              style={{height: 18, width: 18}}
                            />
                            <AppText
                              style={[
                                styles.amountTextStyle,
                                {color: '#00a9a6'},
                              ]}>
                              {'  '}₹{Math.abs(item.paramDecimal1)}
                            </AppText>
                          </View>
                        </View>
                        <View style={styles.dateView}>
                          <AppText style={styles.dateText}>{date}</AppText>
                        </View>
                      </View>
                    );
                  } else if (item.action == 'act_order_coin_redeemed') {
                    return (
                      <View style={styles.viewBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <AppText style={styles.rewardViewText}>
                            {t('Used in purchase')}
                          </AppText>
                          <View style={{flexDirection: 'row', margin: '2%'}}>
                            <Image
                              source={Images.spentIcon}
                              style={{height: 17, width: 17, right: '12%'}}
                            />
                            <AppText red style={styles.amountTextStyle}>
                              {' '}
                              {Math.abs(item.totalCoins)}
                            </AppText>
                          </View>
                        </View>
                        <View style={styles.dateView}>
                          <AppText style={styles.dateText}>{date}</AppText>
                        </View>
                      </View>
                    );
                  } else if (item.action === 'coins_task_completion_credit') {
                  
                    return (
                      <View style={styles.viewBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginRight: widthPercentageToDP(16),
                          }}>
                          <AppText style={styles.rewardViewText}>
                            {t(
                              'Received, coins of value #AMOUNT# for #PURPOSE#',
                              {
                                AMOUNT: Math.abs(item.totalCoins),
                                PURPOSE: item.purpose
                              }
                            )}
                          </AppText>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: '6%',
                            }}>
                            <Image
                              source={Images.earnedIcon}
                              style={{height: 18, width: 18}}
                            />
                            <AppText
                              style={[
                                styles.amountTextStyle,
                                {color: '#00a9a6'},
                              ]}>
                              {'  '}{Math.abs(item.totalCoins)}
                            </AppText>
                          </View>
                        </View>
                        <View style={[styles.dateView, {paddingTop: 12}]}>
                          <AppText style={styles.dateText}>{date}</AppText>
                        </View>
                      </View>
                    );
                  } else if (item.action === 'act_redeemed_cancel') {
                    return (
                      <View style={styles.viewBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginRight: widthPercentageToDP(16),
                          }}>
                          <AppText style={styles.rewardViewText}>
                            {t(
                              'Rewards of ₹ #AMOUNT# returned back due to cancelled Order #ORDER#',
                              {
                                AMOUNT: Math.abs(item.paramDecimal1),
                                ORDER: item.refId2,
                              }
                            )}
                          </AppText>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: '6%',
                            }}>
                            <Image
                              source={Images.earnedIcon}
                              style={{height: 18, width: 18}}
                            />
                            <AppText
                              style={[
                                styles.amountTextStyle,
                                {color: '#00a9a6'},
                              ]}>
                              {'  '}₹{Math.abs(item.paramDecimal1)}
                            </AppText>
                          </View>
                        </View>
                        <View style={[styles.dateView, {paddingTop: 12}]}>
                          <AppText style={styles.dateText}>{date}</AppText>
                        </View>
                      </View>
                    );
                  }
                }}
                keyExtractor={item => item.id}
              />
            )}
          </ScrollView>
        </SafeAreaView>

        <TouchableOpacity
          onPress={this.handleBottomAction}
          style={{flex: 0.08}}>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: scaledSize(22),
              marginTop: scaledSize(16),
              justifyContent: 'space-between',
            }}>
            <AppText size="M" bold secondaryColor>
              {t('How to earn & use?')}
            </AppText>
            <Icon
              name={'chevron-up'}
              type={'feather'}
              color={Constants.secondaryColor}
              containerStyle={styles.upIconStyle}
            />
          </View>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Constants.primaryColor,
  },
  container: {
    flex: 2,
    paddingTop: heightPercentageToDP(3),
    paddingHorizontal: widthPercentageToDP(3),
  },
  center: {
    width: '100%',
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    flex: 0.2,
  },
  title: {
    // fontWeight: "bold",
    // fontSize: 20
  },
  inputStyle: {
    borderBottomWidth: 2,
    borderBottomColor: Constants.primaryColor,
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 16,
    lineHeight: 23,
  },
  actionBtn: {
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  topView: {
    marginTop: widthPercentageToDP(5),
    backgroundColor: '#ffffff',
  },
  scrollViewStyle: {
    height: scaledSize(315),
    paddingLeft: '5%',
    borderWidth: 0.3,
    borderColor: '#d6d7da',
  },
  upIconStyle: {
    color: Constants.secondaryColor,
    fontSize: 25,
    top: '-1%',
    right: '75%',
  },
  rewardsCountView: {
    bottom: heightPercentageToDP(8),
    backgroundColor: Constants.white,
    width: widthPercentageToDP(85),
    margin: '7%',
    marginBottom: '20%',
    height: '100%',
    borderWidth: 0.3,
    borderColor: '#d6d7da',
    borderBottomColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageStyle: {
    top: '3%',
    height: 47,
    width: 47,
  },
  earnAndUseView: {
    fontSize: 20,
    justifyContent: 'flex-start',
    margin: '5%',
    top: '3%',
  },
  earnUseTextView: {
    flexDirection: 'column',
    paddingRight: '8%',
    margin: '3%',
  },
  iconicImagesView: {
    flexDirection: 'row',
    margin: '2%',
    justifyContent: 'space-between',
    paddingRight: '8%',
  },
  buttonImage: {
    height: scaledSize(25),
    width: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
  rbSheetView: {
    height: 40,
    width: '85%',
    left: '7%',
    top: '7%',
  },
  amountTextStyle: {
    fontSize: 13,
  },
  dateView: {
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 12,
    bottom: '2%',
    color: '#78787a',
  },
  buttonView: {
    margin: heightPercentageToDP(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    flexDirection: 'row',
    backgroundColor: Constants.green,
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(85),
    height: heightPercentageToDP(9),
    borderRadius: 6,
  },
  shareEarnButtonView: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: widthPercentageToDP(2),
    borderRadius: scaledSize(8),
    borderColor: '#FFCA9E',
    borderWidth: scaledSize(2),
    padding: scaledSize(3),
    flexDirection: 'row',
  },
  closeIconStyle: {
    fontSize: 20,
    left: '45%',
    right: 0,
    top: '-8%',
    width: '66%',
    bottom: 0,
  },
  viewBox: {
    position: 'relative',
    paddingTop: '0.5%',
    paddingBottom: '3%',
    marginRight: '6%',
    borderBottomWidth: 0.3,
    borderColor: '#d6d7da',
    margin: '2%',
    flexDirection: 'column',
    alignContent: 'center',
  },
  viewAppTextStyle: {
    flex: 0.8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: '5%',
    paddingRight: '3%',
    paddingBottom: '8%',
  },
  iconStyle: {
    color: '#FF6900',
    fontSize: widthPercentageToDP(5),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  rewardText: {
    top: '10%',
    fontSize: 15,
  },
  rewardViewText: {
    top: '1.5%',
    fontSize: 15,
    paddingRight: '5%',
  },
  rewardValue: {
    left: '4%',
    color: Constants.black,
  },
  cardItem: {
    width: widthPercentageToDP(42.5),
    height: scaledSize(110),
    backgroundColor: Constants.white,
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 0.4,
    borderColor: '#d6d7da',
  },
  rewardsTermsNConditions: {
    left: '76%',
  },
  center: {
    width: '100%',
    alignItems: 'center',
  },
  rewardFooterText: {
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  },
});

const mapStateToProps = state => ({
  rewards: state.rewards,
  groupSummary: state.groupSummary,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
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
});

const CoinHistory = withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(CoinHistoryBase)
);

export default CoinHistory;
