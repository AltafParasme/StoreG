import React, {PureComponent, Component} from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {AppText} from '../../../../components/Texts';
import EarnCoins from './EarnCoins';
import ClaimCoins from './ClaimCoins';
import {SvgUri} from 'react-native-svg';
import {withTranslation} from 'react-i18next';
import CoinHistory from './CoinHistory';
import {Icon, Header} from 'react-native-elements';
import {widthPercentageToDP, heightPercentageToDP} from '../../../../utils';
import {Constants} from '../../../../styles';

const initialLayout = {width: widthPercentageToDP(70)};

class CoinRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {key: 'first', title: props.t('Earn Coins')},
        {key: 'second', title: props.t('Claim Coins')},
        {key: 'third', title: props.t('Coin history')},
      ],
    };
    this.FirstRoute = this.FirstRoute.bind(this);
    this.SecondRoute = this.SecondRoute.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
    this.renderTabBar = this.renderTabBar.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  shouldComponentUpdate(nextProps, nextState) {
    return true; 
  }

  FirstRoute = () => <EarnCoins navigation={this.props.navigation} />;
  SecondRoute = () => <ClaimCoins navigation={this.props.navigation} />;
  ThirdRoute = () => <CoinHistory navigation={this.props.navigation} />;

  renderTabBar = props => (
    <TabBar
      {...props}
      renderLabel={this.renderLabel}
      indicatorStyle={{backgroundColor: Constants.orange}}
      style={styles.renderTabBarStyle}
      inactiveColor={Constants.grey}
      pressColor={Constants.orange}
      activeColor={Constants.orange}
    />
  );

  onChange = tab => {
    this.setState({
      index: tab,
    });
  };

  renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
    third: this.ThirdRoute,
  });

  renderLabel = ({route}) => (
    <AppText
      bold
      style={[
        route.key ===
        (this.state.routes[this.state.index] &&
          this.state.routes[this.state.index].key)
          ? {color: Constants.orange}
          : {},
      ]}>
      {route.title}
    </AppText>
  );

  render() {
    return (
      <View style={{flex: 1}}>
        <TabView
          navigationState={{
            index: this.state.index,
            routes: this.state.routes,
          }}
          renderScene={this.renderScene}
          onIndexChange={this.onChange}
          renderTabBar={this.renderTabBar}
          swipeEnabled={false}
          lazy
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  renderTabBarStyle: {
    backgroundColor: Constants.white,
    width: widthPercentageToDP(100),
  },
});

export default withTranslation()(CoinRewards);
