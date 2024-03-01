import React, {memo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
//import Share from 'react-native-share';
import {getTrustMarkerLabel, getProfileMarkerLabel} from '../../utils';
import ViewMoreText from 'react-native-view-more-text';
import idx from 'idx';
import firebase from '@react-native-firebase/app';
import Tag from '../../../../components/Tag/Tag';
import {Colors, Fonts} from '../../../../../assets/global';
import {liveAnalytics} from '../../ShopgLive/redux/actions';
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
//import RNFetchBlob from 'rn-fetch-blob';
import {Rating} from 'react-native-elements';
import {shareOfferOnWhatsApp} from '../../utils';
import {packageName} from '../../../../Constants';
import ShopgLive from '../../ShopgLive/ShopgLive';
import {processTextAndAppendElipsis} from '../../../../utils/misc';
import {FlatList} from 'react-native-gesture-handler';
import {changeField} from '../../Login/actions';
import NavigationService from '../../../../utils/NavigationService';

const buttons = {
  CLAIMED: 'BUY NOW',
  REPEAT: 'repeat',
  'free-gift': 'SELECT FREE GIFT',
};

const ListComponent = ({
  item,
  index,
  groupCode,
  uniqueKey,
  withoutButton,
  withoutTag,
  onBooking,
  categoryTab,
  shopglive,
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
  containerEntity,
  containerEntityOffers,
  isTwoItemRow,
  numberOfLinesEntity,
  eventVideo,
  onAnalytics,
  onChangeField,
  handleVideoClick,
  withoutShopglive,
  handleScratchCardSwipe,
  clMediumLogoImage,
  isLoggedIn,
}) => {
  const component = 'ListComponent';
  const [isModalOpen, setModal] = React.useState(false);
  const [startVideoTime, setStartVideoTime] = React.useState(null);
  const [startImageTime, setStartImageTime] = React.useState(null);
  const [videoUri, setVideoUri] = React.useState({});
  const [openImageModal, setOpenImageModal] = React.useState(false);

  let cashback = null, coin = null, taskId = null;
  
  let {ratings} = item;
  let ratingValue =
    ratings && ratings.rating
      ? ratings.rating
      : dummyRating[getLastDigit(item.id)];
  let totalRating =
    ratings && ratings.totalRating
      ? ratings.totalRating
      : getLastDigit(item.id);
  cashback = idx(item.categoryFeatures, _ => _.cashback);
  coin = idx(item.categoryFeatures, _ => _.shareCoins);
  taskId = idx(item.categoryFeatures, _ => _.taskId);

  let logEventsData = {
    offerId: item.id,
    offerName: item.mediaJson.title.text,
    category: categoryTab,
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
    if (!isLoggedIn) {
      onChangeField('loginInitiatedFrom', screen);
      NavigationService.navigate('Login', {callback: () => {}});
    } else {
      shareOfferCallback();
    }
  };

  const shareOfferCallback = () => {
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };
    let eventProps = {
      offerId: item.id,
      sharedBy: userPref.userMode,
      category: categoryTab,
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
      'Home',
      'ListComponent',
      t,
      groupSummary,
      item,
      eventProps,
      null,
      coin,
      userPrefData
    );
    onAnalytics(
      Events.SHARE_OFFER_WHATSAPP_CLICK.eventName(),
      eventProps,
      userPrefData
    );
  };

  const userMode = userPref && userPref.userMode;
  let isCLMode = userMode === 'CL' ? true : false;
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

  let indexRelevantCompoenents;
  // if (relevantLiveComponents.length > 0) {
  //   indexRelevantCompoenents = relevantLiveComponents.filter(item => {
  //     if (
  //       item.data.categoryPositions &&
  //       item.data.categoryPositions[categoryTab]
  //     ) {
  //       return item.data.categoryPositions[categoryTab].includes(
  //         index.toString()
  //       );
  //     }
  //     return false;
  //   });
  // }

  const isOutOfStock = checkOutOfStock && stockValue < 1;
  let isPaddingRightZero =
    (marker && profileMarker) || item.offerinvocations.offerPrice === 0;
  return (
    <View
      elevation={1}
      style={[{marginTop: 0}, containerEntity, containerEntityOffers]}
      pointerEvents={'auto'}>
      {!withoutShopglive ? (
        <View style={{marginBottom: heightPercentageToDP(2)}}>
          <ShopgLive
            isCLMode={isCLMode}
            index={index}
            screenName={screen ? screen : 'Home'}
            activeCategoryTab={categoryTab}
            handleScratchCardSwipe={handleScratchCardSwipe}
            liveComponentsData={indexRelevantCompoenents}
          />
        </View>
      ) : (
        <View style={{marginBottom: heightPercentageToDP(2)}} />
      )}
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
            <View
              style={[styles.profileMarkerView, {borderTopColor: '#fa6400'}]}
            />
            <View>
              <AppText
                white
                medium
                bold
                size="XS"
                style={{
                  marginBottom: heightPercentageToDP(1.5),
                  marginLeft: widthPercentageToDP(77),
                }}>
                {t('Free Gift')}
              </AppText>
            </View>
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
              {!withoutTag && item.offerinvocations && (
                <OffTag
                  title={'OFF'}
                  price={
                    item.offerinvocations.price -
                      item.offerinvocations.offerPrice || 0
                  }
                  t={t}
                  styleExtra={{}}
                />
              )}
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
              {/* <ImageBackground
                source={{uri: item.mediaJson.mainImage.url}}
                style={[
                  styles.image,
                  shopGTvImage,
                  entityImage,
                  entityOffersImage,
                ]}>

              </ImageBackground> */}
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
            {cashback && !isFreeGiftCategoryItem ? (
          <View
            style={{marginTop: heightPercentageToDP(3), flexDirection: 'row', justifyContent: 'flex-end'}}>
            {/* <Image
              source={Images.cashback_on_offer}
              style={{
                height: scaledSize(14),
                width: scaledSize(26),
                top: heightPercentageToDP(0.2),
              }}
            /> */}
            <AppText
              size="XS"
              bold
              style={{color: '#00a02b', paddingLeft: widthPercentageToDP(2)}}>
              {t(`Get Extra ${cashback}% Cashback`)}
            </AppText>
          </View>
        ) : null}
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
            <View
              style={{
                flexDirection: 'row',
                marginTop: heightPercentageToDP(1.6),
              }}>
              <Rating
                count={5}
                imageSize={14}
                ratingColor={'#dda50b'}
                readonly
                startingValue={ratingValue}
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
                      {item.offerinvocations ? (
                        <Tag
                          strikeThru={false}
                          price={item.offerinvocations.offerPrice}
                          textColor={Colors.black}
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

                  <View style={{width: widthPercentageToDP(25)}}>
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
                      titleStyle={{color: 'white', textAlign: 'center'}}
                      isBoderOnly={false}
                      colors={['#fdc001', '#fd7400']}
                      title={
                        isFreeGiftCategoryItem ? t('Select Gift') : t('ADD')
                      }
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
                      }}></LinearGradientButton>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {!withoutButton && (
              <View style={[styles.buttonMainView]}>
                {!isOutOfStock && !isFreeGiftCategoryItem ? (
                  <View style={styles.shareBox}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: heightPercentageToDP(1)
                      }}>
                      <Image
                        source={Images.coin}
                        style={{
                          height: scaledSize(16),
                          width: scaledSize(16),
                          top: heightPercentageToDP(0.3),
                        }}
                      />
                      <AppText
                        size="XS"
                        bold
                        style={{
                          color: '#fa6400',
                          paddingLeft: widthPercentageToDP(0.5),
                          paddingTop: widthPercentageToDP(1),
                        }}>
                        {t(`${coin} COINS `)}
                      </AppText>
                    </View>
                    <TouchableOpacity onPress={shareOffer}>
                      <View style={styles.shareContainer}>
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
                        <AppText size="S" black>Share & Earn</AppText>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{width: widthPercentageToDP(6)}}></View>
                )}
                <View style={{alignItems: 'center', flex: 1}}>
                </View>
              </View>
            )}
          </View>
        </View>
        {/* {marker && trustMarker ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              //marginTop: heightPercentageToDP(2),
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
        ) : null} */}
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
    flexDirection: 'row',
    bottom: heightPercentageToDP(0.5),
    //left: widthPercentageToDP(90),
    height: heightPercentageToDP(3.5),
    marginLeft: widthPercentageToDP(16)
  },
  shareContainer: {
    flexDirection: 'row',
    backgroundColor: Constants.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: scaledSize(0.5),
    borderColor: '#1ad741',
    padding: widthPercentageToDP(1),
  },
  shareContainer: {
    flexDirection: 'row',
    backgroundColor: Constants.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: scaledSize(0.5),
    borderColor: '#1ad741',
    padding: widthPercentageToDP(1),
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
    paddingTop: heightPercentageToDP(0.8),
    paddingBottom: heightPercentageToDP(1.4),
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
    //alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: widthPercentageToDP(2)
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
    width: scaledSize(25),
    height: scaledSize(25),
    borderRadius: 25 / 2,
  },
});

const mapStateToProps = state => ({
  language: state.home.language,
  groupSummary: state.groupSummary,
  userPref: state.login.userPreferences,
  clMediumLogoImage: state.clOnboarding.clMediumLogoImage,
  isLoggedIn: state.login.isLoggedIn,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
});

function keyAreEqual(prevProps, nextProps) {
  return prevProps.uniqueKey === nextProps.uniqueKey;
}

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(ListComponent, keyAreEqual))
);

