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
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {getRewards} from '../actions';
import Button from '../../../../components/Button/Button';
import {Constants} from '../../../../styles';
import {AppText} from '../../../../components/Texts';
import {Images} from '../../../../../assets/images/index';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';

class CashbackHistoryBase extends PureComponent {
  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleBottomAction = this.handleBottomAction.bind(this);
    this.handleCloseBottomSheet = this.handleCloseBottomSheet.bind(this);
    this.onEndReachedCalledDuringMomentum = false;
  }
  componentDidMount() {
    this.props.onGetRewards(true, false, false, true, 1, 20);
  }

  handleBottomAction = () => {
    this.RBSheet && this.RBSheet.open();
  };

  handleCloseBottomSheet = () => {
    this.RBSheet && this.RBSheet.close();
  };

  handleLoadMore = () => {
    const {rewards, rewardsApiLoading, cashbackHistory} = this.props.rewards;
    if (!rewards || !cashbackHistory) return null;
    let dataLength = cashbackHistory.rewardsDetails ? cashbackHistory.rewardsDetails.length : 0;
    if (!rewardsApiLoading && !this.onEndReachedCalledDuringMomentum && !(dataLength < 20)) {
      this.onEndReachedCalledDuringMomentum = true;
      let page = cashbackHistory.currentPage + 1;
      this.props.onGetRewards(true, false, false, true, page, 20);
    }
  }

  render() {
    const {t, groupSummary} = this.props;
    const {rewards, cashbackHistory} = this.props.rewards;
    if (!rewards || !cashbackHistory || !(Object.keys(cashbackHistory).length > 0)) return null;

    const mallInfo = idx(this.props.login, _ => _.clDetails.mallInfo);
    const mallType = mallInfo && mallInfo.type;
    const bucketLimitEnd = idx(
      groupSummary,
      _ => _.groupDetails.info.bucketLimitEnd
    );
    const refBonus = rewards.rewardsInfo.refferalBonus;
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 0.4, backgroundColor: '#ffffff'}}>
          <View
            elevation={5}
            style={{
              backgroundColor: '#ff8648',
              flex: 1,
              // shadowColor: '#000',
              // shadowOffset: {
              //   width: 0,
              //   height: 2,
              // },
              // shadowOpacity: 0.25,
              // shadowRadius: 3.84,
            }}>
            <View style={styles.rewardsCountView}>
              <View style={[styles.cardItem, {width: widthPercentageToDP(85)}]}>
                <View style={{flexDirection: 'row', top: '14%'}}>
                  <Image
                    source={Images.starIcon}
                    style={{right: '10%', height: 22, width: 22}}
                  />
                  <AppText secondaryColor size="L" style={styles.rewardValue}>
                    <Icons
                      name={'rupee'}
                      size={18}
                      color={Constants.secondaryColor}
                      style={{top: '6%'}}
                    />
                    {cashbackHistory && cashbackHistory.data.totalBalance}
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
                    <Icons
                      name={'rupee'}
                      size={17}
                      color={Constants.greenishBlue}
                      style={{top: '6%'}}
                    />
                    <AppText
                      greenishBlue
                      size="M"
                      style={[styles.rewardValue, {top: '5%'}]}>
                      {cashbackHistory && cashbackHistory.data.totalEarnedRewards}
                    </AppText>
                  </View>
                  <AppText
                    style={[
                      styles.rewardText,
                      {color: Constants.primaryColor},
                    ]}>
                    {t('Rewards earned')}
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
                    <Icons
                      name={'rupee'}
                      size={17}
                      color={Constants.red}
                      style={{top: '6%'}}
                    />
                    <AppText
                      red
                      size="M"
                      style={[styles.rewardValue, {top: '5%'}]}>
                      {cashbackHistory && cashbackHistory.data.totalSpentRewards}
                    </AppText>
                  </View>
                  <AppText style={[styles.rewardText, {color: Constants.red}]}>
                    {t('Rewards spent')}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </View>
        <SafeAreaView style={[{flex: 0.52}]}>
          <ScrollView
            ref={node => (this.scroll = node)}
            scrollEnabled={true}
            style={styles.scrollViewStyle}
            showsHorizontalScrollIndicator={false}>
            {cashbackHistory.rewardsDetails.length == 0 ? (
              <AppText style={styles.rewardFooterText}>
                {t(
                  'You have not earned any rewards, Share offers to earn rewards'
                )}
              </AppText>
            ) : (
              <FlatList
                data={cashbackHistory.rewardsDetails}
                renderItem={({item}) => {
                  //date = new Date(item.createdAt);
                  date = moment(item.createdAt).format('MMMM Do YYYY, h:mm a');


                  // act_online_payment_discount_used
                  // act_online_payment_discount
                  if (item.action == 'act_online_payment_discount_used') {
                    return (
                      <View style={styles.viewBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <AppText style={styles.rewardViewText}>
                            {t(
                              "Online payment reward of ₹ #AMOUNT# used",
                              {
                                AMOUNT: Math.abs(item.paramDecimal1),
                              }
                            )}
                          </AppText>
                          <View style={{flexDirection: 'row', margin: '2%'}}>
                            <Image
                              source={Images.spentIcon}
                              style={{height: 17, width: 17, right: '12%'}}
                            />
                            <AppText red style={styles.amountTextStyle}>
                              {' '}
                              ₹{Math.abs(item.paramDecimal1)}
                            </AppText>
                          </View>
                        </View>
                        <View style={styles.dateView}>
                          <AppText style={styles.dateText}>{date}</AppText>
                        </View>
                      </View>
                    );
                  } else if (item.action == 'act_online_payment_discount') {
                      return (
                        <View style={styles.viewBox}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <AppText style={styles.rewardViewText}>
                              {t(
                                "Online payment reward of ₹ #AMOUNT# added",
                                {
                                  AMOUNT: Math.abs(item.paramDecimal1),
                                }
                              )}
                            </AppText>
                            <View style={{flexDirection: 'row', margin: '2%'}}>
                              <Image
                                source={Images.earnedIcon}
                                style={{height: 17, width: 17, right: '12%'}}
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
                    }
                  else if (item.action == 'act_cl_pickup_cashback') {
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
                  } else if (item.action == 'act_manual_reward_credit') {
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
                              'Reward of ₹ #AMOUNT# awarded by ShopG, keep shopping',
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
                  } else if (item.action == 'act_manual_reward_debit') {
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
                  } else if (item.action == 'act_manual_reward_cl_credit') {
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
                              'Reward of ₹ #AMOUNT# awarded by ShopG, keep shopping',
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
                  } else if (item.action == 'act_manual_reward_cl_debit') {
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
                  } else if (item.action == 'act_redeemed') {
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
                              ₹{Math.abs(item.paramDecimal1)}
                            </AppText>
                          </View>
                        </View>
                        <View style={styles.dateView}>
                          <AppText style={styles.dateText}>{date}</AppText>
                        </View>
                      </View>
                    );
                  } else if (item.action === 'act_reward') {
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
                              'Received, reward of ₹ #AMOUNT# for inviting #USER#',
                              {
                                AMOUNT: Math.abs(item.paramDecimal1),
                                USER: item.joinedUser && item.joinedUser.name,
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
                  } else if (item.action === 'act_join_bonus') {
                    return (
                      <View style={styles.viewBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <AppText style={styles.rewardViewText}>
                            {t('Signup Reward earned')}
                          </AppText>
                          <View style={{flexDirection: 'row', margin: '2%'}}>
                            <Image
                              source={Images.earnedIcon}
                              style={{height: 18, width: 18, right: '22%'}}
                            />
                            <AppText
                              style={[
                                styles.amountTextStyle,
                                {color: '#00a9a6'},
                              ]}>
                              ₹{Math.abs(item.paramDecimal1)}
                            </AppText>
                          </View>
                        </View>
                        <View style={styles.dateView}>
                          <AppText style={styles.dateText}>{date}</AppText>
                        </View>
                      </View>
                    );
                  } else if (
                    item.action === 'mart_group_target_cashback_reward'
                  ) {
                    return (
                      <View style={styles.viewBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginRight: widthPercentageToDP(16),
                          }}>
                          <AppText style={styles.rewardViewText}>
                            {mallType == 'MART'
                              ? t(
                                  'Rewards of ₹#AMOUNT# given on your last Order #ORDER#, Your society crossed ₹#TARGETVALUE# in orders. Buy, Share & Save'
                                )
                              : t(
                                  'Rewards of ₹#AMOUNT# given on your last Order #ORDER#, because of your order through ShopG CL. Buy, Share & Save',
                                  {
                                    AMOUNT: Math.abs(item.paramDecimal1),
                                    ORDER: item.refId2,
                                    TARGETVALUE: bucketLimitEnd,
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
                  } else if (item.action === 'act_join_bonus_cancel') {
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
                              'Rewards of ₹ #AMOUNT# returned back due to cancelled Order #ORDER# by your friend',
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
                  } else if (item.action === 'act_scratch_card_credit') {
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
                              'Rewards of ₹ #AMOUNT# credited for scratch card',
                              {
                                AMOUNT: Math.abs(item.paramDecimal1),
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
                  else if (item.action === 'act_targetreached_cashback_reward') {
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
                              'Rewards of ₹ #AMOUNT# credited for reaching monthly target',
                              {
                                AMOUNT: Math.abs(item.paramDecimal1),
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
                onMomentumScrollBegin = {() => {this.onEndReachedCalledDuringMomentum = false;}}
                onEndReachedThreshold={0.2}
                onEndReached={this.handleLoadMore}
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

        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={scaledSize(530)}
          duration={80}
          closeOnDragDown={true}
          customStyles={{
            container: {
              borderRadius: 10,
            },
          }}>
          <AppText size={'L'} bold style={styles.earnAndUseView}>
            {t('How to earn?')}
          </AppText>
          <View style={{flex: 0.6, flexDirection: 'column'}}>
            <View style={styles.iconicImagesView}>
              <Image source={Images.referAndEarn} style={styles.imageStyle} />
              <View style={styles.earnUseTextView}>
                <AppText size={'M'} bold>
                  {t('Refer & Earn')}
                </AppText>
                <AppText style={{color: Constants.grey}}>
                  {t(
                    'First refer a friend & if your friend purchases a product, you get ₹ #refBonus# once the product is delivered.',
                    {
                      refBonus: refBonus,
                    }
                  )}
                </AppText>
              </View>
            </View>
          </View>

          <AppText size={'L'} bold style={styles.earnAndUseView}>
            {t('How to use?')}
          </AppText>
          <View style={styles.iconicImagesView}>
            <Image source={Images.cashbackActive} style={styles.imageStyle} />
            <View style={styles.earnUseTextView}>
              <AppText size={'M'} bold style={{left: '1%'}}>
                {t('Rewards active in next purchases')}
              </AppText>
              <AppText style={{color: Constants.grey, left: '1%'}}>
                {t(
                  'You can apply your rewards earned in the next purchase you make on Glowfit'
                )}
              </AppText>
            </View>
          </View>
          <View style={styles.iconicImagesView}>
            <Image source={Images.shareEarnProduct} style={styles.imageStyle} />
            <View style={styles.earnUseTextView}>
              <AppText style={{color: Constants.grey, left: '1%'}}>
                {t(
                  'If your referred friend cancels the order, your rewards will also be rolled back.'
                )}
              </AppText>
            </View>
          </View>
          <View style={styles.rbSheetView}>
            <LinearGradientButton
              btnStyles={styles.actionBtn}
              colors={['#ff8648', '#dc4d04']}
              title={t('OK, GOT IT')}
              onPress={this.handleCloseBottomSheet}
            />
          </View>
          <View style={styles.footer}>
            <AppText bold style={{textAlign: 'center'}}>
              © REYBHAV TECHNOLOGIES PRIVATE LIMITED.
            </AppText>
          </View>
        </RBSheet>
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
    backgroundColor: '#ffffff',
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

const CashbackHistory = withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(CashbackHistoryBase)
);

export default CashbackHistory;
