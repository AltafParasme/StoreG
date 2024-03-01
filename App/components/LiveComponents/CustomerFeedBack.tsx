import React, {Component, PureComponent} from 'react';
import {ScrollView, FlatList, TextInput} from 'react-native-gesture-handler';
import {
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ImageBackground,
  AppState,
  Image,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {Fonts} from '../../../assets/global';
import Button from '../Button/Button';
import {getRewards} from '../../native/pages/MyRewards/actions';
import {AirbnbRating, CheckBox, Card} from 'react-native-elements';
import {
  scaledSize,
  widthPercentageToDP,
  AppWindow,
  heightPercentageToDP,
} from '../../utils';
import {liveAnalytics} from '../../native/pages/ShopgLive/redux/actions';
import {SetFeedBack} from '../../native/pages/Home/redux/action';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {AppText} from '../Texts';
import {changeField} from '../../native/pages/CLOnboarding/actions';
import BackgroundSelector from './BackgroundSelector';
import LinearGradient from 'react-native-linear-gradient';
import DataListItem from './DataListItem';
import {Constants} from '../../styles';
import DataList from './DataList';
import NavigationService from '../../utils/NavigationService';
import HeaderComponent from './HeaderComponent';
import {Icon} from 'react-native-elements';
import {LogFBEvent, Events} from '../../Events';
import ProductReview from './ProductReview';
import { Images } from '../../../assets/images';
import { buildLink, showToastr } from '../../native/pages/utils';

class CustomerFeedBack extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFeedBackTaken: false,
      rating: 0,
      hasScrollingStarted: true,
      isTextInputFilled: false,
      feedbackMessage: null,
      isCheckedOthers: false,
      comments: '',
      review: null,
      isAppStoreOpened: false,
      tag: null,
      feedbackGiven: false,
    };
    this.scroll = null;
    this.scrollToEnd = this.scrollToEnd.bind(this);
  }

  ratingCompleted = (rating) => {
    const {userComponentData, userPreferences, widgetId, wuserId} = this.props;
    let review = '';
    switch(rating) {
      case 1:
        review = 'Terrible';
        break;
      case 2:
          review = 'Bad';
          break;
      case 3:
          review = 'Okay';
          break;
      case 4:
          review = 'Good';
          break;

    }
    this.setState({
      rating: rating,
      ratingArr: new Array(rating).fill({}),
      review: review
    });
    let userId = userPreferences && userPreferences.uid;
      let entityType = 'PRODUCT EXPERIENCE';
      let entityId = userComponentData && userComponentData.entityId;
      let {feedbackMessage, comments} = this.state;
      let eventData = {
        widgetId: widgetId,
        component: 'RatingComponent',
        wuserId: wuserId
      };
      let userPrefData = {
        userId: userPreferences && userPreferences.uid,
        sid: userPreferences && userPreferences.sid,
      };
      let feedbackPayload = {
        userId,
        entityId,
        entityType,
        rating,
        feedbackMessage,
        comments,
      };
     this.props.setFeedBack(feedbackPayload);
      this.props.onAnalytics(
        Events.SHOPG_LIVE_RATING_COMPLETE.eventName(),
        eventData,
        userPrefData
      );
  };

  componentDidMount() {
    const {category,widgetId,index,listItemIndex,widgetType, productData} = this.props;
    LogFBEvent(Events.SHOPG_LIVE_IMPRESSION,{
      category:category,
      widgetId: widgetId,
      position:listItemIndex,
      order:index,
      widgetType:widgetType
    });
  }

  scrollToEnd = step => {
    const {itemData, userComponentData, userPreferences, isFeedBackShare} = this.props;
    setTimeout(() => {
      this.scroll &&
        this.scroll.scrollTo({
          x:
            step === 'first'
              ? widthPercentageToDP(97)
              : step === 'second'
              ? widthPercentageToDP(207)
              : widthPercentageToDP(410),
        });
    }, 10);
    if (step === 'second') {
      let userId = userPreferences && userPreferences.uid || 0;
      let entityType = 'PRODUCT EXPERIENCE';
      let entityId = userComponentData && userComponentData.entityId || 0;
      let {feedbackMessage, comments, rating} = this.state;
      let feedbackPayload = {
        userId,
        entityId,
        entityType,
        rating,
        feedbackMessage,
        comments,
      };
      this.props.setFeedBack(feedbackPayload, isFeedBackShare);
      LogFBEvent(Events.SHOPG_LIVE_REVIEW_SUBMIT, feedbackPayload)
    }
  };

  whatsappShare = async (mssg) => {
    let {itemData, widgetId, page, position, category, widgetType, t, productData, groupSummary, userPreferences, isFeedBackShare} = this.props;
    let {rating, comments} = this.state;
    let productName = t(productData.productName.text);
    let productDescription = t(productData.description.text);
    let offerId = t(productData.offerId);
    let userId = userPreferences && userPreferences.uid;
    let eventProps = {
      widgetId: widgetId,
      page: page,
      category: category,
      widgetType: widgetType,
      position: position,
      sharedBy: userPreferences && userPreferences.userMode,
    };
    const inviteToken = groupSummary && groupSummary.groupDetails && groupSummary.groupDetails.info.inviteToken;
   
    let starCounts = [];
    this.state.ratingArr && this.state.ratingArr.map(starCount => {
     starCounts.push('⭐')
    })

    const deeplinkUrl = await buildLink(page, 'CustomerFeedBack', inviteToken, offerId, userId, null,'Booking');
    
    mssg = t(mssg, {
      NL: '\n',
      STARS: rating > 1 ? `${rating} stars` : `${rating} star`,
      COMMENTS: comments ? `, ${comments.trim()}` : null,
      SAVING: productData.price && productData.offerPrice ? `\n MRP ~₹${productData.price}~ ₹${productData.offerPrice}, ${productData.price - productData.offerPrice} OFF \n` : null,
      PRODUCTNAME:  productName  || '',
      PRODUCTDESCRIPTION: productDescription || '',
      STARICONS: starCounts.join(''),
      DEEPLINK: deeplinkUrl
    })
    const fs = RNFetchBlob.fs;
        this.setState({
          isLoading: true,
        });
        let dataUser = {
          userId: this.props.userPref && this.props.userPref.uid,
          sid: this.props.userPref && this.props.userPref.sid,
        };
      let imageUrl = productData.imageUrl;
   
        let imagePath = null;
          RNFetchBlob.config({
            fileCache: true,
          })
            .fetch('GET', imageUrl)
            .then(resp => {
              imagePath = resp.path();
              return resp.readFile('base64');
            })
            .then(base64Data => {
              Share.isPackageInstalled('com.whatsapp').then(
                ({isInstalled}: any) => {
                  if (isInstalled) {
                    const shareOptions = {
                      title: 'Share via',
                      message: mssg,
                      url: `data:image/png;base64,${base64Data}`,
                      social: Share.Social.WHATSAPP,
                      filename: 'test',
                    };
                    try {
                      Share.shareSingle(shareOptions).then(() => {
                       
                          setTimeout(() => {
                            showToastr(t('We have updated your coin balance'));
                          }, 200)
                          if (isFeedBackShare) 
                            this.props.onChangeField('feedbackGiven', false)
                       
                      });
                      if(page == 'Home') {
                        NavigationService.navigate('ScratchCardList');
                      }
                     LogFBEvent(Events.SHARE_WHATSAPP_CLICK, eventProps);
                      
                      this.props.onAnalytics(
                        Events.SHARE_WHATSAPP_CLICK.eventName(),
                        eventProps,
                        dataUser
                      );
                    } catch (error) {
                      LogFBEvent(Events.SHARE_FAILURE, null);
                      console.error(error);
                    }
                  }
                }
              );
              this.setState({
                isLoading: false,
                feedbackGiven: true,
              });
              return fs.unlink(imagePath);
            });
       
  }

  playStore = () => {
    const {itemData} = this.props;
    Linking.openURL(itemData.playstoreUrl);
    this.setState({isAppStoreOpened: true});
    this.scrollToEnd('third');
  };

  handleOtherItemClick = item => {
    const {dispatch} = this.props;
    dispatch({
      type: 'booking/SET_STATE',
      payload: {
        refreshScreen: true,
        booking: item,
        quantity: 1,
      },
    });
  };


  
  componentDidUpdate() {
    let optionsChecked = false;
    let options =
      this.state.rating < 4
        ? this.state.negCheckboxes
        : this.state.posCheckboxes;

    if (options) {
      options.map(checked => {
        if (checked.isChecked && checked.name !== 'Others') {
          optionsChecked = true;
        } else if (checked.name === 'Others' && this.state.isTextInputFilled) {
          optionsChecked = true;
        }
      });
    }
  }

  render() {
    let {t, itemData, widgetId, category, page, listItemIndex, language, productData} = this.props;
    let leftPadding = itemData.leftPadding;
    let shareMessage = itemData.shareMessage;
    let earningValueText = itemData.earningValueText
    let productDetials = productData;
    const imageBackground = itemData.backgroundImage[language && language.toLowerCase()];
    const backgroundColor = itemData.backgroundColor;

    return (
      <BackgroundSelector
        backgroundImage={imageBackground}
        imageBackgroundStyle={{height: heightPercentageToDP(36)}}
        backgroundColor={backgroundColor}
        style={styles.dealContainer}>

          {
            (!imageBackground && productDetials && productDetials.productName)
            ?
            <View style={styles.textOnLeft}>
              <View style={styles.textWraper}>
                <AppText white bold size="S">
                  {t('RATE, REVIEW & SHARE')}
                </AppText>
                <AppText white size="S">
                  {t(productData.productName.text)}
                </AppText>
                <AppText white bold size="S">
                  {page == 'Home' ? t('& WIN REWARDS!!'): t('& WIN 100 COINS!!')}
                </AppText>
              </View>
            </View>
            : null
          }

        <View style={styles.behind}>
            <View style={styles.titleBox}>
              <AppText bold white size="M">
                {t('RATE, REVIEW & SHARE')}{page == 'Home' ? t(' - WIN REWARDS!!'): t(' - WIN 100 COINS!!')}
              </AppText>
            </View>
          <ScrollView
            ref={node => (this.scroll = node)}
            scrollEnabled={true}
            style={!this.state.hasScrollingStarted ? {marginLeft: widthPercentageToDP(leftPadding)} 
            : {marginLeft: widthPercentageToDP(0)}}
            onScroll={() => this.setState({hasScrollingStarted: true})}
            horizontal
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            >
           
              <View style={styles.ratingsCard}>
                <View>
                  <View style={styles.upperSectionView}>
                  <AppText
                    size="M"
                    bold
                    style={{
                      paddingHorizontal: widthPercentageToDP(3.3),
                      paddingTop: heightPercentageToDP(2),
                    }}>
                    {t('Rate the product')}
                  </AppText>
                  <ProductReview
                       widgetId={widgetId}
                       category={category}
                       position={listItemIndex}
                       page={page}
                       item={productData}
                       index={listItemIndex}
                     />
                    </View>
                  <AirbnbRating
                    count={5}
                    onFinishRating={this.ratingCompleted}
                    defaultRating={0}
                    reviewSize={10}
                    size={35}
                    style={{justifyContent: 'space-between'}}
                    starContainerStyle={{bottom: heightPercentageToDP(1)}}
                  />
                <TouchableOpacity 
                style={styles.firstCardButtonStyle}
                  onPress={() =>  this.scrollToEnd('first')}
                  >
                    <AppText white bold>{t('NEXT')}</AppText>
                </TouchableOpacity>
                </View>
              </View>
           
              <View
                style={styles.reviewContent}>
                  <View style={styles.upperSectionView}>
                  <AppText
                    size="M"
                    bold
                    style={{
                      paddingHorizontal: widthPercentageToDP(3),
                      paddingTop: heightPercentageToDP(2),
                    }}>
                    {t('Write a review for')}
                  </AppText>
                  <ProductReview
                       widgetId={widgetId}
                       category={category}
                       position={listItemIndex}
                       page={page}
                       item={productData}
                       index={listItemIndex}
                     />
                    </View>
                   <View style={styles.secondCardView}>
                      <TextInput
                        style={styles.textInputStyle}
                        onEndEditing={() => {
                          this.setState({
                            isTextInputFilled: true,
                          });
                        }}
                        onChangeText={comments => this.setState({comments: comments.trim()})}
                        placeholder={'Write here..'}
                        value={this.state.comments}
                        placeholderTextColor="#B9BBBF"
                        editable={true}
                        maxLength={500}
                      />
                          <TouchableOpacity 
                    style={styles.secondCardButtonStyle}
                      onPress={() =>  this.scrollToEnd('second')}
                      >
                        <AppText white bold style={{paddingTop: heightPercentageToDP(0.7)}}>{t('NEXT')}</AppText>
                    </TouchableOpacity>
                      </View>
              </View>
             
            <View style={styles.recommendedCard}>
              <View 
                style={[styles.upperSectionView, {height: heightPercentageToDP(23)}]}
                >
                  <AppText
                    size="M"
                    bold
                    style={{
                      paddingHorizontal: widthPercentageToDP(3),
                      paddingTop: heightPercentageToDP(2),
                    }}>
                    {t('Share your review #AMP# ', {AMP: earningValueText ? '&' : null})}
                    <AppText greenishBlue>{t('#EARNINGVAL#', {
                      EARNINGVAL: earningValueText ? `${earningValueText}` : null
                    })}</AppText>
                  </AppText>
                  <ProductReview
                       widgetId={widgetId}
                       category={category}
                       position={listItemIndex}
                       page={page}
                       item={productData}
                       index={listItemIndex}
                     />
              <View style={styles.dataContainer}>
              { this.state.ratingArr ? (
              <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
              { 
                this.state.ratingArr && this.state.ratingArr.map((rating) => 
                 <Icon
                  name={'star'}
                  type={'material'}
                  color={'#f1c40f'}
                  size={20}
                /> 
                )
              
              }
              </View>
              <AppText 
              bold
              style={styles.reviewText}>{this.state.review}</AppText>
              </View>
              ) : null}
              {this.state.comments ? (
              <View>
                <AppText textProps={{numberOfLines: 2}}>{this.state.comments}</AppText>
              </View> ) : null}
                </View>
                </View>
              <TouchableOpacity 
                onPress={() => this.whatsappShare(shareMessage)}
                style={styles.shareWhatsappButton}>
                <Image source={Images.whatsapp} style={styles.buttonImage} />
                <AppText white>{t('SHARE YOUR REVIEW')}</AppText>
              </TouchableOpacity>
            </View>
          </ScrollView>
          </View>
      </BackgroundSelector>
    );
  }
}

const styles = StyleSheet.create({
  textOnLeft:{
    flex:1,
    justifyContent:'center',
  },
  titleBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: heightPercentageToDP(0.5)
  },
  textWraper:{
    width:widthPercentageToDP(50),
    paddingHorizontal:widthPercentageToDP(2),
  },
  dealContainer: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    height: heightPercentageToDP(36),
    marginTop: heightPercentageToDP(1)
  },
  reviewText: {
    marginLeft: widthPercentageToDP(2), 
    textAlign: 'center', 
    color: '#f1c40f'
  },
  mainView: {
    flex: 1,
    marginBottom: heightPercentageToDP(1.5),
    alignSelf: 'center',
    justifyContent:'center',
    alignItems:'center'
  },
  secondCardView: {
    flexDirection: 'row', 
    marginTop: heightPercentageToDP(1.8), 
    justifyContent: 'space-between',
    marginHorizontal: widthPercentageToDP(3.3)
  },
  ratingsCard: {
    width: widthPercentageToDP(91),
    height: heightPercentageToDP(31),
    backgroundColor: Constants.white,
    borderRadius: 6,
    alignSelf: 'center',
    marginHorizontal: widthPercentageToDP(2),
    marginTop: heightPercentageToDP(1),
  },
  buttonImage: {
    height: scaledSize(16),
    width: scaledSize(16),
    marginRight: 10,
    resizeMode: 'contain',
  },
  firstCardButtonStyle: {
    height: heightPercentageToDP(4.3), 
    width: widthPercentageToDP(23),
    borderRadius: 4,
    backgroundColor: Constants.primaryColor,
    marginTop: heightPercentageToDP(1.8),
    marginLeft: widthPercentageToDP(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareWhatsappButton: {
    backgroundColor: '#1ad741', 
    alignItems:'center',
    flexDirection: 'row',
    borderRadius: 5,
    marginHorizontal: widthPercentageToDP(3.3),
    marginBottom: heightPercentageToDP(1.8),
    padding: heightPercentageToDP(1),
    justifyContent: 'center'
  },
  supportBtn: {
    backgroundColor: Constants.primaryColor,
    flex: 0.45,
    height: 44,
    color: Constants.primaryColor,
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 6,
    elevation: 5,
    justifyContent: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: heightPercentageToDP(4.3),
  },
  secondCardButtonStyle: {
    height: heightPercentageToDP(4.3), 
    width: widthPercentageToDP(23),
    borderRadius: 4,
    backgroundColor: Constants.primaryColor,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  upperSectionView: {
    borderBottomWidth: 1, 
    borderColor: '#dcdcdc', 
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    backgroundColor: '#f7f7f7'
  },
  descriptionView: {
    top: heightPercentageToDP(3),
    marginHorizontal: heightPercentageToDP(3),
    padding: heightPercentageToDP(1),
    paddingHorizontal: heightPercentageToDP(2),
    //width: widthPercentageToDP(87),
    borderRadius: 7,
    alignSelf: 'center',
  },
  reviewContent: {
    width: widthPercentageToDP(91),
    height: heightPercentageToDP(31),
    marginHorizontal: widthPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
    backgroundColor: Constants.white,
    borderRadius: 6,
    alignSelf: 'center',
  },
  playStoreCard: {
    width: widthPercentageToDP(95),
    backgroundColor: Constants.white,
    borderRadius: 6,
    alignSelf: 'center',
    marginBottom: heightPercentageToDP(3),
  },
  recommendedFlatlistView: {
    width: widthPercentageToDP(42),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendedCard: {
    width: widthPercentageToDP(91),
    height: heightPercentageToDP(31),
    backgroundColor: Constants.white,
    borderRadius: 6,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginHorizontal: widthPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
  },
  textInputStyle: {
    borderColor: '#eaeaea',
    borderWidth: 1,
    borderRadius: 5,
    width: widthPercentageToDP(57),
    height: heightPercentageToDP(14),
  },
  mainContainer: {
    height: heightPercentageToDP(1),
    marginVertical: heightPercentageToDP(2),
    flexDirection: 'row',
  },
  tagsContainer: {
    margin: heightPercentageToDP(1),
    alignItems: 'center',
  },
  dataContainer: {
    marginBottom: heightPercentageToDP(0.4),
    marginHorizontal: widthPercentageToDP(3.3),
  },
  dataHeading: {
    height: heightPercentageToDP(3.5),
    justifyContent: 'center',
    padding: heightPercentageToDP(3),
    alignSelf: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(65),
    borderTopLeftRadius: scaledSize(5),
    borderTopRightRadius: scaledSize(5),
  },
  shareData: {
    flexDirection: 'row',
    height: heightPercentageToDP(6),
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(80),
  },
  textStyle: {
    fontSize: scaledSize(16),
    flexWrap: 'wrap',
    fontFamily: Fonts.roboto,
  },
  behind: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    borderRadius: scaledSize(5),
  },
});

const mapStateToProps = state => ({
  userPreferences: state.login.userPreferences,
  groupSummary: state.groupSummary,
  language: state.home.language,
});
const mapDispatchToProps = dispatch => ({
  dispatch,
  setFeedBack: (feedBackPayload, isFeedBackShare) => {
    dispatch(SetFeedBack(feedBackPayload, isFeedBackShare));
  },
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
  onChangeField: (key,value) => {
    dispatch(changeField(key,value));
  },
  onGetRewards: (getCashback, getCoins, getScratchDetails ,history,page, size) => {
    dispatch(getRewards(getCashback, getCoins, getScratchDetails ,history,page, size));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CustomerFeedBack),
);
