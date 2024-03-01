import React, {PureComponent} from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {View, StyleSheet, TouchableOpacity, BackHandler} from 'react-native';
import {AppText} from '../../../components/Texts';
import {Icon, Header} from 'react-native-elements';
import idx from 'idx';
import {getRewards} from './actions';
import {changeField} from '../Login/actions';
import CoinRewards from './components/CoinRewards';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import CashbackRewards from './components/CashbackRewards';
import { LogFBEvent, Events} from '../../../Events';
import { Constants } from '../../../styles';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../../utils';
import NavigationService from '../../../utils/NavigationService';

const initialLayout = {width: widthPercentageToDP(80)};
class MyRewards extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          index: 
          props.navigation.getParam('actionId')
           ? props.navigation.getParam('actionId') === 'coins' 
            ? 0 
            : 1
          : 1,
          routes: [
            {key: 'first', title: props.t('Coins')},
            {key: 'second', title: props.t('Cashbacks')},
          ],
      }
      this.renderTabBar = this.renderTabBar.bind(this);
      this.renderTabBarItem = this.renderTabBarItem.bind(this);
      this.FirstRoute = this.FirstRoute.bind(this);
      this.SecondRoute = this.SecondRoute.bind(this);
    }
  

    componentWillMount = () => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick,
      );
    }

  componentDidMount() {
    if(!this.props.isLoggedIn) {
      this.props.onChangeField('loginInitiatedFrom', 'MyRewards');
      NavigationService.navigate('Login');
    }  
    else {  
      this.props.onGetRewards(true, true, false, false, null, null);
      this._unsubscribe = this.props.navigation.addListener('willFocus', () => {
        let rewardType = this.props.navigation.getParam('actionId')
        if (rewardType) {
          this.setState({
            index: rewardType === 'coins' ? 0 : 1
          })
          this.props.navigation.setParams({actionId: null });
        }
      });
    }
  }


  componentWillUnmount() {
    if(this.props.isLoggedIn)
      this._unsubscribe.remove();
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );  
  }

  handleBackButtonClick() {
    NavigationService.goBack();
    return true;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const coinsUsed = idx(this.props.cart, _ => _.billing.coinsUsed);
    const coinsUsednextProps = idx(nextProps.cart, _ => _.billing.coinsUsed);
    if ((this.state.index !== nextState.index || this.props.rewards !== nextProps.rewards || coinsUsed !== coinsUsednextProps)) {
      return true;
    }
    if(this.props.isLoggedIn != nextProps.isLoggedIn)
      return true;
    return false;
  }
  
  FirstRoute = () => <CoinRewards navigation={this.props.navigation}/>;
  SecondRoute = () => <CashbackRewards navigation={this.props.navigation}/> ;
  
  renderTabBarItem = props => {

    const {t,cart,rewards} = this.props;

    const coinsBalance = idx(rewards, _ => _.totalBalance.coinsBalance);
    const coinsUsed = idx(cart, _ => _.billing.coinsUsed);
    const rewardsBalance = idx(rewards, _ => _.totalBalance.rewardsBalance);
  
    let coinsIhave = undefined;
    if(coinsBalance && coinsUsed){
      coinsIhave = coinsBalance-coinsUsed;
    } else if(coinsBalance){
      coinsIhave = coinsBalance;
    }

    let isActiveTab = true;
    if (typeof this.state.index == 'number') {
      isActiveTab =
        props.route.title === this.state.routes[this.state.index].title;
    }
    const backgroundColor = isActiveTab
      ? Constants.white
      : Constants.primaryColor;
    const color = isActiveTab ? Constants.primaryColor : Constants.white;
    return (
      <TouchableOpacity {...props} style={{width: widthPercentageToDP(34)}}>
        <View
          style={[
            props.style,
            {backgroundColor: backgroundColor, paddingVertical: 5},
          ]}>
          <AppText style={[styles.centerAlign, {color: color}]}>
            {``}
          </AppText>
          <AppText style={[styles.centerAlign, {color: color}]}>
            {props.route.title}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={null}
      indicatorContainerStyle={{height: 0, width: 0}}
      style={{
        backgroundColor: Constants.primaryColor,
        padding: heightPercentageToDP(6),
        paddingLeft: widthPercentageToDP(16),
        paddingVertical: heightPercentageToDP(2),
      }}
      tabStyle={{borderWidth: 2, borderColor: Constants.white, flex: 1}}
      renderTabBarItem={this.renderTabBarItem}
      //onTabPress={this.onChange}
      inactiveColor={Constants.white}
      pressColor={Constants.primaryColor}
      activeColor={Constants.primaryColor}
    />
  );

  renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
  });

  setIndex = tab => {
    this.setState({
      index: tab,
    });
  };

  onPressLogin = () => {
    LogFBEvent(Events.LOGIN_TO_CONTINUE, {
      screen: 'MyRewards',
    });
    NavigationService.navigate('Login');
  }

  render() {
      const {t,cart,rewards, isLoggedIn} = this.props;
      if(!isLoggedIn) {
        return (
          <TouchableOpacity
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={this.onPressLogin}>
            <AppText size="XXL" bold black>
              {t('Kindly login to continue')}
            </AppText>
            <AppText style={styles.buttonLogin} size="L" bold greenishBlue>
              {t(' Press here ')}
            </AppText>
        </TouchableOpacity>
        )
      }
        
      const coinsBalance = idx(rewards, _ => _.totalBalance.coinsBalance);
      const coinsUsed = idx(cart, _ => _.billing.coinsUsed);
      const rewardsBalance = idx(rewards, _ => _.totalBalance.rewardsBalance);
    
      let coinsIhave = undefined;
      if(coinsBalance && coinsUsed){
        coinsIhave = coinsBalance-coinsUsed;
      } else if(coinsBalance){
        coinsIhave = coinsBalance;
      }
    return (
    <View style={{flex: 1}}>
        <View style={styles.headerView}>
           <View style={{marginTop: heightPercentageToDP(4)}}>
                <AppText bold white style={{
                    textAlign: 'center', 
                    paddingBottom: heightPercentageToDP(2)}}>{t('MY REWARDS')}</AppText>
            </View>
        </View>
        <View style={{ flexDirection: 'row', zIndex: 3,elevation: 3, position: 'absolute', top: '11%', left: '16%', right: '25%'}}>
          <View style={{ width: widthPercentageToDP(34)}}>
            <AppText style={[styles.centerAlign, {color: this.state.index == 0 ? Constants.primaryColor: Constants.white}]}>
              {coinsIhave}
            </AppText>
          </View>
          <View style={{ width: widthPercentageToDP(34)}}>
            <AppText style={[styles.centerAlign, {color: this.state.index == 1 ? Constants.primaryColor: Constants.white}]}>
              {rewardsBalance}
            </AppText>
          </View>
        </View>
        <TabView
          renderTabBar={this.renderTabBar}
          navigationState={{index: this.state.index, routes: this.state.routes}}
          renderScene={this.renderScene}
          onIndexChange={this.setIndex}
          initialLayout={initialLayout}
          swipeEnabled={false}
          lazy
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    centerAlign: {
        textAlign: 'center',
      },
      buttonStyle: {
        justifyContent: 'center',  
        borderWidth: 1, 
        width: widthPercentageToDP(28),
        height: heightPercentageToDP(5.9),
        borderColor: Constants.white
      },
      buttonViewStyle: {
        alignSelf: 'center',
        flexDirection: 'row',  
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Constants.white
      },
      headerView: {
        backgroundColor: Constants.primaryColor, 
        height: heightPercentageToDP(7.5),
        alignItems: 'center',
        paddingBottom: heightPercentageToDP(1.2),
      },
      buttonLogin:{
        height: heightPercentageToDP(5),
        lineHeight: heightPercentageToDP(5),
        textAlign: 'center',
        alignSelf: 'center',
        borderRadius: scaledSize(6),
        borderWidth: scaledSize(1),
        borderColor: Constants.greenishBlue,
      },
});



const mapStateToProps = state => ({
    rewards: state.rewards.rewards,
    cart: state.home.cart,
    isLoggedIn: state.login.isLoggedIn,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
    onGetRewards: (getCashback, getCoins, getScratchDetails ,history,page, size) => {
      dispatch(getRewards(getCashback, getCoins, getScratchDetails ,history,page, size));
    },
    onChangeField: (fieldName: string, value: any) => {
      dispatch(changeField(fieldName, value));
    }
  });

export default withTranslation()(
    connect(mapStateToProps, mapDipatchToProps)(MyRewards),
  );