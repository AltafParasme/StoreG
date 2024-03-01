/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {changeField} from './App/native/pages/Login/actions';
import {View, ActivityIndicator} from 'react-native';
//import codePush from 'react-native-code-push';
import {Provider} from 'react-redux';
import {useScreens} from 'react-native-screens';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {withTranslation} from 'react-i18next';
import TabBar from './App/components/BottomTabBar/TabBar.js';
import Sentry from '@sentry/react-native';

import {
  Splash,
  Login,
  Booking,
  ConfirmBooking,
  MegaSale,
  Home,
  FreeGift,
  OrderConfirmation,
  PastOrders,
  Rewards,
  UserProfile,
  EditUserProfile,
  ReturnPolicy,
  ForceUpdate,
  AddressPincode,
  TagsItems,
  OrderDetail,
  Search,
  CartDetail,
  ShippingList,
  ShipmentDetails,
  CLOnboarding,
  MyOrderCheckout,
  CLBusiness,
  MyRewards,
  QRContainer,
  ViewQrCode,
  ImageView,
  AddressForm,
  CLAccount,
  VerticleVideoList,
  ScratchCardList,
  AuthLoadingScreen,
  LocationScreen,
  Community,
  PostDetails,
} from './App/native';
import FullScreenLoader from './App/components/Loaders';
import store from './App/state/store';
import NavigationService from './App/utils/NavigationService';
import i18n from './i18n';
import {setApplicationLang, getDefaultLanguage, heightPercentageToDP} from './App/utils/';
import {Constants} from './App/styles';
import {SetShopGFBaseParams} from './App/Events';
import {Images} from './assets/images';
import {LogFBEvent, Events} from './App/Events';
import {Image, StatusBar, Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import NetModal from './App/components/NetModal/NetModal.js';
import Config from 'react-native-config';
import {AppText} from './App/components/Texts';
import idx from 'idx';

const APP_ENVIRONMENT = Config.NODE_ENV || 'production';

console.disableYellowBox = true;

if (!__DEV__) {
  Sentry.config('https://fc61f6c473ed45e2b96c217fb3a9950b@sentry.io/1759152', {
    name: 'ShopG_Android',
    environment: APP_ENVIRONMENT,
  }).install();
}

useScreens();

const UserProfileStack = createStackNavigator(
  {
    UserProfile: {
      screen: UserProfile,
    },
    EditUserProfile: {
      screen: EditUserProfile,
    },
  },
  {
    headerMode: 'none',
  },
);

const TabScreenNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({screenProps}) => ({
        title: 'Home',
        tabBarIcon: ({focused, tintColor}) => {
          if (focused)
            return (icon = (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={Images.homeColored}
                  style={{width: 25, height: 25}}
                />
                <AppText bold secondaryColor size="XS">
                  {screenProps(`Home`)}
                </AppText>
              </View>
            ));
          else
            return (icon = (
              <View style={{alignItems: 'center'}}>
                <Image source={Images.home} style={{width: 25, height: 25}} />
                <AppText bold black size="XS">
                  {screenProps(`Home`)}
                </AppText>
              </View>
            ));
        },
        tabBarOnPress: ({navigation, defaultHandler}) => {
          let parentNavigation = navigation.dangerouslyGetParent();
          let prevRoute =
            parentNavigation &&
            parentNavigation.state.routes[parentNavigation.state.index];
          if (prevRoute && prevRoute.routeName === 'OrderConfirmation')
            navigation.setParams({actionId: 'hot-deals'});
          LogFBEvent(Events.BOTTOM_NAVIGATION_BAR_HOME_CLICK, null);
          defaultHandler();
        },
      }),
    },
    Search: {
      screen: Search,
      navigationOptions: ({screenProps}) => ({
        title: screenProps('Search'),
        tabBarIcon: ({focused, tintColor}) => {
          if (focused)
            return (icon = (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={Images.searchColored}
                  style={{width: 25, height: 25}}
                />
                <AppText bold secondaryColor size="XS">
                  {screenProps(`Search`)}
                </AppText>
              </View>
            ));
          else
            return (icon = (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={Images.searchBasic}
                  style={{width: 25, height: 25}}
                />
                <AppText bold black size="XS">
                  {screenProps(`Search`)}
                </AppText>
              </View>
            ));
        },
        tabBarOnPress: ({navigation, defaultHandler}) => {
          LogFBEvent(Events.BOTTOM_NAVIGATION_BAR_SEARCH_CLICK, null);
          defaultHandler();
        },
      }),
    },
    MyRewards: {
      screen: MyRewards,
      navigationOptions: ({screenProps}) => ({
        title: screenProps('My Rewards'),
        tabBarIcon: ({focused, tintColor}) => {
          if (focused)
            return (icon = (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={Images.my_rewards_selected}
                  style={{width: 25, height: 25}}
                />
                <AppText bold secondaryColor size="XS">
                  {screenProps(`My Rewards`)}
                </AppText>
              </View>
            ));
          else
            return (icon = (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={Images.my_rewards_unselected}
                  style={{width: 25, height: 25 }}
                />
                <AppText bold black size="XS">
                  {screenProps(`My Rewards`)}
                </AppText>
              </View>
            ));
        },
        tabBarOnPress: ({defaultHandler}) => {
          LogFBEvent(Events.BOTTOM_NAVIGATION_BAR_GROUP_DEALS_CLICK, null);
          defaultHandler();
        },
      }),
    },
    MyOrderBusinessCheckout: {
      screen: MyOrderCheckout,
      navigationOptions: ({screenProps}) => ({
        title: screenProps('Past Orders'),
        tabBarIcon: ({focused, tintColor}) => {
          let {login} = store.getState();
          let displayText = 'My Orders';
          const userMode = idx(login, _ => _.userPreferences.userMode);
          if (userMode === 'CL') {
            displayText = 'Business';
          }
  
          if (focused)
            return (icon = (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={userMode === 'CL' ? Images.businessTabSelected: Images.myOrdersSelected}
                  style={{width: 25, height: 25}}
                />
                <AppText bold secondaryColor size="XS">
                  {screenProps(displayText)}
                </AppText>
              </View>
            ));
          else
            return (icon = (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={userMode === 'CL' ? Images.businessTab: Images.myOrders}
                  style={{width: 25, height: 25}}
                />
                <AppText bold black size="XS">
                  {screenProps(displayText)}
                </AppText>
              </View>
            ));
        },
        tabBarOnPress: ({defaultHandler}) => {
          LogFBEvent(Events.BOTTOM_NAVIGATION_BAR_MY_ORDERS_CLICK, null);
          defaultHandler();
        },
      }),
    },
    UserProfile: {
      screen: UserProfileStack,
      navigationOptions: ({screenProps}) => ({
        title: screenProps('Me'),
        tabBarIcon: ({focused, tintColor}) => {
          if (focused)
            return (icon = (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={Images.profileColored}
                  style={{width: 25, height: 25}}
                />
                <AppText bold secondaryColor size="XS">
                  {screenProps(`Me`)}
                </AppText>
              </View>
            ));
          else
            return (icon = (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={Images.profile}
                  style={{width: 25, height: 25}}
                />
                <AppText bold black size="XS">
                  {screenProps(`Me`)}
                </AppText>
              </View>
            ));
        },
        tabBarOnPress: ({defaultHandler}) => {
          LogFBEvent(Events.BOTTOM_NAVIGATION_BAR_USER_SETTING_CLICK, null);
          defaultHandler();
        },
      }),
    }
  },
  {
    tabBarComponent: props => {
      return <TabBar {...props} />;
    },
    tabBarOptions: {
      showLabel: false,
      height: heightPercentageToDP(9),
      activeTintColor: Constants.secondaryColor,
    },
    //initialRouteName: 'Home',
  },
);

const MyAppNavigator = createStackNavigator(
  {
    Location: {
      screen: LocationScreen,
    },
    Tab: {
      screen: TabScreenNavigator,
    },
    // Splash: {
    //   screen: Splash,
    // },
    Booking: {
      screen: Booking,
    },
    TagsItems: {
      screen: TagsItems,
    },
    Login: {
      screen: Login,
      // navigationOptions:{tabBarVisible: false} // to hide navigationoptions on a particular screen
    },
    Community: {
      screen: Community,
    },
    PostDetails: {
      screen: PostDetails,
    }, 
    ConfirmBooking: {
      screen: ConfirmBooking,
    },
    MegaSale: {
      screen: MegaSale,
    },
    MyOrderCheckout: {
      screen: MyOrderCheckout,
    },
    OrderConfirmation: {
      screen: OrderConfirmation,
    },
    PastOrders: {
      screen: PastOrders,
    },
    Rewards: {
      screen: Rewards,
    },
    ReturnPolicy: {
      screen: ReturnPolicy,
    },
    ForceUpdate: {
      screen: ForceUpdate,
    },
    AddressForm: {
      screen: AddressForm,
    },
    AddressPincode: {
      screen: AddressPincode,
    },
    CLOnboarding: {
      screen: CLOnboarding,
    },
    OrderDetail: {
      screen: OrderDetail,
    },
    FreeGift: {
      screen: FreeGift,
    },
    CartDetail: {
      screen: CartDetail,
    },
    CLBusiness: {
      screen: CLBusiness,
    },
    ShippingList: {
      screen: ShippingList,
    },
    ShipmentDetails: {
      screen: ShipmentDetails,
    },
    QRContainer: {
      screen: QRContainer,
    },
    ViewQrCode: {
      screen: ViewQrCode,
    },
    ImageView: {
      screen: ImageView,
    },
    CLAccount: {
      screen: CLAccount,
    },
    VerticleVideoList: {
      screen: VerticleVideoList,
    },
    ScratchCardList: {
      screen: ScratchCardList,
    }
  },
  {
    headerMode: 'none',
    transitionConfig: () => ({
      screenInterpolator: sceneProps => {
        const {layout, position, scene} = sceneProps;
        const {index} = scene;
        const {initWidth} = layout;
        const translateX = position.interpolate({
          inputRange:  [index - 1, index, index + 1],
    outputRange: [initWidth, 0, 0],
        });
        return {transform: [{translateX}]};
      },
    }),
    initialRouteName: 'Location',
  }
);

const ProductStack = createStackNavigator(
  {
    Tab: {
      screen: TabScreenNavigator,
    },
    Splash: {
      screen: Splash,
    },
    Booking: {
      screen: Booking,
    },
    TagsItems: {
      screen: TagsItems,
    },
    Location: {
      screen: LocationScreen,
    },
    Login: {
      screen: Login,
      // navigationOptions:{tabBarVisible: false} // to hide navigationoptions on a particular screen
    },
    Community: {
      screen: Community,
    },
    PostDetails: {
      screen: PostDetails,
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Splash',
  },
);

const AuthStack = createStackNavigator(
  {
    Login: {
      screen: Login,
      // navigationOptions:{tabBarVisible: false} // to hide navigationoptions on a particular screen
    },
  },
  {
    headerMode: 'none',
  },
);

const LoadingStack = createStackNavigator(
  {
    Splash: {
      screen: Splash,
      // navigationOptions:{tabBarVisible: false} // to hide navigationoptions on a particular screen
    },
  },
  {
    headerMode: 'none',
  },
);

const MyApp = createAppContainer(
  createSwitchNavigator(
    {
      //ProductList: ProductStack,
      Loading: LoadingStack,
      App: MyAppNavigator,
      //Auth: AuthStack
    },
    {
      initialRouteName: 'Loading',
    }
  
  ),
);

class App extends React.Component {
  constructor(private router: Router) {
    super();
    this.setInitValues();
    this.state = {
      Connections: {isConnected: true, isInternetReachable: true},
      downloadProgress: null,
      syncInProgress: false,
      showDownloadingModal: false,
    };
  }
  static navigationOptions = {
    title: 'Welcome',
  };

  async componentDidMount() {
    this.checkInternet();
    const unsubscribe = NetInfo.addEventListener(this.handleConnectionChange);
    SetShopGFBaseParams(this.constructor.name);
  }

  componentWillUnmount() {}

  handleConnectionChange = (details: any) => {
    this.setState({
      Connections: details,
    });
  };

  setInitValues = () => {
    Promise.all([setApplicationLang()]).then(() => {
      try {
        getDefaultLanguage().then(lng => {
          store.dispatch({
            type: 'SET_LANGUAGE',
            payload: lng || 'english',
          });
          i18n.changeLanguage(lng || 'english');
        });
      } catch (e) {
        console.log('31-> Error', e);
      }
    });
  };

  checkInternet = () => {
    NetInfo.fetch().then(state => {
      this.setState({
        Connections: state,
      });
    });
  };

  render() {
    const {Connections} = this.state;
    const {t} = this.props;
    
    return (
      <Provider store={store}>
        <MyApp
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          screenProps={t}>
          <StatusBar backgroundColor="#fd7400" barStyle="light-content" />
          <NetModal
            tryAgain={this.checkInternet}
            visible={
              !Connections.isConnected || !Connections.isInternetReachable
            }
            Connections={Connections}
          />
          <FullScreenLoader />
        </MyApp>
      </Provider>
    );
  }
}

export default withTranslation()(App);
