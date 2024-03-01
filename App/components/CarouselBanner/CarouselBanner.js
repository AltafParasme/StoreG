import React, {PureComponent, Component} from 'react';
import {View, Dimensions} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import MySlideComponent from './MySlideComponent';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {
  shareToWhatsAppCLTasks,
  shareToWhatsApp,
} from '../../native/pages/utils';
import {liveAnalytics} from '../../native/pages/ShopgLive/redux/actions';
import {changeField} from '../../native/pages/ShopgLive/redux/actions';
import {
  heightPercentageToDP,
  scaledSize,
  widthPercentageToDP,
} from '../../utils';
import NavigationService from '../../utils/NavigationService';
import {LogFBEvent, Events} from '../../Events';
import {Constants} from '../../styles';
const width = Dimensions.get('window').width;

class CarouselBanner extends Component {
  constructor() {
    super();
    this.state = {
      activeSlide: 0,
      data: [],
      language: 'english',
      isModalOpen: false,
      indexClicked: -1,
      isBannerClicked: false,
    };
    this.toggle = this.toggle.bind(this);
    this.takeToImageView = this.takeToImageView.bind(this);
  }

  componentDidMount = () => {
    let data = this.props.categories ? this.props.categories : [];
    if (this.props.categories.length > 0 && this.props.findItemEnabled) {
      data =
        this.props.categories &&
        this.findItems(this.props.categories, this.props.activeCategoryTab);
    }
    this.setState({
      data: data,
      language: this.props.language || 'english',
    });
  };

  pagination = () => {
    const {activeSlide, data, language} = this.state;
    if (!language) return null;
    return (
      <Pagination
        dotsLength={
          language &&
          data &&
          data.bannerJson &&
          data.bannerJson[language.toLowerCase()] &&
          data.bannerJson[language.toLowerCase()].length
        }
        activeDotIndex={activeSlide}
        containerStyle={{backgroundColor: 'transparent'}}
        dotContainerStyle={{marginHorizontal: 0}}
        dotStyle={[
          {
            width: 5,
            height: 5,
            borderRadius: 5,
            marginHorizontal: 3,
            backgroundColor: 'white',
          },
          this.props.isStarterCLFlow || this.props.isShopgLive
            ? {top: heightPercentageToDP(2)}
            : this.props.isCLStep
            ? {top: heightPercentageToDP(3)}
            : {},
        ]}
        inactiveDotStyle={{}}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  takeToImageView = imageUrl => {
    NavigationService.navigate('ImageView', {
      url: imageUrl,
      restData: this.state.data,
    });
  };

  showTagsRelevance = index => {
    let {bannerTags} = this.props;
    let {data, language} = this.state;
    data =
      data.bannerJson[language.toLowerCase()] &&
      data.bannerJson[language.toLowerCase()][index].tags[0];
    let currentBannerTags = [{data: data, widgetId: this.props.widgetId}];
    this.props.onChangeField(
      'bannerTags',
      bannerTags.concat(currentBannerTags)
    );
  };

  navigateTo = (url = '', index, isVideo) => {
    const {
      setActiveTabs,
      dispatch,
      carouselPropsEvents,
      clBusiness,
    } = this.props;
    const params = url.split('/');
    if (params.length >= 2) {
      const routeName = params[0].toLowerCase();
      const id = params[1];
      switch (routeName) {
        case 'categories':
          // console.log('58-> id', id);
          //setActiveTabs({slug: 'kitchen'});
          if (clBusiness) {
            this.toggle(index);
          }
          NavigationService.navigate('Home', {actionId: id});
          LogFBEvent(Events.HOME_CATEGORY_BANNER_CLICK, {activeCategory: url});
          break;
        case 'offers':
          // console.log('Load product page:', id);
          //setActiveTabs({slug: 'diwali-taiyyari'});
          //dispatch({type: 'booking/SET_PRODUCT', payload: id});
          if (clBusiness) {
            this.toggle(index);
          }
          NavigationService.navigate('Home', {actionId: id});
          LogFBEvent(Events.HOME_CATEGORY_BANNER_CLICK, {activeCategory: url});
          break;
        case 'groups':
          if (clBusiness) {
            this.toggle(index);
          }
          NavigationService.navigate('OrderConfirmation');
          LogFBEvent(Events.HOME_CATEGORY_BANNER_CLICK, {activeCategory: url});
          break;
        case 'free-gift':
          NavigationService.navigate('FreeGift');
          LogFBEvent(Events.HOME_CATEGORY_BANNER_CLICK, {activeCategory: url});
          break;
        case 'cl-onboarding':
          NavigationService.navigate('CLOnboarding');
          LogFBEvent(Events.HOME_CATEGORY_BANNER_CLICK, {activeCategory: url});
          break;
        case 'rewards':
          NavigationService.navigate('Rewards');
          LogFBEvent(Events.HOME_CATEGORY_BANNER_CLICK, {activeCategory: url});
          break;
        case 'shipments':
          NavigationService.navigate('MyOrderBusinessCheckout');
          LogFBEvent(Events.HOME_CATEGORY_BANNER_CLICK, {activeCategory: url});
          break;
        case 'recommend':
          this.toggle(index, isVideo);
          LogFBEvent(Events.SHOPG_LIVE_BANNER_CLICK, carouselPropsEvents);
          break;
        default:
          this.toggle(index);
          LogFBEvent(Events.HOME_CATEGORY_BANNER_CLICK, {
            activeCategory: 'default',
          });
          break;
      }
    } else {
      this.toggle(index);
      LogFBEvent(Events.HOME_CATEGORY_BANNER_CLICK, {
        activeCategory: 'default',
      });
    }
  };

  toggle = (indexClicked, isVideo) => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
      indexClicked: indexClicked,
    }));
    if (this.props.isShopgLive && (this.state.isModalOpen || !isVideo)) {
      this.showTagsRelevance(indexClicked);
    }
  };

  _renderItem = (item, index, length) => {
    return (
      <MySlideComponent
        groupSummary={this.props.groupSummary}
        key={index}
        index={index}
        isCLTask={this.props.isCLTask}
        navigateTo={this.navigateTo}
        data={item}
        valId={this.props.valId}
        eventName={this.props.eventName}
        dataLength={length}
        whatsappClick={this.whatsappClick}
        videoIconImage={this.props.videoIconImage}
        innerTextStyle={this.props.innerTextStyle}
        carouselViewStyle={this.props.carouselViewStyle}
        carouselImageStyle={this.props.carouselImageStyle}
        isCLStep={this.props.isCLStep}
        markDownTextEnabled={this.props.markDownTextEnabled}
        enableImageZooming={this.props.enableImageZooming}
        showWhatsappButton={this.props.showWhatsappButton}
        toggle={this.toggle}
        playIconStyle={this.props.playIconStyle}
        showTagsRelevance={this.showTagsRelevance}
        isModalOpen={this.state.isModalOpen}
        indexClicked={this.state.indexClicked}
        clBusiness={this.props.clBusiness}
        isShopgLive={this.props.isShopgLive}
        isCLOnboard={this.props.isStarterCLFlow}
        biggerSizing={this.props.biggerSizing}
        restData={this.state.data}
        takeToImageView={this.takeToImageView}
      />
    );
  };

  findItems = (data, item) => {
    let returnItem = false;
    if (!data || data.length === 0) {
      return false;
    }
    data.forEach(row => {
      if (item && row.slug.toLowerCase() === item.toLowerCase()) {
        returnItem = row;
      }
    });
    return returnItem;
  };

  whatsappClick = (whatsappText, whatsappvideolink, whatsappimagelink, url) => {
    let eventData = {
      id: this.props.valId,
      url: url,
      page: this.props.screen,
      component: this.props.eventName,
    };
    let userPrefData = {
      userId: this.props.userPref.uid,
      sid: this.props.userPref.sid,
    };

    shareToWhatsAppCLTasks(
      eventData,
      this.props.t,
      whatsappText,
      whatsappvideolink,
      this.props.eventName,
      whatsappimagelink
    );
    if (this.props.eventName === 'CL_BANNER_TASK') {
      this.props.onAnalytics(
        Events.SHARE_WHATSAPP_CL_TASK_CLICK,
        eventData,
        userPrefData
      );
    }
  };

  render() {
    const {data, language} = this.state;
    if (!language) return null;
    if (!data || !data.bannerJson) {
      return null;
    }
    let dataCarousel = data.bannerJson[language.toLowerCase()];
    return (
      <View style={this.props.mainViewStyle}>
        {data && data.bannerJson && dataCarousel && (
          <>
            <Carousel
              data={dataCarousel}
              renderItem={({item, index}) =>
                this._renderItem(item, index, dataCarousel.length)
              }
              activeCategoryTab={this.props.activeCategoryTab}
              onSnapToItem={index => this.setState({activeSlide: index})}
              sliderWidth={width}
              sliderHeight={
                !this.props.biggerSizing ? heightPercentageToDP(35) : null
              }
              itemWidth={
                this.props.itemWidthProps
                  ? this.props.itemWidthProps
                  : width - scaledSize(20)
              }
              layout="default"
              loop
              autoplay
              autoplayDelay={2000}
              autoplayInterval={2000}
            />
            <View
              style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: 0,
                paddingTop: 10,
                marginTop: 20,
              }}>
              {this.pagination()}
            </View>
          </>
        )}
      </View>
    );
  }
}
const mapStateToProps = state => ({
  activeCategoryTab: state.home.activeCategoryTab,
  rewards: state.rewards.rewards,
  language: state.home.language,
  groupSummary: state.groupSummary,
  bannerTags: state.ShopgLive.bannerTags,
  userPref: state.login.userPreferences,
});
const mapDispatchToProps = dispatch => ({
  dispatch,
  onChangeField: (bannerTags, value) => {
    dispatch(changeField(bannerTags, value));
  },
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CarouselBanner)
);
