import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import moment from 'moment';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import DataList from '../../../components/LiveComponents/DataList';
import { AppText } from '../../../components/Texts';
import {scaledSize,heightPercentageToDP,widthPercentageToDP} from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import {Icon, Header} from 'react-native-elements';
import ViewMoreText from 'react-native-view-more-text';
import {Constants} from '../../../styles';
import {shareOfferOnWhatsApp, showToastr} from '../utils';
import LinearGradientButton from '../../../components/Button/LinearGradientButton';
import NavigationService from '../../../utils/NavigationService';
import {LogFBEvent, Events, ErrEvents} from '../../../Events';
import {liveAnalytics} from '../ShopgLive/redux/actions';
import ViewPager from '@react-native-community/viewpager';
import VerticalVideo from './VerticalVideo';

const component = 'VerticalVideoListItem';

export class VerticleVideoListItem extends Component {

  constructor(props) {
    super();
    this.state = {
      startValue: new Animated.Value(0),
      endValue: 10,
      duration: 2000,
      startVideo: false,
      imageGallery:[],
      isVideo:false,
      activeIndex:0
    };
    this.initializeComponent = this.initializeComponent.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.listIndex===nextProps.activeIndex){
      return { startVideo: true };
   }
   else {
    return { startVideo: false};
   }
 }

  toggleVideo = () => {
    this.setState({startVideo: !this.state.startVideo});
  }

  onDeatilsClick = () => {
    const {dispatch,item} = this.props;
    dispatch({
      type: 'booking/GET_BOOKING',
      payload: item,
      index: 0,
    });
    NavigationService.navigate('Booking');
  }

  cartPress = () => {
    NavigationService.navigate('CartDetail');
  }


  onPageSelected = (e: PageSelectedEvent) => {
    const page = e.nativeEvent.position;
    let imageGallery = [...this.state.imageGallery];
    this.setState({isVideo:(imageGallery.length) ? imageGallery[page].video : false})
    this.setState({activeIndex: page})
  };

  whatsappPress = () => {
    const {t,item,groupSummary, activeIndex, type, userPref, clMediumLogoImage} = this.props;

    let userPrefData = {
      userId: userPref && userPref.uid,
      sid: userPref && userPref.sid,
    };
    let eventProps = {
      offerId: item.id,
      sharedBy: userPref && userPref.userMode,
      url:
        (item.mediaJson &&
          item.mediaJson.mainImage &&
          item.mediaJson.mainImage.url) ||
        '',
      position: activeIndex,
      page: type,
      component: component,
    };
    shareOfferOnWhatsApp(clMediumLogoImage, 'VerticalVideoList','Share',t, groupSummary, item, eventProps, null, null, userPrefData);
    this.props.onAnalytics(Events.SHARE_OFFER_WHATSAPP_CLICK.eventName(), eventProps, userPrefData);

  }

  onOverlayPress = (component) => {
    let {
      selectedTag,
      title
    } = this.props;

    selectedTag = selectedTag ? selectedTag : '';

    const selectedSlug = selectedTag  ? selectedTag : '';

    let screenName = 'InactiveFlashSales';

    NavigationService.navigate('TagsItems', {
      screen: screenName,
      title: title,
      selectedtagSlug: selectedSlug,
    });
  };


  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.startValue, {
          toValue: this.state.endValue,
          duration: this.state.duration,
        })
      ]),
      {
        iterations: 1000
      }
    ).start()
    this.initializeComponent();

  }

  componentDidUpdate(previousProps, previousState) {
    if(previousProps.selectedLanguage !== this.props.selectedLanguage) {
      this.initializeComponent();
    }
  }

  initializeComponent = () => {
    const {item, isVideoRelevance, selectedLanguage, isReviewComponent} = this.props;
    const mediaJson = item.mediaJson;
    let isVideo = (mediaJson && mediaJson.localisedVideo && mediaJson.localisedVideo.length) ? true : false;

    let imageGallery = mediaJson && mediaJson.gallery ? mediaJson.gallery.map(img => img.url) : isVideoRelevance ? [item] : [];
    let mainImageUrl = (mediaJson && mediaJson.mainImage && mediaJson.mainImage.url) ? mediaJson.mainImage.url : '';
    if (!isVideoRelevance) {
      imageGallery.unshift(mainImageUrl);
    }
    

    let ratingVideo = [];
    if(isVideo){
      let hasLanguageVideo = false;
      mediaJson.localisedVideo.map(videoObject => {
        if(selectedLanguage && (videoObject.language.toLowerCase() === selectedLanguage.toLowerCase())){
          imageGallery.unshift({video:true,uri: videoObject.video.url});
          hasLanguageVideo = true;
        }
      });
      if(!hasLanguageVideo){
        imageGallery.unshift({video:true,uri: mediaJson.localisedVideo[0].video.url});
      }
 
        if(item && item.ratings && item.ratings.videoRating && item.ratings.videoRating.length){
          
          item.ratings.videoRating.map(videoObject => {
            if(selectedLanguage && (videoObject.language.toLowerCase() === selectedLanguage.toLowerCase())){
              ratingVideo.push({video:true,uri: videoObject.url});
            } 
          })
        }

    }

    let imageToShow = [];
    if(isReviewComponent){
      imageToShow = [...ratingVideo,...imageGallery];
    } else {
      imageToShow = [...imageGallery,...ratingVideo];
    }
    this.setState({imageGallery:imageToShow});
  }

  componentWillUnmount(){
    const {dispatch} = this.props;
    
    dispatch({
      type: 'shopglive/SET_STATE',
      payload: {
        isReviewComponent:false
      },
    });
  }


  languageSheetOpen = () => {
      this.props.changeVideoLanguage();
  }
  
  
  render() {
    const {t,
      item,
      hasCart,
      totalCartItems,
      listLength,
      listIndex,
      liveLoading,
      onProgress,
      category,
      closeWindow, 
      isVideoRelevance, 
      selectedTag,
      widgetId,
      widgetType,
      page,
      noCart,
      horizontalIndex
    } = this.props;
    const {startVideo,imageGallery,activeIndex} = this.state;
    const lang = this.props.selectedLanguage ? this.props.selectedLanguage.substring(0,2) : '';
    return (
        <View style={styles.componentContainer}>
            <View
                style={styles.behind}>
                  <View style={{flex:0.1}}/>
                  <View style={{flex:0.65,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>  
                    </View>
                    <ViewPager 
                      ref={(viewPager) => {this.viewPager = viewPager}}
                      style={styles.container}
                      onPageSelected={this.onPageSelected}
                      initialPage={horizontalIndex}
                      orientation='horizontal'>
                      {imageGallery.length && imageGallery.map((item,index) => {
                          return (
                            <View key={''+item}>
                              <VerticalVideo 
                                shouldStartVideo={startVideo}
                                item={item}
                                selectedLanguage={this.props.selectedLanguage}
                                activeIndex={activeIndex}
                                listIndex={index}
                                isVideoRelevance={isVideoRelevance}
                                />
                            </View>
                          );
                      })}
                    </ViewPager>

                      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}> 
                      </View>
                    </View>
                  <View style={{flex:0.25}}/>
                
            </View>

            {
              <LinearGradient colors={['black','transparent','transparent','transparent','black','black']} style={styles.front}>
              <View style={styles.behind}>
                  <View style = {styles.frontUpper}>

                    <View style = {styles.frontUpperUpper}>

                        <TouchableOpacity
                          style={styles.frontUpperUpperLeft}
                          onPress={closeWindow}>
                          <Icon
                            name={'close'}
                            type={'font-awesome'}
                            color={Constants.white}
                            size={widthPercentageToDP(5)}
                          />
                        </TouchableOpacity>

                        <View style = {styles.frontUpperUpperMiddle}>

                        <ViewMoreText
                          textStyle={{textAlign: 'center'}}
                          renderViewMore={handlePress => (
                            <View />
                          )}
                          renderViewLess={handlePress => (
                            <View />
                          )}
                          numberOfLines={1}>
                          <AppText white size="L">
                            {isVideoRelevance ? t(item.text) : t(item.mediaJson.title.text)}
                          </AppText>
                        </ViewMoreText>


                        </View>

                        <View style = {styles.frontUpperUpperRight}>
                          <TouchableOpacity style={styles.languageContainer} onPress={this.languageSheetOpen}>
                            <Icon
                              name='language'
                              type='material'
                              color='#ffffff'
                              size={17}
                            /> 
                          <AppText white size="M">{` ${lang} `}</AppText>
                          </TouchableOpacity>
                        </View>

                    </View>

                    <View style = {styles.frontUpperLower} />
                    <View style={styles.frontUpperFarLower}>
                    {
                      (imageGallery && imageGallery.length && activeIndex !=0)
                      ?
                      <TouchableOpacity
                        style={{height:widthPercentageToDP(8),width:widthPercentageToDP(8)}}
                        onPress={()=>this.viewPager.setPage(this.state.activeIndex -1)}>
                        <Icon
                          name={'angle-double-left'}
                          type={'font-awesome'}
                          color={Constants.black}
                          size={widthPercentageToDP(8)}
                        />
                      </TouchableOpacity>
                      :<View style={{height:widthPercentageToDP(8),width:widthPercentageToDP(8)}} />
                    }

                    {  
                      (imageGallery && imageGallery.length && activeIndex != (imageGallery.length-1))
                      ?
                      <TouchableOpacity
                      style={{height:widthPercentageToDP(8),width:widthPercentageToDP(8)}}
                      onPress={()=>this.viewPager.setPage(this.state.activeIndex +1)}>
                        <Icon
                          name={'angle-double-right'}
                          type={'font-awesome'}
                          color={Constants.black}
                          size={widthPercentageToDP(8)}
                        />
                      </TouchableOpacity>
                      : <View style={{height:widthPercentageToDP(8),width:widthPercentageToDP(8)}} />
                    }

                    </View>
                  </View>

                  <View style = {styles.frontLower}>
                    <View style={styles.frontLowerUpper}>
                      <View style={styles.cartContainer}>
                        {
                          (hasCart && totalCartItems && totalCartItems > 0 && !noCart)
                          ?
                          <TouchableOpacity 
                            onPress={this.cartPress}
                            style={styles.cartBox}>
                              <View style={{marginLeft:widthPercentageToDP(1),height:heightPercentageToDP(3),width:heightPercentageToDP(3),borderRadius:heightPercentageToDP(3),backgroundColor:'#fa6400',justifyContent:'center',alignItems:'center'}}>
                                <AppText white size="XS">
                                  {t(''+totalCartItems)}
                                </AppText>
                              </View>


                              <AppText white size="L" style={{marginLeft:widthPercentageToDP(1)}}>
                                {t('CART')}
                              </AppText>
                          </TouchableOpacity>
                          : null
                        }

                      </View>
                      { !isVideoRelevance ? (
                      <View style={[styles.cartContainer,{paddingRight:heightPercentageToDP(2),marginTop:heightPercentageToDP(2)}]}>
                        <TouchableOpacity 
                          onPress={this.whatsappPress}
                          style={styles.whatsappCircle}>
                          <Icon
                            type="font-awesome"
                            name="whatsapp"
                            color={Constants.white}
                            size={widthPercentageToDP(6)}
                            containerStyle={{
                              alignSelf: 'center',
                            }}
                          />
                        </TouchableOpacity>
                      </View>) : null}

                  </View>

                    <View style={styles.frontLowerLower}>

                      <View style={styles.bottomTextBox}>

                       
                          { !isVideoRelevance ? (
                          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <ViewMoreText
                              textStyle={{textAlign: 'left'}}
                              renderViewMore={handlePress => (
                                <View />
                              )}
                              renderViewLess={handlePress => (
                                <View />
                              )}
                              numberOfLines={2}>
                              <AppText white size="L">
                                {t(item.mediaJson.description.text)}
                              </AppText>
                            </ViewMoreText>
                          </View>) : null

                              }


                          { !isVideoRelevance ? (
                          <View style={{flexDirection:'row',height:heightPercentageToDP(6)}}>
                            
                            <View style={{flex:1,justifyContent:'center'}}>
                            
                              <View style={{flexDirection:'row',alignItems:'center'}}>
                                <AppText bold greenishBlue size='S'>
                                  {'\u20B9' + item.offerinvocations.offerPrice}
                                </AppText>


                                <AppText white size='S' style={{textDecorationLine: 'line-through',marginLeft:widthPercentageToDP(2)}}>
                                  {'\u20B9' + (item.offerinvocations.price || 0)}
                                </AppText>


                              
                              </View>

                            </View>

                            <View style={{flex:2,flexDirection:'row'}}>
                              
                              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

                                <TouchableOpacity onPress={this.onDeatilsClick} style={{paddingHorizontal:heightPercentageToDP(1),paddingVertical:heightPercentageToDP(1),borderColor:Constants.white,borderRadius:heightPercentageToDP(0.3),borderWidth:widthPercentageToDP(0.5)}}>
                                  <AppText white size='XS'>
                                    {t('DETAILS')}
                                  </AppText>
                                </TouchableOpacity>

                              </View>

                              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <LinearGradientButton
                                  dontShowRemainingStockValue={true}
                                  QuantityCounterNoBorder={false}
                                  QuantityCounterHeight={heightPercentageToDP(3)}
                                  horizontalList={true}
                                  widgetId={0}
                                  position={0}
                                  page={0}
                                  widgetType={''}
                                  category={''}
                                  stockValue={0}
                                  notQuantityText={true}
                                  checkOutOfStock={false}
                                  entityType={0}
                                  offerId={item.parentId || item.id}
                                  screenName={'verticleVideo'}
                                  item={item}
                                  cartButton={true}
                                  btnStyles={{
                                      flexDirection: 'row',
                                      borderColor: 'transparent',
                                      borderWidth:0.5,
                                      borderRadius:5,
                                      height:heightPercentageToDP(5)
                                    }}
                                  titleStyle={{color: 'white'}}
                                  colors={['#fdc001', '#fd7400']}
                                  title={t('ADD')}
                                  onPress={()=>{}}
                                />
                              </View>


                            </View>


                          </View>)

                             : null}

                          {
                            (liveLoading)
                            ?
                            <View style={{justifyContent:'center',alignItems:'center'}}>
                                <ActivityIndicator
                                  color="white"
                                  size="large"
                                />           
                            </View>
                            :
                            null
                          }

                          {
                            (listLength != (listIndex+1) && !isVideoRelevance)
                            ?
                            <Animated.View
                            style={[
                              {justifyContent:'center',alignItems:'center'},
                              {transform: [{translateY: this.state.startValue}]},
                            ]}>
                              <AppText white size="XS">
                                {t('Scroll & see more products')}
                              </AppText>                              
                            </Animated.View>
                            :
                            <View style={styles.emptyStyle} />
                          }

                          {
                            (listLength != (listIndex+1) && !isVideoRelevance)
                            ?
                            <Icon
                              name={'angle-down'}
                              type={'font-awesome'}
                              color={Constants.white}
                              size={widthPercentageToDP(3)}
                            />
                            :
                            <View style={styles.emptyStyle} />
                          }
                      </View>
                    </View>

                  
                  
                  
                    { isVideoRelevance && selectedTag ? (
                              <View 
                              style={{marginTop: heightPercentageToDP(18)}}>
                              <DataList
                                heightDP={35}
                                isHorizontal={true}
                                selectedTag={{slug: selectedTag}}
                                position={listIndex}
                                widgetType={widgetType ? widgetType : ''}
                                page={page ? page : ''}
                                widgetId={widgetId ? widgetId : ''}
                                category={category ? category : ''}
                                screenName="verticleVideoListItem"
                                numberOfLinesEntity={{numberOfLines: 1}}
                                endItemPress={() => this.onOverlayPress('dataList')}
                              />
                  
                                </View>

                            )
                              : null
                            }

                  </View>
                </View>
            </LinearGradient>
            }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  componentContainer: {
    height:heightPercentageToDP(100),
    width:widthPercentageToDP(100),
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white'
  },
  front: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    height:heightPercentageToDP(100),
    width:widthPercentageToDP(100),
  },
  behind:{
    flex:1,
    height:heightPercentageToDP(100),
    width:widthPercentageToDP(100),
  },
  frontUpper:{
    flex:1,
  },
  frontUpperUpper:{
    flex:0.2,
    flexDirection:'row',
    width:widthPercentageToDP(100)
  },
  frontUpperUpperLeft:{
    flex:0.2,
    justifyContent:'center',
    alignItems:'center',
  },
  frontUpperUpperMiddle:{
    flex:0.6,
    justifyContent:'center',
    alignItems:'center',
  },
  frontUpperUpperRight:{
    flex:0.2,
    justifyContent:'center',
    alignItems:'center',
    flexDirection: 'row'
  },
  languageContainer: {
    borderColor: Constants.white,
    borderWidth: scaledSize(1),
    borderRadius: scaledSize(15),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: scaledSize(3)
  },
  frontUpperLower:{
    flex:0.6,
  },
  frontUpperFarLower:{
    flex:0.2,
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row',
    paddingHorizontal:widthPercentageToDP(1)
  },
  frontLower:{
    flex:1,
  },
  frontLowerUpper:{
    flex:0.5,
  },
  frontLowerLower:{
    flex:0.5,
  },
  cartContainer:{
    width:'100%',
    height:heightPercentageToDP(6),
    alignItems:'flex-end',
  },
  cartBox:{
    width:'25%',
    height:'100%',
    backgroundColor:'#292f3a',
    borderTopLeftRadius:widthPercentageToDP(5),
    borderBottomLeftRadius:widthPercentageToDP(5),
    flexDirection:'row',
    alignItems:'center'
  },
  bottomTextBox:{
    width:widthPercentageToDP(100),
    height:'100%',
    justifyContent:'space-between',
    paddingHorizontal:widthPercentageToDP(5)
  },
  circleHeader:{
    backgroundColor:'#0091ff',
    alignSelf:'baseline',
    paddingHorizontal:widthPercentageToDP(1),
    borderRadius:2,
  },
  celebRatingBox:{
    flexDirection:'row',
  },
  whatsappCircle: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
  },
  emptyStyle:{
    width: widthPercentageToDP(5),
    height: heightPercentageToDP(5),
  },
  container: {
    flex:8,
    height:heightPercentageToDP(65)
  },
});

const mapStateToProps = state => ({
  cart: state.home.cart,
  hasCart: state.home.hasCart,
  userPref: state.login.userPreferences,
  totalCartItems: state.home.totalCartItems,
  groupSummary: state.groupSummary,
  liveLoading: state.ShopgLive.liveLoading,
  isReviewComponent:state.ShopgLive.isReviewComponent,
  language: state.home.language,
  clMediumLogoImage: state.clOnboarding.clMediumLogoImage,
});

const mapDipatchToProps = dispatch => ({
  dispatch,
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(VerticleVideoListItem)
);