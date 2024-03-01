import React, {memo} from 'react';
import {
  View,
  Image,
  StyleSheet
} from 'react-native';
import {Colors, Fonts} from '../../../assets/global';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../utils';
import Button from '../Button/Button';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {AppText} from '../Texts';

const ProductReview = ({
  item,
  t,
  }) => {
  return (
    <View style={{flexDirection:'row', paddingVertical: heightPercentageToDP(1.5),  paddingHorizontal: widthPercentageToDP(3.3)}}>
      <View style={styles.datalistContainer}>
                <View style={styles.innerView}>
                    <Image
                      resizeMethod = {'resize'}
                      resizeMode = {'contain'}
                      style={{width: heightPercentageToDP(8), height: heightPercentageToDP(5), marginRight: widthPercentageToDP(2)}}
                      source={{uri: item && item.imageUrl}}
                    /> 
                  <View 
                  >
                    <AppText
                        textProps={{numberOfLines: 1}}
                        style={[styles.textStyle,{width: widthPercentageToDP(60), marginLeft:widthPercentageToDP(1),marginRight:widthPercentageToDP(1)}]}>
                        {t(item && item.productName && item.productName.text)}
                    </AppText>

                    <View style={[styles.innerView,{marginLeft:widthPercentageToDP(1)}]}>
                        {
                            item && item.offerPrice ? (
                            <AppText bold greenishBlue>
                                {'\u20B9' + item.offerPrice}
                            </AppText>
                            ) : null
                        }
                            
                        {
                            item && item.price ? (
                            <AppText grey style={{textDecorationLine: 'line-through',marginLeft:scaledSize(10)}}>
                                {'\u20B9' + item.price || 0}
                            </AppText>
                            ) : null
                        }
                    </View>
                  </View>
                </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  datalistContainer: {
    justifyContent:'center',
    marginHorizontal:widthPercentageToDP(0.8)
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
    fontFamily: Fonts.roboto,
  },
});
export default withTranslation()(
React.memo(ProductReview)
);