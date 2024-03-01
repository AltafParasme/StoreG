import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import Button from '../../../../components/Button/Button';
import {Colors, Fonts} from '../../../../../assets/global';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';
import {AppText} from '../../../../components/Texts';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import NavigationService from '../../../../utils/NavigationService';
import {LogFBEvent, Events} from '../../../../Events';
import {Images} from '../../../../../assets/images';

const TagComponentBase = ({
  activeCategoryTab,
  valueItem,
  t,
  isEntity,
  entityType,
  screen,
}) => {
  let value = valueItem.name || valueItem.item;
  let urlString = value.replace(' & ', '_').replace(/ /g, '_');
  return (
    <Button
      ref={this.itemRef}
      key={valueItem.index}
      styleContainer={{
        height: heightPercentageToDP(10),
        marginTop: widthPercentageToDP(3),
      }}
      onPress={() => {
        if (!isEntity) {
          NavigationService.navigate('TagsItems', {
            tags: value,
            activeCategoryTab: activeCategoryTab,
            screen: screen,
          });
          if (screen == 'search') {
            LogFBEvent(Events.SEARCH_SUB_CATEGORY_CLICK, {
              category: activeCategoryTab,
              tags: value,
            });
          } else {
            LogFBEvent(Events.HOME_SUB_CATEGORY_CLICK, {
              category: activeCategoryTab,
              tags: value,
            });
          }
        } else {
          LogFBEvent(Events.ENTITYDETAILS_SUB_CATEGORY_CLICK, {
            category: entityType,
            tags: value,
          });
        }
      }}>
      <View style={[styles.tabStyle]}>
        <View style={styles.tabTagView}>
          <Image
            source={{
              uri: `https://cdn.shopg.in/icon/tags/${urlString.toLowerCase()}.png`,
            }}
            style={[styles.imageStyle, styles.iconStyle]}
          />
        </View>
        <AppText
          textProps={{numberOfLines: 1}}
          size="XXS"
          style={styles.textStyle}>
          {t(value)}
        </AppText>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  tabStyle: {
    flexDirection: 'column',
    flex: 1.8,
    height: scaledSize(60),
    width: scaledSize(90),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabTagView: {
    height: scaledSize(60),
    width: scaledSize(60),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffecde',
    borderRadius: 20,
  },
  imageStyle: {
    height: scaledSize(50),
    width: scaledSize(50),
    marginTop: widthPercentageToDP(1),
  },
  iconStyle: {
    height: heightPercentageToDP(7),
    resizeMode: 'contain',
  },
  textStyle: {
    color: '#000',
    alignContent: 'center',
    textAlign: 'center',
  },
  offIconstyle: {
    width: widthPercentageToDP(21),
    height: heightPercentageToDP(7),
    resizeMode: 'contain',
  },
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const TagComponent = connect(null, mapDispatchToProps)(TagComponentBase);
export default React.memo(withTranslation()(TagComponent));
