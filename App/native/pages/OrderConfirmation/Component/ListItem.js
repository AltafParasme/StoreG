import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import moment from 'moment';
import {Images} from '../../../../../assets/images/index';
import {Colors, Fonts} from '../../../../../assets/global';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../components/Texts';
import {Constants} from '../../../../styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  ImageView: {
    flex: 0.85,
    flexDirection: 'column',
    alignItems: 'center',
  },
  userNameText: {
    // color: Colors.white,
    fontFamily: Fonts.roboto,
  },
  imageStyle: {
    height: 35,
    width: 35,
    flex: 0.15,
    resizeMode: 'contain',
    marginRight: 10,
  },
  dateText: {
    fontSize: scaledSize(12),
    // color: Colors.white,
    fontFamily: Fonts.roboto,
    opacity: 0.8,
  },
  innerText: {fontWeight: 'normal'},
  savedMainView: {
    flex: 0.4,
    justifyContent: 'center',
    textAlign: 'center',
  },
  savedView: {
    height: scaledSize(30),
    borderRadius: 5,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedText: {
    color: Colors.blue,
    padding: 5,
    marginLeft: scaledSize(70),
  },
});

const ListItem = ({
  targetReached,
  date,
  image,
  name,
  amount,
  item,
  saved,
  t,
  key,
  deliveryDate,
}) => {
  const orderStatus = targetReached ? 'Order Complete' : 'Order Not Complete';
  const formattedDeliveryDate = moment
    .unix(deliveryDate / 1000)
    .format('DD-MM-YYYY');
  return (
    <View key={key} style={styles.container}>
      <Image source={image ? image : Images.user} style={styles.imageStyle} />
      <View style={styles.ImageView}>
        <View>
          <AppText size="S" style={styles.userNameText}>
            {t(name)}
            <AppText size="S" style={styles.innerText}>
              {' '}
              {t('added #ITEM# products', {ITEM: item})}
            </AppText>
          </AppText>
          <View style={{flexDirection: 'row'}}>
            <AppText size="XS" style={styles.savedText}>
              {t('(Saved ₹#SAVE#)', {SAVE: saved})}
            </AppText>
            <AppText size="XS" style={styles.savedText}>
              {t('Amount #AMOUNT# ', {AMOUNT: amount})}
            </AppText>
          </View>
          {!!date ? <Text style={styles.dateText}>{date}</Text> : null}
        </View>
      </View>
      {/* <View style={styles.savedMainView}>
        <View style={styles.savedView}>
          <AppText
            bold
            white
            size="XXS"
            textProps={{numberOfLines: 1}}
            style={{
              flexWrap: 'wrap',
              alignSelf: 'flex-end',
              textAlign: 'center',
              backgroundColor:
                orderStatus === 'Order Not Complete'
                  ? Colors.pink
                  : Constants.primaryColor,
              padding: widthPercentageToDP(1),
            }}>
            {orderStatus}
          </AppText>
        </View>
      </View> */}
    </View>
  );
};

export default withTranslation()(ListItem);
