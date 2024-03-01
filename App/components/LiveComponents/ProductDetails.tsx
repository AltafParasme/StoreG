import React, {memo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Share from 'react-native-share';
import {liveAnalytics} from '../../native/pages/ShopgLive/redux/actions';
import {Colors, Fonts} from '../../../assets/global';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../utils';
import {LogFBEvent, Events} from '../../Events';
import Button from '../Button/Button';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {AppText} from '../Texts';
import {ListImageBG} from '../ListImageBG/ListImageBG';
import {Constants} from '../../styles';
import idx from 'idx';
import DataEndListItem from './DataEndListItem';
import { Images } from '../../../assets/images';

const ProductDetails = ({
  item,
  t,
  onPress,
  numberOfLinesEntity,
  widgetId,
  category,
  position,
  page,
  shareMessage,
  widgetType,
  language,
  videoClick,
  userPref,
  onAnalytics
  }) => {
 
  const whatsappShare = (mssg) => {
    let eventProps =  {
      widgetId: widgetId,
      page: page,
      category: category,
      widgetType: widgetType,
      position: position,
      sharedBy: userPref && userPref.userMode,
    };
    let userPrefData = {
      userId: userPref && userPref.uid,
      sid: userPref && userPref.sid,
    };
    Share.isPackageInstalled('com.whatsapp').then(({isInstalled}: any) => {
      if (isInstalled) {
        const shareOptions = {
          title: 'Share via',
          message: mssg,
          social: Share.Social.WHATSAPP,
          filename: 'test',
        };
        try {
        Share.shareSingle(shareOptions);
         onAnalytics(Events.SHARE_WHATSAPP_SHOPG_LIVE_CLICK, eventProps, userPrefData);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  let isVideo = (item.mediaJson && item.mediaJson.localisedVideo && item.mediaJson.localisedVideo.length && item.mediaJson.localisedVideo[0].video) ? true : false;
  return (
    <View style={{flexDirection:'row'}}>
      <View style={styles.datalistContainer}>
            <View style={styles.listImageBgStyle}>
              <ListImageBG
                language={language}
                widgetId={widgetId}
                position={position}
                page={page}
                widgetType={widgetType}
                category={category}
                screen="shopgLive"
                imageStyle={{borderTopLeftRadius:5,borderTopRightRadius:5}}
                style={{height:'113%',width:'92%'}}
                item={item}
              />
            </View>
            
        <View style={styles.container}>

            <View style={styles.upperContainer}>
              <Button onPress={onPress}>

                <View style={styles.innerView}>
                  {
                    (isVideo)
                    ?
                    <Image
                      resizeMethod = {'resize'}
                      resizeMode = {'contain'}
                      style={{width: heightPercentageToDP(3), height: heightPercentageToDP(6)}}
                      source={{uri: item.mediaJson.square}}
                    /> : null
                  }
                  <View style={isVideo ? {} : {height: heightPercentageToDP(5),justifyContent:'center'}}>
                    <AppText
                        size={'XXS'}
                        textProps={numberOfLinesEntity || {numberOfLines: 2}}
                        style={[styles.textStyle,{width:(isVideo ? heightPercentageToDP(10) : heightPercentageToDP(15)),marginLeft:widthPercentageToDP(1),marginRight:widthPercentageToDP(1)}]}>
                        {t(item.mediaJson.title.text)}
                    </AppText>

                    <View style={[styles.innerView,{marginLeft:widthPercentageToDP(1)}]}>
                        {
                            item.offerinvocations ? (
                            <AppText bold greenishBlue size='XS'>
                                {'\u20B9' + item.offerinvocations.offerPrice}
                            </AppText>
                            ) : null
                        }
                            
                        {
                            item.offerinvocations ? (
                            <AppText grey size='XS' style={{textDecorationLine: 'line-through',marginLeft:scaledSize(10)}}>
                                {'\u20B9' + item.offerinvocations.price || 0}
                            </AppText>
                            ) : null
                        }
                    </View>

                  </View>

                </View>
              </Button>
            </View>

        </View>

        <View style={styles.buttonMainView}>
        <View style={styles.emptyContainer}></View>
         <TouchableOpacity 
         onPress={() => whatsappShare(shareMessage)}
         style={styles.buttonView}
         >
         <Image source={Images.whatsapp} style={styles.buttonImage} /> 
         <AppText white size='XS'>{t('SEND VIDEO')}</AppText>
         </TouchableOpacity>
        </View>

      </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  upperContainer:{flex:0.85,justifyContent:'center',alignItems:'center'},
  lowerContainer:{flex:0.15,justifyContent:'center',alignItems:'center', paddingBottom: heightPercentageToDP(0.5)},
  datalistContainer: {
    justifyContent:'center',
    height:heightPercentageToDP(31),
    width:heightPercentageToDP(19), 
    backgroundColor: Colors.white,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal:widthPercentageToDP(1)
  },
  emptyContainer: {
    width:'100%',
    height:heightPercentageToDP(1)
  },
  container: {
    height:heightPercentageToDP(8),
    width:heightPercentageToDP(15),
    paddingHorizontal:widthPercentageToDP(0.8),
    flexDirection: 'column',
    backgroundColor: Colors.white,
    borderColor: Constants.liveItemBorder,
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
    borderLeftWidth:0.5,
    borderRightWidth:0.5,
    borderBottomWidth:0.5
  },
  listImageBgStyle:{
    height:heightPercentageToDP(12),
    width:heightPercentageToDP(15),
    justifyContent: 'center', 
    alignItems: 'center',
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    borderColor: Constants.liveItemBorder,
    borderWidth:0.5
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
  buttonImage: {
    height: scaledSize(13),
    width: scaledSize(13),
    marginRight: 10,
    resizeMode: 'contain',
  },
  buttonView: {
    flexDirection: 'row', 
    padding: heightPercentageToDP(1),
    paddingHorizontal: widthPercentageToDP(3),
    borderRadius: 5,
    backgroundColor: Constants.primaryColor
  },
  innerView: {
    alignItems: 'center',
    flexDirection:'row',
  },
  textStyle: {
    flexWrap: 'wrap',
    fontFamily: Fonts.roboto,
    textAlign: 'left',
  },
  mainLineView: {
    height: scaledSize(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMainView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: widthPercentageToDP(3)
  },
});

const mapStateToProps = state => ({
  userPref: state.login.userPreferences,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(ProductDetails))
);