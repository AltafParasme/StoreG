import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {SELECT_ADDRESS} from '../redux/actions';
import Button from '../../../../components/Button/Button';
import {CheckBox} from 'react-native-elements';
import {participators} from '../../utils';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';
import {Fonts, Colors} from '../../../../../assets/global';
import {ScrollView} from 'react-native-gesture-handler';
import {AppText} from '../../../../components/Texts';
import CommonInput from '../../../../components/Input/Input';
import idx from 'idx';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0.7,
    borderColor: Colors.mutedBorder,
    marginVertical: scaledSize(5),
    paddingVertical: scaledSize(5),
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rightContainerInner: {
    alignItems: 'baseline',
    marginRight: scaledSize(5),
  },
  saveText: {
    fontFamily: Fonts.roboto,
    color: Colors.white,
    padding: scaledSize(2),
    width: widthPercentageToDP(20),
    borderRadius: scaledSize(6),
    //marginTop: scaledSize(5),
    textAlign: 'center',
  },
  listView: {
    flex: 3,
    marginVertical: scaledSize(5),
    paddingVertical: scaledSize(5),
    alignItems: 'flex-start',
  },
  checkboxView: {
    flexDirection: 'row',
  },
  checkboxText: {
    fontSize: scaledSize(14),
    fontFamily: Fonts.roboto,
    marginLeft: scaledSize(10),
  },
  stateView: {
    flexDirection: 'row',
  },
  addressText: {
    fontSize: scaledSize(12),
    fontFamily: Fonts.roboto,
  },
  deliveryText: {
    fontSize: scaledSize(14),
    fontWeight: '800',
    fontFamily: Fonts.roboto,
  },
  AddressView: {
    marginTop: scaledSize(5),
    marginLeft: scaledSize(10),
  },
  comunityContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginHorizontal: scaledSize(5),
    padding: scaledSize(10),
    borderRadius: scaledSize(6),
  },
  addressInputStyle: {
    margin: scaledSize(10),
  },
});

let List = ({
  addressNameProps,
  dispatch,
  login,
  addressList,
  activeAddress,
  setActiveAddress,
  amountNeeded,
  targetVal,
  cart,
  t,
}) => {
  const handleChange = text => {
    dispatch({type: 'booking/SET_STATE', payload: {addressName: text}});
  };

  return addressList.map((address, index) => {
    let {
      id,
      addressName,
      addressLine1,
      addressLine2,
      nearestLandmark,
      district,
      state,
      pinCode,
      addressType,
      contactNumber,
      defaultPickupCashBackAmount,
      userId,
    } = address;
    let clAddressCheck =
      login &&
      login.userPreferences &&
      login.userPreferences.uid != userId &&
      addressType &&
      addressType == 'CL';

    const payableAmount = cart && cart.billing && cart.billing.totalOfferPrice;
    const shippingCharges = idx(cart, _ => _.billing.shippingCharges) || 0;
    let eligibleForCashback = payableAmount > amountNeeded;
    let clName = idx(login, _ => _.clDetails.mallInfo.name);

    let textMsg, subText;
    if (shippingCharges > 0) {
      textMsg = t('Get free delivery if you & friend buy for ₹#TARGETVAL#', {
        TARGETVAL: targetVal,
      });
      subText = t(
        'Free delivery valid on selecting pickup address - #CLNAME#',
        {CLNAME: clName}
      );
    } else {
      if (eligibleForCashback) {
        textMsg = t('Get ₹#CASHBACK# Cashback on selecting below address', {
          CASHBACK: defaultPickupCashBackAmount,
        });

        subText = t('Offer valid on selecting pickup address - #CLNAME#', {
          CLNAME: clName,
        });
      } else {
        textMsg = t('You get free delivery & extra 5% cashback');
        subText = t('Offer valid on selecting pickup address - #CLNAME#', {
          CLNAME: clName,
        });
      }
    }

    return (
      <View style={styles.container}>
        {payableAmount && clAddressCheck ? (
          <View
            style={[
              styles.comunityContainer,
              eligibleForCashback
                ? {
                    backgroundColor: Colors.blue,
                  }
                : {
                    backgroundColor: Colors.sheetOrange,
                  },
            ]}>
            <AppText white size="M" bold>
              {textMsg}
            </AppText>

            <AppText size="S" style={{paddingTop: heightPercentageToDP(2)}}>
              {subText}
            </AppText>
          </View>
        ) : (
          <View />
        )}

        {clAddressCheck ? (
          <View style={styles.addressInputStyle}>
            <CommonInput
              name="Enter your name"
              value={addressNameProps}
              placeholder={t('Enter your name')}
              handleChange={handleChange}
              placeholderTextColor={Colors.lightestBlue}
              addressPincodeScreen={false}
              maxLength={10}
            />
          </View>
        ) : (
          <View />
        )}

        <View style={styles.subContainer}>
          <Button
            onPress={() => setActiveAddress(address)}
            key={index}
            styleContainer={styles.listView}>
            <View style={styles.checkboxView}>
              <CheckBox
                containerStyle={{
                  backgroundColor: Colors.white,
                  borderWidth: 0,
                  padding: 2,
                  marginLeft: 5,
                  marginRight: 0,
                  margin: 0,
                }}
                onPress={() => setActiveAddress(address)}
                checked={id === activeAddress.id}
              />
              <AppText numberOfLines={1} style={styles.checkboxText}>
                {addressName}
              </AppText>
            </View>

            <View style={styles.AddressView}>
              <AppText style={styles.deliveryText}>
                {t('Delivery Address :')}
              </AppText>
              {!!addressLine1 && (
                <AppText style={styles.addressText}>{addressLine1}</AppText>
              )}
              {(!!addressLine2 || !!nearestLandmark) && (
                <AppText style={styles.addressText}>
                  {!!addressLine2 ? addressLine2 : ''} {nearestLandmark}
                </AppText>
              )}
              {district && (
                <AppText style={styles.addressText}>{district}</AppText>
              )}
              {
                <AppText
                  style={styles.addressText}>{`${state},${pinCode}`}</AppText>
              }
            </View>

            {clAddressCheck && contactNumber ? (
              <AppText numberOfLines={1} style={styles.checkboxText}>
                {t('Phone Number : #CONTACT#', {CONTACT: contactNumber})}
              </AppText>
            ) : (
              <View />
            )}
          </Button>

          <View style={styles.rightContainer}>
            <View style={styles.rightContainerInner}>
              {clName ? (
                clAddressCheck && eligibleForCashback ? (
                  <AppText
                    size="S"
                    style={[
                      styles.saveText,
                      eligibleForCashback
                        ? {
                            backgroundColor: Colors.blue,
                          }
                        : {
                            backgroundColor: Colors.sheetOrange,
                          },
                    ]}>
                    {t('Save #SAVE#', {SAVE: defaultPickupCashBackAmount})}
                  </AppText>
                ) : (
                  <AppText size="XS"></AppText>
                )
              ) : (
                <AppText></AppText>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  });
};

const AddressList = ({
  addressName,
  login,
  address,
  t,
  activeAddress,
  setActiveAddress,
  addressLoading,
  dispatch,
  cart,
  amountNeeded,
  groupSummary,
}) => {
  let targetVal = idx(groupSummary, _ => _.groupDetails.info.bucketLimitEnd);
  let groupDetails = idx(groupSummary, _ => _.groupDetails);
  if (address && address.length > 0) {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <List
          addressNameProps={addressName}
          dispatch={dispatch}
          login={login}
          addressList={address}
          activeAddress={activeAddress}
          setActiveAddress={setActiveAddress}
          amountNeeded={amountNeeded}
          targetVal={targetVal}
          cart={cart}
          t={t}
        />
      </ScrollView>
    );
  } else if (addressLoading) {
    return (
      <View style={{marginTop: 10, alignItems: 'center'}}>
        <ActivityIndicator
          color="black"
          style={styles.activityIndicator}
          size="small"
        />
      </View>
    );
  } else {
    return (
      <View style={{marginTop: 10, alignItems: 'center'}}>
        <Text>{t('No address Added...')}</Text>
      </View>
    );
  }
};

const mapStateToProps = state => {
  return {
    address: state.booking.address,
    activeAddress: state.booking.selectedAddress,
    addressLoading: state.booking.isLoading,
    login: state.login,
    groupSummary: state.groupSummary,
    cart: state.home.cart,
    addressName: state.booking.addressName,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  setActiveAddress: address => {
    dispatch(SELECT_ADDRESS(address));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddressList)
);
