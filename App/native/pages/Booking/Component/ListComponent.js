import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import idx from 'idx';
import ImageModal from '../../../../components/ImageModal/ImageModal';
import VideoModal from '../../../../components/VideoModal/VideoModal';
import {Rating} from 'react-native-elements';
import {Placeholder, PlaceholderLine, Fade} from 'rn-placeholder';
import ViewMoreText from 'react-native-view-more-text';
import {withTranslation} from 'react-i18next';
import {Icon} from 'react-native-elements';
import {
  scaledSize,
  AppWindow,
  widthPercentageToDP,
  heightPercentageToDP,
  isFreeGiftCategory,
} from '../../../../utils';
import {
  getRandomArbitrary,
  getLastDigit,
  dummyRating,
} from '../../../pages/utils';
import NavigationService from '../../../../utils/NavigationService';
import Button from '../../../../components/Button/Button';
import QuantityCounter from './QuantityCounter';
import {QUANTITY} from '../../Booking/redux/actions';
import {LogFBEvent, Events, SetScreenName} from '../../../../Events';
// import OffTag from '../../../../components/Tag/OffTag';
import PriceTag from './PriceTag';
import SizeColorWeightContainer from './SizeColorWeightContainer';
import {Images} from '../../../../../assets/images';
import {AppText} from '../../../../components/Texts';
import {Constants} from '../../../../styles';
import {Fonts, Colors} from '../../../../../assets/global';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import firebase from '@react-native-firebase/app';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {packageName} from '../../../../Constants';
import {liveAnalytics} from '../../ShopgLive/redux/actions';
import {shareOfferOnWhatsApp} from '../../utils';
import {processTextAndAppendElipsis} from '../../../../utils/misc';
import {changeField} from '../../Login/actions';

const SimpleLine = () => (
  <View style={styles.lineMainView}>
    <View style={styles.lineView} />
  </View>
);

const component = 'ListComponent';

class ListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      checked: true,
      isModalOpen: false,
      setModal: false,
      startVideoTime: null,
      setStartVideoTime: null,
      startImageTime: null,
      setStartImageTime: null,
      videoUri: {},
      setVideoUri: {},
      openImageModal: false,
      setOpenImageModal: false,
      activeSlide: 0,
      activeIndex: 0,
    };
    // const [isModalOpen, setModal] = React.useState(false);
    //const [startVideoTime, setStartVideoTime] = React.useState(null);
    // const [startImageTime, setStartImageTime] = React.useState(null);
    // const [videoUri, setVideoUri] = React.useState({});
    // const [openImageModal, setOpenImageModal] = React.useState(false);
    // const isActiveCategory = activeCategoryTab === 'free-gift';
    // let logEventsData = {
    //   offerId: item.id,
    //   offerName: item.mediaJson.title.text,
    //   category: !isShopGTv ? activeCategoryTab : 'shopg-tv',
    //   offerPrice: item.offerinvocations.offerPrice,
    //   serialNo: index + 1,
    //   groupCode: '',
    // };
    this.openModal = this.openModal.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle = uri => {
    !this.state.isModalOpen
      ? this.setState({setStartVideoTime: new Date()})
      : null;
    this.setState(prevState => ({
      videoUri: uri,
      isModalOpen: !prevState.isModalOpen,
    }));
  };

  incQuantity = () => {
    let {quantity} = this.props;
    // if (quantity < 5) {
    this.props.updateQuantity(quantity + 1);
    // }
  };

  shareOffer = () => {
    const {isLoggedIn} = this.props;
    if (!isLoggedIn) {
      this.props.onChangeField('loginInitiatedFrom', 'Booking');
      NavigationService.navigate('Login', {callback: () => {}});
    } else {
      this.shareOfferCallback();
    }
  };

  shareOfferCallback = () => {
    const {
      t,
      groupSummary,
      item,
      userPref,
      screen,
      coin,
      taskId,
      clMediumLogoImage,
    } = this.props;
    let eventProps = {
      offerId: item.id,
      component: component,
      sharedBy: userPref.userMode,
      page: screen,
    };
    if (taskId) {
      eventProps['taskId'] = taskId;
    }
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };
    shareOfferOnWhatsApp(
      clMediumLogoImage,
      'Booking',
      'ListComponent',
      t,
      groupSummary,
      item,
      eventProps,
      null,
      coin,
      userPrefData
    );
    this.props.onAnalytics(
      Events.SHARE_OFFER_WHATSAPP_CLICK.eventName(),
      eventProps,
      userPrefData
    );
  };

  decQuantity = () => {
    let {quantity} = this.props;
    this.props.updateQuantity(quantity - 1);
  };

  getLang = data => {
    let returnItem = false;
    if (!data || data.length === 0) {
      return false;
    }
    data.forEach(row => {
      if (
        this.props.language &&
        row.language.toLowerCase() === this.props.language.toLowerCase()
      ) {
        returnItem = row;
      }
    });
    return returnItem;
  };

  _renderItem = ({item, index}) => {
    const images = this.props.item.mediaJson;
    const mainImageUrl = images.mainImage.url;
    const video = this.getLang(this.props.item.mediaJson.localisedVideo);
    const activeIndex = this.state.activeSlide;
    if (video && mainImageUrl === item) {
      return (
        <View style={styles.videoContainer}>
          <TouchableOpacity
            onPress={() => {
              this.toggle(video);
            }}>
            <View>
              <View
                style={styles.playIcon}
                onPress={() => {
                  this.toggle(video);
                }}>
                <Image source={Images.youtube} style={styles.iconImage} />
              </View>
              <View style={styles.videoView}>
                <Image
                  key={index}
                  source={{uri: item}}
                  style={styles.imageStyle}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this.openModal(activeIndex)}>
          <View style={styles.videoView}>
            <Image key={index} source={{uri: item}} style={styles.imageStyle} />
          </View>
        </TouchableOpacity>
      );
    }
    // return <MySlideComponent key={index} data={item} />;
  };

  handleClick = (item, video, index) => {
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
        LogFBEvent(Events.HOME_OFFER_IMAGE_CLICK, dataForLog);
      }
    } else {
      // setStartVideoTime(new Date());
      this.toggle(video);
    }
  };

  openModal = activeIndex => {
    this.setState(prevState => ({
      openImageModal: !prevState.openImageModal,
      activeIndex: activeIndex,
    }));
  };

  onSizePress = (index, size) => {
    const {dispatch} = this.props;
    dispatch({type: 'booking/SET_STATE', payload: {selectedSize: size}});
  };

  onColorPress = (index, color) => {
    const {dispatch} = this.props;
    dispatch({type: 'booking/SET_STATE', payload: {selectedColor: color}});
  };

  render() {
    let {
      item,
      index,
      groupCode,
      isGroupUnlocked,
      withoutButton,
      withoutTag,
      onBooking,
      sourceComponent,
      handleBottomAction,
      activeCategoryTab,
      unlockCoins,
      cashback,
    } = this.props;
    let {
      preference,
      withCounter,
      updateQuantity,
      quantity,
      isMultiImage,
      isLast,
      isBooking,
      screen,
      ratings,
      onPressRatings,
      isEntity,
      t,
    } = this.props;
    const {openImageModal, isModalOpen} = this.state;
    const video = this.getLang(item.mediaJson.localisedVideo);
    const images = item.mediaJson;
    const mainImageUrl = images.mainImage.url;
    const {description} = images;
    const sizes =
      (item.sizeColourWeight && item.sizeColourWeight.size) || item.sizes;

    const colours =
      (item.sizeColourWeight && item.sizeColourWeight.colour) || item.colours;

    const isFreeGiftCategoryItem = isFreeGiftCategory(item);
    let ratingValue =
      ratings && ratings.rating
        ? ratings.rating
        : dummyRating[getLastDigit(item.id)];
    let totalRating =
      ratings && ratings.totalRating
        ? ratings.totalRating
        : getLastDigit(item.id);
    let imageGallery = images.gallery ? images.gallery.map(img => img.url) : [];
    imageGallery.unshift(mainImageUrl);

    let logEventsData = {
      offerId: item.id,
      offerName: item.mediaJson.title.text,
      category: activeCategoryTab,
      offerPrice: item.offerinvocations.offerPrice,
      serialNo: index + 1,
    };
    return (
      <View elevation={1} style={{marginTop: 15}} pointerEvents={'auto'}>
        <View style={styles.container}>
          <View style={styles.subView}>
            <View style={styles.imageView}>
              {coin && !isFreeGiftCategoryItem ? (
                <View
                  style={{
                    flexDirection: 'column',
                    marginLeft: widthPercentageToDP(55),
                    marginTop: heightPercentageToDP(0.5),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
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
                      }}>
                      {t(`${coin} COINS `)}
                    </AppText>
                  </View>
                  <AppText
                    size="XS"
                    style={{
                      color: '#989696',
                      paddingLeft: widthPercentageToDP(2.5),
                    }}>
                    {t(' Share & Earn')}
                  </AppText>
                </View>
              ) : null}
              {/* <Button
                onPress={() => {
                  !isBooking
                    ? handleClick(item, video, index)
                    : this.openModal();
                }}> */}
              {/* <Image source={{uri: "https://cms.shopg.in/wp-content/uploads/2019/12/Artboard-1.jpg"}} style={{ height: heightPercentageToDP(20), width: '100%', resizeMode: 'contain'}} /> */}
              <Carousel
                data={imageGallery}
                renderItem={this._renderItem}
                onSnapToItem={index => this.setState({activeSlide: index})}
                sliderWidth={AppWindow.width}
                sliderHeight={AppWindow.height / 2}
                itemWidth={AppWindow.width - 60}
                layout="default"
                loop
                autoplay
                autoplayDelay={2000}
                autoplayInterval={2000}
              />
              {/* </Button> */}
              {/* {video && (
                <Icon
                  onPress={() => {
                    this.toggle(video);
                  }}
                  style={styles.playIcon}
                  hitslop={{top: 5, right: 5, left: 5, bottom: 5}}
                  type={'Feather'}
                  name={'youtube'}
                  fontSize={20}
                />
              )} */}
              {/* {isMultiImage && (
                <Button
                  onPress={this.openModal}
                  styleContainer={styles.multiImageButton}>
                  <Icon name={'view-carousel'} type={'MaterialIcons'} />
                </Button>
              )} */}
            </View>
            <View style={styles.shareBox}>
              <TouchableOpacity onPress={this.shareOffer}>
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
          </View>
          <View>
            <TouchableOpacity
              onPress={onPressRatings}
              style={{
                flexDirection: 'row',
                marginLeft: widthPercentageToDP(2),
              }}>
              <Rating
                count={5}
                imageSize={20}
                ratingColor={'#dda50b'}
                readonly
                startingValue={ratingValue}
                fractions="{1}"
              />
              <View style={{marginLeft: widthPercentageToDP(2)}}>
                <AppText>
                  {t(`${ratingValue}`)}
                  <AppText style={{color: '#A9A9A9'}}>
                    {totalRating == 0 ? ` (10)` : t(` (${totalRating})`)}
                  </AppText>
                </AppText>
              </View>
            </TouchableOpacity>
            <View style={styles.textView}>
              <AppText numberOfLines={2} style={styles.textStyle}>
                {t(item.mediaJson.title.text)}
              </AppText>
              {unlockCoins && sourceComponent === 'ClaimCoins' ? (
                <View
                  style={{
                    flex: 0.75,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginRight: widthPercentageToDP(3),
                  }}>
                  <Image
                    source={Images.coin}
                    style={{
                      width: scaledSize(17),
                      height: scaledSize(17),
                      top: heightPercentageToDP(1),
                      marginRight: widthPercentageToDP(2),
                    }}
                  />
                  <View>
                    <AppText size="XS" bold style={{color: '#fa6400'}}>
                      {t('FREE WITH')}
                    </AppText>
                    <AppText bold style={{color: '#fa6400'}}>
                      {t(`${unlockCoins} COINS`)}
                    </AppText>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 0.75,
                    marginLeft: widthPercentageToDP(2),
                  }}>
                  {cashback && !isFreeGiftCategoryItem ? (
                    <View style={{flex: 0.35}}>
                      <AppText
                        size="XS"
                        bold
                        style={{color: '#ec3d5a', textAlign: 'center'}}>
                        {t('Cashback')}
                      </AppText>
                      <AppText
                        size="M"
                        bold
                        style={{color: '#ec3d5a', textAlign: 'center'}}>
                        {t(`${cashback}%`)}
                      </AppText>
                    </View>
                  ) : null}
                  <View style={{flex: 0.25}}>
                    <PriceTag
                      title={'MRP'}
                      strikeThru={true}
                      price={item.offerinvocations.price || 0}
                      textColor={'#989696'}
                      t={t}
                      titleStyle={{fontSize: 14}}
                      priceStyle={{fontSize: 12}}
                      isGroupScreen={false}
                    />
                  </View>
                  <View style={{flex: 0.25}}>
                    <PriceTag
                      title={'Offer'}
                      strikeThru={false}
                      price={item.offerinvocations.offerPrice}
                      textColor={Colors.blue}
                      titleStyle={{fontWeight: 'bold', fontSize: 16}}
                      priceStyle={{fontWeight: 'bold', fontSize: 12}}
                      t={t}
                      isGroupScreen={false}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={styles.mainView}>
            <View style={styles.description}>
              <View>
                <ViewMoreText
                  textStyle={{textAlign: 'left'}}
                  renderViewMore={handlePress => (
                    <Button onPress={handlePress}>
                      <AppText style={styles.readMoreText}>
                        {t('Read More')}
                      </AppText>
                    </Button>
                  )}
                  renderViewLess={handlePress => (
                    <Button onPress={handlePress}>
                      <AppText style={styles.readMoreText}>
                        {t('Show Less')}
                      </AppText>
                    </Button>
                  )}
                  numberOfLines={2}>
                  <AppText style={styles.textStyle}>
                    {t(description.text ? description.text : '')}
                  </AppText>
                </ViewMoreText>
              </View>
            </View>
            {withCounter && (
              <View style={styles.buttonMainView}>
                <QuantityCounter
                  activeCategoryTab={activeCategoryTab}
                  decQuantity={this.decQuantity}
                  incQuantity={this.incQuantity}
                  groupCode={groupCode}
                  offerId={item.id}
                  local={true}
                  isPDP
                />
              </View>
            )}
          </View>

          <SizeColorWeightContainer
            t={t}
            showSize={withCounter && sizes && sizes.length > 0}
            sizes={sizes}
            onSizePress={this.onSizePress}
            sizeHeader={'Select Size'}
            showColor={withCounter && colours && colours.length > 0}
            colorHeader={'Select Colour'}
            colours={colours}
            onColorPress={this.onColorPress}
          />

          {isEntity && (
            <View>
              <LinearGradientButton
                btnStyles={styles.actionBtn}
                gradientStyles={{margin: scaledSize(4)}}
                colors={['#ff8648', '#dc4d04']}
                title={t('BUY NOW')}
                onPress={() => {
                  onBooking && onBooking(item, 0);
                }}
              />
            </View>
          )}
        </View>
        {isModalOpen && (
          <VideoModal
            visible={isModalOpen}
            toggleModal={this.toggle}
            videoUri={this.state.videoUri}
            header={item.mediaJson.title.text}
            onClose={() => {
              let timeTaken = new Date() - this.state.setStartVideoTime;
              const dataForLog = Object.assign(
                {
                  timeTaken: timeTaken,
                },
                logEventsData
              );
              this.toggle();
              onBooking && onBooking(item, index);
              LogFBEvent(Events.PDP_OFFER_VIDEO_CLICK, dataForLog);
            }}
          />
        )}
        {openImageModal && (
          <ImageModal
            visible={openImageModal}
            toggleModal={this.openModal}
            images={item.mediaJson}
            index={this.state.activeIndex}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 2,
  },
  actionBtn: {
    borderRadius: 8,
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    height: heightPercentageToDP(6),
  },
  subView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageView: {
    width: widthPercentageToDP(95),
    height: heightPercentageToDP(50),
    alignItems: 'center',
    // backgroundColor: Constants.primaryColor
  },
  shareBox: {
    position: 'absolute',
    bottom: heightPercentageToDP(45),
    left: widthPercentageToDP(88),
    right: 0,
    height: scaledSize(37),
  },
  whatsappCircle: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
  },
  mainView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: widthPercentageToDP(2),
    marginBottom: widthPercentageToDP(2),
  },
  description: {
    flex: 1,
  },
  readMoreText: {
    fontSize: scaledSize(14),
    color: Colors.orange,
    fontWeight: '500',
    fontFamily: Fonts.roboto,
  },
  shorterImage: {
    height: scaledSize(60),
    width: scaledSize(100),
    resizeMode: 'contain',
  },
  image: {
    height: scaledSize(150),
    // width: scaledSize(150),
    resizeMode: 'contain',
  },
  shopGTvImage: {
    height: scaledSize(220),
    width: scaledSize(150),
    resizeMode: 'contain',
  },
  textView: {
    //width: widthPercentageToDP(53),

    flex: 1,
    flexDirection: 'row',
    padding: scaledSize(5),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innerView: {
    paddingBottom: 5,
    flex: 0.6,
    backgroundColor: Constants.primaryColor,
  },
  textStyle: {
    fontSize: scaledSize(16),
    flexWrap: 'wrap',
    fontFamily: Fonts.roboto,
    flex: 0.5,
    padding: scaledSize(5),
  },
  textStyleSmaller: {
    fontSize: scaledSize(14),
    flexWrap: 'wrap',
    fontFamily: Fonts.roboto,
  },
  mainTagView: {
    flexDirection: 'row',
    backgroundColor: Constants.primaryColor,
  },
  innerTag: {
    width: widthPercentageToDP(53),
    // alignItems: 'flex-start',
    // paddingHorizontal: 12,
    flex: 0.2,
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
    flex: 0.4,
    marginTop: 10,
    height: 30,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
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
    zIndex: 1,
    position: 'absolute',
    top: heightPercentageToDP(18),
    bottom: 0,
    left: widthPercentageToDP(35),
    right: 0,
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
  lineMainView: {width: '100%', alignItems: 'center'},
  videoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  videoView: {
    // opacity: 0.8,
    borderRadius: 5,
    height: AppWindow.height / 2,
    width: AppWindow.width - 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  imageStyle: {
    height: heightPercentageToDP(100),
    width: AppWindow.width - 60,
    resizeMode: 'contain',
  },
  iconImage: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(12),
    resizeMode: 'contain',
  },
  sizeStyle: {
    marginHorizontal: widthPercentageToDP(2),
    marginBottom: widthPercentageToDP(2),
    height: heightPercentageToDP(8),
    flexDirection: 'column',
  },
  pickerHeader: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: heightPercentageToDP(2),
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  pickerStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: heightPercentageToDP(6),
    flexDirection: 'row',
  },
});

const mapStateToProps = state => ({
  language: state.home.language,
  userPref: state.login.userPreferences,
  preference:
    state.login.userPreferences &&
    state.login.userPreferences.userCat &&
    state.login.userPreferences.userCat.fgStatus,
  quantity: state.booking.quantity,
  activeCategoryTab: state.home.activeCategoryTab,
  cart: state.home.cart,
  groupSummary: state.groupSummary,
  clMediumLogoImage: state.clOnboarding.clMediumLogoImage,
  isLoggedIn: state.login.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  updateQuantity: quantity => dispatch(QUANTITY(quantity)),
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ListComponent)
);
