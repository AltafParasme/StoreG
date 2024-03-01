import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {connect} from 'react-redux';
import {getRewards} from '../../native/pages/UserProfile/actions';
import {Images} from '../../../assets/images';
import {Constants} from '../../styles';
import {Colors, Fonts} from '../../../assets/global';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import Button from '../Button/Button';
import {withTranslation} from 'react-i18next';
import NavigationService from '../../utils/NavigationService';
import {AppText} from '../Texts';

const RewardBase = ({rewards, isText, getRewards}) => {
  if (rewards && !rewards.rewards && !rewards.rewards.totalBalance) return null;

  let cashback = rewards.rewards.totalBalance.rewardsBalance;

  return (
    <Button
      styleContainer={{flex: 1}}
      hitslop={{top: 2, bottom: 2}}
      onPress={() =>
        NavigationService.navigate('MyRewards', {
          actionId: 'cashback',
        })
      }>
      <View style={styles.container}>
        <Image
          source={Images.rewardsRupee}
          style={{
            height: scaledSize(32),
            width: scaledSize(32),
            marginTop: scaledSize(10),
            resizeMode: 'contain',
          }}
        />
      </View>
      <View style={styles.bottomBlackView}>
        <AppText bold white size="XXS" style={{textAlign: 'center'}}>
          {'₹ ' + (cashback ? cashback : 0)}
        </AppText>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerView: {
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: Colors.orange,
    padding: 1,
    width: widthPercentageToDP(10),
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: Constants.white,
  },
  bottomBlackView: {
    backgroundColor: Constants.black,
    width: scaledSize(34),
    height: scaledSize(10),
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  rewardText: {
    fontSize: scaledSize(18),
    color: Colors.orange,
    fontWeight: 'bold',
    width: widthPercentageToDP(5),
    textAlign: 'center',
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 5,
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

const mapStateToProps = state => {
  return {
    rewards: state.rewards,
    login: state.login,
  };
};

const mapDispatchToProps = dispatch => ({});

const Reward = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(RewardBase)
);

export default React.memo(Reward);
