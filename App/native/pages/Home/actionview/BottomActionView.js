import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import ListComponent from '../component/ListComponent';
import Button from '../../../../components/Button/Button';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import {Colors} from '../../../../../assets/global';
import {withTranslation} from 'react-i18next';
import {AppWindow, scaledSize} from '../../../../utils';
import {Placeholder, PlaceholderLine, Fade} from 'rn-placeholder';
import {Images} from '../../../../../assets/images';
import {Constants} from '../../../../styles';
import {CheckBox} from 'react-native-elements';
import {AppText} from '../../../../components/Texts';

const BottomActionView = ({
  item,
  index,
  handleCloseBottomSheet,
  handleConfirm,
  t,
  isGroupUnlocked,
  bucketLimitEnd,
  groupOrderAmount,
  quantity,
  rewards,
  groupCode,
  initialRewardsApiCallCompleted,
}) => {
  const [isGroupRiched, setGroup] = React.useState(false);
  const [isChecked, setChecked] = React.useState(false);

  const {price, individualOfferPrice, offerPrice} = item.offerinvocations;

  const onCheck = () => {
    setChecked(!isChecked);
  };
  let total = isGroupUnlocked
    ? (offerPrice * quantity).toFixed(2)
    : (individualOfferPrice * quantity).toFixed(2);
  if (total > bucketLimitEnd - groupOrderAmount) {
    !isGroupRiched && setGroup(true);
    total = (offerPrice * quantity).toFixed(2);
  } else {
    isGroupRiched && setGroup(false);
    total = total;
  }
  const maxPerOrder = (rewards && rewards.maxPerOrder) || 0;
  const maxRewardsForGroup = offerPrice * quantity;
  let rewardsPrice = maxPerOrder;

  let rewardsCandidate = Math.min(maxRewardsForGroup, total);

  if (rewardsCandidate < rewardsPrice) {
    rewardsPrice = rewardsCandidate;
  }
  if (isChecked) {
    total = total - rewardsPrice;
  }
  rewardsPrice = parseFloat(rewardsPrice);
  console.log('40-> rewards', rewards, rewardsPrice);
  return (
    <View style={styles.topContainer}>
      <View style={styles.item}>
        <ListComponent
          item={item}
          index={index}
          isGroupUnlocked={isGroupUnlocked}
          withoutButton={true}
          isLast={false}
          withCounter
          groupCode={groupCode}
          quantity={quantity}
        />
      </View>
      {!initialRewardsApiCallCompleted ? (
        <View style={{padding: 10}}>
          <Placeholder Animation={Fade}>
            <PlaceholderLine width={30} />
          </Placeholder>
        </View>
      ) : null}
      {initialRewardsApiCallCompleted && rewards && rewardsPrice > 0 ? (
        <View style={styles.rewardsContainer}>
          <CheckBox
            containerStyle={styles.checkbox}
            checkedColor={Colors.orange}
            title={`Reward balance: ${rewardsPrice}`}
            onPress={onCheck}
            checked={isChecked}
            textStyle={{color: Colors.orange, fontSize: scaledSize(14)}}
          />
          <View style={{flexDirection: 'row'}}>
            <Image source={Images.selected} style={styles.selectIcon} />
            <AppText style={styles.selectText}>
              {isChecked ? 'Applied' : 'Not Applied'}
            </AppText>
          </View>
        </View>
      ) : null}
      <View style={styles.itemDetailsContainer}>
        <View style={styles.itemDetails}>
          {isGroupUnlocked || isGroupRiched ? null : (
            <View style={styles.headerView}>
              <AppText style={styles.headerText}>
                {t('You will buy this product at')}
              </AppText>
            </View>
          )}
          <View style={styles.innerTextView}>
            <AppText style={styles.dotText}>{`• `}</AppText>
            <View style={styles.atOffer}>
              <AppText style={[styles.priceText, styles.groupTargetTextColor]}>
                {t('Group Price') + ' @ ₹' + item.offerinvocations.offerPrice}
                <AppText style={[styles.saveText, styles.groupTargetTextColor]}>
                  {t(`   (Save ₹#SAVING#)`, {
                    SAVING:
                      item.offerinvocations.price -
                      item.offerinvocations.offerPrice,
                  })}
                </AppText>
              </AppText>
              {isGroupUnlocked || isGroupRiched ? (
                <AppText style={styles.targetText}>
                  {t('Congratulations, Group target reached')}
                </AppText>
              ) : (
                <AppText style={styles.targetText}>
                  {t('If group reaches the target ₹#AMOUNT#', {
                    AMOUNT: bucketLimitEnd,
                  })}
                </AppText>
              )}
            </View>
          </View>
          {isGroupUnlocked || isGroupRiched ? null : (
            <View style={styles.innerTextView}>
              <AppText style={styles.dotText}>{`• `}</AppText>
              <View style={styles.atGroup}>
                <AppText style={[styles.priceText, styles.offerTextColor]}>
                  {t('Offer price') +
                    ' @ ₹' +
                    item.offerinvocations.individualOfferPrice}
                  <AppText style={[styles.saveText, styles.offerTextColor]}>
                    {t(`   (Save ₹#SAVING#)`, {
                      SAVING:
                        item.offerinvocations.price -
                        item.offerinvocations.individualOfferPrice,
                    })}
                  </AppText>
                </AppText>
                <AppText style={styles.targetText}>
                  {t("If group doesn't reach the target of ₹#AMOUNT#", {
                    AMOUNT: bucketLimitEnd,
                  })}
                </AppText>
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <View style={styles.actionContainer}>
            <View style={styles.buttonView}>
              <LinearGradientButton
                btnStyles={styles.actionBtn}
                colors={
                  isGroupUnlocked || isGroupRiched
                    ? ['#00a9a6', '#006260']
                    : ['#ff8648', '#dc4d04']
                }
                title={t('BUY AT ₹#AMOUNT#', {
                  AMOUNT: total,
                })}
                titleStyle={styles.actionTitle}
                gradientStyles={styles.gradientStyles}
                onPress={() => handleConfirm(item, total, index)}
              />
            </View>
          </View>
          <Button
            styleContainer={styles.cancelBtn}
            activeOpacity={0.7}
            onPress={handleCloseBottomSheet}>
            <AppText style={[styles.actionTitle, styles.cancelTitle]}>
              cancel
            </AppText>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    width: AppWindow.width,
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#f9f9f9',
  },
  itemDetailsContainer: {
    width: AppWindow.width - 15,
  },
  buttonsContainer: {},
  itemDetails: {
    paddingHorizontal: 5,
    margin: 5,
  },
  priceText: {
    fontSize: scaledSize(15),
    fontWeight: '600',
    paddingLeft: 10,
    textTransform: 'capitalize',
  },
  groupTargetTextColor: {
    color: Colors.blue,
  },
  offerTextColor: {
    color: Colors.orange,
  },
  dotText: {
    fontSize: scaledSize(15),
    fontWeight: '700',
  },
  targetText: {
    paddingTop: 3,
    paddingLeft: 13,
    fontWeight: '100',
    color: Colors.textMuted,
  },
  actionContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  actionBtn: {
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  cancelBtn: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  actionTitle: {
    textTransform: 'uppercase',
  },
  cancelTitle: {
    color: Colors.orange,
  },
  confirmTitle: {
    color: Colors.white,
  },
  gradientStyles: {
    paddingStart: 0,
    paddingRight: 0,
  },
  headerView: {
    padding: 10,
    // marginLeft: 15,
    // marginTop: 5,
    // paddingLeft: 15,
  },
  headerText: {
    fontSize: scaledSize(16),
    fontWeight: '500',
  },
  innerTextView: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 10,
    color: Colors.blue,
    textAlign: 'center',
    textAlignVertical: 'top',
  },
  buttonView: {
    height: 50,
    width: '100%',
  },
  rewardsContainer: {
    height: 50,
    backgroundColor: Constants.lightOrange,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.mutedBorder,
    paddingRight: 10,
    width: AppWindow.width,
  },
  checkbox: {
    backgroundColor: Constants.lightOrange,
    borderWidth: 0,
    alignSelf: 'center',
  },
  selectIcon: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 5,
  },
  selectText: {
    alignSelf: 'center',
    textAlign: 'right',
    color: Colors.blue,
    fontSize: scaledSize(16),
  },
});

export default withTranslation()(React.memo(BottomActionView));
