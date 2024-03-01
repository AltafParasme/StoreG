import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {scaledSize, heightPercentageToDP, widthPercentageToDP} from '../../../../utils';
import {Images} from '../../../../../assets/images';
import {AppText} from '../../../../components/Texts';
import LinearGradientButton from '../../../../components/Button/LinearGradientButton';
import {Colors, Fonts} from '../../../../../assets/global';
import Tag from '../../../../components/Tag/Tag';

export class SearchItem extends Component {
  render() {
    const {t, showText, onPress, type, image, item, onAddTocart} = this.props;
    const cellHeight =
      type == 'search' ? heightPercentageToDP(12) : heightPercentageToDP(5);
    const imageUrl = image ? image : Images.searchBasic;
    const imageHeight = image ? scaledSize(60) : scaledSize(12);
    if (type == 'search') {
      if (!item) return null;
      return (
        <View
          style={[
            styles.container,
            {
              height: cellHeight,
              marginHorizontal: scaledSize(6),
              marginTop: scaledSize(6),
            },
          ]}>
          <Image
            source={imageUrl}
            style={[
              styles.imageStyle,
              {width: imageHeight, height: imageHeight},
            ]}
          />
          <TouchableOpacity style={styles.middleView} onPress={onPress}>
            <AppText grey size="S">
              {t(showText)}
            </AppText>

            <View style={styles.mainTagView}>
              <Tag
                title={'Buy with friend'}
                strikeThru={false}
                price={item.offerPrice}
                textColor={Colors.blue}
                titleStyle={{fontWeight: 'bold'}}
                priceStyle={{fontWeight: 'bold'}}
                size="XS"
                t={t}
                isGroupScreen={true}
              />
              <View style={styles.priceTag}>
              <Tag
                title={'MRP'}
                strikeThru={true}
                price={item.price}
                textColor={Colors.priceColor}
                t={t}
                size="XS"
                titleStyle={{marginLeft: 1}}
                isGroupScreen={true}
              />
              </View>
            </View>
          </TouchableOpacity>
          <View style={[styles.rightView, {height: cellHeight}]}>
            <LinearGradientButton
              offerId={item.entityId}
              item={item}
              cartButton={true}
              btnStyles={{
                flexDirection: 'row',
              }}
              titleStyle={styles.buttonTitleStyle}
              isBoderOnly={true}
              colors={['#fdc001', '#fd7400']}
              title={t('ADD')}
              screenName="Search"
              onAddTocart={onAddTocart}
              doNotShowQuantityText={true}
            />
          </View>
        </View>
      );
    }
    if (showText == '') return null;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, {height: cellHeight}]}>
          <Image
            source={imageUrl}
            style={[
              styles.imageStyle,
              {width: imageHeight, height: imageHeight},
            ]}
          />
          <AppText
            grey
            size="S"
            style={{flex: 1, paddingRight: scaledSize(10)}}>
            {' '}
            {t(showText)}{' '}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    //backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    marginHorizontal: scaledSize(5),
  },
  middleView: {
    justifyContent: 'center',
    flex: 0.7,
  },
  rightView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.3,
  },
  buttonTitleStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  mainTagView: {
    flexDirection: 'row',
  },
  priceTag: {
    marginLeft: widthPercentageToDP(1)
  }
});
