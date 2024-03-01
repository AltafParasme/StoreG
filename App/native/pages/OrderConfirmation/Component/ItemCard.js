import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {scaledSize} from '../../../../utils';
import {Colors, Fonts} from '../../../../../assets/global';
import ListItem from './ListItem';
import {withTranslation} from 'react-i18next';
import NavigationService from '../../../../utils/NavigationService';
import {LogFBEvent, Events} from '../../../../Events';
import {AppText} from '../../../../components/Texts';

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    // marginTop: scaledSize(1),
    width: '100%',
    maxHeight: height - 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  separatorStyle: {
    color: Colors.tomato,
  },
  totalView: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.white,
    justifyContent: 'center',
    // borderWidth: 1,
  },
  totalInnerView: {
    borderWidth: 0.5,
    justifyContent: 'center',
    height: scaledSize(55),
    width: '50%',
    alignItems: 'center',
    borderColor: Colors.mutedBorder,
  },
  totalText: {
    fontSize: scaledSize(15),
    color: Colors.darkBlack,
    fontWeight: '800',
    width: scaledSize(100),
    fontFamily: Fonts.roboto,
    textAlign: 'center',
  },
  savingText: {
    fontSize: scaledSize(15),
    color: Colors.blue,
    fontWeight: '800',
    width: scaledSize(100),
    fontFamily: Fonts.roboto,
    textAlign: 'center',
  },
  mainLineView: {
    height: scaledSize(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineView: {
    borderWidth: 0.5,
    height: scaledSize(30),
    borderColor: Colors.mutedBorder,
  },
});

const ItemCard = ({
  targetReached,
  fgStatus,
  items,
  selfItem,
  t,
  isTransparent,
  deliveryDate,
}) => {
  return (
    <View style={styles.container}>
      {items &&
        items.map((item, index) => {
          const name = item.userName ? item.userName : item.phoneNumber;
          if (!item.isSelf)
            return (
              <ListItem
                //date={'SUN, 29 SEP'}
                key={index}
                name={name}
                item={item.items}
                amount={item.offerAmount}
                targetReached={targetReached}
                saved={item.potentialSaving}
                deliveryDate={deliveryDate}
              />
            );
        })}
    </View>
  );
};

export default withTranslation()(ItemCard);
