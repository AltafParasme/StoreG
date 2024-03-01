import React, {memo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Tag from '../../../../components/Tag/Tag';
import {Colors, Fonts} from '../../../../../assets/global';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';
import Button from '../../../../components/Button/Button';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {QUANTITY} from '../../Booking/redux/actions';
import {LogFBEvent, Events} from '../../../../Events';
import {AppText} from '../../../../components/Texts';
import ViewMoreText from 'react-native-view-more-text';
import NavigationService from '../../../../utils/NavigationService';
import {Constants} from '../../../../styles';
import idx from 'idx';

const buttons = {
  CLAIMED: 'BUY NOW',
  REPEAT: 'repeat',
  'free-gift': 'SELECT FREE GIFT',
};

const HorizontalComponent = ({
  item,
  index,
  groupCode,
  isGroupUnlocked,
  withoutButton,
  withoutTag,
  onBooking,
  activeCategoryTab,
  language,
  preference,
  getOfferDetails,
  t,
  onPress,
  entityType,
  numberOfLinesEntity,
  pdpButton,
}) => {
  const checkOutOfStock = idx(item, _ => _.offerinvocations.checkOutOfStock);
  const stockQuantity = idx(item, _ => _.offerinvocations.quantity);
  const stockQuantityPurchased = idx(
    item,
    _ => _.offerinvocations.purchasedQuantity
  );
  const stockValue = stockQuantity - stockQuantityPurchased;

  return (
    <TouchableOpacity>
      <View elevation={1} style={{flex: 1, backgroundColor: Colors.white}}>
        <View style={styles.container}>
          <View style={styles.textView}>
            <Button onPress={onPress} style={{flex: 0.5, borderWidth: 1}}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  resizeMethod={'resize'}
                  resizeMode={'contain'}
                  style={{width: 100, height: 100, resizeMode: 'contain'}}
                  source={{uri: item.mediaJson.square}}
                />
              </View>
              <View style={styles.innerView}>
                <ViewMoreText
                  textStyle={{textAlign: 'left'}}
                  renderViewMore={() => null}
                  renderViewLess={() => null}
                  numberOfLines={numberOfLinesEntity || 2}>
                  <AppText
                    textProps={numberOfLinesEntity || {numberOfLines: 2}}
                    style={styles.textStyle}>
                    {t(item.mediaJson.title.text)}
                  </AppText>
                </ViewMoreText>
              </View>
            </Button>
            <View style={styles.mainTagView}>
              <TouchableOpacity onPress={onPress}>
                {
                  <View style={styles.innerTag}>
                    {item.offerinvocations ? (
                      <Tag
                        title={'Offer'}
                        strikeThru={false}
                        price={item.offerinvocations.offerPrice}
                        textColor={Colors.blue}
                        titleStyle={{fontWeight: 'bold'}}
                        priceStyle={{
                          fontWeight: 'bold',
                          paddingRight: scaledSize(30),
                        }}
                        t={t}
                        isGroupScreen={false}
                      />
                    ) : (
                      <View />
                    )}
                  </View>
                }
                <View style={styles.innerTag}>
                  {item.offerinvocations ? (
                    <Tag
                      title={'MRP'}
                      strikeThru={true}
                      price={item.offerinvocations.price || 0}
                      textColor={'#989696'}
                      t={t}
                      titleStyle={{fontSize: 14}}
                      priceStyle={{fontSize: 14}}
                      isGroupScreen={false}
                    />
                  ) : (
                    <View />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            {!withoutButton && (
              <View style={styles.buttonMainView}>
                <LinearGradientButton
                  horizontalList={true}
                  stockValue={stockValue}
                  checkOutOfStock={checkOutOfStock}
                  entityType={entityType}
                  offerId={item.parentId || item.id}
                  item={item}
                  screenName="Booking"
                  cartButton={
                    pdpButton
                      ? false
                      : item.offerinvocations.offerPrice > 0
                      ? true
                      : false
                  }
                  btnStyles={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  titleStyle={{color: 'white'}}
                  isBoderOnly={false}
                  colors={['#fdc001', '#fd7400']}
                  title={pdpButton ? t('BUY NOW') : t('ADD ITEM')}
                  onPress={onPress}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: scaledSize(2),
    flexDirection: 'column',
  },
  imageView: {
    width: widthPercentageToDP(30),
    alignItems: 'center',
    marginTop: '5%',
  },
  shorterImage: {
    height: scaledSize(60),
    width: scaledSize(100),
    resizeMode: 'contain',
  },
  image: {
    height: scaledSize(150),
    width: scaledSize(150),
    resizeMode: 'contain',
  },
  textView: {
    width: widthPercentageToDP(53),
    justifyContent: 'space-between',
    flex: 1,
  },
  textViewForShopGTv: {
    width: widthPercentageToDP(50),
    paddingRight: '8%',
  },
  innerView: {
    paddingHorizontal: 10,
    //paddingBottom: scaledSize(1),
    alignItems: 'center',
  },
  textStyle: {
    fontSize: scaledSize(16),
    flexWrap: 'wrap',
    textAlign: 'center',
    fontFamily: Fonts.roboto,
  },
  textStyleSmaller: {
    fontSize: scaledSize(14),
    flexWrap: 'wrap',
    fontFamily: Fonts.roboto,
  },
  mainTagView: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  innerTag: {
    //width: widthPercentageToDP(53),
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  mainLineView: {
    height: scaledSize(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineView: {
    borderWidth: 0.6,
    height: scaledSize(30),
    borderColor: Colors.mutedBorder,
  },
  buttonMainView: {
    //height: 70,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonInnerView: {
    height: 40,
    backgroundColor: Colors.orange,
    width: '100%',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: scaledSize(14),
    textTransform: 'capitalize',
    color: Colors.white,
    fontWeight: '800',
    fontFamily: Fonts.roboto,
  },
  orMainView: {
    borderWidth: 0.7,
    position: 'relative',
    marginVertical: 15,
    borderColor: Colors.mutedBorder,
  },
  orView: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 40,
    width: 50,
    left: widthPercentageToDP(50) - 50 / 2,
    top: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orInnerView: {
    backgroundColor: '#DDDEDF',
    borderRadius: 30,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orTextStyle: {
    fontSize: scaledSize(14),
    color: '#292f3a',
    fontFamily: Fonts.roboto,
  },
  playIcon: {
    position: 'absolute',
    bottom: '43%',
    left: '43%',
    color: Colors.white,
  },
  iconImage: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    paddingRight: 0,
  },
  multiImageButton: {
    height: scaledSize(40),
    width: scaledSize(40),
    borderRadius: scaledSize(40),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

const mapStateToProps = state => ({
  language: state.home.language,
  preference:
    state.login.userPreferences &&
    state.login.userPreferences.userCat &&
    state.login.userPreferences.userCat.fgStatus,
  quantity: state.booking.quantity,
  activeCategoryTab: state.home.activeCategoryTab,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  updateQuantity: quantity => dispatch(QUANTITY(quantity)),
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(HorizontalComponent))
);
