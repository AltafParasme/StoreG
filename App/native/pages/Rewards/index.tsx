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
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  //Share,
} from 'react-native';
import idx from 'idx';
import {liveAnalytics} from '../ShopgLive/redux/actions';
import Button from '../../../components/Button/Button';
import Share from 'react-native-share';
import {withTranslation} from 'react-i18next';
import {connect, Dispatch} from 'react-redux';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Constants} from '../../../styles';
import {Images} from '../../../../assets/images';
import {Icon} from 'react-native-elements';
import {Header} from '../../../components/Header/Header';
import Icons from 'react-native-vector-icons/FontAwesome';
import {AppText} from '../../../components/Texts';
import {getRewards} from '../UserProfile/actions';
import CLFlowBanner from '../PastOrders/Component/CLFlowBanner';
import NavigationService from '../../../utils/NavigationService';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../utils';
import LinearGradientButton from '../../../components/Button/LinearGradientButton';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import {getGroupSummary} from '../OrderConfirmation/actions';
import {shareToWhatsApp} from '../utils';

const component = 'RewardsWhatsappInvite';

class RewardsBase extends Component {
  constructor(private router: Router) {
    super();
    this.state = {isRewardTermsNConditions: false};
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    NavigationService.goBack(null);
    return true;
  }

  componentDidMount() {
    this.props.onGetRewards();
    SetScreenName(Events.LOAD_REWARDS_SCREEN.eventName());
    LogFBEvent(Events.LOAD_REWARDS_SCREEN, null);
  }

  componentDidUpdate() {
    console.log('rewards profile props are ', this.props.userProfile);
  }

  toggleModal = () => {
    //console.log(this.state)
    this.setState({
      isRewardTermsNConditions: !this.state.isRewardTermsNConditions,
    });
  };

  navigateTo() {
    NavigationService.navigate('Home');
  }

  handleBottomAction = () => {
    this.RBSheet && this.RBSheet.open();
  };

  handleCloseBottomSheet = () => {
    this.RBSheet && this.RBSheet.close();
  };

  render() {
    if (!this.props.userProfile.initialRewardsApiCallCompleted) return null;
    const {t, groupSummary} = this.props;
    const bucketLimitEnd = idx(
      groupSummary,
      _ => _.groupDetails.info.bucketLimitEnd,
    );
    const {rewards} = this.props.userProfile;
    let eventProps = {
      page: this.props.navigation.state.routeName,
      component: component,
      sharedBy: this.props.userPref && this.props.userPref.userMode,
    };
    let dataUser = {
      userId: this.props.userPref && this.props.userPref.uid,
      sid: this.props.userPref && this.props.userPref.sid,
    };
    const language = this.props.i18n.language;
    const userPreference = this.props.login.userPreference;
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    const refBonus = rewards.rewardsInfo.refferalBonus;
    const mallInfo = idx(this.props.login, _ => _.clDetails.mallInfo);
    const mallType = mallInfo && mallInfo.type;

    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {/* <View style={{ flex: 0.1 }}>
        <Header
            t={t}
            title={t('Rewards')}
          />
        </View>   */}
        <View style={{flex: 0.65, backgroundColor: '#ffffff'}}>
          <View style={styles.topView}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={Images.rewardsBanner}
                style={{
                  height: heightPercentageToDP(15),
                  width: widthPercentageToDP(85),
                  borderRadius: 6,
                }}
              />
            </View>
            <View style={styles.buttonView}>
              <Button
                color={Constants.green}
                styleContainer={styles.buttonStyle}
                onPress={() => {
                  shareToWhatsApp(
                    eventProps,
                    t,
                    rewards,
                    language,
                    groupSummary,
                    userPreference,
                    (fragment = 'Rewards'),
                  )
                  this.props.onAnalytics(
                    Events.SHARE_WHATSAPP_CLICK,
                    eventProps,
                    dataUser);
                }
                }>
                <Image source={Images.whatsapp} style={styles.buttonImage} />
                <AppText white size="M">
                  {t('Invite friends and get cashback')}
                </AppText>
              </Button>
            </View>
            <AppText size={'L'} bold black style={{textAlign: 'center'}}>
              {t('Rewards')}
            </AppText>
          </View>

          <View
            elevation={5}
            style={{
              backgroundColor: '#ff8648',
              flex: 1,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}>
            <View style={styles.rewardsCountView}>
              <View style={[styles.cardItem, {width: widthPercentageToDP(85)}]}>
                <View style={{flexDirection: 'row', top: '10%'}}>
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
                    {rewards && rewards.bal}
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
                      color={Constants.primaryColor}
                      style={{top: '6%'}}
                    />
                    <AppText
                      greenishBlue
                      size="M"
                      style={[styles.rewardValue, {top: '5%'}]}>
                      {rewards && rewards.earned}
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
                      {rewards && rewards.spent}
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

        <View
          style={[
            {
              marginLeft: scaledSize(25),
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0.07,
              paddingTop: heightPercentageToDP(2),
            },
          ]}>
          <AppText size="M" bold black>
            {t('Rewards History')}
          </AppText>
        </View>

        <SafeAreaView style={[{flex: 0.25}]}>
          <ScrollView
            ref={node => (this.scroll = node)}
            scrollEnabled={true}
            style={styles.scrollViewStyle}
            showsHorizontalScrollIndicator={false}>
            {!rewards || rewards.activity.length == 0 ? (
              <AppText style={styles.rewardFooterText}>
                {t(
                  'You have not earned any rewards, Share offers to earn rewards',
                )}
              </AppText>
            ) : (
              <FlatList
                data={rewards.activity}
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
                              },
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
                              },
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
                              },
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
                              },
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
                              },
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
                              },
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
                              },
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
                                  'Rewards of ₹#AMOUNT# given on your last Order #ORDER#, Your society crossed ₹#TARGETVALUE# in orders. Buy, Share & Save',
                                )
                              : t(
                                  'Rewards of ₹#AMOUNT# given on your last Order #ORDER#, because of your order through ShopG CL. Buy, Share & Save',
                                  {
                                    AMOUNT: Math.abs(item.paramDecimal1),
                                    ORDER: item.refId2,
                                    TARGETVALUE: bucketLimitEnd,
                                  },
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
                              },
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
                              },
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
                    },
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
                  'You can apply your rewards earned in the next purchase you make on Glowfit',
                )}
              </AppText>
            </View>
          </View>
          <View style={styles.iconicImagesView}>
            <Image source={Images.shareEarnProduct} style={styles.imageStyle} />
            <View style={styles.earnUseTextView}>
              <AppText style={{color: Constants.grey, left: '1%'}}>
                {t(
                  'If your referred friend cancels the order, your rewards will also be rolled back.',
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
    //flex: 0.08,
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
    //marginRight: 10,
  },
  // header: {
  //   backgroundColor: Constants.primaryColor
  // },
  // iconStyle: {
  //   color: Constants.white,
  // },
  // imageContent: {
  //   width: 85,
  //   height: 70,
  //   resizeMode: 'contain',
  // },
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

const mapStateToProps = (state: any) => ({
  userProfile: state.userProfile,
  groupSummary: state.groupSummary,
  login: state.login,
  userPref: state.login.userPreferences,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  onGetRewards: () => {
    dispatch(getRewards());
  },
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  }
  // other callbacks go here...
});

const Rewards = connect(mapStateToProps, mapDipatchToProps)(RewardsBase);

export default withTranslation()(Rewards);
