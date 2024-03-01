import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import YouTube from 'react-native-youtube';
import { AppText } from '../../../components/Texts';
import {scaledSize,heightPercentageToDP,widthPercentageToDP} from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import {Icon, Header} from 'react-native-elements';
import {Constants} from '../../../styles';
import LinearGradientButton from '../../../components/Button/LinearGradientButton';
import {ListImageBG} from '../../../components/ListImageBG/ListImageBG';
import ViewMoreText from 'react-native-view-more-text';
import Video from 'react-native-video';
import NavigationService from '../../../utils/NavigationService';
import {shareToWhatsAppCLTasks, showToastr} from '../utils';
import {processTextAndAppendElipsis} from '../../../utils/misc';
import {buildLink} from '../utils';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {LogFBEvent, Events} from '../../../Events';
import { AppConstants } from '../../../Constants';

const youtubeVideos = ['Xfvl9ZQAwpU', 'L5XhsnzYEN4', 'UPvYv-YiaRk', 'QiRXMBoEyHs', 'jkwSYJkEhrE', 's29hT3qYlBk', 'EuWEm1AaImg', 'td0y7OUreC8'];

export class YoutubeListItem extends Component {

  constructor(props) {
    super();
    this.state = {startVideo: false, height: heightPercentageToDP(71)};
  }

//   static getDerivedStateFromProps(nextProps, prevState){
//     if(nextProps.listIndex===nextProps.activeIndex){
//       return { startVideo: true};
//    }
//    else {
//     return { startVideo: false};
//    }
//  }

//   toggleVideo = () => {
//     this.setState({startVideo: !this.state.startVideo});
//   }

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

  closeWindow = () => {
    NavigationService.goBack();
  }

  videoError = e => {
    console.log('11-> e', e);
  };

  onBuffer = () => {
    console.log('14-> onBuffer');
  };

  onError = (e) => {
      this.setState({

      })
  }
  

  whatsappPress = async () => {
    const {t,item,groupSummary} = this.props;

    const inviteToken = groupSummary.groupDetails.info.inviteToken;
    const offerPrice = item.offerinvocations.offerPrice;
    let shareMsg = '';
    let {description, name, offerinvocations} = item;
    const {offerId, price} = offerinvocations;
    const saving = price - offerPrice;
    const descToShare = processTextAndAppendElipsis(description, 50);

    const url = await buildLink(inviteToken, offerId);

    shareMsg = t(
      'Hi Friends, I found this awesome product with a great offer.#NL##NL#*#NAME#*#NL##NL##DESCRIPTION##NL#MRP ~₹#PRICE#~ ₹#OFFERPRICE#, *Saving ₹#SAVING#*#NL##NL##URL##NL##NL#*Hurry up and order now*☝️☝️#NL#*Limited stock only*',
      {
        URL: url,
        NAME: name,
        PRICE: price,
        OFFERPRICE: offerPrice,
        SAVING: saving,
        DESCRIPTION: descToShare,
        NL: '\n',
      },
    );

    // Code to share image
    const fs = RNFetchBlob.fs;
    let imagePath = item.mediaJson.square;
    if (imagePath) {
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', imagePath)
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
                  message: shareMsg,
                  url: `data:image/png;base64,${base64Data}`,
                  social: Share.Social.WHATSAPP,
                  filename: 'test',
                };
                try {
                  Share.shareSingle(shareOptions);
                } catch (error) {
                  LogFBEvent(Events.SHARE_FAILURE, null);
                  console.error(error);
                }
              }
            },
          );
          return fs.unlink(imagePath);
        });
    }
  }

  componentDidMount() {
  }

  render() {
    const {t,item,hasCart,totalCartItems,listLength,listIndex,liveLoading, index} = this.props;
    const {startVideo} = this.state;

    const mediaJson = item.mediaJson;
    let isVideo = (mediaJson && mediaJson.localisedVideo && mediaJson.localisedVideo.length) ? true : false;

    return (
        <View style={styles.componentContainer}>
            <View style={styles.behind}>
              {
                <YouTube
                    apiKey={AppConstants.youtubeAPIKey}
                    videoId={youtubeVideos[index]}
                    play // control playback of video with true/false
                    inline // control whether the video should play in fullscreen or inline
                    loop // control whether the video should loop when ended
                    rel={false}
                    showinfo={false}
                    controls={0}
                    modestbranding={true}
                    onReady  = {this.handleReady}
                    onChangeState={e => this.setState({ status: e.state })}
                    onChangeQuality={e => this.setState({ quality: e.quality })}
                    onError={e => this.onError(e.error)}
                    style={{ alignSelf: 'stretch', height: this.state.height, backgroundColor: 'black', marginVertical: 10 }}
                  />
              }
            </View>
            {
              <LinearGradient colors={['black','transparent','transparent','transparent','black','black']} style={styles.front}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.behind}
                onPress={this.toggleVideo}>
                  <View style = {styles.frontUpper}>
                    <View style = {styles.frontUpperUpper}>
                        <TouchableOpacity
                          style={styles.frontUpperUpperLeft}
                          onPress={this.closeWindow}>
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
                            {t(item.mediaJson.title.text)}
                          </AppText>
                        </ViewMoreText>


                        </View>

                        <View style = {styles.frontUpperUpperRight} />

                    </View>

                    <View style = {styles.frontUpperLower} />

                  </View>
                  <View style = {styles.frontLower}>
                    <View style={styles.frontLowerUpper}>
                      <View style={styles.cartContainer}>
                        {
                          (hasCart && totalCartItems && totalCartItems > 0)
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
                      <View style={[styles.cartContainer,{paddingRight:widthPercentageToDP(10),marginTop:heightPercentageToDP(2)}]}>
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
                      </View>

                    </View>

                    <View style={styles.frontLowerLower}>

                      <View style={styles.bottomTextBox}>

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
                          </View>

                          <View style={{flexDirection:'row',height:heightPercentageToDP(6)}}>
                            <View style={{flex:1,justifyContent:'center'}}>
                              <View style={{flexDirection:'row',alignItems:'center'}}>
                                <AppText bold greenishBlue size='XS'>
                                  {'\u20B9' + item.offerinvocations.offerPrice}
                                </AppText>


                                <AppText white size='XS' style={{textDecorationLine: 'line-through',marginLeft:widthPercentageToDP(2)}}>
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
                                      backgroundColor: Constants.primaryColor,
                                      borderColor: 'transparent',
                                      borderWidth:0.5,
                                      borderRadius:5,
                                      height:heightPercentageToDP(5)
                                    }}
                                  titleStyle={{color: 'white'}}
                                  colors={[Constants.primaryColor,Constants.primaryColor]}
                                  title={t('ADD')}
                                  onPress={()=>{}}
                                />
                              </View>
                            </View>
                          </View>
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
                            (listLength != (listIndex+1))
                            ?
                            <View style={{justifyContent:'center',alignItems:'center'}}>
                              <AppText white size="XS">
                                {t('Scroll & see more products')}
                              </AppText>                              
                            </View>
                            :
                            <View style={styles.emptyStyle} />
                          }

                          {
                            (listLength != (listIndex+1))
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
                  </View>
                </TouchableOpacity>
            </LinearGradient>
            }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  componentContainer: {
    height:heightPercentageToDP(100),
    width:(heightPercentageToDP(100)*9)/16,
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
    width: '100%',
    height:'100%',
  },
  behind:{
    flex:1,
    width: '100%', 
    height: '100%'
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
  },
  frontUpperLower:{
    flex:0.8,
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
    width:'95%',
    height:heightPercentageToDP(6),
    alignItems:'flex-end',
  },
  cartBox:{
    width:'30%',
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
  }
});

const mapStateToProps = state => ({
  cart: state.home.cart,
  hasCart: state.home.hasCart,
  totalCartItems: state.home.totalCartItems,
  groupSummary: state.groupSummary,
  liveLoading: state.ShopgLive.liveLoading,
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(YoutubeListItem)
);