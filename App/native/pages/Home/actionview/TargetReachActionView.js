import React, {Component} from 'react';
import {View, StyleSheet, FlatList, Image} from 'react-native';
import Share from 'react-native-share';
import {Colors} from '../../../../../assets/global';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../components/Texts';
import Button from '../../../../components/Button/Button';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import idx from 'idx';
import {benefitsArr} from '../../../../Constants';
import {LogFBEvent, Events} from '../../../../Events';
import {
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
} from '../../../../utils';
import {processTextAndAppendElipsis} from '../../../../utils/misc';
import {Images} from '../../../../../assets/images';

class TargetReachActionView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    LogFBEvent(Events.LOAD_HOME_SHOPG_SOCIETY_BOTTOM_SHEET, null);
  }

  activityContent = (valueItem, index) => {
    let date = moment(valueItem.timeStamp).format('DD MMMM, hh:mm A');
    let name = valueItem.name;
    let initial =
      name &&
      name
        .split(' ')
        .map(function(s) {
          return s.charAt(0);
        })
        .join('');
    let colors = ['#123456', '#654321', '#8B008B', '#abcdef'];
    let distance = valueItem.roadDistance
      ? valueItem.roadDistance
      : valueItem.airDistance
      ? valueItem.airDistance
      : null;
    return (
      <View style={styles.feedContainer}>
        <View
          style={[
            styles.circleUserView,
            {backgroundColor: colors[index % colors.length]},
          ]}>
          <AppText white style={{paddingLeft: widthPercentageToDP(4)}}>
            {initial}
          </AppText>
        </View>

        <View style={styles.flatListTextInfoView}>
          <AppText
            size="S"
            bold
            style={{paddingRight: widthPercentageToDP(27)}}>
            {processTextAndAppendElipsis(valueItem.text, 20)}
            <AppText size="S">
              {distance ? ` (${distance}m away)` : null}
            </AppText>
          </AppText>
          {valueItem.timeStamp ? <AppText size="XS">{date}</AppText> : null}
        </View>
      </View>
    );
  };

  benefits = (item, index) => {
    const {t} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          marginVertical: heightPercentageToDP(1),
          width: widthPercentageToDP(90),
        }}>
        <View style={[styles.circleView]}>
          <Icon
            name="done"
            type="material"
            color={Colors.white}
            size={17}
            containerStyle={{top: heightPercentageToDP(0.55)}}
          />
        </View>
        <AppText
          bold
          style={{color: Colors.blue, paddingTop: heightPercentageToDP(0.7)}}>
          {t(item)}
        </AppText>
      </View>
    );
  };

  render() {
    const {
      t,
      rewards,
      userPrefDelivery,
      mallInfoType,
      mallInfo,
      mallAddress,
      participatedUser,
    } = this.props;
    const {groupDetails} = this.props.groupSummary;
    const groupUserDetails = (groupDetails && groupDetails.summary) || [];
    let userInfo = idx(groupDetails, _ => _.groupUserDetails.userInfo);
    const purchaseInfo = groupUserDetails.map(data => {
      const purchaseMssg = t(
        `#NAME# purchased for ₹#TOTALAMOUNT# and saved ₹#CASHBACK#`,
        {
          NAME: data.userName,
          TOTALAMOUNT: data.actualAmount,
          CASHBACK: data.saving,
        }
      );
      return {text: purchaseMssg, name: data.userName};
    });
    const joiningInfo = userInfo.map(data => {
      const joinMssg = t(`#NAME# joined`, {NAME: data.name});
      return {
        text: joinMssg,
        name: data.name,
        timeStamp: data.createdAt,
        roadDistance: data.roadDistance,
        airDistance: data.airDistance,
      };
    });
    const groupFeedArr = joiningInfo.concat(purchaseInfo);

    return (
      <View style={styles.topContainer}>
        <View style={[styles.firstSubSection, {flex: 0.1}]}>
          <View style={{alignItems: 'flex-end'}}>
            <AppText
              size="M"
              bold
              white
              style={{
                height: heightPercentageToDP(3),
                marginLeft: widthPercentageToDP(3),
              }}>
              {t(`#MALLINFO#\'s`, {MALLINFO: mallInfo.toUpperCase()})}
            </AppText>
            <Image style={styles.mallImageContent} source={Images.shopGMart} />
          </View>
        </View>
        <View style={styles.secondView}>
          <View
            style={{position: 'absolute', bottom: heightPercentageToDP(70)}}>
            <Image style={styles.mallImageLogo} source={Images.clSheet} />
          </View>
          <View style={styles.secondSubSection}>
            <View style={styles.upperTextView}>
              <View style={{paddingHorizontal: widthPercentageToDP(4)}}>
                <AppText size="L" bold style={{lineHeight: 24}}>
                  {t(`Welcome to #MALLINFO#\'s Glowfit Mart.`, {
                    MALLINFO: mallInfo,
                  })}
                </AppText>
                <AppText
                  bold
                  style={{
                    lineHeight: 18,
                    paddingTop: heightPercentageToDP(0.8),
                  }}>
                  {t(
                    `#ADDRNAME# #NL##ADDR1##NL##ADDR2##CITY# #STATE# - #PINCODE#`,
                    {
                      ADDRNAME: (mallAddress && mallAddress.addressName) || '',
                      ADDR1: (mallAddress && mallAddress.addressLine1) || '',
                      ADDR2:
                        mallAddress && mallAddress.addressLine2
                          ? `${mallAddress.addressLine2}\n`
                          : null,
                      CITY: (mallAddress && mallAddress.city) || '',
                      STATE: (mallAddress && mallAddress.state) || '',
                      PINCODE: (mallAddress && mallAddress.pinCode) || '',
                      NL: '\n',
                    }
                  )}
                </AppText>
                <AppText
                  style={{
                    color: '#222222',
                    paddingTop: heightPercentageToDP(1.1),
                  }}>
                  {t('#OWNER# | ShopG Authorised Partner', {
                    OWNER: mallInfo ? mallInfo : null,
                  })}
                </AppText>
              </View>
              <View
                style={{
                  height: scaledSize(1),
                  marginTop: heightPercentageToDP(3.2),
                  width: widthPercentageToDP(100),
                  backgroundColor: '#e8e8e8',
                }}
              />
            </View>
            <View
              style={{
                marginBottom: heightPercentageToDP(1),
                paddingLeft: widthPercentageToDP(4),
              }}>
              <View
                style={{
                  marginTop: heightPercentageToDP(1),
                  paddingBottom: heightPercentageToDP(2),
                }}>
                <AppText size="M">{t('Your Benefits')}</AppText>
              </View>
              <FlatList
                data={benefitsArr}
                renderItem={value => this.benefits(value.item, value.index)}
                scrollEnabled={true}
              />
            </View>
            <View
              style={{
                paddingBottom: heightPercentageToDP(2),
                marginTop: heightPercentageToDP(1),
                paddingLeft: widthPercentageToDP(4),
              }}>
              <AppText size="M">{t('Members')}</AppText>
            </View>
            <View style={[styles.flatlistView]}>
              <FlatList
                data={groupFeedArr}
                renderItem={value =>
                  this.activityContent(value.item, value.index)
                }
                scrollEnabled={true}
              />
            </View>
          </View>
          <View style={styles.bottomView}>
            <Button
              onPress={() => this.props.closeAction('continue')}
              styleContainer={[styles.supportBtn]}>
              <AppText white bold size="M">
                {t('CONTINUE')}
              </AppText>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
  },
  rewardValue: {
    left: '4%',
    color: Colors.black,
  },
  upperTextView: {
    // borderBottomWidth: 1,
    // borderColor: '#e8e8e8',
    paddingBottom: heightPercentageToDP(2.3),
    paddingVertical: heightPercentageToDP(1.5),
  },
  supportBtn: {
    marginHorizontal: widthPercentageToDP(3),
    marginBottom: heightPercentageToDP(1),
    borderRadius: 5,
    elevation: 3,
    backgroundColor: Colors.blue,
    flex: 1,
    height: heightPercentageToDP(6.2),
    color: Colors.blue,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareAppTextStyle: {
    textAlign: 'center',
    paddingLeft: widthPercentageToDP(2),
  },
  circleView: {
    width: scaledSize(24),
    height: scaledSize(24),
    borderRadius: 24 / 2,
    marginRight: widthPercentageToDP(2.5),
    backgroundColor: Colors.blue,
  },
  flatlistView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: heightPercentageToDP(16),
    paddingBottom: heightPercentageToDP(3),
  },
  mallImageContent: {
    width: widthPercentageToDP(40),
    height: heightPercentageToDP(7),
    resizeMode: 'contain',
  },
  mallImageLogo: {
    width: widthPercentageToDP(18),
    height: heightPercentageToDP(9),
    left: widthPercentageToDP(4),
    resizeMode: 'contain',
  },
  imageStyle: {
    marginRight: 10,
    fontSize: 35,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  secondView: {
    justifyContent: 'flex-end',
    backgroundColor: Colors.white,
    flex: 0.9,
    //justifyContent: 'space-between',
  },
  secondSubSection: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: heightPercentageToDP(5),
    //marginHorizontal: widthPercentageToDP(4),
  },
  lineHeightText: {
    lineHeight: 20,
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'center',
    // marginBottom: heightPercentageToDP(2),
  },
  circleUserView: {
    marginRight: scaledSize(7),
    marginTop: scaledSize(14),
    width: scaledSize(40),
    height: scaledSize(40),
    borderRadius: 40 / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: heightPercentageToDP(4),
  },
  flatListTextInfoView: {
    flexDirection: 'column',
    //flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'center',
    //alignItems: 'center',
    marginLeft: widthPercentageToDP(2),
  },
  firstSubSection: {
    margin: heightPercentageToDP(2),
  },
  feedContainer: {
    flexDirection: 'row',
    paddingTop: heightPercentageToDP(1.5),
    margin: widthPercentageToDP(3),
    width: widthPercentageToDP(96),
    height: heightPercentageToDP(4),
  },
  whatsappImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});

export default withTranslation()(TargetReachActionView);
