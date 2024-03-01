import React, {Component, memo} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {widthPercentageToDP, heightPercentageToDP} from '../../../utils';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {AppText} from '../../../components/Texts';
import MyShippingList from './component/MyShippingList';
import GroupShippingList from './component/GroupShippingList';
import {Constants} from '../../../styles';
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';

const initialLayout = {width: Dimensions.get('window').width};

class ShippingTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      routes: [
        {key: 'first', title: props.t('My Orders')},
        {key: 'second', title: props.t("Friend's orders")},
      ],
    };
    this.FirstRoute = this.FirstRoute.bind(this);
    this.SecondRoute = this.SecondRoute.bind(this);
    this.renderTabBar = this.renderTabBar.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  renderTabBarItem = props => {
    let isActiveTab = true;
    if (typeof this.state.index == 'number') {
      isActiveTab =
        props.route.title === this.state.routes[this.state.index].title;
    }
    const backgroundColor = isActiveTab
      ? Constants.greenishBlue
      : Constants.white;
    const color = isActiveTab ? Constants.white : Constants.greenishBlue;
    return (
      <TouchableOpacity {...props} style={{width: widthPercentageToDP(44)}}>
        <View
          style={[
            props.style,
            {backgroundColor: backgroundColor, paddingVertical: 5},
          ]}>
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
        backgroundColor: '#efefef',
        padding: widthPercentageToDP(6),
        paddingVertical: heightPercentageToDP(2),
      }}
      tabStyle={{borderWidth: 2, borderColor: Constants.greenishBlue, flex: 1}}
      renderTabBarItem={this.renderTabBarItem}
      //onTabPress={this.onChange}
      inactiveColor={Constants.white}
      pressColor={Constants.greenishBlue}
      activeColor={Constants.greenishBlue}
    />
  );

  FirstRoute = () => (
    <View style={[styles.scene]}>
      <MyShippingList />
    </View>
  );

  SecondRoute = () => (
    <View style={[styles.scene]}>
      <GroupShippingList />
    </View>
  );

  renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
  });

  onChange = tab => {
    this.setState({
      index: tab,
    });
  };

  render() {
    const {t} = this.props;
    return (
      <View style={{flex: 1}}>
        {/* <View style={{margin: heightPercentageToDP(1)}}>
          <View style={[styles.staticTable, {borderBottomWidth: 1}]}>
            <AppText size="S" bold>
              {t('Weekly Target')}
            </AppText>
            <AppText size="S" bold>
              {t('Minimum Qualifier')}
            </AppText>
            <AppText size="S" bold>
              {t('Commission')}
            </AppText>
          </View>
          <View
            style={[
              styles.staticTable,
              {paddingHorizontal: widthPercentageToDP(2)},
            ]}>
            <AppText style={styles.centerAlign} size="S">
              {t('₹ 5,000')}
            </AppText>
            <AppText
              style={[
                styles.centerAlign,
                {paddingLeft: widthPercentageToDP(2)},
              ]}
              size="S">
              {t('10 customers, #NL#min order Rs 300 #NL# per customer', {
                NL: '\n',
              })}
            </AppText>
            <AppText style={styles.centerAlign} size="S">
              {t('8%#NL#+5%(bonus)', {NL: '\n'})}
            </AppText>
          </View>
          <View
            style={[
              styles.staticTable,
              {paddingHorizontal: widthPercentageToDP(2)},
            ]}>
            <AppText style={styles.centerAlign} size="S">
              {t('₹ 10,000')}
            </AppText>
            <AppText
              style={[
                styles.centerAlign,
                {paddingLeft: widthPercentageToDP(2)},
              ]}
              size="S">
              {t('20 customers, #NL#min order Rs 300 #NL# per customer', {
                NL: '\n',
              })}
            </AppText>
            <AppText style={styles.centerAlign} size="S">
              {t('8%#NL#+8%(bonus)', {NL: '\n'})}
            </AppText>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <AppText size="S" bold style={{textAlign: 'center'}}>
              {t(
                `You need to meet the Target & Minimum Qualifier to be eligible for bonus`
              )}
            </AppText>
          </View>
          <View style={{ justifyContent: 'center', alignItems:'center'}}><AppText size="S" bold style={{ textAlign: 'center' }}>{t(`You need to meet the Target & Minimum Qualifier to be eligible for bonus`)}</AppText></View>
        </View> */}
        <TabView
          lazy
          navigationState={{index: this.state.index, routes: this.state.routes}}
          renderScene={this.renderScene}
          onIndexChange={this.onChange}
          swipeEnabled={false}
          renderTabBar={this.renderTabBar}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  staticTable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: heightPercentageToDP(0.5),
    borderColor: '#d6d7da',
  },
  sceneFirst: {
    height: heightPercentageToDP(70),
  },
  centerAlign: {
    textAlign: 'center',
  },
});

const mapStateToProps = state => ({
  address: state.booking.address,
});

export default connect(mapStateToProps, null, null, {
  withRef: true,
})(ShippingTabs);
