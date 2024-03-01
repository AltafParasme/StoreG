import React from 'react';
import {View, StyleSheet} from 'react-native';
import Tab from '../../../../components/Tab/Tab';
import {Colors, Fonts} from '../../../../../assets/global';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';

const Styles = StyleSheet.create({
  containerStyle: {
    height: heightPercentageToDP(6),
    backgroundColor: '#fff',
  },
  activeStyle: {
    borderStyle: 'solid',
    borderBottomWidth: 3,
    borderBottomColor: Colors.orange,
  },
  activeIconStyle: {
    opacity: 1,
  },
  textStyle: {
    color: '#000',
    fontFamily: Fonts.roboto,
  },
  activeFontStyle: {
    color: Colors.orange,
    fontSize: scaledSize(12),
    fontWeight: '500',
    fontFamily: Fonts.roboto,
    //paddingHorizontal: widthPercentageToDP(2),
  },
  iconStyle: {
    height: 25,
    // width: 10,
    resizeMode: 'contain',
  },
});

const TabComponent = ({setActiveTabs, activeCategoryTab, data, fgStatus}) => {
  // if (
  //   fgStatus &&
  //   fgStatus === 'REPEAT' &&
  //   data &&
  //   data.length > 0 &&
  //   data[0].slug === 'free-gift'
  // ) {
  //   data.shift();
  // }
  return (
    <View style={{marginBottom: 1}}>
      <Tab
        key={'ProfileTab'}
        // ref={this.myPickRef}
        onTabPress={setActiveTabs}
        activeStyle={Styles.activeStyle}
        activeIconStyle={Styles.activeIconStyle}
        textStyle={Styles.textStyle}
        activeFontStyle={Styles.activeFontStyle}
        containerStyle={Styles.containerStyle}
        active={activeCategoryTab}
        iconStyle={Styles.iconStyle}
        data={data}
        activeTabColor={Colors.orange}
        isTriangleView={true}
      />
    </View>
  );
};
export default React.memo(TabComponent);
