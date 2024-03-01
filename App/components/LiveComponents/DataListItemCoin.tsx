import React, {memo} from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {Colors, Fonts} from '../../../assets/global';
import {Images} from '../../../assets/images';
import LinearGradientButton from '../Button/LinearGradientButton';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../utils';
import {getProfileMarkerLabel} from '../../native/pages/utils';
import Button from '../Button/Button';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {AppText} from '../Texts';
import {ListImageBG} from '../ListImageBG/ListImageBG';
import {Constants} from '../../styles';
import idx from 'idx';
import DataEndListItem from './DataEndListItem';

const DataListItemCoin = ({
  item,
  t,
  onPress,
  entityType,
  numberOfLinesEntity,
  screenName,
  widgetId,
  category,
  position,
  page,
  widgetType,
  language,
  imageWidth,
  videoClick,
  showViewAll,
  endItemPress,
  rewards,
  cart
  }) => {
  const checkOutOfStock = idx(item, _ => _.offerinvocations.checkOutOfStock);
  const stockQuantity = idx(item, _ => _.offerinvocations.quantity);
  const stockQuantityPurchased = idx(
    item,
    _ => _.offerinvocations.purchasedQuantity
  );
  const stockValue = stockQuantity - stockQuantityPurchased;

  let isVideo = (item.mediaJson && item.mediaJson.localisedVideo && item.mediaJson.localisedVideo.length && item.mediaJson.localisedVideo[0].video) ? true : false;

  let profileMarker;
  let profileColor = '#fa6400';
  let marker = false;

  const coinsBalance = idx(rewards, _ => _.totalBalance.coinsBalance);
  const coinsUsed = idx(cart, _ => _.billing.coinsUsed);
  
  let coinsIhave = 0;
  if(coinsBalance && coinsUsed){
    coinsIhave = coinsBalance-coinsUsed;
  } else if(coinsBalance){
    coinsIhave = coinsBalance;
  }

  const coin = (item && item.unlockCoins && (parseInt(item.unlockCoins) > 0)) ? parseInt(item.unlockCoins) : null;

  if (item.marker && Object.keys(item.marker).length) {
    marker = true;
    profileMarker =
      item.marker.ProfileMarker &&
      getProfileMarkerLabel(item.marker.ProfileMarker[0].name);
    if (profileMarker === 'New Arrival') {
      profileColor = '#dda50b';
    } else if (profileMarker === 'Top Selling') {
      profileColor = '#ec3d5a';
    } else if (profileMarker === 'Trending') {
      profileColor = '#fa6400';
    }
  }

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
                  noVideoClick={onPress}
                  imageStyle={{borderTopLeftRadius:5,borderTopRightRadius:5}}
                  style={{height:'100%',width:'100%'}}
                  item={item}
                  videoClick={videoClick}
                />

              <View style={styles.behind}>
              
                {
                  (item && item.offerinvocations && (item.offerinvocations.offerPrice === 0))
                  ?
                  <AppText style={[styles.markerWraper,{borderTopColor:profileColor}]}
                      white
                      bold
                      size="XXS">
                      {t('Free Gift')}
                  </AppText>
                  :                  
                  (marker && profileMarker)
                  ?
                  <AppText style={[styles.markerWraper,{borderTopColor:profileColor}]}
                      white
                      bold
                      size="XXS">
                      {t(profileMarker)}
                  </AppText>
                  : null
                }
              </View>

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
                      style={{width: heightPercentageToDP(5), height: heightPercentageToDP(5)}}
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

                  </View>

                </View>
              </Button>
            </View>


            
              {checkOutOfStock &&
                stockValue > 0 &&
                stockValue < 100 ? (
                  <View style={styles.lowerContainer}>
                    <AppText warning bold style={{textAlign: 'center',fontSize:scaledSize(6)}}>
                      {t('Hurry Up, Only #STOCKVALUE# left', {
                        STOCKVALUE: stockValue,
                      })}
                    </AppText>
                  </View>
              ) : null}
            

        </View>
        {coin ? (
          <View
            style={{marginVertical: heightPercentageToDP(0.3), flexDirection: 'row',alignItems:'center'}}>
            <Image
              source={Images.coin}
              style={{
                height: scaledSize(16),
                width: scaledSize(16),
                top: heightPercentageToDP(0.3),
              }}
            />
            <View style={{marginLeft:widthPercentageToDP(1)}}>
              <AppText
                size='XXS'
                bold
                      style={{
                        color: '#fa6400',
                      }}>
                {t('FREE WITH')}
              </AppText>
              <AppText                     
                      style={{
                        color: '#fa6400',
                        letterSpacing:widthPercentageToDP(0.5)
                      }}
                      bold size='XS'>
                {t(`${coin} COINS`)}
              </AppText>
            </View>

          </View>
        ) : <View style={styles.noCoinView}/>}
        <View style={styles.buttonMainView}>
            <LinearGradientButton
              dontShowRemainingStockValue={true}
              QuantityCounterNoBorder={false}
              QuantityCounterHeight={heightPercentageToDP(3)}
              horizontalList={true}
              widgetId={widgetId}
              position={position}
              page={page}
              widgetType={widgetType}
              category={category}
              stockValue={stockValue}
              notQuantityText={true}
              checkOutOfStock={checkOutOfStock}
              entityType={entityType}
              item={item}
              offerId={item.parentId || item.id}
              screenName={screenName}
              cartButton={true}
              btnStyles={{
                  flexDirection: 'row',
                  backgroundColor: Constants.primaryColor,
                  borderColor: 'white',
                  borderWidth:0.5,
                  borderRadius:5,
                  height:heightPercentageToDP(5)
                }}
              titleStyle={{color: 'white'}}
              colors={[Constants.primaryColor,Constants.primaryColor]}
              title={t('ADD')}
              onPress={onPress}
              maxQuantity={1}
              currencyMode='coins'
              canBuyFromCoins={(coin && (coinsIhave > coin))}
            />
        </View>

      </View>

      {
        (showViewAll)
        ?
        <DataEndListItem t={t} endItemPress={endItemPress}/>
        :
        null
      }
      

    </View>
  );
};

const styles = StyleSheet.create({
  upperContainer:{flex:0.85,justifyContent:'center',alignItems:'center'},
  lowerContainer:{flex:0.15,justifyContent:'center',alignItems:'center', paddingBottom: heightPercentageToDP(0.5)},
  datalistContainer: {
    justifyContent:'center',
    height:heightPercentageToDP(37.5),
    width:heightPercentageToDP(20), 
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingHorizontal: heightPercentageToDP(1),
    marginHorizontal:widthPercentageToDP(0.8)
  },
  emptyContainer: {
    width:'100%',
    height:heightPercentageToDP(0.5)
  },
  container: {
    height:heightPercentageToDP(8),
    width:heightPercentageToDP(18),
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
    height:heightPercentageToDP(18),
    width:heightPercentageToDP(18),
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
  innerView: {
    alignItems: 'center',
    flexDirection:'row',
  },
  textStyle: {
    flexWrap: 'wrap',
    fontFamily: Fonts.roboto,
    textAlign: 'left',
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
  behind: {
    alignItems: 'flex-end',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height:'100%',
    borderRadius:scaledSize(5),
  },
  markerWraper:{

    position: 'absolute',
    bottom: heightPercentageToDP(1),
    top:0,
    right: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: widthPercentageToDP(6),
    borderTopWidth: widthPercentageToDP(6),
    paddingRight:widthPercentageToDP(1),
    borderTopRightRadius:5,
    borderLeftColor: 'transparent',
    textAlign:'right',
    textAlignVertical:'center'
    // borderTopColor: 'red',
  },
  noCoinView:{
    height:heightPercentageToDP(4.5),
    width:widthPercentageToDP(10)
  }
});

const mapStateToProps = state => ({
  rewards: state.rewards.rewards,
  cart: state.home.cart,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(DataListItemCoin))
);