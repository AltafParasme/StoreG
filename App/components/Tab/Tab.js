/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {SvgUri} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import Button from '../Button/Button';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import {Fonts} from '../../../assets/global';
import {withTranslation} from 'react-i18next';
import {AppText} from '../Texts';

class Tab extends PureComponent {
  //Added for scroll after update the Categories
  componentDidUpdate = (prevProps, prevState) => {
    let index = this.props.data.findIndex(
      item => item.slug === this.props.active
    );

    if (this.props.active === 'hot-deals') {
      this.scroll.scrollTo({x: 0, animated: true});
    } else {
      this.scrollToRow(index);
    }
  };

  scrollToRow(itemIndex) {
    setTimeout(() => {
      this.scroll &&
        this.scroll.scrollTo({
          x: (itemIndex - 1) * scaledSize(70),
          animated: true,
        });
    }, 300);
  }

  render() {
    const {
      myref,
      tabStyle,
      onTabPress,
      active,
      containerStyle,
      data,
      activeStyle,
      isiconWithName,
      isOnlyText = true,
      activeFontStyle,
      inActive,
      iconStyle,
      activeIconStyle,
      textStyle,
      scrollEnabled,
      activeTabColor,
      t,
    } = this.props;
    return (
      <View ref={myref} style={[styles.container, containerStyle]}>
        <ScrollView
          ref={node => (this.scroll = node)}
          contentContainerStyle={{alignItems: 'center'}}
          style={{height: heightPercentageToDP(6)}}
          horizontal
          scrollEnabled={scrollEnabled}
          showsHorizontalScrollIndicator={false}>
          {data &&
            data.map((value, index) => {
              const activeItem =
                active && active !== null && active === value.slug;
              return (
                <Button
                  ref={this.itemRef}
                  key={value + index}
                  styleContainer={[
                    {
                      height: heightPercentageToDP(6),
                    },
                  ]}
                  onPress={() => {
                    onTabPress(value);
                    // this.scrollToRow(index);
                    // this.scroll.scrollTo({x: index * scaledSize(70)});
                  }}>
                  <View
                    style={[
                      styles.tabStyle,
                      tabStyle,
                      activeItem ? activeStyle : [styles.inActive, inActive],
                    ]}>
                    {!isiconWithName && isOnlyText && (
                      <AppText
                        size="S"
                        style={[
                          styles.fontStyle,
                          textStyle,
                          activeItem ? activeFontStyle : {},
                        ]}>
                        {t(value.name)}
                      </AppText>
                    )}
                    {isiconWithName && (
                      <View style={styles.tabView}>
                        {/* <Image
                          source={value.iconUrl}
                          style={[
                            styles.imageStyle,
                            iconStyle,
                            active && active == value.name
                              ? activeIconStyle
                              : {},
                          ]}
                        /> */}
                        {value.iconUrl && value.iconUrl.indexOf('svg') >= 0 ? (
                          <SvgUri
                            uri={value.iconUrl}
                            fill={activeItem ? activeTabColor : 'black'}
                            style={[
                              styles.imageStyle,
                              iconStyle,
                              activeItem ? activeIconStyle : {},
                            ]}
                            width={25}
                            height={25}
                          />
                        ) : null}
                        <AppText
                          numberOfLines={1}
                          style={[
                            styles.fontStyle,
                            textStyle,
                            activeItem ? activeFontStyle : {},
                          ]}>
                          {t(value.name)}
                        </AppText>
                      </View>
                    )}
                  </View>
                </Button>
              );
            })}
        </ScrollView>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP(6),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabStyle: {
    height: heightPercentageToDP(6),
    width: widthPercentageToDP(22),
    // marginHorizontal: widthPercentageToDP(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: '#37A437',
  },
  inActive: {
    backgroundColor: '#fff',
  },
  fontStyle: {
    fontSize: scaledSize(14),
    color: 'black',
    fontFamily: Fonts.roboto,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  tabView: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginHorizontal: 2,
  },
  imageStyle: {
    height: scaledSize(33),
    width: scaledSize(33),
    opacity: 0.5,
    marginBottom: 3,
  },
});

Tab.defaultProps = {
  onTabPress: () => {},
  active: '',
  hitSlop: 10,
};

export default withTranslation()(Tab);
