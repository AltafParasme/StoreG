import React, {memo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Share from 'react-native-share';
import {getTrustMarkerLabel, getProfileMarkerLabel} from '../../utils';
import ViewMoreText from 'react-native-view-more-text';
import idx from 'idx';
import firebase from '@react-native-firebase/app';
import Tag from '../../../../components/Tag/Tag';
import {Colors, Fonts} from '../../../../../assets/global';
import {liveAnalytics} from '../../ShopgLive/redux/actions';
import {Rating} from 'react-native-elements';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
  isFreeGiftCategory,
} from '../../../../utils';
import {
  getRandomArbitrary,
  getLastDigit,
  dummyRating,
} from '../../../pages/utils';
import Button from '../../../../components/Button/Button';
import {withTranslation} from 'react-i18next';
import {Icon} from 'react-native-elements';
import VideoModal from '../../../../components/VideoModal/VideoModal';
import {ListImageBG} from '../../../../components/ListImageBG/ListImageBG';
import {connect} from 'react-redux';
import QuantityCounter from '../../Booking/Component/QuantityCounter';
import {QUANTITY} from '../../Booking/redux/actions';
import {Images} from '../../../../../assets/images';
import OffTag from '../../../../components/Tag/OffTag';
import ImageModal from '../../../../components/ImageModal/ImageModal';
import {LogFBEvent, Events} from '../../../../Events';
import {AppText} from '../../../../components/Texts';
import {Constants} from '../../../../styles';
import RNFetchBlob from 'rn-fetch-blob';
import {shareOfferOnWhatsApp} from '../../utils';
import {packageName} from '../../../../Constants';
import ShopgLive from '../../ShopgLive';
import {processTextAndAppendElipsis} from '../../../../utils/misc';

const buttons = {
  CLAIMED: 'BUY NOW',
  REPEAT: 'repeat',
  'free-gift': 'SELECT FREE GIFT',
};

const Listing = ({
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
  bookedGiftId,
  withCounter,
  withoutVideo,
  updateQuantity,
  quantity,
  isMultiImage,
  isBooking,
  isShopGTv,
  isEntity,
  isEntityOffers,
  screen,
  t,
  userPref,
  groupSummary,
  containerShopGTV,
  containerEntity,
  containerEntityOffers,
  isTwoItemRow,
  shopGTvImage,
  entityImage,
  entityOffersImage,
  numberOfLinesEntity,
  eventTitle,
  eventImage,
  eventVideo,
  hasCart,
  onAnalytics,
  liveComponentsData,
  handleVideoClick,
  withoutShopglive,
  rewards,
  coinRewards,
  cart,
  clMediumLogoImage,
}) => {
  const component = 'ListComponent';
  const [isModalOpen, setModal] = React.useState(false);
  const [startVideoTime, setStartVideoTime] = React.useState(null);
  const [startImageTime, setStartImageTime] = React.useState(null);
  const [videoUri, setVideoUri] = React.useState({});
  const [openImageModal, setOpenImageModal] = React.useState(false);
  const isActiveCategory = activeCategoryTab === 'free-gift';

  let shareCoins = idx(item.categoryFeatures, _ => _.shareCoins);
  let taskId = idx(item.categoryFeatures, _ => _.taskId);

  let {ratings} = item;
  let ratingValue =
    ratings && ratings.rating
      ? ratings.rating
      : dummyRating[getLastDigit(item.id)];
  let totalRating =
    ratings && ratings.totalRating
      ? ratings.totalRating
      : getLastDigit(item.id);

  let coinsIhave = 0;
  let coin = undefined;
  if (coinRewards) {
    coin =
      item && item.unlockCoins && parseInt(item.unlockCoins) > 0
        ? parseInt(item.unlockCoins)
        : null;
    const coinsBalance = idx(rewards, _ => _.totalBalance.coinsBalance);
    const coinsUsed = idx(cart, _ => _.billing.coinsUsed);

    if (coinsBalance && coinsUsed) {
      coinsIhave = coinsBalance - coinsUsed;
    } else if (coinsBalance) {
      coinsIhave = coinsBalance;
    }
  }

  let logEventsData = {
    offerId: item.id,
    offerName: item.mediaJson.title.text,
    category: !isShopGTv ? activeCategoryTab : 'shopg-tv',
    offerPrice: item.offerinvocations ? item.offerinvocations.offerPrice : 0,
    serialNo: index + 1,
    groupCode: '',
  };
  let label,
    profileMarker,
    trustMarker = null;
  let profileColor = {};
  let marker = false;

  if (item.marker && Object.keys(item.marker).length) {
    marker = true;
    trustMarker =
      item.marker.TrustMarker && item.marker.TrustMarker.slice(0, 2);
    profileMarker =
      item.marker.ProfileMarker &&
      getProfileMarkerLabel(item.marker.ProfileMarker[0].name);
    if (profileMarker === 'New Arrival') {
      profileColor = {borderTopColor: '#dda50b'};
    } else if (profileMarker === 'Top Selling') {
      profileColor = {borderTopColor: '#ec3d5a'};
    } else if (profileMarker === 'Trending') {
      profileColor = {borderTopColor: '#fa6400'};
    }
  }

  const shareOffer = () => {
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };
    let eventProps = {
      offerId: item.id,
      sharedBy: userPref.userMode,
      category: activeCategoryTab,
      url:
        (item.mediaJson &&
          item.mediaJson.mainImage &&
          item.mediaJson.mainImage.url) ||
        '',
      position: index,
      page: screen,
      component: component,
    };
    if (taskId) {
      eventProps['taskId'] = taskId;
    }
    shareOfferOnWhatsApp(
      clMediumLogoImage,
      'TagsItems',
      'Listing',
      t,
      groupSummary,
      item,
      eventProps,
      null,
      shareCoins,
      userPrefData
    );
    onAnalytics(Events.SHARE_OFFER_WHATSAPP_CLICK, eventProps, userPrefData);
  };

  const offerPrice = idx(item, _ => _.offerinvocations.offerPrice);
  const checkOutOfStock = idx(item, _ => _.offerinvocations.checkOutOfStock);
  const stockQuantity = idx(item, _ => _.offerinvocations.quantity);
  const stockQuantityPurchased = idx(
    item,
    _ => _.offerinvocations.purchasedQuantity
  );
  const stockValue = stockQuantity - stockQuantityPurchased;
  const isFreeGiftCategoryItem = isFreeGiftCategory(item);

  const isHomeScreen = screen === 'Home';

  const toggle = uri => {
    !isModalOpen ? setStartVideoTime(new Date()) : null;

    setVideoUri(uri);
    setModal(!isModalOpen);
  };

  const trustMarkerRenderLogo = ({item, index}) => {
    let urlString = item.name;
    return (
      <View style={{paddingRight: widthPercentageToDP(0.5)}}>
        <Image
          source={{
            uri: `https://cdn.shopg.in/icon/trust-markers/${urlString.toLowerCase()}.jpeg`,
          }}
          style={styles.markerLogoImage}
        />
      </View>
    );
  };

  const trustMarkerRender = (item, index, len) => {
    label = getTrustMarkerLabel(item.name);
    let comma = index < len - 1 ? ',' : '';
    return (
      <View
        style={{
          paddingRight: widthPercentageToDP(0.4),
          marginTop: heightPercentageToDP(1.3),
        }}>
        <AppText size="XS" style={{color: '#404040'}}>
          {label}
          {`${comma} `}
        </AppText>
      </View>
    );
  };

  const decQuantity = () => {
    updateQuantity(quantity - 1);
    let pageName = null;
    let groupCodeValue = null;
    if (isBooking) {
      pageName = Events.PDP_QTY_MINUS_BUTTON_CLICK;
      groupCodeValue = groupCode;
    } else {
      pageName = Events.HOME_POPUP_QTY_MINUS_BUTTON_CLICK;
      groupCodeValue = groupCode.info.groupCode;
    }

    const dataForLog = Object.assign(
      {
        quantity: quantity + 1,
        groupCode: groupCodeValue,
      },
      logEventsData
    );
    LogFBEvent(pageName, dataForLog);
  };

  const getLang = data => {
    let returnItem = false;
    if (!data || data.length === 0) {
      return false;
    }
    data.forEach(row => {
      if (language && row.language.toLowerCase() === language.toLowerCase()) {
        returnItem = row;
      }
    });
    return returnItem;
  };
  const isSelected = isActiveCategory
    ? preference === 'CLAIMED' && bookedGiftId
      ? item.id == bookedGiftId
      : true
    : true;
  const video = getLang(item.mediaJson.localisedVideo);

  const handleClick = (item, video, index) => {
    if (!video) {
      if (onBooking) {
        onBooking(item, index);
        const dataForLog = Object.assign(
          {
            serialNo: index + 1,
            groupCode: groupCode,
          },
          logEventsData
        );
        isHomeScreen
          ? LogFBEvent(Events.HOME_OFFER_IMAGE_CLICK, dataForLog)
          : LogFBEvent(Events.eventImage, logEventsData);
      }
    } else {
      // setStartVideoTime(new Date());
      !withoutVideo ? toggle(video) : onBooking(item, index);
      // toggle(video);
    }
  };

  const openModal = () => {
    if (openImageModal) {
      // eslint-disable-next-line no-lone-blocks
      let groupCodeValue = '';
      groupCode ? (groupCodeValue = groupCode) : (groupCodeValue = '');

      const dataForLog = Object.assign(
        {
          groupCode: groupCodeValue,
          timeTaken: new Date() - startImageTime,
        },
        logEventsData
      );
      LogFBEvent(Events.PDP_OFFER_IMAGE_CLICK, dataForLog);
    } else {
      setStartImageTime(new Date());
    }
    setOpenImageModal(!openImageModal);
  };

  const isOutOfStock = checkOutOfStock && stockValue < 1;
  let isPaddingRightZero =
    (marker && profileMarker) || item.offerinvocations.offerPrice === 0;
  return (
    <View
      elevation={1}
      style={[
        isSelected ? {marginTop: 0} : {opacity: 0.5, marginTop: 0},
        containerEntity,
        containerEntityOffers,
      ]}
      pointerEvents={isSelected ? 'auto' : 'none'}>
      {!withoutShopglive ? (
        <View style={{marginBottom: heightPercentageToDP(2)}}>
          <ShopgLive
            index={index}
            screenName={screen ? screen : 'Home'}
            activeCategoryTab={activeCategoryTab}
            liveComponentsData={liveComponentsData}
          />
        </View>
      ) : null}

      <View style={{marginBottom: heightPercentageToDP(2)}}></View>

      <View
        style={[
          styles.container,
          isPaddingRightZero
            ? {
                paddingRight: widthPercentageToDP(0),
                paddingTop: heightPercentageToDP(0),
              }
            : null,
        ]}>
        {item.offerinvocations.offerPrice === 0 ? (
          <View>
            {/* <Image source={Images.freeRectangle} style={styles.freeImage} /> */}
            <View
              style={[styles.profileMarkerView, {borderTopColor: '#fa6400'}]}
            />
            {/* <View style={styles.freeView}> */}
            <AppText
              white
              medium
              bold
              size="XS"
              style={{
                bottom: heightPercentageToDP(1.5),
                left: widthPercentageToDP(77),
                // paddingRight: widthPercentageToDP(2),
              }}>
              {t('Free Gift')}
            </AppText>
            {/* </View> */}
          </View>
        ) : marker && profileMarker ? (
          <View>
            <View style={[styles.profileMarkerView, profileColor]} />
            <AppText
              white
              bold
              size="XS"
              style={{
                bottom: heightPercentageToDP(1.5),
                left: widthPercentageToDP(77),
                // paddingRight: widthPercentageToDP(7),
              }}>
              {t(profileMarker)}
            </AppText>
          </View>
        ) : null}
        <View style={isTwoItemRow ? styles.subViewColumn : styles.subView}>
          <View style={styles.imageView}>
            <Button
              onPress={() => {
                console.log('openModal', handleClick, openModal);
                !isBooking ? handleClick(item, video, index) : openModal();
              }}>
              <ListImageBG
                language={language}
                item={item}
                screen="home"
                videoClick={handleVideoClick}
                noVideoClick={() => handleClick(item, video, index)}
                style={{
                  height: widthPercentageToDP(40),
                  width: widthPercentageToDP(40),
                }}
              />
              {!withoutTag && item.offerinvocations && (
                <OffTag
                  title={'OFF'}
                  price={
                    item.offerinvocations.price -
                      item.offerinvocations.offerPrice || 0
                  }
                  t={t}
                />
              )}
            </Button>
            {!withoutVideo && video && (
              <Icon
                onPress={() => {
                  // startTime = new Date();
                  toggle(video);
                }}
                style={styles.playIcon}
                hitslop={{top: 5, right: 5, left: 5, bottom: 5}}
                type={'Feather'}
                name={'play-circle'}
                fontSize={50}
              />
            )}
            {isMultiImage && (
              <Button
                onPress={openModal}
                styleContainer={styles.multiImageButton}>
                <Icon name={'view-carousel'} type={'MaterialIcons'} />
              </Button>
            )}
          </View>
          <View style={styles.textView}>
            <Button
              onPress={() => {
                let groupCodeValue = '';
                groupCode
                  ? (groupCodeValue = groupCode)
                  : (groupCodeValue = '');
                let dataForLog = Object.assign(
                  {
                    groupCode: groupCodeValue,
                    serialNo: index + 1,
                  },
                  logEventsData
                );
                LogFBEvent(Events.HOME_OFFER_TITLE_CLICK, dataForLog);
                onBooking && onBooking(item, index);
              }}>
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
            {ratings ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: heightPercentageToDP(0.3),
                }}>
                <Rating
                  count={5}
                  imageSize={17}
                  ratingColor={'#dda50b'}
                  readonly
                  startingValue={ratingValue}
                  style={{paddingTop: heightPercentageToDP(0.4)}}
                  fractions="{1}"
                />
                <View style={{marginLeft: widthPercentageToDP(2)}}>
                  <AppText size="XS">
                    {t(`${ratingValue}`)}
                    <AppText size="XS" style={{color: '#A9A9A9'}}>
                      {totalRating == 0 ? ` (10)` : t(` (${totalRating})`)}
                    </AppText>
                  </AppText>
                </View>
              </View>
            ) : null}
            <View style={styles.mainTagView}>
              <TouchableOpacity
                onPress={() => {
                  let dataForLog = Object.assign(
                    {
                      groupCode: groupCode,
                      serialNo: index + 1,
                    },
                    logEventsData
                  );
                  isHomeScreen
                    ? LogFBEvent(Events.HOME_OFFER_TITLE_CLICK, dataForLog)
                    : LogFBEvent(Events.eventTitle, dataForLog);
                  onBooking && onBooking(item, index);
                }}>
                <View style={{flexDirection: 'row'}}>
                  {
                    <View style={styles.innerTag}>
                      {!coin && item.offerinvocations ? (
                        <Tag
                          strikeThru={false}
                          price={item.offerinvocations.offerPrice}
                          textColor={Colors.blue}
                          titleStyle={{fontWeight: 'bold'}}
                          priceStyle={{
                            fontWeight: 'bold',
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
                </View>
              </TouchableOpacity>
            </View>

            {!withoutButton && (
              <View style={[styles.buttonMainView]}>
                {!isOutOfStock ? (
                  <View style={styles.shareBox}>
                    <TouchableOpacity onPress={shareOffer}>
                      <View style={styles.whatsappCircle}>
                        <Icon
                          type="font-awesome"
                          name="whatsapp"
                          color={Constants.white}
                          size={widthPercentageToDP(6)}
                          containerStyle={{
                            alignSelf: 'center',
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{width: widthPercentageToDP(6)}}></View>
                )}

                <View style={{alignItems: 'center', flex: 1}}>
                  <View style={{width: widthPercentageToDP(30)}}>
                    <LinearGradientButton
                      stockValue={stockValue}
                      notQuantityText
                      checkOutOfStock={checkOutOfStock}
                      offerId={item.parentId || item.id}
                      item={item}
                      screenName={screen}
                      cartButton={isFreeGiftCategoryItem ? false : true}
                      btnStyles={[
                        {
                          flexDirection: 'row',
                        },
                      ]}
                      titleStyle={{color: 'white'}}
                      isBoderOnly={false}
                      colors={['#fdc001', '#fd7400']}
                      title={
                        isActiveCategory
                          ? t('SELECT FREE GIFT')
                          : buttons[activeCategoryTab] || t('ADD')
                          ? t('ADD')
                          : isActiveCategory
                          ? buttons[activeCategoryTab]
                          : t('ADD')
                      }
                      currencyMode={coin ? 'coins' : undefined}
                      canBuyFromCoins={coin && coinsIhave > coin}
                      onPress={() => {
                        let dataForLog = Object.assign(
                          {
                            groupCode: groupCode ? groupCode : '',
                            serialNo: index + 1,
                          },
                          logEventsData
                        );
                        LogFBEvent(
                          Events.HOME_OFFER_BUY_BUTTON_CLICK,
                          dataForLog
                        );
                        onBooking(item, index);
                        //  : handleBottomAction(item, index);
                      }}>
                      {isActiveCategory &&
                      preference === 'CLAIMED' &&
                      item.id == bookedGiftId ? (
                        <Image
                          source={Images.selected}
                          style={styles.iconImage}
                        />
                      ) : null}
                    </LinearGradientButton>
                  </View>
                </View>
              </View>
            )}

            {coin ? (
              <View
                style={{
                  marginVertical: heightPercentageToDP(0.3),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={Images.coin}
                  style={{
                    height: scaledSize(16),
                    width: scaledSize(16),
                    top: heightPercentageToDP(0.3),
                  }}
                />
                <View
                  style={{
                    marginLeft: widthPercentageToDP(1),
                    marginTop: heightPercentageToDP(0.3),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <AppText
                    size="XXS"
                    bold
                    style={{
                      color: '#fa6400',
                    }}>
                    {t('FREE WITH')}
                  </AppText>
                  <AppText
                    style={{
                      color: '#fa6400',
                      marginLeft: widthPercentageToDP(1),
                      letterSpacing: widthPercentageToDP(0.5),
                    }}
                    bold
                    size="XS">
                    {t(`${coin} COINS`)}
                  </AppText>
                </View>
              </View>
            ) : (
              <View style={styles.noCoinView} />
            )}
          </View>
        </View>
        {marker && trustMarker ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: heightPercentageToDP(2),
            }}>
            <FlatList
              horizontal
              data={trustMarker}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{width: widthPercentageToDP(35)}}
              renderItem={trustMarkerRenderLogo}
            />
            <FlatList
              horizontal
              data={trustMarker}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                marginLeft: widthPercentageToDP(1),
                width: widthPercentageToDP(65),
              }}
              renderItem={({item, index}) =>
                trustMarkerRender(item, index, trustMarker.length)
              }
            />
          </View>
        ) : null}
      </View>
      {isModalOpen && (
        <VideoModal
          visible={isModalOpen}
          toggleModal={toggle}
          videoUri={videoUri}
          header={item.mediaJson.title.text}
          onClose={() => {
            const dataForLog = Object.assign(
              {
                groupCode: groupCode,
                timeTaken: new Date() - startVideoTime,
              },
              logEventsData
            );
            !isHomeScreen
              ? LogFBEvent(eventVideo, dataForLog)
              : LogFBEvent(Events.HOME_OFFER_IMAGE_VIDEO_CLICK, dataForLog);
            onBooking && onBooking(item, index);
          }}
        />
      )}
      {openImageModal && (
        <ImageModal
          visible={openImageModal}
          toggleModal={openModal}
          images={item.mediaJson}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: widthPercentageToDP(4),
    paddingVertical: heightPercentageToDP(2),
  },
  shareBox: {
    //zIndex: 1,
    // position: 'absolute',
    bottom: heightPercentageToDP(0.5),
    //left: widthPercentageToDP(90),
    height: heightPercentageToDP(3.5),
  },
  subViewColumn: {
    //height: '20%',
    flexDirection: 'column',
  },
  subView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageView: {
    borderWidth: scaledSize(0.5),
    borderColor: '#fafafa',
    borderRadius: scaledSize(4),
    // width: widthPercentageToDP(46),
    alignItems: 'center',
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
    width: widthPercentageToDP(52),
    marginLeft: widthPercentageToDP(4),
    justifyContent: 'space-between',
  },
  innerView: {
    paddingRight: 10,
    paddingBottom: scaledSize(1),
  },
  textStyle: {
    fontSize: scaledSize(16),
    flexWrap: 'wrap',
    fontFamily: Fonts.roboto,
  },
  textStyleSmaller: {
    fontSize: scaledSize(14),
    flexWrap: 'wrap',
    fontFamily: Fonts.roboto,
  },
  mainTagView: {
    flexDirection: 'column',
    flex: 0.6,
    justifyContent: 'center',
  },
  innerTag: {
    paddingRight: widthPercentageToDP(2),
    paddingBottom: heightPercentageToDP(0.7),
  },
  countryTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaledSize(12),
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
  freeImage: {
    alignSelf: 'flex-end',
    width: widthPercentageToDP(24),
    height: heightPercentageToDP(4),
    resizeMode: 'contain',
  },
  freeView: {
    position: 'absolute',
    top: heightPercentageToDP(1),
    right: widthPercentageToDP(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileMarkerView: {
    position: 'absolute',
    bottom: heightPercentageToDP(1),
    right: widthPercentageToDP(0),
    width: widthPercentageToDP(28),
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 24,
    borderTopWidth: 24,
    borderLeftColor: 'transparent',
    borderTopColor: 'red',
  },
  buttonMainView: {
    flex: 0.2,
    flexDirection: 'row',
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
  flagIconImage: {
    height: scaledSize(15),
    width: scaledSize(15),
    resizeMode: 'contain',
    paddingRight: 0,
    marginHorizontal: scaledSize(10),
  },
  markerLogoImage: {
    height: heightPercentageToDP(5),
    width: widthPercentageToDP(14),
    resizeMode: 'contain',
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
  whatsappCircle: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
  },
  noCoinView: {
    height: heightPercentageToDP(2),
    width: widthPercentageToDP(10),
  },
});

const mapStateToProps = state => ({
  rewards: state.rewards.rewards,
  language: state.home.language,
  groupSummary: state.groupSummary,
  userPref: state.login.userPreferences,
  preference:
    state.login.userPreferences &&
    state.login.userPreferences.userCat &&
    state.login.userPreferences.userCat.fgStatus,
  bookedGiftId: !!state.booking.freeGiftProductID
    ? state.booking.freeGiftProductID
    : state.booking.bookedGiftId,
  quantity: state.booking.quantity,
  activeCategoryTab: state.home.activeCategoryTab,
  cart: state.home.cart,
  clMediumLogoImage: state.clOnboarding.clMediumLogoImage,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  updateQuantity: quantity => dispatch(QUANTITY(quantity)),
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(Listing))
);
