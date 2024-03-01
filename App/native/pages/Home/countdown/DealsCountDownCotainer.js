import React, {PureComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DealsCountDown from './DealsCountDown';
import Button from '../../../../components/Button/Button';
//import {Button} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
import NavigationService from '../../../../utils/NavigationService';
import {scaledSize} from '../../../../utils';
import {getOrderStatus} from '../../utils';
import {LogFBEvent, Events} from '../../../../Events';

class DealsCountDownCotainer extends PureComponent {
  constructor(props) {
    super(props);
    // this.navigateTo = this.navigateTo.bind(this);
  }
  handleTimer = () => {};
  render() {
    const {t} = this.props;
    if (
      !this.props.login.userPreferences ||
      !this.props.groupSummary.groupDetails
    )
      return null;

    const offerDuration =
      this.props.groupSummary.groupDetails.info.offerDuration / 1000;
    let bucketLimitEnd = 50;
    bucketLimitEnd =
      this.props.groupSummary.groupDetails.info.bucketLimitEnd || 50;
    const login = this.props.login;

    const fgStatus =
      Object.keys(login.userPreferences).length &&
      login.userPreferences.userCat &&
      !!login.userPreferences.userCat
        ? login.userPreferences.userCat.fgStatus
        : 'REPEAT';
    let savingStr, groupStr;
    const status = (login.recentOrder && login.recentOrder.status) || '';
    const totalPrice = login.recentOrder && login.recentOrder.totalPrice;
    const name = login.recentOrder && login.recentOrder.name;
    const groupOfferId = login.recentOrder && login.recentOrder.groupOfferId;
    const currentCycleOrder =
      (this.props.groupSummary &&
        this.props.groupSummary.groupDetails &&
        this.props.groupSummary.groupDetails.info.groupOfferId) ===
      groupOfferId;

    let navigationScreen;
    // if((name == "Flower Mobile Stand" || parseFloat(totalPrice) !== 0)){
    //   savingStr = 'Order Not Confirmed';
    //   navigationScreen = currentCycleOrder ? 'OrderConfirmation' : 'PastOrders';
    // }else {
    savingStr = getOrderStatus(status);
    if (parseFloat(totalPrice) == 0 && name !== 'Flower Mobile Stand') {
      navigationScreen = currentCycleOrder ? 'FreeGift' : 'ShippingList';
    } else {
      navigationScreen = currentCycleOrder ? 'OrderConfirmation' : 'ShippingList';
    }

    return (
      <React.Fragment>
        <Button
          styleContainer={styles.container}
          activeOpacity={0.9}
          onPress={() => {
            LogFBEvent(Events.HOME_RECENT_ORDER_STRIP_CLICK, null);
            NavigationService.navigate(navigationScreen);
          }}>
          <DealsCountDown
            offerDuration={offerDuration}
            fgStatus={fgStatus || ''}
            savingStr={savingStr || ''}
            groupStr={groupStr || ''}
            handleTimer={this.handleTimer}
            t={t}
          />
        </Button>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: scaledSize(60),
    backgroundColor: '#242B37',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default withTranslation()(DealsCountDownCotainer);
