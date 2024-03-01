import React, {Component, memo} from 'react';
import {StyleSheet, Animated, View, Text} from 'react-native';
import {
  scaledSize,
  AppWindow,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {AppText} from '../../../../components/Texts';
import AddressList from './AddressList';
import AddressFormContainer from '../form/AddressFormContainer';
import {Constants} from '../../../../styles';
import {connect} from 'react-redux';

const initialLayout = {width: widthPercentageToDP(100)};

class AddressTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: this.props.address.length
        ? [
            {key: 'first', title: props.t('Select Address')},
            {key: 'second', title: props.t('New Address')},
          ]
        : [{key: 'second', title: props.t('New Address')}],
    };
    this.FirstRoute = this.FirstRoute.bind(this);
    this.SecondRoute = this.SecondRoute.bind(this);
    this.renderTabBar = this.renderTabBar.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addAddressButton = React.createRef();
  }

  // const AddressTab = ({address, onChangeTab, onUpdateAddress, t, scrollToEnd, ref}) => {

  // onUpdateAddress
  //   ? ref.current &&
  //     ref.current &&
  //     ref.current.wrappedInstance.onUpdateAddress()
  //   : null;

  renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: Constants.primaryColor}}
      style={{backgroundColor: 'white'}}
      inactiveColor={Constants.grey}
      pressColor={Constants.primaryColor}
      activeColor={Constants.primaryColor}
    />
  );

  FirstRoute = () => (
    <View style={[styles.scene]}>
      <AddressList
        payableAmount={this.props.payableAmount}
        amountNeeded={this.props.amountNeeded}
      />
    </View>
  );

  SecondRoute = () => (
    <View style={[styles.scene]}>
      <AddressFormContainer
        scrollToEnd={this.props.scrollToEnd}
        t={this.props.t}
        parentComp={this.props.parentComp}
        ref={this.addAddressButton}
      />
    </View>
  );

  renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
  });

  onChange = tab => {
    this.props.onChangeTab(tab);
    this.setState({
      index: tab,
    });
  };

  render() {
    return (
      <TabView
        navigationState={{index: this.state.index, routes: this.state.routes}}
        renderScene={this.renderScene}
        onIndexChange={this.onChange}
        initialLayout={initialLayout}
        renderTabBar={this.renderTabBar}
      />
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  sceneFirst: {
    height: heightPercentageToDP(70),
  },
});

const mapStateToProps = state => ({
  address: state.booking.address,
});

export default connect(mapStateToProps, null, null, {
  withRef: true,
})(AddressTab);
