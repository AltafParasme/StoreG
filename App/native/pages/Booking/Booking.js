import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  FlatList,
  Image,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {getTrustMarkerLabel} from '../utils';
import RatingsDetails from './Component/RatingsDetails';
import RNFetchBlob from 'rn-fetch-blob';
import {Icon} from 'react-native-elements';
import Share from 'react-native-share';
import firebase from '@react-native-firebase/app';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import idx from 'idx';
import {Placeholder, PlaceholderLine, Fade} from 'rn-placeholder';
import {withTranslation} from 'react-i18next';
import ListComponent from './Component/ListComponent';
import HorizontalComponent from './Component/HorizontalComponent';
import TrustMarker from '../CartDetail/Component/TrustMarker';
import {Images} from '../../../../assets/images';
import BookingTotalText from './Component/BookingTotalText';
import ReturnPolicy from './Component/ReturnPolicy';
import AddressFormContainer from './form/AddressFormContainer';
import {Colors, Fonts} from '../../../../assets/global';
import LinearGradientButton from '../../../components/Button/LinearGradientButton';
import VideoReviews from './Component/VideoReviews';
import {
  scaledSize,
  AppWindow,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../utils';
import AddressList from './Component/AddressList';
import NavigationService from '../../../utils/NavigationService';
import {BOOK_PRODUCT, QUANTITY, SET_STATE} from './redux/actions';
import {changeField} from '../Login/actions';
import {getOfferDetails} from '../PastOrders/actions';
import {UpdateCart} from '../Home/redux/action';
import {isFreeGiftCategory} from '../../../utils';
import {processTextAndAppendElipsis} from '../../../utils/misc';
import {Header} from '../../../components/Header/Header';
import Button from '../../../components/Button/Button';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import {AppText} from '../../../components/Texts';
import RBSheet from 'react-native-raw-bottom-sheet';
import SizeColorWeightContainer from './Component/SizeColorWeightContainer';
import {Constants} from '../../../styles';
import SimilarProducts from './SimilarProducts';
import AddressTab from './Component/TabComponent';
import {packageName} from '../../../Constants';
import {showToastr} from '../utils';


const SimpleLine = () => (
  <View style={styles.lineMainView}>
    <View style={styles.lineView} />
  </View>
);

class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      selectedSizeIndex: -1,
      onUpdateAddress: false,
      shouldScrollToEnd: true,
    };
    this.scroll = null;
    this.tabComponent = React.createRef();
    this.RBSheet = null;
    this.scrollToEnd = this.scrollToEnd.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.handleOtherItemClick = this.handleOtherItemClick.bind(this);
    this.startTimeM = '';
    this.durationM = '';
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (!nextProps.addressLoading) {
      if (nextProps.address.length < 1) {
        // this.scroll.scrollToEnd();
      }
    }
  };

  componentDidMount = () => {
    const {dispatch, navigation} = this.props;
    const actionId = navigation.getParam('actionId');
    if (actionId) {
      dispatch({type: 'PASTORDERS/GET_OFFER_DETAILS', data: {id: actionId}});
      dispatch({type: 'booking/GET_ENTITY_DETAILS', data: actionId});
    }

    console.log('props in mount are ', this.props);

    // removed previous selected size
    dispatch({type: 'booking/SET_STATE', payload: {selectedSize: ''}});

    this.durationM = new Date().getTime() - this.startTimeM;
    let offerId = this.props.booking && this.props.booking.id;
    let offerName = this.props.booking && this.props.booking.name;
    SetScreenName(Events.LOAD_PDP_SCREEN.eventName());
    LogFBEvent(Events.LOAD_PDP_SCREEN, {
      timeTaken: this.durationM,
      offerId: offerId,
      offerName: offerName,
    });
  };

  onSizePress = (index, size) => {
    const {dispatch} = this.props;
    dispatch({type: 'booking/SET_STATE', payload: {selectedSize: size}});

    this.closeSizeColorWeightSheet(true, size, false, '');
  };

  onColorPress = (index, color) => {
    const {dispatch} = this.props;
    dispatch({type: 'booking/SET_STATE', payload: {selectedColor: color}});

    this.closeSizeColorWeightSheet(false, '', true, color);
  };

  closeSizeColorWeightSheet = (size, _selectedSize, color, _selectedColor) => {
    let selectedSize = '';
    let selectedColor = '';
    if (size) {
      selectedSize = _selectedSize;
    } else {
      selectedSize = this.props.selectedSize;
    }

    if (color) {
      selectedColor = _selectedColor;
    } else {
      selectedColor = this.props.selectedColor;
    }

    const {booking} = this.props;

    const sizes =
      (booking.sizeColourWeight && booking.sizeColourWeight.size) ||
      booking.sizes;
    const showSize = sizes && sizes.length > 0;

    const colours =
      (booking.sizeColourWeight && booking.sizeColourWeight.colour) ||
      booking.colours;

    const showColor = colours && colours.length > 0;

    if (showSize && showColor) {
      if (selectedSize !== '' && selectedColor !== '') {
        this.handleCloseBottomSheet();
      }
    } else {
      this.handleCloseBottomSheet();
    }
  };

  componentDidUpdate(prevProps) {
    const {dispatch} = this.props;
    if (
      this.props.booking &&
      this.props.booking.offerinvocations &&
      !this.props.entityDetailsApiLoading &&
      (Object.keys(this.props.entityDetails).length === 0 ||
        (Object.keys(prevProps.entityDetails).length > 0 &&
          Object.keys(this.props.booking).length > 0 &&
          prevProps.entityDetails.detail.id !==
            this.props.booking.offerinvocations.id))
    ) {
      dispatch({
        type: 'booking/GET_ENTITY_DETAILS',
        data: {
          entityId: this.props.booking.offerinvocations.offerId,
          entityType: 'offers',
        },
      });
    }

    if (this.props.refreshScreen) {
      dispatch({type: 'booking/SET_STATE', payload: {refreshScreen: false}});
      this.scrollToTop();
    }
  }

  scrollToEnd = () => {
    this.scroll && this.scroll.scrollTo({y: scaledSize(AppWindow.height)});
  };

  scrollToTop = () => {
    this.scroll && this.scroll.scrollTo({y: scaledSize(0)});
  };

  onChangeTab = tab => {
    this.setState({
      currentTab: tab,
    });
  };

  handleChange = (value, name) => {
    this.setState(prev => ({
      form: {
        ...prev.form,
        [name]: value,
      },
    }));
  };

  incQuantity = () => {
    const {updateQuantity, quantity, activeCategoryTab} = this.props;
    if (activeCategoryTab !== 'free-gift') {
      if (quantity < 50) {
        updateQuantity(quantity + 1);
      }
    }
  };

  decQuantity = () => {
    const {updateQuantity, quantity} = this.props;
    updateQuantity(quantity - 1);
  };

  componentWillMount() {
    this.startTimeM = new Date().getTime();
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'booking/SET_STATE',
      payload: {selectedSize: '', selectedColor: ''},
    });
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    NavigationService.goBack(null);
    return true;
  }

  handleBottomAction = () => {
    this.RBSheet && this.RBSheet.open();
  };

  handleCloseBottomSheet = () => {
    this.RBSheet && this.RBSheet.close();
  };

  confirmBooking = (rewardsPrice, total) => {
    let {unlockCoins, categoryFeatures} = this.props.booking;
    const item = this.props.booking;
    const stockQuantity = idx(item, _ => _.offerinvocations.quantity);
    const stockQuantityPurchased = idx(
      item,
      _ => _.offerinvocations.purchasedQuantity
    );
    const stockValue = stockQuantity - stockQuantityPurchased;

    if (stockValue < 1) {
      LogFBEvent(Events.PDP_BUY_BUTTON_CLICK_OUT_OF_STOCK, {
        offerId: this.props.booking.offerinvocations.offerId,
        serialNo: this.props.index + 1,
        groupCode: this.props.groupSummary.groupDetails.info.groupCode,
        quantity: this.props.quantity,
        orderValue: total,
      });
      showToastr(this.props.t('Currently out of stock'));
      return;
    }

    const {
      activeAddress,
      booking,
      addBookProduct,
      setReduxState,
      quantity,
      activeCategoryTab,
      selectedSize,
      selectedColor,
      dispatch,
      sourceComponent,
      launchEventDetails,
    } = this.props;

    const source = idx(launchEventDetails, _ => _.source);
    const medium = idx(launchEventDetails, _ => _.medium);
    const sizes =
      (booking.sizeColourWeight && booking.sizeColourWeight.size) ||
      booking.sizes;
    const showSize = sizes && sizes.length > 0;

    const colours =
      (booking.sizeColourWeight && booking.sizeColourWeight.colour) ||
      booking.colours;

    const showColor = colours && colours.length > 0;

    if (showSize && showColor) {
      if (selectedSize === '' || selectedColor === '') {
        this.handleBottomAction();
        return;
      }
    } else if (showSize) {
      if (selectedSize === '') {
        this.handleBottomAction();
        return;
      }
    } else if (showColor) {
      if (selectedColor === '') {
        this.handleBottomAction();
        return;
      }
    }

    if (isFreeGiftCategory(this.props.booking)) {
      if (!this.state.currentTab && Object.keys(activeAddress).length) {
        const bookingData = {
          name: this.props.booking.mediaJson.title.text,
          addressId: activeAddress.id,
          quantity: quantity,
          useRewards: rewardsPrice,
          offerId: booking.offerinvocations.offerId,
          invocationId: booking.offerinvocations.id,
          category: activeCategoryTab,
          orderAmount: total,
          size: selectedSize,
          colour: selectedColor,
          weight: '',
          utmSource: source,
          utmMedium: medium,
        };

        addBookProduct(bookingData);
      } else {
        let booking = this.props.booking;
        booking['useRewards'] = rewardsPrice;
        booking['orderAmount'] = total;
        booking['utmSource'] = source;

        setReduxState(booking);
        // dispatch({type: 'booking/SET_STATE', payload: { booking: booking } });

        this.tabComponent &&
          this.tabComponent.current &&
          this.tabComponent.current.wrappedInstance &&
          this.tabComponent.current.wrappedInstance.addAddressButton &&
          this.tabComponent.current.wrappedInstance.addAddressButton.current &&
          this.tabComponent.current.wrappedInstance.addAddressButton.current
            .wrappedInstance &&
          this.tabComponent.current.wrappedInstance.addAddressButton.current.wrappedInstance.onUpdateAddress();
      }
      LogFBEvent(Events.PDP_BUY_BUTTON_CLICK, {
        offerId: this.props.booking.offerinvocations.offerId,
        serialNo: this.props.index + 1,
        groupCode: this.props.groupSummary.groupDetails.info.groupCode,
        quantity: this.props.quantity,
        orderValue: total,
      });
    } else {
      const offerid = booking.offerinvocations.offerId;
      let currencyMode =
        unlockCoins && sourceComponent === 'ClaimRewards' ? 'coins' : null;
      this.props.updateCart(
        offerid,
        quantity,
        selectedSize,
        selectedColor,
        currencyMode,
        source,
        medium
      );
      NavigationService.navigate('CartDetail');
      LogFBEvent(Events.ADD_TO_CART_BUTTON_CLICK, {
        offerid: offerid,
        quantity: quantity,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        screenName: 'pdp',
      });
    }
  };

  onCheck = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  handleOtherItemClick = item => {
    const {dispatch} = this.props;
    LogFBEvent(Events.PDP_SIMILAR_ITEM_CLICK);
    dispatch({
      type: 'booking/SET_STATE',
      payload: {
        refreshScreen: true,
        booking: item,
        quantity: 1,
      },
    });
  };

  videoClick = index => {
    const {booking, dispatch} = this.props;

    let listToShow = [];
    listToShow.push(booking);
    dispatch({
      type: 'shopglive/SET_STATE',
      payload: {
        videoShowOfferList: listToShow,
        selectedVideoIndex: index,
        isReviewComponent: true,
      },
    });

    NavigationService.navigate('VerticleVideoList');
  };

  trustMarkerRenderLogo = ({item, index}) => {
    let urlString = item.name;
    return (
      <View style={{paddingRight: widthPercentageToDP(1.5)}}>
        <Image
          source={{
            uri: `https://cdn.shopg.in/icon/trust-markers/${urlString.toLowerCase()}.jpeg`,
          }}
          style={styles.markerLogoImage}
        />
      </View>
    );
  };

  onPressRatings = () => {
    const {ratings} = this.props.booking;
    ratings && ratings.topUserRating
      ? this &&
        this.scroll &&
        typeof this.scroll.scrollTo === 'function' &&
        this.scroll.scrollTo({
          y: scaledSize(AppWindow.height - heightPercentageToDP(30)),
        })
      : null;
  };

  trustMarkerRender = (item, index, len) => {
    if(item.name === 'ShopG_Certified')
      return null;
    let label = getTrustMarkerLabel(item.name);
    let comma = index < len - 1 ? ',' : null;
    return (
      <View
        style={{
          paddingRight: widthPercentageToDP(1.4),
          marginTop: heightPercentageToDP(1),
        }}>
        <AppText size="XS">
          {label}
          {comma}
        </AppText>
      </View>
    );
  };

  onPressAddToCart = (rewardsPrice, total) => {
    const {isLoggedIn} = this.props;
    if (!isLoggedIn) {
      this.props.onChangeField('loginInitiatedFrom', 'Booking');
      NavigationService.navigate('Login', {callback: () => {
        this.confirmBooking(rewardsPrice, total);
      }});
    } else {
      this.confirmBooking(rewardsPrice, total)
    }
  }

  render() {
    if (!this.props.booking.offerinvocations) return null;
    const {quantity, rewards, initialRewardsApiCallCompleted} = this.props;
    const {
      t,
      booking,
      groupSummary,
      loading,
      activeCategoryTab,
      entityDetails,
      sourceComponent,
    } = this.props;
    const {address} = this.props;
    let cashback = null;
    let addressPresent = address.length ? true : false;
    const sizes =
      (booking.sizeColourWeight && booking.sizeColourWeight.size) ||
      booking.sizes;
    const showSize = sizes && sizes.length > 0;

    const colours =
      (booking.sizeColourWeight && booking.sizeColourWeight.colour) ||
      booking.colours;

    const showColor = colours && colours.length > 0;

    let {marker, categoryFeatures, unlockCoins, ratings} = this.props.booking;
    let trustMarker = null;
    let markerPresent = false;
    if (marker && Object.keys(marker).length) {
      markerPresent = true;
      trustMarker = marker.TrustMarker && marker.TrustMarker.slice(0, 3);
    }

    if (loading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            color="black"
            style={styles.activityIndicator}
            size="large"
          />
        </View>
      );
    }
    if (!Object.keys(booking).length > 0) return null;
    const isGroupUnlocked =
      !!groupSummary &&
      !!groupSummary.groupDetails &&
      !!groupSummary.groupDetails.info
        ? groupSummary.groupDetails.info.groupOrderAmount >=
          groupSummary.groupDetails.info.bucketLimitEnd
        : false;
    const groupCode =
      (!!groupSummary &&
        !!groupSummary.groupDetails &&
        !!groupSummary.groupDetails.info &&
        groupSummary.groupDetails.info.groupCode) ||
      '';
    const {mediaJson, offerinvocations} = booking;
    const {price, individualOfferPrice, offerPrice} = offerinvocations;
    const isFreeGiftCategoryItem = isFreeGiftCategory(booking);
    /*let total = isGroupUnlocked
      ? (offerPrice * quantity).toFixed(2)
      : (individualOfferPrice * quantity).toFixed(2); */

    let total = (offerPrice * quantity).toFixed(2);
    cashback = idx(categoryFeatures, _ => _.cashback);
    coin = idx(categoryFeatures, _ => _.shareCoins);
    taskId = idx(categoryFeatures, _ => _.taskId);
    const maxPerOrder = (rewards && rewards.maxPerOrder) || 0;
    let rewardsPrice = maxPerOrder;
    const maxRewardsForGroup = offerPrice * quantity;
    let rewardsCandidate = Math.min(maxRewardsForGroup, total);

    if (rewardsCandidate < rewardsPrice) {
      rewardsPrice = rewardsCandidate;
    }

    if (this.state.checked) {
      total = total - rewardsPrice;
    }
    rewardsPrice = parseFloat(rewardsPrice);
    const {selectedTab} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          ref={node => (this.scroll = node)}
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}>
          <ListComponent
            item={booking}
            withoutButton={true}
            //isLast={true}
            ratings={ratings}
            sourceComponent={sourceComponent}
            screen={this.props.navigation.state.routeName}
            groupCode={groupCode}
            cashback={cashback}
            coin={coin}
            onPressRatings={this.onPressRatings}
            taskId={taskId}
            unlockCoins={unlockCoins}
            isGroupUnlocked={isGroupUnlocked}
            withCounter
            quantity={quantity}
            isMultiImage
            isBooking
            selectedSize={this.props.selectedSize}
            selectedSizeIndex={this.state.selectedSizeIndex}
            index={this.props.index}
          />
          <SimpleLine />
          <View>
            <View style={styles.bookingTagView}>
              <TrustMarker />
            </View>
            {markerPresent && trustMarker ? (
              <View style={styles.markerView}>
                <FlatList
                  horizontal
                  data={trustMarker}
                  showsHorizontalScrollIndicator={false}
                  renderItem={this.trustMarkerRenderLogo}
                />
                <FlatList
                  horizontal
                  data={trustMarker}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) =>
                    this.trustMarkerRender(item, index, trustMarker.length)
                  }
                />
              </View>
            ) : null}
          </View>
          <SimpleLine />

          <View style={styles.bookingTotalText}>
            <BookingTotalText name={t('MRP')} price={price} />
            <BookingTotalText
              name={t('Offer')}
              price={offerPrice}
              saving={price - offerPrice}
            />
            <BookingTotalText
              name={t('You Pay')}
              price={activeCategoryTab == 'free-gift' ? 0 : total}
            />
          </View>

          <ReturnPolicy />

          {ratings && ratings.rating ? (
            <RatingsDetails ratings={ratings} />
          ) : null}

          {isFreeGiftCategoryItem ? (
            <View style={styles.addressView}>
              {this.props.addressListApiCompleted && (
                <AddressTab
                  onChangeTab={this.onChangeTab}
                  scrollToEnd={this.scrollToEnd}
                  ref={this.tabComponent}
                  parentComp={'Booking'}
                  t={t}
                />
              )}
            </View>
          ) : (
            <View />
          )}

{booking &&
          booking.ratings &&
          booking.ratings.videoRating &&
          booking.ratings.videoRating.length ? (
            <View
              style={{
                backgroundColor: Constants.white,
                paddingHorizontal: heightPercentageToDP(2),
              }}>
              <View
                style={{
                  flex: 1,
                  height: heightPercentageToDP(7),
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={Images.ratings_icon}
                  style={{
                    height: heightPercentageToDP(5),
                    width: heightPercentageToDP(5),
                  }}
                />
                <View
                  style={{
                    height: heightPercentageToDP(1),
                    width: heightPercentageToDP(1),
                  }}
                />
                <View style={{width: widthPercentageToDP(80)}}>
                  <AppText black size="S">
                    {t('Watch Customer Reviews on ')}
                    <AppText greenishBlue bold size="S">
                      {t(booking.mediaJson.title.text)}
                    </AppText>
                  </AppText>
                </View>
              </View>
              <FlatList
                horizontal={true}
                onEndReachedThreshold={0.01}
                data={booking.ratings.videoRating}
                onScroll={this.fadeOut}
                renderItem={({item, index}) => {
                  return (
                    <VideoReviews
                      key={index}
                      showViewAll={false}
                      isHorizontal={false}
                      category={''}
                      position={0}
                      page={''}
                      reviewVideoThumbnail={item.thumbnail}
                      reviewName={item.name}
                      rating={item.rating}
                      screenName={'PDP'}
                      item={item}
                      onPress={() => this.handleOtherItemClick(item)}
                      index={index}
                      videoClick={() => this.videoClick(index)}
                      backgroundStyle={{backgroundColor: 'white'}}
                      textStyle={{color: Constants.greyishBlack}}
                    />
                  );
                }}
                keyExtractor={item => item.refId}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          ) : null}

          {activeCategoryTab !== 'free-gift' &&
          Object.keys(entityDetails).length > 0 ? (
            <SimilarProducts
              entityDetails={entityDetails}
              t={t}
              refreshing={this.props.refreshScreen}
              groupCode={groupCode}
              isGroupUnlocked={isGroupUnlocked}
              handleOtherItemClick={this.handleOtherItemClick}
              isBooking
            />
          ) : (
            <View />
          )}

          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={
              showSize && showColor
                ? heightPercentageToDP(28)
                : heightPercentageToDP(14)
            }
            duration={80}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderRadius: 10,
              },
            }}>
            <SizeColorWeightContainer
              t={t}
              showSize={showSize}
              sizes={sizes}
              onSizePress={this.onSizePress}
              sizeHeader={'Select Size'}
              showColor={showColor}
              colorHeader={'Select Colour'}
              colours={colours}
              onColorPress={this.onColorPress}
            />
          </RBSheet>
        </ScrollView>
        <View style={styles.confirmButton}>
          <LinearGradientButton
            cartButton={false}
            btnStyles={{
              flexDirection: 'row',
            }}
            titleStyle={{color: 'white', fontWeight: 'bold'}}
            colors={['#fdc001', '#fd7400']}
            title={isFreeGiftCategoryItem ? t('CONFIRM') : t('ADD TO CART')}
            onPress={() => this.onPressAddToCart(rewardsPrice, total)}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  mainView: {
    flex: 1,
    margin: 10,
  },
  textStyle: {
    fontSize: scaledSize(14),
    color: Colors.textMuted,
    fontFamily: Fonts.roboto,
  },
  readMoreText: {
    fontSize: scaledSize(14),
    color: Colors.orange,
    fontWeight: '500',
    fontFamily: Fonts.roboto,
  },
  quantityView: {
    width: '40%',
  },
  bookingTagView: {
    height: 80,
    marginVertical: heightPercentageToDP(1),
    flexDirection: 'row',
  },
  bookingTotalText: {margin: 10},
  confirmButton: {
    height: 70,
    padding: 10,
    //Shadow Style
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  markerView: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: heightPercentageToDP(2),
    marginLeft: widthPercentageToDP(2),
  },
  ButtonInnerView: {
    height: 50,
    backgroundColor: Colors.orange,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: Colors.white,
    fontWeight: '800',
    fontFamily: Fonts.roboto,
  },
  lineMainView: {width: '100%', alignItems: 'center'},
  lineView: {width: '95%', borderWidth: 0.6, borderColor: '#F1F1F1'},
  addressView: {},
  activeTabStyle: {
    backgroundColor: Colors.blue,
  },
  activeTextStyle: {
    color: Colors.white,
    fontWeight: '500',
    fontFamily: Fonts.roboto,
  },
  tabStyle: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.blue,
  },
  tabTextStyle: {
    color: Colors.darkBlack,
    fontWeight: '500',
    fontFamily: Fonts.roboto,
  },
  tabBarUnderlineStyle: {
    display: 'none',
    height: 0,
  },
  rewardsContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingBottom: 0,
    marginBottom: 0,
    alignItems: 'center',
    marginRight: 10,
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
  markerLogoImage: {
    height: heightPercentageToDP(5),
    width: widthPercentageToDP(10),
    resizeMode: 'contain',
    paddingRight: 0,
  },
  shareBox: {
    position: 'absolute',
    top: heightPercentageToDP(3),
    left: widthPercentageToDP(90),
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
});

const mapStateToProps = state => ({
  loading: state.booking.loading,
  booking: state.booking.booking,
  login: state.login,
  isLoggedIn: state.login.isLoggedIn,
  launchEventDetails: state.login.launchEventDetails,
  entityDetails: state.booking.entityDetails,
  entityDetailsApiLoading: state.booking.entityDetailsApiLoading,
  address: state.booking.address,
  refreshScreen: state.booking.refreshScreen,
  quantity: state.booking.quantity,
  sourceComponent: state.booking.sourceComponent,
  groupSummary: state.groupSummary,
  activeCategoryTab: state.home.activeCategoryTab,
  addressLoading: state.booking.isLoading,
  rewards: state.rewards.rewards,
  index: state.booking.index,
  selectedSize: state.booking.selectedSize,
  selectedColor: state.booking.selectedColor,
  addressListApiCompleted: state.booking.addressListApiCompleted,
  activeAddress: state.booking.selectedAddress,
  initialRewardsApiCallCompleted: state.rewards.initialRewardsApiCallCompleted,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  setReduxState: payload => dispatch(SET_STATE(payload)),
  updateQuantity: quantity => dispatch(QUANTITY(quantity)),
  getOfferDetails: (obj: object) => {
    dispatch(getOfferDetails(obj));
  },
  updateCart: (
    offerId,
    quantity,
    size,
    color,
    currencyMode,
    source,
    medium
  ) => {
    dispatch(
      UpdateCart(offerId, quantity, size, color, currencyMode, source, medium)
    );
  },
  addBookProduct: product => dispatch(BOOK_PRODUCT(product)),
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Booking)
);
