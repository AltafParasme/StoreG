import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {Colors, Fonts} from '../../../../../assets/global';
import ListItem from './ListItem';
import {withTranslation} from 'react-i18next';
import NavigationService from '../../../../utils/NavigationService';
import {LogFBEvent, Events} from '../../../../Events';
import {AppText} from '../../../../components/Texts';

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dadada',
    alignSelf: 'center',
    width: widthPercentageToDP(76),
    justifyContent: 'center',
    paddingVertical: heightPercentageToDP(4),
  },
  freegiftheading: {
    textAlign: 'center',
  },
  productViewFree: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageView: {
    flex: 0.2,
  },
  image: {
    height: heightPercentageToDP(8),
    width: widthPercentageToDP(16),
    resizeMode: 'contain',
  },
});

const FreeGiftListComponent = ({freeItem, t}) => {
  return (
    <View style={styles.container}>
      <View>
        <AppText greenishBlue bold size="XS" style={styles.freegiftheading}>
          {t('You will also get FREE gift on sharing')}
        </AppText>
      </View>
      <View style={styles.productViewFree}>
        <View style={styles.imageView}>
          {freeItem.mediaJson && freeItem.mediaJson.mainImage ? (
            <Image
              source={{uri: freeItem.mediaJson.square}}
              style={styles.image}
            />
          ) : null}
        </View>
        <View
          style={{
            marginLeft: widthPercentageToDP(15),
            flexDirection: 'column',
          }}>
          <View>
            <AppText size="XS">{freeItem.mediaJson.title.text}</AppText>
          </View>
          <View
            style={{
              flexDirection: 'column',
              marginTop: widthPercentageToDP(2),
            }}>
            <AppText size="XS" greenishBlue bold textProps={{numberOfLines: 2}}>
              {t('FREE')}
            </AppText>
            <AppText
              style={{textDecorationLine: 'line-through', color: '#848484'}}>
              {freeItem.mrpamount}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default withTranslation()(FreeGiftListComponent);
