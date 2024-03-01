import React, {PureComponent, Component} from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {AppText} from '../../../../components/Texts';
import {SvgUri} from 'react-native-svg';
import {withTranslation} from 'react-i18next';
import EarnCashback from './EarnCashback';
import ClaimCashback from './ClaimCashback';
import CashbackHistory from './CashbackHistory';
import {Icon, Header} from 'react-native-elements';
import {widthPercentageToDP, heightPercentageToDP} from '../../../../utils';
import {Constants} from '../../../../styles';

const initialLayout = {width: widthPercentageToDP(500)};

class CashbackRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {key: 'first', title: props.t('Earn Cashback')},
        {key: 'second', title: props.t('Claim Cashback')},
        {key: 'third', title: props.t('Cashback History')},
      ],
    };
    this.FirstRoute = this.FirstRoute.bind(this);
    this.SecondRoute = this.SecondRoute.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
    this.renderTabBar = this.renderTabBar.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    let actionId = this.props.navigation.getParam('actionId')
    if(actionId && actionId=='claimCashBack'){
      setTimeout(() => {
        this.setState({index:1})
      }, 500);
    }
  }

  FirstRoute = () => <EarnCashback navigation={this.props.navigation} />;
  SecondRoute = () => <ClaimCashback navigation={this.props.navigation} />;
  ThirdRoute = () => <CashbackHistory navigation={this.props.navigation} />;

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

  // renderScene = SceneMap({
  //   first: this.FirstRoute,
  //   second: this.SecondRoute,
  //   third: this.ThirdRoute,
  // });

  renderScene = ({route}) => {
    switch (true) {
      case route.key == 'first':
        return <EarnCashback navigation={this.props.navigation} />;
      case route.key == 'second':  
        return <ClaimCashback navigation={this.props.navigation} />;
      case route.key == 'third':  
        return <CashbackHistory navigation={this.props.navigation} />; 
      default:
        return null;
    }
  };

  renderLabel = ({route}) => (
    <AppText
      bold
      size="XS"
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
          initialLayout={initialLayout}
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

export default withTranslation()(CashbackRewards);
