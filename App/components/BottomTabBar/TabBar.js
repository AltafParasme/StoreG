import React from 'react';
import {Animated, View, TouchableOpacity, StyleSheet} from 'react-native';
import {heightPercentageToDP} from '../../utils';

const S = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: heightPercentageToDP(8),
    elevation: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  tabButton: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

const TabBar = ({
  renderIcon,
  activeTintColor,
  inactiveTintColor,
  onTabPress,
  onTabLongPress,
  getAccessibilityLabel,
  navigation,
}) => {
  const {routes, index: activeRouteIndex} = navigation.state;
  return (
    <Animated.View
      style={[
        S.container,
        {
          transform: [
            {
              translateY:
                routes[0].params && !activeRouteIndex
                  ? routes[0].params.animatedValue || 0
                  : 0,
            },
          ],
        },
      ]}>
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
        return (
          <TouchableOpacity
            key={routeIndex}
            style={S.tabButton}
            onPress={() => {
              onTabPress({route});
              // Uncomment below code to always take user to hot-deals
              // routes[0].params &&
              //   !activeRouteIndex &&
              //   routes[0].params.changeTab({slug: 'hot-deals'});
            }}
            onLongPress={() => {
              onTabLongPress({route});
              // Uncomment below code to always take user to hot-deals
              // routes[0].params &&
              //   !activeRouteIndex &&
              //   routes[0].params.changeTab({slug: 'hot-deals'});
            }}
            accessibilityLabel={getAccessibilityLabel({route})}>
            {renderIcon({route, focused: isRouteActive, tintColor})}

            {/* <Text>{getLabelText({ route })}</Text> */}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

export default TabBar;
