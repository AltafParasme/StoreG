import React, {PureComponent} from 'react';
import idx from 'idx';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Button from '../../../../components/Button/Button';
import {withTranslation} from 'react-i18next';
import NavigationService from '../../../../utils/NavigationService';
import {scaledSize} from '../../../../utils';
import {getOrderStatus} from '../../utils';
import {Images} from '../../../../../assets/images/index';
import {Colors} from '../../../../../assets/global';
import {Icon} from 'react-native-elements';
import Tag from '../../../../components/Tag/Tag';
import {AppText} from '../../../../components/Texts';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import {LogFBEvent, Events} from '../../../../Events';

class CartStrip extends PureComponent {
  constructor(props) {
    super(props);
  }

  navigateToCart = () => {
    const {totalCartItems, isSubCategory} = this.props;
    if (isSubCategory) {
      NavigationService.navigate('CartDetail');
      LogFBEvent(Events.SUB_CATEGORY_ADD_TO_CART_BUTTON_CLICK, {
        totalCartItems: totalCartItems,
      });
    } else {
      NavigationService.navigate('CartDetail');
      LogFBEvent(Events.HOME_ADD_TO_CART_BUTTON_CLICK, {
        totalCartItems: totalCartItems,
      });
    }
  };

  render() {
    const {t, cart, totalCartItems} = this.props;
    const shippingCharges = idx(cart, _ => _.billing.shippingCharges) || 0;
    const totalPrice = cart.billing ? cart.billing.totalOfferPrice : 0;
    const totalSavings = cart.billing ? cart.billing.saving : 0;
    const freeDelivery = cart.billing
      ? cart.billing.rewardRules &&
        cart.billing.rewardRules[0].reward_type == 'delivery_charges'
        ? cart.billing.rewardRules[0].amountPending
        : 0
      : 0;

    return (
      <TouchableOpacity onPress={this.navigateToCart}>
        <View style={styles.container}>
          <View style={styles.leftView}>
            <Image
              source={Images.cart_not_added}
              style={styles.cartImageStyle}
            />
          </View>
          <View style={styles.centerView}>
            <View style={styles.centerViewSection}>
              {totalCartItems > 0 ? (
                <AppText size="S" bold style={styles.alphaTextStyle}>
                  {t('#ITEMNUMBER# items', {ITEMNUMBER: totalCartItems})}
                </AppText>
              ) : (
                <View />
              )}

              <View style={styles.roundView} />

              <AppText size="S" bold style={styles.alphaTextStyle}>
                {t('₹#TOTALPRICE#', {TOTALPRICE: totalPrice})}
              </AppText>

              <View style={styles.roundView} />

              <AppText size="S" bold style={styles.beetaTextStyle}>
                {t('₹#TOTALSAVING# Saved', {TOTALSAVING: totalSavings})}
              </AppText>
            </View>
            <View style={styles.centerViewSection}>
              {shippingCharges == 0 ? (
                <AppText size="XS" bold style={styles.gamaTextStyle}>
                  {t('Enjoy free delivery !!')}
                </AppText>
              ) : (
                <AppText size="XS" bold style={styles.gamaTextStyle}>
                  {t(`Add ₹#FREESHIPPING# to get free delivery`, {
                    FREESHIPPING: freeDelivery,
                  })}
                </AppText>
              )}
            </View>
          </View>
          <View style={styles.rightView}>
            <View style={styles.rightInnerView}>
              <AppText white size="XS" bold>
                {t('PLACE ORDER')}
              </AppText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: scaledSize(60),
    backgroundColor: Colors.darkishBlue,
    paddingHorizontal: scaledSize(10),
  },
  cartImageStyle: {
    width: scaledSize(29),
    height: scaledSize(25),
  },
  leftView: {
    flex: 1,
    flexDirection: 'column',
    height: scaledSize(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerView: {
    flex: 6,
    height: scaledSize(60),
    justifyContent: 'center',
    paddingHorizontal: scaledSize(10),
  },
  centerViewSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightInnerView: {
    backgroundColor: Colors.fullOrange,
    paddingVertical: scaledSize(10),
    paddingHorizontal: scaledSize(6),
    borderRadius: scaledSize(2),
  },
  rightView: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphaTextStyle: {
    color: Colors.white,
  },
  beetaTextStyle: {
    color: Colors.blue,
  },
  gamaTextStyle: {
    color: Colors.slightGrey,
  },
  roundView: {
    width: scaledSize(3),
    height: scaledSize(3),
    borderRadius: scaledSize(3),
    backgroundColor: Colors.white,
    marginHorizontal: scaledSize(5),
  },
});

export default withTranslation()(CartStrip);
