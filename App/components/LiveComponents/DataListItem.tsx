import React, {memo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Colors, Fonts} from '../../../assets/global';
import {Rating} from 'react-native-elements';
import LinearGradientButton from '../Button/LinearGradientButton';
import {
    scaledSize,
    heightPercentageToDP,
    widthPercentageToDP,
  } from '../../utils';
import {getProfileMarkerLabel, getLastDigit, dummyRating} from '../../native/pages/utils';
import Button from '../Button/Button';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {AppText} from '../Texts';
import {ListImageBG} from '../ListImageBG/ListImageBG';
import {Constants} from '../../styles';
import idx from 'idx';
import DataEndListItem from './DataEndListItem';

const DataListItem = ({
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
  isHorizontal,
  heightDP,
  isCommmunityRelevance
  }) => {

  
  const checkOutOfStock = idx(item, _ => _.offerinvocations.checkOutOfStock);
  let {ratings} = item;
  let ratingValue = ratings && ratings.rating ? ratings.rating : dummyRating[getLastDigit(item.id)]
  let totalRating = ratings && ratings.totalRating ? ratings.totalRating : getLastDigit(item.id);
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
      <View style={[isHorizontal ? styles.horizontalDatalistContainer : isCommmunityRelevance ? styles.datalistCommunityContainer : styles.datalistContainer]}>
        
            <View style={[ isHorizontal ? styles.listHorizontalImageBgStyle : styles.listImageBgStyle]}>
                
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

                {isCommmunityRelevance ? (
                    <View style={styles.behindCommunity}>
                    <LinearGradientButton
            dontShowRemainingStockValue={true}
            isCommmunityRelevance={isCommmunityRelevance}
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
            selectedSize={12}
            offerId={item.parentId || item.id}
            screenName={page}
            cartButton={true}
            outOfStockTextStyle={{fontSize: 14}}
            viewStyle={{
              height: scaledSize(27),
              alignItems: 'center',
              justifyContent: 'center'
            }}
            titleStyle={[{color: 'white'}]}
            colors={['#fdc001', '#fd7400']}
            title={t('+')}
            onPress={onPress}
          />
          </View>
                ) : null
                }

              <View style={styles.behind}>
              
                {
                  (!isCommmunityRelevance && item && item.offerinvocations && (item.offerinvocations.offerPrice === 0))
                  ?
                  <AppText style={[styles.markerWraper,{borderTopColor: '#fa6400'}]}
                      white
                      bold
                      size="XXS">
                      {t('Free Gift')}
                  </AppText>
                  :                  
                  (!isCommmunityRelevance && marker && profileMarker)
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
        <View style={isHorizontal ? {marginVertical: heightPercentageToDP(2), justifyContent: 'space-between'} : {}}>
        <View style={[styles.container, isHorizontal ? styles.horizontalContainer : {},
          {height: heightPercentageToDP(11)}
        ]}>

            <View style={ isHorizontal ? styles.upperHorizontalContainer : styles.upperContainer  }>
              <Button onPress={onPress}>

                <View style={styles.innerView}>
                  {
                    (isVideo && !isHorizontal)
                    ?
                    <Image
                      resizeMethod = {'resize'}
                      resizeMode = {'contain'}
                      style={[
                        {width: heightPercentageToDP(5), height: heightPercentageToDP(5)},
                      ]}
                      source={{uri: item.mediaJson.square}}
                    /> : null
                  }
                  <View style={[
                    isVideo ? {} : {height: heightPercentageToDP(5),justifyContent:'center'},
                    ]}>
                    <AppText
                        size={isHorizontal ? 'S': 'XXS'}
                        textProps={numberOfLinesEntity || {numberOfLines: isHorizontal ? 1 : 2}}
                        style={[styles.textStyle,
                        {width:(isVideo ? heightPercentageToDP(10) : heightPercentageToDP(15)),
                        marginLeft:widthPercentageToDP(1),
                        marginRight:widthPercentageToDP(1)},
                        ]}>
                        {t(item.mediaJson.title.text)}
                    </AppText>

                  
                    <View style={[
                      {flexDirection: 'row'},
                      isVideo ? { marginVertical: heightPercentageToDP(0.3)} : {
                         marginTop: heightPercentageToDP(1)}
                      ]}>
                    <Rating
                    count={5}
                    imageSize={isVideo ? 11 : 14}
                    ratingColor={'#dda50b'}
                    readonly
                    startingValue={ratingValue}
                    fractions="{1}" 
                  />
            <View style={{marginLeft: widthPercentageToDP(1.5)}}>
              <AppText bold style={isVideo ? {fontSize: 9} :{fontSize: 12}}>{t(`${ratingValue}`)}<AppText style={[{color: '#A9A9A9'},isVideo ? {fontSize: 9} :{fontSize: 12}]}>{totalRating == 0 ? ` (10)` : t(` (${totalRating})`)}</AppText></AppText>
            </View>
                    </View>
                    <View style={[styles.innerView,{marginLeft:widthPercentageToDP(1), alignItems: 'center'}
                  ]}>
                        {
                            item.offerinvocations ? (
                            <AppText bold greenishBlue size={isHorizontal ? 'S': 'XS'}>
                                {'\u20B9' + item.offerinvocations.offerPrice}
                            </AppText>
                            ) : null
                        }
                            
                        {
                            item.offerinvocations ? (
                            <AppText grey size={isHorizontal ? 'S': 'XS'} style={{textDecorationLine: 'line-through',marginLeft:scaledSize(10)}}>
                                {'\u20B9' + item.offerinvocations.price || 0}
                            </AppText>
                            ) : null
                        }
                    </View>

                  </View>

                </View>
              </Button>
            </View>


            
              {!isCommmunityRelevance && checkOutOfStock &&
                stockValue > 0 &&
                stockValue < 100 ? (
                  <View 
                  style={isHorizontal ? styles.lowerHorizontalContainer : styles.lowerContainer}>
                    <AppText warning bold style={[{textAlign: 'center'},
                    isHorizontal ? {fontSize:scaledSize(9)} :
                    {fontSize:scaledSize(6)},
                    ]}>
                      {t('Hurry Up, Only #STOCKVALUE# left', {
                        STOCKVALUE: stockValue,
                      })}
                    </AppText>
                  </View>
              ) : null}
            

        </View>

        {!isCommmunityRelevance ? (
        
          <LinearGradientButton
            dontShowRemainingStockValue={true}
            isCommmunityRelevance={isCommmunityRelevance}
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
            screenName={page}
            cartButton={true}
            btnStyles={[styles.butttonStyles, isHorizontal ? {height: heightPercentageToDP(4)} : {}]}
            outOfStockTextStyle={{fontSize: 14}}
            viewStyle={isHorizontal ?  {
              width: widthPercentageToDP(28.3), 
            }: {}}
            titleStyle={[{color: 'white'}, isHorizontal ? { fontSize: 12} : {}]}
            colors={['#fdc001', '#fd7400']}
            title={t('ADD')}
            onPress={onPress}
          />
       ) : null}
              </View>
      </View>

      {
        (showViewAll)
        ?
        <DataEndListItem t={t} endItemPress={endItemPress} isHorizontal={isHorizontal} isCommmunityRelevance={isCommmunityRelevance}/>
        :
        null
      }
      

    </View>
  );
};

const styles = StyleSheet.create({
  upperContainer:{flex:0.85,justifyContent:'center',alignItems:'center'},
  upperHorizontalContainer:{
    flex:0.85,
    justifyContent:'center',
    alignItems:'center',
    marginTop: heightPercentageToDP(1)
  },
  lowerContainer:{flex:0.15,justifyContent:'center',alignItems:'center', paddingBottom: heightPercentageToDP(0.5)},
  lowerHorizontalContainer:{
    // justifyContent:'center',
    // alignItems:'center', 
    marginTop: heightPercentageToDP(1.5)
  },
  horizontalContainer:{
    borderColor: Constants.liveItemBorder,
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    borderLeftWidth:0.5,
    borderRightWidth:0.5,
    borderTopWidth:0.5,
    marginLeft: widthPercentageToDP(1),
  },
  datalistContainer: {
    justifyContent:'center',
    height:heightPercentageToDP(35.5),
    width:heightPercentageToDP(20), 
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingHorizontal: heightPercentageToDP(1),
    marginHorizontal:widthPercentageToDP(0.8)
  },
  datalistCommunityContainer: {
    justifyContent:'center',
    height:heightPercentageToDP(30),
    width:heightPercentageToDP(20), 
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingHorizontal: heightPercentageToDP(1),
    marginHorizontal:widthPercentageToDP(0.8)
  },
  butttonStyles: {
    flexDirection: 'row',
    height:heightPercentageToDP(5)
  },
  horizontalDatalistContainer: {
    justifyContent: 'space-between',
    height:heightPercentageToDP(18),
    width:heightPercentageToDP(36), 
    flexDirection: 'row',
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
    flexDirection: 'row',
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    borderColor: Constants.liveItemBorder,
   borderWidth:0.5
  },
  listHorizontalImageBgStyle:{
    height:heightPercentageToDP(13),
    width:heightPercentageToDP(13),
    marginTop: heightPercentageToDP(2),
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
    //alignItems: 'center',
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
  behindCommunity: {
    alignItems: 'flex-end',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height:'100%',
   // backgroundColor: 'red',
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
  }
});

const mapStateToProps = state => ({
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(DataListItem))
);